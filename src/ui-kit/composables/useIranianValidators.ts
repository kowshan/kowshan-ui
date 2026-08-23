// composables/useIranianValidators.ts
// Validation helpers for Iranian identifiers — pure functions, zero deps.
//   - ملی code (10-digit checksum)
//   - بانک کارت (Luhn) + bank detection by BIN
//   - شبا / IBAN (ISO 7064 mod-97) + bank detection by prefix
//   - کد پستی (format + sanity)

import { usePersianNumbers } from './usePersianNumbers'

/* ---- bank BIN (first 6 digits of card) → bank ---- */
const CARD_BINS: { bin: string; name: string; en: string; color: string }[] = [
    { bin: '603799', name: 'ملی', en: 'Melli', color: '#10b981' },
    { bin: '603770', name: 'کشاورزی', en: 'Keshavarzi', color: '#84cc16' },
    { bin: '589210', name: 'ملت', en: 'Mellat', color: '#f59e0b' },
    { bin: '627488', name: 'کارآفرین', en: 'Karafarin', color: '#6366f1' },
    { bin: '627353', name: 'تجارت', en: 'Tejarat', color: '#3b82f6' },
    { bin: '627961', name: 'صنعت و معدن', en: 'Sanat', color: '#0ea5e9' },
    { bin: '603769', name: 'صادرات', en: 'Saderat', color: '#8b5cf6' },
    { bin: '621986', name: 'سامان', en: 'Saman', color: '#14b8a6' },
    { bin: '628023', name: 'مسکن', en: 'Maskan', color: '#f97316' },
    { bin: '610433', name: 'ملل', en: 'Melal', color: '#ef4444' },
    { bin: '606373', name: 'مهر ایران', en: 'Mehr', color: '#d946ef' },
    { bin: '639346', name: 'سپه', en: 'Sepah', color: '#22c55e' },
    { bin: '639599', name: 'قوامین', en: 'Ghavamin', color: '#06b6d4' },
    { bin: '627412', name: 'اقتصاد نوین', en: 'Eghtesad', color: '#a855f7' },
    { bin: '622106', name: 'پارسیان', en: 'Parsian', color: '#ec4899' },
    { bin: '502229', name: 'پاسارگاد', en: 'Pasargad', color: '#eab308' },
    { bin: '639370', name: 'سینا', en: 'Sina', color: '#84cc16' },
    { bin: '627648', name: 'توسعه صادرات', en: 'ExportDev', color: '#0d9488' },
    { bin: '502908', name: 'توسعه تعاون', en: 'Taavon', color: '#ca8a04' },
]

/* ---- Sheba (3-digit bank prefix) → bank ---- */
const SHIBA_BANKS: { code: string; name: string; en: string }[] = [
    { code: '010', name: 'ملی', en: 'Melli' },
    { code: '011', name: 'ملت', en: 'Mellat' },
    { code: '012', name: 'تجارت', en: 'Tejarat' },
    { code: '013', name: 'رفاه', en: 'Refah' },
    { code: '014', name: 'مسکن', en: 'Maskan' },
    { code: '015', name: 'کشاورزی', en: 'Keshavarzi' },
    { code: '016', name: 'سپه', en: 'Sepah' },
    { code: '017', name: 'صادرات', en: 'Saderat' },
    { code: '018', name: 'ملی توسعه', en: 'MelliDev' },
    { code: '019', name: 'توسعه صادرات', en: 'ExportDev' },
    { code: '020', name: 'توسعه تعاون', en: 'Taavon' },
    { code: '021', name: 'پست بانک', en: 'PostBank' },
    { code: '022', name: 'توسعه', en: 'Tosee' },
    { code: '051', name: 'مهر ایران', en: 'Mehr' },
    { code: '052', name: 'سامان', en: 'Saman' },
    { code: '053', name: 'پاسارگاد', en: 'Pasargad' },
    { code: '054', name: 'سینا', en: 'Sina' },
    { code: '055', name: 'کارآفرین', en: 'Karafarin' },
    { code: '056', name: 'پارسیان', en: 'Parsian' },
    { code: '057', name: 'اقتصاد نوین', en: 'Eghtesad' },
    { code: '058', name: 'قوامین', en: 'Ghavamin' },
    { code: '059', name: 'سرمایه', en: 'Sarmayeh' },
    { code: '060', name: 'گردشگری', en: 'Tourism' },
    { code: '061', name: 'انصار', en: 'Ansar' },
    { code: '062', name: 'خاورمیانه', en: 'MiddleEast' },
    { code: '063', name: 'شهر', en: 'Shahr' },
    { code: '064', name: 'ایران زمین', en: 'IranZamin' },
    { code: '066', name: 'داده', en: 'Dade' },
    { code: '070', name: 'دی', en: 'Day' },
    { code: '072', name: 'رسالت', en: 'Resalat' },
]

export function useIranianValidators() {
    const { toEnglishDigits } = usePersianNumbers()

    const digits = (v: string) => toEnglishDigits(v).replace(/\D/g, '')

    /* ---- کد ملی: 10 digits with checksum ---- */
    const isValidNationalId = (id: string): boolean => {
        const d = digits(id)
        if (!/^[0-9]{10}$/.test(d)) return false
        // all-same-digit codes are invalid (e.g. 1111111111)
        if (new Set(d).size === 1) return false
        const check = Number(d[9])
        let sum = 0
        for (let i = 0; i < 9; i++) {
            sum += Number(d[i]) * (10 - i)
        }
        const rem = sum % 11
        return rem < 2 ? check === rem : check === 11 - rem
    }

    /* ---- شماره کارت: 16 digits + Luhn + BIN lookup ---- */
    const luhn = (num: string): boolean => {
        let sum = 0
        let double = false
        for (let i = num.length - 1; i >= 0; i--) {
            let d = Number(num[i])
            if (double) {
                d *= 2
                if (d > 9) d -= 9
            }
            sum += d
            double = !double
        }
        return sum % 10 === 0
    }

    const bankFromCard = (cardNumber: string) => {
        const bin = digits(cardNumber).slice(0, 6)
        return CARD_BINS.find(b => b.bin === bin) ?? null
    }

    const validateCard = (cardNumber: string) => {
        const d = digits(cardNumber)
        const valid = d.length === 16 && luhn(d)
        return { valid, bank: d.length >= 6 ? bankFromCard(d) : null, digits: d }
    }

    /* ---- شبا: IR + 24 digits, ISO 7064 mod-97 ---- */
    const normalizeShiba = (v: string) => {
        const clean = toEnglishDigits(v).replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        return clean.startsWith('IR') ? clean : 'IR' + clean
    }

    const isValidShiba = (sh: string): boolean => {
        const s = normalizeShiba(sh)
        if (!/^IR\d{24}$/.test(s)) return false
        // move "IR" to the end and replace letters with digits (A=10 … Z=35)
        const rearranged = s.slice(4) + s.slice(0, 4)
        const numeric = rearranged.replace(/[A-Z]/g, ch => String(ch.charCodeAt(0) - 55))
        // mod-97 of a big number — process in chunks
        let rem = 0
        for (let i = 0; i < numeric.length; i += 7) {
            rem = (rem * 10_000_000 + Number(numeric.slice(i, i + 7))) % 97
        }
        return rem === 1
    }

    const bankFromShiba = (sh: string) => {
        const s = normalizeShiba(sh)
        const code = s.slice(2, 5)
        return SHIBA_BANKS.find(b => b.code === code) ?? null
    }

    /* ---- کد پستی: 10 digits, not all zeros, plausible district ---- */
    const isValidPostalCode = (code: string): boolean => {
        const d = digits(code)
        if (!/^[0-9]{10}$/.test(d)) return false
        if (new Set(d).size === 1) return false
        // Iranian postal codes start with 1-9 and the 4th digit is 0-5 (district rule)
        const first = Number(d[0])
        const district = Number(d[3])
        return first >= 1 && first <= 9 && district <= 5
    }

    /* ---- شماره موبایل: 11 digits starting 09 (can be passed with or without +98/۰۹۸) ---- */
    const isValidMobile = (mobile: string): boolean => {
        let d = digits(mobile)
        if (d.startsWith('98')) d = '0' + d.slice(2)
        return /^09\d{9}$/.test(d)
    }

    /* ---- شماره ثابت: 11 digits, area code 0X ---- */
    const isValidLandline = (phone: string): boolean => {
        const d = digits(phone)
        return /^0\d{10}$/.test(d)
    }

    return {
        isValidNationalId,
        validateCard,
        luhn,
        bankFromCard,
        CARD_BINS,
        normalizeShiba,
        isValidShiba,
        bankFromShiba,
        SHIBA_BANKS,
        isValidPostalCode,
        isValidMobile,
        isValidLandline
    }
}
