// composables/useKitTheme.ts
/**
 * Tracks the kit theme so teleported components (modals, toasts, lightbox…)
 * can re-apply the theme to their detached roots.
 *
 * The theme lives on the app's `.k-ui[data-theme=…]` wrapper (or the <html>
 * element). Teleported content escapes that subtree, so without this the
 * `--k-*` variables fall back to light values in dark/OLED mode.
 *
 * Usage:
 *   const theme = useKitTheme()          // ref<'light'|'dark'|'oled'>
 *   <Teleport to="body">
 *     <div class="k-ui" :data-theme="theme">
 */
import { ref } from 'vue'

export type KitTheme = 'light' | 'dark' | 'oled'

const theme = ref<KitTheme>('light')
let observer: MutationObserver | null = null
let started = false

const detect = () => {
    if (typeof document === 'undefined') return
    const kui = document.querySelector<HTMLElement>('.k-ui[data-theme]')
    const attr = kui?.getAttribute('data-theme')
        || document.documentElement.getAttribute('data-theme')
    const next: KitTheme = attr === 'dark' || attr === 'oled' ? attr : 'light'
    if (next !== theme.value) theme.value = next
}

export function useKitTheme() {
    if (!started && typeof document !== 'undefined') {
        started = true
        detect()
        observer = new MutationObserver(detect)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
            subtree: true
        })
    }
    return theme
}
