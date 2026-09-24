// utils/html.ts — the kit's only HTML-safety primitives.
//
// Three rules, in order of preference:
//   1. don't build HTML at all — interpolate the string
//   2. if you build HTML yourself, escape the *source* first, so the only tags
//      that can exist in the output are the ones you wrote (KMarkdownRenderer)
//   3. if you must render HTML that came from somewhere else, run it through
//      sanitizeHtml() (DOMPurify) — never a hand-rolled parser
//
// `sanitizeHtml` fails CLOSED on the server. DOMPurify needs a real DOM, and
// without one it returns the input unchanged — which would mean an SSR pass
// happily emitting a payload as markup. With no DOM we escape instead, so
// nothing untrusted is ever emitted as HTML.
import DOMPurify from 'dompurify'

export const escapeHtml = (value: unknown): string =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

/** Tags (not their text) removed — the text fallback for rich content. */
export const stripTags = (html: unknown): string =>
    String(html ?? '').replace(/<[^>]*>/g, '')

// Only schemes that cannot execute: http(s), mailto, tel, and relative/hash.
// Everything else (javascript:, data:, vbscript:, blob: …) is rejected.
const SAFE_SCHEME = /^(?:https?:|mailto:|tel:|\/|#|\?|\.\/|\.\.\/)/i

export const isSafeUrl = (url: unknown): boolean => {
    const value = String(url ?? '').trim()
    if (!value) return false
    // Whitespace and control characters are how "java\nscript:" gets smuggled
    // past a naive prefix check — collapse them before testing.
    const normalized = value.replace(/[\u0000-\u0020\u007F]/g, '')
    return SAFE_SCHEME.test(normalized)
}

/** A URL safe to drop into an attribute, escaped for the attribute context. */
export const safeUrl = (url: unknown, fallback = '#'): string =>
    isSafeUrl(url) ? escapeHtml(String(url).trim()) : fallback

const canSanitize =
    typeof window !== 'undefined' &&
    typeof DOMPurify?.sanitize === 'function' &&
    DOMPurify.isSupported !== false

/**
 * Sanitize foreign HTML before handing it to `v-html`.
 * Browser: DOMPurify. Server: escaped text (fail closed — see the note above).
 */
export const sanitizeHtml = (html: unknown): string => {
    const raw = String(html ?? '')
    if (!raw) return ''
    if (!canSanitize) return escapeHtml(raw)
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } })
}
