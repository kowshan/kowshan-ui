// Shared Persian/Arabic digit → ASCII converter
// Bug-safe: only converts known FA/AR digits, passes ASCII through unchanged
const FA = '۰۱۲۳۴۵۶۷۸۹'
const AR = '٠١٢٣٤٥٦٧٨٩'

export const toAsciiDigits = (s: string): string =>
    s.replace(/[۰-۹]/g, d => String(FA.indexOf(d)))
     .replace(/[٠-٩]/g, d => String(AR.indexOf(d)))
