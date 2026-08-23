<!-- components/KDateRange.vue -->
<!--
    KDateRange — check-in / check-out pair for reservations.
    Two clickable fields, each opening the Jalali wheel picker;
    the nights count sits in the middle. Display is always Jalali;
    the emitted value follows `outputFormat` (default gregorian → DB-friendly).
-->
<template>
    <div class="k-range" :class="{ 'has-error': !!range.error.value, 'is-disabled': disabled }">
        <div v-if="label" class="k-range-label">
            {{ label }}
            <span v-if="required" class="k-range-required">*</span>
        </div>

        <div class="k-range-body">
            <!-- Check-in -->
            <button
                type="button"
                class="k-range-field"
                :class="{ 'is-active': activeField === 'in' }"
                :disabled="disabled"
                @click="openField('in')"
            >
                <span class="k-range-field-label">ورود</span>
                <span class="k-range-field-value" :class="{ 'is-empty': !checkInDisplay }">
                    {{ checkInDisplay || 'انتخاب' }}
                </span>
            </button>

            <!-- Nights chip -->
            <div class="k-range-nights" :title="`${range.nightsFa.value} شب`">
                {{ range.nightsFa.value }}
                <span class="k-range-nights-unit">شب</span>
            </div>

            <!-- Check-out -->
            <button
                type="button"
                class="k-range-field"
                :class="{ 'is-active': activeField === 'out' }"
                :disabled="disabled"
                @click="openField('out')"
            >
                <span class="k-range-field-label">خروج</span>
                <span class="k-range-field-value" :class="{ 'is-empty': !checkOutDisplay }">
                    {{ checkOutDisplay || 'انتخاب' }}
                </span>
            </button>
        </div>

        <!-- Message -->
        <div class="k-range-message" v-if="range.error.value">
            <AlertCircle class="icon" /> {{ range.error.value }}
        </div>

        <!-- Pickers -->
        <KDatePickerModal
            v-model:visible="pickerOpen"
            v-model="draftValue"
            :output-format="outputFormat"
            @confirm="commit"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { useDateRange } from '../composables/useDateRange'
import { useJalaliDate } from '../composables/useJalaliDate'
import KDatePickerModal from './KDatePickerModal.vue'

const props = withDefaults(defineProps<{
    modelValue?: { checkIn?: string | null; checkOut?: string | null } | null
    label?: string
    required?: boolean
    disabled?: boolean
    outputFormat?: 'jalali' | 'gregorian' | 'iso'
    minNights?: number
    maxNights?: number
}>(), {
    modelValue: null,
    outputFormat: 'gregorian'
})

const emits = defineEmits<{
    'update:modelValue': [value: { checkIn: string | null; checkOut: string | null; nights: number }]
    'change': [value: { checkIn: string | null; checkOut: string | null; nights: number }]
}>()

const range = useDateRange({
    minNights: props.minNights,
    maxNights: props.maxNights,
    outputFormat: props.outputFormat
})

const activeField = ref<'in' | 'out'>('in')
const pickerOpen = ref(false)
const draftValue = ref<string | null>(null)

const inJalali = useJalaliDate(() => range.checkIn.value)
const outJalali = useJalaliDate(() => range.checkOut.value)

const checkInDisplay = computed(() => (range.checkIn.value ? inJalali.display.value : ''))
const checkOutDisplay = computed(() => (range.checkOut.value ? outJalali.display.value : ''))

const openField = (which: 'in' | 'out') => {
    if (props.disabled) return
    activeField.value = which
    // pre-fill the draft with the current value of that field
    draftValue.value = which === 'in' ? range.checkIn.value : range.checkOut.value
    pickerOpen.value = true
}

const commit = (value: string) => {
    if (activeField.value === 'in') {
        range.checkIn.value = value
        // if checkout now precedes checkin, clear it
        if (range.outDate.value && range.nights.value < 1) range.checkOut.value = null
    } else {
        range.checkOut.value = value
    }
    range.touched.value = true
    emitChange()
}

const emitChange = () => {
    const payload = range.output.value
    emits('update:modelValue', payload)
    emits('change', payload)
}

// sync from parent model
watch(() => props.modelValue, (v) => {
    if (v && (v.checkIn !== range.checkIn.value || v.checkOut !== range.checkOut.value)) {
        range.checkIn.value = v.checkIn ?? null
        range.checkOut.value = v.checkOut ?? null
    }
}, { immediate: true })

defineExpose({ clear: range.clear, validate: () => range.error.value })
</script>

<style scoped>
.k-range {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

.k-range-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-range-required {
    color: var(--k-error);
    margin-right: 2px;
}

.k-range-body {
    display: flex;
    align-items: stretch;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    overflow: hidden;
    transition: border-color 0.15s ease;
}

.k-range-body:focus-within {
    border-color: var(--k-primary);
}

.k-range.has-error .k-range-body {
    border-color: var(--k-error);
}

.k-range.is-disabled .k-range-body {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

.k-range-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s ease;
}

.k-range-field:hover,
.k-range-field.is-active {
    background: var(--k-primary-light);
}

.k-range-field:disabled {
    cursor: not-allowed;
}

.k-range-field-label {
    font-size: 0.62rem;
    color: var(--k-text-muted);
}

.k-range-field-value {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--k-text-primary);
    direction: rtl;
    white-space: nowrap;
}

.k-range-field-value.is-empty {
    color: var(--k-placeholder, var(--k-text-muted));
    font-weight: 500;
}

.k-range-nights {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 10px;
    border-right: 1px dashed var(--k-border);
    border-left: 1px dashed var(--k-border);
    background: var(--k-surface);
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-primary);
    white-space: nowrap;
}

.k-range-nights-unit {
    font-size: 0.58rem;
    font-weight: 500;
    color: var(--k-text-muted);
}

.k-range-message {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    color: var(--k-error);
}

.k-range-message .icon {
    width: 12px;
    height: 12px;
}
</style>
