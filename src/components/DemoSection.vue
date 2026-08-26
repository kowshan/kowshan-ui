<template>
    <section :id="id" class="demo-section">
        <div class="demo-section-head">
            <div class="demo-section-badge">{{ index }}</div>
            <div class="demo-section-text">
                <h3 class="demo-section-title">{{ title }}</h3>
                <p v-if="description" class="demo-section-desc">{{ description }}</p>
            </div>
        </div>
        <div class="demo-section-card">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    id: string
    index: string
    title: string
    description?: string
}>()
</script>

<style scoped>
.demo-section {
    margin-bottom: 40px;
    scroll-margin-top: 80px;
}

.demo-section-head {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 16px;
}

.demo-section-badge {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 12%, transparent));
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 20%, transparent);
    border-radius: 10px;
    direction: ltr;
}

.demo-section-text {
    flex: 1;
    min-width: 0;
}

.demo-section-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    line-height: 1.3;
}

.demo-section-desc {
    margin: 4px 0 0;
    font-size: 0.74rem;
    color: var(--k-text-muted, #94a3b8);
    line-height: 1.6;
}

.demo-section-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
}
</style>
