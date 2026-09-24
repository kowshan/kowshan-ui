<!-- wrappers/KRadioGroup.vue -->
<template>
    <div
        class="k-radio-group"
        :class="[`k-radio-${variant}`, `k-radio-${direction}`, { 'is-disabled': disabled }]"
        role="radiogroup"
        :aria-label="label || undefined"
    >
        <span v-if="label" class="k-radio-group-label">{{ label }}</span>

        <!-- Radio items -->
        <label
            v-for="opt in normalized"
            :key="opt.id ?? opt.label ?? String(opt)"
            class="k-radio-item"
            :class="{
                'is-checked': isChecked(opt),
                'is-disabled': disabled || opt.disabled
            }"
        >
            <input
                type="radio"
                class="k-radio-input"
                :name="name"
                :value="optValue(opt)"
                :checked="isChecked(opt)"
                :disabled="disabled || opt.disabled"
                @change="select(opt)"
            />

            <!-- Variant-specific visuals -->
            <span class="k-radio-dot" aria-hidden="true"></span>

            <span class="k-radio-content">
                <span class="k-radio-title">{{ opt.label }}</span>
                <span v-if="opt.description" class="k-radio-desc">{{ opt.description }}</span>
            </span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface KRadioOption {
    id?: string | number
    label: string
    value?: string | number
    description?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    modelValue?: string | number | null
    options: KRadioOption[] | (string | number)[]
    label?: string
    name?: string
    variant?: 'normal' | 'segmented' | 'cards'
    direction?: 'vertical' | 'horizontal'
    disabled?: boolean
}>(), {
    modelValue: null,
    variant: 'normal',
    direction: 'vertical'
})

const emits = defineEmits<{
    'update:modelValue': [value: string | number]
    'change': [value: string | number]
}>()

const normalized = computed<KRadioOption[]>(() =>
    props.options.map(o =>
        typeof o === 'object' ? o as KRadioOption : { id: o, label: String(o), value: o }
    )
)

const optValue = (opt: KRadioOption): string | number => opt.value ?? opt.id ?? opt.label

const isChecked = (opt: KRadioOption) => props.modelValue != null && String(optValue(opt)) === String(props.modelValue)

const select = (opt: KRadioOption) => {
    if (props.disabled || opt.disabled) return
    const v = optValue(opt)
    emits('update:modelValue', v)
    emits('change', v)
}
</script>

<style scoped>
.k-radio-group {
    display: flex;
    gap: 8px;
}

.k-radio-group.k-radio-vertical {
    flex-direction: column;
}

.k-radio-group.k-radio-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}

.k-radio-group-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-secondary);
}

/* ---- Normal variant ---- */
.k-radio-normal .k-radio-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--k-text-primary);
}

.k-radio-dot {
    width: 17px;
    height: 17px;
    border: 2px solid var(--k-border, #cbd5e1);
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s ease;
}

.k-radio-dot::after {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--k-primary);
    transform: scale(0);
    transition: transform 0.15s ease;
}

.k-radio-item.is-checked .k-radio-dot {
    border-color: var(--k-primary);
}

.k-radio-item.is-checked .k-radio-dot::after {
    transform: scale(1);
}

/* ---- Segmented variant ---- */
.k-radio-segmented {
    background: var(--k-surface-hover, #eef2f7);
    border-radius: 10px;
    padding: 4px;
    display: inline-flex;
    gap: 4px;
    width: fit-content;
}

.k-radio-segmented.k-radio-vertical {
    flex-direction: column;
    align-items: stretch;
}

.k-radio-segmented .k-radio-item {
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.82rem;
    color: var(--k-text-secondary);
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    user-select: none;
}

.k-radio-segmented .k-radio-item.is-checked {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
    font-weight: 600;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
}

.k-radio-segmented .k-radio-dot {
    display: none;
}

/* ---- Cards variant ---- */
.k-radio-cards .k-radio-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
    background: var(--k-bg);
}

.k-radio-cards .k-radio-item.is-checked {
    border-color: var(--k-primary, #1db954);
    background: color-mix(in srgb, var(--k-primary, #1db954) 10%, var(--k-bg, #ffffff));
}

.k-radio-cards .k-radio-item:hover:not(.is-disabled) {
    border-color: var(--k-primary);
}

.k-radio-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-radio-title {
    font-size: 0.85rem;
    color: var(--k-text-primary);
}

.k-radio-desc {
    font-size: 0.72rem;
    color: var(--k-text-secondary);
}

/* Disabled */
.k-radio-group.is-disabled {
    opacity: 0.55;
}

.k-radio-item.is-disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

/* Hide the native input but keep it focusable for a11y */
.k-radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.k-radio-item:focus-within .k-radio-dot {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}
</style>
