<!-- components/KUpdatePrompt.vue -->
<!--
    KUpdatePrompt — shows a banner when a new app version (service worker)
    is ready to activate, with an apply-and-reload action. `show` forces
    it for demos/previews.

      <KUpdatePrompt />
      <KUpdatePrompt :show="true" />      <!-- forced (demo/testing) -->
-->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="k-update-pop">
            <div
                v-if="visible"
                class="k-ui k-update-prompt"
                :data-theme="theme"
                role="status"
            >
                <RefreshCw :size="16" class="k-update-icon" />
                <div dir="ltr" class="k-update-copy">
                    <div class="k-update-title">نسخه جدید در دسترس است</div>
                    <div class="k-update-desc">برای اعمال تغییرات، برنامه را به‌روزرسانی کنید.</div>
                </div>
                <button type="button" class="k-update-now" @click="apply">
                    <RotateCcw :size="14" /> به‌روزرسانی
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RefreshCw, RotateCcw } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { usePwaUpdate } from '../composables/usePwaUpdate'

const props = withDefaults(defineProps<{
    /** force-show regardless of service-worker state (for demos/previews) */
    show?: boolean
}>(), {
    show: false
})

const theme = useKitTheme()
const update = usePwaUpdate()

const visible = computed(() => props.show || update.updateAvailable.value)

const apply = async () => {
    if (!props.show) {
        await update.applyUpdate()
        return
    }
    // forced demo mode — just pretend
    window.location.hash = '#updated'
    location.reload()
}
</script>

<style scoped>
.k-update-prompt {
    position: fixed;
    bottom: 16px;
    inset-inline-start: 16px;
    z-index: 99998;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 340px;
    padding: 12px 14px;
    background: var(--k-surface, #ffffff);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 35%, var(--k-border, #e2e8f0));
    border-radius: 14px;
    box-shadow: var(--k-shadow-lg, 0 12px 34px rgba(15, 23, 42, 0.16));
    direction: rtl;
}

.k-update-icon {
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.k-update-copy {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-update-title {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-update-desc {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-update-now {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: none;
    border-radius: 9px;
    padding: 7px 14px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: filter 0.15s ease;
}

.k-update-now:hover {
    filter: brightness(1.08);
}

.k-update-pop-enter-active,
.k-update-pop-leave-active {
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.k-update-pop-enter-from,
.k-update-pop-leave-to {
    transform: translateY(14px);
    opacity: 0;
}
</style>
