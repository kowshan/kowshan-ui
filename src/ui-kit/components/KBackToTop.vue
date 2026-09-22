<!-- KBackToTop.vue — floating scroll-to-top with circular progress -->
<template>
    <span ref="rootEl" style="display:contents">
    <Transition name="k-btt">
        <button
            v-if="visible"
            class="k-btt"
            :style="{ '--progress': progressPct + '%' }"
            :aria-label="'بازگشت به بالا'"
            @click="scrollToTop"
        >
            <svg class="k-btt-ring" viewBox="0 0 36 36">
                <circle class="k-btt-ring-bg" cx="18" cy="18" r="15.5" />
                <circle class="k-btt-ring-fill" cx="18" cy="18" r="15.5" :stroke-dasharray="circumference" :stroke-dashoffset="circumference - (circumference * progressPct) / 100" />
            </svg>
            <ChevronUp :size="16" class="k-btt-icon" />
        </button>
    </Transition>
    </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    threshold?: number
    scrollContainer?: string
}>(), {
    threshold: 200,
})

const circumference = 2 * Math.PI * 15.5
const visible = ref(false)
const scrollPct = ref(0)

const progressPct = computed(() => Math.min(scrollPct.value, 100))

const rootEl = ref<HTMLElement | null>(null)

const findScrollParent = (el: HTMLElement | null): Element | Window => {
    if (!el) return window
    let node: HTMLElement | null = el.parentElement
    while (node && node !== document.body) {
        const style = getComputedStyle(node)
        if (/(auto|scroll)/.test(style.overflow + style.overflowY)) return node
        node = node.parentElement
    }
    return window
}

let target: Element | Window = window
let handler: (() => void) | null = null

const onScroll = () => {
    const el = target
    const scrollTop = el === window ? window.scrollY : (el as Element).scrollTop
    const scrollHeight = el === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : (el as Element).scrollHeight - (el as Element).clientHeight
    visible.value = scrollTop > props.threshold
    scrollPct.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
}

const scrollToTop = () => {
    if (target === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        (target as Element).scrollTo({ top: 0, behavior: 'smooth' })
    }
}

onMounted(() => {
    if (props.scrollContainer) {
        const el = document.querySelector(props.scrollContainer)
        if (el) target = el
    } else {
        target = findScrollParent(rootEl.value)
    }
    handler = onScroll
    target.addEventListener('scroll', handler, { passive: true })
    onScroll()
})

onUnmounted(() => {
    if (handler) target.removeEventListener('scroll', handler)
})
</script>

<style scoped>
.k-btt {
    position: fixed;
    bottom: 24px;
    inset-inline-start: 24px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: var(--k-bg, #fff);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.k-btt:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transform: translateY(-2px);
}
.k-btt-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}
.k-btt-ring-bg {
    fill: none;
    stroke: var(--k-border, #e2e8f0);
    stroke-width: 2;
}
.k-btt-ring-fill {
    fill: none;
    stroke: var(--k-primary, #1db954);
    stroke-width: 2.5;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.15s ease;
}
.k-btt-icon {
    color: var(--k-text-secondary);
    position: relative;
    z-index: 1;
}
/* Transition */
.k-btt-enter-active, .k-btt-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.k-btt-enter-from, .k-btt-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
