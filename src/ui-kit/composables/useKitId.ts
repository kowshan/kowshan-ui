import { useId } from 'vue'

// SSR-safe unique id: Vue's useId is stable between server and client
// renders, avoiding hydration mismatches for `id` / `for` / aria attributes.
// Named useKitId so it never clashes with Vue's/Nuxt's auto-imported useId.
export function useKitId(prefix = 'k') {
    const id = useId()
    return { id: `${prefix}-${id}` }
}
