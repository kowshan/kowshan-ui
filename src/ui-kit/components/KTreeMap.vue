<!-- KTreeMap.vue — treemap visualization for hierarchical data -->
<template>
    <div class="k-treemap" ref="root">
        <div
            v-for="(rect, i) in layout"
            :key="i"
            class="k-treemap-rect"
            :style="{
                left: rect.x + '%',
                top: rect.y + '%',
                width: rect.w + '%',
                height: rect.h + '%',
                background: rect.color,
            }"
        >
            <div class="k-treemap-inner">
                <span class="k-treemap-label">{{ rect.label }}</span>
                <span class="k-treemap-value">{{ rect.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    data: { label: string; value: number; color?: string }[]
}>()


const palette = ['#1db954','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#14b8a6']

const total = computed(() => props.data.reduce((a, b) => a + b.value, 0))

// Simple squarified treemap layout
const layout = computed(() => {
    const sorted = [...props.data].sort((a, b) => b.value - a.value)
    const items = sorted.map((d, i) => ({
        ...d,
        color: d.color || palette[i % palette.length],
        pct: d.value / (total.value || 1),
    }))

    const rects: { x: number; y: number; w: number; h: number; label: string; value: number; color: string }[] = []
    let remaining = [...items]
    let x = 0, y = 0, w = 100, h = 100
    let isHorizontal = true

    while (remaining.length > 0) {
        const totalVal = remaining.reduce((a, b) => a + b.pct, 0)
        const side = isHorizontal ? w : h

        // Find best split
        let bestRow: typeof remaining = [remaining[0]]
        let bestRatio = Infinity

        for (let split = 1; split <= remaining.length; split++) {
            const row = remaining.slice(0, split)
            const rowSum = row.reduce((a, b) => a + b.pct, 0)
            const rowArea = (rowSum / totalVal) * (isHorizontal ? w * h : w * h) * (rowSum / totalVal)
            const sideLen = side * (rowSum / totalVal)
            const worstRatio = row.reduce((worst, item) => {
                const area = (item.pct / totalVal) * (isHorizontal ? w * h : w * h)
                const otherSide = sideLen > 0 ? area / sideLen : 0
                const ratio = Math.max(sideLen / (otherSide || 1), (otherSide || 1) / sideLen)
                return Math.max(worst, ratio)
            }, 0)

            if (worstRatio <= bestRatio) {
                bestRatio = worstRatio
                bestRow = row
            } else break
        }

        const rowSum = bestRow.reduce((a, b) => a + b.pct, 0)
        const fraction = rowSum / totalVal
        let cx = x, cy = y

        for (const item of bestRow) {
            const itemFraction = item.pct / rowSum
            if (isHorizontal) {
                rects.push({
                    x: cx, y: cy,
                    w: fraction * w,
                    h: itemFraction * h * fraction / fraction,
                    label: item.label, value: item.value, color: item.color,
                })
                const itemH = itemFraction * h
                cy += itemH
            } else {
                rects.push({
                    x: cx, y: cy,
                    w: itemFraction * w,
                    h: fraction * h,
                    label: item.label, value: item.value, color: item.color,
                })
                const itemW = itemFraction * w
                cx += itemW
            }
        }

        if (isHorizontal) {
            x += fraction * w
            w -= fraction * w
        } else {
            y += fraction * h
            h -= fraction * h
        }
        isHorizontal = !isHorizontal
        remaining = remaining.slice(bestRow.length)
    }

    return rects
})
</script>

<style scoped>
.k-treemap {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    border-radius: 12px;
    overflow: hidden;
}
.k-treemap-rect {
    position: absolute;
    border: 1px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
    cursor: default;
}
.k-treemap-rect:hover { transform: scale(0.97); z-index: 1; }
.k-treemap-inner {
    text-align: center;
    padding: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}
.k-treemap-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
    line-height: 1.2;
}
.k-treemap-value {
    font-size: 0.58rem;
    font-weight: 800;
    color: rgba(255,255,255,0.8);
    direction: ltr;
}
</style>
