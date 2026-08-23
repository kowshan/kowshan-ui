// composables/useDateRange.ts
// Check-in / check-out range logic for reservations — Jalali-aware.
// The values are stored strings (Jalali "1405/05/20" or Gregorian "2026-08-11"),
// display is always Jalali with Persian digits.

import { ref, computed } from 'vue'
import {
    parseJalali, formatJalali, jalaliDiffDays, type JalaliDate
} from './useJalaliDate'
import { usePersianNumbers } from './usePersianNumbers'

export type DateRangeOptions = {
    /** minimum stay in nights */
    minNights?: number
    /** maximum stay in nights (0 = unlimited) */
    maxNights?: number
    /** output format of emitted values */
    outputFormat?: 'jalali' | 'gregorian' | 'iso'
    /** true = check-in can't be before today */
    restrictPast?: boolean
}

export function useDateRange(options: DateRangeOptions = {}) {
    const checkIn = ref<string | null>(null)
    const checkOut = ref<string | null>(null)
    const touched = ref(false)

    const { toPersianDigits } = usePersianNumbers()

    const fmt = options.outputFormat ?? 'gregorian'

    const inDate = computed<JalaliDate | null>(() => checkIn.value ? parseJalali(checkIn.value) : null)
    const outDate = computed<JalaliDate | null>(() => checkOut.value ? parseJalali(checkOut.value) : null)

    const nights = computed(() => {
        if (!inDate.value || !outDate.value) return 0
        const diff = jalaliDiffDays(outDate.value, inDate.value)
        return diff > 0 ? diff : 0
    })

    const isValid = computed(() => {
        if (!inDate.value || !outDate.value) return false
        return nights.value >= Math.max(1, options.minNights ?? 1)
    })

    const hasRange = computed(() => !!checkIn.value && !!checkOut.value)

    /** nights count in Persian digits, e.g. "۳" */
    const nightsFa = computed(() => (nights.value ? toPersianDigits(String(nights.value)) : '۰'))

    /** "۱۴۰۵/۰۵/۲۰ تا ۱۴۰۵/۰۵/۲۲" */
    const rangeLabel = computed(() => {
        if (!inDate.value || !outDate.value) return ''
        const a = `${toPersianDigits(String(inDate.value.year))}/${toPersianDigits(String(inDate.value.month).padStart(2, '0'))}/${toPersianDigits(String(inDate.value.day).padStart(2, '0'))}`
        const b = `${toPersianDigits(String(outDate.value.year))}/${toPersianDigits(String(outDate.value.month).padStart(2, '0'))}/${toPersianDigits(String(outDate.value.day).padStart(2, '0'))}`
        return `${a} تا ${b}`
    })

    const error = computed<string | null>(() => {
        if (!touched.value || !checkIn.value) return null
        if (!checkOut.value) return 'تاریخ خروج را انتخاب کنید'
        if (nights.value < 1) return 'تاریخ خروج باید بعد از ورود باشد'
        if (options.minNights && nights.value < options.minNights)
            return `حداقل اقامت ${toPersianDigits(String(options.minNights))} شب است`
        if (options.maxNights && nights.value > options.maxNights)
            return `حداکثر اقامت ${toPersianDigits(String(options.maxNights))} شب است`
        return null
    })

    /** does the range overlap any day in `bookedDays` (array of jalali day numbers)? */
    const overlaps = (bookedDays: Record<string, JalaliDate> | JalaliDate[]): boolean => {
        if (!inDate.value || !outDate.value) return false
        const list = Array.isArray(bookedDays) ? bookedDays : Object.values(bookedDays)
        for (const b of list) {
            const diffIn = jalaliDiffDays(b, inDate.value)
            const diffOut = jalaliDiffDays(b, outDate.value)
            // booked day is inside [checkIn, checkOut)
            if (diffIn >= 0 && diffOut > 0) return true
        }
        return false
    }

    const setRange = (inValue: string | null, outValue: string | null) => {
        checkIn.value = inValue
        checkOut.value = outValue
        touched.value = true
    }

    const clear = () => {
        checkIn.value = null
        checkOut.value = null
        touched.value = false
    }

    /** emit-ready values */
    const output = computed(() => {
        const format = (d: JalaliDate | null) => (d ? formatJalali(d, fmt) : null)
        return { checkIn: format(inDate.value), checkOut: format(outDate.value), nights: nights.value }
    })

    return {
        checkIn, checkOut, touched,
        inDate, outDate, nights, nightsFa, rangeLabel,
        isValid, hasRange, error, overlaps, setRange, clear, output
    }
}
