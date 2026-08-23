<!-- components/KInlineEdit.vue -->
<!--
    KInlineEdit — click-to-edit value (text / number / select). Shows the
    value with a pencil affordance; click to edit, Enter or ✓ saves, ESC or
    ✕ cancels. Blur also saves (configurable).

      <KInlineEdit v-model="lead.name" label="نام" />
      <KInlineEdit v-model="lead.stage" type="select" :options="['جدید','در تماس','قرارداد']" />
-->
<template>
    <div class="k-inline" :class="{ 'is-editing': editing, 'is-disabled': disabled }">
        <span v-if="label" class="k-inline-label">{{ label }}</span>

        <!-- Display state -->
        <button
            v-if="!editing"
            type="button"
            class="k-inline-display"
            :class="{ 'is-empty': !displayText }"
            :disabled="disabled"
            @click="startEdit"
        >
            <span class="k-inline-value">{{ displayText || placeholder || '—' }}</span>
            <Pencil class="k-inline-pencil" :size="12" />
        </button>

        <!-- Edit state -->
        <div v-else class="k-inline-edit">
            <input
                v-if="type !== 'select'"
                ref="inputEl"
                v-model="draft"
                class="k-inline-input"
                type="text"
                inputmode="text"
                :placeholder="placeholder"
                @keydown.enter.prevent="save"
                @keydown.esc.prevent="cancel"
                @blur="saveOnBlur && save()"
            />
            <select
                v-else
                ref="inputEl"
                v-model="draft"
                class="k-inline-input"
                @keydown.esc.prevent="cancel"
                @change="save"
                @blur="saveOnBlur && save()"
            >
                <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
            </select>

            <button type="button" class="k-inline-action is-save" aria-label="ذخیره" @mousedown.prevent @click="save">
                <Check :size="14" />
            </button>
            <button type="button" class="k-inline-action is-cancel" aria-label="انصراف" @mousedown.prevent @click="cancel">
                <X :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Pencil, Check, X } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: 'text' | 'number' | 'select'
    options?: (string | number)[]
    disabled?: boolean
    /** save on blur too (default true) */
    saveOnBlur?: boolean
}>(), {
    modelValue: '',
    type: 'text',
    options: () => [],
    disabled: false,
    saveOnBlur: true
})

const emits = defineEmits<{
    'update:modelValue': [value: string | number]
    'save': [value: string | number]
    'cancel': []
}>()

const { normalize } = usePersianNumbers()

const editing = ref(false)
const draft = ref<string | number>('')
const inputEl = ref<HTMLInputElement | HTMLSelectElement | null>(null)

const displayText = computed(() => String(props.modelValue ?? ''))

const startEdit = () => {
    if (props.disabled) return
    editing.value = true
    draft.value = props.modelValue ?? ''
    nextTick(() => inputEl.value?.focus())
}

const save = () => {
    if (!editing.value) return
    // numbers: keep numeric, normalize Persian digits for text
    let value: string | number = draft.value
    if (props.type === 'number') {
        const n = Number(String(draft.value).replace(/[۰-۹٠-٩]/g, d => String('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d) % 10)))
        value = Number.isNaN(n) ? props.modelValue ?? '' : n
    } else {
        value = normalize(String(draft.value))
    }
    editing.value = false
    if (value !== props.modelValue) emits('update:modelValue', value)
    emits('save', value)
}

const cancel = () => {
    editing.value = false
    emits('cancel')
}
</script>

<style scoped>
.k-inline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
}

.k-inline-label {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    white-space: nowrap;
}

.k-inline-display {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
    border-radius: var(--k-radius-sm);
    background: transparent;
    padding: 2px 6px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
    min-height: 24px;
}

.k-inline-display:hover {
    border-color: var(--k-border);
    background: var(--k-surface-hover);
}

.k-inline-display.is-empty .k-inline-value {
    color: var(--k-text-muted);
    font-style: italic;
}

.k-inline-display:disabled {
    cursor: default;
    opacity: 0.7;
}

.k-inline-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--k-text-primary);
}

.k-inline-pencil {
    color: var(--k-text-muted);
    opacity: 0;
    transition: opacity 0.15s ease;
    flex-shrink: 0;
}

.k-inline-display:hover .k-inline-pencil {
    opacity: 1;
}

.k-inline-edit {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.k-inline-input {
    border: 1px solid var(--k-primary);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-primary);
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 3px 8px;
    outline: none;
    min-width: 90px;
    max-width: 180px;
}

.k-inline-input:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary) 18%, transparent);
}

.k-inline-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
    transition: all 0.12s ease;
    flex-shrink: 0;
}

.k-inline-action.is-save:hover {
    background: color-mix(in srgb, var(--k-success) 16%, transparent);
    color: var(--k-success);
}

.k-inline-action.is-cancel:hover {
    background: color-mix(in srgb, var(--k-error) 16%, transparent);
    color: var(--k-error);
}
</style>
