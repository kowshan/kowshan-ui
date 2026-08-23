<!-- components/KModal.vue -->
<template>
    <Teleport to="body">
        <Transition name="k-modal-fade">
            <div
                v-if="isVisible"
                class="k-ui k-modal-overlay"
                :data-theme="theme"
                @click.self="onOverlayClick"
            >
                <Transition name="k-modal-pop" appear>
                    <div
                        class="k-modal"
                        :class="[`k-modal-${size}`]"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title || 'dialog'"
                        :style="width ? { width } : {}"
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
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
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
    closable?: boolean
    closeOnOverlay?: boolean
    /** prevent body scroll while open */
    lockScroll?: boolean
}>(), {
    visible: false,
    size: 'md',
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
.k-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    direction: rtl;
}

.k-modal {
    background: var(--k-bg, #ffffff);
    border-radius: 14px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 60px);
    width: 100%;
}

.k-modal-sm { max-width: 380px; }
.k-modal-md { max-width: 520px; }
.k-modal-lg { max-width: 720px; }
.k-modal-xl { max-width: 960px; }

.k-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}

.k-modal-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-modal-close {
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

.k-modal-close:hover {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-modal-close .icon {
    width: 16px;
    height: 16px;
}

.k-modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

.k-modal-footer {
    padding: 14px 20px;
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
