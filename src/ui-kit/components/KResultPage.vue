<!-- components/KResultPage.vue -->
<!--
    KResultPage — status/result page (Ant-Design style):

      <KResultPage status="success" title="پرداخت موفق"
                   description="سفارش شما با موفقیت ثبت شد" />
-->
<template>
    <div class="k-result" :class="`is-${status}`">
        <span class="k-result-icon">
            <component :is="icon" :size="iconSize" stroke-width="1.6" />
        </span>
        <div class="k-result-title">{{ title }}</div>
        <p v-if="description || $slots.default" class="k-result-desc">
            <slot>{{ description }}</slot>
        </p>
        <div v-if="$slots.actions" class="k-result-actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    CheckCircle2, CircleAlert, CircleX, FileQuestion, Info, SearchX
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    status?: 'success' | 'error' | 'warning' | 'info' | '404' | 'empty'
    title?: string
    description?: string
}>(), {
    status: 'success',
    title: '',
    description: ''
})

const ICONS = {
    success: CheckCircle2,
    error: CircleX,
    warning: CircleAlert,
    info: Info,
    '404': FileQuestion,
    empty: SearchX
} as const

const icon = computed(() => ICONS[props.status])
const iconSize = computed(() => props.status === '404' ? 88 : 64)
</script>

<style scoped>
.k-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 32px 20px;
    max-width: 420px;
    width: 100%;
    margin-inline: auto;
}

.k-result-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 6px;
}

.k-result.is-success .k-result-icon { background: var(--k-success-light, #d1fae5); color: var(--k-success, #10b981); }
.k-result.is-error .k-result-icon { background: var(--k-error-light, #fee2e2); color: var(--k-error, #ef4444); }
.k-result.is-warning .k-result-icon { background: var(--k-warning-light, #fef3c7); color: var(--k-warning, #f59e0b); }
.k-result.is-info .k-result-icon { background: var(--k-info-light, #ede9fe); color: var(--k-info, #8b5cf6); }
.k-result.is-404 .k-result-icon { background: var(--k-primary-light, #e3f8ec); color: var(--k-primary, #1db954); }
.k-result.is-empty .k-result-icon { background: var(--k-surface-hover, #f1f5f9); color: var(--k-text-muted, #94a3b8); }

.k-result-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-result-desc {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.9;
    color: var(--k-text-secondary, #64748b);
    max-width: 360px;
}

.k-result-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}
</style>
