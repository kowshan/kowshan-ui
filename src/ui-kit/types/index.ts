export type ValidationRule = 
    | { required: true; message?: string }
    | { pattern: RegExp; message?: string }
    | { validator: (value: any, allValues?: Record<string, any>) => boolean | string; message?: string }

export type ValidationRules = ValidationRule[]

export interface ValidationResult {
    isValid: boolean
    error: string | null
}