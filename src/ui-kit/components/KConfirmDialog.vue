<!-- components/KConfirmDialog.vue -->
<!--
    KConfirmDialog — promise-based confirm (mount once, usually in KGlobalLayer):

      const ok = await useModalStore().confirm({
        title: 'حذف مشتری',
        message: 'این عمل قابل بازگشت نیست.',
        confirmText: 'حذف', variant: 'danger'
      })

    <KConfirmDialog />
-->
<template>
    <Teleport to="body">
        <Transition name="k-modal-fade">
            <div
                v-if="visible"
                class="k-ui k-confirm-overlay"
                :data-theme="theme"
                @click.self="cancel"
            >
                <Transition name="k-modal-pop" appear>
                    <div
                        ref="dialogEl"
                        class="k-confirm"
                        role="alertdialog"
                        aria-modal="true"
                        :aria-label="config?.title"
                    >
                        <span class="k-confirm-icon" :class="`is-${config?.variant || 'primary'}`">
                            <AlertTriangle v-if="(config?.variant || 'primary') !== 'primary'" :size="22" />
                            <HelpCircle v-else :size="22" />
                        </span>

                        <div class="k-confirm-title">{{ config?.title }}</div>
                        <p class="k-confirm-message">{{ config?.message }}</p>

                        <div class="k-confirm-actions">
                            <button type="button" class="k-confirm-btn is-cancel" @click="cancel">
                                {{ config?.cancelText }}
                            </button>
                            <button
                                ref="confirmBtn"
                                type="button"
                                class="k-confirm-btn"
                                :class="`is-${config?.variant || 'primary'}`"
                                @click="ok"
                            >
                                {{ config?.confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { AlertTriangle, HelpCircle } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useModalStore } from '../stores/modalStore'
import { useFocusTrap } from '../composables/useFocusTrap'

const theme = useKitTheme()
const modal = useModalStore()

const dialogEl = ref<HTMLElement | null>(null)
const confirmBtn = ref<HTMLButtonElement | null>(null)

const visible = computed(() => modal.confirmState.visible)
const config = computed(() => modal.confirmState.config)

useFocusTrap(dialogEl, () => visible.value)

watch(visible, (v) => {
    if (v) {
        nextTick(() => confirmBtn.value?.focus())
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

const ok = () => modal.resolveConfirm(true)
const cancel = () => modal.resolveConfirm(false)

const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !visible.value) return
    cancel()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.k-confirm-overlay {
    position: fixed;
    inset: 0;
    z-index: 10001;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    direction: rtl;
}

.k-confirm {
    width: 100%;
    max-width: 360px;
    background: var(--k-bg, #fff);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
    padding: 24px 22px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
}

.k-confirm-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    margin-bottom: 4px;
}

.k-confirm-icon.is-primary { background: var(--k-primary-light, #e3f8ec); color: var(--k-primary, #1db954); }
.k-confirm-icon.is-danger { background: var(--k-error-light, #fee2e2); color: var(--k-error, #ef4444); }
.k-confirm-icon.is-warning { background: var(--k-warning-light, #fef3c7); color: var(--k-warning, #f59e0b); }

.k-confirm-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-confirm-message {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.8;
    color: var(--k-text-secondary, #64748b);
}

.k-confirm-actions {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 14px;
}

.k-confirm-btn {
    flex: 1;
    height: 40px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    color: var(--k-text-primary, #1e293b);
    font-size: 0.78rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-confirm-btn.is-cancel:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-confirm-btn.is-primary { background: var(--k-primary, #1db954); border-color: transparent; color: #fff; }
.k-confirm-btn.is-danger { background: var(--k-error, #ef4444); border-color: transparent; color: #fff; }
.k-confirm-btn.is-warning { background: var(--k-warning, #f59e0b); border-color: transparent; color: #fff; }

.k-confirm-btn:not(.is-cancel):hover { filter: brightness(1.07); }
</style>
