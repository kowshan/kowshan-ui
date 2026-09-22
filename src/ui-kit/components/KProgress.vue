<!-- components/KProgress.vue -->
<template>
    <div class="k-progress" :class="[`k-progress-${variant}`, { 'is-indeterminate': indeterminate }]">
        <!-- Label row -->
        <div v-if="label || showPercent" class="k-progress-header">
            <span v-if="label" class="k-progress-label">{{ label }}</span>
            <span v-if="showPercent && !indeterminate" class="k-progress-percent">{{ Math.round(percent) }}٪</span>
        </div>

        <!-- Track -->
        <div class="k-progress-track" role="progressbar" :aria-valuenow="indeterminate ? undefined : Math.round(percent)" aria-valuemin="0" aria-valuemax="100">
            <div
                class="k-progress-fill"
                :class="{ striped, animated: animated }"
                :style="{ width: indeterminate ? '40%' : `${Math.min(100, Math.max(0, percent))}%` }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** 0-100 value */
    modelValue?: number
    percent?: number
    label?: string
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md' | 'lg'
    showPercent?: boolean
    striped?: boolean
    animated?: boolean
    indeterminate?: boolean
    color?: string
}>(), {
    variant: 'primary',
    size: 'md',
    showPercent: false,
    striped: false,
    animated: false,
    indeterminate: false
})

const percent = computed(() => props.modelValue ?? props.percent ?? 0)

</script>

<style scoped>
.k-progress {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.k-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.k-progress-label {
    font-size: 0.78rem;
    color: var(--k-text-secondary);
}

.k-progress-percent {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--k-text-primary);
    direction: ltr;
}

.k-progress-track {
    width: 100%;
    background: var(--k-surface-hover, #e2e8f0);
    border-radius: 999px;
    overflow: hidden;
    height: var(--k-progress-h, 8px);
}

.k-progress-sm .k-progress-track { --k-progress-h: 5px; }
.k-progress-md .k-progress-track { --k-progress-h: 8px; }
.k-progress-lg .k-progress-track { --k-progress-h: 12px; }

.k-progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease;
    background-color: #1db954;
}

.k-progress-fill.striped {
    background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
    background-size: 20px 20px;
}

.k-progress-fill.animated {
    animation: k-progress-stripes 0.8s linear infinite;
}

.k-progress.is-indeterminate .k-progress-fill {
    animation: k-progress-indeterminate 1.2s ease-in-out infinite;
    width: 40%;
}

.k-progress-primary .k-progress-fill { background-color: #1db954; }
.k-progress-success .k-progress-fill { background-color: #10b981; }
.k-progress-warning .k-progress-fill { background-color: #f59e0b; }
.k-progress-danger .k-progress-fill { background-color: #ef4444; }
.k-progress-info .k-progress-fill { background-color: #3b82f6; }

@keyframes k-progress-stripes {
    from { background-position: 0 0; }
    to { background-position: 20px 0; }
}

@keyframes k-progress-indeterminate {
    0% { margin-left: -40%; }
    100% { margin-left: 100%; }
}
</style>
