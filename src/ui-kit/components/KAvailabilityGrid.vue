<!-- components/KAvailabilityGrid.vue -->
<!--
    KAvailabilityGrid — Jalali reservation grid (free / booked / partial / blocked).
    All month math + status logic lives in useAvailabilityGrid so reservation
    pages can reuse it without this component.
-->
<template>
    <div dir="ltr" class="k-avail">
        <!-- Header -->
        <div class="k-avail-head">
            <div class="k-avail-nav">
                <button type="button" class="k-avail-nav-btn" aria-label="ماه بعد" @click="next">
                    <ChevronLeft class="icon" />
                </button>
            </div>
            <div class="k-avail-title">{{ grid.monthName.value }} {{ grid.faNum(grid.year.value) }}</div>
            <div class="k-avail-nav">
                <button type="button" class="k-avail-nav-btn" aria-label="ماه قبل" @click="prev">
                    <ChevronRight class="icon" />
                </button>
            </div>
        </div>

        <!-- Weekdays -->
        <div class="k-avail-weekdays">
            <div v-for="d in grid.weekDays.value" :key="d">{{ d }}</div>
        </div>

        <!-- Grid -->
        <div class="k-avail-grid">
            <div v-for="i in grid.leadingCells.value" :key="'p' + i" class="k-avail-cell is-empty"></div>
            <button
                v-for="dayNum in grid.daysInMonth.value"
                :key="dayNum"
                type="button"
                class="k-avail-cell"
                :class="[
                    `is-${grid.statusOf(dayNum)}`,
                    { 'is-today': grid.isToday(dayNum), 'is-selected': dayNum === grid.selectedDay.value }
                ]"
                :disabled="!selectable"
                :aria-label="`${grid.faNum(dayNum)} — ${grid.statusLabel(grid.statusOf(dayNum))}`"
                @click="pick(dayNum)"
            >
                <span class="k-avail-day">{{ grid.faNum(dayNum) }}</span>
                <span class="k-avail-dot" v-if="grid.statusOf(dayNum) !== 'free'"></span>
            </button>
            <div v-for="i in grid.trailingCells.value" :key="'t' + i" class="k-avail-cell is-empty"></div>
        </div>

        <!-- Legend -->
        <div v-if="showLegend" class="k-avail-legend">
            <span class="k-avail-legend-item"><span class="dot is-free"></span> آزاد</span>
            <span class="k-avail-legend-item"><span class="dot is-booked"></span> رزرو</span>
            <span class="k-avail-legend-item"><span class="dot is-partial"></span> نیمه</span>
            <span class="k-avail-legend-item"><span class="dot is-blocked"></span> مسدود</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import {
    useAvailabilityGrid,
    type AvailabilityStatus
} from '../composables/useAvailabilityGrid'

const props = withDefaults(defineProps<{
    /** Jalali year (defaults to current) */
    year?: number
    /** Jalali month 1-12 (defaults to current) */
    month?: number
    /** availability per day of month; missing days default to 'free' */
    statuses?: Record<number, AvailabilityStatus>
    selectable?: boolean
    showLegend?: boolean
}>(), {
    selectable: true,
    showLegend: true
})

const emits = defineEmits<{
    'update:year': [value: number]
    'update:month': [value: number]
    'select': [day: number]
}>()

const grid = useAvailabilityGrid({
    year: props.year,
    month: props.month,
    statuses: props.statuses,
    selectable: props.selectable
})

const prev = () => {
    grid.shiftMonth(-1)
    emits('update:year', grid.year.value)
    emits('update:month', grid.month.value)
}

const next = () => {
    grid.shiftMonth(1)
    emits('update:year', grid.year.value)
    emits('update:month', grid.month.value)
}

const pick = (day: number) => {
    if (!props.selectable) return
    grid.select(day)
    emits('select', day)
}
</script>

<style scoped>
.k-avail {
    width: 100%;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    padding: 16px;
    user-select: none;
}

.k-avail-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.k-avail-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-avail-nav {
    display: flex;
    gap: 4px;
}

.k-avail-nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 8px;
    background: var(--k-surface, #f8fafc);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-avail-nav-btn:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-avail-nav-btn .icon {
    width: 15px;
    height: 15px;
}

.k-avail-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 6px;
}

.k-avail-weekdays div {
    text-align: center;
    font-size: 0.66rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
    padding: 4px 0;
}

.k-avail-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.k-avail-cell {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-avail-cell.is-empty {
    background: transparent;
    cursor: default;
}

/* States */
.k-avail-cell.is-free {
    background: color-mix(in srgb, var(--k-success) 10%, transparent);
    color: var(--k-success-text);
}

.k-avail-cell.is-booked {
    background: color-mix(in srgb, #ef4444 12%, transparent);
    color: #dc2626;
}

.k-avail-cell.is-partial {
    background: color-mix(in srgb, #f59e0b 14%, transparent);
    color: #d97706;
}

.k-avail-cell.is-blocked {
    background: var(--k-surface, #f8fafc);
    color: var(--k-text-muted, #94a3b8);
    text-decoration: line-through;
}

.k-avail-cell.is-today {
    box-shadow: inset 0 0 0 2px var(--k-primary, #1db954);
}

.k-avail-cell.is-selected {
    background: var(--k-primary, #1db954);
    color: #fff;
    box-shadow: 0 2px 8px rgba(202, 114, 38, 0.4);
}

.k-avail-cell:not(.is-empty):not(.is-selected):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
}

.k-avail-dot {
    position: absolute;
    bottom: 4px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
}

.k-avail-legend {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-avail-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
}

.k-avail-legend-item .dot {
    width: 8px;
    height: 8px;
    border-radius: 3px;
}

.dot.is-free { background: var(--k-success, #10b981); }
.dot.is-booked { background: var(--k-error, #ef4444); }
.dot.is-partial { background: var(--k-warning, #f59e0b); }
.dot.is-blocked { background: var(--k-text-muted, #94a3b8); }
</style>
