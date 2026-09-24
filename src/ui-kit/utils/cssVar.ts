// utils/cssVar.ts
/**
 * Read a CSS custom property off an element.
 *
 * Needed by anything that can't take `var()` directly: canvas 2D contexts
 * (`ctx.fillStyle`) and SVG *presentation attributes* (`stroke="…"`). Because
 * custom properties inherit, reading from the element itself resolves whatever
 * `:root` / `.k-ui` / `data-theme` defines above it.
 *
 *   ctx.fillStyle = cssVar(ctx.canvas, '--k-primary', '#1db954')
 */
export const cssVar = (el: Element | null | undefined, name: string, fallback = ''): string => {
    if (!el || typeof window === 'undefined') return fallback
    return getComputedStyle(el).getPropertyValue(name).trim() || fallback
}
