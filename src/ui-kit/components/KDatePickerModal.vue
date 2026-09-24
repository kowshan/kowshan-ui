<!-- components/KDatePickerModal.vue -->
<template>
    <KModal
        :visible="visible"
        :title="title"
        size="sm"
        @update:visible="onOverlay"
    >
        <!-- Live preview + today -->
        <div class="k-dpm-preview">
            <span class="k-dpm-day">{{ day }}</span>
            <span class="k-dpm-meta">{{ monthName }} {{ year }}</span>
            <button type="button" class="k-dpm-today" @click="goToday">
                امروز
            </button>
        </div>

        <!-- Wheel -->
        <KWheelPicker
            :columns="columns"
            :model-value="[yearIdx, monthIdx, dayIdx]"
            :rows="5"
            :item-height="40"
            @update:model-value="onWheelChange"
        />

        <!-- Footer -->
        <template #footer>
            <KButton
                text="انصراف"
                bg-color="#f1f5f9"
                text-color="#475569"
                @click="cancel"
            />
            <KButton
                text="تأیید"
                bg-color="var(--k-primary)"
                text-color="#ffffff"
                @click="confirm"
            />
        </template>
    </KModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KModal from './KModal.vue'
import KButton from './KButton.vue'
import KWheelPicker, { type KWheelColumn } from './KWheelPicker.vue'
import {
    getCurrentJalaliDate, getJalaliMonthDays, toGregorian, toJalali
} from '../calendar/core/calendarEngine'

const props = withDefaults(defineProps<{
    visible: boolean
    /** date value; format depends on `outputFormat` */
    modelValue?: string | null
    title?: string
    /** years to show before/after the current year */
    yearRange?: [number, number]
    /**
     * Output format of the emitted value:
     *  - 'jalali'    → "1405/05/20"
     *  - 'gregorian' → "2026-08-11"  (for the database)
     *  - 'iso'       → "2026-08-11T00:00:00"
     */
    outputFormat?: 'jalali' | 'gregorian' | 'iso'
}>(), {
    modelValue: null,
    title: 'انتخاب تاریخ',
    outputFormat: 'jalali'
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'update:modelValue': [value: string]
    'confirm': [value: string]
    'cancel': []
}>()

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

const today = getCurrentJalaliDate()

const year = ref(today.year)
const month = ref(today.month)
const day = ref(today.day)

/* Year list */
const years = computed(() => {
    const [back, forward] = props.yearRange ?? [60, 10]
    const start = today.year - back
    const end = today.year + forward
    const list: number[] = []
    for (let y = start; y <= end; y++) list.push(y)
    return list
})

const yearIdx = computed(() => Math.max(0, years.value.indexOf(year.value)))
const monthIdx = computed(() => month.value - 1)

const daysInMonth = computed(() => getJalaliMonthDays(year.value, month.value))
const days = computed(() => {
    const list: number[] = []
    for (let d = 1; d <= daysInMonth.value; d++) list.push(d)
    return list
})
const dayIdx = computed(() => Math.min(days.value.length - 1, day.value - 1))

const columns = computed<KWheelColumn[]>(() => [
    { key: 'year', values: years.value.map(y => String(y)) },
    { key: 'month', values: MONTHS },
    { key: 'day', values: days.value.map(d => String(d)) },
])

const monthName = computed(() => MONTHS[month.value - 1])


/* Wheel change */
const onWheelChange = (indices: number[]) => {
    const y = years.value[indices[0]] ?? year.value
    const m = (indices[1] ?? 0) + 1
    const maxDay = getJalaliMonthDays(y, m)
    const d = Math.min(maxDay, (indices[2] ?? 0) + 1)
    year.value = y
    month.value = m
    day.value = d
}

/* Today */
const goToday = () => {
    year.value = today.year
    month.value = today.month
    day.value = today.day
}

/* Init from modelValue on open */
watch(() => props.visible, (v) => {
    if (!v) return
    let y = today.year
    let m = today.month
    let d = today.day
    if (props.modelValue) {
        // try to parse as jalali or gregorian
        const parts = props.modelValue.split('-').join('/').split('/').map(Number)
        if (parts.length === 3 && parts.every(n => !isNaN(n))) {
            const [a, b, c] = parts
            // heuristic: 4-digit first part = jalali "1405/05/20";
            // otherwise 4-digit first part = gregorian "2026-08-11" (year first)
            if (a >= 1200 && a <= 1600) {
                // jalali "1405/05/20"
                y = a; m = b; d = Math.min(c, getJalaliMonthDays(a, b))
            } else if (a >= 1000 && a <= 9999) {
                // gregorian "2026-08-11" → convert to jalali
                const g = new Date(a, b - 1, Math.max(1, c))
                const j = toJalali(g)
                y = j.year; m = j.month; d = j.day
            } else if (c >= 1200 && c <= 1600) {
                // legacy gregorian "11/08/2026" → convert to jalali
                const g = new Date(c, b - 1, a)
                const j = toJalali(g)
                y = j.year; m = j.month; d = j.day
            }
        }
    }
    year.value = Math.max(years.value[0], Math.min(years.value[years.value.length - 1], y))
    month.value = m
    day.value = d
})

const onOverlay = (v: boolean) => {
    if (!v) emits('cancel')
    emits('update:visible', v)
}

/* Build the output value per outputFormat */
const formatOutput = (): string => {
    const pad = (n: number) => String(n).padStart(2, '0')
    if (props.outputFormat === 'gregorian' || props.outputFormat === 'iso') {
        const g = toGregorian(year.value, month.value, day.value)
        const y = g.getFullYear()
        const m = pad(g.getMonth() + 1)
        const d = pad(g.getDate())
        if (props.outputFormat === 'iso') {
            return `${y}-${m}-${d}T00:00:00`
        }
        return `${y}-${m}-${d}`
    }
    return `${year.value}/${pad(month.value)}/${pad(day.value)}`
}

const confirm = () => {
    const value = formatOutput()
    emits('update:modelValue', value)
    emits('confirm', value)
    emits('update:visible', false)
}

const cancel = () => {
    emits('cancel')
    emits('update:visible', false)
}
</script>

<style scoped>
.k-dpm-preview {
    text-align: center;
    padding: 6px 0 14px 0;
    border-bottom: 1px dashed var(--k-border, #e2e8f0);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.k-dpm-day {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
}

.k-dpm-meta {
    font-size: 0.9rem;
    color: var(--k-text-secondary, #64748b);
}

.k-dpm-today {
    margin-inline-end: auto;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 30%, transparent);
    border-radius: 999px;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-dpm-today:hover {
    background: color-mix(in srgb, var(--k-primary, #1db954) 20%, transparent);
}
</style>
