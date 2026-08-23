<!-- components/KEmptyState.vue -->
<template>
    <div class="k-empty-state">
        <!-- Icon area -->
        <div v-if="icon || $slots.icon" class="k-empty-icon">
            <component :is="icon" v-if="icon" class="icon" />
            <slot name="icon" v-else></slot>
        </div>

        <h3 v-if="title" class="k-empty-title">{{ title }}</h3>
        <p v-if="description" class="k-empty-desc">{{ description }}</p>

        <!-- Action slot -->
        <div v-if="$slots.action" class="k-empty-action">
            <slot name="action"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon?: any
    title?: string
    description?: string
}>()
</script>

<style scoped>
.k-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 48px 24px;
    text-align: center;
    width: 100%;
}

.k-empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--k-surface, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-text-muted, #94a3b8);
    margin-bottom: 6px;
}

.k-empty-icon .icon {
    width: 32px;
    height: 32px;
}

.k-empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    margin: 0;
}

.k-empty-desc {
    font-size: 0.8rem;
    color: var(--k-text-muted, #94a3b8);
    margin: 0;
    max-width: 360px;
    line-height: 1.6;
}

.k-empty-action {
    margin-top: 8px;
}
</style>
