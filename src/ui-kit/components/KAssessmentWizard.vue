<!-- components/KAssessmentWizard.vue
     The ASSESSMENT wrapper: Info → Instructions → question pages → Result.

     Paging:      `per-page="5"` walks the whole assessment 5 questions at a time
                  (mixed sections get an inline section header); `per-page="0"`
                  (default) walks it section by section.
     Validation:  two tiers —
                  • LIVE (`format` rules: url / email / …) shows immediately and
                    **disables Next**, because the value is present but wrong.
                  • everything else is revealed when Next is pressed, and the
                    wizard scrolls to the first unanswered question.

       <KAssessmentWizard :assessment="a" :per-page="5" v-model="answers"
                          @submit="({ answers, list, result }) => post(list)" />
-->
<template>
    <div class="k-aw">
        <!-- ── info bar ─────────────────────────────────────────── -->
        <header v-if="showHeader" class="k-aw-head">
            <img v-if="assessment.info.logo" class="k-aw-logo" :src="assessment.info.logo" alt="" />
            <div class="k-aw-head-body">
                <h2 class="k-aw-title">{{ assessment.info.title }}</h2>
                <p v-if="assessment.info.description" class="k-aw-desc">{{ assessment.info.description }}</p>
                <ul class="k-aw-meta">
                    <li v-if="assessment.info.provider">{{ assessment.info.provider }}</li>
                    <li v-if="totalQuestions">{{ totalQuestions }} سؤال</li>
                    <li v-if="assessment.info.durationMinutes">{{ assessment.info.durationMinutes }} دقیقه</li>
                    <li v-for="(m, i) in assessment.info.meta || []" :key="i">{{ m.label }}: {{ m.value }}</li>
                </ul>
            </div>
            <span v-if="remaining != null" class="k-aw-timer" :class="{ 'is-low': remaining <= 60 }">
                <TimerReset class="k-aw-timer-icon" />
                {{ clock }}
            </span>
        </header>

        <!-- ── progress + steps ─────────────────────────────────── -->
        <KProgress
            v-if="showProgress"
            :percent="displayProgress"
            :label="`${displayAnswered} از ${displayTotal} پاسخ داده شده`"
            show-percent
        />
        <!-- locked: an attempt is linear — the stepper only reports progress.
             The question phase is ONE step whose pages are inner steps, so the
             bar stays three circles however many pages the feed has. -->
        <KStepper
            v-if="showStepper && stepperSteps.length > 1"
            v-model="stepperModel"
            :steps="stepperSteps"
            :sub-step="subStep"
            :clickable="false"
        />

        <!-- ── instructions ─────────────────────────────────────── -->
        <section v-if="isInstructions" class="k-aw-instructions">
            <h3 class="k-aw-section-title">{{ assessment.instructions?.title || 'راهنمای آزمون' }}</h3>
            <KAssessmentContent :blocks="instructionBlocks" direction="rtl" />
            <KCheckbox
                v-if="assessment.instructions?.agreement"
                v-model="agreed"
                :label="assessment.instructions.agreement.label"
            />
        </section>

        <!-- ── a page of questions ──────────────────────────────── -->
        <section v-else-if="currentPage" class="k-aw-section">
            <!-- one header per section inside this page -->
            <template v-for="group in currentGroups" :key="group.id">
                <div v-if="currentGroups.length > 1 || group.id !== currentPage.id" class="k-aw-group-head">
                    <h3 class="k-aw-section-title">{{ group.title }}</h3>
                    <span v-if="group.description" class="k-aw-section-desc">{{ group.description }}</span>
                    <ul v-if="group.instructions?.length" class="k-aw-section-hints">
                        <li v-for="(line, i) in group.instructions" :key="i">{{ line }}</li>
                    </ul>
                </div>
                <div class="k-aw-questions">
                    <div v-for="q in group.questions" :key="q.id" :data-q="q.id">
                        <KAssessmentQuestion
                            :question="q"
                            :model-value="answers[q.id]"
                            :error="errors[q.id] || liveErrors[q.id]"
                            :required="isRequired(q.id)"
                            :revealed="revealedIds.has(q.id)"
                            :disabled="disabled || submitting"
                            @update:model-value="setAnswer(q.id, $event)"
                        >
                            <!-- host slot overrides (e.g. #input-upload) pass straight through -->
                            <template v-for="(_, name) in $slots" #[name]="slotProps">
                                <slot :name="name" v-bind="slotProps || {}" />
                            </template>
                        </KAssessmentQuestion>
                    </div>
                </div>
            </template>
            <p v-if="!currentGroups.length" class="k-aw-empty">
                همه سؤالات این صفحه بر اساس پاسخ‌های قبلی نمایش داده نمی‌شوند.
            </p>
        </section>

        <!-- ── result ───────────────────────────────────────────── -->
        <section v-else-if="isResult" class="k-aw-result">
            <KAssessmentResult :result="finalResult" :assessment="assessment">
                <template #actions>
                    <KButton text="شروع دوباره" border="solid" @click="restart" />
                    <slot name="result-actions" :result="finalResult" />
                </template>
            </KAssessmentResult>
            <div class="k-aw-answers">
                <h4 class="k-aw-answers-title">پاسخ‌های ثبت‌شده ({{ answeredList.length }} از {{ answerList.length }})</h4>
                <ul class="k-aw-answers-list">
                    <li v-for="a in answerList" :key="a.questionId" :class="{ 'is-empty': !a.answered }">
                        <span class="k-aw-answer-num">{{ a.number ?? '—' }}</span>
                        <span class="k-aw-answer-title">{{ a.title }}</span>
                        <span class="k-aw-answer-value">{{ formatValue(a.value) }}</span>
                    </li>
                </ul>
                <slot name="answers" :list="answerList" />
            </div>
        </section>

        <!-- ── footer nav ───────────────────────────────────────── -->
        <footer class="k-aw-foot">
            <KButton
                v-if="!isInstructions && !isResult"
                text="مرحله قبل"
                :left-icon="ChevronRight"
                border="solid"
                @click="prev"
            />
            <span class="k-aw-foot-gap" />
            <span class="k-aw-foot-info">{{ stepLabel }}</span>
            <span class="k-aw-foot-gap" />
            <KButton
                v-if="!isResult"
                :text="isLastPage ? 'ثبت و مشاهده نتیجه' : 'مرحله بعد'"
                :right-icon="isLastPage ? Check : ChevronLeft"
                :loading="submitting"
                :disabled="(isInstructions && !canContinue) || hasLiveErrors"
                @click="next"
            />
            <KButton v-else text="پایان" :right-icon="Check" @click="emit('close', finalResult)" />
        </footer>

        <p v-if="hasLiveErrors" class="k-aw-blocked" role="status">
            <AlertCircle class="k-aw-blocked-icon" />
            پیش از رفتن به مرحله بعد، مقدارهای نامعتبر این صفحه را اصلاح کنید.
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AlertCircle, Check, ChevronLeft, ChevronRight, TimerReset } from 'lucide-vue-next'
import KButton from './KButton.vue'
import KCheckbox from '../wrappers/KCheckbox.vue'
import KProgress from './KProgress.vue'
import KStepper from './KStepper.vue'
import KAssessmentContent from './KAssessmentContent.vue'
import KAssessmentQuestion from './KAssessmentQuestion.vue'
import KAssessmentResult from './KAssessmentResult.vue'
import { isBlank, useAssessment } from '../composables/useAssessment'
import type {
    Assessment,
    AssessmentAnswers,
    AssessmentQuestion,
    AssessmentResult,
    ContentBlock,
} from '../types/assessment'

const props = withDefaults(defineProps<{
    assessment: Assessment
    /** answers model (v-model) */
    modelValue?: AssessmentAnswers
    /** questions per step — `0` = one section per step */
    perPage?: number
    /** supply a server-computed result instead of letting the wizard score it */
    result?: AssessmentResult | null
    submitting?: boolean
    disabled?: boolean
    showStepper?: boolean
    /** the info header (logo, title, description, meta) — turn it off when the
        host renders its own header from `assessment.info` */
    showHeader?: boolean
    /** the progress bar and its «x از y پاسخ داده شده» label */
    showProgress?: boolean
    /**
     * Count a matrix question as its own rows: a 3-row table is three things to
     * answer, so it takes three slots towards `per-page`, the «سؤال ۱–۹» ranges
     * and the answered/total numbers. Off by default — on, the same `per-page`
     * yields more, shorter steps.
     */
    weightRows?: boolean
    /** start on the result step (e.g. reviewing a finished attempt) */
    startAtResult?: boolean
    /** show per-question explanations after submit */
    revealAnswers?: boolean
}>(), {
    modelValue: () => ({}),
    perPage: 0,
    result: null,
    submitting: false,
    disabled: false,
    showStepper: true,
    showHeader: true,
    showProgress: true,
    weightRows: false,
    startAtResult: false,
    revealAnswers: false,
})

const emit = defineEmits<{
    'update:modelValue': [answers: AssessmentAnswers]
    submit: [payload: {
        answers: AssessmentAnswers
        /** ordered answer list — what you map into the provider's payload */
        list: ReturnType<typeof buildAnswerList>
        result: AssessmentResult
    }]
    'step-change': [index: number, id: string]
    timeout: []
    close: [result: AssessmentResult]
}>()

/* ── engine ───────────────────────────────────────────────── */
const localAnswers = ref<AssessmentAnswers>({ ...(props.modelValue || {}) })
const engine = useAssessment(props.assessment, localAnswers)
const {
    answers, errors, liveErrors, visibleQuestions, visibleIds, answeredCount, progress,
    result: computedResult, isVisible, isRequired, validateMany,
    setAnswer: setEngineAnswer, answerList,
} = engine

const setAnswer = (id: string, value: any) => {
    setEngineAnswer(id, value)
    emit('update:modelValue', { ...answers })
}

watch(() => props.modelValue, (v) => {
    if (v && v !== answers) Object.assign(answers, v)
}, { deep: true })

const buildAnswerList = () => answerList.value.map(a => ({
    questionId: a.questionId,
    sectionId: a.sectionId,
    value: a.value,
}))

/* ── paging ───────────────────────────────────────────────── */
const sectionOf = (id?: string) => props.assessment.sections.find(s => s.id === id)

/** how many «question slots» a question takes — a matrix counts its own rows */
const weightOf = (q: AssessmentQuestion) =>
    props.weightRows && q.input.kind === 'matrix'
        ? Math.max(1, q.input.matrixRows?.length || 1)
        : 1

const pages = computed(() => {
    const questions = visibleQuestions.value
    const size = Math.floor(props.perPage || 0)
    const out: { id: string; label: string; questions: AssessmentQuestion[] }[] = []

    if (size > 0) {
        // fill each page up to `size` slots; a question heavier than `size` still
        // gets a page of its own rather than being dropped
        let chunk: AssessmentQuestion[] = []
        let used = 0
        let from = 1
        const flush = () => {
            if (!chunk.length) return
            const section = sectionOf(chunk[0]?.sectionId)
            const to = from + used - 1
            out.push({
                id: `page-${out.length + 1}`,
                label: `${section ? `${section.title} · ` : ''}سؤال ${from}–${to}`,
                questions: chunk,
            })
            chunk = []
            used = 0
            from = to + 1
        }
        for (const q of questions) {
            const weight = weightOf(q)
            if (chunk.length && used + weight > size) flush()
            chunk.push(q)
            used += weight
        }
        flush()
    } else {
        for (const section of props.assessment.sections) {
            const chunk = questions.filter(q => q.sectionId === section.id)
            if (chunk.length) out.push({ id: section.id, label: section.title, questions: chunk })
        }
    }
    return out
})

/** the step the wizard opens on (result review, instructions, or the first page) */
function firstStep() {
    if (props.startAtResult) return '__result'
    if (props.assessment.instructions) return '__instructions'
    return pages.value[0]?.id || '__result'
}

const currentId = ref(firstStep())

/* the navigation path: one entry per page */
const steps = computed(() => {
    const list: { id: string; label: string }[] = []
    if (hasInstructions.value) list.push({ id: '__instructions', label: 'راهنما' })
    for (const page of pages.value) list.push({ id: page.id, label: page.label })
    list.push({ id: '__result', label: 'نتیجه' })
    return list
})

/*
 * What the stepper *shows*. With one page it is the page itself; with several,
 * the question phase collapses to a single step and the pages become its inner
 * steps — `KStepper` draws those as dots orbiting the circle. So a 60-question
 * assessment still reads as راهنما → سؤالها → نتیجه.
 */
const stepperSteps = computed(() => {
    const list: { id: string; label: string; subSteps?: { id: string; label: string }[] }[] = []
    if (hasInstructions.value) list.push({ id: '__instructions', label: 'راهنما' })
    if (pages.value.length === 1) {
        const only = pages.value[0]!
        list.push({ id: only.id, label: only.label })
    } else if (pages.value.length > 1) {
        list.push({
            id: '__questions',
            label: 'سؤالها',
            subSteps: pages.value.map(p => ({ id: p.id, label: p.label })),
        })
    }
    list.push({ id: '__result', label: 'نتیجه' })
    return list
})

const isQuestions = computed(() => currentId.value.startsWith('page-'))

const pageIndex = computed(() => Math.max(0, pages.value.findIndex(p => p.id === currentId.value)))

/* the collapsed step speaks for every page, so selecting it keeps the page you
   are on (the stepper is a progress indicator here — `clickable` is false) */
const stepperModel = computed({
    get: () => (isQuestions.value ? '__questions' : currentId.value),
    set: (id: string) => {
        if (id === '__questions') return
        currentId.value = id
    },
})

const subStep = computed(() =>
    isQuestions.value && pages.value.length > 1 ? pageIndex.value : undefined,
)

const hasInstructions = computed(() => !!props.assessment.instructions)
const stepIndex = computed(() => Math.max(0, steps.value.findIndex(s => s.id === currentId.value)))
const isInstructions = computed(() => currentId.value === '__instructions')
const isResult = computed(() => currentId.value === '__result')
const isLastPage = computed(() => steps.value[stepIndex.value + 1]?.id === '__result')
const currentPage = computed(() => pages.value.find(p => p.id === currentId.value) || null)

/** questions of the current page, grouped by section so mixed pages read well */
const currentGroups = computed(() => {
    const groups: {
        id: string
        title: string
        description?: string
        instructions?: string[]
        questions: AssessmentQuestion[]
    }[] = []
    for (const question of currentPage.value?.questions || []) {
        const section = sectionOf(question.sectionId)
        const last = groups[groups.length - 1]
        if (last && last.id === (question.sectionId || '__none')) {
            last.questions.push(question)
            continue
        }
        groups.push({
            id: question.sectionId || '__none',
            title: section?.title || 'سؤالات',
            description: section?.description,
            instructions: section?.instructions,
            questions: [question],
        })
    }
    return groups
})

const finalResult = computed<AssessmentResult>(() => props.result || computedResult.value)

const totalQuestions = computed(() => visibleQuestions.value.length)
const answeredList = computed(() => answerList.value.filter(a => a.answered))

/* the same numbers, counted in slots when `weightRows` is on — so the bar and
   the step ranges never disagree about what a «سؤال» is */
const slotTotal = computed(() =>
    visibleQuestions.value.reduce((n, q) => n + weightOf(q), 0),
)
/* `answers` is the plain reactive object the engine hands back — NOT a ref, so
   it is `answers[q.id]`. Writing `answers.value[…]` type-checks (it is a
   `Record<string, any>`, so the property read is `any`) and then throws at
   render time, which is why only `weightRows` hosts ever saw it. */
const slotAnswered = computed(() =>
    visibleQuestions.value.reduce((n, q) => n + (isBlank(answers[q.id]) ? 0 : weightOf(q)), 0),
)
const displayTotal = computed(() => (props.weightRows ? slotTotal.value : totalQuestions.value))
const displayAnswered = computed(() => (props.weightRows ? slotAnswered.value : answeredCount.value))
const displayProgress = computed(() =>
    props.weightRows
        ? (slotTotal.value ? Math.round((slotAnswered.value / slotTotal.value) * 100) : 0)
        : progress.value,
)

const instructionBlocks = computed<ContentBlock[]>(() =>
    (props.assessment.instructions?.items || []).map(item =>
        typeof item === 'string' ? { kind: 'text', text: item } : item
    )
)

/* ── live (blocking) vs submit (revealed) validation ──────── */
const currentIds = computed(() => (currentPage.value?.questions || []).map(q => q.id))
const hasLiveErrors = computed(() => currentIds.value.some(id => !!liveErrors.value[id]))

/* ── agreement gate ───────────────────────────────────────── */
const agreed = ref(!props.assessment.instructions?.agreement)
const canContinue = computed(() => !props.assessment.instructions?.agreement || agreed.value)

/* ── navigation ───────────────────────────────────────────── */
const submitted = ref(false)
const revealedIds = ref(new Set<string>())

const stepLabel = computed(() => {
    if (isResult.value) return 'نتیجه ارزیابی'

    const total = Math.max(1, stepperSteps.value.length - 1)
    const shownAs = isQuestions.value ? '__questions' : currentId.value
    const at = Math.min(
        stepperSteps.value.findIndex(s => s.id === shownAs) + 1,
        total,
    )
    const base = `مرحله ${at} از ${total}`

    // the collapsed step hides which page you are on — say it in words
    return isQuestions.value && pages.value.length > 1
        ? `${base} · صفحه ${pageIndex.value + 1} از ${pages.value.length}`
        : base
})

const formatValue = (value: any) => {
    if (value == null || value === '') return '—'
    if (Array.isArray(value)) return value.length ? value.join(' · ') : '—'
    if (typeof value === 'object') return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' · ')
    return String(value)
}

watch(currentId, (id) => emit('step-change', stepIndex.value, id))

function goTo(index: number) {
    const step = steps.value[Math.max(0, Math.min(steps.value.length - 1, index))]
    if (step) currentId.value = step.id
}

function prev() {
    if (stepIndex.value > 0) goTo(stepIndex.value - 1)
}

function submit() {
    submitted.value = true
    if (props.revealAnswers) {
        revealedIds.value = new Set(
            props.assessment.sections.flatMap(s => s.questions.filter(q => q.explanation).map(q => q.id))
        )
    }
    emit('submit', { answers: { ...answers }, list: buildAnswerList(), result: finalResult.value })
    goTo(steps.value.length - 1)
}

async function scrollToQuestion(id: string) {
    await nextTick()
    const el = document.querySelector(`.k-aw [data-q="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function next() {
    if (isResult.value) return
    if (isInstructions.value) {
        if (!canContinue.value) return
        goTo(1)
        return
    }
    if (hasLiveErrors.value) return

    // reveal every problem on this page (required, range, length, file…)
    const { firstInvalid } = validateMany(currentIds.value)
    if (firstInvalid) {
        scrollToQuestion(firstInvalid)
        return
    }

    if (isLastPage.value) submit()
    else goTo(stepIndex.value + 1)
}

function restart() {
    engine.reset()
    agreed.value = !props.assessment.instructions?.agreement
    submitted.value = false
    revealedIds.value = new Set()
    emit('update:modelValue', { ...answers })
    goTo(0)
}

/* ── optional countdown ───────────────────────────────────── */
// Zero until mounted: reading the clock during setup would render the *server's* time
// and hydrate a different value on the client (a countdown drifts by the round-trip).
const startedAt = ref(0)
const now = ref(0)
let tick: ReturnType<typeof setInterval> | null = null
let timedOut = false

const remaining = computed(() => {
    const minutes = props.assessment.info.durationMinutes
    if (!minutes || !startedAt.value) return null
    return Math.max(0, minutes * 60 - Math.floor((now.value - startedAt.value) / 1000))
})

const clock = computed(() => {
    const total = remaining.value ?? 0
    const m = String(Math.floor(total / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    return `${m}:${s}`
})

onMounted(() => {
    if (props.assessment.info.durationMinutes) {
        startedAt.value = Date.now()
        now.value = Date.now()
        tick = setInterval(() => {
            now.value = Date.now()
            if (remaining.value === 0 && !timedOut) {
                timedOut = true
                emit('timeout')
                if (!isResult.value) submit()
            }
        }, 1000)
    }
})

onBeforeUnmount(() => { if (tick) clearInterval(tick) })

watch(() => props.assessment, () => {
    currentId.value = firstStep()
    startedAt.value = Date.now()
})

/*
 * Expose the engine so a host can score/validate from outside — and the
 * countdown, for a host that renders the header itself (`show-header="false"`).
 *
 * It has to sit *after* the timer: `defineExpose` runs during setup, so naming
 * `remaining` above its `const` is a temporal-dead-zone crash on the server
 * («Cannot access 'remaining' before initialization»), not a compile error.
 */
defineExpose({
    goTo, next, prev, restart, submit,
    validateAll: engine.validateAll,
    answerList,
    activeIds: visibleIds,
    result: finalResult,
    answers,
    remaining,
    clock,
    currentId,
    steps,
    stepperSteps,
})
</script>

<style scoped>
.k-aw {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-lg, 14px);
    background: var(--k-surface);
}
.k-aw-head { display: flex; align-items: flex-start; gap: 12px; }
.k-aw-logo { width: 44px; height: 44px; border-radius: var(--k-radius-md); object-fit: cover; }
.k-aw-head-body { flex: 1; min-width: 0; }
.k-aw-title { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--k-text-primary); }
.k-aw-desc { margin: 4px 0 0; font-size: 0.78rem; color: var(--k-text-secondary); line-height: 1.8; }
.k-aw-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    font-size: 0.7rem;
    color: var(--k-text-muted);
}
.k-aw-timer {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--k-border);
    background: var(--k-bg);
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--k-text-secondary);
    direction: ltr;
}
.k-aw-timer.is-low { border-color: var(--k-error, #ef4444); color: var(--k-error, #ef4444); }
.k-aw-timer-icon { width: 14px; height: 14px; }
.k-aw-instructions,
.k-aw-section { display: flex; flex-direction: column; gap: 12px; }
.k-aw-group-head { display: flex; flex-direction: column; gap: 2px; margin-bottom: 4px; }
.k-aw-section-title { margin: 0; font-size: 0.92rem; font-weight: 800; color: var(--k-text-primary); }
.k-aw-section-desc { font-size: 0.74rem; color: var(--k-text-muted); }
.k-aw-section-hints {
    margin: 0;
    padding-inline-start: 18px;
    font-size: 0.74rem;
    color: var(--k-text-secondary);
    line-height: 1.9;
}
.k-aw-questions { display: flex; flex-direction: column; gap: 12px; }
.k-aw-empty {
    margin: 0;
    padding: 20px;
    text-align: center;
    font-size: 0.8rem;
    color: var(--k-text-muted);
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
}
.k-aw-answers { display: flex; flex-direction: column; gap: 8px; }
.k-aw-answers-title { margin: 0; font-size: 0.82rem; font-weight: 700; color: var(--k-text-primary); }
.k-aw-answers-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 260px;
    overflow-y: auto;
}
.k-aw-answers-list li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    font-size: 0.72rem;
}
.k-aw-answers-list li.is-empty { opacity: 0.55; }
.k-aw-answer-num { color: var(--k-text-muted); font-weight: 700; min-width: 20px; }
.k-aw-answer-title { flex: 1; min-width: 0; color: var(--k-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-aw-answer-value { color: var(--k-text-primary); font-weight: 600; }
.k-aw-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--k-border);
}
.k-aw-foot-gap { flex: 1; }
.k-aw-foot-info { font-size: 0.7rem; color: var(--k-text-muted); }
.k-aw-blocked {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 0.72rem;
    color: var(--k-error, #ef4444);
}
.k-aw-blocked-icon { width: 14px; height: 14px; flex-shrink: 0; }
</style>
