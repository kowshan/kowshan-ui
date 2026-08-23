<!-- components/KSearchInput.vue -->
<!--
    KSearchInput — debounced search field:

      <KSearchInput v-model="q" :debounce="300" placeholder="جستجو در مشتری‌ها…"
                    @search="onSearch" />
-->
<template>
    <div class="k-search" :class="{ 'is-disabled': disabled }">
        <Search :size="15" class="k-search-icon" />
        <input
            :value="modelValue"
            type="search"
            class="k-search-input"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="onInput"
        />
        <Loader2 v-if="loading" :size="14" class="k-search-spin" />
        <button
            v-else-if="modelValue"
            type="button"
            class="k-search-clear"
            @click="clear"
        >
            <X :size="14" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { Loader2, Search, X } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { useDebounce } from '../composables/useDebounce'

const props = withDefaults(defineProps<{
    modelValue?: string
    placeholder?: string
    debounce?: number
    loading?: boolean
    disabled?: boolean
}>(), {
    modelValue: '',
    placeholder: 'جستجو…',
    debounce: 250,
    loading: false,
    disabled: false
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'search', value: string): void
    (e: 'clear'): void
}>()

const { normalize } = usePersianNumbers()

const onInput = (e: Event) => {
    emit('update:modelValue', normalize((e.target as HTMLInputElement).value))
}

const { setDebounced, debouncedValue } = useDebounce<string>(props.debounce)
watch(() => props.modelValue, (v) => setDebounced(v ?? ''))
watch(debouncedValue, (v) => { if (v !== undefined) emit('search', v) })

const clear = () => {
    emit('update:modelValue', '')
    emit('search', '')
    emit('clear')
}
</script>

<style scoped>
.k-search {
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

.k-search:focus-within {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
}

.k-search.is-disabled { opacity: 0.6; pointer-events: none; }

.k-search-icon { color: var(--k-text-muted, #94a3b8); flex-shrink: 0; }

.k-search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--k-text-primary, #1e293b);
    font-size: 0.82rem;
    font-family: inherit;
}

.k-search-input::placeholder { color: var(--k-placeholder, #cbd5e1); }

.k-search-input::-webkit-search-cancel-button { display: none; }

.k-search-spin {
    animation: k-spin 0.8s linear infinite;
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.k-search-clear {
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

.k-search-clear:hover { color: var(--k-error, #ef4444); }
</style>
