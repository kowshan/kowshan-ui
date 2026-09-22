<!-- components/KSparkline.vue -->
<!--
    KSparkline — mini SVG trend line (for stat cards / table cells):

      <KSparkline :data="[4, 7, 3, 9, 6, 12, 10]" :width="120" :height="36" />
-->
<template>
    <svg
        class="k-spark"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="color" stop-opacity="0.28" />
                <stop offset="100%" :stop-color="color" stop-opacity="0" />
            </linearGradient>
        </defs>

        <template v-if="points.length > 1">
            <polygon
                v-if="fill"
                :points="areaPoints"
                :fill="`url(#${gradId})`"
            />
            <polyline
                :points="linePoints"
                fill="none"
                :stroke="color"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <circle
                v-if="showDot"
                :cx="lastPoint[0]"
                :cy="lastPoint[1]"
                r="2.4"
                :fill="color"
            />
        </template>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useKitId } from '../composables/useKitId'

const props = withDefaults(defineProps<{
    data?: number[]
    width?: number
    height?: number
    color?: string
    strokeWidth?: number
    fill?: boolean
    showDot?: boolean
}>(), {
    data: () => [],
    width: 120,
    height: 36,
    color: '#1db954',
    strokeWidth: 1.8,
    fill: true,
    showDot: true
})

const { id } = useKitId('spark')
const gradId = computed(() => `spark-${id}`)

const points = computed(() => {
    const d = props.data
    if (d.length < 2) return []
    const min = Math.min(...d)
    const max = Math.max(...d)
    const range = max - min || 1
    const pad = 2
    const stepX = (props.width - pad * 2) / (d.length - 1)
    return d.map((v, i) => {
        const x = pad + i * stepX
        const y = pad + (1 - (v - min) / range) * (props.height - pad * 2)
        return [x, y] as [number, number]
    })
})

const linePoints = computed(() => points.value.map(p => p.join(',')).join(' '))
const areaPoints = computed(() => {
    if (!points.value.length) return ''
    const first = points.value[0]
    const last = points.value[points.value.length - 1]
    return `${first[0]},${props.height} ${linePoints.value} ${last[0]},${props.height}`
})
const lastPoint = computed(() => points.value[points.value.length - 1] ?? [0, 0])
</script>

<style scoped>
.k-spark {
    display: block;
}
</style>
