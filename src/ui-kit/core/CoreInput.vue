<template>
    <input
        ref="inputRef"
        class="core-input"
        :type="type"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        v-bind="ariaAttributes"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @keydown="handleKeydown"
    />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useValidation } from '../composables/useValidation'
import { useAccessibility } from '../composables/useAccessibility'
import { useAsyncValidation } from '../composables/useAsyncValidation'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import type { ValidationRules } from '../types'

// Props
const props = defineProps<{
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    name?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    asyncValidator?: (value: any) => Promise<boolean | string>
    asyncDebounceMs?: number
    debounceMs?: number
    autocomplete?: string
    maxlength?: number
    minlength?: number
    ariaLabel?: string
    ariaDescribedBy?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string | number]
    'input': [value: string | number]
    'debounced-input': [value: string | number]
    'blur': [value: string | number]
    'focus': [value: string | number]
    'change': [value: string | number]
    'validate': [result: { isValid: boolean; error: string | null }]
    'async-validate': [result: { isValid: boolean; error: string | null; loading: boolean }]
    'clear': []
    'enter': [value: string | number]
    'esc': []
    'keydown': [event: KeyboardEvent]
}>()

// Refs
const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.modelValue)
const error = ref<string | null>(null)
const isValid = ref(true)

// Timers
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let validationTimer: ReturnType<typeof setTimeout> | null = null

// Composables
const { validate } = useValidation()
const { normalize } = usePersianNumbers()

// Local error management (useValidation's internal refs are separate from
// this component's own error state, so we manage clearing here directly).
const clearError = () => {
    error.value = null
    isValid.value = true
}

// Async validation
const {
    error: asyncError,
    validate: validateAsync,
    validateDebounced: validateAsyncDebounced,
    clear: clearAsync
} = useAsyncValidation(
    props.asyncValidator || (async () => true),
    props.asyncDebounceMs || 500
)

// Accessibility
const hasError = computed(() => !!error.value || !!asyncError.value)
const { getAriaAttributes } = useAccessibility({
    label: props.ariaLabel,
    describedBy: props.ariaDescribedBy,
    required: props.required,
    disabled: props.disabled,
    readonly: props.readonly,
    invalid: hasError.value,
    errorMessage: error.value || asyncError.value || undefined
})

const ariaAttributes = computed(() => getAriaAttributes())

// Validation handlers
const runSyncValidation = (value: any): { isValid: boolean; error: string | null } => {
    if (!props.rules || props.rules.length === 0) {
        emits('validate', { isValid: true, error: null })
        return { isValid: true, error: null }
    }
    
    const result = validate(value, props.rules)
    error.value = result.error
    isValid.value = result.isValid
    emits('validate', result)
    return result
}

const runDebouncedSyncValidation = (value: any) => {
    if (validationTimer) clearTimeout(validationTimer)
    if (props.validateOn === 'input' || props.validateOn === 'both') {
        validationTimer = setTimeout(() => {
            runSyncValidation(value)
        }, 300)
    }
}

// This is a Persian UI kit — Persian/Arabic digits and Arabic variant
// characters are always normalized to clean Latin/Persian on input
// (e.g. ۰۹۱۲ → 0912, كي → کی). The only exception is passwords, which
// are never touched.
const shouldNormalize = computed(() => props.type !== 'password')

const sanitize = (raw: string): string =>
    shouldNormalize.value ? normalize(raw) : raw

// Event handlers
const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const raw = target.value
    const normalized = sanitize(raw)
    if (normalized !== raw) target.value = normalized

    let value: string | number = normalized
    if (props.type === 'number') value = value === '' ? '' : Number(value)
    
    internalValue.value = value
    emits('update:modelValue', value)
    emits('input', value)
    
    if (debounceTimer) clearTimeout(debounceTimer)
    if (props.debounceMs && props.debounceMs > 0) {
        debounceTimer = setTimeout(() => emits('debounced-input', value), props.debounceMs)
    } else {
        emits('debounced-input', value)
    }
    
    runDebouncedSyncValidation(value)
    if (props.asyncValidator) validateAsyncDebounced(value)
}

const handleBlur = (e: Event) => {
    const target = e.target as HTMLInputElement
    let value: string | number = sanitize(target.value)
    if (props.type === 'number') value = value === '' ? '' : Number(value)
    
    emits('blur', value)
    if (props.validateOn === 'blur' || props.validateOn === 'both') {
        runSyncValidation(value)
    }
}

const handleFocus = (e: Event) => {
    const target = e.target as HTMLInputElement
    let value: string | number = sanitize(target.value)
    if (props.type === 'number') value = value === '' ? '' : Number(value)
    
    emits('focus', value)
    clearError()
    clearAsync()
    emits('validate', { isValid: true, error: null })
}

const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    let value: string | number = sanitize(target.value)
    if (props.type === 'number') value = value === '' ? '' : Number(value)
    emits('change', value)
}

const handleKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    let value: string | number = target.value
    if (props.type === 'number') value = value === '' ? '' : Number(value)
    
    if (e.key === 'Escape') {
        e.preventDefault()
        internalValue.value = ''
        emits('update:modelValue', '')
        emits('input', '')
        emits('debounced-input', '')
        emits('clear')
        emits('esc')
        runSyncValidation('')
        if (props.asyncValidator) validateAsync('')
        return
    }
    
    if (e.key === 'Enter') emits('enter', value)
    emits('keydown', e)
}

// Watch
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) internalValue.value = newVal
})

// Expose
defineExpose({
    validate: () => runSyncValidation(internalValue.value),
    clearError,
    clearAsync,
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
    select: () => inputRef.value?.select(),
    inputRef
})
</script>

<style scoped>
.core-input {
    all: unset;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.core-input::placeholder {
    color: inherit;
    opacity: 0.5;
}

.core-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.core-input[type="search"]::-webkit-search-decoration,
.core-input[type="search"]::-webkit-search-cancel-button,
.core-input[type="search"]::-webkit-search-results-button,
.core-input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
    display: none;
}

.core-input[type="number"]::-webkit-inner-spin-button,
.core-input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

.core-input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.core-input[type="password"]::-ms-reveal,
.core-input[type="password"]::-ms-clear {
    display: none;
}

.core-input[type="email"]::-webkit-contacts-auto-fill-button,
.core-input[type="url"]::-webkit-contacts-auto-fill-button {
    visibility: hidden;
    display: none;
    pointer-events: none;
    position: absolute;
    right: 0;
}

.core-input[type="date"]::-webkit-calendar-picker-indicator,
.core-input[type="time"]::-webkit-calendar-picker-indicator,
.core-input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}

.core-input::-ms-clear,
.core-input::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
}
</style>