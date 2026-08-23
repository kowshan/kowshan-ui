// composables/usePersianNumbers.ts

// Convert English/Persian numbers to pure number string
export function usePersianNumbers() {
    
    // Convert Persian/Arabic digits to English
    const toEnglishDigits = (value: string): string => {
        const persianMap: Record<string, string> = {
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
            '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
        }
        return value.replace(/[۰-۹٠-٩]/g, (char) => persianMap[char] || char)
    }
    
    // Convert English digits to Persian
    const toPersianDigits = (value: string): string => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
        return value.replace(/\d/g, (d) => persianDigits[parseInt(d)] ?? '')
    }

    // Normalize Arabic variant characters to their Persian forms
    const normalizeArabicChars = (value: string): string => {
        return value
            .replace(/[ي]/g, 'ی')
            .replace(/[ك]/g, 'ک')
            .replace(/[ةۀ]/g, 'ه')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/[ؤ]/g, 'و')
            .replace(/[ئ]/g, 'ی')
            .replace(/[ى]/g, 'ی')
    }

    // Full normalization for user-typed data: Arabic/Persian digits → Latin,
    // Arabic variant characters → Persian, Arabic punctuation → Latin.
    // This is what every input uses so the app stores clean Latin data
    // regardless of what keyboard layout the user typed with.
    const normalize = (value: string): string => {
        return toEnglishDigits(normalizeArabicChars(value))
            .replace(/[؟]/g, '?')
            .replace(/[،]/g, ',')
            .replace(/[٫٬]/g, '.')
    }
    
    // Convert number to Persian text (fixed for "دوصد" issue)
    const numberToPersianText = (num: number): string => {
        if (num === 0) return 'صفر'
        if (num === null || num === undefined) return ''
        
        const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه']
        const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده']
        const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود']
        const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد']
        
        const convertChunk = (n: number): string => {
            if (n === 0) return ''
            
            let result = ''
            const hundred = Math.floor(n / 100)
            const remainder = n % 100
            
            if (hundred > 0) {
                result += hundreds[hundred]
            }
            
            if (remainder > 0) {
                if (result) result += ' و '
                
                if (remainder < 10) {
                    result += ones[remainder]
                } else if (remainder < 20) {
                    result += teens[remainder - 10]
                } else {
                    const ten = Math.floor(remainder / 10)
                    const one = remainder % 10
                    result += tens[ten]
                    if (one > 0) {
                        result += ' و ' + ones[one]
                    }
                }
            }
            
            return result
        }
        
        const units = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون']
        let result = ''
        let n = num
        let unitIndex = 0
        
        while (n > 0) {
            const chunk = n % 1000
            if (chunk > 0) {
                const chunkText = convertChunk(chunk)
                const unitText = units[unitIndex]
                const prefix = chunkText + (unitText ? ' ' + unitText : '')
                result = prefix + (result ? ' و ' + result : '')
            }
            n = Math.floor(n / 1000)
            unitIndex++
        }
        
        return result
    }
    
    return {
        toEnglishDigits,
        toPersianDigits,
        numberToPersianText,
        normalizeArabicChars,
        normalize
    }
}