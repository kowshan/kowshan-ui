<!-- core/CoreTextarea.vue -->
<template>
    <textarea
        ref="textareaRef"
        class="core-textarea"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :rows="rows"
        :cols="cols"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :resize="false"
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
    modelValue?: string
    name?: string
    placeholder?: string
    rows?: number
    cols?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    asyncValidator?: (value: any) => Promise<boolean | string>
    asyncDebounceMs?: number
    debounceMs?: number
    maxlength?: number
    minlength?: number
    ariaLabel?: string
    ariaDescribedBy?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string]
    'input': [value: string]
    'debounced-input': [value: string]
    'blur': [value: string]
    'focus': [value: string]
    'change': [value: string]
    'validate': [result: { isValid: boolean; error: string | null }]
    'async-validate': [result: { isValid: boolean; error: string | null; loading: boolean }]
    'clear': []
    'enter': [value: string]
    'esc': []
    'keydown': [event: KeyboardEvent]
}>()

// Refs
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const internalValue = ref(props.modelValue)
const error = ref<string | null>(null)
const isValid = ref(true)

// Timers
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let validationTimer: ReturnType<typeof setTimeout> | null = null

// Composables
const { validate, clearError } = useValidation()
const { normalize } = usePersianNumbers()

// Persian kit — always normalize typed Persian/Arabic digits and
// Arabic variant characters to clean Latin/Persian values.
const sanitize = (raw: string): string => normalize(raw)
const { error: asyncError, validate: validateAsync, validateDebounced: validateAsyncDebounced, clear: clearAsync } = useAsyncValidation(
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

// Event handlers
const handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    const raw = target.value
    const value = sanitize(raw)
    if (value !== raw) target.value = value
    
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
    const target = e.target as HTMLTextAreaElement
    const value = sanitize(target.value)
    
    emits('blur', value)
    if (props.validateOn === 'blur' || props.validateOn === 'both') {
        runSyncValidation(value)
    }
}

const handleFocus = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    const value = target.value
    
    emits('focus', value)
    clearError()
    clearAsync()
    emits('validate', { isValid: true, error: null })
}

const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    const value = target.value
    emits('change', value)
}

const handleKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement
    const value = target.value
    
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
    
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        emits('enter', value)
    }
    
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
    focus: () => textareaRef.value?.focus(),
    blur: () => textareaRef.value?.blur(),
    select: () => textareaRef.value?.select(),
    textareaRef
})
</script>

<style scoped>
.core-textarea {
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
    resize: vertical;
}

.core-textarea::placeholder {
    color: inherit;
    opacity: 0.5;
}

.core-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.core-textarea:read-only {
    cursor: default;
}

/* Add to existing .core-textarea styles */
.core-textarea {
    resize: none;
    overflow-y: auto;
    scrollbar-width: none;
}

.core-textarea::-webkit-scrollbar {
    display: none;
}
</style>