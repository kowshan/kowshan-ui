<!-- components/KGauge.vue -->
<!--
    KGauge — radial dial gauge (0-100):

      <KGauge :value="72" label="رضایت مشتری" />
      <KGauge :value="45" color="#10b981" :size="140" />
-->
<template>
    <div class="k-gauge" :style="{ width: size + 'px' }">
        <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
            <!-- background arc -->
            <path
                :d="trackPath"
                fill="none"
                :stroke="trackColor"
                :stroke-width="thickness"
                stroke-linecap="round"
            />
            <!-- value arc -->
            <path
                :d="trackPath"
                fill="none"
                :stroke="resolvedColor"
                :stroke-width="thickness"
                stroke-linecap="round"
                :stroke-dasharray="`${arcLength} ${arcLength}`"
                :stroke-dashoffset="arcLength - arcLength * fraction"
                :style="{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1), stroke 0.3s ease' }"
            />
        </svg>

        <div class="k-gauge-center" :style="{ width: size * 0.62 + 'px' }">
            <span class="k-gauge-value">{{ faNum(value) }}<small>٪</small></span>
            <span v-if="label" class="k-gauge-label">{{ label }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    value?: number
    size?: number
    thickness?: number
    color?: string
    label?: string
    /** auto color by thresholds when `color` is empty */
    thresholds?: { danger?: number; warning?: number }
}>(), {
    value: 0,
    size: 130,
    thickness: 10,
    color: '',
    label: '',
    thresholds: () => ({ danger: 40, warning: 70 })
})

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(Math.round(n)))

const START = 135 // degrees (135..405 = 270° sweep, starting bottom-left)
const SWEEP = 270

const polar = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180
    const cx = props.size / 2
    return {
        x: cx + r * Math.cos(rad),
        y: cx + r * Math.sin(rad)
    }
}

const radius = computed(() => (props.size - props.thickness) / 2)

const trackPath = computed(() => {
    const r = radius.value
    const p1 = polar(START, r)
    const p2 = polar(START + SWEEP, r)
    const largeArc = SWEEP > 180 ? 1 : 0
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
})

const arcLength = computed(() => {
    return (SWEEP * Math.PI * radius.value) / 180
})

const fraction = computed(() => Math.min(1, Math.max(0, props.value / 100)))

const resolvedColor = computed(() => {
    if (props.color) return props.color
    const v = props.value
    const danger = props.thresholds?.danger ?? 40
    const warning = props.thresholds?.warning ?? 70
    if (v < danger) return '#ef4444'
    if (v < warning) return '#f59e0b'
    return '#10b981'
})

const trackColor = 'var(--k-surface-hover, #e2e8f0)'
</script>

<style scoped>
.k-gauge {
    position: relative;
    display: inline-flex;
}

.k-gauge svg {
    display: block;
    transform: rotate(0deg);
}

.k-gauge-center {
    position: absolute;
    inset: 0;
    margin: auto;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-align: center;
}

.k-gauge-value {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    direction: ltr;
}

.k-gauge-value small {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-muted, #94a3b8);
}

.k-gauge-label {
    font-size: 0.64rem;
    color: var(--k-text-secondary, #64748b);
}
</style>
