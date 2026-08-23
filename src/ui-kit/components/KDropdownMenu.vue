<!-- components/KDropdownMenu.vue -->
<template>
    <div ref="rootRef" class="k-dropdown">
        <!-- Trigger (slot handles the click; a wrapping handler would double-toggle) -->
        <div class="k-dropdown-trigger">
            <slot name="trigger" :open="open" :toggle="toggle" />
        </div>

        <!-- Menu -->
        <Transition name="k-dropdown">
            <div
                v-if="open"
                class="k-dropdown-menu"
                :class="[`align-${align}`, `dir-${dir}`]"
                :style="width ? { width } : {}"
                role="menu"
            >
                <template v-for="(item, i) in items" :key="i">
                    <div v-if="item === 'divider'" class="k-dropdown-separator" />
                    <button
                        v-else
                        type="button"
                        class="k-dropdown-item"
                        :class="{
                            'is-danger': item.danger,
                            'is-disabled': item.disabled
                        }"
                        role="menuitem"
                        :disabled="item.disabled"
                        @click="choose(item)"
                    >
                        <span v-if="item.icon" class="k-dropdown-item-icon">
                            <component :is="item.icon" class="icon" />
                        </span>
                        <span class="k-dropdown-item-label">{{ item.label }}</span>
                        <span v-if="item.shortcut" class="k-dropdown-item-shortcut">
                            {{ item.shortcut }}
                        </span>
                    </button>
                </template>
                <slot />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useClickOutside } from '../composables/useClickOutside'

export interface KDropdownItem {
    label: string
    icon?: any
    shortcut?: string
    danger?: boolean
    disabled?: boolean
    /** when clicked, emits 'select' with this item */
    value?: any
}

const props = withDefaults(defineProps<{
    items?: (KDropdownItem | 'divider')[]
    align?: 'start' | 'end'
    /** 'down' (below trigger) | 'up' (above) */
    dir?: 'down' | 'up'
    width?: string
    closeOnSelect?: boolean
}>(), {
    items: () => [],
    align: 'end',
    dir: 'down',
    closeOnSelect: true
})

const emits = defineEmits<{
    'select': [item: KDropdownItem]
    'toggle': [open: boolean]
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

const toggle = () => {
    open.value = !open.value
    emits('toggle', open.value)
}

const choose = (item: KDropdownItem) => {
    if (item.disabled) return
    emits('select', item)
    if (props.closeOnSelect) open.value = false
}

useClickOutside([rootRef], () => { open.value = false })

const onKey = (e: KeyboardEvent) => {
    if (!open.value) return
    if (e.key === 'Escape') open.value = false
}

document.addEventListener('keydown', onKey)
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.k-dropdown {
    position: relative;
    display: inline-flex;
}

.k-dropdown-trigger {
    display: inline-flex;
}

.k-dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    z-index: 300;
    min-width: 200px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    box-shadow: 0 12px 32px rgba(2, 6, 23, 0.14);
    padding: 6px;
    display: flex;
    flex-direction: column;
}

.k-dropdown-menu.align-end {
    right: 0;
}

.k-dropdown-menu.align-start {
    left: 0;
}

.k-dropdown-menu.dir-up {
    top: auto;
    bottom: calc(100% + 6px);
}

.k-dropdown-item {
    display: flex;
    align-items: center;
    gap: 9px;
    border: none;
    background: transparent;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 500;
    color: var(--k-text-primary, #1e293b);
    text-align: right;
    transition: background 0.1s ease;
}

.k-dropdown-item:hover:not(.is-disabled) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-dropdown-item.is-danger {
    color: var(--k-error, #dc2626);
}

.k-dropdown-item.is-danger:hover {
    background: color-mix(in srgb, var(--k-error, #dc2626) 10%, transparent);
}

.k-dropdown-item.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-dropdown-item-icon .icon {
    width: 15px;
    height: 15px;
}

.k-dropdown-item-label {
    flex: 1;
}

.k-dropdown-item-shortcut {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-dropdown-separator {
    height: 1px;
    background: var(--k-border, #e2e8f0);
    margin: 5px 8px;
}

/* Transition */
.k-dropdown-enter-active,
.k-dropdown-leave-active {
    transition: opacity 0.14s ease, transform 0.14s ease;
}

.k-dropdown-enter-from,
.k-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
