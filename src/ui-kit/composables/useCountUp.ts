// composables/useCountUp.ts
import { ref, watch, onScopeDispose } from 'vue'
import type { Ref } from 'vue'

/**
 * useCountUp — animate a number toward a target:
 *
 *   const { value, start } = useCountUp(0, { duration: 1200, easing: 'easeOut' })
 *   start(128000)
 *
 * `value` ticks up from the previous value to the target. Returns a promise
 * that resolves when the animation finishes.
 */
export function useCountUp(
    initial = 0,
    options?: { duration?: number; easing?: 'linear' | 'easeOut' | 'easeInOut' }
) {
    const duration = options?.duration ?? 1000
    const easing = options?.easing ?? 'easeOut'
    const value = ref(initial)
    let raf: number | null = null

    const ease = (t: number) => {
        if (easing === 'linear') return t
        if (easing === 'easeInOut') return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        return 1 - Math.pow(1 - t, 3) // easeOut cubic
    }

    function start(target: number, opts?: { duration?: number }) {
        const from = value.value
        const to = target
        const dur = opts?.duration ?? duration
        if (raf) cancelAnimationFrame(raf)
        if (from === to || dur <= 0) {
            value.value = to
            return Promise.resolve()
        }
        const t0 = performance.now()
        return new Promise<void>(resolve => {
            const tick = (now: number) => {
                const p = Math.min(1, (now - t0) / dur)
                value.value = from + (to - from) * ease(p)
                if (p < 1) {
                    raf = requestAnimationFrame(tick)
                } else {
                    value.value = to
                    raf = null
                    resolve()
                }
            }
            raf = requestAnimationFrame(tick)
        })
    }

    // reactive: watch a source ref and animate whenever it changes
    function watchSource(source: Ref<number>) {
        watch(source, (v) => { start(v) })
    }

    onScopeDispose(() => {
        if (raf) cancelAnimationFrame(raf)
    })

    return { value, start, watchSource }
}
