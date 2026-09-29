<template>
    <div
        ref="el"
        class="k-spotlight"
        :class="{ 'is-glow': glow, 'has-surface': surface }"
        @mousemove="onMove"
        @mouseleave="onLeave"
    >
        <!-- Spotlight overlay -->
        <div
            class="k-spotlight__beam"
            :style="beamStyle"
        />

        <!-- Border glow -->
        <div
            class="k-spotlight__border"
            :style="borderStyle"
        />

        <!-- No `dir="ltr"` here: this is a Persian-first kit, and forcing the
             content LTR flips every card's layout for an RTL consumer. A purely
             numeric value that needs strict LTR is the *consumer's* call — wrap
             it in `direction: ltr` on their own element. -->
        <div class="k-spotlight__content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
    color?: string
    glow?: boolean
    radius?: string
    /** Opt in to a card surface (background + border). Off by default: this is
     *  an *effect* layer, so it stays transparent unless the consumer wants a
     *  card — stacking it on a page that already has surfaces double-boxes it. */
    surface?: boolean
}>(), {
    color: 'var(--k-primary)',
    glow: true,
    radius: '16px',
    surface: false
})

const el = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)
const hovering = ref(false)

const onMove = (e: MouseEvent) => {
    const rect = el.value?.getBoundingClientRect()
    if (!rect) return
    x.value = e.clientX - rect.left
    y.value = e.clientY - rect.top
    hovering.value = true
}

const onLeave = () => {
    hovering.value = false
}

const beamStyle = computed(() => ({
    background: `radial-gradient(400px circle at ${x.value}px ${y.value}px, color-mix(in srgb, ${props.color} 13%, transparent), transparent 60%)`,
    opacity: hovering.value ? 1 : 0
}))

const borderStyle = computed(() => ({
    background: `radial-gradient(250px circle at ${x.value}px ${y.value}px, color-mix(in srgb, ${props.color} 33%, transparent), transparent 65%)`,
    opacity: hovering.value ? 1 : 0
}))
</script>

<style scoped>
.k-spotlight {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
}

/* Opt-in surface. Transparent by default — an effect layer, not a card. */
.k-spotlight.has-surface {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
}

.k-spotlight__beam,
.k-spotlight__border {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transition: opacity .25s ease;
}

.k-spotlight__border {
    border-radius: inherit;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
}

.k-spotlight__content {
    position: relative;
    z-index: 1;
    height: 100%;
}
</style>
