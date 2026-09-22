<!-- components/KGanttAnalysis.vue -->
<!--
    KGanttAnalysis — detailed career gap-analysis matrix:

      <KGanttAnalysis
        :career="careerData"
        :customer="customerData"
        @cell-click="onCellClick"
      />

    Each row = a competency type (skills / knowledges / characters / abilities).
    Columns = max item count across all types (the "priority" scale).
    Each cell shows two bars: required % (career) vs customer % (resume).
    Clicking a cell emits `cell-click` with the item details.
-->
<template>
    <div dir="ltr" class="k-gantt" :style="{ '--gantt-cols': totalColumns }">
        <!-- Header -->
        <div class="k-gantt-header">
            <div class="k-gantt-title">
                <BarChart3 :size="18" />
                <span>{{ title }}</span>
            </div>
            <div class="k-gantt-meta">
                <KBadge :text="`${totalColumns} ${columnLabel}`" variant="primary" size="sm" />
                <KBadge :text="`${totalItems} آیتم`" variant="neutral" size="sm" />
            </div>
        </div>

        <!-- Grid -->
        <div class="k-gantt-grid" role="grid">
            <!-- Column numbers -->
            <div class="k-gantt-col-nums">
                <div class="k-gantt-row-label"></div>
                <div
                    v-for="col in totalColumns"
                    :key="col"
                    class="k-gantt-col-num"
                >
                    {{ col }}
                </div>
            </div>

            <!-- Rows -->
            <div
                v-for="row in normalizedRows"
                :key="row.type"
                class="k-gantt-row"
            >
                <!-- Row label -->
                <div class="k-gantt-row-label">
                    <div
                        class="k-gantt-row-icon"
                        :style="{ background: row.color + '1a', color: row.color }"
                    >
                        <Brain v-if="row.type === 'skills'" :size="14" />
                        <BookOpen v-else-if="row.type === 'knowledges'" :size="14" />
                        <UserCircle2 v-else-if="row.type === 'characters'" :size="14" />
                        <Bot v-else :size="14" />
                    </div>
                    <span class="k-gantt-row-title">{{ row.label }}</span>
                    <KBadge :text="String(row.items.length)" variant="neutral" size="sm" />
                </div>

                <!-- Cells -->
                <div class="k-gantt-row-cells">
                    <div
                        v-for="(cell, ci) in row.items"
                        :key="cell ? cell.id : `empty-${ci}`"
                        class="k-gantt-cell"
                        :class="{
                            'is-empty': !cell,
                            'has-gap': cell && hasGap(cell)
                        }"
                        @click="cell && $emit('cell-click', { ...cell, type: row.type, typeLabel: row.label })"
                    >
                        <template v-if="cell">
                            <span class="k-gantt-cell-title">{{ cell.title }}</span>
                            <div class="k-gantt-cell-bars">
                                <!-- Required bar -->
                                <div class="k-gantt-bar-row">
                                    <span class="k-gantt-bar-label">نیاز</span>
                                    <div class="k-gantt-bar-track">
                                        <div
                                            class="k-gantt-bar-fill k-gantt-bar-required"
                                            :style="{ width: cell.required + '%' }"
                                        ></div>
                                    </div>
                                    <span class="k-gantt-bar-value">{{ cell.required }}٪</span>
                                </div>
                                <!-- Customer bar -->
                                <div class="k-gantt-bar-row">
                                    <span class="k-gantt-bar-label">شما</span>
                                    <div class="k-gantt-bar-track">
                                        <div
                                            class="k-gantt-bar-fill k-gantt-bar-customer"
                                            :style="{
                                                width: cell.customer + '%',
                                                background: getCustomerColor(cell)
                                            }"
                                        ></div>
                                    </div>
                                    <span class="k-gantt-bar-value">{{ cell.customer }}٪</span>
                                </div>
                            </div>
                            <!-- Gap indicator -->
                            <div
                                v-if="hasGap(cell)"
                                class="k-gantt-gap-badge"
                                :class="gapClass(cell)"
                            >
                                <template v-if="cellGap(cell) > 0">
                                    <TrendingUp :size="10" />
                                    <span>{{ cellGap(cell) }}٪ نیاز</span>
                                </template>
                                <template v-else>
                                    <CheckCircle2 :size="10" />
                                    <span>تکمیل</span>
                                </template>
                            </div>
                            <!-- Dependency indicator -->
                            <div
                                v-if="cell.dependencies?.length"
                                class="k-gantt-dep-badge"
                            >
                                <Link :size="10" />
                                <span>{{ cell.dependencies.length }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <span class="k-gantt-cell-empty">—</span>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Legend -->
        <div class="k-gantt-legend">
            <div class="k-gantt-legend-item">
                <span class="k-gantt-legend-dot" style="background: #1db954"></span>
                <span>نیاز شغل</span>
            </div>
            <div class="k-gantt-legend-item">
                <span class="k-gantt-legend-dot" style="background: #10B981"></span>
                <span>سطح شما</span>
            </div>
            <div class="k-gantt-legend-item">
                <span class="k-gantt-legend-dot" style="background: #F59E0B"></span>
                <span>نیاز به بهبود</span>
            </div>
            <div class="k-gantt-legend-item">
                <span class="k-gantt-legend-dot" style="background: #EF4444"></span>
                <span>شکاف بزرگ</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    Brain,
    BookOpen,
    Bot,
    UserCircle2,
    TrendingUp,
    CheckCircle2,
    Link,
    BarChart3
} from 'lucide-vue-next'
import KBadge from './KBadge.vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface GanttItem {
    id: number | string
    title: string
    required: number
    customer: number
    dependencies?: number[]
}

export interface GanttRow {
    type: string
    label: string
    icon?: any
    color?: string
    items: GanttItem[]
}

export interface GanttCareerData {
    skills?: GanttItem[]
    knowledges?: GanttItem[]
    characters?: GanttItem[]
    abilities?: GanttItem[]
}

export interface GanttCustomerData {
    skills?: GanttItem[]
    knowledges?: GanttItem[]
    characters?: GanttItem[]
    abilities?: GanttItem[]
}

const props = withDefaults(defineProps<{
    title?: string
    career?: GanttCareerData
    customer?: GanttCustomerData
    /** manually override column count (defaults to max items across all rows) */
    columns?: number
}>(), {
    title: 'تحلیل شکاف شغلی',
    career: () => ({}),
    customer: () => ({}),
    columns: 0
})

defineEmits<{
    'cell-click': [payload: GanttItem & { type: string; typeLabel: string }]
}>()

const { toPersianDigits } = usePersianNumbers()

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    skills: { label: 'مهارت‌ها', icon: Brain, color: '#1db954' },
    knowledges: { label: 'دانش‌ها', icon: BookOpen, color: '#8B5CF6' },
    characters: { label: 'رفتارها', icon: UserCircle2, color: '#EF4444' },
    abilities: { label: 'توانایی‌ها', icon: Bot, color: '#F59E0B' }
}

const COLUMN_TYPES = ['skills', 'knowledges', 'characters', 'abilities']

// Merge career required % with customer actual % per type
const mergedRows = computed((): GanttRow[] => {
    return COLUMN_TYPES
        .filter(type => {
            const careerItems = (props.career as any)?.[type] || []
            return careerItems.length > 0
        })
        .map(type => {
            const cfg = TYPE_CONFIG[type]
            const careerItems = (props.career as any)?.[type] || []
            const customerItems = (props.customer as any)?.[type] || []

            // Index customer items by id for quick lookup
            const customerMap = new Map<number | string, GanttItem>()
            for (const ci of customerItems) {
                customerMap.set(ci.id, ci)
            }

            const items = careerItems.map((careerItem: GanttItem) => {
                const custItem = customerMap.get(careerItem.id)
                return {
                    ...careerItem,
                    customer: custItem?.customer ?? 0
                }
            })

            return {
                type,
                label: cfg.label,
                icon: cfg.icon,
                color: cfg.color,
                items
            }
        })
})

// Max items across all rows = column count
const totalColumns = computed(() => {
    if (props.columns > 0) return props.columns
    const max = mergedRows.value.reduce((m, r) => Math.max(m, r.items.length), 0)
    return Math.max(max, 1)
})

const totalItems = computed(() =>
    mergedRows.value.reduce((sum, r) => sum + r.items.length, 0)
)

const columnLabel = computed(() =>
    totalColumns.value === 1 ? 'ستون' : 'ستون'
)

// Pad each row with nulls to match totalColumns
const normalizedRows = computed(() => {
    const cols = totalColumns.value
    return mergedRows.value.map(row => ({
        ...row,
        items: [
            ...row.items,
            ...Array(Math.max(0, cols - row.items.length)).fill(null)
        ]
    }))
})

// Gap = required - customer (positive = needs improvement)
const cellGap = (cell: GanttItem) => cell.required - cell.customer
const hasGap = (cell: GanttItem) => cell.required > cell.customer

const gapClass = (cell: GanttItem) => {
    const gap = cellGap(cell)
    if (gap <= 0) return 'is-complete'
    if (gap <= 20) return 'is-close'
    if (gap <= 50) return 'is-medium'
    return 'is-far'
}

const getCustomerColor = (cell: GanttItem) => {
    const gap = cellGap(cell)
    if (gap <= 0) return '#10B981'    // met or exceeded
    if (gap <= 20) return '#10B981'   // close
    if (gap <= 50) return '#F59E0B'   // needs work
    return '#EF4444'                   // big gap
}
</script>

<style scoped>
.k-gantt {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px;
    overflow-x: auto;
}

/* Header */
.k-gantt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.k-gantt-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-gantt-meta {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Grid */
.k-gantt-grid {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 600px;
}

/* Column numbers */
.k-gantt-col-nums {
    display: grid;
    grid-template-columns: 140px repeat(var(--gantt-cols, 1), 1fr);
    gap: 4px;
    align-items: center;
}

.k-gantt-col-num {
    text-align: center;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
    padding: 4px 0;
}

/* Row */
.k-gantt-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 4px;
    align-items: stretch;
    min-height: 80px;
}

.k-gantt-row-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 8px;
    background: var(--k-surface-hover, #f8fafc);
    border-radius: 10px;
    min-width: 0;
}

.k-gantt-row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
}

.k-gantt-row-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Row cells container */
.k-gantt-row-cells {
    display: grid;
    grid-template-columns: repeat(var(--gantt-cols, 1), 1fr);
    gap: 4px;
}

/* Cell */
.k-gantt-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 10px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s ease;
    min-width: 0;
    position: relative;
}

.k-gantt-cell:hover:not(.is-empty) {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 40%, var(--k-border, #e2e8f0));
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
}

.k-gantt-cell.is-empty {
    background: var(--k-surface-hover, #f8fafc);
    border-style: dashed;
    cursor: default;
    opacity: 0.5;
}

.k-gantt-cell.has-gap {
    border-left: 3px solid var(--k-warning, #f59e0b);
}

.k-gantt-cell-title {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
}

/* Bars */
.k-gantt-cell-bars {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.k-gantt-bar-row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.k-gantt-bar-label {
    font-size: 0.58rem;
    color: var(--k-text-muted, #94a3b8);
    width: 24px;
    flex-shrink: 0;
    text-align: start;
}

.k-gantt-bar-track {
    flex: 1;
    height: 6px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 999px;
    overflow: hidden;
}

.k-gantt-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.4s ease;
}

.k-gantt-bar-required {
    background: #1db954;
}

.k-gantt-bar-customer {
    background: #10B981;
}

.k-gantt-bar-value {
    font-size: 0.56rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    width: 28px;
    text-align: left;
    direction: ltr;
    flex-shrink: 0;
}

/* Gap badge */
.k-gantt-gap-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.54rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
    white-space: nowrap;
    margin-top: 1px;
}

.k-gantt-gap-badge.is-close {
    background: color-mix(in srgb, #10B981 12%, transparent);
    color: #059669;
}

.k-gantt-gap-badge.is-medium {
    background: color-mix(in srgb, #F59E0B 12%, transparent);
    color: #D97706;
}

.k-gantt-gap-badge.is-far {
    background: color-mix(in srgb, #EF4444 12%, transparent);
    color: #DC2626;
}

.k-gantt-gap-badge.is-complete {
    background: color-mix(in srgb, #10B981 12%, transparent);
    color: #059669;
}

/* Dependency badge */
.k-gantt-dep-badge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 0.52rem;
    color: var(--k-info, #8B5CF6);
    background: color-mix(in srgb, #8B5CF6 8%, transparent);
    padding: 1px 5px;
    border-radius: 999px;
    white-space: nowrap;
}

.k-gantt-cell-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 0.8rem;
    color: var(--k-text-muted, #94a3b8);
}

/* Legend */
.k-gantt-legend {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    padding-top: 12px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-gantt-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    color: var(--k-text-secondary, #64748b);
}

.k-gantt-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .k-gantt {
        padding: 14px;
    }

    .k-gantt-row {
        grid-template-columns: 110px 1fr;
    }

    .k-gantt-col-nums {
        grid-template-columns: 110px repeat(var(--gantt-cols, 1), 1fr);
    }
}
</style>
