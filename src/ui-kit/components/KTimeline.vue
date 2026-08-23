<!-- components/KTimeline.vue -->
<template>
    <div class="k-timeline">
        <div
            v-for="(item, i) in items"
            :key="item.id ?? i"
            class="k-timeline-item"
        >
            <!-- Dot -->
            <div class="k-timeline-marker">
                <span
                    class="k-timeline-dot"
                    :class="[`k-dot-${item.color || 'primary'}`]"
                    :style="item.color && !isVariant(item.color) ? { background: item.color } : {}"
                >
                    <component :is="item.icon" v-if="item.icon" class="dot-icon" />
                </span>
            </div>

            <!-- Content -->
            <div class="k-timeline-content">
                <div class="k-timeline-head">
                    <span class="k-timeline-title">{{ item.title }}</span>
                    <span v-if="item.time" class="k-timeline-time">{{ item.time }}</span>
                </div>
                <p v-if="item.description" class="k-timeline-desc">{{ item.description }}</p>
                <slot :name="`item-${i}`" :item="item" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
export interface KTimelineItem {
    id?: string | number
    title: string
    description?: string
    time?: string
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | (string & {})
    icon?: any
}

defineProps<{
    items: KTimelineItem[]
}>()

const variants = ['primary', 'success', 'warning', 'danger', 'info']
const isVariant = (c: string) => variants.includes(c)
</script>

<style scoped>
.k-timeline {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.k-timeline-item {
    display: flex;
    gap: 14px;
    position: relative;
    padding-bottom: 22px;
}

.k-timeline-item:last-child {
    padding-bottom: 0;
}

/* Connector line */
.k-timeline-item:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 22px;
    bottom: 0;
    right: 11px;
    width: 2px;
    background: var(--k-border, #e2e8f0);
}

.k-timeline-marker {
    flex-shrink: 0;
    width: 24px;
    display: flex;
    justify-content: center;
    padding-top: 2px;
}

.k-timeline-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid var(--k-bg, #ffffff);
    box-shadow: 0 0 0 2px var(--k-border, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.k-dot-primary { background: #1db954; }
.k-dot-success { background: #10b981; }
.k-dot-warning { background: #f59e0b; }
.k-dot-danger { background: #ef4444; }
.k-dot-info { background: #8b5cf6; }

.dot-icon {
    width: 8px;
    height: 8px;
    color: #ffffff;
}

.k-timeline-content {
    flex: 1;
    min-width: 0;
    padding-top: 1px;
}

.k-timeline-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
}

.k-timeline-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-timeline-time {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-timeline-desc {
    margin: 3px 0 0 0;
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
    line-height: 1.7;
}
</style>
