<!-- components/KFilterBar.vue -->
<template>
    <div class="k-filterbar">
        <!-- Search -->
        <div class="k-filterbar-search">
            <Search class="icon" />
            <input
                v-model="query"
                type="text"
                :placeholder="searchPlaceholder"
                :disabled="disabled"
            />
            <button
                v-if="query"
                type="button"
                class="k-filterbar-clear"
                aria-label="پاک کردن جستجو"
                @click="query = ''"
            >
                <X class="icon" />
            </button>
        </div>

        <!-- Chips -->
        <div v-if="chips.length" class="k-filterbar-chips">
            <button
                v-for="chip in chips"
                :key="chip.id"
                type="button"
                class="k-filterbar-chip"
                :class="{ 'is-active': chip.active, 'is-disabled': chip.disabled }"
                @click="toggleChip(chip)"
            >
                <component :is="chip.icon" v-if="chip.icon" class="chip-icon" />
                {{ chip.label }}
                <span v-if="chip.count != null" class="chip-count">{{ faNum(chip.count) }}</span>
            </button>
        </div>

        <!-- Reset -->
        <button
            v-if="canReset"
            type="button"
            class="k-filterbar-reset"
            @click="reset"
        >
            <RotateCcw class="icon" />
            بازنشانی
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RotateCcw, Search, X } from 'lucide-vue-next'

export interface KFilterChip {
    id: string
    label: string
    icon?: any
    active?: boolean
    count?: number
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    modelValue?: string
    chips?: KFilterChip[]
    searchPlaceholder?: string
    disabled?: boolean
}>(), {
    modelValue: '',
    chips: () => [],
    searchPlaceholder: 'جستجو…',
    disabled: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'toggle-chip': [chip: KFilterChip]
    'reset': []
}>()

const query = computed({
    get: () => props.modelValue,
    set: (v: string) => emits('update:modelValue', v)
})

const toggleChip = (chip: KFilterChip) => {
    if (chip.disabled) return
    emits('toggle-chip', chip)
}

const canReset = computed(() => !!query.value || props.chips.some(c => c.active))

const reset = () => {
    query.value = ''
    emits('reset')
}

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: number | string) => String(n).replace(/\d/g, d => faDigits[Number(d)])
</script>

<style scoped>
.k-filterbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    direction: rtl;
}

.k-filterbar-search {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    flex: 1;
    max-width: 320px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 10px);
    padding: 7px 12px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-filterbar-search:focus-within {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 14%, transparent);
}

.k-filterbar-search .icon {
    width: 15px;
    height: 15px;
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-filterbar-search input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--k-text-primary, #1e293b);
    min-width: 0;
}

.k-filterbar-search input::placeholder {
    color: var(--k-placeholder, #cbd5e1);
}

.k-filterbar-clear {
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 2px;
    display: flex;
    border-radius: 5px;
}

.k-filterbar-clear:hover {
    color: var(--k-text-primary, #1e293b);
}

.k-filterbar-clear .icon {
    width: 13px;
    height: 13px;
}

.k-filterbar-chips {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.k-filterbar-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #ffffff);
    color: var(--k-text-secondary, #64748b);
    border-radius: 999px;
    padding: 6px 12px;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-filterbar-chip:hover:not(.is-disabled) {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-filterbar-chip.is-active {
    background: var(--k-primary-light, #e3f8ec);
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
    font-weight: 600;
}

.k-filterbar-chip.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-filterbar-chip .chip-icon {
    width: 13px;
    height: 13px;
}

.k-filterbar-chip .chip-count {
    font-size: 0.64rem;
    background: var(--k-surface-hover, #e2e8f0);
    border-radius: 999px;
    padding: 1px 7px;
}

.k-filterbar-chip.is-active .chip-count {
    background: color-mix(in srgb, var(--k-primary, #1db954) 20%, transparent);
}

.k-filterbar-reset {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    font-family: inherit;
    font-size: 0.74rem;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    transition: all 0.12s ease;
}

.k-filterbar-reset:hover {
    color: var(--k-error, #dc2626);
    background: color-mix(in srgb, var(--k-error, #dc2626) 8%, transparent);
}

.k-filterbar-reset .icon {
    width: 13px;
    height: 13px;
}
</style>
