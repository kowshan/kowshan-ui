// composables/useClickOutside.ts
import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Calls `callback` when a pointer-down/click happens outside all given elements.
 * Accepts a single ref or an array of refs.
 */
export const useClickOutside = (
    elements: Ref<HTMLElement | null> | Ref<HTMLElement | null>[],
    callback: () => void
) => {
    let handleClickOutside: ((event: MouseEvent) => void) | null = null

    onMounted(() => {
        const elementsArray = Array.isArray(elements) ? elements : [elements]

        handleClickOutside = (event: MouseEvent) => {
            const isOutside = elementsArray.every(el => {
                return el.value && !el.value.contains(event.target as Node)
            })

            if (isOutside) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
        if (handleClickOutside) {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })
}
