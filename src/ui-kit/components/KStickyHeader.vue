<!-- KStickyHeader.vue — header that becomes compact on scroll -->
<template>
    <div ref="sentinel" class="k-sh-sentinel" />
    <header
        ref="header"
        class="k-sh"
        :class="{ 'is-compact': isCompact, 'is-stuck': isStuck && sticky }"
    >
        <slot :compact="isCompact" />
    </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
    compactThreshold?: number
    sticky?: boolean
}>(), {
    compactThreshold: 60,
    sticky: true,
})

const sentinel = ref<HTMLElement>()
const header = ref<HTMLElement>()
const isCompact = ref(false)
const isStuck = ref(false)

let sentinelObserver: IntersectionObserver | null = null
let scrollHandler: (() => void) | null = null
let scrollTarget: HTMLElement | Window = window

/* App shells usually scroll an inner <main>, not the window — listening on
   `window` alone means `compact` never fires there. Walk up to the nearest
   scrollable ancestor, falling back to the window. */
const findScrollTarget = (el: HTMLElement | undefined): HTMLElement | Window => {
    let node = el?.parentElement ?? null
    while (node) {
        const overflowY = getComputedStyle(node).overflowY
        if (/(auto|scroll|overlay)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node
        node = node.parentElement
    }
    return window
}

onMounted(() => {
    if (!sentinel.value || !header.value) return

    scrollTarget = findScrollTarget(header.value)

    // Detect when sentinel leaves viewport (header is stuck)
    sentinelObserver = new IntersectionObserver(
        ([entry]) => {
            isStuck.value = !entry.isIntersecting
        },
        { threshold: 0 }
    )
    sentinelObserver.observe(sentinel.value)

    // Compact mode on scroll
    scrollHandler = () => {
        const top = scrollTarget instanceof Window ? window.scrollY : (scrollTarget as HTMLElement).scrollTop
        isCompact.value = top > props.compactThreshold
    }
    scrollTarget.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
    sentinelObserver?.disconnect()
    if (scrollHandler) scrollTarget.removeEventListener('scroll', scrollHandler)
})
</script>

<style scoped>
.k-sh-sentinel {
    height: 0;
    width: 0;
    pointer-events: none;
}
.k-sh {
    transition: all 0.25s ease;
}
/* stuck: lift the surface a step instead of casting a hard shadow */
.k-sh.is-stuck {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--k-surface, #ffffff) 94%, var(--k-text-primary, #0f172a));
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}
.k-sh.is-compact {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    background: color-mix(in srgb, var(--k-surface, #ffffff) 88%, var(--k-text-primary, #0f172a));
}
</style>
