<!-- components/KActivityHeatmap.vue -->
<!--
    KActivityHeatmap — GitHub-style activity heatmap for CRM data
    (deals per day, calls, visits…). Rows are weekdays (Saturday first),
    columns are weeks; intensity is 0-4 based on the count.

      <KActivityHeatmap :data="{ '2026-08-10': 3, '2026-08-11': 1, … }" />

    Keys are ISO dates (YYYY-MM-DD). Everything renders with Jalali month
    labels and Persian digits. Colors follow the kit's theme tokens.
-->
<template>
    <div class="k-heatmap" :class="`k-heatmap-${size}`">
        <!-- Month labels row -->
        <div class="k-heatmap-months" :style="{ marginInlineStart: `${weekdayW}px` }">
            <span
                v-for="(label, i) in monthLabels"
                :key="i"
                class="k-heatmap-month"
                :style="leftStyle(label.offset)"
            >{{ label.text }}</span>
        </div>

        <div class="k-heatmap-body">
            <!-- Weekday labels -->
            <div class="k-heatmap-weekdays">
                <span v-for="d in weekdayLabels" :key="d">{{ d }}</span>
            </div>

            <!-- Cells -->
            <div class="k-heatmap-grid" ref="gridRef">
                <div
                    v-for="(week, wi) in gridWeeks"
                    :key="wi"
                    class="k-heatmap-week"
                >
                    <div
                        v-for="(cell, di) in week"
                        :key="di"
                        class="k-heatmap-cell"
                        :class="`level-${cell.level}`"
                        :title="cell.title"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Legend -->
        <div class="k-heatmap-legend">
            <span class="k-heatmap-legend-label">کمتر</span>
            <span v-for="l in 5" :key="l" class="k-heatmap-cell" :class="`level-${l - 1}`"></span>
            <span class="k-heatmap-legend-label">بیشتر</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { toJalali } from '../calendar/core/calendarEngine'

const props = withDefaults(defineProps<{
    /** ISO date (YYYY-MM-DD) → count */
    data?: Record<string, number>
    /** how many weeks to show (default ~12 months) */
    weeks?: number
    size?: 'sm' | 'md'
}>(), {
    data: () => ({}),
    weeks: 52,
    size: 'md'
})

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const WEEKDAY_LABELS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const weekdayW = 22 // width reserved for the weekday labels

const levelOf = (count: number) => {
    if (!count) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 10) return 3
    return 4
}

/* Build the grid: `weeks` columns × 7 rows, ending today */
const grid = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - (props.weeks * 7 - 1))

    const cols: { cells: { level: number; title: string }[]; monthStart: number }[] = []
    const iso = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    let total = 0
    let prevMonth = -1

    for (let w = 0; w < props.weeks; w++) {
        const cells: { level: number; title: string }[] = []
        let monthStart = -1
        for (let d = 0; d < 7; d++) {
            const day = new Date(start)
            day.setDate(start.getDate() + w * 7 + d)
            if (day > today) { cells.push({ level: 0, title: '' }); continue }
            const count = props.data[iso(day)] ?? 0
            total += count
            const j = toJalali(day)
            if (j.month !== prevMonth) {
                prevMonth = j.month
                monthStart = d
            }
            const title = `${j.year}/${String(j.month).padStart(2, '0')}/${String(j.day).padStart(2, '0')} — ${faNum(count)} فعالیت`
            cells.push({ level: levelOf(count), title })
        }
        cols.push({ cells, monthStart })
    }

    return { cols, total }
})

/* Jalali month labels positioned over the columns where a month starts */
const monthLabels = computed(() => {
    const labels: { text: string; offset: number }[] = []
    let prevJ: { month: number } | null = null
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - (props.weeks * 7 - 1))

    for (let w = 0; w < props.weeks; w++) {
        const day = new Date(start)
        day.setDate(start.getDate() + w * 7)
        const j = toJalali(day)
        if (!prevJ || j.month !== prevJ.month) {
            labels.push({ text: MONTHS[j.month - 1], offset: (w / props.weeks) * 100 })
            prevJ = j
        }
    }
    return labels
})

const leftStyle = (offset: number) => ({
    insetInlineStart: `${offset}%`,
})

const gridWeeks = computed<{ level: number; title: string }[][]>(() => grid.value.cols.map(c => c.cells))
const weekdayLabels = WEEKDAY_LABELS
</script>

<style scoped>
.k-heatmap {
    width: 100%;
    user-select: none;
    font-family: inherit;
}

.k-heatmap-months {
    position: relative;
    height: 16px;
    margin-bottom: 4px;
    /* extend into the grid area */
    margin-inline-end: 0;
}

.k-heatmap-month {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-text-muted);
    white-space: nowrap;
}

.k-heatmap-body {
    display: flex;
    gap: 6px;
}

.k-heatmap-weekdays {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 22px;
    flex-shrink: 0;
    padding: 2px 0;
    font-size: 0.6rem;
    color: var(--k-text-muted);
    text-align: center;
}

.k-heatmap-grid {
    display: flex;
    gap: 3px;
    flex: 1;
    min-width: 0;
}

.k-heatmap-week {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.k-heatmap-cell {
    width: 11px;
    height: 11px;
    border-radius: 3px;
    background: var(--k-surface-hover, #e2e8f0);
    flex-shrink: 0;
}

/* intensity — always theme-aware via color-mix on the accent */
.k-heatmap-cell.level-1 {
    background: color-mix(in srgb, var(--k-primary, #1db954) 25%, var(--k-surface-hover, #e2e8f0));
}

.k-heatmap-cell.level-2 {
    background: color-mix(in srgb, var(--k-primary, #1db954) 50%, var(--k-surface-hover, #e2e8f0));
}

.k-heatmap-cell.level-3 {
    background: color-mix(in srgb, var(--k-primary, #1db954) 75%, var(--k-surface-hover, #e2e8f0));
}

.k-heatmap-cell.level-4 {
    background: var(--k-primary, #1db954);
}

.k-heatmap-legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    justify-content: flex-end;
}

.k-heatmap-legend-label {
    font-size: 0.6rem;
    color: var(--k-text-muted);
    margin: 0 2px;
}

/* smaller variant */
.k-heatmap-sm .k-heatmap-cell {
    width: 9px;
    height: 9px;
    border-radius: 2px;
}

.k-heatmap-sm .k-heatmap-week,
.k-heatmap-sm .k-heatmap-grid {
    gap: 2px;
}
</style>
