// data/regexValidations.ts

export const regexValidations = {
    // Persian / Iranian specific
    phone: /^09[0-9]{9}$/,
    mobile: /^09[0-9]{9}$/,
    nationalId: /^[0-9]{10}$/,
    postalCode: /^[0-9]{10}$/,
    bankCard: /^[0-9]{16}$/,
    sheba: /^IR[0-9]{24}$/,
    
    // Persian text
    persianText: /^[\u0600-\u06FF\s]+$/,
    persianOnly: /^[\u0600-\u06FF]+$/,
    
    // English text
    englishText: /^[A-Za-z\s]+$/,
    englishOnly: /^[A-Za-z]+$/,
    
    // General
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    
    // Numbers
    number: /^[0-9]+$/,
    decimal: /^[0-9]+(\.[0-9]{1,2})?$/,
    positiveNumber: /^[1-9][0-9]*$/,
    
    // Date & Time
    jalaliDate: /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/,
    gregorianDate: /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/,
    time: /^([01][0-9]|2[0-3]):[0-5][0-9]$/,
    
    // Password strength
    weakPassword: /^.{6,}$/,
    mediumPassword: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    
    // Username & Slug
    username: /^[a-zA-Z0-9_]{3,20}$/,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    
    // Color
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const

export type RegexKey = keyof typeof regexValidations