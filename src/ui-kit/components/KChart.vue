<!-- components/KChart.vue -->
<template>
    <div class="k-chart" :class="[`k-chart-${type}`, { 'is-donut': type === 'donut' }]">
        <!-- Donut -->
        <div v-if="type === 'donut'" class="k-chart-donut" :style="{ width: size + 'px', height: size + 'px' }">
            <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size">
                <circle
                    v-for="(seg, i) in donutSegments"
                    :key="i"
                    cx="50%"
                    cy="50%"
                    :r="radius"
                    fill="none"
                    :stroke="seg.color"
                    :stroke-width="donutThickness"
                    stroke-linecap="butt"
                    :stroke-dasharray="`${seg.length} ${circumference - seg.length}`"
                    :stroke-dashoffset="seg.offset"
                    :transform="`rotate(-90 ${size / 2} ${size / 2})`"
                />
            </svg>
            <div class="k-chart-donut-center">
                <span class="value">{{ centerValue }}</span>
                <span class="label">{{ centerLabel }}</span>
            </div>
        </div>

        <!-- Line / Area / Bar -->
        <svg
            v-else
            class="k-chart-svg"
            :viewBox="`0 0 ${viewW} ${viewH}`"
            preserveAspectRatio="none"
            :style="{ height: height + 'px' }"
        >
            <defs>
                <linearGradient :id="`k-chart-fill-${uid}`" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="mainColor" stop-opacity="0.28" />
                    <stop offset="100%" :stop-color="mainColor" stop-opacity="0.02" />
                </linearGradient>
            </defs>

            <!-- Grid lines -->
            <g v-if="showGrid" class="k-chart-grid">
                <line
                    v-for="i in gridCount"
                    :key="'g' + i"
                    :x1="padL"
                    :x2="viewW - padR"
                    :y1="y(i)"
                    :y2="y(i)"
                />
            </g>

            <!-- Y labels -->
            <g v-if="showAxis" class="k-chart-axis">
                <text
                    v-for="i in gridCount"
                    :key="'y' + i"
                    :x="padL - 6"
                    :y="y(i) + 4"
                    text-anchor="end"
                >
                    {{ formatTick(yMax - ((yMax - yMin) * (i - 1)) / (gridCount - 1)) }}
                </text>
            </g>

            <!-- Area fill -->
            <path
                v-if="type === 'area'"
                class="k-chart-area"
                :d="areaPath"
                :fill="`url(#k-chart-fill-${uid})`"
            />

            <!-- Line -->
            <path
                v-if="type === 'line' || type === 'area'"
                class="k-chart-line"
                :d="linePath"
                :stroke="mainColor"
            />

            <!-- Bars -->
            <g v-if="type === 'bar'" class="k-chart-bars">
                <rect
                    v-for="(d, i) in data"
                    :key="'b' + i"
                    :x="barX(i)"
                    :y="barY(i)"
                    :width="barW"
                    :height="barH(i)"
                    rx="3"
                    :fill="colorFor(i)"
                />
            </g>

            <!-- Points -->
            <g v-if="type === 'line' || type === 'area'" class="k-chart-points">
                <circle
                    v-for="(d, i) in data"
                    :key="'p' + i"
                    :cx="x(i)"
                    :cy="yValue(d.value)"
                    r="3"
                    :fill="colorFor(i)"
                />
            </g>

            <!-- X labels -->
            <g v-if="showAxis" class="k-chart-axis">
                <text
                    v-for="(d, i) in data"
                    :key="'x' + i"
                    :x="type === 'bar' ? barX(i) + barW / 2 : x(i)"
                    :y="viewH - 4"
                    text-anchor="middle"
                >
                    {{ d.label }}
                </text>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface KChartDatum {
    label: string
    value: number
    color?: string
}

const props = withDefaults(defineProps<{
    type?: 'line' | 'area' | 'bar' | 'donut'
    data: KChartDatum[]
    height?: number
    /** single color or palette (used in order) */
    colors?: string[]
    showGrid?: boolean
    showAxis?: boolean
    /** donut options */
    donutSize?: number
    donutThickness?: number
    centerLabel?: string
    valueFormatter?: (v: number) => string
}>(), {
    type: 'line',
    height: 220,
    colors: () => ['#1db954', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
    showGrid: true,
    showAxis: true,
    donutSize: 180,
    donutThickness: 26,
    centerLabel: 'مجموع'
})

const uid = computed(() => Math.random().toString(36).slice(2, 8))
const mainColor = computed(() => props.colors[0])


const colorFor = (i: number) => props.data[i]?.color || props.colors[i % props.colors.length]

const formatTick = (v: number) => {
    const s = v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(Math.round(v))
    return s
}

/* ── Cartesians ── */
const padL = 34
const padR = 12
const padT = 14
const padB = 24

const viewW = 640
const viewH = computed(() => 320)

const values = computed(() => props.data.map(d => d.value))
const yMax = computed(() => {
    const m = Math.max(...values.value, 0)
    return m <= 0 ? 10 : m * 1.15
})
const yMin = computed(() => 0)

const gridCount = 4

const plotW = computed(() => viewW - padL - padR)
const plotH = computed(() => viewH.value - padT - padB)

const x = (i: number) => padL + (plotW.value * i) / Math.max(1, props.data.length - 1)
const yValue = (v: number) => padT + plotH.value * (1 - (v - yMin.value) / (yMax.value - yMin.value))
const y = (i: number) => padT + (plotH.value * (i - 1)) / (gridCount - 1)

/* Smooth line through points (quadratic midpoint technique) */
const linePath = computed(() => {
    const pts = props.data.map((d, i) => ({ x: x(i), y: yValue(d.value) }))
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1]
        const cur = pts[i]
        const mx = (prev.x + cur.x) / 2
        d += ` C ${mx} ${prev.y}, ${mx} ${cur.y}, ${cur.x} ${cur.y}`
    }
    return d
})

const areaPath = computed(() => {
    if (!props.data.length) return ''
    const base = padT + plotH.value
    return `${linePath.value} L ${x(props.data.length - 1)} ${base} L ${x(0)} ${base} Z`
})

/* Bars */
const barW = computed(() => {
    const n = props.data.length
    return Math.max(8, (plotW.value / n) * 0.55)
})
const barX = (i: number) => {
    const n = props.data.length
    const slot = plotW.value / n
    return padL + slot * i + (slot - barW.value) / 2
}
const barH = (i: number) => Math.max(2, plotH.value * (props.data[i].value / (yMax.value - yMin.value)))
const barY = (i: number) => padT + plotH.value - barH(i)

/* ── Donut ── */
const size = computed(() => props.donutSize)
const radius = computed(() => size.value / 2 - props.donutThickness / 2 - 4)
const circumference = computed(() => 2 * Math.PI * radius.value)

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const donutSegments = computed(() => {
    let acc = 0
    return props.data.map((d, i) => {
        const length = total.value > 0 ? (d.value / total.value) * circumference.value : 0
        const seg = { length, offset: -acc, color: colorFor(i) }
        acc += length
        return seg
    })
})

const centerValue = computed(() => {
    const fmt = props.valueFormatter
    return fmt ? fmt(total.value) : total.value.toLocaleString('en-US')
})
</script>

<style scoped>
.k-chart {
    width: 100%;
}

.k-chart-svg {
    width: 100%;
    overflow: visible;
}

.k-chart-grid line {
    stroke: var(--k-border, #e2e8f0);
    stroke-width: 1;
    stroke-dasharray: 3 4;
}

.k-chart-axis text {
    font-size: 10px;
    fill: var(--k-text-muted, #94a3b8);
    font-family: inherit;
}

.k-chart-line {
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.k-chart-points circle {
    stroke: #ffffff;
    stroke-width: 1.5;
}

/* Donut */
.k-chart-donut {
    position: relative;
    margin: 0 auto;
}

.k-chart-donut svg {
    display: block;
}

.k-chart-donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.k-chart-donut-center .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-chart-donut-center .label {
    font-size: 0.7rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
