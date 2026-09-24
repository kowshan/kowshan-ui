// composables/useKClipboard.ts
import { onMounted, ref } from 'vue'

/**
 * useKClipboard — copy text with a fallback + copied state:
 *
 *   const { copy, copied, supported } = useKClipboard()
 *   copy('متن')            // true
 *   copied                 // true for 2s
 */
export function useKClipboard(options?: { resetAfter?: number }) {
    const resetAfter = options?.resetAfter ?? 2000
    const copied = ref(false)
    // Starts false on both sides; probing `navigator.clipboard` during setup would
    // make any markup driven by `supported` hydrate differently than the server sent.
    const supported = ref(false)
    let timer: ReturnType<typeof setTimeout> | null = null

    onMounted(() => {
        supported.value = !!navigator.clipboard?.writeText
    })

    async function copy(text: string): Promise<boolean> {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
            } else {
                // legacy fallback (iframe/textarea)
                const ta = document.createElement('textarea')
                ta.value = text
                ta.style.position = 'fixed'
                ta.style.opacity = '0'
                document.body.appendChild(ta)
                ta.select()
                document.execCommand('copy')
                ta.remove()
            }
            copied.value = true
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => { copied.value = false }, resetAfter)
            return true
        } catch {
            copied.value = false
            return false
        }
    }

    function reset() {
        copied.value = false
        if (timer) clearTimeout(timer)
    }

    return { copy, copied, supported, reset }
}
