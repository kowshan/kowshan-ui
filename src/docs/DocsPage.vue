<!-- docs/DocsPage.vue — per-component documentation page -->
<template>
    <div class="docs-page" v-if="doc">
        <!-- ═══ header ═══ -->
        <div class="docs-head">
            <div class="docs-head-text">
                <div class="docs-crumb">
                    مستندات
                    <span class="docs-crumb-sep">/</span>
                    {{ doc.category }}
                </div>
                <div class="docs-title-row">
                    <h2 class="docs-name">{{ doc.name }}</h2>
                    <span class="docs-chip">{{ doc.dir === 'wrappers' ? 'Wrapper' : 'Component' }}</span>
                </div>
                <p class="docs-desc">{{ doc.description }}</p>
            </div>
            <a class="k-demo-btn is-ghost" href="#" @click.prevent="goHome">بازگشت به نمایش</a>
        </div>

        <!-- ═══ playground ═══ -->
        <section v-if="playable" class="docs-panel">
            <div class="docs-panel-head">
                <h4>پلی‌گراند زنده</h4>
                <span class="docs-panel-hint">پراپ‌ها را تغییر دهید — خروجی هم‌زمان عوض می‌شود</span>
                <button type="button" class="k-demo-btn is-ghost is-sm" @click="resetModel">بازنشانی</button>
            </div>

            <div class="pg-stage">
                <div v-if="pgError" class="pg-error">
                    این کامپوننت در پلی‌گراند قابل نمایش نیست.
                    <span class="pg-error-detail">{{ pgError }}</span>
                    <div class="pg-error-actions">
                        <a class="k-demo-btn is-sm" href="#" @click.prevent="goHome">مشاهده در بخش نمایش</a>
                    </div>
                </div>
                <component
                    v-else-if="comp"
                    :is="comp"
                    v-bind="model"
                    class="pg-render"
                >
                    <div class="pg-slot">محتوای اسلات</div>
                </component>
                <div v-else class="pg-loading">در حال بارگذاری…</div>
            </div>

            <div v-if="controls.length" class="pg-controls">
                <PropControl
                    v-for="p in controls"
                    :key="p.name"
                    :prop="p"
                    :value="model[p.name]"
                    @update="setProp(p.name, $event)"
                />
            </div>
            <p v-else class="pg-nocontrols">
                این کامپوننت پراپ قابل کنترل ندارد — نمونهٔ کامل را در بخش نمایش ببینید.
            </p>
        </section>

        <section v-else class="docs-panel">
            <div class="docs-panel-head"><h4>پلی‌گراند زنده</h4></div>
            <p class="pg-nocontrols">
                این کامپوننت به‌صورت سراسری نصب می‌شود (store-driven) — نمونهٔ زنده در
                <a href="#" class="docs-link" @click.prevent="goHome">بخش نمایش</a> موجود است.
            </p>
        </section>

        <!-- ═══ snippet ═══ -->
        <section class="docs-panel">
            <div class="docs-panel-head">
                <h4>کد استفاده</h4>
                <button
                    type="button"
                    class="k-demo-btn is-ghost is-sm"
                    :class="{ 'is-copied': copied }"
                    @click="copySnippet"
                >
                    {{ copied ? 'کپی شد ✓' : 'کپی' }}
                </button>
            </div>
            <pre class="docs-code"><code>{{ doc.snippet }}</code></pre>
            <p class="docs-path">
                مسیر: <code>ui-kit/{{ doc.dir }}/{{ doc.name }}.vue</code>
            </p>
        </section>

        <!-- ═══ props ═══ -->
        <section class="docs-panel">
            <div class="docs-panel-head">
                <h4>پراپ‌ها ({{ doc.props.length }})</h4>
            </div>
            <div v-if="doc.props.length" class="docs-table-wrap">
                <table class="docs-table">
                    <thead>
                        <tr>
                            <th>نام</th>
                            <th>نوع</th>
                            <th>الزامی</th>
                            <th>پیش‌فرض</th>
                            <th>توضیح</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in doc.props" :key="p.name">
                            <td class="docs-t-name">{{ p.name }}</td>
                            <td class="docs-t-type">{{ p.type }}</td>
                            <td class="docs-t-req">
                                <span :class="p.optional ? 'is-no' : 'is-yes'">
                                    {{ p.optional ? '—' : 'بله' }}
                                </span>
                            </td>
                            <td class="docs-t-default">{{ fmtDefault(p) }}</td>
                            <td class="docs-t-desc">{{ p.description || '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="pg-nocontrols">این کامپوننت پراپ ندارد.</p>
        </section>

        <!-- ═══ source ═══ -->
        <details class="docs-source">
            <summary>سورس کامپوننت ({{ (doc.source.length / 1024).toFixed(1) }} KB)</summary>
            <pre class="docs-code docs-source-code"><code>{{ doc.source }}</code></pre>
        </details>
    </div>

    <div v-else class="docs-page docs-missing">
        کامپوننت «{{ componentName }}» پیدا نشد.
        <a class="k-demo-btn is-sm" href="#" @click.prevent="goHome">بازگشت به نمایش</a>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, shallowRef, onErrorCaptured, nextTick } from 'vue'
import { docByName, controlKindFor, exampleForType } from './useComponentDocs'
import { componentLoaders, wrapperLoaders } from './useComponentDocs'
import type { DocProp, ComponentDoc } from './useComponentDocs'
import PropControl from './PropControl.vue'
import { useClipboard } from '../ui-kit/composables/useClipboard'

const props = defineProps<{ componentName: string }>()
const emit = defineEmits<{ (e: 'home'): void }>()

const goHome = () => emit('home')

/* store-driven / global components have no meaningful standalone playground */
const GLOBAL_ONLY = new Set(['KGlobalLayer', 'KToastHost', 'KConfirmDialog'])

const doc = computed<ComponentDoc | undefined>(() => docByName(props.componentName))
const playable = computed(() => !!doc.value && !GLOBAL_ONLY.has(doc.value!.name))

const comp = shallowRef<any>(null)
const model = reactive<Record<string, any>>({})
const pgError = ref('')

const controls = computed<DocProp[]>(() => {
    if (!doc.value || !playable.value) return []
    return doc.value.props.filter(p => controlKindFor(p.type) !== 'none')
})

const seedModel = () => {
    for (const k of Object.keys(model)) delete model[k]
    if (!doc.value) return
    for (const p of doc.value.props) {
        if (controlKindFor(p.type) === 'none') continue
        let v: any = p.defaultValue !== undefined ? p.defaultValue : exampleForType(p.type)
        // color-ish text props (bgColor, textColor, …) seed with the brand green
        if (typeof v === 'string' && /color/i.test(p.name) && v === 'متن') v = '#1db954'
        model[p.name] = v
    }
}

const setProp = (name: string, value: any) => { model[name] = value }
const resetModel = () => seedModel()

const loadComponent = async () => {
    comp.value = null
    pgError.value = ''
    if (!doc.value) return
    const loader = doc.value.dir === 'wrappers' ? wrapperLoaders : componentLoaders
    const key = Object.keys(loader).find(k => k.endsWith(`/${doc.value!.name}.vue`))
    if (!key) return
    try {
        const mod = await loader[key]()
        comp.value = (mod as any).default
        await nextTick()
    } catch (e: any) {
        pgError.value = e?.message ?? String(e)
    }
}

watch(() => props.componentName, async () => {
    seedModel()
    await loadComponent()
}, { immediate: true })

onErrorCaptured((err) => {
    pgError.value = String(err?.message ?? err).slice(0, 160)
    return false
})

/* copy snippet */
const { copy, copied } = useClipboard()
const copySnippet = () => { if (doc.value) copy(doc.value.snippet) }

const fmtDefault = (p: DocProp) => {
    if (p.defaultRaw === undefined) return '—'
    const raw = p.defaultRaw.replace(/^\(\)\s*=>\s*/, '')
    return raw.length > 40 ? raw.slice(0, 40) + '…' : raw
}
</script>

<style scoped>
.docs-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 860px;
}

.docs-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.docs-crumb {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
    margin-bottom: 6px;
}

.docs-crumb-sep { margin: 0 6px; }

.docs-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.docs-name {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    font-family: monospace;
    direction: ltr;
    text-align: left;
}

.docs-chip {
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 25%, transparent);
    padding: 2px 10px;
    border-radius: 999px;
    direction: ltr;
}

.docs-desc {
    margin: 8px 0 0;
    font-size: 0.78rem;
    line-height: 1.8;
    color: var(--k-text-secondary, #64748b);
}

.docs-panel {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.docs-panel-head {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.docs-panel-head h4 {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.docs-panel-hint {
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.docs-panel-head .k-demo-btn {
    margin-inline-start: auto;
}

/* playground stage */
.pg-stage {
    min-height: 160px;
    border: 1px dashed var(--k-border, #e2e8f0);
    border-radius: 12px;
    background: var(--k-surface, #f8fafc);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.pg-render {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
}

.pg-slot {
    font-size: 0.72rem;
    color: var(--k-text-muted, #94a3b8);
}

.pg-loading {
    font-size: 0.72rem;
    color: var(--k-text-muted, #94a3b8);
}

.pg-error {
    text-align: center;
    font-size: 0.78rem;
    color: var(--k-text-secondary, #64748b);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.pg-error-detail {
    font-size: 0.62rem;
    color: var(--k-danger, #dc2626);
    font-family: monospace;
    max-width: 480px;
    word-break: break-all;
}

.pg-controls {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px 14px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    padding-top: 12px;
}

.pg-nocontrols {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.8;
    color: var(--k-text-muted, #94a3b8);
}

.docs-link {
    color: var(--k-primary, #1db954);
    font-weight: 600;
}

/* code */
.docs-code {
    margin: 0;
    padding: 14px 16px;
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 10px;
    font-size: 0.72rem;
    line-height: 1.7;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    direction: ltr;
    text-align: left;
    overflow-x: auto;
    white-space: pre;
}

.docs-path {
    margin: 0;
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
}

.docs-path code {
    direction: ltr;
    unicode-bidi: embed;
    font-size: 0.62rem;
}

/* prop table */
.docs-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
}

.docs-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.7rem;
}

.docs-table th {
    background: var(--k-surface, #f8fafc);
    color: var(--k-text-secondary, #64748b);
    font-weight: 700;
    text-align: right;
    padding: 8px 12px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    white-space: nowrap;
}

.docs-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    color: var(--k-text-primary, #1e293b);
    vertical-align: top;
}

.docs-table tr:last-child td { border-bottom: none; }

.docs-t-name {
    font-family: monospace;
    direction: ltr;
    text-align: left;
    font-weight: 700;
    white-space: nowrap;
}

.docs-t-type {
    font-family: monospace;
    direction: ltr;
    text-align: left;
    font-size: 0.64rem;
    color: var(--k-text-secondary, #64748b);
    white-space: nowrap;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.docs-t-default {
    font-family: monospace;
    direction: ltr;
    text-align: left;
    font-size: 0.64rem;
    color: var(--k-text-secondary, #64748b);
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.docs-t-req .is-yes {
    color: var(--k-danger, #dc2626);
    font-weight: 700;
}

.docs-t-req .is-no { color: var(--k-text-muted, #94a3b8); }

.docs-t-desc {
    font-size: 0.66rem;
    color: var(--k-text-secondary, #64748b);
    min-width: 140px;
}

/* source toggle */
.docs-source {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 12px 16px;
}

.docs-source summary {
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    user-select: none;
}

.docs-source-code {
    margin-top: 12px;
    max-height: 420px;
    overflow: auto;
}

.docs-missing {
    padding: 40px 0;
    font-size: 0.85rem;
    color: var(--k-text-secondary, #64748b);
    display: flex;
    align-items: center;
    gap: 14px;
}
</style>
