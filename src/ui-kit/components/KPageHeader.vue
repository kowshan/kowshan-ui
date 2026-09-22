<!-- KPageHeader — page title + breadcrumb + action buttons -->
<template>
    <div class="k-ph" :class="{ 'has-border': border }">
        <div class="k-ph-top">
            <!-- Breadcrumb -->
            <div v-if="breadcrumbs.length" class="k-ph-breadcrumb">
                <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <router-link
                        v-if="crumb.to"
                        :to="crumb.to"
                        class="k-ph-crumb"
                    >{{ crumb.label }}</router-link>
                    <span v-else class="k-ph-crumb">{{ crumb.label }}</span>
                    <ChevronLeft v-if="i < breadcrumbs.length - 1" :size="14" class="k-ph-sep" />
                </template>
            </div>

            <div class="k-ph-spacer" />

            <!-- Actions -->
            <div v-if="$slots.actions" class="k-ph-actions">
                <slot name="actions" />
            </div>
        </div>

        <!-- Title Row -->
        <div class="k-ph-title-row">
            <div class="k-ph-title-area">
                <slot name="icon">
                    <component v-if="icon" :is="icon" :size="22" class="k-ph-icon" />
                </slot>
                <div>
                    <h1 class="k-ph-title">{{ title }}</h1>
                    <p v-if="subtitle" class="k-ph-subtitle">{{ subtitle }}</p>
                </div>
            </div>
            <div v-if="$slots.extra" class="k-ph-extra">
                <slot name="extra" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

export interface Breadcrumb {
    label: string
    to?: string | { path: string }
}

withDefaults(defineProps<{
    title: string
    subtitle?: string
    icon?: any
    breadcrumbs?: Breadcrumb[]
    border?: boolean
}>(), {
    breadcrumbs: () => [],
    border: false
})
</script>

<style scoped>
.k-ph { padding: 0 0 14px; }
.k-ph.has-border { border-bottom: 1px solid var(--k-border); padding-bottom: 14px; }

.k-ph-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.k-ph-spacer { flex: 1; }

.k-ph-breadcrumb { display: flex; align-items: center; gap: 4px; }
.k-ph-crumb {
    font-size: 0.72rem; color: var(--k-text-muted); text-decoration: none;
    transition: color 0.15s;
}
.k-ph-crumb:hover { color: var(--k-primary); }
.k-ph-sep { color: var(--k-text-muted); }

.k-ph-actions { display: flex; gap: 6px; }

.k-ph-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.k-ph-title-area { display: flex; align-items: flex-start; gap: 10px; }
.k-ph-icon { color: var(--k-primary); margin-top: 2px; flex-shrink: 0; }

.k-ph-title {
    margin: 0; font-size: 1.15rem; font-weight: 800;
    color: var(--k-text-primary); line-height: 1.4;
}
.k-ph-subtitle { margin: 2px 0 0; font-size: 0.78rem; color: var(--k-text-muted); line-height: 1.5; }

.k-ph-extra { flex-shrink: 0; }
</style>
