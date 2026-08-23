<!-- components/KContextMenu.vue -->
<!--
    KContextMenu — right-click menu around any trigger:

      <KContextMenu :items="items" @select="onSelect">
        <div class="k-target">کلیک راست کنید</div>
      </KContextMenu>

    item: { id, label, icon?, danger?, disabled?, divider? }
-->
<template>
    <div class="k-cm">
        <div @contextmenu.prevent="openMenu">
            <slot />
        </div>

        <Teleport to="body">
            <Transition name="k-pop">
                <div
                    v-if="open"
                    class="k-ui k-cm-menu"
                    :data-theme="theme"
                    :style="{ top: y + 'px', left: x + 'px' }"
                    @contextmenu.prevent
                >
                    <template v-for="(item, i) in items" :key="item.id">
                        <div v-if="item.divider" class="k-cm-divider" />
                        <button
                            v-else
                            type="button"
                            class="k-cm-item"
                            :class="{ 'is-danger': item.danger }"
                            :disabled="item.disabled"
                            @click="select(item)"
                        >
                            <component :is="item.icon" v-if="item.icon" :size="14" class="k-cm-item-icon" />
                            <span>{{ item.label }}</span>
                        </button>
                    </template>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useKitTheme } from '../composables/useKitTheme'

export interface KContextMenuItem {
    id?: string
    label?: string
    icon?: any
    danger?: boolean
    disabled?: boolean
    /** renders a divider instead of a clickable item */
    divider?: boolean
}

const props = withDefaults(defineProps<{
    items?: KContextMenuItem[]
}>(), {
    items: () => []
})

const emit = defineEmits<{
    (e: 'select', id: string): void
    (e: 'open'): void
    (e: 'close'): void
}>()

const theme = useKitTheme()
const open = ref(false)
const x = ref(0)
const y = ref(0)

const openMenu = (e: MouseEvent) => {
    open.value = false
    nextTick(() => {
        x.value = e.clientX
        y.value = e.clientY
        open.value = true
        emit('open')
        // clamp to viewport after render
        nextTick(() => {
            const el = document.querySelector('.k-cm-menu') as HTMLElement | null
            if (!el) return
            const { innerWidth, innerHeight } = window
            const rect = el.getBoundingClientRect()
            if (rect.right > innerWidth) x.value = Math.max(4, innerWidth - rect.width - 4)
            if (rect.bottom > innerHeight) y.value = Math.max(4, innerHeight - rect.height - 4)
        })
    })
}

const select = (item: KContextMenuItem) => {
    if (item.disabled || item.divider || !item.id) return
    open.value = false
    emit('select', item.id)
}

const onGlobal = (e: MouseEvent) => {
    const menu = document.querySelector('.k-cm-menu') as HTMLElement | null
    if (menu && !menu.contains(e.target as Node)) open.value = false
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false
}

onMounted(() => {
    document.addEventListener('mousedown', onGlobal)
    document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
    document.removeEventListener('mousedown', onGlobal)
    document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.k-cm {
    display: inline-block;
}

.k-cm-menu {
    position: fixed;
    z-index: 20000;
    min-width: 170px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
    padding: 4px;
    direction: rtl;
}

.k-cm-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 10px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--k-text-primary, #1e293b);
    font-size: 0.74rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    text-align: start;
    transition: background 0.1s ease;
}

.k-cm-item:hover:not(:disabled) {
    background: var(--k-primary-light, #e3f8ec);
}

.k-cm-item.is-danger { color: var(--k-error, #ef4444); }
.k-cm-item.is-danger:hover:not(:disabled) { background: var(--k-error-light, #fee2e2); }
.k-cm-item:disabled { opacity: 0.45; cursor: not-allowed; }

.k-cm-item-icon {
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-cm-item.is-danger .k-cm-item-icon { color: var(--k-error, #ef4444); }

.k-cm-divider {
    height: 1px;
    margin: 4px 8px;
    background: var(--k-border, #e2e8f0);
}

/* pop transition */
.k-pop-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.k-pop-leave-active { transition: opacity 0.1s ease; }
.k-pop-enter-from { opacity: 0; transform: scale(0.95); }
.k-pop-leave-to { opacity: 0; }
</style>
