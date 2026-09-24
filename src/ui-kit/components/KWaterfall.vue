<!-- KWaterfall.vue — waterfall chart for P&L / variance -->
<template>
    <div class="k-waterfall" ref="root">
        <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height">
            <!-- Grid lines -->
            <line
                v-for="tick in yTicks"
                :key="'g' + tick"
                :x1="padLeft"
                :x2="width - padRight"
                :y1="yScale(tick)"
                :y2="yScale(tick)"
                stroke="var(--k-border, #e2e8f0)"
                stroke-width="0.5"
            />

            <!-- Connector lines between bars -->
            <template v-for="(d, i) in bars" :key="'c' + i">
                <line
                    v-if="i < bars.length - 1"
                    :x1="d.x + barW"
                    :x2="bars[i + 1].x"
                    :y1="d.val >= 0 ? d.y : d.y + d.h"
                    :y2="d.val >= 0 ? d.y : d.y + d.h"
                    stroke="var(--k-text-muted, #94a3b8)"
                    stroke-width="0.8"
                    stroke-dasharray="3,2"
                />
            </template>

            <!-- Bars -->
            <g v-for="(d, i) in bars" :key="'b' + i">
                <rect
                    :x="d.x"
                    :y="d.y"
                    :width="barW"
                    :height="Math.max(d.h, 1)"
                    :style="{ fill: d.color }"
                    rx="3"
                    class="k-waterfall-bar"
                />
                <text
                    :x="d.x + barW / 2"
                    :y="d.val >= 0 ? d.y - 6 : d.y + d.h + 14"
                    text-anchor="middle"
                    fill="var(--k-text-secondary, #64748b)"
                    font-size="10"
                    font-weight="600"
                >{{ d.rawVal }}</text>
            </g>

            <!-- X-axis labels -->
            <text
                v-for="(d, i) in bars"
                :key="'l' + i"
                :x="d.x + barW / 2"
                :y="height - 4"
                text-anchor="middle"
                fill="var(--k-text-muted, #94a3b8)"
                font-size="9"
                font-weight="500"
            >{{ data[i].label }}</text>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
    data: { label: string; value: number; color?: string }[]
    height?: number
}>(), { height: 200 })


const root = ref<HTMLElement>()
const width = computed(() => root.value?.clientWidth || 400)
const padLeft = 48
const padRight = 12
const padTop = 20
const padBottom = 24

const barW = computed(() => Math.max(20, (width.value - padLeft - padRight) / props.data.length - 8))

const cumulative = computed(() => {
    let running = 0
    return props.data.map(d => {
        const start = running
        running += d.value
        return { start, end: running, raw: d.value }
    })
})

const yMin = computed(() => {
    const vals = cumulative.value.flatMap(c => [c.start, c.end])
    return Math.min(0, ...vals)
})
const yMax = computed(() => {
    const vals = cumulative.value.flatMap(c => [c.start, c.end])
    return Math.max(0, ...vals)
})

const chartH = computed(() => props.height - padTop - padBottom)

const yScale = (v: number) => {
    const range = yMax.value - yMin.value || 1
    return padTop + chartH.value * (1 - (v - yMin.value) / range)
}

const yTicks = computed(() => {
    const min = yMin.value
    const max = yMax.value
    const step = Math.ceil((max - min) / 5 / 1000) * 1000
    const ticks: number[] = []
    for (let v = Math.ceil(min / step) * step; v <= max; v += step) ticks.push(v)
    return ticks
})

const bars = computed(() => {
    const gap = (width.value - padLeft - padRight) / props.data.length
    return cumulative.value.map((c, i) => {
        const val = c.raw
        const top = val >= 0 ? c.end : c.start
        const bot = val >= 0 ? c.start : c.end
        const isTotal = props.data[i].color
        const color = isTotal
            ? props.data[i].color!
            : val >= 0 ? 'var(--k-success)' : 'var(--k-error)'
        return {
            x: padLeft + i * gap + (gap - barW.value) / 2,
            y: yScale(top),
            h: Math.max(yScale(bot) - yScale(top), 1),
            val,
            rawVal: val,
            color,
        }
    })
})
</script>

<style scoped>
.k-waterfall { width: 100%; overflow-x: auto; }
.k-waterfall svg { display: block; }
.k-waterfall-bar { opacity: 0.9; }
.k-waterfall-bar:hover { opacity: 1; }
</style>
