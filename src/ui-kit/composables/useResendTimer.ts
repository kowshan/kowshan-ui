import { ref, computed, onScopeDispose } from 'vue'
import { usePersianNumbers } from './usePersianNumbers'

/**
 * useResendTimer — resend-code countdown (SMS/email verification).
 *
 *   const resend = useResendTimer({ initial: 60 })
 *   resend.start()          // starts counting down from 60
 *   resend.canResend        // true only when the countdown finished
 *   resend.remaining        // reactive seconds
 *   resend.persian          // "۵۷" for display
 *
 * Also auto-clears the interval when the owning scope unmounts.
 */
export function useResendTimer(options?: {
    initial?: number
    onEnd?: () => void
}) {
    const initial = options?.initial ?? 60
    const remaining = ref(0)
    let timer: ReturnType<typeof setInterval> | null = null

    const { toPersianDigits } = usePersianNumbers()

    const isRunning = computed(() => remaining.value > 0)
    const canResend = computed(() => !isRunning.value)
    const persian = computed(() => toPersianDigits(String(remaining.value)))

    function stop() {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    }

    function start(seconds?: number) {
        stop()
        remaining.value = seconds ?? initial
        timer = setInterval(() => {
            remaining.value--
            if (remaining.value <= 0) {
                stop()
                options?.onEnd?.()
            }
        }, 1000)
    }

    function reset() {
        stop()
        remaining.value = 0
    }

    onScopeDispose(stop)

    return { remaining, persian, isRunning, canResend, start, stop, reset }
}
