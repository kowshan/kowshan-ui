<!-- components/KAssessmentInput.vue
     Renders the INPUT half of a question — the 9 schema kinds, each delegated to
     the kit component that already does the job:

       text    → KTextInput / KTextarea        scale   → KSlider
       number  → KNumberInput                  matrix  → rows × option columns
       choice  → KAssessmentOption[]           ranking → KSortableList
       upload  → KFileInput                    date    → KDatePicker
       time    → KTimePicker
-->
<template>
    <div class="k-ai" :class="`layout-${input.layout || 'list'}`">
        <!-- host override: `<template #input-upload="{ update }">` lets an app plug
             its own widget (e.g. KVoiceRecorder for a spoken answer) without a new kind -->
        <slot
            v-if="customSlot"
            :name="`input-${input.kind}`"
            :input="input"
            :value="modelValue"
            :update="emitValue"
        />

        <!-- ── TEXT ─────────────────────────────────────────── -->
        <KTextarea
            v-if="!customSlot && input.kind === 'text' && input.multiline"
            :model-value="String(modelValue ?? '')"
            :placeholder="input.placeholder"
            :rows="input.rows || 4"
            :disabled="disabled"
            :maxlength="inputLength.max"
            :minlength="inputLength.min"
            @update:model-value="emitValue"
        />
        <KTextInput
            v-else-if="input.kind === 'text'"
            :model-value="String(modelValue ?? '')"
            :placeholder="input.placeholder"
            :disabled="disabled"
            :maxlength="inputLength.max"
            :minlength="inputLength.min"
            @update:model-value="emitValue"
        />

        <!-- ── NUMBER ───────────────────────────────────────── -->
        <div v-else-if="input.kind === 'number'" class="k-ai-number">
            <KNumberInput
                :model-value="numberValue"
                :min="input.min"
                :max="input.max"
                :step="input.step ?? 1"
                :disabled="disabled"
                @update:model-value="emitValue"
            />
            <span v-if="input.suffix || input.prefix" class="k-ai-affix">{{ input.suffix || input.prefix }}</span>
        </div>

        <!-- ── CHOICE (single / multiple) ────────────────────── -->
        <div
            v-else-if="input.kind === 'choice'"
            class="k-ai-options"
            :class="[
                `cols-${input.columns || (input.layout === 'grid' ? 2 : 1)}`,
                input.layout === 'pills' ? 'is-pills' : ''
            ]"
            role="group"
        >
            <KAssessmentOption
                v-for="(opt, i) in input.options"
                :key="opt.id"
                :option="opt"
                :index="i"
                :layout="input.layout || 'list'"
                :multiple="!!input.multiple"
                :selected="isChosen(opt)"
                :disabled="disabled || opt.disabled"
                @select="toggleChoice"
            />
        </div>

        <!-- ── SCALE ────────────────────────────────────────── -->
        <div v-else-if="input.kind === 'scale'" class="k-ai-scale">
            <div class="k-ai-scale-labels">
                <span>{{ input.minLabel }}</span>
                <span>{{ input.maxLabel }}</span>
            </div>
            <KSlider
                :model-value="numberValue"
                :min="input.min ?? 1"
                :max="input.max ?? 5"
                :step="input.step ?? 1"
                :precision="input.precision ?? 0"
                :suffix="input.suffix"
                :show-bounds="false"
                :disabled="disabled"
                @update:model-value="emitValue"
            />
        </div>

        <!-- ── MATRIX (rows × columns) ──────────────────────── -->            <table v-else-if="input.kind === 'matrix'" class="k-ai-matrix">
            <thead>
                <tr>
                    <th scope="col" class="k-ai-matrix-corner" />
                    <th v-for="col in columns" :key="col.id" scope="col">{{ col.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in input.matrixRows" :key="row.id">
                    <th scope="row" class="k-ai-matrix-row">
                        <span class="k-ai-matrix-label">{{ row.label }}</span>
                        <span v-if="row.description" class="k-ai-matrix-desc">{{ row.description }}</span>
                    </th>
                    <td v-for="col in columns" :key="col.id">
                        <label class="k-ai-cell">
                            <input
                                type="radio"
                                :name="`mx-${uid}-${row.id}`"
                                :value="col.value ?? col.id"
                                :checked="String(matrixValue[row.id] ?? '') === String(col.value ?? col.id)"
                                :disabled="disabled || col.disabled"
                                @change="setMatrix(row.id, col.value ?? col.id)"
                            />
                            <span class="k-ai-cell-dot" />
                            <span class="k-ai-cell-text">{{ col.description || '' }}</span>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- ── RANKING ──────────────────────────────────────── -->
        <div v-else-if="input.kind === 'ranking'" class="k-ai-ranking">
            <!-- the row has to carry its own label: KSortableList renders whatever
                 the slot gives it, and item text is not part of its contract -->
            <KSortableList :items="rankItems" key-prop="id" @update:items="onRankUpdate">
                <template #default="{ item, index }">
                    <span class="k-ai-rank">
                        <span class="k-ai-rank-num">{{ index + 1 }}</span>
                        <span class="k-ai-rank-label">{{ item.label }}</span>
                    </span>
                </template>
            </KSortableList>
            <p class="k-ai-hint">با کشیدن و رها کردن، ترتیب دلخواه را بسازید.</p>
        </div>

        <!-- ── UPLOAD — widget follows `accept`: image picker / recorder / file ── -->
        <KImageUpload
            v-else-if="input.kind === 'upload' && uploadWidget === 'image'"
            :model-value="fileValue"
            :accept="input.accept || 'image/*'"
            :multiple="(input.maxCount ?? 1) > 1"
            :max-count="input.maxCount"
            :max-size="input.maxSize"
            :placeholder="input.placeholder"
            :disabled="disabled"
            @update:model-value="emitValue"
        />
        <div v-else-if="input.kind === 'upload' && uploadWidget === 'record'" class="k-ai-record">
            <KVoiceRecorder @record="onRecord" />
            <p class="k-ai-hint">
                {{ recordedFile ? `ضبط شد: ${recordedFile.name}` : 'برای پاسخ، دکمهٔ میکروفون را بزنید.' }}
            </p>
        </div>
        <KFileInput
            v-else-if="input.kind === 'upload'"
            :model-value="fileValue"
            :accept="input.accept"
            :multiple="(input.maxCount ?? 1) > 1"
            :max-count="input.maxCount"
            :max-size="input.maxSize"
            :placeholder="input.placeholder"
            :disabled="disabled"
            @update:model-value="emitValue"
        />

        <!-- ── SELECT (one from a long list) ─────────────────── -->
        <KSelect
            v-else-if="input.kind === 'select'"
            :model-value="modelValue ?? null"
            :options="selectOptions"
            :placeholder="input.placeholder"
            :searchable="(input.options?.length || 0) > 12"
            clearable
            :disabled="disabled"
            @update:model-value="emitValue"
        />

        <!-- ── MULTISELECT (several from a long list) ───────── -->
        <KMultiSelect
            v-else-if="input.kind === 'multiselect'"
            :model-value="Array.isArray(modelValue) ? modelValue : []"
            :options="selectOptions"
            :placeholder="input.placeholder"
            searchable
            clearable
            show-select-all
            :disabled="disabled"
            @update:model-value="emitValue"
        />

        <!-- ── DATE ─────────────────────────────────────────── -->
        <KDatePicker
            v-else-if="input.kind === 'date'"
            :model-value="String(modelValue ?? '')"
            :disabled="disabled"
            @update:model-value="emitValue"
        />

        <!-- ── TIME ─────────────────────────────────────────── -->
        <KTimePicker
            v-else-if="input.kind === 'time'"
            :model-value="modelValue ?? null"
            :with-seconds="!!input.withSeconds"
            :disabled="disabled"
            @update:model-value="emitValue"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'
import KTextInput from '../wrappers/KTextInput.vue'
import KTextarea from '../wrappers/KTextarea.vue'
import KNumberInput from './KNumberInput.vue'
import KSlider from '../wrappers/KSlider.vue'
import KFileInput from '../wrappers/KFileInput.vue'
import KDatePicker from '../wrappers/KDatePicker.vue'
import KTimePicker from '../wrappers/KTimePicker.vue'
import KSelect from '../wrappers/KSelect.vue'
import KMultiSelect from '../wrappers/KMultiSelect.vue'
import KSortableList from './KSortableList.vue'
import KImageUpload from '../wrappers/KImageUpload.vue'
import KVoiceRecorder from './KVoiceRecorder.vue'
import KAssessmentOption from './KAssessmentOption.vue'
import { useKitId } from '../composables/useKitId'
import type { AssessmentOption, QuestionInput } from '../types/assessment'

const props = withDefaults(defineProps<{
    input: QuestionInput
    modelValue?: any
    disabled?: boolean
}>(), {
    disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: any] }>()

const { id: uid } = useKitId('k-ai')

/** host-provided widget for this input kind (e.g. #input-upload with KVoiceRecorder) */
const slots = useSlots()
const customSlot = computed(() => !!slots[`input-${props.input.kind}`])
const emitValue = (value: any) => emit('update:modelValue', value)

/* ── text / number ────────────────────────────────────────── */
const inputLength = computed(() => ({
    min: props.input.length?.min,
    max: props.input.length?.max,
}))

const numberValue = computed(() =>
    typeof props.modelValue === 'number'
        ? props.modelValue
        : (props.input.min ?? (props.input.kind === 'scale' ? 1 : 0))
)

/* ── select / multiselect (long option lists) ─────────────── */
const selectOptions = computed(() =>
    (props.input.options || []).map(o => ({
        value: o.value ?? o.id,
        label: o.label ?? String(o.id),
        disabled: o.disabled,
    }))
)

/* ── choice ───────────────────────────────────────────────── */
const chosen = computed<string[]>(() => {
    const v = props.modelValue
    if (Array.isArray(v)) return v.map(String)
    return v == null || v === '' ? [] : [String(v)]
})

const isChosen = (opt: AssessmentOption) => chosen.value.includes(String(opt.value ?? opt.id))

function toggleChoice(opt: AssessmentOption) {
    const value = opt.value ?? opt.id
    if (!props.input.multiple) {
        emitValue(value)
        return
    }
    const next = isChosen(opt)
        ? chosen.value.filter(v => v !== String(value))
        : [...chosen.value, String(value)]
    emitValue(next)
}

/* ── matrix ───────────────────────────────────────────────── */
const columns = computed<AssessmentOption[]>(() => props.input.matrixColumns || props.input.options || [])

const matrixValue = computed<Record<string, any>>(() =>
    props.modelValue && typeof props.modelValue === 'object' && !Array.isArray(props.modelValue)
        ? props.modelValue
        : {}
)

function setMatrix(rowId: string | number, value: any) {
    emitValue({ ...matrixValue.value, [rowId]: value })
}

/* ── ranking ──────────────────────────────────────────────── */
const rankItems = ref<any[]>([])

const buildRankItems = () => {
    const source = props.input.options || []
    const current = Array.isArray(props.modelValue) ? props.modelValue.map(String) : []
    const ordered = current.length
        ? current
            .map(id => source.find(o => String(o.value ?? o.id) === id))
            .filter(Boolean) as AssessmentOption[]
        : source
    rankItems.value = ordered.map(o => ({ id: String(o.value ?? o.id), label: o.label || String(o.id) }))
}

watch([() => props.input.options, () => props.modelValue], buildRankItems, { immediate: true, deep: true })

const onRankUpdate = (items: any[]) => {
    rankItems.value = items
    emitValue(items.map(i => i.id))
}

/*
 * A ranking is already a valid answer when it appears: the order it arrives in
 * *is* a choice, so leaving it untouched must not read as "unanswered" (the
 * question would sit blank and, when required, block «بعدی» for a user who is
 * happy with the given order). Adopt that default once, after mount — doing it
 * during setup would emit while the server-rendered markup still says otherwise.
 */
onMounted(() => {
    if (props.input.kind !== 'ranking') return
    const current = props.modelValue
    if (Array.isArray(current) && current.length) return
    emitValue(rankItems.value.map(i => i.id))
})

/* ── upload ───────────────────────────────────────────────── */
const fileValue = computed(() => props.modelValue ?? null)

/**
 * Which widget an `upload` question gets: explicit `widget`, else inferred from
 * `accept` — `image/*` → KImageUpload, `audio/*` → KVoiceRecorder, rest → KFileInput.
 */
const uploadWidget = computed<'image' | 'record' | 'file'>(() => {
    if (props.input.widget) return props.input.widget
    const accept = (props.input.accept || '').toLowerCase()
    if (accept.includes('image')) return 'image'
    if (accept.includes('audio')) return 'record'
    return 'file'
})

/** the last recording, wrapped as a File so it validates/reads like any upload */
const recordedFile = ref<File | null>(null)

function onRecord(blob: Blob) {
    if (!blob) return
    const ext = (blob.type.split('/')[1] || 'webm').split(';')[0]
    const file = new File([blob], `recording-${Date.now()}.${ext}`, { type: blob.type || 'audio/webm' })
    recordedFile.value = file
    emitValue(file)
}
</script>

<style scoped>
.k-ai { display: block; }
.k-ai-number { display: flex; align-items: center; gap: 8px; }
.k-ai-affix { font-size: 0.78rem; color: var(--k-text-muted); }
.k-ai-options {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
}
.k-ai-options.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.k-ai-options.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.k-ai-options.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.k-ai.layout-inline .k-ai-options { grid-auto-flow: column; }
.k-ai-options.is-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.k-ai-options.cols-2.is-pills,
.k-ai-options.cols-3.is-pills,
.k-ai-options.cols-4.is-pills { display: flex; }
@media (max-width: 640px) {
    .k-ai-options.cols-2,
    .k-ai-options.cols-3,
    .k-ai-options.cols-4 { grid-template-columns: 1fr; }
}
.k-ai-scale { display: flex; flex-direction: column; gap: 6px; padding: 4px 2px; }
.k-ai-scale-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--k-text-muted);
}
.k-ai-matrix {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
}
.k-ai-matrix th,
.k-ai-matrix td {
    border: 1px solid var(--k-border);
    padding: 8px 10px;
    text-align: center;
}
.k-ai-matrix thead th {
    background: var(--k-surface);
    color: var(--k-text-secondary);
    font-weight: 700;
    font-size: 0.72rem;
}
.k-ai-matrix-row { text-align: start !important; background: var(--k-surface); }
.k-ai-matrix-label { display: block; font-weight: 600; color: var(--k-text-primary); }
.k-ai-matrix-desc { display: block; font-size: 0.68rem; color: var(--k-text-muted); font-weight: 400; }
.k-ai-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
}
.k-ai-cell input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.k-ai-cell-dot {
    width: 16px;
    height: 16px;
    border: 2px solid var(--k-border);
    border-radius: 50%;
    display: block;
    transition: border-color 0.15s ease, background 0.15s ease;
}
.k-ai-cell input:checked + .k-ai-cell-dot {
    border-color: var(--k-primary);
    background: var(--k-primary);
    box-shadow: inset 0 0 0 3px var(--k-surface);
}
.k-ai-cell input:focus-visible + .k-ai-cell-dot { outline: 2px solid var(--k-primary); outline-offset: 2px; }
.k-ai-cell-text { font-size: 0.62rem; color: var(--k-text-muted); }
.k-ai-record {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-bg);
}
.k-ai-ranking { display: flex; flex-direction: column; gap: 6px; }
.k-ai-rank { display: flex; align-items: center; gap: 8px; }
.k-ai-rank-num {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--k-surface);
    color: var(--k-text-secondary);
    font-size: 0.68rem;
    font-weight: 700;
}
.k-ai-rank-label { font-size: 0.82rem; font-weight: 600; color: var(--k-text-primary); }
.k-ai-hint { margin: 0; font-size: 0.7rem; color: var(--k-text-muted); }
</style>
