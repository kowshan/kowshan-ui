
import { computed } from 'vue'
import { useId } from './useId'

export interface AccessibilityOptions {
    label?: string
    describedBy?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    errorMessage?: string
}

export function useAccessibility(options: AccessibilityOptions = {}) {
    const { id: inputId } = useId('input')
    const { id: describedById } = useId('described')
    const { id: errorId } = useId('error')
    
    const ariaLabel = computed(() => options.label || undefined)
    const ariaRequired = computed(() => options.required || undefined)
    const ariaDisabled = computed(() => options.disabled || undefined)
    const ariaReadonly = computed(() => options.readonly || undefined)
    const ariaInvalid = computed(() => options.invalid || undefined)
    
    const ariaDescribedBy = computed(() => {
        const ids = []
        if (options.describedBy) ids.push(options.describedBy)
        if (options.errorMessage) ids.push(errorId)
        if (ids.length === 0) return undefined
        return ids.join(' ')
    })
    
    const getAriaAttributes = () => ({
        id: inputId,
        'aria-label': ariaLabel.value,
        'aria-required': ariaRequired.value,
        'aria-disabled': ariaDisabled.value,
        'aria-readonly': ariaReadonly.value,
        'aria-invalid': ariaInvalid.value,
        'aria-describedby': ariaDescribedBy.value
    })
    
    return {
        inputId,
        describedById,
        errorId,
        getAriaAttributes
    }
}