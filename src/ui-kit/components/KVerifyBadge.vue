<!-- components/KVerifyBadge.vue -->
<!--
    KVerifyBadge — verification status chip:

      <KVerifyBadge status="verified" />
      <KVerifyBadge status="pending" label="در انتظار بررسی" />
-->
<template>
    <span class="k-verify" :class="[`is-${status}`, `k-verify--${size}`]" :title="title || undefined">
        <component :is="icon" :size="size === 'sm' ? 12 : 14" />
        <span class="k-verify-label">{{ label }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BadgeCheck, Clock3, ShieldAlert, ShieldX } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    status: 'verified' | 'pending' | 'unverified' | 'rejected'
    label?: string
    size?: 'sm' | 'md'
    title?: string
}>(), {
    label: '',
    size: 'md',
    title: ''
})

const ICONS = {
    verified: BadgeCheck,
    pending: Clock3,
    unverified: ShieldAlert,
    rejected: ShieldX
} as const

const LABELS: Record<string, string> = {
    verified: 'تأیید شده',
    pending: 'در انتظار بررسی',
    unverified: 'تأیید نشده',
    rejected: 'رد شده'
}

const icon = computed(() => ICONS[props.status])
const label = computed(() => props.label || LABELS[props.status])
</script>

<style scoped>
.k-verify {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    width: fit-content;
    padding: 3px 10px;
    border-radius: 999px;
    font-weight: 700;
    white-space: nowrap;
}

.k-verify--sm {
    font-size: 0.62rem;
    padding: 2px 8px;
}

.k-verify--md {
    font-size: 0.7rem;
    padding: 4px 12px;
}

.k-verify.is-verified {
    background: var(--k-success-light, #d1fae5);
    color: var(--k-success, #10b981);
    border: 1px solid color-mix(in srgb, var(--k-success, #10b981) 35%, transparent);
}

.k-verify.is-pending {
    background: var(--k-warning-light, #fef3c7);
    color: var(--k-warning, #f59e0b);
    border: 1px solid color-mix(in srgb, var(--k-warning, #f59e0b) 35%, transparent);
}

.k-verify.is-unverified {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    border: 1px solid var(--k-border, #e2e8f0);
}

.k-verify.is-rejected {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
    border: 1px solid color-mix(in srgb, var(--k-error, #ef4444) 35%, transparent);
}
</style>
