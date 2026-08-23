<!-- components/KAppBar.vue -->
<!--
    KAppBar — app top bar: brand/title, optional search, action buttons
    with badges, avatar menu slot.

      <KAppBar title="سامانه املاک" :actions="[{ id: 'bell', icon: Bell, badge: '4' }]" @action="onAction">
        <template #search> <KTextInput placeholder="جستجو…" /> </template>
        <template #avatar> <img src="…" /> </template>
      </KAppBar>
-->
<template>
    <header class="k-appbar" :class="[`k-appbar-${variant}`, { 'is-sticky': sticky }]">
        <!-- Leading / menu button -->
        <button v-if="menuable" type="button" class="k-appbar-icon" aria-label="منو" @click="emits('menu')">
            <Menu :size="20" />
        </button>

        <!-- Title -->
        <div class="k-appbar-title">
            <slot name="leading" />
            <span class="k-appbar-text">{{ title }}</span>
        </div>

        <!-- Search -->
        <div v-if="$slots.search" class="k-appbar-search">
            <slot name="search" />
        </div>

        <!-- Actions -->
        <div class="k-appbar-actions">
            <button
                v-for="a in actions"
                :key="a.id"
                type="button"
                class="k-appbar-icon"
                :aria-label="a.label || a.id"
                @click="emits('action', a.id)"
            >
                <span class="k-appbar-action-icon">
                    <component :is="a.icon" :size="19" />
                    <span v-if="a.badge" class="k-appbar-badge" :class="{ 'is-dot': a.badge === true }">
                        {{ a.badge === true ? '' : a.badge }}
                    </span>
                </span>
            </button>

            <!-- Avatar -->
            <button v-if="$slots.avatar" type="button" class="k-appbar-avatar-btn" aria-label="پروفایل" @click="emits('avatar')">
                <slot name="avatar" />
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

withDefaults(defineProps<{
    title?: string
    menuable?: boolean
    sticky?: boolean
    variant?: 'default' | 'glass'
    actions?: { id: string; icon: any; badge?: string | number | boolean; label?: string }[]
}>(), {
    title: '',
    menuable: false,
    sticky: false,
    variant: 'default',
    actions: () => []
})

const emits = defineEmits<{
    (e: 'menu'): void
    (e: 'action', id: string): void
    (e: 'avatar'): void
}>()
</script>

<style scoped>
.k-appbar {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 52px;
    padding: 8px 12px;
    background: var(--k-surface, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
}

.k-appbar-glass {
    background: color-mix(in srgb, var(--k-surface, #ffffff) 72%, transparent);
    backdrop-filter: blur(10px);
}

.k-appbar.is-sticky {
    position: sticky;
    top: 0;
    z-index: 50;
}

.k-appbar-title {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.k-appbar-text {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-appbar-search {
    flex: 1;
    min-width: 120px;
}

.k-appbar-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-inline-start: auto;
}

.k-appbar-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-appbar-icon:hover {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-primary, #1e293b);
}

.k-appbar-action-icon {
    position: relative;
    display: flex;
}

.k-appbar-badge {
    position: absolute;
    top: -6px;
    inset-inline-end: -8px;
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--k-error, #ef4444);
    color: #fff;
    font-size: 0.56rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.k-appbar-badge.is-dot {
    min-width: 7px;
    width: 7px;
    height: 7px;
    padding: 0;
}

.k-appbar-avatar-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    background: transparent;
}

.k-appbar-avatar-btn :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}
</style>
