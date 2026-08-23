// composables/useSeo.ts
import { watch, onScopeDispose } from 'vue'
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
    /** only for SSR-capable environments (Nuxt). Default: auto-detect */
    useHead?: boolean
}

interface HeadContext {
    title?: string
    meta?: { name?: string; property?: string; content?: string }[]
    link?: { rel: string; href: string }[]
    script?: { type: string; children: string }[]
}

const hasNuxtHead = () => typeof (globalThis as any).useHead === 'function'

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

/**
 * useSeo — set title / meta / Open Graph / canonical / JSON-LD.
 *
 * Works two ways:
 *  - in Nuxt (SSR) it routes through `useHead` so the tags exist in the
 *    server-rendered HTML;
 *  - in a plain Vue app it writes the tags straight into <head>.
 *
 *   useSeo({ title: 'صفحه ملک', description: '…', canonical: url })
 *   // reactive variant:
 *   useSeo({ title: computedTitle, jsonLd: reactiveObj })
 */
export function useSeo(options: SeoOptions | Ref<SeoOptions>) {
    const isRef = 'value' in options
    const useHeadFn = !isRef && (options as SeoOptions).useHead !== false && hasNuxtHead()
        ? (globalThis as any).useHead
        : null

    const apply = (opts: SeoOptions) => {
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

    // reactive source (ref/computed) or plain object
    if (isRef) {
        watch(options as Ref<SeoOptions>, (v) => apply(v), { immediate: true, deep: true })
    } else {
        apply(options as SeoOptions)
    }

    onScopeDispose(() => { /* DOM tags are left in place intentionally (they're per-page) */ })

    return { apply }
}
