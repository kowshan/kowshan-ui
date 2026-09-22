<!-- components/KBadge.vue -->
<template>
    <span
        class="k-badge"
        :class="[`k-badge-${variant}`, `k-badge-${size}`, { 'is-outline': outline, 'is-dot': dot }]"
        :style="customColors"
    >
        <span v-if="dot" class="k-badge-dot" :class="`dot-${dotColor}`"></span>
        <component :is="icon" v-if="icon" class="k-badge-icon" />
        <slot>{{ text }}</slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    text?: string | number
    icon?: any
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
    outline?: boolean
    dot?: boolean
    dotColor?: string
    bgColor?: string
    textColor?: string
}>(), {
    variant: 'neutral',
    size: 'md',
    outline: false,
    dot: false
})

const customColors = computed(() => {
    if (!props.bgColor && !props.textColor) return {}
    return {
        backgroundColor: props.bgColor,
        color: props.textColor
    }
})
</script>

<style scoped>
.k-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
}

/* Variants (solid) */
.k-badge-primary { background: #dbeafe; color: #1d4ed8; }
.k-badge-success { background: #d1fae5; color: #047857; }
.k-badge-warning { background: #fef3c7; color: #b45309; }
.k-badge-danger  { background: #fee2e2; color: #b91c1c; }
.k-badge-info    { background: #ede9fe; color: #6d28d9; }
.k-badge-neutral { background: #f1f5f9; color: #475569; }

/* Outline variants */
.k-badge.is-outline.k-badge-primary { background: transparent; border: 1px solid #93c5fd; color: #1d4ed8; }
.k-badge.is-outline.k-badge-success { background: transparent; border: 1px solid #6ee7b7; color: #047857; }
.k-badge.is-outline.k-badge-warning { background: transparent; border: 1px solid #fcd34d; color: #b45309; }
.k-badge.is-outline.k-badge-danger  { background: transparent; border: 1px solid #fca5a5; color: #b91c1c; }
.k-badge.is-outline.k-badge-info    { background: transparent; border: 1px solid #c4b5fd; color: #6d28d9; }
.k-badge.is-outline.k-badge-neutral { background: transparent; border: 1px solid #cbd5e1; color: #475569; }

/* Sizes */
.k-badge-sm { font-size: 0.65rem; padding: 3px 8px; }
.k-badge-md { font-size: 0.72rem; padding: 4px 10px; }
.k-badge-lg { font-size: 0.82rem; padding: 6px 14px; }

/* Icon */
.k-badge-icon {
    width: 0.9em;
    height: 0.9em;
}

/* Dot */
.k-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
}

.k-badge.is-dot {
    gap: 6px;
}

/* Dot colors */
.dot-primary { background: var(--k-primary, #3b82f6); }
.dot-success { background: var(--k-success, #10b981); }
.dot-warning { background: var(--k-warning, #f59e0b); }
.dot-danger  { background: var(--k-error, #ef4444); }
.dot-info    { background: var(--k-info, #8b5cf6); }
.dot-neutral { background: var(--k-text-muted, #94a3b8); }

/* Dark mode */
[data-theme='dark'] .k-badge-primary { background: rgba(59,130,246,0.15); color: #93c5fd; }
[data-theme='dark'] .k-badge-success { background: rgba(16,185,129,0.15); color: #6ee7b7; }
[data-theme='dark'] .k-badge-warning { background: rgba(245,158,11,0.15); color: #fcd34d; }
[data-theme='dark'] .k-badge-danger  { background: rgba(239,68,68,0.15); color: #fca5a5; }
[data-theme='dark'] .k-badge-info    { background: rgba(139,92,246,0.15); color: #c4b5fd; }
[data-theme='dark'] .k-badge-neutral { background: rgba(71,85,105,0.2); color: #94a3b8; }

[data-theme='dark'] .k-badge.is-outline.k-badge-primary { border-color: rgba(147,197,253,0.3); color: #93c5fd; }
[data-theme='dark'] .k-badge.is-outline.k-badge-success { border-color: rgba(110,231,183,0.3); color: #6ee7b7; }
[data-theme='dark'] .k-badge.is-outline.k-badge-warning { border-color: rgba(252,211,77,0.3); color: #fcd34d; }
[data-theme='dark'] .k-badge.is-outline.k-badge-danger  { border-color: rgba(252,165,165,0.3); color: #fca5a5; }
[data-theme='dark'] .k-badge.is-outline.k-badge-info    { border-color: rgba(196,181,253,0.3); color: #c4b5fd; }
[data-theme='dark'] .k-badge.is-outline.k-badge-neutral { border-color: rgba(148,163,184,0.3); color: #94a3b8; }
</style>
