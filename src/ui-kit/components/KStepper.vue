<!-- components/KStepper.vue -->
<template>
    <nav
        class="k-stepper"
        role="tablist"
        aria-label="مراحل"
        @keydown="handleKeydown"
    >
        <template v-for="(step, index) in steps" :key="step.id">
            <div
                class="k-step"
                :class="{
                    'is-active': model === step.id,
                    'is-done': isDone(index),
                    'is-disabled': step.disabled
                }"
                role="tab"
                :aria-selected="model === step.id"
                :tabindex="model === step.id ? 0 : -1"
                @click="selectStep(step.id)"
                @keydown.enter.prevent="selectStep(step.id)"
                @keydown.space.prevent="selectStep(step.id)"
            >
                <span class="k-step-circle">
                    <Check
                        v-if="isDone(index)"
                        class="k-step-check"
                    />
                    <span v-else class="k-step-number">{{ toFa(index + 1) }}</span>
                </span>
                <span class="k-step-label">{{ step.label }}</span>
            </div>

            <span
                v-if="index < steps.length - 1"
                class="k-step-line"
                :class="{ 'is-done': isDone(index) }"
            />
        </template>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

interface StepItem {
    id: string
    label: string
    disabled?: boolean
}

const props = defineProps<{
    steps: StepItem[]
}>()

const model = defineModel<string>({ required: true })

const currentIndex = computed(() =>
    Math.max(0, props.steps.findIndex(s => s.id === model.value))
)

const isDone = (index: number) => index < currentIndex.value

const selectStep = (id: string) => {
    const step = props.steps.find(s => s.id === id)
    if (!step || step.disabled) return
    model.value = id
}

const handleKeydown = (e: KeyboardEvent) => {
    let next: number | null = null

    switch (e.key) {
        case 'ArrowRight':
            next = Math.min(currentIndex.value + 1, props.steps.length - 1)
            break
        case 'ArrowLeft':
            next = Math.max(currentIndex.value - 1, 0)
            break
        case 'Home':
            next = 0
            break
        case 'End':
            next = props.steps.length - 1
            break
    }

    if (next === null) return
    e.preventDefault()
    selectStep(props.steps[next].id)
}

// Persian digits for the step numbers
const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const toFa = (n: number) => String(n).replace(/\d/g, d => faDigits[Number(d)])
</script>

<style scoped>
.k-stepper {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    user-select: none;
}

.k-step {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: var(--k-radius-sm);
    transition: background 0.15s ease;
    flex-shrink: 0;
}

.k-step:hover:not(.is-disabled):not(.is-active) {
    background: var(--k-surface-hover);
}

.k-step.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-step-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid var(--k-border);
    background: var(--k-bg);
    color: var(--k-text-secondary);
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.k-step.is-active .k-step-circle {
    border-color: #1db954;
    background: #1db954;
    color: #fff;
    box-shadow: 0 0 0 3px rgba(202, 114, 38, 0.15);
}

.k-step.is-done .k-step-circle {
    border-color: #10b981;
    background: #10b981;
    color: #fff;
}

.k-step-check {
    width: 14px;
    height: 14px;
}

.k-step-label {
    font-size: 0.8rem;
    color: var(--k-text-muted);
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.2s ease;
}

.k-step.is-active .k-step-label {
    color: #1e293b;
    font-weight: 700;
}

.k-step.is-done .k-step-label {
    color: var(--k-text-secondary);
}

/* Connector line */
.k-step-line {
    flex: 1;
    min-width: 24px;
    height: 2px;
    background: var(--k-border);
    margin: 0 6px;
    border-radius: 2px;
    transition: background 0.3s ease;
}

.k-step-line.is-done {
    background: #10b981;
}

.k-step:focus-visible {
    outline: 2px solid #1db954;
    outline-offset: 2px;
}
</style>
