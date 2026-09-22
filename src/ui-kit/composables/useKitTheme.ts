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
import { getCurrentInstance, onMounted, ref } from 'vue'

export type KitTheme = 'light' | 'dark' | 'oled'

const theme = ref<KitTheme>('light')
let observer: MutationObserver | null = null

const detect = () => {
    if (typeof document === 'undefined') return
    /* Skip teleported wrappers — they re-apply the theme themselves and would
       otherwise feed their own (stale) value back into the detector. */
    const kui = Array.from(document.querySelectorAll<HTMLElement>('.k-ui[data-theme]'))
        .find(el => !el.closest('#k-teleport-hub'))
    const attr = kui?.getAttribute('data-theme')
        || document.documentElement.getAttribute('data-theme')
    const next: KitTheme = attr === 'dark' || attr === 'oled' ? attr : 'light'
    if (next !== theme.value) theme.value = next
}

export function useKitTheme() {
    if (!observer && typeof document !== 'undefined') {
        observer = new MutationObserver(detect)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
            subtree: true
        })
        detect()
    }
    /* The host `.k-ui[data-theme]` is still detached while the first setup pass
       runs (and its attribute never mutates afterwards, so the observer never
       fires for it) — re-detect once mounted. */
    if (getCurrentInstance()) onMounted(detect)
    else detect()
    return theme
}
