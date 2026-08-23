<!-- components/KSidebar.vue -->
<!--
    KSidebar — app navigation sidebar with grouped items, collapsible to
    icon-only, badges and an optional footer slot.

      <KSidebar v-model="active" :groups="[
        { title: 'اصلی', items: [
          { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
          { id: 'deals', label: 'معاملات', icon: Briefcase, badge: '12' },
        ]},
      ]">
        <template #footer> <KAvatar …/> </template>
      </KSidebar>
-->
<template>
    <aside class="k-sidebar" :class="{ 'is-collapsed': collapsed }">
        <!-- Brand / collapse toggle -->
        <div class="k-sidebar-top">
            <slot name="brand">
                <div class="k-sidebar-brand">
                    <span class="k-sidebar-logo"><slot name="logo">{{ logoText }}</slot></span>
                    <span v-if="!collapsed" class="k-sidebar-brand-text">{{ brand }}</span>
                </div>
            </slot>
            <button
                v-if="collapsible"
                type="button"
                class="k-sidebar-toggle"
                :aria-label="collapsed ? 'باز کردن منو' : 'بستن منو'"
                @click="collapsed = !collapsed"
            >
                <PanelLeftClose v-if="!collapsed" :size="16" />
                <PanelLeftOpen v-else :size="16" />
            </button>
        </div>

        <!-- Groups -->
        <nav class="k-sidebar-nav">
            <div v-for="group in groups" :key="group.title" class="k-sidebar-group">
                <div v-if="group.title && !collapsed" class="k-sidebar-group-title">{{ group.title }}</div>
                <button
                    v-for="item in group.items"
                    :key="item.id"
                    type="button"
                    class="k-sidebar-item"
                    :class="{ 'is-active': modelValue === item.id }"
                    :title="collapsed ? item.label : undefined"
                    @click="select(item)"
                >
                    <span class="k-sidebar-item-icon">
                        <component :is="item.icon" :size="18" />
                    </span>
                    <span v-if="!collapsed" class="k-sidebar-item-label">{{ item.label }}</span>
                    <span v-if="item.badge && !collapsed" class="k-sidebar-item-badge">{{ item.badge }}</span>
                    <span v-if="item.badge && collapsed" class="k-sidebar-item-dot"></span>
                </button>
            </div>
        </nav>

        <!-- Footer -->
        <div v-if="$slots.footer" class="k-sidebar-footer">
            <slot name="footer" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue?: string
    brand?: string
    logoText?: string
    groups?: { title?: string; items: { id: string; label: string; icon: any; badge?: string | number }[] }[]
    collapsible?: boolean
}>(), {
    modelValue: '',
    brand: '',
    logoText: 'K',
    groups: () => [],
    collapsible: true
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
}>()

// internal collapse state
const collapsed = ref(false)

const select = (item: { id: string }) => {
    if (item.id !== props.modelValue) {
        emits('update:modelValue', item.id)
        emits('change', item.id)
    }
}
</script>

<style scoped>
.k-sidebar {
    display: flex;
    flex-direction: column;
    width: 232px;
    min-height: 100%;
    background: var(--k-surface, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    padding: 10px;
    gap: 8px;
    transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.k-sidebar.is-collapsed {
    width: 60px;
}

.k-sidebar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 4px 2px 10px;
    border-bottom: 1px dashed var(--k-border, #e2e8f0);
}

.k-sidebar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.k-sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-weight: 800;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.k-sidebar-brand-text {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
}

.k-sidebar-toggle:hover {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
}

.k-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    overflow-y: auto;
}

.k-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-sidebar-group-title {
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-text-muted, #94a3b8);
    padding: 0 8px 4px;
    letter-spacing: 0.02em;
}

.k-sidebar-item {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    border-radius: 9px;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    color: var(--k-text-secondary, #64748b);
    transition: all 0.15s ease;
    white-space: nowrap;
}

.k-sidebar-item:hover {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-primary, #1e293b);
}

.k-sidebar-item.is-active {
    background: var(--k-primary-light, color-mix(in srgb, #1db954 12%, transparent));
    color: var(--k-primary, #1db954);
    font-weight: 700;
}

.k-sidebar-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.k-sidebar-item-label {
    flex: 1;
    text-align: right;
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-sidebar-item-badge {
    font-size: 0.6rem;
    font-weight: 800;
    min-width: 20px;
    padding: 2px 6px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
    color: var(--k-primary, #1db954);
    text-align: center;
}

.k-sidebar-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--k-primary, #1db954);
    margin-inline-start: auto;
    flex-shrink: 0;
}

.k-sidebar.is-collapsed .k-sidebar-item {
    justify-content: center;
    padding: 9px;
}

.k-sidebar-footer {
    border-top: 1px dashed var(--k-border, #e2e8f0);
    padding-top: 10px;
}
</style>
