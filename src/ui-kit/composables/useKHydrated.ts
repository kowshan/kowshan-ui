// composables/useKHydrated.ts
import { onMounted, ref, type Ref } from 'vue'

/**
 * `false` on the server *and* on the client's first render, `true` after mount.
 *
 * Gate anything whose value can only be produced in the browser — sanitized
 * HTML (DOMPurify needs a DOM), `matchMedia`, storage — so the markup the
 * client hydrates matches what the server rendered, and the real value is
 * adopted right after mount. The kit's SSR rule in one composable.
 */
export const useKHydrated = (): Ref<boolean> => {
    const hydrated = ref(false)

    onMounted(() => {
        hydrated.value = true
    })

    return hydrated
}
