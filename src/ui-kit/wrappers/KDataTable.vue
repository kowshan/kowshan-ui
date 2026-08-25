<!-- wrappers/KDataTable.vue -->
<template>
    <div class="k-data-table">

        <!-- HEADER -->
        <div v-if="!noHeader" class="dt__header">

            <div class="dt__toolbar">

                <!-- TITLE -->
                <div class="dt__title">
                    <KIconButton
                        :icon="icon"
                        bg-color="#1db954"
                        text-color="#ffffff"
                    />

                    <slot name="title">
                        <span v-if="title">
                            {{ title }}
                        </span>
                    </slot>
                </div>

                <!-- TOOLBAR -->
                <div class="dt__tools">

                    <!-- CUSTOM TOOL SLOTS -->
                    <slot name="tools"></slot>

                    <!-- COLUMN VISIBILITY -->
                    <div class="dt__tool" ref="columnRef">
                        <KIconButton
                            :icon="SettingsIcon"
                            bg-color="#1db954"
                            text-color="#ffffff"
                            tooltip="ستون‌ها"
                            @click="toggleColumns"
                        />

                        <Transition name="k-slide-down">
                            <div
                                v-if="showColumns"
                                class="dt__dropdown"
                            >
                                <div class="dt__dropdown-title">
                                    ستون‌ها
                                </div>

                                <KCheckbox
                                    v-for="col in table.resolvedColumns.value"
                                    :key="col.key"
                                    :model-value="table.visibleColumns.value.includes(col.key)"
                                    :label="col.label"
                                    @update:model-value="table.actions.toggleColumn(col.key)"
                                />
                            </div>
                        </Transition>
                    </div>

                    <!-- FILTERS SLOT -->
                    <div class="dt__tool" ref="filterRef">
                        <KIconButton
                            :icon="FilterIcon"
                            bg-color="#1db954"
                            text-color="#ffffff"
                            tooltip="فیلترها"
                            @click="toggleFilters"
                        />

                        <Transition name="k-slide-down">
                            <div
                                v-if="showFilters"
                                class="dt__dropdown"
                            >
                                <slot name="filters" />
                            </div>
                        </Transition>
                    </div>
                </div>

            </div>

        </div>

        <!-- LOADING -->
        <div v-if="table.loading.value" class="dt__loading">
            <div class="loader"></div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="!table.hasData.value && !table.loading.value" class="dt__state">
            <slot name="empty">داده ای برای نمایش وجود ندارد</slot>
        </div>

        <!-- TABLE -->
        <div
            v-else
            ref="wrapperRef"
            class="dt__wrapper"
            :style="wrapperStyle"
        >
            <table class="dt__table">

                <thead>
                    <tr>
                        <th
                            v-for="col in table.columns.value"
                            :key="col.key"
                            :class="{ 'is-sorted': table.sortState.value.key === col.key }"
                            :style="thStyle(col)"
                            @click="table.actions.sort(col)"
                        >
                            <span class="dt__th-inner">
                                {{ col.label }}

                                <ArrowUpDown
                                    v-if="col.sortable !== false"
                                    class="dt__sort-icon"
                                    :class="{
                                        'is-active': table.sortState.value.key === col.key,
                                        'is-asc': table.sortState.value.key === col.key && table.sortState.value.dir === 'asc',
                                        'is-desc': table.sortState.value.key === col.key && table.sortState.value.dir === 'desc'
                                    }"
                                />
                            </span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(row, i) in table.data.value"
                        :key="rowKey(row, i)"
                        @click="emit('rowClick', row)"
                    >
                        <td
                            v-for="col in table.columns.value"
                            :key="col.key"
                            :style="tdStyle(col)"
                        >
                            <slot
                                v-if="col.slot"
                                :name="`col-${col.key}`"
                                :row="row"
                                :index="i"
                            />
                            <span
                                v-else-if="col.key === '__rowNumber'"
                                class="dt__rownum"
                            >
                                {{ getRowNumber(i) }}
                            </span>
                            <span v-else>
                                {{ getValue(row, col) }}
                            </span>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

        <!-- FOOTER -->
        <div class="dt__footer">
            <slot name="footer" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { ArrowUpDown, FilterIcon, SettingsIcon } from 'lucide-vue-next'
import KIconButton from '../components/KIconButton.vue'
import KCheckbox from './KCheckbox.vue'
import { useClickOutside } from '../composables/useClickOutside'
import { useDataTable, type Column } from '../composables/useDataTable'

export type { Column } from '../composables/useDataTable'

const props = defineProps<{
    data: any[]
    columns?: Column[]
    meta?: any
    loading?: boolean
    title?: string
    icon?: any
    maxHeight?: string
    noHeader?: boolean
    /** attribute used as row key (defaults to row index) */
    rowKey?: string
}>()

const emit = defineEmits<{
    (e: 'rowClick', row: any): void
}>()

const columnRef = ref<HTMLElement | null>(null)
const filterRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const showColumns = ref(false)
const showFilters = ref(false)

const page = computed(() => props.meta?.current_page || 1)
const perPage = computed(() => props.meta?.per_page || 0)

const getRowNumber = (index: number) => {
    if (!perPage.value) return index + 1
    return (page.value - 1) * perPage.value + index + 1
}

const table = useDataTable({
    data: toRef(props, 'data'),
    columns: toRef(props, 'columns'),
    meta: toRef(props, 'meta'),
    loading: toRef(props, 'loading')
})

const getValue = (row: any, col: Column) => {
    if (col.slot) return null
    const raw = row[col.key]
    /* format receives the WHOLE row so nested keys (e.g. a column keyed
       `displays` can read row.displays.type) and other columns (row.title)
       are both reachable */
    return col.format ? col.format(row) : raw ?? '-'
}

const rowKey = (row: any, index: number) => {
    if (props.rowKey) return row[props.rowKey]
    return index
}

const toggleColumns = () => {
    showColumns.value = !showColumns.value
    showFilters.value = false
}

const toggleFilters = () => {
    showFilters.value = !showFilters.value
    showColumns.value = false
}

useClickOutside([columnRef, filterRef], () => {
    showColumns.value = false
    showFilters.value = false
})

const wrapperStyle = computed(() => {
    if (!props.maxHeight) return {}
    return {
        maxHeight: props.maxHeight,
        overflow: 'auto'
    }
})

const thStyle = (col: Column) => ({
    textAlign: col.align || 'right',
    width: col.width,
    whiteSpace: col.wrap ? 'normal' : 'nowrap'
})

const tdStyle = (col: Column) => ({
    textAlign: col.align || 'right',
    whiteSpace: col.wrap ? 'normal' : 'nowrap'
})
</script>

<style scoped>
.k-data-table {
    width: 100%;
    position: relative;
    --dt-radius: 10px;
}

.dt__header {
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: var(--dt-radius);
    padding: 10px;

    border-end-end-radius: 0;
    border-end-start-radius: 0;
    border-bottom: none;
}

.dt__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.dt__tools {
    display: flex;
    align-items: center;
    width: fit-content;
    gap: 10px;
}

.dt__tool {
    position: relative;
}

.dt__dropdown {
    position: absolute;
    top: 110%;
    left: 0;

    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    padding: 10px;
    min-width: 220px;

    box-shadow: var(--k-shadow-md);
    z-index: 100;

    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dt__dropdown-title {
    font-size: 12px;
    color: var(--k-text-secondary);
    margin-bottom: 8px;
    font-weight: 600;
}

.dt__title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--k-text-primary);
    font-weight: 600;
    font-size: 0.95rem;
}

.dt__wrapper {
    border: 1px solid var(--k-border);
    border-radius: var(--dt-radius);
    overflow-x: auto;
    overflow-y: hidden;

    /* join the toolbar above: square BOTH top corners (RTL-safe) so the
       left border doesn't arc inward at the first column */
    border-start-start-radius: 0;
    border-start-end-radius: 0;
    border-top: none;
}

.dt__table {
    /* natural sizing: each column takes only as much space as it needs;
       when the sum exceeds the container the wrapper scrolls horizontally */
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
}

th {
    background: var(--k-surface);
    color: var(--k-text-secondary);
    padding: 10px 8px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.78rem;
    font-weight: 600;
    user-select: none;
    transition: background 0.15s ease;
    line-height: 1.5;
    box-sizing: border-box;
}

th:hover {
    background: var(--k-surface-hover);
}

.dt__th-inner {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.dt__sort-icon {
    width: 13px;
    height: 13px;
    color: var(--k-text-muted);
    opacity: 0.4;
    transition: all 0.15s ease;
}

th.is-sorted .dt__sort-icon {
    opacity: 1;
    color: #1db954;
}

th.is-sorted .dt__sort-icon.is-asc {
    transform: rotate(0deg);
}

th.is-sorted .dt__sort-icon.is-desc {
    transform: rotate(180deg);
}

tr {
    background: var(--k-bg);
}

tr:hover td {
    background: var(--k-surface-hover);
}

tr.is-clickable {
    cursor: pointer;
}

td {
    padding: 10px 8px;
    border-bottom: 1px solid var(--k-border);
    color: var(--k-text-primary);
    font-size: 0.82rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
}

/* row-number cell — a clean, centered chip instead of a bare digit */
.dt__rownum {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 22px;
    padding: 0 8px;
    border-radius: 7px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    color: var(--k-text-secondary, #64748b);
    font-size: 0.72rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

tbody tr:last-child td {
    border-bottom: none;
}

.dt__footer {
    margin-top: 12px;
}

.dt__state {
    padding: 14px;
    background: var(--k-surface);
    border-radius: 0 0 var(--dt-radius) var(--dt-radius);
    border: 1px solid var(--k-border);
    border-top: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--k-text-secondary);
    font-size: 0.85rem;
}

.dt__loading {
    padding: 14px;
    background: var(--k-surface);
    border-radius: 0;
    border-left: 1px solid var(--k-border);
    border-right: 1px solid var(--k-border);
}

.loader {
    height: 4px;
    width: 100%;
    --c: no-repeat linear-gradient(#1db954 0 0);
    background: var(--c), var(--c), transparent;
    background-size: 60% 100%;
    animation: k-dt-loading 3s infinite;
}

@keyframes k-dt-loading {
    0%   {background-position:-150% 0,-150% 0}
    66%  {background-position: 250% 0,-150% 0}
    100% {background-position: 250% 0, 250% 0}
}

@media (max-width: 768px) {
    .dt__wrapper {
        -webkit-overflow-scrolling: touch;
    }

    th,
    td {
        white-space: nowrap;
    }

    .dt__dropdown {
        position: absolute;
        left: 10px;
        right: 10px;

        top: 100px;
        width: auto;

        max-width: none;

        border-radius: var(--k-radius-md);
    }

    .dt__tool {
        position: static;
    }

    .dt__dropdown {
        z-index: 999;
    }
}
</style>
