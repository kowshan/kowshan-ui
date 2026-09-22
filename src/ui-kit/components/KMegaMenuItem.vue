<!-- components/KMegaMenuItem.vue — recursive menu item with flyout submenu -->
<template>
    <div
        class="k-mega-item-wrap"
        :class="{ 'is-open-sub': openSub }"
        @mouseenter="hover(true)"
        @mouseleave="hover(false)"
    >
        <!-- dynamic tag: <a> when href is set, otherwise <button> -->
        <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href || undefined"
            type="button"
            class="k-mega-item"
            :class="itemClass"
            role="menuitem"
            :disabled="item.disabled"
            @click.prevent="pick"
        >
            <span v-if="item.icon" class="k-mega-item-icon">
                <component :is="item.icon" class="icon" />
            </span>
            <span class="k-mega-item-main">
                <span class="k-mega-item-label">{{ item.label }}</span>
                <span v-if="item.description" class="k-mega-item-desc">{{ item.description }}</span>
            </span>
            <span v-if="item.badge" class="k-mega-item-badge">{{ item.badge }}</span>
            <span v-if="item.shortcut" class="k-mega-item-shortcut">{{ item.shortcut }}</span>
            <ChevronLeft v-if="item.children?.length" class="k-mega-item-chevron" />
        </component>

        <!-- Flyout submenu (depth 2 / 3) -->
        <Transition name="k-mega-flyout">
            <div
                v-if="openSub && item.children?.length"
                class="k-mega-flyout"
                role="menu"
            >
                <template v-for="(sub, i) in item.children" :key="i">
                    <div v-if="sub === 'divider'" class="k-mega-separator" />
                    <KMegaMenuItem v-else :item="sub" @select="select" />
                </template>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'

export interface KMegaItem {
    label: string
    icon?: any
    /** secondary line under the label (rich menus) */
    description?: string
    badge?: string
    shortcut?: string
    href?: string
    /** nested items — renders a flyout submenu (2nd/3rd depth) */
    children?: (KMegaItem | 'divider')[]
    value?: any
    danger?: boolean
    disabled?: boolean
}

export interface KMegaGroup {
    /** optional column header in categorized mode */
    title?: string
    items: (KMegaItem | 'divider')[]
}

const props = defineProps<{ item: KMegaItem }>()

const emits = defineEmits<{
    'select': [item: KMegaItem]
}>()

const openSub = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const itemClass = computed(() => ({
    'is-danger': props.item.danger,
    'is-disabled': props.item.disabled
}))

const hover = (enter: boolean) => {
    if (!props.item.children?.length) return
    if (timer) { clearTimeout(timer); timer = null }
    timer = setTimeout(() => { openSub.value = enter }, enter ? 90 : 0)
}

const pick = (e: Event) => {
    if (props.item.disabled) return
    if (props.item.children?.length) {
        e.stopPropagation()
        openSub.value = !openSub.value
        return
    }
    emits('select', props.item)
}

const select = (item: KMegaItem) => emits('select', item)

onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
</script>

<style scoped>
.k-mega-item-wrap {
    position: relative;
}

.k-mega-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    border: none;
    background: transparent;
    border-radius: 9px;
    padding: 8px 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 500;
    color: var(--k-text-primary, #1e293b);
    text-align: right;
    text-decoration: none;
    transition: background 0.1s ease;
}

.k-mega-item:hover:not(.is-disabled) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-mega-item.is-danger {
    color: var(--k-error, #dc2626);
}

.k-mega-item.is-danger:hover:not(.is-disabled) {
    background: color-mix(in srgb, var(--k-error, #dc2626) 10%, transparent);
}

.k-mega-item.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-mega-item-icon .icon {
    width: 15px;
    height: 15px;
    color: var(--k-text-secondary, #64748b);
    flex-shrink: 0;
}

.k-mega-item:hover:not(.is-disabled) .k-mega-item-icon .icon {
    color: var(--k-primary, #1db954);
}

.k-mega-item-main {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    flex: 1;
}

.k-mega-item-label {
    line-height: 1.4;
}

.k-mega-item-desc {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-mega-item-badge {
    font-size: 0.6rem;
    font-weight: 800;
    color: #fff;
    background: var(--k-primary, #1db954);
    border-radius: 999px;
    padding: 1px 8px;
    flex-shrink: 0;
}

.k-mega-item-shortcut {
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
    direction: ltr;
    flex-shrink: 0;
}

.k-mega-item-chevron {
    width: 14px;
    height: 14px;
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
    transition: transform 0.15s ease;
}

.k-mega-item-wrap.is-open-sub > .k-mega-item .k-mega-item-chevron {
    transform: rotate(180deg);
    color: var(--k-primary, #1db954);
}

.k-mega-separator {
    height: 1px;
    background: var(--k-border, #e2e8f0);
    margin: 5px 8px;
}

/* flyout — flush to the item, opens toward the start (left in RTL) */
.k-mega-flyout {
    position: absolute;
    inset-inline-start: 100%;
    top: 0;
    z-index: 350;
    min-width: 220px;
    /* NOTE: no max-height/overflow — a depth-3 flyout opens past this box and
       any non-visible overflow would clip it instead of letting it escape */
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    box-shadow: 0 14px 38px rgba(2, 6, 23, 0.16);
    padding: 6px;
    display: flex;
    flex-direction: column;
}

/* Transition */
.k-mega-flyout-enter-active,
.k-mega-flyout-leave-active {
    transition: opacity 0.12s ease, transform 0.12s ease;
}

.k-mega-flyout-enter-from,
.k-mega-flyout-leave-to {
    opacity: 0;
    transform: translateX(6px);
}
</style>
