/**
 * Optional dependency shim.
 *
 * `useAnimation` uses gsap for smooth animations but gracefully falls back to
 * CSS-based animations when gsap is not installed. This declaration lets the
 * kit type-check in projects that don't install gsap.
 */
declare module 'gsap' {
    export const gsap: {
        to(target: unknown, vars: Record<string, unknown>): unknown
    }
}
