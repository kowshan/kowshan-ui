// composables/useAvailabilityGrid.ts
// Jalali availability-grid logic (month math + per-day statuses + selection).
// Extracted from KAvailabilityGrid so reservation pages can reuse the same
// month navigation without the component.

import { computed, ref, watch } from 'vue'
import {
    getCurrentJalaliDate, getJalaliMonthDays, getFirstWeekday
} from '../calendar/core/calendarEngine'
import { usePersianNumbers } from './usePersianNumbers'

export type AvailabilityStatus = 'free' | 'booked' | 'partial' | 'blocked'

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
    free: 'آزاد',
    booked: 'رزرو',
    partial: 'نیمه',
    blocked: 'مسدود'
}

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سهشنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

export type AvailabilityGridOptions = {
    /** initial Jalali year (defaults to current) */
    year?: number
    /** initial Jalali month 1-12 (defaults to current) */
    month?: number
    /** availability per day of month; missing days default to 'free' */
    statuses?: Record<number, AvailabilityStatus>
    selectable?: boolean
}

export function useAvailabilityGrid(options: AvailabilityGridOptions = {}) {
    const { toPersianDigits } = usePersianNumbers()

    const today = getCurrentJalaliDate()

    const year = ref(options.year ?? today.year)
    const month = ref(options.month ?? today.month)
    const selectedDay = ref<number | null>(null)

    const monthName = computed(() => MONTHS[month.value - 1])
    const daysInMonth = computed(() => getJalaliMonthDays(year.value, month.value))
    const firstWeekday = computed(() => getFirstWeekday(year.value, month.value))
    const weekDays = computed(() => WEEKDAYS)

    /* Persian week starts Saturday; getFirstWeekday returns 0 for Saturday */
    const leadingCells = computed(() => firstWeekday.value)
    const trailingCells = computed(() => {
        const total = leadingCells.value + daysInMonth.value
        const rem = total % 7
        return rem === 0 ? 0 : 7 - rem
    })

    const statusOf = (day: number): AvailabilityStatus => options.statuses?.[day] ?? 'free'
    const statusLabel = (s: AvailabilityStatus) => AVAILABILITY_LABELS[s]
    const isToday = (day: number) =>
        today.year === year.value && today.month === month.value && today.day === day

    const select = (day: number) => {
        if (options.selectable === false) return
        selectedDay.value = day
    }

    const shiftMonth = (dir: number) => {
        let m = month.value + dir
        let y = year.value
        if (m < 1) { m = 12; y-- }
        if (m > 12) { m = 1; y++ }
        year.value = y
        month.value = m
    }

    const goToday = () => {
        year.value = today.year
        month.value = today.month
    }

    /** days of the current month that are not free */
    const busyDays = computed(() =>
        Object.entries(options.statuses ?? {})
            .filter(([, s]) => s !== 'free')
            .map(([d]) => Number(d))
            .filter(d => d >= 1 && d <= daysInMonth.value)
    )

    /** true if a full-day date falls on a non-free day of the visible month */
    const isBusy = (day: number) => statusOf(day) !== 'free'

    const faNum = (n: number | string) => toPersianDigits(String(n))

    // keep in sync with external year/month props
    const sync = (y?: number, m?: number) => {
        if (y) year.value = y
        if (m) month.value = m
    }

    watch(() => [options.year, options.month], ([y, m]) => sync(y, m))

    return {
        today,
        year, month, monthName, daysInMonth, firstWeekday,
        weekDays, leadingCells, trailingCells,
        statusOf, statusLabel, isToday, isBusy, busyDays,
        selectedDay, select, shiftMonth, goToday, sync, faNum
    }
}
