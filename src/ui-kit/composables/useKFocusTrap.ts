// composables/useKFocusTrap.ts
import { watch, onScopeDispose } from 'vue'
import type { Ref } from 'vue'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * useKFocusTrap — keep keyboard focus inside a modal/dialog while active:
 *
 *   const el = ref<HTMLElement | null>(null)
 *   useKFocusTrap(el, () => isOpen.value)
 *
 * Traps Tab/Shift+Tab, restores focus to the previously focused element
 * when the trap deactivates.
 */
export function useKFocusTrap(el: Ref<HTMLElement | null>, active: () => boolean) {
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

    // Focus the first focusable child, or the container itself when the dialog
    // has nothing focusable inside it. Without that fallback the focused element
    // stays outside the dialog while it is open (and a dialog that closes with
    // focus still "inside" it is exactly what makes Chrome log "Blocked
    // aria-hidden … descendant retained focus").
    const focusFirstInside = (node: HTMLElement) => {
        const first = node.querySelector<HTMLElement>(FOCUSABLE)
        lastFocused = first ?? node
        ;(first ?? node).focus()
    }

    watch(el, (node) => {
        if (node && active()) {
            previous = document.activeElement as HTMLElement | null
            focusFirstInside(node)
        }
    })

    watch(active, (on) => {
        if (on && el.value) {
            previous = document.activeElement as HTMLElement | null
            focusFirstInside(el.value)
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
