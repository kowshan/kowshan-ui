// composables/useFocusTrap.ts
import { watch, onScopeDispose } from 'vue'
import type { Ref } from 'vue'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * useFocusTrap — keep keyboard focus inside a modal/dialog while active:
 *
 *   const el = ref<HTMLElement | null>(null)
 *   useFocusTrap(el, () => isOpen.value)
 *
 * Traps Tab/Shift+Tab, restores focus to the previously focused element
 * when the trap deactivates.
 */
export function useFocusTrap(el: Ref<HTMLElement | null>, active: () => boolean) {
    let previous: HTMLElement | null = null
    let lastFocused: HTMLElement | null = null

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !el.value) return
        const nodes = el.value.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!nodes.length) {
            e.preventDefault()
            return
        }
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const activeEl = document.activeElement

        if (e.shiftKey) {
            if (activeEl === first || activeEl === el.value || !el.value.contains(activeEl)) {
                e.preventDefault()
                last.focus()
            }
        } else {
            if (activeEl === last || activeEl === el.value || !el.value.contains(activeEl)) {
                e.preventDefault()
                first.focus()
            }
        }
    }

    watch(el, (node) => {
        if (node && active()) {
            previous = document.activeElement as HTMLElement | null
            const first = node.querySelector<HTMLElement>(FOCUSABLE)
            lastFocused = first
            first?.focus()
        }
    })

    watch(active, (on) => {
        if (on && el.value) {
            previous = document.activeElement as HTMLElement | null
            const first = el.value.querySelector<HTMLElement>(FOCUSABLE)
            lastFocused = first
            first?.focus()
        } else {
            lastFocused?.focus()
            previous?.focus?.()
            previous = null
        }
    })

    if (typeof window !== 'undefined') {
        document.addEventListener('keydown', onKeydown, true)
        onScopeDispose(() => {
            document.removeEventListener('keydown', onKeydown, true)
        })
    }
}
