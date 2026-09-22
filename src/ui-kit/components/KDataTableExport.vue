<!-- KDataTableExport — export data table to CSV, JSON, print -->
<template>
    <div class="k-dt-export">
        <div class="k-dt-export-bar">
            <span class="k-dt-export-count">{{ rows.length }} ردیف</span>
            <div class="k-dt-export-actions">
                <button
                    v-if="showCsv"
                    type="button"
                    class="k-dt-export-btn"
                    @click="exportCSV"
                >
                    <Download :size="14" /> CSV
                </button>
                <button
                    v-if="showJson"
                    type="button"
                    class="k-dt-export-btn"
                    @click="exportJSON"
                >
                    <FileJson :size="14" /> JSON
                </button>
                <button
                    v-if="showPrint"
                    type="button"
                    class="k-dt-export-btn"
                    @click="printTable"
                >
                    <Printer :size="14" /> چاپ
                </button>
            </div>
        </div>

        <!-- Preview table (hidden, used for print) -->
        <div ref="printArea" class="k-dt-export-print-area">
            <table class="k-dt-export-table">
                <thead>
                    <tr>
                        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, ri) in rows" :key="ri">
                        <td v-for="col in columns" :key="col.key">{{ getCell(row, col) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, FileJson, Printer } from 'lucide-vue-next'

export interface ExportColumn {
    key: string
    label: string
    format?: (value: any, row: any) => string
}

const props = withDefaults(defineProps<{
    columns: ExportColumn[]
    rows: any[]
    filename?: string
    showCsv?: boolean
    showJson?: boolean
    showPrint?: boolean
}>(), {
    filename: 'export',
    showCsv: true,
    showJson: true,
    showPrint: true
})

const printArea = ref<HTMLElement | null>(null)

const getCell = (row: any, col: ExportColumn) => {
    const val = row[col.key]
    return col.format ? col.format(val, row) : val
}

const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob(['\uFEFF' + content], { type: mime + ';charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
}

const escapeCSV = (val: any) => {
    const s = String(val ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
        ? '"' + s.replace(/"/g, '""') + '"'
        : s
}

const exportCSV = () => {
    const header = props.columns.map(c => escapeCSV(c.label)).join(',')
    const body = props.rows.map(row =>
        props.columns.map(c => escapeCSV(getCell(row, c))).join(',')
    ).join('\n')
    download(header + '\n' + body, props.filename + '.csv', 'text/csv')
}

const exportJSON = () => {
    const data = props.rows.map(row => {
        const obj: Record<string, any> = {}
        props.columns.forEach(c => { obj[c.key] = getCell(row, c) })
        return obj
    })
    download(JSON.stringify(data, null, 2), props.filename + '.json', 'application/json')
}

const printTable = () => {
    if (!printArea.value) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
        <html><head><title>${props.filename}</title>
        <style>body{font-family:sans-serif;padding:20px;direction:rtl}
        table{width:100%;border-collapse:collapse}
        th,td{padding:8px 12px;border:1px solid #ddd;text-align:right;font-size:13px}
        th{background:#f5f5f5;font-weight:700}</style></head><body>
        ${printArea.value.innerHTML}</body></html>
    `)
    win.document.close()
    win.print()
}
</script>

<style scoped>
.k-dt-export { width: 100%; }

.k-dt-export-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0; margin-bottom: 8px; gap: 10px;
}

.k-dt-export-count { font-size: 0.75rem; color: var(--k-text-muted); font-weight: 500; }

.k-dt-export-actions { display: flex; gap: 6px; }

.k-dt-export-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border: 1px solid var(--k-border); border-radius: var(--k-radius-sm);
    background: var(--k-bg); color: var(--k-text-primary);
    font-size: 0.72rem; font-weight: 600; font-family: inherit;
    cursor: pointer; transition: all 0.15s;
}
.k-dt-export-btn:hover { border-color: var(--k-primary); color: var(--k-primary); background: var(--k-primary-light); }

.k-dt-export-print-area { display: none; }
</style>
