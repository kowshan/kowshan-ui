// composables/useLocalStorage.ts
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * useLocalStorage — reactive state persisted to localStorage:
 *
 *   const theme = useLocalStorage('k-theme', 'light')
 *   theme.value = 'dark'   // auto-saved
 *
 * Handles JSON serialization and cross-tab sync via the `storage` event.
 */
export function useLocalStorage<T>(key: string, initial: T): Ref<T> {
    const read = (): T => {
        if (typeof localStorage === 'undefined') return initial
        try {
            const raw = localStorage.getItem(key)
            if (raw === null) return initial
            return JSON.parse(raw) as T
        } catch {
            return initial
        }
    }

    const state = ref<T>(read()) as Ref<T>

    watch(state, (v) => {
        if (typeof localStorage === 'undefined') return
        try {
            if (v === undefined || v === null) localStorage.removeItem(key)
            else localStorage.setItem(key, JSON.stringify(v))
        } catch { /* storage full / private mode */ }
    }, { deep: true })

    // cross-tab sync
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
            if (e.key === key) {
                try {
                    state.value = e.newValue ? JSON.parse(e.newValue) as T : initial
                } catch { /* ignore malformed */ }
            }
        })
    }

    return state
}
