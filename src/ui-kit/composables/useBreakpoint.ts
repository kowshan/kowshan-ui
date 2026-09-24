// composables/useBreakpoint.ts
import { ref, computed, onMounted, onScopeDispose } from 'vue'

export type KBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const QUERIES: Record<KBreakpoint, string> = {
    xs: '(max-width: 639px)',
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)'
}

/**
 * useBreakpoint — reactive viewport breakpoints:
 *
 *   const bp = useBreakpoint()
 *   bp.isDesktop   // lg or xl
 *   bp.isMobile    // xs or sm
 *   bp.is('md')    // viewport >= 768px
 */
export function useBreakpoint() {
    const matches = ref<Record<KBreakpoint, boolean>>({
        xs: false, sm: false, md: false, lg: false, xl: false
    })

    const mqls: MediaQueryList[] = []
    const handlers: Array<(e: MediaQueryListEvent) => void> = []

    // Resolving `matchMedia` during setup hydrates a desktop-sized tree over the server's
    // mobile-first markup (every query is `false` on the server) → hydration mismatch.
    // Adopt the real viewport once mounted instead; the first paint is unchanged.
    onMounted(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
        for (const key of Object.keys(QUERIES) as KBreakpoint[]) {
            const mql = window.matchMedia(QUERIES[key])
            mqls.push(mql)
            matches.value[key] = mql.matches
            const handler = (e: MediaQueryListEvent) => {
                matches.value[key] = e.matches
            }
            handlers.push(handler)
            mql.addEventListener('change', handler)
        }
    })

    onScopeDispose(() => {
        mqls.forEach((mql, i) => mql.removeEventListener('change', handlers[i]))
    })

    const is = (bp: KBreakpoint) => matches.value[bp]

    const isMobile = computed(() => matches.value.xs || matches.value.sm)
    const isDesktop = computed(() => matches.value.lg || matches.value.xl)
    const isTablet = computed(() => matches.value.md && !matches.value.lg)
    const current = computed<KBreakpoint>(() => {
        if (matches.value.xl) return 'xl'
        if (matches.value.lg) return 'lg'
        if (matches.value.md) return 'md'
        if (matches.value.sm) return 'sm'
        return 'xs'
    })

    return { matches, is, current, isMobile, isDesktop, isTablet }
}
