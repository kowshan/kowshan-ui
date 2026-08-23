// composables/useMagicFill.ts
/**
 * "Magic fill" — turns a blob of free-form Persian text into structured
 * fields with a confidence score per field. Paste a raw lead/note like:
 *
 *   "علی رضایی — ۰۹۱۲۱۲۳۴۵۶۷ — تهران، سعادت‌آباد — خریدار آپارتمان ۱۰۰ متری از سایت"
 *
 * and get { name, phone, email, city, amount, intent, source, … } back,
 * ready to pre-fill a form. Every extractor is a pure regex/keyword
 * heuristic, so it runs fully client-side with zero dependencies.
 */
import { ref, computed, type ComputedRef } from 'vue'
import { usePersianNumbers } from './usePersianNumbers'

export type Confidence = 'high' | 'medium' | 'low'

export type MagicFieldDef = {
    key: string
    label: string
    /** extract from the (normalized) text; return null when not found */
    extract: (text: string) => { value: string; confidence: Confidence; source?: string } | null
}

export type MagicField = {
    key: string
    label: string
    value: string
    confidence: Confidence
    source?: string
}

/** default field set — the common CRM lead/contact facts */
export const DEFAULT_MAGIC_FIELDS: MagicFieldDef[] = [
    {
        key: 'phone',
        label: 'تلفن',
        extract: (t) => {
            // mobile first: 0912 123 4567 / ۰۹۱۲۱۲۳۴۵۶۷ (full 11 digits), then landline: 021-22334455
            const m = t.match(/(?:\+98|0098|0)?9\d{2}[-\s]?\d{3}[-\s]?\d{4}/)
                || t.match(/(?:0\d{2}|0\d)[-\s]?\d{3}[-\s]?\d{3,4}/)
            if (!m) return null
            return { value: m[0].replace(/[-\s]/g, ''), confidence: 'high', source: m[0] }
        }
    },
    {
        key: 'email',
        label: 'ایمیل',
        extract: (t) => {
            const m = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
            if (!m) return null
            return { value: m[0], confidence: 'high', source: m[0] }
        }
    },
    {
        key: 'city',
        label: 'شهر',
        extract: (t) => {
            const cities = ['تهران', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'کرج', 'قم', 'اهواز', 'رشت', 'کرمان', 'یزد', 'ارومیه', 'زنجان', 'همدان', 'ساری', 'گرگان', 'بندرعباس', 'اردبیل']
            for (const c of cities) {
                if (t.includes(c)) {
                    return { value: c, confidence: 'high', source: c }
                }
            }
            return null
        }
    },
    {
        key: 'amount',
        label: 'بودجه',
        extract: (t) => {
            // ۱.۵ میلیارد · ۸۵۰ میلیون · 2,500 هزار · 3 میلیون تومان
            const m = t.match(/(\d+(?:[.,]\d+)?)\s*(میلیارد|میلیون|هزار)(?:\s*تومان)?/)
            if (!m) return null
            const unit = m[2] === 'میلیارد' ? 1e9 : m[2] === 'میلیون' ? 1e6 : 1e3
            const num = Number(m[1].replace(',', '.')) * unit
            return { value: String(Math.round(num)), confidence: 'medium', source: m[0] }
        }
    },
    {
        key: 'intent',
        label: 'نوع نیاز',
        extract: (t) => {
            const map: [RegExp, string][] = [
                [/(خرید|خریدار)/, 'خرید'],
                [/(فروش|فروشنده)/, 'فروش'],
                [/(اجاره|مستاجر)/, 'اجاره'],
                [/(رهن)/, 'رهن']
            ]
            for (const [re, label] of map) {
                const m = t.match(re)
                if (m) return { value: label, confidence: 'medium', source: m[0] }
            }
            return null
        }
    },
    {
        key: 'source',
        label: 'منبع',
        extract: (t) => {
            const map: [RegExp, string][] = [
                [/(از سایت|سایت)/, 'سایت'],
                [/(معرفی)/, 'معرفی'],
                [/(اینستاگرام|اینستا)/, 'اینستاگرام'],
                [/(کمپین)/, 'کمپین'],
                [/(تماس)/, 'تماس']
            ]
            for (const [re, label] of map) {
                const m = t.match(re)
                if (m) return { value: label, confidence: 'medium', source: m[0] }
            }
            return null
        }
    }
]

export function useMagicFill(fieldDefs: MagicFieldDef[] = DEFAULT_MAGIC_FIELDS) {
    const { normalize } = usePersianNumbers()

    const text = ref('')

    /** run every extractor over the normalized text */
    const result = computed<{ fields: MagicField[]; unmatched: string; hasText: boolean }>(() => {
        const norm = normalize(text.value)
        const fields: MagicField[] = []

        for (const def of fieldDefs) {
            try {
                const hit = def.extract(norm)
                if (hit) {
                    fields.push({
                        key: def.key,
                        label: def.label,
                        value: hit.value,
                        confidence: hit.confidence,
                        source: hit.source
                    })
                }
            } catch {
                /* a failing extractor never breaks the whole parse */
            }
        }

        // everything not consumed by any extractor — drop whole words that
        // contained a matched fragment (e.g. «خریدار» → after «خرید» matched)
        const consumed = new Set(fields.flatMap(f => (f.source ? [f.source] : [])))
        let unmatched = norm
        for (const frag of consumed) {
            const esc = frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            unmatched = unmatched.replace(new RegExp(`\\S*${esc}\\S*`, 'g'), ' ')
        }
        unmatched = unmatched.replace(/[\s،,؛;\-—]+/g, ' ').trim()

        return { fields, unmatched, hasText: !!norm.trim() }
    })

    const setText = (value: string) => { text.value = value }
    const clear = () => { text.value = '' }

    /** set a parsed field's value (editing after the fact) */
    const setFieldValue = (key: string, value: string) => {
        const f = result.value.fields.find(x => x.key === key)
        if (f) f.value = value
    }

    /** build the final payload object (empty values dropped) */
    const payload = computed<Record<string, string>>(() => {
        const out: Record<string, string> = {}
        for (const f of result.value.fields) {
            if (f.value) out[f.key] = f.value
        }
        return out
    })

    return { text, result, setText, clear, setFieldValue, payload }
}

export type MagicFill = ReturnType<typeof useMagicFill>
