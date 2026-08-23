export const functionValidations = {
    // Age validation
    isAdult: (value: number, allValues?: Record<string, any>): boolean | string => {
        const minAge = allValues?.minAge || 18
        if (!value && value !== 0) return true
        if (value >= minAge) return true
        return `سن باید حداقل ${minAge} سال باشد`
    },
    
    // Date range validation
    dateRange: (value: any, allValues?: Record<string, any>): boolean | string => {
        const startDate = allValues?.startDate
        const endDate = allValues?.endDate
        if (!startDate || !endDate) return true
        if (new Date(startDate) <= new Date(endDate)) return true
        return 'تاریخ شروع باید قبل از تاریخ پایان باشد'
    },
    
    // File size validation
    fileSize: (file: File, allValues?: Record<string, any>): boolean | string => {
        const maxSizeMB = allValues?.maxSizeMB || 5
        if (!file) return true
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        if (file.size <= maxSizeBytes) return true
        return `حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`
    },
    
    // File type validation
    fileType: (file: File, allValues?: Record<string, any>): boolean | string => {
        const allowedTypes = allValues?.allowedTypes || []
        if (!file) return true
        if (allowedTypes.includes(file.type)) return true
        return `نوع فایل باید یکی از ${allowedTypes.join(', ')} باشد`
    },
    
    // Persian national ID validation (code meli)
    nationalId: (code: string): boolean | string => {
        if (!code) return true
        
        code = String(code).trim()
        if (!/^\d{10}$/.test(code)) return 'کد ملی باید ۱۰ رقم باشد'
        
        const check = parseInt(code[9])
        let sum = 0
        
        for (let i = 0; i < 9; i++) {
            sum += parseInt(code[i]) * (10 - i)
        }
        
        const remainder = sum % 11
        const isValid = remainder < 2 ? check === remainder : check === 11 - remainder
        
        return isValid || 'کد ملی معتبر نیست'
    },
    
    // Bank card validation (Luhn algorithm)
    bankCard: (card: string): boolean | string => {
        if (!card) return true
        
        card = card.trim()
        if (!/^\d{16}$/.test(card)) return 'شماره کارت باید ۱۶ رقم باشد'
        
        let sum = 0
        let alternate = false
        
        for (let i = card.length - 1; i >= 0; i--) {
            let n = parseInt(card[i])
            if (alternate) {
                n *= 2
                if (n > 9) n -= 9
            }
            sum += n
            alternate = !alternate
        }
        
        return (sum % 10 === 0) || 'شماره کارت معتبر نیست'
    },
    
    // Password confirmation
    passwordMatch: (value: string, allValues?: Record<string, any>): boolean | string => {
        const confirmPassword = allValues?.confirmPassword
        if (!value && !confirmPassword) return true
        if (value === confirmPassword) return true
        return 'رمز عبور و تکرار آن مطابقت ندارند'
    },
    
    // Between numbers
    between: (value: number, allValues?: Record<string, any>): boolean | string => {
        const min = allValues?.min
        const max = allValues?.max
        if (!value && value !== 0) return true
        if (min !== undefined && value < min) return `مقدار باید حداقل ${min} باشد`
        if (max !== undefined && value > max) return `مقدار باید حداکثر ${max} باشد`
        return true
    },
    
    // Min length (string/array)
    minLength: (value: string, allValues?: Record<string, any>): boolean | string => {
        const min = allValues?.min || 1
        if (!value) return true
        if (value.length >= min) return true
        return `حداقل ${min} کاراکتر وارد کنید`
    },
    
    // Max length (string/array)
    maxLength: (value: string, allValues?: Record<string, any>): boolean | string => {
        const max = allValues?.max || 255
        if (!value) return true
        if (value.length <= max) return true
        return `حداکثر ${max} کاراکتر وارد کنید`
    }
} as const

export type FunctionKey = keyof typeof functionValidations