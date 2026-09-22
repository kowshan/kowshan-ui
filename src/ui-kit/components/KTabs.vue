<!-- components/KTabs.vue -->
<template>
    <div class="k-tabs" :class="[`k-tabs-${variant}`, `k-tabs-${size}`]">
        <!-- Tab list -->
        <div class="k-tabs-list" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                role="tab"
                class="k-tab"
                :class="{ 'is-active': active === tab.id, 'is-disabled': tab.disabled }"
                :aria-selected="active === tab.id"
                :disabled="tab.disabled"
                @click="select(tab)"
            >
                <component :is="tab.icon" v-if="tab.icon" class="k-tab-icon" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.count != null" class="k-tab-count">{{ tab.count }}</span>
            </button>
        </div>

        <!-- Content -->
        <div v-if="$slots.default" class="k-tabs-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface KTabItem {
    id: string
    label: string
    icon?: any
    count?: number
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    tabs: KTabItem[]
    modelValue?: string
    variant?: 'underline' | 'pills' | 'boxed'
    size?: 'sm' | 'md' | 'lg'
}>(), {
    variant: 'underline',
    size: 'md'
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
}>()

const active = computed(() => props.modelValue || props.tabs[0]?.id || '')

const select = (tab: KTabItem) => {
    if (tab.disabled || tab.id === active.value) return
    emits('update:modelValue', tab.id)
    emits('change', tab.id)
}

</script>

<style scoped>
.k-tabs {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.k-tabs-list {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
}

.k-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    color: var(--k-text-secondary, #64748b);
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.15s ease;
}

.k-tab:hover:not(.is-active):not(.is-disabled) {
    color: var(--k-text-primary, #1e293b);
}

.k-tab.is-active {
    color: var(--k-primary, #1db954);
    font-weight: 700;
}

.k-tab.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.k-tab-icon {
    width: 15px;
    height: 15px;
}

.k-tab-count {
    font-size: 0.68rem;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    border-radius: 999px;
    padding: 1px 7px;
    font-weight: 600;
}

.k-tab.is-active .k-tab-count {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
}

/* Sizes */
.k-tabs-sm .k-tab { font-size: 0.75rem; padding: 5px 10px; }
.k-tabs-md .k-tab { font-size: 0.85rem; padding: 7px 14px; }
.k-tabs-lg .k-tab { font-size: 0.95rem; padding: 9px 18px; }

/* Variant: underline */
.k-tabs-underline .k-tabs-list {
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-tabs-underline .k-tab {
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    border-radius: 6px 6px 0 0;
}

.k-tabs-underline .k-tab.is-active {
    border-bottom-color: var(--k-primary, #1db954);
}

/* Variant: pills */
.k-tabs-pills .k-tab {
    border-radius: 999px;
}

.k-tabs-pills .k-tab:hover:not(.is-active) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-tabs-pills .k-tab.is-active {
    background: var(--k-primary, #1db954);
    color: #ffffff;
}

.k-tabs-pills .k-tab.is-active .k-tab-count {
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
}

/* Variant: boxed */
.k-tabs-boxed .k-tabs-list {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    padding: 4px;
}

.k-tabs-boxed .k-tab {
    border-radius: 8px;
    flex: 1;
    justify-content: center;
}

.k-tabs-boxed .k-tab.is-active {
    background: var(--k-bg, #ffffff);
    color: var(--k-primary, #1db954);
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
}

.k-tabs-content {
    min-width: 0;
}
</style>
