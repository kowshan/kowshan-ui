// composables/useKContextMenu.ts — programmatic right-click menu with viewport clamping.
// Pair with a teleported `.k-ctx-menu` element rendering `entries`.
import { reactive, ref, nextTick, onMounted, onUnmounted } from 'vue'

export type ContextMenuEntry =
    | { label: string; icon?: any; danger?: boolean; disabled?: boolean; run: () => void }
    | 'divider'

export function useKContextMenu(selector = '.k-ctx-menu') {
    const ctx = reactive({ open: false, x: 0, y: 0 })
    const entries = ref<ContextMenuEntry[]>([])

    const openCtx = (e: MouseEvent, list: ContextMenuEntry[]) => {
        ctx.open = false
        nextTick(() => {
            ctx.x = e.clientX
            ctx.y = e.clientY
            entries.value = list
            ctx.open = true
            // clamp to viewport after render
            nextTick(() => {
                const el = document.querySelector(selector) as HTMLElement | null
                if (!el) return
                const r = el.getBoundingClientRect()
                if (r.right > window.innerWidth) ctx.x = Math.max(4, window.innerWidth - r.width - 4)
                if (r.bottom > window.innerHeight) ctx.y = Math.max(4, window.innerHeight - r.height - 4)
            })
        })
    }

    const onDocClick = (e: MouseEvent) => {
        const el = document.querySelector(selector)
        if (ctx.open && el && !el.contains(e.target as Node)) ctx.open = false
    }
    const onDocKey = (e: KeyboardEvent) => { if (e.key === 'Escape') ctx.open = false }

    onMounted(() => {
        document.addEventListener('click', onDocClick)
        document.addEventListener('keydown', onDocKey)
    })
    onUnmounted(() => {
        document.removeEventListener('click', onDocClick)
        document.removeEventListener('keydown', onDocKey)
    })

    return { ctx, entries, openCtx }
}
