<!-- components/KAssessment.vue -->
<template>
    <div class="k-assessment">
        <!-- Question -->
        <div class="k-assessment-question">
            <span v-if="number != null" class="k-assessment-number">{{ number }}</span>
            <span class="k-assessment-text">{{ question }}</span>
        </div>

        <!-- Options -->
        <div
            class="k-assessment-options"
            :class="[`layout-${layout}`, `mode-${mode}`]"
            role="group"
        >
            <button
                v-for="(opt, i) in renderedOptions"
                :key="opt.id"
                type="button"
                class="k-assessment-option"
                :class="{
                    'is-selected': isSelected(opt),
                    'is-multi': mode === 'multi'
                }"
                :disabled="disabled"
                @click="toggle(opt)"
            >
                <span class="k-assessment-choice">
                    <component :is="opt.icon" v-if="opt.icon" class="choice-icon" />
                    <span v-else class="choice-label">{{ choiceLetter(i) }}</span>
                </span>
                <span class="k-assessment-option-text">
                    <span class="k-assessment-option-label">{{ opt.label }}</span>
                    <span v-if="opt.description" class="k-assessment-option-desc">{{ opt.description }}</span>
                </span>
                <Check v-if="isSelected(opt)" class="check-icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

export interface KAssessmentOption {
    id?: string | number
    label: string
    description?: string
    icon?: any
}

const props = withDefaults(defineProps<{
    question: string
    /** options; pass strings or objects */
    options: (KAssessmentOption | string)[]
    modelValue?: string | number | (string | number)[] | null
    /**
     * 'boolean'  → two-option layout (بله / خیر)
     * 'single'   → pick one
     * 'multi'    → pick many (modelValue is an array)
     */
    mode?: 'boolean' | 'single' | 'multi'
    /** 'list' | 'grid' (2-col) | 'inline' (boolean row) */
    layout?: 'list' | 'grid' | 'inline'
    number?: number
    disabled?: boolean
}>(), {
    mode: 'single',
    layout: 'list',
    disabled: false
})

const emits = defineEmits<{
    'update:modelValue': [value: any]
    'change': [value: any]
}>()

const renderedOptions = computed<KAssessmentOption[]>(() =>
    props.options.map((o, i) =>
        typeof o === 'object'
            ? { ...o, id: o.id ?? i } as KAssessmentOption
            : { id: i, label: String(o) }
    )
)

const current = computed(() => props.modelValue)

const isSelected = (opt: KAssessmentOption) => {
    if (Array.isArray(current.value)) {
        return current.value.some(v => String(v) === String(opt.id))
    }
    return current.value != null && String(current.value) === String(opt.id)
}

const toggle = (opt: KAssessmentOption) => {
    if (props.disabled) return

    let next: any
    if (props.mode === 'multi') {
        const list = Array.isArray(current.value) ? [...current.value] : []
        const id = opt.id ?? 0
        const idx = list.findIndex(v => String(v) === String(id))
        if (idx >= 0) list.splice(idx, 1)
        else list.push(id)
        next = list
    } else {
        next = current.value === opt.id ? null : opt.id
    }

    emits('update:modelValue', next)
    emits('change', next)
}

const choiceLetter = (i: number) =>
    ['الف', 'ب', 'ج', 'د', 'هـ'][i] ?? String(i + 1)

</script>

<style scoped>
.k-assessment {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.k-assessment-question {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    line-height: 1.7;
}

.k-assessment-number {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    padding: 0 8px;
    border-radius: 8px;
    background: var(--k-primary-light, color-mix(in srgb, #1db954 14%, transparent));
    color: var(--k-primary, #1db954);
    font-size: 0.75rem;
}

.k-assessment-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.k-assessment-options.layout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.k-assessment-options.layout-inline {
    flex-direction: row;
    flex-wrap: wrap;
}

.k-assessment-options.layout-inline .k-assessment-option {
    flex: 1;
    min-width: 120px;
    justify-content: center;
}

.k-assessment-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #ffffff);
    font-family: inherit;
    text-align: start;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-assessment-option:hover:not(:disabled):not(.is-selected) {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 50%, transparent);
    background: var(--k-surface, #f8fafc);
}

.k-assessment-option.is-selected {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 14%, transparent));
    box-shadow: 0 0 0 1px var(--k-primary, #1db954);
}

.k-assessment-option:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.k-assessment-option:focus-visible {
    outline: 2px solid var(--k-primary, #1db954);
    outline-offset: 2px;
}

.k-assessment-choice {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    font-size: 0.75rem;
    font-weight: 700;
    transition: all 0.15s ease;
}

.k-assessment-option.is-selected .k-assessment-choice {
    background: var(--k-primary, #1db954);
    color: #fff;
}

.choice-icon {
    width: 16px;
    height: 16px;
}

.k-assessment-option-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.k-assessment-option-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
}

.k-assessment-option-desc {
    font-size: 0.7rem;
    color: var(--k-text-secondary, #64748b);
}

.check-icon {
    width: 18px;
    height: 18px;
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

/* Boolean mode: big yes/no cards */
.k-assessment-options.mode-boolean .k-assessment-option {
    padding: 16px;
}

.k-assessment-options.mode-boolean .k-assessment-choice {
    width: 36px;
    height: 36px;
}

@media (max-width: 560px) {
    .k-assessment-options.layout-grid {
        grid-template-columns: 1fr;
    }
}
</style>
