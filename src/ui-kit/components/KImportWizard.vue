<!-- components/KImportWizard.vue -->
<!--
    KImportWizard — CSV import wizard (paste/upload → preview → map → done):

      <KImportWizard
        :fields="[{ key: 'name', label: 'نام' }, { key: 'phone', label: 'موبایل' }]"
        @imported="rows => onImport(rows)"
      />

    Parses CSV with quoted-cell support, auto-detects the header row,
    lets you map CSV columns to the expected fields, skips empty rows and
    reports skipped + imported counts.
-->
<template>
    <div class="k-iw">
        <!-- Step indicator -->
        <div class="k-iw-steps">
            <span
                v-for="(s, i) in stepLabels"
                :key="s"
                class="k-iw-step"
                :class="{ 'is-active': step === i, 'is-done': step > i }"
            >
                <span class="k-iw-step-dot">{{ step > i ? '✓' : faNum(i + 1) }}</span>
                {{ s }}
            </span>
        </div>

        <!-- STEP 1: source -->
        <template v-if="step === 0">
            <div class="k-iw-source">
                <textarea
                    v-model="csvText"
                    class="k-iw-textarea"
                    rows="6"
                    placeholder="متن CSV را اینجا بچسبانید…&#10;نام,موبایل,شهر&#10;علی رضایی,09121234567,تهران"
                    spellcheck="false"
                />
                <div class="k-iw-source-actions">
                    <label class="k-iw-filebtn">
                        <Upload :size="14" /> انتخاب فایل CSV
                        <input type="file" accept=".csv,text/csv" hidden @change="onFile" />
                    </label>
                    <button type="button" class="k-iw-btn is-primary" :disabled="!parsed.length" @click="step = 1">
                        ادامه <ChevronLeft :size="14" />
                    </button>
                </div>
                <p v-if="parsed.length" class="k-iw-hint">
                    {{ faNum(parsed.length) }} ردیف شناسایی شد
                </p>
            </div>
        </template>

        <!-- STEP 2: mapping -->
        <template v-else-if="step === 1">
            <div class="k-iw-map">
                <p class="k-iw-desc">ستون‌های فایل را به فیلدهای مورد انتظار وصل کنید.</p>

                <div class="k-iw-map-row is-header">
                    <span class="k-iw-map-field">فیلد</span>
                    <span class="k-iw-map-col">ستون فایل</span>
                </div>
                <div v-for="field in fields" :key="field.key" class="k-iw-map-row">
                    <span class="k-iw-map-field">{{ field.label }}</span>
                    <KSelect
                        class="k-iw-select"
                        :model-value="mapping[field.key] ?? null"
                        :options="columnOptions"
                        placeholder="— انتخاب نشده —"
                        clearable
                        @update:model-value="(v: any) => (mapping[field.key] = v)"
                    />
                </div>

                <div class="k-iw-preview">
                    <div class="k-iw-preview-title">پیش‌نمایش (۵ ردیف اول)</div>
                    <div class="k-iw-table-wrap">
                        <table class="k-iw-table">
                            <thead>
                                <tr>
                                    <th v-for="(h, hi) in headers" :key="hi">{{ h || '—' }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, ri) in previewRows" :key="ri">
                                    <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="k-iw-map-actions">
                    <button type="button" class="k-iw-btn is-muted" @click="step = 0">
                        <ChevronRight :size="14" /> بازگشت
                    </button>
                    <button type="button" class="k-iw-btn is-primary" @click="runImport">
                        <Import :size="14" /> شروع ورود داده
                    </button>
                </div>
            </div>
        </template>

        <!-- STEP 3: result -->
        <template v-else>
            <div class="k-iw-result">
                <span class="k-iw-result-icon" :class="{ 'is-warn': skipped > 0 }">
                    <CheckCircle2 v-if="skipped === 0" :size="26" />
                    <AlertTriangle v-else :size="26" />
                </span>
                <div class="k-iw-result-title">
                    {{ faNum(importedCount) }} ردیف با موفقیت وارد شد
                </div>
                <div v-if="skipped > 0" class="k-iw-result-note">
                    {{ faNum(skipped) }} ردیف خالی یا ناقص نادیده گرفته شد
                </div>
                <button type="button" class="k-iw-btn is-primary" @click="reset">
                    <RotateCcw :size="14" /> ورود فایل جدید
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
    AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Import, RotateCcw, Upload
} from 'lucide-vue-next'
import KSelect from '../wrappers/KSelect.vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface KImportField {
    key: string
    label: string
}

const props = withDefaults(defineProps<{
    fields?: KImportField[]
    /** pre-fill the CSV textarea (demo / re-import convenience) */
    initialText?: string
}>(), {
    fields: () => [],
    initialText: ''
})

const emit = defineEmits<{
    (e: 'imported', rows: Record<string, any>[]): void
    (e: 'skipped', count: number): void
}>()

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const stepLabels = ['منبع داده', 'نگاشت ستون‌ها', 'نتیجه']

const step = ref(0)
const csvText = ref(props.initialText)
const mapping = ref<Record<string, number>>({})
const importedCount = ref(0)
const skipped = ref(0)

/* ---- CSV parser with quoted-cell support ---- */
const parseCsv = (text: string): string[][] => {
    const rows: string[][] = []
    let row: string[] = []
    let cell = ''
    let inQuotes = false
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (inQuotes) {
            if (ch === '"') {
                if (text[i + 1] === '"') { cell += '"'; i++ }
                else inQuotes = false
            } else cell += ch
        } else if (ch === '"') {
            inQuotes = true
        } else if (ch === ',') {
            row.push(cell.trim())
            cell = ''
        } else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && text[i + 1] === '\n') i++
            row.push(cell.trim())
            cell = ''
            if (row.some(c => c !== '')) rows.push(row)
            row = []
        } else cell += ch
    }
    row.push(cell.trim())
    if (row.some(c => c !== '')) rows.push(row)
    return rows
}

const parsed = computed(() => parseCsv(csvText.value))

const headers = computed(() => parsed.value[0] ?? [])

const previewRows = computed(() => parsed.value.slice(1, 6))

/* KSelect options for the column mapping (CSV column index → label) */
const columnOptions = computed(() =>
    headers.value.map((h, ci) => ({ value: ci, label: h || `ستون ${faNum(ci + 1)}` }))
)

/* ---- mapping helpers ---- */
// hoisted so the `immediate` watcher below can call it during setup
function initMapping() {
    const map: Record<string, number> = {}
    // auto-guess by header similarity
    props.fields.forEach((f, fi) => {
        const idx = headers.value.findIndex(h =>
            h && (h.includes(f.label) || h.includes(f.key) || f.label.includes(h) || f.key === h)
        )
        map[f.key] = idx >= 0 ? idx : (fi < headers.value.length ? fi : -1)
    })
    mapping.value = map
}

watch(parsed, (rows) => {
    // auto-map once when data appears (initial text, paste or file)
    if (rows.length && Object.keys(mapping.value).length === 0) initMapping()
}, { immediate: true })

const runImport = () => {
    const rows: Record<string, any>[] = []
    let skip = 0
    for (const raw of parsed.value.slice(1)) {
        const out: Record<string, any> = {}
        let hasAny = false
        for (const f of props.fields) {
            const ci = mapping.value[f.key]
            const v = ci >= 0 ? (raw[ci] ?? '') : ''
            out[f.key] = v
            if (v !== '') hasAny = true
        }
        if (hasAny) rows.push(out)
        else skip++
    }
    importedCount.value = rows.length
    skipped.value = skip
    emit('imported', rows)
    emit('skipped', skip)
    step.value = 2
}

const onFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        csvText.value = String(reader.result ?? '')
        initMapping()
    }
    reader.readAsText(file)
}

const reset = () => {
    step.value = 0
    csvText.value = ''
    importedCount.value = 0
    skipped.value = 0
}
</script>

<style scoped>
.k-iw {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 620px;
}

.k-iw-steps {
    display: flex;
    align-items: center;
    gap: 8px;
}

.k-iw-step {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-muted, #94a3b8);
}

.k-iw-step + .k-iw-step::before {
    content: '—';
    color: var(--k-border, #e2e8f0);
    margin-inline-end: 8px;
}

.k-iw-step.is-active { color: var(--k-primary, #1db954); }
.k-iw-step.is-done { color: var(--k-success, #10b981); }

.k-iw-step-dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--k-surface-hover, #f1f5f9);
    border: 1px solid var(--k-border, #e2e8f0);
    font-size: 0.64rem;
}

.k-iw-step.is-active .k-iw-step-dot {
    background: var(--k-primary-light, #e3f8ec);
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-iw-step.is-done .k-iw-step-dot {
    background: var(--k-success, #10b981);
    border-color: var(--k-success, #10b981);
    color: #fff;
}

.k-iw-source {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.k-iw-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px dashed var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    color: var(--k-text-primary, #1e293b);
    font-size: 0.74rem;
    font-family: ui-monospace, Consolas, monospace;
    resize: vertical;
    outline: none;
    direction: ltr;
    text-align: left;
    transition: border-color 0.15s ease;
}

.k-iw-textarea:focus {
    border-color: var(--k-primary, #1db954);
}

.k-iw-source-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.k-iw-filebtn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    color: var(--k-text-secondary, #64748b);
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
}

.k-iw-filebtn:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-iw-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-iw-btn.is-primary {
    background: var(--k-primary, #1db954);
    color: #fff;
    margin-inline-start: auto;
}

.k-iw-btn.is-muted {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
}

.k-iw-btn:hover { filter: brightness(1.07); }
.k-iw-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.k-iw-hint {
    margin: 0;
    font-size: 0.68rem;
    color: var(--k-success, #10b981);
}

.k-iw-desc {
    margin: 0;
    font-size: 0.74rem;
    color: var(--k-text-secondary, #64748b);
}

.k-iw-map {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.k-iw-map-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.k-iw-map-row.is-header {
    font-size: 0.64rem;
    font-weight: 800;
    color: var(--k-text-muted, #94a3b8);
    padding-bottom: 4px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-iw-map-field {
    flex: 1;
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
}

.k-iw-map-col {
    flex: 1;
}

.k-iw-select {
    width: 100%;
    min-width: 0;
}

.k-iw-preview {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    overflow: hidden;
}

.k-iw-preview-title {
    padding: 8px 12px;
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-surface, #f8fafc);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-iw-table-wrap {
    overflow-x: auto;
}

.k-iw-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.68rem;
}

.k-iw-table th,
.k-iw-table td {
    padding: 6px 10px;
    text-align: start;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    white-space: nowrap;
    color: var(--k-text-primary, #1e293b);
}

.k-iw-table th {
    color: var(--k-text-muted, #94a3b8);
    background: var(--k-surface-hover, #f1f5f9);
}

.k-iw-map-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.k-iw-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 12px;
    text-align: center;
}

.k-iw-result-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--k-success-light, #d1fae5);
    color: var(--k-success, #10b981);
}

.k-iw-result-icon.is-warn {
    background: var(--k-warning-light, #fef3c7);
    color: var(--k-warning, #f59e0b);
}

.k-iw-result-title {
    font-size: 0.84rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-iw-result-note {
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
}
</style>
