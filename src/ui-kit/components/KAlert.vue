<!-- components/KAlert.vue -->
<template>
    <div
        class="k-alert"
        :class="[`k-alert-${variant}`, { 'is-dismissed': dismissed, 'is-borderless': borderless }]"
        role="alert"
    >
        <!-- Icon -->
        <div v-if="showIcon" class="k-alert-icon">
            <component :is="iconComponent" class="icon" />
        </div>

        <!-- Content -->
        <div class="k-alert-content">
            <div v-if="title" class="k-alert-title">{{ title }}</div>
            <div v-if="description || $slots.default" class="k-alert-desc">
                <slot>{{ description }}</slot>
            </div>
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions" class="k-alert-actions">
            <slot name="actions" />
        </div>

        <!-- Close -->
        <button
            v-if="closable"
            type="button"
            class="k-alert-close"
            aria-label="بستن"
            @click="dismiss"
        >
            <X class="icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'danger'
    title?: string
    description?: string
    showIcon?: boolean
    closable?: boolean
    borderless?: boolean
}>(), {
    variant: 'info',
    showIcon: true,
    closable: false,
    borderless: false
})

const emits = defineEmits<{
    'close': []
}>()

const dismissed = ref(false)

const iconComponent = computed(() => {
    switch (props.variant) {
        case 'success': return CheckCircle2
        case 'warning': return AlertCircle
        case 'danger': return XCircle
        default: return Info
    }
})

const dismiss = () => {
    dismissed.value = true
    emits('close')
}
</script>

<style scoped>
.k-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 16px;
    border-radius: 10px;
    border: 1px solid;
    font-size: 0.82rem;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.k-alert.is-dismissed {
    opacity: 0;
    transform: translateY(-4px);
    pointer-events: none;
    position: absolute;
    visibility: hidden;
}

.k-alert-icon {
    flex-shrink: 0;
    margin-top: 1px;
}

.k-alert-icon .icon {
    width: 18px;
    height: 18px;
}

.k-alert-content {
    flex: 1;
    min-width: 0;
}

.k-alert-title {
    font-weight: 700;
    font-size: 0.85rem;
}

.k-alert-desc {
    margin-top: 2px;
    line-height: 1.7;
    opacity: 0.92;
}

.k-alert-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-top: 2px;
}

.k-alert-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s ease, background 0.15s ease;
    margin: -2px -4px 0 0;
}

.k-alert-close:hover {
    opacity: 1;
}

.k-alert-close .icon {
    width: 14px;
    height: 14px;
}

/* Variants */
.k-alert-info {
    background: var(--k-info-light, #ede9fe);
    border-color: color-mix(in srgb, #8b5cf6 30%, transparent);
    color: #5b21b6;
}

.k-alert-info .k-alert-icon { color: #8b5cf6; }

.k-alert-success {
    background: var(--k-success-light, #d1fae5);
    border-color: color-mix(in srgb, #10b981 30%, transparent);
    color: #065f46;
}

.k-alert-success .k-alert-icon { color: #10b981; }

.k-alert-warning {
    background: var(--k-warning-light, #fef3c7);
    border-color: color-mix(in srgb, #f59e0b 30%, transparent);
    color: #92400e;
}

.k-alert-warning .k-alert-icon { color: #f59e0b; }

.k-alert-danger {
    background: var(--k-error-light, #fee2e2);
    border-color: color-mix(in srgb, #ef4444 30%, transparent);
    color: #991b1b;
}

.k-alert-danger .k-alert-icon { color: #ef4444; }

.k-alert.is-borderless {
    border-color: transparent;
}
</style>
