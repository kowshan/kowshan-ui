<!-- components/KProgressRing.vue -->
<template>
    <div class="k-ring" :class="`size-${size}`">
        <div
            class="k-ring-svg"
            :style="{ width: pixelSize + 'px', height: pixelSize + 'px', '--k-ring-px': pixelSize + 'px' }"
        >
            <svg :width="pixelSize" :height="pixelSize" :viewBox="`0 0 ${pixelSize} ${pixelSize}`">
                <circle
                    class="k-ring-track"
                    :cx="center" :cy="center" :r="radius"
                    :stroke-width="stroke"
                    fill="none"
                />
                <circle
                    class="k-ring-value"
                    :cx="center" :cy="center" :r="radius"
                    :stroke-width="stroke"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="dashOffset"
                    stroke-linecap="round"
                    fill="none"
                    :style="{ stroke: color }"
                    :transform="`rotate(-90 ${center} ${center})`"
                />
            </svg>

            <div class="k-ring-center">
                <slot>
                    <span class="k-ring-percent">{{ Math.round(ratio * 100) }}٪</span>
                </slot>
            </div>
        </div>

        <span v-if="label" class="k-ring-label">{{ label }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue: number
    size?: 'sm' | 'md' | 'lg'
    /** custom pixel size (overrides size) */
    px?: number
    stroke?: number
    color?: string
    label?: string
    showPercent?: boolean
    /** 0-1 or 0-100 — auto-detected */
    max?: number
}>(), {
    size: 'md',
    stroke: 0,
    color: 'var(--k-primary, #1db954)',
    showPercent: true,
    max: 100
})

const pixelSize = computed(() => props.px || ({ sm: 48, md: 72, lg: 100 })[props.size])
const stroke = computed(() => props.stroke || Math.max(4, Math.round(pixelSize.value * 0.08)))

const center = computed(() => pixelSize.value / 2)
const radius = computed(() => (pixelSize.value - stroke.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

/* max=1 means a 0-1 fraction; otherwise it's a 0-max scale (default 100) */
const maxVal = computed(() => (props.max === 1 ? 1 : props.max))

const clamped = computed(() => Math.min(maxVal.value, Math.max(0, props.modelValue)))

const ratio = computed(() => (maxVal.value === 0 ? 0 : clamped.value / maxVal.value))

const dashOffset = computed(() => circumference.value * (1 - ratio.value))

</script>

<style scoped>
.k-ring {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    direction: ltr;
}

.k-ring-svg {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-ring-track {
    stroke: var(--k-surface-hover, #e2e8f0);
}

.k-ring-value {
    transition: stroke-dashoffset 0.5s ease;
}

.k-ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-ring-percent {
    font-size: calc(var(--k-ring-px, 72px) * 0.22);
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    direction: rtl;
    white-space: nowrap;
}

.k-ring-label {
    text-align: center;
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
    direction: rtl;
    white-space: nowrap;
}
</style>
