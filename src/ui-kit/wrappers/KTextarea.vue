<!-- wrappers/KTextarea.vue -->
<template>
    <div 
        class="k-textarea" 
        :class="{
            'has-error': hasError,
            'has-value': hasValue,
            'is-focused': isFocused,
            'is-disabled': disabled
        }"
    >
        <!-- Label with required indicator -->
        <label v-if="label" class="k-label" :for="inputId">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Textarea Container -->
        <div class="k-textarea-container">
            <!-- Left Icon -->
            <div v-if="leftIcon" class="k-icon left" @click="focusInput">
                <component :is="leftIcon" class="icon" />
            </div>

            <!-- Core Textarea -->
            <CoreTextarea
                :id="inputId"
                ref="coreTextarea"
                v-bind="$attrs"
                v-model="internalValue"
                :placeholder="placeholder"
                :rows="rows || 3"
                :cols="cols"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                :rules="rules"
                :validate-on="validateOn"
                :debounce-ms="debounceMs"
                :maxlength="maxlength"
                :minlength="minlength"
                @validate="handleValidation"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                @update:model-value="handleUpdate"
            />

            <!-- Right Icons -->
            <div class="k-right-icons">
                <!-- Loading Spinner -->
                <div v-if="loading" class="k-icon loading">
                    <Loader2 class="icon spin" />
                </div>

                <!-- Clear Button -->
                <button
                    v-if="clearable && hasValue && !disabled && !readonly"
                    class="k-icon-btn clear"
                    @click="clearInput"
                    type="button"
                    title="پاک کردن"
                >
                    <X class="icon" />
                </button>

                <!-- Right Icon -->
                <button
                    v-if="rightIcon"
                    class="k-icon-btn"
                    @click="handleRightIconClick"
                    type="button"
                >
                    <component :is="rightIcon" class="icon" />
                </button>
            </div>

            <!-- Character Counter (bottom left) -->
            <div v-if="maxlength && showCounter" class="k-counter">
                {{ charCount }} / {{ maxlength }}
            </div>
        </div>

        <!-- Message Area -->
        <div v-if="errorMessage || hint" class="k-message-area">
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
import CoreTextarea from '../core/CoreTextarea.vue'
import { useKitId } from '../composables/useKitId'
import type { ValidationRules } from '../types'

// Props
const props = defineProps<{
    modelValue?: string
    label?: string
    hint?: string
    leftIcon?: any
    rightIcon?: any
    clearable?: boolean
    placeholder?: string
    rows?: number
    cols?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    debounceMs?: number
    loading?: boolean
    maxlength?: number
    minlength?: number
    showCounter?: boolean
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string]
    'focus': [value: string]
    'blur': [value: string]
    'input': [value: string]
    'change': [value: string]
    'clear': []
    'right-icon-click': []
}>()

// IDs
const { id: inputId } = useKitId('textarea')

// Refs
const coreTextarea = ref<InstanceType<typeof CoreTextarea> | null>(null)
const internalValue = ref(props.modelValue)
const isFocused = ref(false)
const error = ref<string | null>(null)

// Computed
const hasValue = computed(() => {
    return internalValue.value !== undefined && 
           internalValue.value !== null && 
           internalValue.value !== ''
})

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)
const charCount = computed(() => internalValue.value?.length || 0)

// Validation
const handleValidation = (result: { isValid: boolean; error: string | null }) => {
    error.value = result.error
}

// Event handlers
const handleUpdate = (value: string) => {
    internalValue.value = value
    emits('update:modelValue', value)
}

const handleInput = (value: string) => {
    emits('input', value)
}

const handleFocus = (value: string) => {
    isFocused.value = true
    emits('focus', value)
}

const handleBlur = (value: string) => {
    isFocused.value = false
    emits('blur', value)
}

const clearInput = () => {
    internalValue.value = ''
    emits('update:modelValue', '')
    emits('clear')
    coreTextarea.value?.focus()
}

const handleRightIconClick = () => {
    emits('right-icon-click')
}

const focusInput = () => {
    coreTextarea.value?.focus()
}

// Watch
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal
    }
})

// Expose
defineExpose({
    focus: () => coreTextarea.value?.focus(),
    blur: () => coreTextarea.value?.blur(),
    validate: () => coreTextarea.value?.validate(),
    clearError: () => coreTextarea.value?.clearError()
})
</script>

<style scoped>
/* Business/ERP style - matches KTextInput exactly */
.k-textarea {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

/* Label */
.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-textarea.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-textarea.has-error .k-label {
    color: var(--k-error);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

/* Textarea Container */
.k-textarea-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    transition: border-color 0.15s ease;
    min-height: 70px;
}

/* Hover */
.k-textarea:not(.is-disabled) .k-textarea-container:hover {
    border-color: var(--k-text-secondary);
}

/* Focus */
.k-textarea.is-focused .k-textarea-container {
    border-color: var(--k-primary);
    height: 100%;
}

/* Error */
.k-textarea.has-error .k-textarea-container {
    border-color: var(--k-error);
}

/* Disabled */
.k-textarea.is-disabled .k-textarea-container {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

/* Core Textarea - NO RESIZE */
.k-textarea :deep(.core-textarea) {
    flex: 1;
    min-width: 0;
    padding: 10px 12px;
    padding-bottom: 0;
    font-size: 0.85rem;
    color: var(--k-text-primary);
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    line-height: 1.5;
}

.k-textarea :deep(.core-textarea)::placeholder {
    color: var(--k-text-muted);
    opacity: 0.5;
}

/* Left Icon */
.k-icon.left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    flex-shrink: 0;
    margin-top: 10px;
    color: var(--k-text-muted);
}

/* Right Icons Container */
.k-right-icons {
    display: flex;
    align-items: center;
    gap: 2px;
    margin: 8px 8px 0 0;
}

/* Icons */
.k-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
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

.k-icon-btn.clear:active {
    transform: scale(0.95);
}

.icon {
    width: 16px;
    height: 16px;
}

/* Loading Spin */
.spin {
    animation: k-spin 0.8s linear infinite;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Character Counter - bottom LEFT */
.k-counter {
    position: absolute;
    bottom: 6px;
    left: 10px;
    font-size: 0.65rem;
    color: var(--k-text-muted);
    background: var(--k-bg);
    padding: 0 4px;
    pointer-events: none;
    z-index: 1;
}

/* Message Area */
.k-message-area {
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