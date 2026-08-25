<!-- wrappers/KCurrency.vue -->
<template>
    <div 
        class="k-currency" 
        :class="{
            'has-error': hasError,
            'has-value': hasValue,
            'is-focused': isFocused,
            'is-disabled': disabled
        }"
    >
        <!-- Label -->
        <label v-if="label" class="k-label" :for="inputId">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Input Container -->
        <div class="k-input-container">
            <!-- Left Icon -->
            <div v-if="leftIcon" class="k-icon left" @click="focusInput">
                <component :is="leftIcon" class="icon" />
            </div>

            <!-- Core Input -->
            <input
                ref="inputRef"
                class="currency-input"
                :value="displayValue"
                type="text"
                inputmode="numeric"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                @input="handleRawInput"
                @blur="handleBlur"
                @focus="handleFocus"
                @keydown="handleKeydown"
            />

            <!-- Right Icons -->
            <div class="k-right-icons">
                <button
                    v-if="clearable && hasValue && !disabled && !readonly"
                    class="k-icon-btn clear"
                    @click="clearInput"
                    type="button"
                    title="پاک کردن"
                >
                    <X class="icon" />
                </button>
                <div v-if="loading" class="k-icon loading">
                    <Loader2 class="icon spin" />
                </div>
                <button
                    v-if="rightIcon"
                    class="k-icon-btn"
                    @click="handleRightIconClick"
                    type="button"
                >
                    <component :is="rightIcon" class="icon" />
                </button>
            </div>
        </div>

        <!-- Persian Text Translation -->
        <div v-if="showPersianText && (rawDigits || hasValue)" class="k-persian-text">
            {{ persianTextPreview || persianTextDisplay }}
        </div>
        <!-- Message Area -->
        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle class="message-icon" />
                {{ errorMessage }}
            </div>
            <div v-else-if="hint" class="k-hint-message">
                <Info class="message-icon" />
                {{ hint }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Loader2, AlertCircle, Info } from 'lucide-vue-next'
import { useId } from '../composables/useId'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { useValidation } from '../composables/useValidation'
import type { ValidationRules } from '../types'

// Props
const props = defineProps<{
    modelValue?: number | null
    label?: string
    hint?: string
    leftIcon?: any
    rightIcon?: any
    clearable?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    currency?: 'IRR' | 'IRT' | 'USD' | 'EUR' | 'GBP'
    locale?: 'fa-IR' | 'en-US'
    showSymbol?: boolean
    decimals?: number
    showPersianText?: boolean
    /** minimum allowed value */
    min?: number
    /** maximum allowed value */
    max?: number
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    loading?: boolean
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: number | null]
    'focus': [value: number | null]
    'blur': [value: number | null]
    'input': [value: number | null]
    'change': [value: number | null]
    'clear': []
}>()

// Composables
const { id: inputId } = useId('currency')
const { toEnglishDigits, numberToPersianText } = usePersianNumbers()
const { validate, clearError, error: validationError, isValid } = useValidation()

// Refs
const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref<number | null>(null)
const rawDigits = ref<string>('')
const isFocused = ref(false)

// Currency settings
const currencySymbols: Record<string, string> = {
    IRR: 'ریال', IRT: 'تومان', USD: '$', EUR: '€', GBP: '£'
}
const currencyUnit = computed(() => currencySymbols[props.currency || 'IRT'] || 'تومان')
const decimals = computed(() => props.decimals ?? (props.currency === 'USD' || props.currency === 'EUR' ? 2 : 0))

// Format with commas
const formatWithCommas = (value: string): string => {
    if (!value) return ''
    const parts = value.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
}

const removeCommas = (value: string): string => value.replace(/,/g, '')

// Get display value
const getDisplayValue = (): string => {
    if (!rawDigits.value) return ''
    return formatWithCommas(rawDigits.value)
}

// Persian text preview
const persianTextPreview = computed(() => {
    // Use rawDigits for real-time preview while typing
    if (!rawDigits.value) return ''
    const num = parseToNumber(rawDigits.value)
    if (num === null || num === 0) return ''
    const text = numberToPersianText(num)
    return `${text} ${currencyUnit.value}`
})

// Keep the old one for display after blur (optional)
const persianTextDisplay = computed(() => {
    if (internalValue.value === null || internalValue.value === 0) return ''
    const text = numberToPersianText(internalValue.value)
    return `${text} ${currencyUnit.value}`
})

// Ke to number
const parseToNumber = (digits: string): number | null => {
    if (!digits) return null
    const num = parseFloat(digits)
    return isNaN(num) ? null : num
}

// Build validation rules (convert min/max to validator functions)
const buildValidationRules = (valueAsString: string): ValidationRules => {
    const rules: ValidationRules = []
    
    // Add custom rules from props
    if (props.rules) {
        rules.push(...props.rules)
    }
    
    // Add required rule (if not already in props)
    if (props.required && !rules.some(r => 'required' in r)) {
        rules.push({ required: true, message: 'این فیلد الزامی است' })
    }
    
    // Ke the numeric value
    const numericValue = parseToNumber(valueAsString)
    
    // Add min validation if min prop exists
    if (props.min !== undefined) {
        rules.push({
            validator: (value: any) => {
                const num = parseToNumber(value)
                if (num === null || num === 0) return true
                return num >= props.min!
            },
            message: `حداقل مبلغ ${props.min.toLocaleString()} ${currencyUnit.value} است`
        })
    }
    
    // Add max validation if max prop exists
    if (props.max !== undefined) {
        rules.push({
            validator: (value: any) => {
                const num = parseToNumber(value)
                if (num === null || num === 0) return true
                return num <= props.max!
            },
            message: `حداکثر مبلغ ${props.max.toLocaleString()} ${currencyUnit.value} است`
        })
    }
    
    return rules
}

const runValidation = (value: string): boolean => {
    // Build rules from props.rules + required + min/max so they all actually apply
    const rules = buildValidationRules(value)
    if (rules.length === 0) return true
    const result = validate(value, rules)
    return result.isValid
}

// Handle raw input
const handleRawInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    let value = input.value
    
    // Convert Persian digits to English
    let englishValue = toEnglishDigits(value)
    
    // Remove commas
    let cleanValue = removeCommas(englishValue)
    
    // Allow only digits and decimal
    let filtered = cleanValue.replace(/[^\d.]/g, '')
    
    // Handle multiple decimals
    const parts = filtered.split('.')
    if (parts.length > 2) {
        filtered = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '')
    }
    
    // Limit decimals
    if (decimals.value === 0) {
        filtered = filtered.replace(/\./g, '')
    } else if (filtered.includes('.')) {
        const decimalParts = filtered.split('.')
        if (decimalParts[1] && decimalParts[1].length > decimals.value) {
            decimalParts[1] = decimalParts[1].slice(0, decimals.value)
            filtered = decimalParts.join('.')
        }
    }

    rawDigits.value = filtered
    const num = parseToNumber(filtered)
    internalValue.value = num
    
    // Update display with commas
    input.value = getDisplayValue()
    
    // Emit pure number
    emits('update:modelValue', num)
    emits('input', num)
    
    // Run validation
    if (props.validateOn === 'input' || props.validateOn === 'both') {
        runValidation(rawDigits.value)
    }
    
}

// Handle blur
const handleBlur = () => {
    isFocused.value = false
    if (props.validateOn === 'blur' || props.validateOn === 'both') {
        runValidation(rawDigits.value)
    }

    if (inputRef.value && rawDigits.value) {
        inputRef.value.value = getDisplayValue()
    }
    emits('blur', internalValue.value)
}

// Handle focus
const handleFocus = () => {
    isFocused.value = true
    if (inputRef.value && rawDigits.value) {
        inputRef.value.value = rawDigits.value
    }
    clearError()
    emits('focus', internalValue.value)
}

// Handle keydown
const handleKeydown = (e: KeyboardEvent) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
    
    if (e.key === '.' && decimals.value > 0) return
    if (/^\d$/.test(e.key)) return
    if (allowedKeys.includes(e.key)) return
    
    e.preventDefault()
}

// Clear input
const clearInput = () => {
    internalValue.value = null
    rawDigits.value = ''
    if (inputRef.value) inputRef.value.value = ''
    emits('update:modelValue', null)
    emits('clear')
    focusInput()
    clearError()
}

const focusInput = () => inputRef.value?.focus()
const handleRightIconClick = () => focusInput()

// Computed
const hasValue = computed(() => internalValue.value !== null && internalValue.value !== undefined && internalValue.value !== 0)
const hasError = computed(() => !!validationError.value)
const errorMessage = computed(() => validationError.value)
const displayValue = computed(() => getDisplayValue())

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal ?? null
        if (internalValue.value !== null) {
            rawDigits.value = internalValue.value.toString()
            if (!isFocused.value && inputRef.value) {
                inputRef.value.value = getDisplayValue()
            }
        } else {
            rawDigits.value = ''
            if (inputRef.value) inputRef.value.value = ''
        }
    }
}, { immediate: true })

// Expose
defineExpose({
    focus: focusInput,
    blur: () => inputRef.value?.blur(),
    validate: () => runValidation(rawDigits.value),
    clearError: () => clearError(),
    getValue: () => internalValue.value
})
</script>

<style scoped>
/* Same styles as KTextInput */
.k-currency {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-currency.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-currency.has-error .k-label {
    color: var(--k-error);
}

.k-required {
    color: var(--k-error);
    margin-right: 2px;
}

.k-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    transition: border-color 0.15s ease;
    min-height: 36px;
}

.k-currency:not(.is-disabled) .k-input-container:hover {
    border-color: var(--k-text-secondary);
}

.k-currency.is-focused .k-input-container {
    border-color: var(--k-primary);
}

.k-currency.has-error .k-input-container {
    border-color: var(--k-error);
}

.k-currency.is-disabled .k-input-container {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

.currency-input {
    flex: 1;
    min-width: 0;
    padding: 6px 8px;
    font-size: 0.85rem;
    color: var(--k-text-primary);
    background: transparent;
    border: none;
    outline: none;
    text-align: right;
}

.currency-input::placeholder {
    color: var(--k-text-muted);
    opacity: 0.5;
}

.k-icon.left {
    margin-left: 6px;
}

.k-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    flex-shrink: 0;
    color: var(--k-text-muted);
}

.k-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--k-text-muted);
    transition: color 0.15s ease;
    border-radius: var(--k-radius-sm);
}

.k-icon-btn.clear:hover {
    color: var(--k-error);
}

.icon {
    width: 16px;
    height: 16px;
}

.k-right-icons {
    display: flex;
    align-items: center;
    gap: 0px;
    margin-right: 2px;
}

.spin {
    animation: k-spin 0.8s linear infinite;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.k-persian-text {
    font-size: 0.7rem;
    color: var(--k-success);
    padding: 4px 8px;
    border-radius: var(--k-radius-sm);
    direction: rtl;
}

.k-message-area {
    min-height: 20px;
    font-size: 0.7rem;
}

.k-hint-message {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--k-text-muted);
}

.k-error-message {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--k-error);
}

.message-icon {
    width: 12px;
    height: 12px;
}
</style>