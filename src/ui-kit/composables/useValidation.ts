import { ref } from 'vue'
import type { ValidationRules, ValidationResult } from '../types'

export function useValidation() {
    const error = ref<string | null>(null)
    const isValid = ref(true)
    const touched = ref(false)
    const dirty = ref(false)

    // Validate a single value against rules
    const validate = (value: any, rules: ValidationRules = [], allValues?: Record<string, any>): ValidationResult => {
        if (!rules.length) {
            return { isValid: true, error: null }
        }

        for (const rule of rules) {
            let ruleError: string | null = null

            // Required check
            if ('required' in rule && rule.required) {
                if (!value && value !== 0 && value !== false) {
                    ruleError = rule.message || 'این فیلد الزامی است'
                }
            }
            
            // Pattern (regex)
            else if ('pattern' in rule && rule.pattern) {
                if (value !== undefined && value !== null && value !== '') {
                    if (!rule.pattern.test(String(value))) {
                        ruleError = rule.message || 'فرمت وارد شده صحیح نیست'
                    }
                }
            }

            // Custom validator function
            else if ('validator' in rule && rule.validator) {
                const result = rule.validator(value, allValues)
                if (result !== true) {
                    ruleError = typeof result === 'string' ? result : (rule.message || 'مقدار نامعتبر است')
                }
            }

            if (ruleError) {
                error.value = ruleError
                isValid.value = false
                return { isValid: false, error: ruleError }
            }
        }

        error.value = null
        isValid.value = true
        return { isValid: true, error: null }
    }

    const clearError = () => {
        error.value = null
        isValid.value = true
    }

    const reset = () => {
        dirty.value = false
        touched.value = false
        clearError()
    }

    return {
        error,
        isValid,
        touched,
        dirty,
        validate,
        clearError,
        reset
    }
}