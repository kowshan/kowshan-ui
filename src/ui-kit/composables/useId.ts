import { useId as vueUseId } from 'vue'

// SSR-safe unique id: Vue's useId is stable between server and client
// renders, avoiding hydration mismatches for `id` / `for` / aria attributes.
export function useId(prefix = 'k') {
    const id = vueUseId()
    return { id: `${prefix}-${id}` }
}