<!-- KDataTableAdvanced.vue — table with expandable rows + sticky header -->
<template>
    <div class="kdt-adv">
        <div class="kdt-adv-head">
            <h4 v-if="title" class="kdt-adv-title">
                <component v-if="icon" :is="icon" :size="16" />
                {{ title }}
            </h4>
            <slot name="header-actions" />
        </div>
        <div class="kdt-adv-scroll" :style="{ maxHeight: maxHeight }">
            <table class="kdt-adv-table">
                <thead>
                    <tr>
                        <th v-if="expandable" class="kdt-adv-th kdt-adv-th-expand" />
                        <th
                            v-for="col in columns"
                            :key="col.key"
                            class="kdt-adv-th"
                            :style="{ width: col.width }"
                        >
                            <span class="kdt-adv-th-inner">
                                {{ col.label }}
                                <button
                                    v-if="col.sortable !== false"
                                    class="kdt-adv-sort"
                                    @click="toggleSort(col.key)"
                                >
                                    <ArrowUpDown :size="11" />
                                </button>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(row, ri) in sortedData" :key="row[rowKey] ?? ri">
                        <tr
                            class="kdt-adv-row"
                            :class="{ 'is-expanded': expandedRows.has(row[rowKey]) }"
                            @click="expandable ? toggleExpand(row[rowKey]) : $emit('row-click', row)"
                        >
                            <td v-if="expandable" class="kdt-adv-td kdt-adv-td-expand">
                                <ChevronRight
                                    :size="14"
                                    class="kdt-adv-chevron"
                                    :class="{ 'is-open': expandedRows.has(row[rowKey]) }"
                                />
                            </td>
                            <td
                                v-for="col in columns"
                                :key="col.key"
                                class="kdt-adv-td"
                                :style="{ width: col.width }"
                            >
                                <slot v-if="col.slot" :name="`col-${col.key}`" :row="row" :index="ri">
                                    {{ row[col.key] }}
                                </slot>
                                <template v-else>
                                    {{ row[col.key] }}
                                </template>
                            </td>
                        </tr>
                        <tr v-if="expandable && expandedRows.has(row[rowKey])" :key="'exp-'+row[rowKey]">
                            <td :colspan="columns.length + 1" class="kdt-adv-expanded">
                                <slot name="expanded" :row="row" :index="ri" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div v-if="$slots.footer" class="kdt-adv-footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpDown, ChevronRight } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    data: any[]
    columns: { key: string; label: string; width?: string; sortable?: boolean; slot?: boolean }[]
    title?: string
    icon?: any
    rowKey?: string
    maxHeight?: string
    expandable?: boolean
}>(), {
    rowKey: 'id',
    maxHeight: '400px',
    expandable: false,
})

defineEmits<{ 'row-click': [row: any] }>()

const expandedRows = ref(new Set<any>())
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

const toggleExpand = (key: any) => {
    const s = new Set(expandedRows.value)
    s.has(key) ? s.delete(key) : s.add(key)
    expandedRows.value = s
}

const toggleSort = (key: string) => {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortDir.value = 'asc'
    }
}

const sortedData = computed(() => {
    if (!sortKey.value) return props.data
    return [...props.data].sort((a, b) => {
        const va = a[sortKey.value] ?? ''
        const vb = b[sortKey.value] ?? ''
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return sortDir.value === 'asc' ? cmp : -cmp
    })
})
</script>

<style scoped>
.kdt-adv {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    overflow: hidden;
    background: var(--k-surface, #f8fafc);
}
.kdt-adv-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #fff);
}
.kdt-adv-title {
    margin: 0; font-size: 0.82rem; font-weight: 800;
    display: flex; align-items: center; gap: 8px;
    color: var(--k-text-primary);
}
.kdt-adv-scroll { overflow-x: auto; }
.kdt-adv-table {
    width: 100%; border-collapse: collapse;
    font-size: 0.78rem;
}
.kdt-adv-th {
    padding: 10px 14px; text-align: start;
    font-size: 0.68rem; font-weight: 700;
    color: var(--k-text-muted);
    background: var(--k-bg, #fff);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    position: sticky; top: 0; z-index: 1;
    white-space: nowrap;
}
.kdt-adv-th-inner { display: flex; align-items: center; gap: 4px; }
.kdt-adv-sort {
    background: none; border: none; cursor: pointer;
    color: var(--k-text-muted); padding: 2px; border-radius: 4px;
    display: flex; transition: all 0.12s;
}
.kdt-adv-sort:hover { color: var(--k-primary); background: var(--k-surface-hover); }
.kdt-adv-td {
    padding: 10px 14px; color: var(--k-text-primary);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}
.kdt-adv-row { cursor: pointer; transition: background 0.1s; }
.kdt-adv-row:hover { background: var(--k-surface-hover, #f1f5f9); }
.kdt-adv-row.is-expanded { background: var(--k-surface-hover, #f1f5f9); }
.kdt-adv-td-expand { width: 32px; text-align: center; }
.kdt-adv-th-expand { width: 32px; }
.kdt-adv-chevron {
    transition: transform 0.2s ease; color: var(--k-text-muted);
}
.kdt-adv-chevron.is-open { transform: rotate(90deg); }
.kdt-adv-expanded {
    padding: 14px 18px;
    background: var(--k-surface-hover, #f1f5f9);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}
.kdt-adv-footer {
    padding: 12px 18px; border-top: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #fff);
}
</style>
