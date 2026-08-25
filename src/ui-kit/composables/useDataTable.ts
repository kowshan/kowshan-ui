// composables/useDataTable.ts
import { computed, ref, toRef, watch, type Ref } from 'vue'

export interface Column {
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    /** receives the WHOLE row — access nested keys like row.displays.type or any other column */
    format?: (row: any) => any
    slot?: boolean
    /** minimum width hint for the column */
    width?: string
    /** allow the cell text to wrap instead of forcing one line */
    wrap?: boolean
}

export interface DataTableOptions {
    data: Ref<any[]>
    columns?: Ref<Column[] | undefined>
    meta?: Ref<any>
    loading?: Ref<boolean>
    /** enable client-side sorting (default: true) */
    clientSort?: boolean
    /** enable client-side pagination (default: false — use server pagination via meta) */
    clientPaginate?: boolean
    perPage?: number
}

export function useDataTable(options: DataTableOptions) {
    const { data, columns, meta, loading } = options

    const clientSort = options.clientSort ?? true
    const clientPaginate = options.clientPaginate ?? false

    // Sorting state
    const sortKey = ref<string | null>(null)
    const sortDir = ref<'asc' | 'desc'>('asc')

    // Column visibility
    const hiddenColumns = ref<string[]>([])

    // Client pagination state
    const clientPage = ref(1)
    const clientPerPage = ref(options.perPage || 10)

    // Resolved columns (with sensible defaults)
    const resolvedColumns = computed<Column[]>(() => {
        const cols = columns?.value
        if (!cols || cols.length === 0) {
            // Infer columns from the first data row
            const first = data.value[0]
            if (!first) return []
            return Object.keys(first).map(key => ({
                key,
                label: key,
            }))
        }
        return cols.map(col => ({
            sortable: true,
            ...col
        }))
    })

    // Visible columns
    const visibleColumns = computed(() =>
        resolvedColumns.value
            .map(col => col.key)
            .filter(key => !hiddenColumns.value.includes(key))
    )

    const columnsOut = computed(() =>
        resolvedColumns.value.filter(col => visibleColumns.value.includes(col.key))
    )

    // Client-side sorting
    const sortedData = computed(() => {
        if (!clientSort || !sortKey.value) return data.value
        const key = sortKey.value
        const dir = sortDir.value === 'asc' ? 1 : -1
        return [...data.value].sort((a, b) => {
            const va = a[key]
            const vb = b[key]
            if (va == null) return 1
            if (vb == null) return -1
            if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
            return String(va).localeCompare(String(vb), 'fa') * dir
        })
    })

    // Client-side pagination
    const pagedData = computed(() => {
        if (!clientPaginate) return sortedData.value
        const start = (clientPage.value - 1) * clientPerPage.value
        return sortedData.value.slice(start, start + clientPerPage.value)
    })

    const dataOut = computed(() => pagedData.value)

    const hasData = computed(() => dataOut.value.length > 0)

    const loadingOut = computed(() => !!loading?.value)

    const totalPages = computed(() => {
        if (!clientPaginate) return meta?.value?.last_page || 1
        return Math.max(1, Math.ceil(data.value.length / clientPerPage.value))
    })

    const currentPage = computed(() => {
        if (!clientPaginate) return meta?.value?.current_page || 1
        return clientPage.value
    })

    const total = computed(() => {
        if (meta?.value?.total) return meta.value.total
        return data.value.length
    })

    // Reset client page when data changes
    watch(data, () => {
        if (clientPaginate) clientPage.value = 1
    })

    // Actions
    const actions = {
        sort(col: Column) {
            if (col.sortable === false) return
            if (sortKey.value === col.key) {
                sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
            } else {
                sortKey.value = col.key
                sortDir.value = 'asc'
            }
        },
        toggleColumn(key: string) {
            if (hiddenColumns.value.includes(key)) {
                hiddenColumns.value = hiddenColumns.value.filter(k => k !== key)
            } else {
                hiddenColumns.value = [...hiddenColumns.value, key]
            }
        },
        showColumn(key: string) {
            hiddenColumns.value = hiddenColumns.value.filter(k => k !== key)
        },
        hideColumn(key: string) {
            if (!hiddenColumns.value.includes(key)) {
                hiddenColumns.value = [...hiddenColumns.value, key]
            }
        },
        resetColumns() {
            hiddenColumns.value = []
        },
        goToPage(page: number) {
            if (!clientPaginate) return
            clientPage.value = Math.min(Math.max(1, page), totalPages.value)
        }
    }

    const sortState = computed(() => ({
        key: sortKey.value,
        dir: sortDir.value
    }))

    return {
        resolvedColumns,
        visibleColumns,
        columns: columnsOut,
        data: dataOut,
        loading: loadingOut,
        hasData,
        actions,
        sortState,
        page: currentPage,
        perPage: computed(() => clientPaginate ? clientPerPage.value : meta?.value?.per_page || 0),
        totalPages,
        total,
        setSort: (key: string) => {
            const col = resolvedColumns.value.find(c => c.key === key)
            if (col) actions.sort(col)
        }
    }
}
