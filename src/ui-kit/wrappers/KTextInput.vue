<!-- wrappers/KTextInput.vue -->
<template>
    <div 
        class="k-text-input" 
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
            <!-- Left Icon (if any) -->
            <div v-if="leftIcon" class="k-icon left" @click="handleLeftIconClick">
                <component :is="leftIcon" class="icon" />
            </div>

            <!-- Core Input -->
            <CoreInput
                :id="inputId"
                ref="coreInput"
                v-bind="$attrs"
                v-model="internalValue"
                :type="type"
                :placeholder="placeholder"
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

            <!-- Right Icons (ordered: loading, clear, custom right) -->
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

                <!-- Right Icon (clickable) -->
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

        <!-- Message Area (error takes priority) -->
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
import CoreInput from '../core/CoreInput.vue'
import { useId } from '../composables/useId'
import type { ValidationRules } from '../types'

// Props
const props = defineProps<{
    modelValue?: string | number
    label?: string
    hint?: string
    leftIcon?: any
    rightIcon?: any
    clearable?: boolean
    type?: 'text' | 'email' | 'tel' | 'url' | 'search'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    debounceMs?: number
    loading?: boolean
    maxlength?: number
    minlength?: number
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string | number]
    'focus': [value: string | number]
    'blur': [value: string | number]
    'input': [value: string | number]
    'change': [value: string | number]
    'clear': []
    'right-icon-click': []
    'left-icon-click': []
}>()

// IDs
const { id: inputId } = useId('input')

// Refs
const coreInput = ref<InstanceType<typeof CoreInput> | null>(null)
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

// Validation
const handleValidation = (result: { isValid: boolean; error: string | null }) => {
    error.value = result.error
}

// Event handlers
const handleRightIconClick = () => {
    emits('right-icon-click')
}

const handleLeftIconClick = () => {
    emits('left-icon-click')
}

const handleUpdate = (value: string | number) => {
    internalValue.value = value
    emits('update:modelValue', value)
}

const handleInput = (value: string | number) => {
    emits('input', value)
}

const handleFocus = (value: string | number) => {
    isFocused.value = true
    emits('focus', value)
}

const handleBlur = (value: string | number) => {
    isFocused.value = false
    emits('blur', value)
}

const clearInput = () => {
    internalValue.value = ''
    emits('update:modelValue', '')
    emits('clear')
    coreInput.value?.focus()
}


// Watch
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal
    }
})

// Expose
defineExpose({
    focus: () => coreInput.value?.focus(),
    blur: () => coreInput.value?.blur(),
    validate: () => coreInput.value?.validate(),
    clearError: () => coreInput.value?.clearError()
})
</script>

<style scoped>
/* Business/ERP style - conservative, professional, Odoo-inspired */
.k-text-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

/* Label - clean, no uppercase for business */
.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
    letter-spacing: normal;
}

.k-text-input.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-text-input.has-error .k-label {
    color: var(--k-error);
}

.k-required {
    color: var(--k-error);
    margin-right: 2px;
}

/* Input Container - minimal border, no glow */
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

/* Hover - subtle, not bright */
.k-text-input:not(.is-disabled) .k-input-container:hover {
    border-color: var(--k-text-secondary);
}

/* Focus - no glow, just border color change */
.k-text-input.is-focused .k-input-container {
    border-color: var(--k-primary);
}

/* Error - red border, no glow */
.k-text-input.has-error .k-input-container {
    border-color: var(--k-error);
}

/* Disabled */
.k-text-input.is-disabled .k-input-container {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

/* Core Input */
.k-text-input :deep(.core-input) {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    font-size: 0.85rem;
    color: var(--k-text-primary);
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
}

.k-text-input :deep(.core-input)::placeholder {
    color: var(--k-text-muted);
    opacity: 0.5;
}

/* Icons - clean, no hover backgrounds */
.k-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    flex-shrink: 0;
    color: var(--k-text-muted);
}

.k-icon.left {
    margin-left: 4px;
}

.k-icon.right {
    margin-right: 4px;
}

/* Icon Buttons - only clear button gets hover */
.k-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
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

/* Right Icons Container - proper spacing */
.k-right-icons {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-right: 6px;
}

/* Loading Spin */
.spin {
    animation: k-spin 0.8s linear infinite;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Message Area - clean, compact */
.k-message-area {
    min-height: 20px;
    font-size: 0.7rem;
}

/* Hint Message */
.k-hint-message {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--k-text-muted);
}

/* Error Message */
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

/* Icon Fade Animation */
.k-icon-fade-enter-active,
.k-icon-fade-leave-active {
    transition: all 0.15s ease;
}

.k-icon-fade-enter-from,
.k-icon-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>
