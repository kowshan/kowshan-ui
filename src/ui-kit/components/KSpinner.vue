<!-- components/KSpinner.vue -->
<!--
    KSpinner — standalone loader:

      <KSpinner size="lg" />
      <KSpinner :overlay="true" label="در حال بارگذاری…" />
-->
<template>
    <div
        class="k-spinner"
        :class="[`k-spinner--${size}`, { 'is-overlay': overlay, 'is-full': fullscreen }]"
        role="status"
        :aria-label="label || 'در حال بارگذاری'"
    >
        <span class="k-spinner-ring" :style="ringStyle" />
        <span v-if="label" class="k-spinner-label">{{ label }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    label?: string
    /** absolute overlay inside the nearest positioned parent */
    overlay?: boolean
    /** fixed overlay covering the whole viewport */
    fullscreen?: boolean
}>(), {
    size: 'md',
    color: '',
    label: '',
    overlay: false,
    fullscreen: false
})

const SIZE_PX: Record<string, number> = { xs: 14, sm: 20, md: 28, lg: 40, xl: 56 }

const ringStyle = computed(() => ({
    width: `${SIZE_PX[props.size]}px`,
    height: `${SIZE_PX[props.size]}px`,
    borderColor: props.color
        ? `${props.color}33 ${props.color} ${props.color} ${props.color}`
        : undefined
}))
</script>

<style scoped>
.k-spinner {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--k-text-secondary, #64748b);
}

.k-spinner.is-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: color-mix(in srgb, var(--k-bg, #fff) 82%, transparent);
    border-radius: inherit;
}

.k-spinner.is-full {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: color-mix(in srgb, var(--k-bg, #fff) 80%, transparent);
}

.k-spinner-ring {
    display: block;
    border-radius: 50%;
    border: 3px solid var(--k-border, #e2e8f0);
    border-top-color: var(--k-primary, #1db954);
    animation: k-spin 0.7s linear infinite;
}

.k-spinner-label {
    font-size: 0.72rem;
    color: var(--k-text-secondary, #64748b);
}
</style>
