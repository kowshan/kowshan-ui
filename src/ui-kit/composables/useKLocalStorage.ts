// composables/useKLocalStorage.ts
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * useKLocalStorage — reactive state persisted to localStorage:
 *
 *   const theme = useKLocalStorage('k-theme', 'light')
 *   theme.value = 'dark'   // auto-saved
 *
 * Handles JSON serialization and cross-tab sync via the `storage` event.
 *
 * SSG/SSR: the stored value is adopted in `onMounted`, not during setup. Reading it during
 * setup would render the persisted value on the client's first render while the server
 * (no localStorage) rendered `initial` — a hydration mismatch for any component that
 * shows the value. So the first paint matches the server and the stored value applies
 * right after hydration. Outside a component there is nothing to hydrate, so it reads
 * immediately.
 */
export function useKLocalStorage<T>(key: string, initial: T): Ref<T> {
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

    const state = ref<T>(initial) as Ref<T>

    if (getCurrentInstance()) onMounted(() => { state.value = read() })
    else state.value = read()

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
