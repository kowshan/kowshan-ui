<!-- KPillTabs.vue — horizontal scrollable pill-shaped tabs -->
<template>
    <div class="k-pill" ref="container">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="k-pill-tab"
            :class="{ 'is-active': modelValue === tab.id, 'is-disabled': tab.disabled }"
            :disabled="tab.disabled"
            @click="!tab.disabled && emit('update:modelValue', tab.id)"
        >
            <span v-if="tab.icon" class="k-pill-icon">
                <component :is="tab.icon" :size="14" />
            </span>
            <span>{{ tab.label }}</span>
            <span v-if="tab.count != null" class="k-pill-count">{{ tab.count }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    tabs: { id: string; label: string; icon?: any; count?: number; disabled?: boolean }[]
    modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [id: string] }>()
</script>

<style scoped>
.k-pill {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.k-pill::-webkit-scrollbar { display: none; }
.k-pill-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 20px;
    border: 1.5px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #fff);
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: inherit;
}
.k-pill-tab:hover:not(.is-active):not(.is-disabled) {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}
.k-pill-tab.is-active {
    background: var(--k-primary, #1db954);
    color: #fff;
    border-color: var(--k-primary, #1db954);
}
.k-pill-tab.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.k-pill-icon {
    display: flex;
    align-items: center;
}
.k-pill-count {
    font-size: 0.6rem;
    font-weight: 800;
    background: rgba(0,0,0,0.08);
    padding: 1px 6px;
    border-radius: 8px;
}
.k-pill-tab.is-active .k-pill-count {
    background: rgba(255,255,255,0.25);
}
</style>
