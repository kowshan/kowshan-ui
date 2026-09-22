<!-- KPivotTable — spreadsheet-like aggregation table -->
<template>
    <div class="k-pivot">
        <div class="k-pivot-header">
            <span class="k-pivot-title">{{ title }}</span>
            <span class="k-pivot-count">{{ rows.length }} ردیف</span>
        </div>
        <div class="k-pivot-scroll">
            <table class="k-pivot-table">
                <thead>
                    <tr>
                        <th
                            v-for="col in rowHeaders"
                            :key="col"
                            class="k-pivot-th k-pivot-row-header"
                        >{{ colLabel(col) }}</th>
                        <th
                            v-for="val in columnValues"
                            :key="val"
                            class="k-pivot-th k-pivot-col-header"
                        >{{ val }}</th>
                        <th class="k-pivot-th k-pivot-total-header">مجموع</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(group, gi) in pivotData" :key="gi" class="k-pivot-tr">
                        <td
                            v-for="col in rowHeaders"
                            :key="col"
                            class="k-pivot-td k-pivot-row-cell"
                        >{{ group.key[col] ?? '—' }}</td>
                        <td
                            v-for="val in columnValues"
                            :key="val"
                            class="k-pivot-td k-pivot-value-cell"
                        >{{ formatCell(group.values[val]) }}</td>
                        <td class="k-pivot-td k-pivot-total-cell">
                            {{ formatCell(group.total) }}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="k-pivot-tr k-pivot-footer">
                        <td
                            v-for="col in rowHeaders"
                            :key="col"
                            class="k-pivot-td"
                        >{{ col === rowHeaders[0] ? 'مجموع کل' : '' }}</td>
                        <td
                            v-for="val in columnValues"
                            :key="val"
                            class="k-pivot-td k-pivot-col-total"
                        >{{ formatCell(colTotals[val]) }}</td>
                        <td class="k-pivot-td k-pivot-grand-total">
                            {{ formatCell(grandTotal) }}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    rows: Record<string, any>[]
    rowHeaders?: string[]
    columnField?: string
    valueField?: string
    aggregator?: 'sum' | 'count' | 'avg' | 'min' | 'max'
    title?: string
    format?: (val: number) => string
}>(), {
    rowHeaders: () => [],
    columnField: '',
    valueField: '',
    aggregator: 'sum',
    title: '',
    format: (v: number) => v.toLocaleString('fa-IR')
})

const colLabel = (col: string) => {
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
}

const columnValues = computed(() => {
    const set = new Set<any>()
    props.rows.forEach(r => set.add(r[props.columnField]))
    return [...set]
})

const rowHeaders = computed(() => props.rowHeaders)

const groupKey = (row: Record<string, any>) => {
    const key: Record<string, any> = {}
    props.rowHeaders.forEach(h => { key[h] = row[h] })
    return JSON.stringify(key)
}

const aggregate = (values: number[]): number => {
    if (!values.length) return 0
    switch (props.aggregator) {
        case 'count': return values.length
        case 'avg': return values.reduce((a, b) => a + b, 0) / values.length
        case 'min': return Math.min(...values)
        case 'max': return Math.max(...values)
        default: return values.reduce((a, b) => a + b, 0)
    }
}

const pivotData = computed(() => {
    const groups = new Map<string, { key: Record<string, any>; columns: Map<any, number[]> }>()

    props.rows.forEach(row => {
        const gk = groupKey(row)
        if (!groups.has(gk)) {
            const key: Record<string, any> = {}
            props.rowHeaders.forEach(h => { key[h] = row[h] })
            groups.set(gk, { key, columns: new Map() })
        }
        const g = groups.get(gk)!
        const colVal = row[props.columnField]
        const numVal = Number(row[props.valueField]) || 0
        if (!g.columns.has(colVal)) g.columns.set(colVal, [])
        g.columns.get(colVal)!.push(numVal)
    })

    return [...groups.values()].map(g => {
        const values: Record<string, number> = {}
        let total = 0
        columnValues.value.forEach(cv => {
            const arr = g.columns.get(cv) || []
            values[cv] = aggregate(arr)
            total += values[cv]
        })
        return { ...g, values, total }
    })
})

const colTotals = computed(() => {
    const totals: Record<string, number> = {}
    columnValues.value.forEach(cv => {
        totals[cv] = pivotData.value.reduce((s, g) => s + (g.values[cv] || 0), 0)
    })
    return totals
})

const grandTotal = computed(() => pivotData.value.reduce((s, g) => s + g.total, 0))

const formatCell = (val: number) => props.format(val)
</script>

<style scoped>
.k-pivot { width: 100%; }
.k-pivot-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0;
}
.k-pivot-title { font-size: 0.85rem; font-weight: 700; color: var(--k-text-primary); }
.k-pivot-count { font-size: 0.72rem; color: var(--k-text-muted); }

.k-pivot-scroll { overflow-x: auto; border: 1px solid var(--k-border); border-radius: var(--k-radius-sm); }

.k-pivot-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }

.k-pivot-th {
    padding: 10px 14px; text-align: right; font-weight: 700;
    background: var(--k-surface); border-bottom: 2px solid var(--k-border);
    white-space: nowrap; position: sticky; top: 0; z-index: 1;
}
.k-pivot-col-header { text-align: center; }
.k-pivot-total-header { text-align: center; color: var(--k-primary); }

.k-pivot-td { padding: 9px 14px; border-bottom: 1px solid var(--k-border); color: var(--k-text-primary); }
.k-pivot-row-cell { font-weight: 600; background: var(--k-surface); white-space: nowrap; }
.k-pivot-value-cell { text-align: center; }
.k-pivot-total-cell { text-align: center; font-weight: 700; color: var(--k-primary); }

.k-pivot-footer { border-top: 2px solid var(--k-border); }
.k-pivot-col-total { text-align: center; font-weight: 700; background: var(--k-primary-light); }
.k-pivot-grand-total { text-align: center; font-weight: 700; color: #fff; background: var(--k-primary); }
</style>
