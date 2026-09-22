// composables/useKInfiniteScroll.ts
import { ref, watch, onScopeDispose } from 'vue'

/**
 * useKInfiniteScroll — load more when a sentinel enters the viewport:
 *
 *   const { sentinelEl, loading, loadMore } = useKInfiniteScroll({
 *     loadMore: async () => { await fetchPage(page++) },
 *     disabled: () => hasMore.value === false
 *   })
 *
 *   <!-- place the sentinel at the bottom of the list -->
 *   <div ref="sentinelEl" />
 *
 * Returns the element ref to attach, plus `loading` state.
 */
export function useKInfiniteScroll(options: {
    loadMore: () => void | Promise<void>
    /** return true to stop observing (e.g. no more data) */
    disabled?: () => boolean
    rootMargin?: string
}) {
    const sentinelEl = ref<HTMLElement | null>(null)
    const loading = ref(false)
    let observer: IntersectionObserver | null = null
    let inFlight = false

    const run = async () => {
        if (inFlight || options.disabled?.()) return
        inFlight = true
        loading.value = true
        try {
            await options.loadMore()
        } finally {
            inFlight = false
            loading.value = false
        }
    }

    watch(sentinelEl, (el) => {
        observer?.disconnect()
        observer = null
        if (!el || typeof IntersectionObserver === 'undefined') return
        observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) run()
            },
            { rootMargin: options.rootMargin ?? '120px' }
        )
        observer.observe(el)
    }, { immediate: true })

    onScopeDispose(() => observer?.disconnect())

    return { sentinelEl, loading, loadMore: run }
}
