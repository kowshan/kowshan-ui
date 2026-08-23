// composables/useGuestPicker.ts
// Guest / room counters for reservation fields (adults, children, rooms).

import { ref, computed } from 'vue'
import { usePersianNumbers } from './usePersianNumbers'

export type GuestKey = 'adults' | 'children' | 'rooms'

export type GuestConfig = {
    adults?: { min?: number; max?: number; label?: string; sub?: string }
    children?: { min?: number; max?: number; label?: string; sub?: string }
    rooms?: { min?: number; max?: number; label?: string; sub?: string }
    /** default values applied on mount */
    defaults?: Partial<Record<GuestKey, number>>
}

type Section = {
    key: GuestKey
    label: string
    sub: string
    min: number
    max: number
    count: number
}

export function useGuestPicker(config: GuestConfig = {}) {
    const { toPersianDigits } = usePersianNumbers()

    const counts = ref<Record<GuestKey, number>>({
        adults: config.defaults?.adults ?? 1,
        children: config.defaults?.children ?? 0,
        rooms: config.defaults?.rooms ?? 1
    })

    const sections = computed<Section[]>(() => [
        {
            key: 'adults',
            label: config.adults?.label ?? 'بزرگسال',
            sub: config.adults?.sub ?? '۱۳ سال به بالا',
            min: config.adults?.min ?? 1,
            max: config.adults?.max ?? 9,
            count: counts.value.adults
        },
        {
            key: 'children',
            label: config.children?.label ?? 'کودک',
            sub: config.children?.sub ?? '۲ تا ۱۲ سال',
            min: config.children?.min ?? 0,
            max: config.children?.max ?? 6,
            count: counts.value.children
        },
        {
            key: 'rooms',
            label: config.rooms?.label ?? 'اتاق',
            sub: config.rooms?.sub ?? '',
            min: config.rooms?.min ?? 1,
            max: config.rooms?.max ?? 5,
            count: counts.value.rooms
        }
    ])

    const total = computed(() => counts.value.adults + counts.value.children)
    const totalFa = computed(() => toPersianDigits(String(total.value)))

    const summary = computed(() => {
        const parts: string[] = []
        if (counts.value.adults > 0) parts.push(`${toPersianDigits(String(counts.value.adults))} بزرگسال`)
        if (counts.value.children > 0) parts.push(`${toPersianDigits(String(counts.value.children))} کودک`)
        if (counts.value.rooms > 0) parts.push(`${toPersianDigits(String(counts.value.rooms))} اتاق`)
        return parts.join('، ')
    })

    const increment = (key: GuestKey) => {
        const s = sections.value.find(x => x.key === key)
        if (!s) return
        if (counts.value[key] < s.max) counts.value[key]++
    }

    const decrement = (key: GuestKey) => {
        const s = sections.value.find(x => x.key === key)
        if (!s) return
        if (counts.value[key] > s.min) counts.value[key]--
    }

    const canInc = (key: GuestKey) => {
        const s = sections.value.find(x => x.key === key)
        return s ? counts.value[key] < s.max : false
    }

    const canDec = (key: GuestKey) => {
        const s = sections.value.find(x => x.key === key)
        return s ? counts.value[key] > s.min : false
    }

    const set = (key: GuestKey, value: number) => {
        const s = sections.value.find(x => x.key === key)
        if (!s) return
        counts.value[key] = Math.max(s.min, Math.min(s.max, value))
    }

    const reset = () => {
        counts.value = {
            adults: config.defaults?.adults ?? 1,
            children: config.defaults?.children ?? 0,
            rooms: config.defaults?.rooms ?? 1
        }
    }

    /** reactive snapshot for v-model */
    const value = computed(() => ({
        adults: counts.value.adults,
        children: counts.value.children,
        rooms: counts.value.rooms,
        total: total.value
    }))

    return {
        sections, counts, total, totalFa, summary,
        increment, decrement, canInc, canDec, set, reset, value
    }
}
