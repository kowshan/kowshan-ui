<!-- components/KAutocomplete.vue -->
<!--
    KAutocomplete — combobox with type-ahead suggestions:

      <KAutocomplete
        v-model="city"
        :options="['تهران', 'اصفهان', 'شیراز', 'رشت']"
        placeholder="جستجوی شهر…"
        @select="onSelect"
      />
-->
<template>
    <div ref="rootRef" class="k-ac">
        <div class="k-ac-field" :class="{ 'is-focused': focused }">
            <Search :size="15" class="k-ac-icon" />
            <input
                :value="query"
                type="text"
                class="k-ac-input"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                @input="onInput"
                @focus="focused = true"
                @blur="onBlur"
                @keydown="onKeydown"
            />
            <Loader2
                v-if="loading"
                :size="14"
                class="k-ac-spin"
            />
            <button
                v-else-if="query && clearable"
                type="button"
                class="k-ac-clear"
                tabindex="-1"
                @mousedown.prevent
                @click="clear"
            >
                <X :size="14" />
            </button>
        </div>

        <!-- Dropdown -->
        <Transition name="k-slide-down">
            <div v-if="open && filtered.length" class="k-ac-dropdown">
                <button
                    v-for="(opt, i) in filtered"
                    :key="opt.value"
                    type="button"
                    class="k-ac-option"
                    :class="{ 'is-active': i === highlight }"
                    @mousedown.prevent
                    @click="select(opt)"
                    @mouseenter="highlight = i"
                >
                    <span class="k-ac-option-label">{{ opt.label }}</span>
                    <span v-if="opt.description" class="k-ac-option-desc">{{ opt.description }}</span>
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loader2, Search, X } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { useClickOutside } from '../composables/useClickOutside'
import { useDebounce } from '../composables/useDebounce'

export interface KAutocompleteOption {
    value: string | number
    label: string
    description?: string
    disabled?: boolean
}

type KAutocompleteSource = (string | number)[] | KAutocompleteOption[]

const props = withDefaults(defineProps<{
    modelValue?: string | number | null
    options?: KAutocompleteSource
    placeholder?: string
    /** min chars before the dropdown opens */
    minChars?: number
    loading?: boolean
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
}>(), {
    modelValue: null,
    options: () => [],
    placeholder: 'جستجو کنید…',
    minChars: 1,
    loading: false,
    disabled: false,
    readonly: false,
    clearable: true
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | null): void
    (e: 'select', option: KAutocompleteOption): void
    (e: 'search', query: string): void
}>()

const { normalize } = usePersianNumbers()

const rootRef = ref<HTMLElement | null>(null)
const query = ref('')
const open = ref(false)
const focused = ref(false)
const highlight = ref(-1)

const normalizedOptions = computed<KAutocompleteOption[]>(() =>
    (props.options as any[]).map(o =>
        typeof o === 'object' ? o as KAutocompleteOption : { value: o, label: String(o) }
    )
)

const filtered = computed(() => {
    const q = normalize(query.value).trim().toLowerCase()
    if (!q) return normalizedOptions.value
    return normalizedOptions.value.filter(o =>
        normalize(o.label).toLowerCase().includes(q) ||
        (o.description ? normalize(o.description).toLowerCase().includes(q) : false)
    )
})

const { setDebounced, debouncedValue } = useDebounce<string>(200)
watch(query, (q) => setDebounced(q))
watch(debouncedValue, (q) => { if (q !== undefined) emit('search', q) })

let suppressOpen = false
watch(query, (q) => {
    if (suppressOpen) {
        suppressOpen = false
        open.value = false
        highlight.value = -1
        return
    }
    open.value = q.trim().length >= props.minChars && !props.disabled
    highlight.value = -1
})

watch(() => props.modelValue, (v) => {
    if (v !== null && v !== undefined && v !== '') {
        const match = normalizedOptions.value.find(o => o.value === v)
        if (match) query.value = match.label
    }
}, { immediate: true })

const onInput = (e: Event) => {
    query.value = (e.target as HTMLInputElement).value
}

const select = (opt: KAutocompleteOption) => {
    if (opt.disabled) return
    query.value = opt.label
    suppressOpen = true
    open.value = false
    emit('update:modelValue', opt.value)
    emit('select', opt)
}

const clear = () => {
    query.value = ''
    emit('update:modelValue', null)
    emit('search', '')
}

const onBlur = () => {
    focused.value = false
    // if the current query isn't a selected label, reset to the selected value
    setTimeout(() => {
        const selected = normalizedOptions.value.find(o => o.value === props.modelValue)
        if (selected && query.value !== selected.label) {
            suppressOpen = true
            query.value = selected.label
        }
    }, 150)
}

const onKeydown = (e: KeyboardEvent) => {
    if (!open.value || !filtered.value.length) return
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        highlight.value = (highlight.value + 1) % filtered.value.length
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        highlight.value = highlight.value <= 0 ? filtered.value.length - 1 : highlight.value - 1
    } else if (e.key === 'Enter') {
        if (highlight.value >= 0) {
            e.preventDefault()
            select(filtered.value[highlight.value])
        }
    } else if (e.key === 'Escape') {
        open.value = false
    }
}

useClickOutside([rootRef], () => { open.value = false })
</script>

<style scoped>
.k-ac {
    position: relative;
    width: 100%;
}

.k-ac-field {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    background: var(--k-bg, #fff);
    border: 1.5px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-ac-field.is-focused {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
}

.k-ac-icon {
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-ac-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--k-text-primary, #1e293b);
    font-size: 0.82rem;
    font-family: inherit;
}

.k-ac-input::placeholder { color: var(--k-placeholder, #cbd5e1); }

.k-ac-spin {
    animation: k-spin 0.8s linear infinite;
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.k-ac-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 2px;
    flex-shrink: 0;
}

.k-ac-clear:hover { color: var(--k-error, #ef4444); }

.k-ac-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    inset-inline: 0;
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    box-shadow: var(--k-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
    padding: 4px;
}

.k-ac-option {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    text-align: start;
    font-family: inherit;
}

.k-ac-option.is-active {
    background: var(--k-primary-light, #e3f8ec);
}

.k-ac-option-label {
    font-size: 0.78rem;
    color: var(--k-text-primary, #1e293b);
}

.k-ac-option-desc {
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
