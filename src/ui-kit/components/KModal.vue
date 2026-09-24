<!-- components/KModal.vue -->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="k-modal-fade">
            <div
                v-if="isVisible"
                class="k-ui k-modal-overlay"
                :class="[`k-modal-placement-${placement}`]"
                :data-theme="theme"
                @click.self="onOverlayClick"
            >
                <Transition name="k-modal-pop" appear>
                    <div
                        ref="modalEl"
                        class="k-modal"
                        :class="[`k-modal-${size}`]"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title || 'dialog'"
                        :style="modalStyle"
                        tabindex="-1"
                    >
                        <!-- Header -->
                        <div v-if="title || $slots.header" class="k-modal-header">
                            <slot name="header">
                                <span class="k-modal-title">{{ title }}</span>
                            </slot>
                            <button
                                v-if="closable"
                                type="button"
                                class="k-modal-close"
                                aria-label="بستن"
                                @click="close"
                            >
                                <X class="icon" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="k-modal-body">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer" class="k-modal-footer">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useKFocusTrap } from '../composables/useKFocusTrap'
import { useModalStore } from '../stores/modalStore'

const theme = useKitTheme()
const modal = useModalStore()

const props = withDefaults(defineProps<{
    /** store-driven id — open/close with modalStore.openModal(id) / closeModal(id) */
    id?: string
    /** legacy local visibility (used when `id` is not provided) */
    visible?: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    width?: string
    height?: string
    /** 'center' (default) | 'left' | 'right' — for side-by-side stacks */
    placement?: 'center' | 'left' | 'right'
    closable?: boolean
    closeOnOverlay?: boolean
    /** prevent body scroll while open */
    lockScroll?: boolean
}>(), {
    visible: false,
    size: 'md',
    placement: 'center',
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
    props.id ? modal.isOpen(props.id) : props.visible
)

/* Focus management: move focus into the dialog on open, keep Tab inside it,
   and hand focus back to whatever was focused before (the trigger) on close.
   Without it, dismissing a modal left focus on a node that had just left the
   DOM, and the dialog itself was never announced to screen readers. */
const modalEl = ref<HTMLElement | null>(null)
useKFocusTrap(modalEl, () => isVisible.value)

const modalStyle = computed(() => ({
    // an explicit `width` overrides the size-class max-width so
    // 650px / 48% side-by-side widths actually take effect
    width: props.width || undefined,
    maxWidth: props.width || undefined,
    height: props.height || undefined
}))

/* Stacked scroll lock: only unlock when every kit modal is closed */
let lockCount = 0
const setBodyLock = (lock: boolean) => {
    lockCount = Math.max(0, lockCount + (lock ? 1 : -1))
    document.body.style.overflow = lockCount > 0 ? 'hidden' : ''
}

const close = () => {
    if (props.id) modal.closeModal(props.id)
    emits('update:visible', false)
    emits('close')
}

const onOverlayClick = () => {
    if (props.closeOnOverlay) close()
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !isVisible.value) return
    // only the top-most open store modal closes on ESC
    if (!props.id || modal.topModal() === props.id) close()
}

watch(() => isVisible.value, (v) => {
    if (props.lockScroll) {
        setBodyLock(v)
    }
    if (v) emits('open')
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    if (props.lockScroll) setBodyLock(false)
})
</script>

<style scoped>
.k-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    direction: rtl;
}

.k-modal {
    background: var(--k-bg, #ffffff);
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 60px);
    width: 100%;
    transition: width 0.3s ease;
}

/* tabindex="-1" makes the dialog programmatically focusable; only show a ring
   for keyboard focus so a click inside the body doesn't paint one */
.k-modal:focus {
    outline: none;
}

.k-modal:focus-visible {
    outline: 2px solid var(--k-border-focus);
    outline-offset: 2px;
}

.k-modal-sm { max-width: 380px; }
.k-modal-md { max-width: 520px; }
.k-modal-lg { max-width: 720px; }
.k-modal-xl { max-width: 960px; }

/* Side placement — slides to the left/right edge instead of centered.
   The overlay is `direction: rtl`, so flex-start = RIGHT edge and
   flex-end = LEFT edge; placement names stay visual (left = left side). */
.k-modal-placement-left {
    justify-content: flex-end;
}

.k-modal-placement-right {
    justify-content: flex-start;
}

.k-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}

.k-modal-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
}

.k-modal-close:hover {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-modal-close .icon {
    width: 15px;
    height: 15px;
}

.k-modal-body {
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
}

.k-modal-footer {
    padding: 12px 14px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
}

/* Transitions */
.k-modal-fade-enter-active,
.k-modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.k-modal-fade-enter-from,
.k-modal-fade-leave-to {
    opacity: 0;
}

.k-modal-pop-enter-active {
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.k-modal-pop-leave-active {
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.k-modal-pop-enter-from,
.k-modal-pop-leave-to {
    transform: translateY(12px) scale(0.97);
    opacity: 0;
}
</style>
