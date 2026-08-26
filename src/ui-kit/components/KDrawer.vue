<!-- components/KDrawer.vue -->
<!--
    KDrawer — side slide-over panel (right side in RTL), store-driven by id:

      const modal = useModalStore()
      modal.openDrawer('lead-detail')

    Put a KDrawer with that id anywhere in the tree:

      <KDrawer id="lead-detail" title="جزئیات سرنخ">
        ...content...
      </KDrawer>

    Also supports legacy local mode via v-model:visible when `id` is omitted.
-->
<template>
    <Teleport to="body">
        <Transition name="k-drawer-fade">
            <div
                v-if="isVisible"
                class="k-ui k-drawer-overlay"
                :data-theme="theme"
                @click.self="onOverlayClick"
            >
                <Transition name="k-drawer-slide" appear>
                    <aside
                        class="k-drawer"
                        :class="[`k-drawer-${size}`, { 'is-rtl': direction === 'rtl' }]"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title || 'drawer'"
                    >
                        <!-- Header -->
                        <div class="k-drawer-header">
                            <slot name="header">
                                <span class="k-drawer-title">{{ title }}</span>
                            </slot>
                            <button
                                v-if="closable"
                                type="button"
                                class="k-drawer-close"
                                aria-label="بستن"
                                @click="close"
                            >
                                <X class="icon" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="k-drawer-body">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer" class="k-drawer-footer">
                            <slot name="footer" />
                        </div>
                    </aside>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useModalStore } from '../stores/modalStore'

const theme = useKitTheme()
const overlay = useModalStore()

const props = withDefaults(defineProps<{
    /** store-driven id — open/close with modalStore.openDrawer(id) / closeDrawer(id) */
    id?: string
    /** legacy local visibility (used when `id` is not provided) */
    visible?: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg'
    /** slide in from this side ('rtl' = the start side of an RTL page) */
    direction?: 'rtl' | 'ltr'
    closable?: boolean
    closeOnOverlay?: boolean
    /** prevent body scroll while open */
    lockScroll?: boolean
}>(), {
    visible: false,
    size: 'md',
    direction: 'rtl',
    closable: true,
    closeOnOverlay: true,
    lockScroll: true
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'open': []
    'close': []
}>()

const isVisible = computed(() =>
    props.id ? overlay.isDrawerOpen(props.id) : props.visible
)

const close = () => {
    if (props.id) overlay.closeDrawer(props.id)
    emits('update:visible', false)
    emits('close')
}

const onOverlayClick = () => {
    if (props.closeOnOverlay) close()
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !isVisible.value) return
    // only the top-most open store drawer closes on ESC
    if (!props.id || overlay.topDrawer() === props.id) close()
}

watch(() => isVisible.value, (v) => {
    if (props.lockScroll) {
        document.body.style.overflow = v ? 'hidden' : ''
    }
    if (v) emits('open')
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.k-drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    direction: rtl;
}

.k-drawer {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: var(--k-bg, #ffffff);
    box-shadow: -12px 0 40px rgba(15, 23, 42, 0.2);
    max-width: 100vw;
}

/* RTL pages: slide in from the right edge (start side) */
.k-drawer.is-rtl {
    right: 0;
    border-radius: 16px 0 0 16px;
}

.k-drawer:not(.is-rtl) {
    left: 0;
    border-radius: 0 16px 16px 0;
}

.k-drawer-sm { width: min(360px, 100vw); }
.k-drawer-md { width: min(440px, 100vw); }
.k-drawer-lg { width: min(560px, 100vw); }

.k-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}

.k-drawer-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-drawer-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 8px;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-drawer-close:hover {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-drawer-close .icon {
    width: 16px;
    height: 16px;
}

.k-drawer-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

.k-drawer-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    flex-shrink: 0;
}

/* Transitions */
.k-drawer-fade-enter-active,
.k-drawer-fade-leave-active {
    transition: opacity 0.2s ease;
}

.k-drawer-fade-enter-from,
.k-drawer-fade-leave-to {
    opacity: 0;
}

.k-drawer-slide-enter-active,
.k-drawer-slide-leave-active {
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.k-drawer.is-rtl.k-drawer-slide-enter-from,
.k-drawer.is-rtl.k-drawer-slide-leave-to {
    transform: translateX(100%);
}

.k-drawer:not(.is-rtl).k-drawer-slide-enter-from,
.k-drawer:not(.is-rtl).k-drawer-slide-leave-to {
    transform: translateX(-100%);
}
</style>
