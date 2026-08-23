<!-- core/CoreFile.vue -->
<template>
    <input
        ref="fileRef"
        type="file"
        class="core-file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :required="required"
        :capture="capture"
        v-bind="ariaAttributes"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
    />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useValidation } from '../composables/useValidation'
import { useAccessibility } from '../composables/useAccessibility'
import { useFileValidation } from '../composables/useFileValidation'
import type { ValidationRules } from '../types'

// Props
const props = defineProps<{
    modelValue?: File | File[] | null
    accept?: string
    multiple?: boolean
    disabled?: boolean
    required?: boolean
    capture?: 'user' | 'environment'
    maxSize?: number
    minSize?: number
    maxCount?: number
    minCount?: number
    allowedTypes?: string[]
    customValidator?: (file: File, allFiles: File[]) => string | true
    rules?: ValidationRules
    validateOn?: 'change' | 'blur' | 'both'
    ariaLabel?: string
    ariaDescribedBy?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: File | File[] | null]
    'change': [value: File | File[] | null]
    'blur': [value: File | File[] | null]
    'focus': [value: File | File[] | null]
    'validate': [result: { isValid: boolean; errors: any[] }]
    'clear': []
}>()

// Refs
const fileRef = ref<HTMLInputElement | null>(null)
const internalValue = ref<File | File[] | null>(null)
const errors = ref<any[]>([])
const isValid = ref(true)
const isFocused = ref(false)

// Composables
const { clearError } = useValidation()
const { validateFiles, formatBytes, getFileInfo } = useFileValidation()

// Initialize internal value from props
const initValue = () => {
    if (props.modelValue) {
        internalValue.value = props.modelValue
    } else {
        internalValue.value = props.multiple ? [] : null
    }
}

// Validate all files
const runValidation = () => {
    const files = getFilesArray()
    const result = validateFiles(files, {
        maxSize: props.maxSize,
        minSize: props.minSize,
        maxCount: props.maxCount,
        minCount: props.minCount,
        allowedTypes: props.allowedTypes,
        customValidator: props.customValidator
    })
    
    errors.value = result.errors
    isValid.value = result.isValid
    emits('validate', result)
    return result
}

// Get files as array
const getFilesArray = (): File[] => {
    if (!internalValue.value) return []
    if (Array.isArray(internalValue.value)) return internalValue.value
    return [internalValue.value]
}

// Reset input value (allows selecting same file again)
const resetInput = () => {
    if (fileRef.value) fileRef.value.value = ''
}

// Handle file selection
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const selectedFiles = Array.from(target.files || [])
    
    if (!selectedFiles.length) {
        clear()
        return
    }
    
    let newValue: File | File[] | null
    
    if (props.multiple) {
        newValue = selectedFiles
    } else {
        newValue = selectedFiles[0] ?? null
    }
    
    internalValue.value = newValue
    emits('update:modelValue', newValue)
    emits('change', newValue)
    
    if (props.validateOn === undefined || props.validateOn === 'change' || props.validateOn === 'both') {
        runValidation()
    }
    resetInput()
}

// Clear all files
const clear = () => {
    internalValue.value = props.multiple ? [] : null
    emits('update:modelValue', internalValue.value)
    emits('change', internalValue.value)
    emits('clear')
    resetInput()
    runValidation()
}

// Open file dialog
const openDialog = () => {
    if (!props.disabled && fileRef.value) {
        fileRef.value.click()
    }
}

// Blur handler
const handleBlur = () => {
    isFocused.value = false
    emits('blur', internalValue.value)
    
    if (props.validateOn === 'blur' || props.validateOn === 'both') {
        runValidation()
    }
}

// Focus handler
const handleFocus = () => {
    isFocused.value = true
    clearError()
    emits('focus', internalValue.value)
}

// Accessibility
const { getAriaAttributes } = useAccessibility({
    label: props.ariaLabel,
    describedBy: props.ariaDescribedBy,
    required: props.required,
    disabled: props.disabled
})

const ariaAttributes = computed(() => getAriaAttributes())

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal || (props.multiple ? [] : null)
        runValidation()
    }
}, { deep: true })

// Initialize
initValue()

// Expose
defineExpose({
    validate: () => runValidation(),
    clear,
    openDialog,
    getFiles: () => getFilesArray(),
    getFileInfo: (file: File) => getFileInfo(file),
    getErrors: () => errors.value,
    isValid: () => isValid.value,
    reset: resetInput,
    focus: () => fileRef.value?.focus(),
    blur: () => fileRef.value?.blur()
})
</script>

<style scoped>
.core-file {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}
</style>