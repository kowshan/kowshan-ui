<!-- core/CoreSelect.vue -->
<template>
    <input
        ref="selectRef"
        type="hidden"
        :value="selectedValue"
        :name="name"
        :disabled="disabled"
        :required="required"
        v-bind="ariaAttributes"
    />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useValidation } from '../composables/useValidation'
import { useAccessibility } from '../composables/useAccessibility'
import type { ValidationRules } from '../types'

export interface SelectOption<T = any> {
    value: T
    label: string
    disabled?: boolean
    group?: string
    description?: string
    [key: string]: any
}

// Props
const props = defineProps<{
    modelValue?: any
    options?: SelectOption[]
    valueKey?: string
    labelKey?: string
    descriptionKey?: string
    groupKey?: string
    name?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    multiple?: boolean
    clearable?: boolean
    disabledOptions?: any[]
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    ariaLabel?: string
    ariaDescribedBy?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: any]
    'change': [value: any]
    'blur': [value: any]
    'focus': [value: any]
    'validate': [result: { isValid: boolean; error: string | null }]
    'clear': []
}>()

// Refs
const selectRef = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.modelValue)
const error = ref<string | null>(null)
const isValid = ref(true)
const isFocused = ref(false)

// Composables
const { validate, clearError } = useValidation()

// Helper: Get value from option
const getValueFromOption = (input: any): any => {
    if (input === null || input === undefined) return input
    if (typeof input === 'object' && props.valueKey) {
        return input[props.valueKey]
    }
    return input
}

// Helper: Get label from option
const getLabelFromOption = (input: any): string => {
    if (input === null || input === undefined) return ''
    if (typeof input === 'object' && props.labelKey) {
        return input[props.labelKey]
    }
    return String(input)
}

// Helper: Get description from option
const getDescriptionFromOption = (input: any): string => {
    if (input === null || input === undefined) return ''
    if (typeof input === 'object' && props.descriptionKey) {
        return input[props.descriptionKey]
    }
    return ''
}

// Helper: Find option by value
const findOptionByValue = (value: any): SelectOption | undefined => {
    return props.options?.find(opt => getValueFromOption(opt) === value)
}

// Computed selected value (for hidden input)
const selectedValue = computed(() => {
    if (props.multiple && Array.isArray(internalValue.value)) {
        return internalValue.value.map(v => getValueFromOption(v)).join(',')
    }
    return getValueFromOption(internalValue.value)
})

// Check if option is disabled
const isOptionDisabled = (option: SelectOption): boolean => {
    const optionValue = getValueFromOption(option)
    if (props.disabledOptions?.includes(optionValue)) return true
    if (option.disabled) return true
    return false
}

// Check if option is selected
const isSelected = (option: SelectOption): boolean => {
    const optionValue = getValueFromOption(option)
    
    if (props.multiple && Array.isArray(internalValue.value)) {
        return internalValue.value.some(v => getValueFromOption(v) === optionValue)
    }
    return getValueFromOption(internalValue.value) === optionValue
}

// Get display text (for wrapper)
const getDisplayText = (): string => {
    if (props.multiple && Array.isArray(internalValue.value)) {
        const labels = internalValue.value.map(v => getLabelFromOption(v))
        return labels.join(', ')
    }
    
    const selected = findOptionByValue(getValueFromOption(internalValue.value))
    if (selected) return getLabelFromOption(selected)
    return props.placeholder || ''
}

// Get groups (for grouped options)
const getGroups = (): string[] => {
    if (!props.groupKey) return []
    const groups = new Set<string>()
    props.options?.forEach(opt => {
        const group = opt[props.groupKey!]
        if (group) groups.add(group)
    })
    return Array.from(groups)
}

// Get options by group
const getOptionsByGroup = (group: string): SelectOption[] => {
    if (!props.groupKey) return []
    return props.options?.filter(opt => opt[props.groupKey!] === group) || []
}

// Validation
const runValidation = (value: any): { isValid: boolean; error: string | null } => {
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

// Clear selection
const clear = () => {
    internalValue.value = props.multiple ? [] : null
    emits('update:modelValue', internalValue.value)
    emits('change', internalValue.value)
    emits('clear')
    runValidation(internalValue.value)
}

// Select option (called by wrapper)
const handleSelect = (option: SelectOption) => {
    if (isOptionDisabled(option)) return
    
    const optionValue = getValueFromOption(option)
    const optionObject = option
    
    if (props.multiple) {
        const current = Array.isArray(internalValue.value) ? [...internalValue.value] : []
        const index = current.findIndex(v => getValueFromOption(v) === optionValue)
        
        if (index === -1) {
            current.push(optionObject)
        } else {
            current.splice(index, 1)
        }
        internalValue.value = current
        emits('update:modelValue', current)
        emits('change', current)
    } else {
        internalValue.value = optionObject
        emits('update:modelValue', optionObject)
        emits('change', optionObject)
    }
    
    if (props.validateOn === 'input' || props.validateOn === 'both') {
        runValidation(internalValue.value)
    }
}

// Blur handler (called by wrapper)
const handleBlur = () => {
    isFocused.value = false
    emits('blur', internalValue.value)
    
    if (props.validateOn === 'blur' || props.validateOn === 'both') {
        runValidation(internalValue.value)
    }
}

// Focus handler (called by wrapper)
const handleFocus = () => {
    isFocused.value = true
    clearError()
    emits('focus', internalValue.value)
    emits('validate', { isValid: true, error: null })
}

// Accessibility
const { getAriaAttributes } = useAccessibility({
    label: props.ariaLabel,
    describedBy: props.ariaDescribedBy,
    required: props.required,
    disabled: props.disabled,
    readonly: props.readonly,
    invalid: !!error.value,
    errorMessage: error.value || undefined
})

const ariaAttributes = computed(() => getAriaAttributes())

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal
        runValidation(newVal)
    }
})

// Watch options changes (reset validation)
watch(() => props.options, () => {
    runValidation(internalValue.value)
}, { deep: true })

// Expose methods for wrapper
defineExpose({
    validate: () => runValidation(internalValue.value),
    clearError,
    clear,
    isSelected,
    isOptionDisabled,
    getDisplayText,
    getGroups,
    getOptionsByGroup,
    getOptions: () => props.options || [],
    getValueFromOption,
    getLabelFromOption,
    getDescriptionFromOption,
    handleSelect,
    handleBlur,
    handleFocus,
    focus: () => selectRef.value?.focus(),
    blur: () => selectRef.value?.blur()
})
</script>

<style>
.core-select {
    display: none;
}
</style>