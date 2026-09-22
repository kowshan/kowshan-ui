<template>
    <div
        ref="el"
        class="k-spotlight"
        :class="{ 'is-glow': glow }"
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

        <div dir="ltr" class="k-spotlight__content">
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
}>(), {
    color: '#1db954',
    glow: true,
    radius: '16px'
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
    background: `radial-gradient(400px circle at ${x.value}px ${y.value}px, ${props.color}22, transparent 60%)`,
    opacity: hovering.value ? 1 : 0
}))

const borderStyle = computed(() => ({
    background: `radial-gradient(250px circle at ${x.value}px ${y.value}px, ${props.color}55, transparent 65%)`,
    opacity: hovering.value ? 1 : 0
}))
</script>

<style scoped>
.k-spotlight {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
    background: var(--pars-surface);
    border: 1px solid var(--pars-border);
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
