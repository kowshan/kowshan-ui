// composables/useSeo.ts
import { watch, isRef, onScopeDispose } from 'vue'
import type { Ref } from 'vue'

export interface SeoOptions {
    title?: string
    description?: string
    keywords?: string[]
    canonical?: string
    /** og:image URL */
    image?: string
    ogType?: 'website' | 'article' | 'profile' | 'product'
    /** JSON-LD structured data (object or array) */
    jsonLd?: object | object[]
    /** set false to force the plain-DOM path even inside a head-aware host */
    useHead?: boolean
}

/** plain object · ref/computed · getter */
export type SeoSource = SeoOptions | Ref<SeoOptions> | (() => SeoOptions)

interface HeadContext {
    title?: string
    meta?: { name?: string; property?: string; content?: string }[]
    link?: { rel: string; href: string }[]
    script?: { type: string; children: string }[]
}

/* ── host detection ─────────────────────────────────────────────
 * In a Nuxt app the `useHead` auto-import is injected into THIS module by the
 * build, so a bare `typeof useHead` answers the question correctly on the
 * server as well as in the browser. In a plain Vue app the identifier simply
 * does not exist — and `typeof` on an undeclared name is legal, evaluating to
 * 'undefined' — so we fall back to writing tags straight into <head>.
 *
 * (The previous version only looked at `globalThis.useHead`, which Nuxt never
 * sets: auto-imports are per-module bindings, not globals. The result was that
 * every Nuxt render took the DOM path and crashed on the server with
 * `document is not defined`.)
 */
const resolveUseHead = (): ((ctx: HeadContext) => void) | null => {
    /* `useHead` here is deliberately a *free* identifier: in a Nuxt host the
       auto-import injects the binding into this very module. It must stay
       undeclared — a local `declare const` would make the auto-import skip the
       file and we would silently fall back to DOM writes. The kit's own build
       has no such import, and `typeof` on an undeclared identifier is legal
       JS evaluating to 'undefined', which is exactly the plain-Vue answer.
       Hence the suppression, which is only a kit-build concern. */
    // @ts-ignore -- injected by the host's auto-import (Nuxt)
    const hostHead = typeof useHead === 'function' ? useHead : null
    if (typeof hostHead === 'function') return hostHead as (ctx: HeadContext) => void

    const globalHead = (globalThis as Record<string, any>).useHead
    return typeof globalHead === 'function' ? globalHead : null
}

const hasDom = () => typeof document !== 'undefined'

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string) => {
    let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

let jsonLdId = 0
const upsertJsonLd = (data: object | object[]) => {
    const id = `k-jsonld-${jsonLdId++}`
    let el = document.getElementById(id) as HTMLScriptElement | null
    if (!el) {
        el = document.createElement('script')
        el.type = 'application/ld+json'
        el.id = id
        document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
    return id
}

const isReactiveSource = (source: SeoSource): boolean =>
    typeof source === 'function' || isRef(source)

/**
 * useSeo — set title / meta / Open Graph / canonical / JSON-LD.
 *
 * Works two ways:
 *  - in Nuxt (SSR) it routes through `useHead`, so the tags are part of the
 *    server-rendered HTML (which is the only version crawlers read);
 *  - in a plain Vue app it writes the tags straight into <head>.
 *
 *   useSeo({ title: 'صفحه ملک', description: '…', canonical: url })
 *
 *   // reactive — a ref/computed or a getter; re-applied when it changes
 *   useSeo(() => ({ title: data.value?.title, canonical: canonical.value }))
 */
export function useSeo(source: SeoSource) {
    const reactiveSource = isReactiveSource(source)

    const read = (): SeoOptions =>
        typeof source === 'function'
            ? (source as () => SeoOptions)()
            : isRef(source)
                ? (source as Ref<SeoOptions>).value
                : (source as SeoOptions)

    const apply = (opts: SeoOptions) => {
        if (!opts) return

        const useHeadFn = opts.useHead === false ? null : resolveUseHead()

        if (useHeadFn) {
            const ctx: HeadContext = { title: opts.title }
            if (opts.description) {
                ctx.meta = [
                    { name: 'description', content: opts.description },
                    { property: 'og:description', content: opts.description }
                ]
            }
            if (opts.keywords?.length) {
                ctx.meta = [...(ctx.meta ?? []), { name: 'keywords', content: opts.keywords.join(', ') }]
            }
            if (opts.canonical) {
                ctx.link = [{ rel: 'canonical', href: opts.canonical }]
            }
            if (opts.image) {
                ctx.meta = [...(ctx.meta ?? []), { property: 'og:image', content: opts.image }]
            }
            if (opts.ogType || opts.title || opts.image) {
                ctx.meta = [...(ctx.meta ?? []), { property: 'og:type', content: opts.ogType || 'website' }]
            }
            if (opts.jsonLd) {
                ctx.script = [{ type: 'application/ld+json', children: JSON.stringify(opts.jsonLd) }]
            }
            useHeadFn(ctx)
            return
        }

        /* No head manager AND no DOM (a non-Nuxt SSR pass) — writing tags is
           impossible, and touching `document` would throw. Doing nothing is the
           only correct answer; the host owns its own SSR head handling. */
        if (!hasDom()) return

        // plain Vue / browser fallback
        if (opts.title) document.title = opts.title
        if (opts.description) upsertMeta('name', 'description', opts.description)
        if (opts.keywords?.length) upsertMeta('name', 'keywords', opts.keywords.join(', '))
        if (opts.canonical) upsertLink('canonical', opts.canonical)
        if (opts.image) upsertMeta('property', 'og:image', opts.image)
        upsertMeta('property', 'og:type', opts.ogType || 'website')
        if (opts.title) upsertMeta('property', 'og:title', opts.title)
        if (opts.jsonLd) upsertJsonLd(opts.jsonLd)
    }

    if (reactiveSource) {
        watch(read, (value) => apply(value), { immediate: true, deep: true })
    } else {
        apply(source as SeoOptions)
    }

    onScopeDispose(() => { /* DOM tags are left in place intentionally (they're per-page) */ })

    return { apply }
}
