<!-- components/KStatCard.vue — stat card with big cropped icon overlay -->
<template>
    <div class="k-stat-card" :class="[`k-stat-${variant}`, { 'is-loading': loading }]">
        <!-- Big cropped icon overlay — only partial shapes visible -->
        <div v-if="icon" class="k-stat-bg-icon">
            <component :is="icon" />
        </div>

        <!-- Content -->
        <div class="k-stat-content">
            <!-- Title + delta -->
            <div class="k-stat-head">
                <span class="k-stat-title">{{ title }}</span>
                <span
                    v-if="delta != null"
                    class="k-stat-delta"
                    :class="[trend === 'down' ? 'is-down' : 'is-up']"
                >
                    <TrendingUp v-if="trend !== 'down'" class="delta-icon" />
                    <TrendingDown v-else class="delta-icon" />
                    {{ Math.abs(delta) }}٪
                </span>
            </div>

            <!-- Value pushed to bottom -->
            <div class="k-stat-value" v-if="!loading">{{ displayValue }}</div>
            <KSkeleton v-else variant="lines" :lines="1" style="width: 60%" />

            <!-- Extra slot -->
            <div v-if="$slots.default" class="k-stat-extra">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import KSkeleton from './KSkeleton.vue'

const props = withDefaults(defineProps<{
    title: string
    value?: string | number
    icon?: any
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
    delta?: number | null
    trend?: 'up' | 'down'
    prefix?: string
    suffix?: string
    loading?: boolean
}>(), {
    variant: 'primary',
    delta: null,
    trend: 'up',
    prefix: '',
    suffix: '',
    loading: false,
})

const displayValue = computed(() => {
    let v = props.value ?? '-'
    if (typeof v === 'number') {
        v = v.toLocaleString('en-US')
    }
    return `${props.prefix}${v}${props.suffix}`
})
</script>

<style scoped>
.k-stat-card {
    position: relative;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px 22px 22px;
    overflow: hidden;
    transition: box-shadow 0.25s ease, transform 0.2s ease;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 120px;
}

.k-stat-card:hover {
    box-shadow:
        0 8px 24px rgba(15, 23, 42, 0.06),
        0 0 0 1px rgba(15, 23, 42, 0.03);
    transform: translateY(-2px);
}

/* ── Big cropped icon overlay — right side, just shapes visible ── */
.k-stat-bg-icon {
    position: absolute;
    bottom: -20px;
    inset-inline-end: -16px;
    width: 130px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
}
.k-stat-bg-icon svg {
    width: 100%;
    height: 100%;
}

/* ── Content ── */
.k-stat-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: auto;
    flex: 1;
}

.k-stat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: auto;
}

.k-stat-title {
    font-size: 0.78rem;
    color: var(--k-text-secondary, #64748b);
    font-weight: 600;
}

.k-stat-delta {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    direction: ltr;
    flex-shrink: 0;
}
.k-stat-delta.is-up {
    color: #047857;
    background: rgba(16, 185, 129, 0.1);
}
.k-stat-delta.is-down {
    color: #b91c1c;
    background: rgba(239, 68, 68, 0.1);
}
.delta-icon {
    width: 12px;
    height: 12px;
}

.k-stat-value {
    font-size: 1.85rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    letter-spacing: -0.02em;
    line-height: 1.1;
    direction: ltr;
    text-align: start;
    margin-top: auto;
}

.k-stat-extra {
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
}

/* ── Variant tint on bg icon color ── */
.k-stat-primary .k-stat-bg-icon { color: #1db954; }
.k-stat-success .k-stat-bg-icon { color: #10b981; }
.k-stat-warning .k-stat-bg-icon { color: #f59e0b; }
.k-stat-danger .k-stat-bg-icon { color: #ef4444; }
.k-stat-info .k-stat-bg-icon { color: #8b5cf6; }
.k-stat-neutral .k-stat-bg-icon { color: #64748b; }

/* ── Subtle variant glow on hover ── */
.k-stat-primary:hover { box-shadow: 0 8px 24px rgba(29, 185, 84, 0.1), 0 0 0 1px rgba(29, 185, 84, 0.06); }
.k-stat-success:hover { box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1), 0 0 0 1px rgba(16, 185, 129, 0.06); }
.k-stat-warning:hover { box-shadow: 0 8px 24px rgba(245, 158, 11, 0.1), 0 0 0 1px rgba(245, 158, 11, 0.06); }
.k-stat-danger:hover { box-shadow: 0 8px 24px rgba(239, 68, 68, 0.1), 0 0 0 1px rgba(239, 68, 68, 0.06); }
.k-stat-info:hover { box-shadow: 0 8px 24px rgba(139, 92, 246, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.06); }
.k-stat-neutral:hover { box-shadow: 0 8px 24px rgba(100, 116, 139, 0.1), 0 0 0 1px rgba(100, 116, 139, 0.06); }

@media (max-width: 640px) {
    .k-stat-value { font-size: 1.4rem; }
    .k-stat-card { padding: 16px 18px; min-height: 100px; }
}
</style>
