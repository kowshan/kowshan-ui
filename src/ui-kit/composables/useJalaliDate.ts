// composables/useJalaliDate.ts
// Jalali-aware date helpers shared by the date pickers, reservation fields
// and anywhere the kit deals with "display in Jalali, store in Gregorian".

import { computed } from 'vue'
import {
    getCurrentJalaliDate, getJalaliMonthDays, toGregorian, toJalali
} from '../calendar/core/calendarEngine'
import { usePersianNumbers } from './usePersianNumbers'

export type JalaliDate = { year: number; month: number; day: number }

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Parse a stored value (Jalali "1405/05/20" or Gregorian "2026-08-11" / ISO)
 * into Jalali parts. Falls back to today.
 */
export function parseJalali(value?: string | null, now?: JalaliDate): JalaliDate {
    const fallback = now ?? getCurrentJalaliDate()
    if (!value) return { ...fallback }

    const parts = value.split('-').join('/').split('/').map(Number)
    if (parts.length !== 3 || parts.some(n => isNaN(n))) return { ...fallback }

    const [a, b, c] = parts
    // heuristic: 4-digit first part in the Jalali era = Jalali "1405/05/20";
    // otherwise a 4-digit first part = Gregorian "2026-08-11" (year first);
    // legacy year-last Gregorian "11/08/2026" is also accepted.
    if (a >= 1200 && a <= 1600) {
        return {
            year: a,
            month: Math.min(12, Math.max(1, b)),
            day: Math.min(getJalaliMonthDays(a, Math.min(12, Math.max(1, b))), Math.max(1, c))
        }
    }
    if (a >= 1000 && a <= 9999) {
        const g = new Date(a, Math.min(12, Math.max(1, b)) - 1, Math.max(1, c))
        const j = toJalali(g)
        return { year: j.year, month: j.month, day: j.day }
    }
    if (c >= 1200 && c <= 1600) {
        const g = new Date(c, b - 1, a)
        const j = toJalali(g)
        return { year: j.year, month: j.month, day: j.day }
    }
    return { ...fallback }
}

/**
 * Convert Jalali parts to the requested output format:
 *  - 'jalali'    → "1405/05/20"
 *  - 'gregorian' → "2026-08-11"  (for the database)
 *  - 'iso'       → "2026-08-11T00:00:00"
 */
export function formatJalali(date: JalaliDate, outputFormat: 'jalali' | 'gregorian' | 'iso' = 'jalali'): string {
    if (outputFormat === 'gregorian' || outputFormat === 'iso') {
        const g = toGregorian(date.year, date.month, date.day)
        const y = g.getFullYear()
        const m = pad(g.getMonth() + 1)
        const d = pad(g.getDate())
        return outputFormat === 'iso' ? `${y}-${m}-${d}T00:00:00` : `${y}-${m}-${d}`
    }
    return `${date.year}/${pad(date.month)}/${pad(date.day)}`
}

/** Days between two Jalali dates (a - b). Positive when a is after b. */
export function jalaliDiffDays(a: JalaliDate, b: JalaliDate): number {
    const ga = toGregorian(a.year, a.month, a.day)
    const gb = toGregorian(b.year, b.month, b.day)
    return Math.round((ga.getTime() - gb.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Reactive Jalali date helpers for a component.
 * `date` is a ref whose value is a stored string (Jalali or Gregorian);
 * every helper stays in sync automatically.
 */
export function useJalaliDate(modelValue: () => string | null | undefined) {
    const { toPersianDigits } = usePersianNumbers()

    const now = getCurrentJalaliDate()

    const parsed = computed<JalaliDate>(() => parseJalali(modelValue(), now))

    /** "۱۴۰۵/۰۵/۲۰" — the display form used by fields and pickers */
    const display = computed(() =>
        `${toPersianDigits(String(parsed.value.year))}/${toPersianDigits(pad(parsed.value.month))}/${toPersianDigits(pad(parsed.value.day))}`
    )

    /** "شنبه، ۲۰ مرداد ۱۴۰۵" */
    const longDisplay = computed(() => {
        const d = parsed.value
        return `${MONTHS[d.month - 1]} ${toPersianDigits(String(d.day))}، ${toPersianDigits(String(d.year))}`
    })

    const monthName = computed(() => MONTHS[parsed.value.month - 1])

    const toGregorianString = (format: 'jalali' | 'gregorian' | 'iso' = 'gregorian') =>
        formatJalali(parsed.value, format)

    return {
        now,
        parsed,
        display,
        longDisplay,
        monthName,
        toGregorianString,
        parseJalali,
        formatJalali,
        jalaliDiffDays
    }
}
