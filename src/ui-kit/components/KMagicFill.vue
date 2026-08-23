<!-- components/KMagicFill.vue -->
<!--
    KMagicFill — "magic wand" lead capture. Paste a raw note / scraped text
    and it splits it into structured fields (phone, email, city, budget,
    intent, source…) with a confidence badge per field, all editable before
    you emit the payload.

      <KMagicFill v-model="lead" placeholder="مثلاً: علی رضایی — ۰۹۱۲۱۲۳۴۵۶۷ — تهران — خریدار آپارتمان ۱۰۰ متری از سایت" />

    Emits `update:modelValue` with { key: value } once the user hits «افزودن».
-->
<template>
    <div class="k-magicfill">
        <!-- Paste zone -->
        <div class="k-magicfill-input" :class="{ 'has-result': hasResult }">
            <textarea
                v-model="draft"
                class="k-magicfill-textarea"
                rows="3"
                :placeholder="placeholder"
                @input="live ? run() : null"
            ></textarea>

            <div class="k-magicfill-actions">
                <span v-if="hasResult" class="k-magicfill-count">
                    {{ fields.length ? faNum(fields.length) : '' }} {{ fields.length ? 'فیلد شناسایی شد' : '' }}
                </span>
                <span v-else class="k-magicfill-hint">متن خام را بچسبانید…</span>
                <button type="button" class="k-magicfill-btn" :disabled="!draft.trim()" @click="run">
                    <Sparkles :size="14" />
                    تبدیل جادویی
                </button>
            </div>
        </div>

        <!-- Parsed fields -->
        <Transition name="k-magicfill-fade">
            <div v-if="hasResult" class="k-magicfill-fields">
                <div
                    v-for="f in fields"
                    :key="f.key"
                    class="k-magicfill-field"
                    :class="`is-${f.confidence}`"
                >
                    <div class="k-magicfill-field-head">
                        <span class="k-magicfill-field-label">{{ f.label }}</span>
                        <span class="k-magicfill-badge">{{ confLabel(f.confidence) }}</span>
                    </div>
                    <input
                        v-model="editable[f.key]"
                        class="k-magicfill-field-input"
                        type="text"
                        dir="ltr"
                        :aria-label="f.label"
                    />
                </div>

                <!-- Unmatched leftovers -->
                <div v-if="unmatched" class="k-magicfill-unmatched">
                    <span class="k-magicfill-unmatched-label">متن بدون تطبیق</span>
                    <span class="k-magicfill-unmatched-text">{{ unmatched }}</span>
                </div>

                <div class="k-magicfill-footer">
                    <button type="button" class="k-magicfill-clear" @click="reset">پاک کردن</button>
                    <button type="button" class="k-magicfill-done" @click="commit">
                        <Plus :size="14" />
                        افزودن به فرم
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Sparkles, Plus } from 'lucide-vue-next'
import { useMagicFill, type MagicFieldDef, type Confidence } from '../composables/useMagicFill'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    placeholder?: string
    /** parse live as the user types (default: on button click) */
    live?: boolean
    /** custom extractor set (defaults to the built-in CRM lead fields) */
    fields?: MagicFieldDef[]
    /** v-model: the final { key: value } payload */
    modelValue?: Record<string, string> | null
}>(), {
    placeholder: 'مثلاً: علی رضایی — ۰۹۱۲۱۲۳۴۵۶۷ — تهران، سعادت‌آباد — خریدار آپارتمان ۱۰۰ متری از سایت',
    live: false,
    modelValue: null
})

const emits = defineEmits<{
    'update:modelValue': [value: Record<string, string>]
    'fill': [value: Record<string, string>]
    'clear': []
}>()

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const magic = useMagicFill(props.fields)
const draft = ref('')
const editable = ref<Record<string, string>>({})

const hasResult = computed(() => magic.result.value.hasText && magic.result.value.fields.length > 0)
const fields = computed(() => magic.result.value.fields)
const unmatched = computed(() => magic.result.value.unmatched)

const confLabel = (c: Confidence) => ({ high: 'قطعی', medium: 'محتمل', low: 'ضعیف' } as const)[c]

const run = () => {
    magic.setText(draft.value)
    // snapshot parsed values into editable state
    const next: Record<string, string> = {}
    for (const f of magic.result.value.fields) next[f.key] = f.value
    editable.value = next
}

const reset = () => {
    draft.value = ''
    editable.value = {}
    magic.clear()
    emits('clear')
}

const commit = () => {
    // only keep fields the user didn't blank out
    const payload: Record<string, string> = {}
    for (const f of fields.value) {
        const v = (editable.value[f.key] ?? '').trim()
        if (v) payload[f.key] = v
    }
    emits('update:modelValue', payload)
    emits('fill', payload)
    reset()
}

watch(() => props.modelValue, (v) => {
    if (v && Object.keys(v).length) {
        draft.value = ''
        editable.value = { ...v }
        // show a synthetic "has result" state so the payload is visible
        magic.setText('')
    }
})

defineExpose({ parse: run, reset, payload: () => {
    const p: Record<string, string> = {}
    for (const f of fields.value) { const v = (editable.value[f.key] ?? '').trim(); if (v) p[f.key] = v }
    return p
} })
</script>

<style scoped>
.k-magicfill {
    width: 100%;
}

.k-magicfill-input {
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    overflow: hidden;
    background: var(--k-bg);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-magicfill-input:focus-within {
    border-color: var(--k-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary) 18%, transparent);
}

.k-magicfill-input.has-result {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.k-magicfill-textarea {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    resize: vertical;
    padding: 12px 14px;
    background: transparent;
    color: var(--k-text-primary);
    font-family: inherit;
    font-size: 0.8rem;
    line-height: 1.7;
}

.k-magicfill-textarea::placeholder {
    color: var(--k-text-muted);
    opacity: 0.7;
}

.k-magicfill-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    border-top: 1px dashed var(--k-border);
}

.k-magicfill-hint,
.k-magicfill-count {
    font-size: 0.68rem;
    color: var(--k-text-muted);
}

.k-magicfill-count {
    color: var(--k-success);
    font-weight: 700;
}

.k-magicfill-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    border-radius: var(--k-radius-sm);
    padding: 6px 14px;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-magicfill-btn:hover:not(:disabled) { filter: brightness(1.08); }
.k-magicfill-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.k-magicfill-fields {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    padding: 12px;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-top: none;
    border-radius: 0 0 var(--k-radius-md) var(--k-radius-md);
}

.k-magicfill-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 10px;
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    border: 1px solid var(--k-border);
}

.k-magicfill-field.is-high { border-color: color-mix(in srgb, var(--k-success) 40%, var(--k-border)); }
.k-magicfill-field.is-medium { border-color: color-mix(in srgb, var(--k-primary) 40%, var(--k-border)); }
.k-magicfill-field.is-low { border-color: color-mix(in srgb, var(--k-warning, #f59e0b) 45%, var(--k-border)); }

.k-magicfill-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
}

.k-magicfill-field-label {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--k-text-secondary);
}

.k-magicfill-badge {
    font-size: 0.58rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
}

.k-magicfill-field.is-high .k-magicfill-badge {
    background: color-mix(in srgb, var(--k-success) 16%, transparent);
    color: var(--k-success);
}

.k-magicfill-field.is-medium .k-magicfill-badge {
    background: color-mix(in srgb, var(--k-primary) 16%, transparent);
    color: var(--k-primary);
}

.k-magicfill-field.is-low .k-magicfill-badge {
    background: color-mix(in srgb, var(--k-warning, #f59e0b) 18%, transparent);
    color: var(--k-warning, #d97706);
}

.k-magicfill-field-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--k-text-primary);
    border-bottom: 1px dashed var(--k-border);
    padding-bottom: 2px;
}

.k-magicfill-field-input:focus {
    border-bottom-color: var(--k-primary);
}

.k-magicfill-unmatched {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 6px 10px;
    border-radius: var(--k-radius-sm);
    background: color-mix(in srgb, var(--k-warning, #f59e0b) 8%, var(--k-bg));
}

.k-magicfill-unmatched-label {
    font-size: 0.62rem;
    font-weight: 700;
    color: var(--k-warning, #d97706);
}

.k-magicfill-unmatched-text {
    font-size: 0.7rem;
    color: var(--k-text-secondary);
}

.k-magicfill-footer {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-top: 2px;
}

.k-magicfill-clear {
    border: none;
    background: transparent;
    color: var(--k-error);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
}

.k-magicfill-done {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    border-radius: var(--k-radius-sm);
    padding: 7px 16px;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-magicfill-done:hover { filter: brightness(1.08); }

.k-magicfill-fade-enter-active,
.k-magicfill-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.k-magicfill-fade-enter-from,
.k-magicfill-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
