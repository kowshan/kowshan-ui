<!-- KMultiStepWizard — multi-step form wizard using KStepper -->
<template>
    <div class="k-wizard">
        <!-- Step indicator — uses KStepper component -->
        <KStepper
            v-model="activeStepId"
            :steps="stepperSteps"
        />

        <!-- Step Content -->
        <div class="k-wizard-content">
            <slot :name="'step-' + currentStep" :step="currentStep" :data="formData">
                <div class="k-wizard-placeholder">
                    <p>مرحله {{ currentStep + 1 }}: {{ steps[currentStep]?.title }}</p>
                </div>
            </slot>
        </div>

        <!-- Navigation -->
        <div class="k-wizard-nav">
            <button
                v-if="currentStep > 0"
                type="button"
                class="k-wizard-btn k-wizard-btn-secondary"
                @click="prev"
            >
                <ChevronRight :size="16" /> مرحله قبل
            </button>
            <div class="k-wizard-nav-spacer" />
            <span class="k-wizard-step-count">{{ currentStep + 1 }} / {{ steps.length }}</span>
            <button
                v-if="currentStep < steps.length - 1"
                type="button"
                class="k-wizard-btn k-wizard-btn-primary"
                @click="next"
            >
                مرحله بعد <ChevronLeft :size="16" />
            </button>
            <button
                v-else
                type="button"
                class="k-wizard-btn k-wizard-btn-primary k-wizard-btn-final"
                @click="finish"
            >
                <Send :size="14" /> {{ finishText }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronRight, ChevronLeft, Send } from 'lucide-vue-next'
import KStepper from './KStepper.vue'

export interface WizardStep {
    title: string
    subtitle?: string
    validate?: (data: any) => boolean | string
}

const props = withDefaults(defineProps<{
    steps: WizardStep[]
    initialStep?: number
    finishText?: string
}>(), {
    initialStep: 0,
    finishText: 'اتمام'
})

const emit = defineEmits<{
    'step-change': [step: number]
    'step-validate': [step: number, valid: boolean]
    'finish': [data: any]
    'update:data': [data: any]
}>()

const currentStep = ref(props.initialStep)
const formData = ref<Record<string, any>>({})
const stepErrors = ref<boolean[]>(new Array(props.steps.length).fill(false))

// Map step index to KStepper id format
const stepperSteps = computed(() =>
    props.steps.map((s, i) => ({
        id: `step-${i}`,
        label: s.title,
    }))
)

const activeStepId = computed({
    get: () => `step-${currentStep.value}`,
    set: (val: string) => {
        const idx = parseInt(val.replace('step-', ''), 10)
        if (!isNaN(idx)) goToStep(idx)
    }
})

const validateCurrentStep = () => {
    const validator = props.steps[currentStep.value]?.validate
    if (validator) {
        const result = validator(formData.value)
        stepErrors.value[currentStep.value] = !result
        emit('step-validate', currentStep.value, !!result)
        return !!result
    }
    stepErrors.value[currentStep.value] = false
    return true
}

const next = () => {
    if (!validateCurrentStep()) return
    if (currentStep.value < props.steps.length - 1) {
        currentStep.value++
        emit('step-change', currentStep.value)
    }
}

const prev = () => {
    if (currentStep.value > 0) {
        currentStep.value--
        emit('step-change', currentStep.value)
    }
}

const goToStep = (index: number) => {
    if (index < currentStep.value || validateCurrentStep()) {
        currentStep.value = index
        emit('step-change', currentStep.value)
    }
}

const finish = () => {
    if (!validateCurrentStep()) return
    emit('finish', formData.value)
}

defineExpose({ next, prev, goToStep, currentStep, formData })
</script>

<style scoped>
.k-wizard { display: flex; flex-direction: column; gap: 0; width: 100%; }

.k-wizard-content {
    padding: 20px; flex: 1; min-height: 200px;
}

.k-wizard-placeholder { text-align: center; color: var(--k-text-muted); padding: 40px 0; }

.k-wizard-nav {
    display: flex; align-items: center; gap: 10px; padding: 14px 20px;
    border-top: 1px solid var(--k-border);
}
.k-wizard-nav-spacer { flex: 1; }

.k-wizard-step-count { font-size: 0.72rem; color: var(--k-text-muted); font-weight: 500; }

.k-wizard-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--k-radius-sm);
    font-size: 0.8rem; font-weight: 600; font-family: inherit;
    cursor: pointer; border: none; transition: all 0.15s ease;
}
.k-wizard-btn-primary {
    background: var(--k-primary); color: #fff;
}
.k-wizard-btn-primary:hover { filter: brightness(1.08); }
.k-wizard-btn-secondary {
    background: var(--k-surface); color: var(--k-text-primary);
    border: 1px solid var(--k-border);
}
.k-wizard-btn-secondary:hover { background: var(--k-surface-hover); }
.k-wizard-btn-final { background: var(--k-primary); }
</style>
