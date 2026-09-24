<!-- components/KGanttChart.vue -->
<!--
    KGanttChart — career gap-analysis:

      <KGanttChart
        :career="careerData"
        :customer="customerData"
        @cell-click="onCellClick"
      />

    Priority-column grid, 2 progress pills per cell (need/you).
-->
<template>
    <div dir="ltr" class="kgantt" :class="{ 'is-inline': inline }">
        <div class="kgantt-scroll">
            <div class="kgantt-grid" :style="{ '--cols': totalColumns }">
                <!-- Column numbers -->
                <div v-if="showPriority" class="kgantt-col-row">
                    <div class="kgantt-col-spacer"></div>
                    <div
                        v-for="col in totalColumns"
                        :key="col"
                        class="kgantt-col-num"
                    >{{ col }}</div>
                </div>

                <!-- Rows -->
                <div
                    v-for="row in normalizedRows"
                    :key="row.type"
                    class="kgantt-row"
                >
                    <!-- Type label -->
                    <div class="kgantt-row-label">
                        <Brain v-if="row.type === 'skills'" :size="13" class="kgantt-row-icon" />
                        <BookOpen v-else-if="row.type === 'knowledges'" :size="13" class="kgantt-row-icon" />
                        <UserCircle2 v-else-if="row.type === 'characters'" :size="13" class="kgantt-row-icon" />
                        <Bot v-else :size="13" class="kgantt-row-icon" />
                        <span class="kgantt-row-title">{{ row.label }}</span>
                    </div>

                    <!-- Cells -->
                    <div class="kgantt-cells">
                        <div
                            v-for="(cell, ci) in row.items"
                            :key="cell ? cell.id : `e-${ci}`"
                            class="kgantt-cell"
                            :class="{
                                'is-empty': !cell,
                                'is-met': cell && cell.customer >= cell.required
                            }"
                            @click="cell && $emit('cell-click', { ...cell, type: row.type, typeLabel: row.label })"
                        >
                            <template v-if="cell">
                                <div class="kgantt-cell-head">
                                    <span class="kgantt-cell-name">{{ cell.title }}</span>
                                    <span
                                        v-if="cell.dependencies?.length"
                                        class="kgantt-cell-dep"
                                    >
                                        <Link :size="8" />{{ cell.dependencies.length }}
                                    </span>
                                </div>

                                <!-- Required pill -->
                                <div class="kgantt-pill-row">
                                    <div class="kgantt-pill-track">
                                        <div
                                            class="kgantt-pill-fill kgantt-pill-fill--req"
                                            :style="{ width: cell.required + '%' }"
                                        ></div>
                                    </div>
                                    <span class="kgantt-pill-val">{{ cell.required }}%</span>
                                </div>

                                <!-- Customer pill -->
                                <div class="kgantt-pill-row">
                                    <div class="kgantt-pill-track">
                                        <div
                                            class="kgantt-pill-fill"
                                            :class="fillClass(cell)"
                                            :style="{ width: cell.customer + '%' }"
                                        ></div>
                                    </div>
                                    <span
                                        class="kgantt-pill-val"
                                        :class="fillClass(cell)"
                                    >{{ cell.customer }}%</span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Legend -->
        <div class="kgantt-legend">
            <span class="kgantt-legend-item">
                <span class="kgantt-legend-swatch" style="background: var(--k-primary)"></span>
                نیاز شغل (بالا)
            </span>
            <span class="kgantt-legend-item">
                <span class="kgantt-legend-swatch" style="background: var(--k-success)"></span>
                سطح شما — تکمیل (پایین)
            </span>
            <span class="kgantt-legend-item">
                <span class="kgantt-legend-swatch" style="background: #F59E0B"></span>
                سطح شما — نزدیک (پایین)
            </span>
            <span class="kgantt-legend-item">
                <span class="kgantt-legend-swatch" style="background: #EF4444"></span>
                سطح شما — شکاف (پایین)
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Brain, BookOpen, Bot, UserCircle2, Link } from 'lucide-vue-next'

export interface GanttItem {
    id: number | string
    title: string
    required: number
    customer: number
    dependencies?: number[]
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
    columns?: number
    /** false = card with background (default), true = flat inline */
    inline?: boolean
    /** show priority column numbers */
    showPriority?: boolean
}>(), {
    title: 'تحلیل شکاف شغلی',
    career: () => ({}),
    customer: () => ({}),
    columns: 0,
    inline: false,
    showPriority: false
})

defineEmits<{
    'cell-click': [payload: GanttItem & { type: string; typeLabel: string }]
}>()

const TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
    skills: { label: 'مهارت‌ها', color: 'var(--k-primary)', icon: Brain },
    knowledges: { label: 'دانش‌ها', color: '#8B5CF6', icon: BookOpen },
    characters: { label: 'رفتارها', color: '#EF4444', icon: UserCircle2 },
    abilities: { label: 'توانایی‌ها', color: '#F59E0B', icon: Bot }
}

const COL_TYPES = ['skills', 'knowledges', 'characters', 'abilities']

const mergedRows = computed(() => {
    return COL_TYPES
        .filter(type => (props.career as any)?.[type]?.length > 0)
        .map(type => {
            const meta = TYPE_META[type]
            const careerItems = (props.career as any)[type] as GanttItem[]
            const customerItems = ((props.customer as any)?.[type] || []) as GanttItem[]
            const cmap = new Map(customerItems.map(c => [c.id, c]))

            return {
                type,
                label: meta.label,
                color: meta.color,
                icon: meta.icon,
                items: careerItems.map(ci => ({
                    ...ci,
                    customer: cmap.get(ci.id)?.customer ?? 0
                }))
            }
        })
})

const totalColumns = computed(() => {
    if (props.columns > 0) return props.columns
    return Math.max(mergedRows.value.reduce((m, r) => Math.max(m, r.items.length), 0), 1)
})

const totalItems = computed(() =>
    mergedRows.value.reduce((s, r) => s + r.items.length, 0)
)

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

const fillClass = (cell: GanttItem) => {
    const gap = cell.required - cell.customer
    if (gap <= 0) return 'is-good'
    if (gap <= 20) return 'is-close'
    if (gap <= 50) return 'is-warn'
    return 'is-far'
}
</script>

<style scoped>
.kgantt {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 16px;
}

.kgantt.is-inline {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
}

/* Scroll */
.kgantt-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--k-border, #e2e8f0) transparent;
}

.kgantt-scroll::-webkit-scrollbar {
    height: 4px;
}

.kgantt-scroll::-webkit-scrollbar-thumb {
    background: var(--k-border, #e2e8f0);
    border-radius: 999px;
}

/* Grid */
.kgantt-grid {
    min-width: max-content;
}

/* Column numbers */
.kgantt-col-row {
    display: grid;
    grid-template-columns: 100px repeat(var(--cols, 1), minmax(120px, 1fr));
    gap: 0;
    padding: 0 0 6px;
    border-bottom: 1px solid color-mix(in srgb, var(--k-border, #e2e8f0) 40%, transparent);
}

.kgantt-col-spacer {
    /* empty first col */
}

.kgantt-col-num {
    text-align: center;
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-text-muted, #94a3b8);
    font-variant-numeric: tabular-nums;
}

/* Row */
.kgantt-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--k-border, #e2e8f0) 30%, transparent);
}

.kgantt-row:last-child {
    border-bottom: none;
}

/* Row label */
.kgantt-row-label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 8px 10px 0;
}

.kgantt-row-icon {
    flex-shrink: 0;
    color: var(--k-text-muted, #94a3b8);
}

.kgantt-row-title {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    white-space: nowrap;
}

/* Cells */
.kgantt-cells {
    display: grid;
    grid-template-columns: repeat(var(--cols, 1), minmax(120px, 1fr));
    gap: 0;
}

.kgantt-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 10px;
    cursor: pointer;
    transition: background 0.12s ease;
    min-width: 0;
    border-left: 1px solid color-mix(in srgb, var(--k-border, #e2e8f0) 25%, transparent);
}

.kgantt-cell:first-child {
    border-left: none;
}

.kgantt-cell:hover:not(.is-empty) {
    background: color-mix(in srgb, var(--k-primary, #1db954) 4%, transparent);
}

.kgantt-cell.is-met {
    background: color-mix(in srgb, var(--k-success) 3%, transparent);
}

.kgantt-cell.is-empty {
    cursor: default;
    opacity: 0.25;
}

/* Cell head */
.kgantt-cell-head {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
}

.kgantt-cell-name {
    font-size: 0.66rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kgantt-cell-dep {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 0.5rem;
    font-weight: 700;
    color: #8B5CF6;
    background: color-mix(in srgb, #8B5CF6 8%, transparent);
    padding: 0 4px;
    border-radius: 999px;
    flex-shrink: 0;
    line-height: 1.6;
}

/* Pill */
.kgantt-pill-row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.kgantt-pill-track {
    flex: 1;
    height: 7px;
    background: color-mix(in srgb, var(--k-border, #e2e8f0) 60%, transparent);
    border-radius: 999px;
    overflow: hidden;
}

.kgantt-pill-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.kgantt-pill-fill--req {
    background: var(--k-primary);
}

.kgantt-pill-fill.is-good { background: var(--k-success); }
.kgantt-pill-fill.is-close { background: var(--k-success); }
.kgantt-pill-fill.is-warn { background: #F59E0B; }
.kgantt-pill-fill.is-far { background: #EF4444; }

.kgantt-pill-val {
    font-size: 0.52rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
    min-width: 24px;
    text-align: left;
    direction: ltr;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
}

.kgantt-pill-val.is-good { color: var(--k-success-text); }
.kgantt-pill-val.is-close { color: var(--k-success-text); }
.kgantt-pill-val.is-warn { color: #D97706; }
.kgantt-pill-val.is-far { color: #DC2626; }

/* Legend */
.kgantt-legend {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    padding-top: 8px;
    margin-top: 4px;
    border-top: 1px solid color-mix(in srgb, var(--k-border, #e2e8f0) 40%, transparent);
}

.kgantt-legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6rem;
    color: var(--k-text-muted, #94a3b8);
}

.kgantt-legend-swatch {
    width: 12px;
    height: 4px;
    border-radius: 999px;
    flex-shrink: 0;
}

@media (max-width: 640px) {
    .kgantt-col-row,
    .kgantt-row {
        grid-template-columns: 80px 1fr;
    }

    .kgantt-cell {
        padding: 6px 8px;
    }
}
</style>
