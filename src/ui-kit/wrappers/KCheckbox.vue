<!-- wrappers/KCheckbox.vue -->
<template>
    <div class="k-checkbox-wrapper">
        <CoreCheckbox
            ref="coreCheckboxRef"
            v-model="internalValue"
            :indeterminate="indeterminate"
            :name="name"
            :disabled="disabled"
            :required="required"
            :aria-label="label || ariaLabel"
            :aria-described-by="describedBy"
            @change="handleChange"
            @blur="handleBlur"
            @focus="handleFocus"
            class="inp-cbx"
            :id="checkboxId"
        />
        
        <label :for="checkboxId" class="k-cbx" :class="{
            'is-disabled': disabled,
            'is-readonly': readonly,
            'has-error': hasError
        }">
            <span>
                <svg width="12px" height="10px" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
            </span>
            <span>{{ label }}</span>
        </label>

        <!-- Hint / Error -->
        <div v-if="hint && !error" class="k-checkbox-hint">{{ hint }}</div>
        <div v-if="error" class="k-checkbox-error">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CoreCheckbox from '../core/CoreCheckbox.vue'
import { useId } from '../composables/useId'

// Props
const props = defineProps<{
    modelValue?: boolean
    label?: string
    hint?: string
    error?: string
    name?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    indeterminate?: boolean
    ariaLabel?: string
    describedBy?: string
    size?: 'sm' | 'md' | 'lg'
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: boolean]
    'change': [value: boolean]
    'blur': [value: boolean]
    'focus': [value: boolean]
}>()

// IDs
const { id: checkboxId } = useId('checkbox')

// Refs
const coreCheckboxRef = ref<InstanceType<typeof CoreCheckbox> | null>(null)
const internalValue = ref(props.modelValue || false)
const isFocused = ref(false)

// Computed
const isChecked = computed(() => internalValue.value && !props.indeterminate)
const hasError = computed(() => !!props.error)

// Handlers
const handleChange = async (value: boolean | null) => {
    internalValue.value = value ?? false
    emits('update:modelValue', value ?? false)
    emits('change', value ?? false)
}

const handleFocus = (value: boolean | null) => {
    isFocused.value = true
    emits('focus', value ?? false)
}

const handleBlur = (value: boolean | null) => {
    isFocused.value = false
    emits('blur', value ?? false)
}

// Watchers
watch(() => props.modelValue, async (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal || false
    }
})

// Expose
defineExpose({
    focus: () => coreCheckboxRef.value?.focus(),
    blur: () => coreCheckboxRef.value?.blur(),
    click: () => coreCheckboxRef.value?.checkboxRef?.click(),
    checkboxRef: coreCheckboxRef
})
</script>

<style scoped>
.k-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    position: relative;
}

/* Hidden checkbox input */
.k-checkbox-wrapper .inp-cbx {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* Custom checkbox label */
.k-cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.k-cbx:hover {
    background: oklch(from var(--k-primary) l c h / 0.06);
}

.k-cbx span {
    display: inline-block;
    vertical-align: middle;
}

/* Checkbox box */
.k-cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    transform: scale(1);
    border: 1.5px solid var(--k-border);
    transition: all 0.2s ease;
    background: var(--k-bg);
}

/* SVG checkmark */
.k-cbx span:first-child svg {
    position: absolute;
    top: 2px;
    left: 2px;
    fill: none;
    stroke: white;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.05s;
    transform: translate3d(0, 0, 0);
    width: 12px;
    height: 10px;
}

/* Checked state */
.inp-cbx:checked + .k-cbx span:first-child {
    background: var(--k-primary);
    border-color: var(--k-primary);
    animation: wave 0.3s ease;
}

.inp-cbx:checked + .k-cbx span:first-child svg {
    stroke-dashoffset: 0;
}

/* Indeterminate state */
.inp-cbx:indeterminate + .k-cbx span:first-child {
    background: var(--k-primary);
    border-color: var(--k-primary);
}

.inp-cbx:indeterminate + .k-cbx span:first-child::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 2px;
    background: white;
    border-radius: 1px;
}

/* Hover effect */
.k-cbx:hover span:first-child {
    border-color: var(--k-primary);
}

/* Disabled state */
.k-checkbox-wrapper .is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-checkbox-wrapper .is-disabled .k-cbx {
    cursor: not-allowed;
}

/* Readonly state */
.k-checkbox-wrapper .is-readonly .k-cbx {
    cursor: default;
}

/* Error state - red border only */
.k-checkbox-wrapper .has-error .k-cbx span:first-child {
    border-color: var(--k-error);
}

.inp-cbx:checked + .k-cbx.has-error span:first-child {
    background: var(--k-error);
    border-color: var(--k-error);
}

/* Label text */
.k-cbx span:last-child {
    font-size: 0.85rem;
    color: var(--k-text-primary);
    line-height: 1.4;
}

/* Hint */
.k-checkbox-hint {
    width: 100%;
    font-size: 0.7rem;
    color: var(--k-text-muted);
    margin-top: -4px;
    margin-bottom: 4px;
}

/* Error message */
.k-checkbox-error {
    width: 100%;
    font-size: 0.7rem;
    color: var(--k-error);
    margin-top: -4px;
    margin-bottom: 4px;
}

/* Wave animation */
@keyframes wave {
    50% {
        transform: scale(0.9);
    }
}

/* Sizes */
.k-checkbox-wrapper[size="sm"] .k-cbx span:first-child {
    width: 14px;
    height: 14px;
}

.k-checkbox-wrapper[size="sm"] .k-cbx span:first-child svg {
    width: 10px;
    height: 8px;
    top: 1px;
    left: 1px;
}

.k-checkbox-wrapper[size="sm"] .k-cbx span:last-child {
    font-size: 0.75rem;
}

.k-checkbox-wrapper[size="lg"] .k-cbx span:first-child {
    width: 22px;
    height: 22px;
}

.k-checkbox-wrapper[size="lg"] .k-cbx span:first-child svg {
    width: 16px;
    height: 14px;
    top: 3px;
    left: 3px;
}

.k-checkbox-wrapper[size="lg"] .k-cbx span:last-child {
    font-size: 1rem;
}
</style>