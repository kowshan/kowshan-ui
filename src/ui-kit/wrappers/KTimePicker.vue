<!-- wrappers/KTimePicker.vue -->
<!--
    KTimePicker — time field (24h). A normal clickable field that opens the
    Telegram-style wheel picker (KTimePickerModal). Display is Persian digits,
    the emitted value is clean "HH:mm" (or "HH:mm:ss" with show-seconds) for the DB.
-->
<template>
    <div
        class="k-ui-timepicker"
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
        <div
            class="k-input-container"
            :class="{ 'is-clickable': !disabled && !readonly }"
            @click="openModal"
        >
            <input
                :id="inputId"
                ref="inputRef"
                class="k-timepicker-field"
                type="text"
                inputmode="none"
                :value="displayValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="true"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown.enter.prevent="openModal"
            />
            <Clock class="k-timepicker-cal" :size="16" />

            <!-- Clear Button -->
            <button
                v-if="clearable && hasValue && !disabled && !readonly"
                class="k-icon-btn clear"
                @click.stop="clearInput"
                type="button"
                title="پاک کردن"
            >
                <X class="icon" />
            </button>
        </div>

        <!-- Message Area -->
        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle class="message-icon" />
                {{ errorMessage }}
            </div>
        </div>

        <!-- Wheel picker modal -->
        <KTimePickerModal
            v-if="pickerEnabled"
            v-model:visible="modalOpen"
            v-model="internalValue"
            :show-seconds="showSeconds"
            :output-format="outputFormat"
            @confirm="handleModalConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, AlertCircle, Clock } from 'lucide-vue-next'
import { useId } from '../composables/useId'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import KTimePickerModal from '../components/KTimePickerModal.vue'

const props = withDefaults(defineProps<{
    modelValue?: string | null
    label?: string
    clearable?: boolean
    /** output format of the emitted value */
    outputFormat?: 'HH:mm' | 'HH:mm:ss'
    /** include the seconds column in the picker and the output */
    showSeconds?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    /** set to false to render nothing (e.g. server-side guarded) */
    pickerEnabled?: boolean
}>(), {
    modelValue: null,
    outputFormat: 'HH:mm',
    showSeconds: false,
    placeholder: 'انتخاب ساعت',
    pickerEnabled: true
})

const emits = defineEmits<{
    'update:modelValue': [value: string | null]
    'focus': [value: string]
    'blur': [value: string]
    'change': [value: string]
    'clear': []
}>()

const { id: inputId } = useId('timepicker')
const { toPersianDigits } = usePersianNumbers()

const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref<string | null>(props.modelValue ?? null)
const modalOpen = ref(false)
const isFocused = ref(false)
const error = ref<string | null>(null)

const hasValue = computed(() =>
    internalValue.value !== undefined && internalValue.value !== null && internalValue.value !== ''
)

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

/** modal mode shows the value in Persian digits, whatever the output format */
const displayValue = computed(() => {
    if (!hasValue.value || !internalValue.value) return ''
    return toPersianDigits(internalValue.value)
})

const runValidation = (value: string | null): boolean => {
    if (props.required && !value) {
        error.value = 'این فیلد الزامی است'
        return false
    }
    error.value = null
    return true
}

const openModal = () => {
    if (props.disabled || props.readonly) return
    modalOpen.value = true
}

const handleModalConfirm = (value: string) => {
    internalValue.value = value
    emits('update:modelValue', value)
    emits('change', value)
    runValidation(value)
}

const handleFocus = () => {
    isFocused.value = true
    emits('focus', internalValue.value ?? '')
}

const handleBlur = () => {
    isFocused.value = false
    runValidation(internalValue.value)
    emits('blur', internalValue.value ?? '')
}

const clearInput = () => {
    internalValue.value = ''
    emits('update:modelValue', null)
    emits('clear')
}

watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal ?? null
        runValidation(newVal ?? null)
    }
})

defineExpose({
    focus: openModal,
    clear: clearInput
})
</script>

<style scoped>
.k-ui-timepicker {
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

.k-ui-timepicker.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-ui-timepicker.has-error .k-label {
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

.k-input-container.is-clickable {
    cursor: pointer;
}

.k-ui-timepicker:not(.is-disabled) .k-input-container:hover {
    border-color: var(--k-text-secondary);
}

.k-ui-timepicker.is-focused .k-input-container {
    border-color: var(--k-primary);
}

.k-ui-timepicker.has-error .k-input-container {
    border-color: var(--k-error);
}

.k-ui-timepicker.is-disabled .k-input-container {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

.k-timepicker-field {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.85rem;
    color: var(--k-text-primary);
    padding: 0 12px;
    cursor: pointer;
    direction: ltr;
    text-align: right;
}

.k-timepicker-field::placeholder {
    color: var(--k-placeholder, var(--k-text-muted));
}

.k-timepicker-field:disabled {
    cursor: not-allowed;
}

.k-timepicker-cal {
    color: var(--k-text-muted);
    margin-right: 10px;
    margin-left: 10px;
    flex-shrink: 0;
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

.k-message-area {
    min-height: 20px;
    font-size: 0.7rem;
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
