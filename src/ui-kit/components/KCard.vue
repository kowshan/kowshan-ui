<!-- components/KCard.vue -->
<template>
    <div
        class="k-card"
        :class="[
            `k-card-${variant}`,
            `k-card-pad-${padding}`,
            {
                'is-bordered': bordered,
                'is-hoverable': hoverable,
                'is-interactive': interactive
            }
        ]"
        role="region"
        :aria-label="title || undefined"
    >
        <!-- Cover image -->
        <div v-if="cover || $slots.cover" class="k-card-cover">
            <slot name="cover"><img :src="cover" alt="" loading="lazy" /></slot>
        </div>

        <!-- Header -->
        <div v-if="title || subtitle || $slots.header" class="k-card-header">
            <slot name="header">
                <div class="k-card-heading">
                    <span v-if="title" class="k-card-title">{{ title }}</span>
                    <span v-if="subtitle" class="k-card-subtitle">{{ subtitle }}</span>
                </div>
                <slot name="actions" />
            </slot>
        </div>

        <!-- Body -->
        <div class="k-card-body">
            <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="k-card-footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    subtitle?: string
    /** cover image URL (rendered in a 16/9 strip on top) */
    cover?: string
    variant?: 'default' | 'outlined' | 'filled' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient' | 'glass' | 'glow'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    bordered?: boolean
    hoverable?: boolean
    interactive?: boolean
}>(), {
    variant: 'default',
    padding: 'md',
    bordered: true,
    hoverable: false,
    interactive: false
})
</script>

<style scoped>
.k-card {
    background: var(--k-bg, #ffffff);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    min-width: 0;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.k-card.is-bordered {
    border: 1px solid var(--k-border, #e2e8f0);
}

.k-card.is-hoverable {
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease;
}

.k-card.is-hoverable:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 35%, var(--k-border, #e2e8f0));
}

.k-card.is-interactive {
    cursor: pointer;
}

/* Cover */
.k-card-cover {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--k-surface-hover, #f1f5f9);
    flex-shrink: 0;
}

.k-card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.k-card.is-hoverable:hover .k-card-cover img {
    transform: scale(1.05);
}

/* Variants */
.k-card-gradient {
    background: linear-gradient(135deg, color-mix(in srgb, var(--k-primary, #1db954) 14%, var(--k-bg)), var(--k-bg) 55%);
}

.k-card-glass {
    background: color-mix(in srgb, var(--k-surface, #ffffff) 68%, transparent);
    backdrop-filter: blur(12px);
    border: 1px solid color-mix(in srgb, #fff 55%, transparent);
}

.k-card-glow {
    background: var(--k-bg, #ffffff);
}

.k-card-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--k-primary, #1db954) 60%, transparent), transparent 40%, color-mix(in srgb, var(--k-primary, #1db954) 25%, transparent));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

.k-card-glow::after {
    content: '';
    position: absolute;
    inset: -40%;
    border-radius: inherit;
    background: radial-gradient(closest-side, color-mix(in srgb, var(--k-primary, #1db954) 22%, transparent), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 0;
}

.k-card-glow:hover::after {
    opacity: 1;
}

.k-card-glow > * {
    position: relative;
    z-index: 1;
}

/* Paddings */
.k-card-pad-none .k-card-body,
.k-card-pad-none .k-card-header,
.k-card-pad-none .k-card-footer { padding: 0; }

.k-card-pad-sm .k-card-body { padding: 12px 14px; }
.k-card-pad-sm .k-card-header { padding: 12px 14px 0; }
.k-card-pad-sm .k-card-footer { padding: 14px 14px 12px; }

.k-card-pad-md .k-card-body { padding: 18px 20px; }
.k-card-pad-md .k-card-header { padding: 18px 20px 0; }
.k-card-pad-md .k-card-footer { padding: 14px 20px 18px; }

.k-card-pad-lg .k-card-body { padding: 24px 26px; }
.k-card-pad-lg .k-card-header { padding: 24px 26px 0; }
.k-card-pad-lg .k-card-footer { padding: 14px 26px 24px; }

/* Header */
.k-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.k-card-heading {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.k-card-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-card-subtitle {
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
}

.k-card-outlined {
    background: transparent;
}

.k-card-filled {
    background: var(--k-surface, #f8fafc);
}

.k-card-primary { border-top: 3px solid var(--k-primary, #3b82f6); }
.k-card-success { border-top: 3px solid var(--k-success, #10b981); }
.k-card-warning { border-top: 3px solid var(--k-warning, #f59e0b); }
.k-card-danger  { border-top: 3px solid var(--k-error, #ef4444); }
.k-card-info    { border-top: 3px solid var(--k-info, #8b5cf6); }

/* Footer */
.k-card-footer {
    border-top: 1px solid var(--k-border, #e2e8f0);
    padding-top: 14px;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
</style>
