<!-- components/KSwiper.vue
     Minimal native-scroll swiper — no dependency, no transform math.

     • per-page            → `per-page="3"` or `per-page="auto"` (slides size to content)
     • breakpoints         → `:breakpoints="{ 1200: 3, 768: 2 }"` ({ width: perPage })
     • direction           → `direction="vertical"` + `height="420"` (same component,
                             same props — only the scroll axis flips)
     • custom buttons      → slot props (`#default="{ next, prev, index, pages }"`)
                             or drop a <KSwiperButton> inside (it auto-wires and
                             points up/down when the swiper is vertical)
     • drag/touch/keyboard → free, it's a native scroll container with scroll-snap
                             (touch drag, trackpad, wheel and arrow keys all work)
-->
<template>
    <div
        class="k-swiper"
        :class="`axis-${axis}`"
        role="group"
        aria-roledescription="carousel"
        :aria-label="ariaLabel"
    >
        <!-- Optional nav row — anything here (e.g. <KSwiperButton>) is inside the
             swiper's context, so it wires itself and knows when to disable. -->
        <div v-if="$slots.controls" class="k-swiper-controls">
            <slot
                name="controls"
                :next="next"
                :prev="prev"
                :go-to="goTo"
                :index="index"
                :pages="pages"
                :per-page="resolved"
                :at-start="atStart"
                :at-end="atEnd"
            />
        </div>
        <div
            ref="trackRef"
            class="k-swiper-track"
            :style="trackStyle"
            tabindex="0"
            @scroll.passive="sync"
            @keydown="onKeydown"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
            @focusin="paused = true"
            @focusout="paused = false"
        >
            <slot
                :next="next"
                :prev="prev"
                :go-to="goTo"
                :index="index"
                :pages="pages"
                :per-page="resolved"
                :at-start="atStart"
                :at-end="atEnd"
            />
        </div>

        <div v-if="dots && pages > 1" class="k-swiper-dots">
            <button
                v-for="i in pages"
                :key="i"
                type="button"
                class="k-swiper-dot"
                :class="{ 'is-active': index === i - 1 }"
                :aria-label="`اسلاید ${i}`"
                :aria-current="index === i - 1 ? 'true' : undefined"
                @click="goTo(i - 1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch, type CSSProperties } from 'vue'
import { KSwiperKey, type KSwiperContext } from '../core/swiperContext'

const props = withDefaults(defineProps<{
    /** Slides per page — a number, or `'auto'` (each slide keeps its own width) */
    perPage?: number | 'auto'
    /** `{ minWidth: perPage }` — the largest matching breakpoint wins */
    breakpoints?: Record<string | number, number>
    /** Gap between slides, px */
    gap?: number
    /** Advance every n ms (`true` = 4000ms) */
    autoplay?: boolean | number
    /** Wrap around on next/prev */
    loop?: boolean
    /** Render the built-in dots */
    dots?: boolean
    /** `'vertical'` scrolls top→bottom (give it a `height`) */
    direction?: 'horizontal' | 'vertical'
    /** Track height in vertical mode — number (px) or any CSS length */
    height?: number | string
    ariaLabel?: string
}>(), {
    perPage: 1,
    breakpoints: () => ({}),
    gap: 12,
    autoplay: false,
    loop: false,
    dots: false,
    direction: 'horizontal',
    height: 320,
    ariaLabel: 'اسلایدر',
})

const emit = defineEmits<{
    change: [index: number]
    next: []
    prev: []
    end: []
}>()

const trackRef = ref<HTMLElement | null>(null)
const width = ref(0)
const slideWidth = ref(0)
const index = ref(0)
const max = ref(0)
const atStart = ref(true)
const atEnd = ref(false)
const isRtl = ref(false)
const paused = ref(false)

const isAuto = computed(() => props.perPage === 'auto')
const resolved = computed<number | 'auto'>(() => isAuto.value ? 'auto' : count.value)
const axis = computed<'horizontal' | 'vertical'>(() => props.direction === 'vertical' ? 'vertical' : 'horizontal')
const isVertical = computed(() => axis.value === 'vertical')

/** Slides per page for the current container width */
const count = computed(() => {
    if (isAuto.value) return 1
    const bps = Object.entries(props.breakpoints || {})
        .map(([w, v]) => [Number(w), v] as [number, number])
        .sort((a, b) => a[0] - b[0])
    let n = props.perPage as number
    for (const [w, v] of bps) if (width.value >= w) n = v
    return Math.max(1, n)
})

/** distance of one slide (width + gap), never 0 */
const stepSize = computed(() => Math.max(1, (slideWidth.value || width.value) + props.gap))

/** how far one page jump moves */
const pageUnit = computed(() => stepSize.value * (isAuto.value ? 1 : count.value))

/** reachable page positions — derived from real scroll distance, so the last dot always lands */
const pages = computed(() => Math.max(1, Math.floor(max.value / pageUnit.value) + 1))

const trackStyle = computed<CSSProperties>(() => ({
    '--k-swiper-gap': `${props.gap}px`,
    '--k-swiper-slide': isAuto.value
        ? 'auto'
        : `calc((100% - ${(count.value - 1) * props.gap}px) / ${count.value})`,
    // a vertical track needs a definite height for percentage slide sizes
    ...(isVertical.value
        ? { height: typeof props.height === 'number' ? `${props.height}px` : props.height }
        : {}),
}))

const offset = () => {
    const el = trackRef.value
    if (!el) return 0
    return isVertical.value ? el.scrollTop : Math.abs(el.scrollLeft)
}
const maxOffset = () => {
    const el = trackRef.value
    if (!el) return 0
    return isVertical.value
        ? Math.max(0, el.scrollHeight - el.clientHeight)
        : Math.max(0, el.scrollWidth - el.clientWidth)
}

/**
 * Engines disagree on the SIGN of `scrollLeft` in RTL — WebKit/Blink go negative as
 * you scroll towards the end, others count up from the start. Reads don't care
 * (`|scrollLeft|` grows towards the end either way), writes do, so we probe once:
 * set -1 and see whether the engine accepts it.
 */
const scrollSign = ref(1)
let signProbed = false

function probeScrollSign(el: HTMLElement) {
    if (isVertical.value || !isRtl.value) { scrollSign.value = 1; return }
    const prev = el.scrollLeft
    el.scrollLeft = -1
    scrollSign.value = el.scrollLeft < 0 ? -1 : 1
    el.scrollLeft = prev
}

function sync() {
    const off = offset()
    max.value = maxOffset()
    const total = Math.max(1, Math.floor(max.value / pageUnit.value) + 1)
    index.value = Math.min(total - 1, Math.round(off / pageUnit.value))
    atStart.value = off <= 2
    atEnd.value = off >= max.value - 2
}

function measure() {
    const el = trackRef.value
    if (!el || typeof window === 'undefined') return
    width.value = el.clientWidth
    isRtl.value = getComputedStyle(el).direction === 'rtl'
    const first = el.children[0] as HTMLElement | undefined
    const box = first?.getBoundingClientRect()
    // breakpoints stay width-based; the slide step follows the scroll axis
    slideWidth.value = box ? (isVertical.value ? box.height : box.width) : 0
    if (!signProbed && el.scrollWidth - el.clientWidth > 1) { probeScrollSign(el); signProbed = true }
    sync()
}

function slideTo(target: number, smooth = true) {
    const el = trackRef.value
    if (!el) return
    const off = Math.max(0, Math.min(maxOffset(), target))
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto'
    if (isVertical.value) el.scrollTo({ top: off, behavior })
    else el.scrollTo({ left: scrollSign.value * off, behavior })
}

function next() {
    emit('next')
    if (atEnd.value) {
        if (props.loop) slideTo(0)
        return
    }
    slideTo(offset() + pageUnit.value)
}

function prev() {
    emit('prev')
    if (atStart.value) {
        if (props.loop) slideTo(maxOffset())
        return
    }
    slideTo(offset() - pageUnit.value)
}

function goTo(i: number) {
    slideTo(Math.max(0, Math.min(pages.value - 1, i)) * pageUnit.value)
}

function onKeydown(e: KeyboardEvent) {
    const rtl = isRtl.value
    if (isVertical.value) {
        if (e.key === 'ArrowDown') { next(); e.preventDefault() }
        else if (e.key === 'ArrowUp') { prev(); e.preventDefault() }
    } else {
        if (e.key === 'ArrowRight') { rtl ? prev() : next(); e.preventDefault() }
        else if (e.key === 'ArrowLeft') { rtl ? next() : prev(); e.preventDefault() }
    }
    if (e.key === 'Home') { goTo(0); e.preventDefault() }
    else if (e.key === 'End') { goTo(pages.value - 1); e.preventDefault() }
}

/* ── autoplay ─────────────────────────────────────────────── */
const delay = computed(() => props.autoplay === true ? 4000 : (typeof props.autoplay === 'number' ? props.autoplay : 0))
let timer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
    if (timer) { clearInterval(timer); timer = null }
    if (!delay.value) return
    timer = setInterval(() => {
        if (paused.value || document.hidden) return
        next()
    }, delay.value)
}

/* ── lifecycle ────────────────────────────────────────────── */
let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null

onMounted(() => {
    measure()
    if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
        ro = new ResizeObserver(measure)
        ro.observe(trackRef.value)
    }
    if (typeof MutationObserver !== 'undefined' && trackRef.value) {
        mo = new MutationObserver(() => { measure(); startAutoplay() })
        mo.observe(trackRef.value, { childList: true })
    }
    window.addEventListener('resize', measure)
    startAutoplay()
})

onBeforeUnmount(() => {
    ro?.disconnect()
    mo?.disconnect()
    window.removeEventListener('resize', measure)
    if (timer) clearInterval(timer)
})

watch(delay, startAutoplay)
watch(index, (v) => emit('change', v))
watch(atEnd, (v) => { if (v) emit('end') })
watch(axis, () => { signProbed = false; nextTick(measure) })

const ctx: KSwiperContext = { next, prev, goTo, index, pages, atStart, atEnd, isRtl, axis, perPage: resolved }
provide(KSwiperKey, ctx)

defineExpose({ next, prev, goTo, index, pages, measure, axis })
</script>

<style scoped>
.k-swiper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    min-width: 0;
}
.k-swiper-track:focus-visible {
    outline: 2px solid var(--k-border-focus, var(--k-primary));
    outline-offset: 2px;
    border-radius: var(--k-radius-sm);
}
.k-swiper-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}
.k-swiper-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
.k-swiper-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: var(--k-border);
    cursor: pointer;
    transition: width 0.18s ease, background 0.18s ease;
}
.k-swiper-dot:hover {
    background: var(--k-text-muted);
}
.k-swiper-dot.is-active {
    width: 22px;
    background: var(--k-primary);
}
</style>

<style>
/* NOT scoped — these rules must reach slotted slides.
   Scoped by the .k-swiper-track class, so nothing leaks elsewhere. */
.k-swiper-track {
    display: flex;
    gap: var(--k-swiper-gap, 12px);
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-user-drag: none;
}
.k-swiper-track::-webkit-scrollbar {
    display: none;
}
.k-swiper-track > * {
    flex: 0 0 var(--k-swiper-slide, 100%);
    min-width: 0;
    min-height: 0;
    scroll-snap-align: start;
}

/* vertical: same component, axis flipped — slides keep their width */
.k-swiper.axis-vertical .k-swiper-track {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    overscroll-behavior-x: auto;
    overscroll-behavior-y: contain;
}
.k-swiper.axis-vertical .k-swiper-track > * {
    flex: 0 0 var(--k-swiper-slide, auto);
    width: 100%;
}

</style>
