<!-- components/KSkeleton.vue -->
<template>
    <div class="k-skeleton" :class="{ 'is-loading': loading }">
        <!-- Custom slot -->
        <slot v-if="$slots.default"></slot>

        <!-- Preset layouts -->
        <template v-else>
            <!-- Avatar + lines -->
            <div v-if="variant === 'avatar'" class="k-skeleton-row">
                <span class="k-skeleton-circle" :style="{ width: circle, height: circle }"></span>
                <div class="k-skeleton-lines">
                    <span
                        v-for="i in lines"
                        :key="i"
                        class="k-skeleton-line"
                        :style="{ width: lineWidths[i - 1] || '100%' }"
                    ></span>
                </div>
            </div>

            <!-- Card layout -->
            <div v-else-if="variant === 'card'" class="k-skeleton-card">
                <span class="k-skeleton-rect" :style="{ height: imageHeight }"></span>
                <div class="k-skeleton-card-body">
                    <span class="k-skeleton-line" style="width: 70%"></span>
                    <span class="k-skeleton-line" style="width: 90%"></span>
                    <span class="k-skeleton-line" style="width: 50%"></span>
                </div>
            </div>

            <!-- Table layout -->
            <div v-else-if="variant === 'table'" class="k-skeleton-table">
                <span
                    v-for="i in rows"
                    :key="i"
                    class="k-skeleton-line"
                    style="width: 100%"
                ></span>
            </div>

            <!-- Plain lines -->
            <div v-else class="k-skeleton-lines">
                <span
                    v-for="i in lines"
                    :key="i"
                    class="k-skeleton-line"
                    :style="{ width: lineWidths[i - 1] || '100%' }"
                ></span>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    variant?: 'lines' | 'avatar' | 'card' | 'table'
    lines?: number
    rows?: number
    lineWidths?: string[]
    circle?: string
    imageHeight?: string
    loading?: boolean
}>(), {
    variant: 'lines',
    lines: 3,
    rows: 5,
    circle: '48px',
    imageHeight: '160px',
    lineWidths: () => [],
    loading: true
})
</script>

<style scoped>
.k-skeleton {
    width: 100%;
}

.k-skeleton.is-loading {
    display: block;
}

/* Base shimmering element — theme-aware via --k-* variables */
.k-skeleton-line,
.k-skeleton-rect,
.k-skeleton-circle {
    display: block;
    background: linear-gradient(
        90deg,
        var(--k-surface, #eef2f7) 25%,
        var(--k-border, #e2e8f0) 50%,
        var(--k-surface, #eef2f7) 75%
    );
    background-size: 200% 100%;
    animation: k-skeleton-shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
}

.k-skeleton-line {
    height: 12px;
}

.k-skeleton-rect {
    width: 100%;
}

.k-skeleton-circle {
    border-radius: 50%;
    flex-shrink: 0;
}

/* Rows */
.k-skeleton-row {
    display: flex;
    align-items: center;
    gap: 14px;
}

.k-skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
}

/* Card */
.k-skeleton-card {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
}

.k-skeleton-card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
}

/* Table */
.k-skeleton-table {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 8px 0;
}

@keyframes k-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
