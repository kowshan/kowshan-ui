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
        <div class="k-sidebar-top" :class="{ 'is-collapsed': collapsed }">
            <slot v-if="!collapsed" name="brand">
                <div v-if="brand || $slots.logo" class="k-sidebar-brand">
                    <span class="k-sidebar-logo"><slot name="logo">{{ logoText }}</slot></span>
                    <span class="k-sidebar-brand-text">{{ brand }}</span>
                </div>
            </slot>
            <button
                v-if="collapsible"
                type="button"
                class="k-sidebar-toggle"
                :aria-label="collapsed ? 'باز کردن منو' : 'بستن منو'"
                :aria-expanded="!collapsed"
                @click="toggleCollapsed"
            >
                <PanelLeftClose v-if="!collapsed" :size="16" />
                <PanelLeftOpen v-else :size="16" />
            </button>
        </div>

        <!-- Groups -->
        <nav class="k-sidebar-nav">
            <div v-for="group in groups" :key="group.title" class="k-sidebar-group">
                <div v-if="group.title && !collapsed" class="k-sidebar-group-title">{{ group.title }}</div>

                <!-- Collapsed rail: parents and their children as one flat, symmetric column -->
                <template v-if="collapsed">
                    <button
                        v-for="item in flatten(group.items)"
                        :key="item.id"
                        type="button"
                        class="k-sidebar-item"
                        :class="{ 'is-active': modelValue === item.id, 'is-child': item.depth > 0 }"
                        :title="item.label"
                        @click="select(item)"
                    >
                        <span class="k-sidebar-item-icon">
                            <component :is="item.icon" :size="18" />
                        </span>
                        <span v-if="item.badge" class="k-sidebar-item-dot"></span>
                    </button>
                </template>

                <!-- Expanded: parents with one level of nested children -->
                <template v-else>
                    <template v-for="item in group.items" :key="item.id">
                        <button
                            type="button"
                            class="k-sidebar-item"
                            :class="{ 'is-active': modelValue === item.id, 'is-parent': hasChildren(item) }"
                            :aria-expanded="hasChildren(item) ? isOpenItem(item.id) : undefined"
                            @click="onItemClick(item)"
                        >
                            <span class="k-sidebar-item-icon">
                                <component :is="item.icon" :size="18" />
                            </span>
                            <span class="k-sidebar-item-label">{{ item.label }}</span>
                            <span v-if="item.badge" class="k-sidebar-item-badge">{{ item.badge }}</span>
                            <ChevronDown
                                v-if="hasChildren(item)"
                                :size="14"
                                class="k-sidebar-item-chevron"
                                :class="{ 'is-open': isOpenItem(item.id) }"
                            />
                        </button>

                        <div v-if="hasChildren(item) && isOpenItem(item.id)" class="k-sidebar-children">
                            <button
                                v-for="child in item.children"
                                :key="child.id"
                                type="button"
                                class="k-sidebar-item is-child"
                                :class="{ 'is-active': modelValue === child.id }"
                                @click="select(child)"
                            >
                                <span class="k-sidebar-item-icon">
                                    <component v-if="child.icon" :is="child.icon" :size="16" />
                                    <span v-else class="k-sidebar-child-dot" />
                                </span>
                                <span class="k-sidebar-item-label">{{ child.label }}</span>
                                <span v-if="child.badge" class="k-sidebar-item-badge">{{ child.badge }}</span>
                            </button>
                        </div>
                    </template>
                </template>
            </div>
        </nav>

        <!-- Footer -->
        <div v-if="$slots.footer" class="k-sidebar-footer">
            <slot name="footer" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

export interface KSidebarItem {
    id: string
    label: string
    icon?: any
    badge?: string | number
    children?: KSidebarItem[]
}

const props = withDefaults(defineProps<{
    modelValue?: string
    brand?: string
    logoText?: string
    groups?: { title?: string; items: KSidebarItem[] }[]
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

/* which parents have their submenu open */
const openIds = ref<string[]>([])

const hasChildren = (item: KSidebarItem) => !!item.children?.length

const isOpenItem = (id: string) => openIds.value.includes(id)

const toggleOpen = (id: string) => {
    openIds.value = isOpenItem(id) ? openIds.value.filter(i => i !== id) : [...openIds.value, id]
}

const select = (item: { id: string }) => {
    if (item.id !== props.modelValue) {
        emits('update:modelValue', item.id)
        emits('change', item.id)
    }
}

const onItemClick = (item: KSidebarItem) => {
    if (hasChildren(item)) toggleOpen(item.id)
    else select(item)
}

/* collapse a parent with children to a flat icon rail */
const flatten = (items: KSidebarItem[]) => {
    const out: (KSidebarItem & { depth: number })[] = []
    for (const item of items) {
        out.push({ ...item, depth: 0 })
        item.children?.forEach(c => out.push({ ...c, depth: 1 }))
    }
    return out
}

/* opening the group that holds the active child, wherever selection comes from */
watch(() => props.modelValue, (id) => {
    if (!id || collapsed.value) return
    for (const group of props.groups) {
        for (const item of group.items) {
            if (item.children?.some(c => c.id === id) && !isOpenItem(item.id)) toggleOpen(item.id)
        }
    }
}, { immediate: true })

const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
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

/* collapsed: the brand is gone, so the toggle becomes a normal rail icon —
   no brand and toggle fighting for the same 60px */
.k-sidebar-top.is-collapsed {
    justify-content: center;
}
.k-sidebar-top.is-collapsed .k-sidebar-toggle {
    width: 100%;
    height: 34px;
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
    position: relative;
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

/* nested level */
.k-sidebar-children {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin: 2px 0 4px;
    padding-inline-start: 14px;
    border-inline-start: 1px dashed var(--k-border, #e2e8f0);
}

.k-sidebar-item.is-child {
    padding: 7px 10px;
    font-size: 0.76rem;
}

.k-sidebar-item.is-parent.is-active {
    font-weight: 600;
}

.k-sidebar-child-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.45;
}

.k-sidebar-item-chevron {
    flex-shrink: 0;
    opacity: 0.6;
    transition: transform 0.18s ease;
}

.k-sidebar-item-chevron.is-open {
    transform: rotate(180deg);
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
    text-align: start;
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
    position: absolute;
    top: 6px;
    inset-inline-end: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--k-primary, #1db954);
    flex-shrink: 0;
}

/* collapsed rail: every item is the same square, icon dead-centre, and the
   badge dot is parked on the corner so it can't push the icon off-centre */
.k-sidebar.is-collapsed .k-sidebar-item,
.k-sidebar.is-collapsed .k-sidebar-item.is-child {
    justify-content: center;
    padding: 9px;
}

.k-sidebar.is-collapsed .k-sidebar-item-dot {
    top: 5px;
    inset-inline-end: 9px;
}

.k-sidebar-footer {
    border-top: 1px dashed var(--k-border, #e2e8f0);
    padding-top: 10px;
}
</style>
