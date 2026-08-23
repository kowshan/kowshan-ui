<!-- wrappers/KDatePicker.vue -->
<!--
    KDatePicker — Jalali date field.
    picker="modal"     (default) a normal clickable field that opens the
                       Telegram-style wheel picker (KDatePickerModal)
    picker="segmented" the classic three-part input (yyyy / mm / dd)
    Display is always Jalali; the emitted value follows `outputFormat`.
-->
<template>
    <div
        class="k-ui-datepicker"
        :class="{
            'has-error': hasError,
            'has-value': hasValue,
            'is-focused': isFocused,
            'is-disabled': disabled,
            'is-modal': picker === 'modal'
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
            :class="{ 'is-clickable': picker === 'modal' && !disabled && !readonly }"
            @click="picker === 'modal' && openModal()"
        >
            <!-- Modal mode: single clickable field -->
            <template v-if="picker === 'modal'">
                <input
                    :id="inputId"
                    ref="modalInput"
                    class="k-datepicker-field"
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
                <CalendarDays class="k-datepicker-cal" :size="16" />
            </template>

            <!-- Segmented mode: original part-by-part input -->
            <CoreDatePicker
                v-else
                :id="inputId"
                ref="datePickerRef"
                v-model="internalValue"
                v-bind="$attrs"
                :output-format="outputFormat === 'iso' ? 'gregorian' : outputFormat"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                @update:model-value="handleUpdate"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            />

            <!-- Right Icons -->
            <div class="k-right-icons">
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
        </div>

        <!-- Message Area -->
        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle class="message-icon" />
                {{ errorMessage }}
            </div>
        </div>

        <!-- Modal picker -->
        <KDatePickerModal
            v-if="picker === 'modal'"
            v-model:visible="modalOpen"
            v-model="internalValue"
            :output-format="outputFormat"
            @confirm="handleModalConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, AlertCircle, CalendarDays } from 'lucide-vue-next'
import { useId } from '../composables/useId'
import { useJalaliDate } from '../composables/useJalaliDate'
import CoreDatePicker from '../core/CoreDatePicker.vue'
import KDatePickerModal from '../components/KDatePickerModal.vue'

const props = withDefaults(defineProps<{
    modelValue?: string
    label?: string
    clearable?: boolean
    /** Jalali dates only — displayed as yyyy/mm/dd, emitted per `outputFormat` */
    outputFormat?: 'jalali' | 'gregorian' | 'iso'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    /** 'modal' → clickable field opening the wheel picker (default) · 'segmented' → part-by-part input */
    picker?: 'modal' | 'segmented'
}>(), {
    modelValue: '',
    // Persian kit convention: display is always Jalali, the emitted value is
    // Gregorian (or ISO) so it can go straight into the database.
    outputFormat: 'gregorian',
    placeholder: 'انتخاب تاریخ',
    picker: 'modal'
})

const emits = defineEmits<{
    'update:modelValue': [value: string | null]
    'focus': [value: string]
    'blur': [value: string]
    'input': [value: string]
    'change': [value: string]
    'clear': []
}>()

const { id: inputId } = useId('datepicker')

const datePickerRef = ref<InstanceType<typeof CoreDatePicker> | null>(null)
const modalInput = ref<HTMLInputElement | null>(null)
const internalValue = ref<string | undefined>(props.modelValue || undefined)
const modalOpen = ref(false)
const isFocused = ref(false)
const error = ref<string | null>(null)

const { display: jalaliDisplay } = useJalaliDate(() => internalValue.value)

const hasValue = computed(() =>
    internalValue.value !== undefined && internalValue.value !== null && internalValue.value !== ''
)

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

/** modal mode shows the value in Jalali with Persian digits, whatever the output format */
const displayValue = computed(() => (hasValue.value ? jalaliDisplay.value : ''))

const runValidation = (value: string): boolean => {
    if (props.required && !value) {
        error.value = 'این فیلد الزامی است'
        return false
    }
    error.value = null
    return true
}

const handleUpdate = (value: string) => {
    internalValue.value = value
    emits('update:modelValue', value)
    runValidation(value)
}

const handleModalConfirm = (value: string) => {
    internalValue.value = value
    emits('update:modelValue', value)
    runValidation(value)
}

const openModal = () => {
    if (props.disabled || props.readonly) return
    modalOpen.value = true
}

const handleFocus = () => {
    isFocused.value = true
    emits('focus', internalValue.value ?? '')
}

const handleBlur = () => {
    isFocused.value = false
    runValidation(internalValue.value ?? '')
    emits('blur', internalValue.value ?? '')
}

const handleChange = (value: string) => {
    emits('change', value)
}

const clearInput = () => {
    internalValue.value = ''
    emits('update:modelValue', null)
    emits('clear')
}

const focusInput = () => {
    if (props.picker === 'modal') {
        openModal()
    } else {
        datePickerRef.value?.focus()
    }
}

watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal || undefined
        runValidation(newVal || '')
    }
})

defineExpose({
    focus: focusInput,
    blur: () => datePickerRef.value?.blur(),
    clear: clearInput
})
</script>

<style scoped>
.k-ui-datepicker {
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

.k-ui-datepicker.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-ui-datepicker.has-error .k-label {
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

.k-ui-datepicker:not(.is-disabled) .k-input-container:hover {
    border-color: var(--k-text-secondary);
}

.k-ui-datepicker.is-focused .k-input-container {
    border-color: var(--k-primary);
}

.k-ui-datepicker.has-error .k-input-container {
    border-color: var(--k-error);
}

.k-ui-datepicker.is-disabled .k-input-container {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

/* ---- modal mode field ---- */
.k-datepicker-field {
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
    direction: rtl;
}

.k-datepicker-field::placeholder {
    color: var(--k-placeholder, var(--k-text-muted));
}

.k-datepicker-field:disabled {
    cursor: not-allowed;
}

.k-datepicker-cal {
    color: var(--k-text-muted);
    margin-right: 2px;
    flex-shrink: 0;
}

/* ---- segmented mode ---- */
.k-ui-datepicker :deep(.core-datepicker) {
    flex: 1;
    min-width: 0;
    padding: 0 12px;
}

.k-ui-datepicker :deep(.datetime-input) {
    flex: 1;
    min-width: 0;
}

/* Fill the field: split by / with even spacing instead of leaving empty space */
.k-ui-datepicker :deep(.input-parts) {
    width: 100%;
    justify-content: space-between;
    gap: 6px;
    padding: 0;
}

.k-ui-datepicker :deep(.datetime-part) {
    flex: 1;
    width: auto;
    padding: 6px 0;
    font-size: 0.85rem;
    border-bottom: none;
    color: var(--k-text-primary);
}

.k-ui-datepicker :deep(.separator-text) {
    color: var(--k-text-muted);
    font-size: 0.95rem;
    flex-shrink: 0;
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
    margin-right: 2px;
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
