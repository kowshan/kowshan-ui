import { ref, watch } from 'vue'
import { useDebounce } from './useDebounce'

export interface AsyncValidationResult {
    isValid: boolean
    error: string | null
    loading: boolean
}

export function useAsyncValidation<T = any>(
    validator: (value: T) => Promise<boolean | string>,
    debounceMs: number = 500
) {
    const isValid = ref(true)
    const error = ref<string | null>(null)
    const loading = ref(false)
    const lastValidatedValue = ref<T | null>(null)
    
    const { setDebounced, debouncedValue } = useDebounce<T>(debounceMs)
    
    const validate = async (value: T): Promise<AsyncValidationResult> => {
        // Skip if same as last validated
        if (value === lastValidatedValue.value && lastValidatedValue.value !== null) {
            return { isValid: isValid.value, error: error.value, loading: loading.value }
        }
        
        loading.value = true
        error.value = null
        
        try {
            const result = await validator(value)
            
            if (result === true) {
                isValid.value = true
                error.value = null
            } else {
                isValid.value = false
                error.value = typeof result === 'string' ? result : 'مقدار نامعتبر است'
            }
        } catch (err) {
            isValid.value = false
            error.value = err instanceof Error ? err.message : 'خطا در اعتبارسنجی'
        } finally {
            loading.value = false
            lastValidatedValue.value = value
        }
        
        return { isValid: isValid.value, error: error.value, loading: loading.value }
    }
    
    const validateDebounced = (value: T) => {
        setDebounced(value, async (debouncedVal) => {
            if (debouncedVal !== undefined) {
                await validate(debouncedVal)
            }
        })
    }
    
    const clear = () => {
        isValid.value = true
        error.value = null
        loading.value = false
        lastValidatedValue.value = null
    }
    
    return {
        isValid,
        error,
        loading,
        validate,
        validateDebounced,
        clear
    }
}