<!-- components/KAssessmentQuestion.vue
     One question end-to-end: number → title → hint → CONTENT blocks → INPUT →
     inline error → (optional) explanation after reveal.
-->
<template>
    <section class="k-aq" :class="{ 'is-invalid': !!error, 'is-answered': answered }" :aria-labelledby="`${uid}-t`">
        <header class="k-aq-head">
            <span v-if="question.number != null" class="k-aq-number">{{ question.number }}</span>
            <span v-else-if="index != null" class="k-aq-number">{{ index + 1 }}</span>
            <div class="k-aq-titles">
                <h3 :id="`${uid}-t`" class="k-aq-title">
                    {{ question.title || 'سؤال بدون عنوان' }}
                    <span v-if="required" class="k-aq-required" aria-hidden="true">*</span>
                </h3>
                <p v-if="question.hint" class="k-aq-hint">{{ question.hint }}</p>
            </div>
            <span v-if="points != null" class="k-aq-points">{{ points }} امتیاز</span>
        </header>

        <KAssessmentContent v-if="question.contents?.length" :blocks="question.contents" />

        <!-- forward host slots (e.g. #input-upload with KVoiceRecorder) down to the input -->
        <KAssessmentInput
            :input="question.input"
            :model-value="modelValue"
            :disabled="disabled || revealed"
            @update:model-value="emit('update:modelValue', $event)"
        >
            <template v-for="(_, name) in $slots" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps || {}" />
            </template>
        </KAssessmentInput>

        <p v-if="error" class="k-aq-error" role="alert">
            <AlertCircle class="k-aq-error-icon" />
            {{ error }}
        </p>

        <div v-if="revealed && question.explanation" class="k-aq-explain">
            <Lightbulb class="k-aq-explain-icon" />
            <p class="k-aq-explain-text">{{ question.explanation }}</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Lightbulb } from 'lucide-vue-next'
import KAssessmentContent from './KAssessmentContent.vue'
import KAssessmentInput from './KAssessmentInput.vue'
import { useKitId } from '../composables/useKitId'
import { isBlank } from '../composables/useAssessment'
import type { AssessmentQuestion } from '../types/assessment'

const props = withDefaults(defineProps<{
    question: AssessmentQuestion
    modelValue?: any
    /** validation message for this question ('' / null = valid) */
    error?: string | null
    required?: boolean
    disabled?: boolean
    /** lock the input and show the explanation */
    revealed?: boolean
    index?: number | null
}>(), {
    error: null,
    required: false,
    disabled: false,
    revealed: false,
    index: null,
})

const emit = defineEmits<{ 'update:modelValue': [value: any] }>()

const { id: uid } = useKitId('k-aq')

const answered = computed(() => !isBlank(props.modelValue))

const points = computed(() => {
    const rules = props.question.scoring || []
    if (rules.length) return rules.reduce((sum, r) => sum + Math.abs(r.points), 0)
    return null
})
</script>

<style scoped>
.k-aq {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-lg, 14px);
    background: var(--k-bg);
}
.k-aq.is-invalid { border-color: var(--k-error, #ef4444); }
.k-aq-head {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.k-aq-number {
    flex-shrink: 0;
    min-width: 26px;
    height: 26px;
    padding: 0 6px;
    border-radius: 8px;
    background: var(--k-primary-light, rgba(29, 185, 84, 0.12));
    color: var(--k-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 800;
}
.k-aq-titles { flex: 1; min-width: 0; }
.k-aq-title {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 700;
    line-height: 1.8;
    color: var(--k-text-primary);
}
.k-aq-required { color: var(--k-error, #ef4444); margin-inline-start: 2px; }
.k-aq-hint {
    margin: 4px 0 0;
    font-size: 0.72rem;
    color: var(--k-text-muted);
    line-height: 1.7;
}
.k-aq-points {
    flex-shrink: 0;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--k-text-muted);
    border: 1px solid var(--k-border);
    border-radius: 999px;
    padding: 2px 8px;
}
.k-aq-error {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 0.74rem;
    color: var(--k-error, #ef4444);
}
.k-aq-error-icon { width: 14px; height: 14px; flex-shrink: 0; }
.k-aq-explain {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    border-radius: var(--k-radius-md);
    background: var(--k-info-light, rgba(59, 130, 246, 0.1));
    border: 1px solid var(--k-info, #3b82f6);
}
.k-aq-explain-icon { width: 16px; height: 16px; color: var(--k-info, #3b82f6); flex-shrink: 0; margin-top: 2px; }
.k-aq-explain-text {
    margin: 0;
    font-size: 0.76rem;
    line-height: 1.9;
    color: var(--k-text-secondary);
}
</style>
