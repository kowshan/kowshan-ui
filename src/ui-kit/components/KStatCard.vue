<!-- components/KStatCard.vue -->
<template>
    <div class="k-stat-card" :class="[`k-stat-${variant}`, { 'is-loading': loading }]">
        <div class="k-stat-top">
            <!-- Icon -->
            <div v-if="icon" class="k-stat-icon">
                <component :is="icon" class="icon" />
            </div>

            <!-- Delta badge -->
            <span
                v-if="delta != null"
                class="k-stat-delta"
                :class="[trend === 'down' ? 'is-down' : 'is-up']"
            >
                <TrendingUp v-if="trend !== 'down'" class="delta-icon" />
                <TrendingDown v-else class="delta-icon" />
                {{ faNum(Math.abs(delta)) }}٪
            </span>
        </div>

        <!-- Value -->
        <div class="k-stat-value" v-if="!loading">{{ displayValue }}</div>
        <KSkeleton v-else variant="lines" :lines="1" style="width: 60%" />

        <!-- Title -->
        <div class="k-stat-title">{{ title }}</div>

        <!-- Extra slot -->
        <div v-if="$slots.default" class="k-stat-extra">
            <slot />
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
    /** percentage change; use negative number for a decrease */
    delta?: number | null
    trend?: 'up' | 'down'
    prefix?: string
    suffix?: string
    loading?: boolean
    /** format the numeric value with Persian digits */
    persianDigits?: boolean
}>(), {
    variant: 'primary',
    delta: null,
    trend: 'up',
    prefix: '',
    suffix: '',
    loading: false,
    persianDigits: true
})

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: string | number) => String(n).replace(/\d/g, d => faDigits[Number(d)])

const displayValue = computed(() => {
    let v = props.value ?? '-'
    if (typeof v === 'number' && props.persianDigits) {
        v = faNum(v.toLocaleString('en-US'))
    }
    return `${props.prefix}${v}${props.suffix}`
})
</script>

<style scoped>
.k-stat-card {
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.k-stat-card:hover {
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
}

.k-stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.k-stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-stat-icon .icon {
    width: 20px;
    height: 20px;
    color: #ffffff;
}

.k-stat-delta {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 999px;
    direction: ltr;
}

.k-stat-delta.is-up {
    color: #047857;
    background: #d1fae5;
}

.k-stat-delta.is-down {
    color: #b91c1c;
    background: #fee2e2;
}

.delta-icon {
    width: 12px;
    height: 12px;
}

.k-stat-value {
    font-size: 1.7rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    letter-spacing: -0.02em;
    line-height: 1.1;
    direction: ltr;
    text-align: right;
}

.k-stat-title {
    font-size: 0.8rem;
    color: var(--k-text-secondary, #64748b);
    font-weight: 500;
}

.k-stat-extra {
    margin-top: 4px;
    padding-top: 10px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
}

/* Variant icon colors */
.k-stat-primary .k-stat-icon { background: #1db954; }
.k-stat-success .k-stat-icon { background: #10b981; }
.k-stat-warning .k-stat-icon { background: #f59e0b; }
.k-stat-danger .k-stat-icon { background: #ef4444; }
.k-stat-info .k-stat-icon { background: #8b5cf6; }
.k-stat-neutral .k-stat-icon { background: #64748b; }

@media (max-width: 640px) {
    .k-stat-value {
        font-size: 1.4rem;
    }
}
</style>
