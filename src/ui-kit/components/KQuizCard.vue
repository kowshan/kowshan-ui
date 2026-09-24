<!-- KQuizCard.vue — quiz card with timer, options, feedback -->
<template>
    <div class="k-quiz">
        <!-- Header -->
        <div class="k-quiz-head">
            <div class="k-quiz-progress">
                <div class="k-quiz-progress-bar" :style="{ width: progressPct + '%' }" />
            </div>
            <div class="k-quiz-meta">
                <span class="k-quiz-qnum">سوال {{ current + 1 }} از {{ total }}</span>
                <span v-if="showTimer" class="k-quiz-timer" :class="{ 'is-warning': timeLeft <= 10 }">
                    <Clock :size="12" />
                    {{ timeLeft }}
                </span>
            </div>
        </div>

        <!-- Question -->
        <div class="k-quiz-body">
            <h3 class="k-quiz-question">{{ question }}</h3>
            <p v-if="description" class="k-quiz-desc">{{ description }}</p>

            <!-- Options -->
            <div class="k-quiz-options">
                <button
                    v-for="(opt, i) in options"
                    :key="i"
                    class="k-quiz-option"
                    :class="{
                        'is-selected': selected === i,
                        'is-correct': showAnswer && i === correctIndex,
                        'is-wrong': showAnswer && selected === i && i !== correctIndex,
                    }"
                    :disabled="showAnswer"
                    @click="selectOption(i)"
                >
                    <span class="k-quiz-option-letter">{{ letters[i] }}</span>
                    <span class="k-quiz-option-text">{{ opt }}</span>
                    <Check v-if="showAnswer && i === correctIndex" :size="16" class="k-quiz-option-icon" />
                    <X v-else-if="showAnswer && selected === i && i !== correctIndex" :size="16" class="k-quiz-option-icon" />
                </button>
            </div>

            <!-- Feedback -->
            <div v-if="showAnswer" class="k-quiz-feedback" :class="isCorrect ? 'is-correct' : 'is-wrong'">
                <component :is="isCorrect ? CheckCircle : XCircle" :size="18" />
                <span>{{ isCorrect ? 'آفرین! پاسخ صحیح' : 'متأسفانه اشتباه است' }}</span>
            </div>

            <!-- Explanation -->
            <div v-if="showAnswer && explanation" class="k-quiz-explanation">
                <Lightbulb :size="14" />
                <span>{{ explanation }}</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="k-quiz-foot">
            <div v-if="score != null" class="k-quiz-score">
                <span>امتیاز: </span>
                <span class="k-quiz-score-val">{{ score }}</span>
            </div>
            <button
                v-if="!showAnswer"
                class="k-quiz-submit"
                :disabled="selected === null"
                @click="submit"
            >
                تأیید
            </button>
            <button
                v-else
                class="k-quiz-next"
                @click="$emit('next')"
            >
                {{ current < total - 1 ? 'سوال بعدی' : 'پایان' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Clock, Check, X, CheckCircle, XCircle, Lightbulb } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    question: string
    description?: string
    options: string[]
    correctIndex: number
    current: number
    total: number
    showTimer?: boolean
    timerSeconds?: number
    explanation?: string
    score?: number
}>(), {
    showTimer: false,
    timerSeconds: 30,
})

const emit = defineEmits<{
    answer: [index: number, correct: boolean]
    next: []
    timeout: []
}>()

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

const selected = ref<number | null>(null)
const showAnswer = ref(false)
const timeLeft = ref(props.timerSeconds)
let timer: ReturnType<typeof setInterval> | null = null

const progressPct = computed(() => ((props.current + 1) / props.total) * 100)
const isCorrect = computed(() => selected.value === props.correctIndex)

const selectOption = (i: number) => {
    if (!showAnswer.value) selected.value = i
}

const submit = () => {
    if (selected.value === null) return
    showAnswer.value = true
    emit('answer', selected.value, isCorrect.value)
    if (timer) clearInterval(timer)
}

const startTimer = () => {
    if (!props.showTimer) return
    timeLeft.value = props.timerSeconds
    timer = setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
            clearInterval(timer!)
            showAnswer.value = true
            emit('timeout')
        }
    }, 1000)
}

watch(() => props.current, () => {
    selected.value = null
    showAnswer.value = false
    startTimer()
})

onMounted(() => startTimer())
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.k-quiz {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
    overflow: hidden;
    background: var(--k-bg, #fff);
}
.k-quiz-head {
    padding: 16px 20px 0;
}
.k-quiz-progress {
    height: 4px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 2px;
    margin-bottom: 12px;
    overflow: hidden;
}
.k-quiz-progress-bar {
    height: 100%;
    background: var(--k-primary, #1db954);
    border-radius: 2px;
    transition: width 0.3s ease;
}
.k-quiz-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
.k-quiz-qnum {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--k-text-muted);
}
.k-quiz-timer {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--k-text-primary);
    direction: ltr;
}
.k-quiz-timer.is-warning { color: #ef4444; animation: k-quiz-pulse 0.5s ease infinite; }
@keyframes k-quiz-pulse { 50% { opacity: 0.5; } }
.k-quiz-body { padding: 0 20px 16px; }
.k-quiz-question {
    margin: 0 0 4px;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--k-text-primary);
    line-height: 1.5;
}
.k-quiz-desc {
    margin: 0 0 16px;
    font-size: 0.74rem;
    color: var(--k-text-muted);
}
.k-quiz-options { display: flex; flex-direction: column; gap: 8px; }
.k-quiz-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border: 1.5px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    background: var(--k-bg, #fff);
    cursor: pointer;
    text-align: start;
    font-family: inherit;
    transition: all 0.15s ease;
}
.k-quiz-option:hover:not(:disabled) {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light);
}
.k-quiz-option.is-selected {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light);
}
.k-quiz-option.is-correct {
    border-color: var(--k-success);
    background: color-mix(in srgb, var(--k-success) 8%, transparent);
}
.k-quiz-option.is-wrong {
    border-color: #ef4444;
    background: color-mix(in srgb, #ef4444 8%, transparent);
}
.k-quiz-option-letter {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: var(--k-surface-hover, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--k-text-secondary);
    flex-shrink: 0;
    direction: ltr;
}
.k-quiz-option.is-selected .k-quiz-option-letter {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-quiz-option-text {
    flex: 1;
    font-size: 0.8rem;
    color: var(--k-text-primary);
}
.k-quiz-option-icon { flex-shrink: 0; }
.k-quiz-option.is-correct .k-quiz-option-icon { color: var(--k-success); }
.k-quiz-option.is-wrong .k-quiz-option-icon { color: #ef4444; }
.k-quiz-feedback {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 10px;
    margin-top: 12px;
    font-size: 0.78rem;
    font-weight: 700;
}
.k-quiz-feedback.is-correct {
    background: color-mix(in srgb, var(--k-success) 8%, transparent);
    color: var(--k-success);
}
.k-quiz-feedback.is-wrong {
    background: color-mix(in srgb, #ef4444 8%, transparent);
    color: #ef4444;
}
.k-quiz-explanation {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    background: var(--k-surface, #f8fafc);
    font-size: 0.72rem;
    color: var(--k-text-secondary);
    line-height: 1.6;
}
.k-quiz-foot {
    padding: 14px 20px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.k-quiz-score {
    font-size: 0.76rem;
    color: var(--k-text-muted);
}
.k-quiz-score-val {
    font-weight: 800;
    color: var(--k-primary);
    direction: ltr;
}
.k-quiz-submit, .k-quiz-next {
    padding: 8px 20px;
    border: none;
    border-radius: 10px;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
}
.k-quiz-submit {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-quiz-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.k-quiz-next {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary);
}
.k-quiz-next:hover { background: var(--k-border); }
</style>
