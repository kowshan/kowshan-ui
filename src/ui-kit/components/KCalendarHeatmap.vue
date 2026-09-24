<!-- KCalendarHeatmap.vue — GitHub-style contribution heatmap -->
<template>
    <div class="k-cal-hm">
        <!-- Month labels — aligned with grid columns -->
        <div class="k-cal-hm-months" v-if="showMonthLabels">
            <span class="k-cal-hm-day-col-spacer" v-if="showDayLabels" />
            <span
                v-for="(m, i) in monthLabels"
                :key="i"
                class="k-cal-hm-month"
                :style="{ gridColumn: m.col }"
            >{{ m.label }}</span>
        </div>
        <div class="k-cal-hm-body">
            <!-- Day labels -->
            <div v-if="showDayLabels" class="k-cal-hm-days">
                <span v-for="d in dayLabels" :key="d" class="k-cal-hm-day">{{ d }}</span>
            </div>
            <!-- Grid -->
            <div class="k-cal-hm-grid">
                <div
                    v-for="(cell, i) in cells"
                    :key="i"
                    class="k-cal-hm-cell"
                    :style="{ background: cell.color }"
                    :title="cell.title"
                />
            </div>
        </div>
        <!-- Legend -->
        <div v-if="showLegend" class="k-cal-hm-legend">
            <span class="k-cal-hm-legend-label">{{ total }}</span>
            <span class="k-cal-hm-legend-text">فعالیت</span>
            <div class="k-cal-hm-legend-scale">
                <span>کم</span>
                <span
                    v-for="(c, i) in scaleColors"
                    :key="i"
                    class="k-cal-hm-cell-sm"
                    :style="{ background: c }"
                />
                <span>زیاد</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monthMap } from '../calendar/data/mapping'

const props = withDefaults(defineProps<{
    data?: Record<string, number>  // 'YYYY-MM-DD': count
    year?: number
    showDayLabels?: boolean
    showMonthLabels?: boolean
    showLegend?: boolean
}>(), {
    showDayLabels: true,
    showMonthLabels: true,
    showLegend: true,
})

const year = computed(() => props.year || new Date().getFullYear())

const dayLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

// Calculate which column each month starts at
const monthLabels = computed(() => {
    const result: { label: string; col: number }[] = []
    const d = new Date(year.value, 0, 1)
    let col = 1 // grid columns are 1-indexed
    const startDayOfWeek = d.getDay() // 0=Sun
    // First week: only some days belong to January
    const daysInFirstWeek = 7 - startDayOfWeek

    let currentMonth = 0
    let weeksInCurrentMonth = 0

    while (d.getFullYear() === year.value) {
        const m = d.getMonth()
        if (m !== currentMonth) {
            if (weeksInCurrentMonth > 0) {
                // Record previous month
                const pm = monthMap[currentMonth + 1] || String(currentMonth + 1)
                result.push({ label: pm, col: col - weeksInCurrentMonth })
            }
            currentMonth = m
            weeksInCurrentMonth = 0
        }
        if (d.getDay() === 0) { // Sunday = start of new week column
            weeksInCurrentMonth++
        }
        d.setDate(d.getDate() + 1)
    }
    // Record last month
    const pm = monthMap[currentMonth + 1] || String(currentMonth + 1)
    result.push({ label: pm, col: col - weeksInCurrentMonth + 1 })

    return result
})

const scaleColors = ['var(--k-surface-hover, #ebedf0)', 'color-mix(in srgb, var(--k-primary) 25%, transparent)', 'color-mix(in srgb, var(--k-primary) 50%, transparent)', 'color-mix(in srgb, var(--k-primary) 75%, transparent)', 'var(--k-primary)']

const total = computed(() => Object.values(props.data || {}).reduce((a, b) => a + b, 0))

const cells = computed(() => {
    const map = props.data || {}
    const result: { color: string; title: string }[] = []
    const d = new Date(year.value, 0, 1)
    // Pad to start of week (Sunday = 0)
    const startDay = d.getDay()
    for (let i = 0; i < startDay; i++) {
        result.push({ color: 'transparent', title: '' })
    }
    while (d.getFullYear() === year.value) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const val = map[key] || 0
        const level = val === 0 ? 0 : val <= 3 ? 1 : val <= 6 ? 2 : val <= 9 ? 3 : 4
        result.push({
            color: val === 0 ? 'var(--k-surface-hover, #ebedf0)' : scaleColors[level],
            title: `${key}: ${val} فعالیت`,
        })
        d.setDate(d.getDate() + 1)
    }
    return result
})
</script>

<style scoped>
.k-cal-hm { overflow-x: auto; }
.k-cal-hm-months {
    display: flex; gap: 0; margin-bottom: 4px;
    position: relative;
}
.k-cal-hm-day-col-spacer {
    min-width: 24px; flex-shrink: 0;
}
.k-cal-hm-month {
    font-size: 0.56rem; color: var(--k-text-muted);
    font-weight: 600; text-align: center;
    white-space: nowrap;
    /* Each month label spans exactly the same width as grid columns below */
    flex: 1 1 0;
}
.k-cal-hm-body { display: flex; gap: 4px; }
.k-cal-hm-days {
    display: flex; flex-direction: column; gap: 2px;
}
.k-cal-hm-day {
    width: 20px; height: 20px; display: flex; align-items: center;
    justify-content: center; font-size: 0.52rem; color: var(--k-text-muted);
    font-weight: 600;
}
.k-cal-hm-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 20px);
    grid-auto-columns: 20px;
    gap: 2px;
}
.k-cal-hm-cell {
    width: 20px; height: 20px; border-radius: 3px;
    transition: transform 0.1s ease;
}
.k-cal-hm-cell:hover { transform: scale(1.3); }
.k-cal-hm-legend {
    display: flex; align-items: center; gap: 8px; margin-top: 10px;
    font-size: 0.6rem; color: var(--k-text-muted);
}
.k-cal-hm-legend-label { font-weight: 800; color: var(--k-text-primary); direction: ltr; }
.k-cal-hm-legend-scale {
    display: flex; align-items: center; gap: 2px; margin-inline-start: auto;
}
.k-cal-hm-cell-sm {
    width: 12px; height: 12px; border-radius: 2px;
}
</style>
