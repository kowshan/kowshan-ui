import { ref, watch } from 'vue'

export function useDebounce<T>(delay: number = 300) {
    const debouncedValue = ref<T>()
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const setDebounced = (value: T, callback?: (value: T) => void) => {
        if (timeoutId) clearTimeout(timeoutId)
        
        timeoutId = setTimeout(() => {
            debouncedValue.value = value
            callback?.(value)
        }, delay)
    }

    return { debouncedValue, setDebounced }
}