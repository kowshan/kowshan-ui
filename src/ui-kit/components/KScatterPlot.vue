<!-- KScatterPlot.vue — scatter plot with optional regression line -->
<template>
    <div class="k-scatter" ref="root">
        <svg :viewBox="`0 0 ${svgW} ${svgH}`" :width="svgW" :height="svgH">
            <!-- Grid -->
            <line v-for="t in yTicks" :key="'yg'+t"
                :x1="pl" :x2="svgW - pr"
                :y1="yScale(t)" :y2="yScale(t)"
                stroke="var(--k-border, #e2e8f0)" stroke-width="0.5" />
            <line v-for="t in xTicks" :key="'xg'+t"
                :x1="xScale(t)" :x2="xScale(t)"
                :y1="pt" :y2="svgH - pb"
                stroke="var(--k-border, #e2e8f0)" stroke-width="0.5" />

            <!-- Y-axis labels -->
            <text v-for="t in yTicks" :key="'yl'+t"
                :x="pl - 6" :y="yScale(t) + 3"
                text-anchor="end" fill="var(--k-text-muted, #94a3b8)" font-size="9"
            >{{ Math.round(t) }}</text>

            <!-- X-axis labels -->
            <text v-for="t in xTicks" :key="'xl'+t"
                :x="xScale(t)" :y="svgH - pb + 14"
                text-anchor="middle" fill="var(--k-text-muted, #94a3b8)" font-size="9"
            >{{ Math.round(t) }}</text>

            <!-- Axis titles (optional) -->
            <text v-if="xLabel" :x="pl + chartW / 2" :y="svgH - 2"
                text-anchor="middle" fill="var(--k-text-muted, #94a3b8)" font-size="10"
            >{{ xLabel }}</text>
            <text v-if="yLabel" :x="11" :y="pt + chartH / 2"
                :transform="`rotate(-90, 11, ${pt + chartH / 2})`"
                text-anchor="middle" fill="var(--k-text-muted, #94a3b8)" font-size="10"
            >{{ yLabel }}</text>

            <!-- Regression line -->
            <line v-if="showRegression && regression"
                :x1="xScale(regression.x1)" :y1="yScale(regression.y1)"
                :x2="xScale(regression.x2)" :y2="yScale(regression.y2)"
                stroke="var(--k-primary, #1db954)" stroke-width="1.5"
                stroke-dasharray="4,3" opacity="0.6" />

            <!-- Points -->
            <circle v-for="(pt2, i) in scaledPoints" :key="i"
                :cx="pt2.x" :cy="pt2.y"
                :r="pt2.r"
                :fill="pt2.color"
                :opacity="0.75"
                class="k-scatter-dot"
            />
            <title v-for="(pt2, i) in points" :key="'t'+i">{{ pt2.label }}: ({{ pt2.x }}, {{ pt2.y }})</title>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
    points: { x: number; y: number; label: string; color?: string; size?: number }[]
    xLabel?: string
    yLabel?: string
    showRegression?: boolean
    height?: number
}>(), { showRegression: true, height: 240 })


const root = ref<HTMLElement>()
const svgW = computed(() => root.value?.clientWidth || 400)
const svgH = computed(() => props.height)
const pr = 12, pt = 12
// Reserve extra room on the axes that carry a title
const pl = computed(() => (props.yLabel ? 56 : 42))
const pb = computed(() => (props.xLabel ? 32 : 20))
const chartW = computed(() => svgW.value - pl.value - pr)
const chartH = computed(() => svgH.value - pt - pb.value)

const xMin = computed(() => Math.min(...props.points.map(p => p.x)) * 0.9)
const xMax = computed(() => Math.max(...props.points.map(p => p.x)) * 1.1)
const yMin = computed(() => Math.min(...props.points.map(p => p.y)) * 0.9)
const yMax = computed(() => Math.max(...props.points.map(p => p.y)) * 1.1)

const xScale = (v: number) => pl.value + ((v - xMin.value) / (xMax.value - xMin.value || 1)) * chartW.value
const yScale = (v: number) => pt + chartH.value - ((v - yMin.value) / (yMax.value - yMin.value || 1)) * chartH.value

const xTicks = computed(() => {
    const step = (xMax.value - xMin.value) / 5
    return Array.from({ length: 6 }, (_, i) => xMin.value + step * i)
})
const yTicks = computed(() => {
    const step = (yMax.value - yMin.value) / 4
    return Array.from({ length: 5 }, (_, i) => yMin.value + step * i)
})

const scaledPoints = computed(() =>
    props.points.map(p => ({
        x: xScale(p.x),
        y: yScale(p.y),
        r: p.size || 5,
        color: p.color || 'var(--k-primary, #1db954)',
    }))
)

// Simple linear regression
const regression = computed(() => {
    const n = props.points.length
    if (n < 2) return null
    const sx = props.points.reduce((a, p) => a + p.x, 0)
    const sy = props.points.reduce((a, p) => a + p.y, 0)
    const sxy = props.points.reduce((a, p) => a + p.x * p.y, 0)
    const sxx = props.points.reduce((a, p) => a + p.x * p.x, 0)
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1)
    const intercept = (sy - slope * sx) / n
    const x1 = xMin.value
    const x2 = xMax.value
    return { x1, y1: slope * x1 + intercept, x2, y2: slope * x2 + intercept }
})
</script>

<style scoped>
.k-scatter { width: 100%; overflow-x: auto; }
.k-scatter svg { display: block; }
.k-scatter-dot { cursor: default; transition: r 0.15s ease; }
.k-scatter-dot:hover { r: 7; }
</style>
