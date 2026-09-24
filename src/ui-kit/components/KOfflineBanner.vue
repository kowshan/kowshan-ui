<!-- components/KOfflineBanner.vue -->
<!--
    KOfflineBanner — fixed top banner shown while the device is offline
    (driven by useNetworkStatus). `show` overrides for preview/demo:

      <KOfflineBanner />                    <!-- auto: only when offline -->
      <KOfflineBanner :show="true" />       <!-- forced (demo/testing) -->
-->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="k-offline-drop">
            <div
                v-if="isOffline"
                class="k-ui k-offline-banner"
                :data-theme="theme"
                role="status"
            >
                <WifiOff :size="15" class="k-offline-icon" />
                <span class="k-offline-text">
                    <slot>شما آفلاین هستید — تغییرات به‌صورت محلی ذخیره می‌شوند و پس از اتصال همگام‌سازی می‌شوند.</slot>
                </span>
                <button v-if="closable" type="button" class="k-offline-close" aria-label="بستن" @click="dismiss">
                    <X :size="14" />
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { WifiOff, X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useNetworkStatus } from '../composables/useNetworkStatus'

const props = withDefaults(defineProps<{
    /** force-show regardless of network state (for demos/previews) */
    show?: boolean
    closable?: boolean
}>(), {
    show: false,
    closable: true
})

const emit = defineEmits<{ close: [] }>()

const theme = useKitTheme()
const network = useNetworkStatus()
const dismissed = ref(false)

const isOffline = computed(() =>
    props.show ? true : network.isOnline.value === false && !dismissed.value
)

const dismiss = () => {
    dismissed.value = true
    emit('close')
}
</script>

<style scoped>
.k-offline-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: color-mix(in srgb, var(--k-warning, #f59e0b) 92%, var(--k-bg));
    color: #fff;
    font-size: 0.78rem;
    font-weight: 600;
    direction: rtl;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.18);
}

.k-offline-icon {
    flex-shrink: 0;
}

.k-offline-text {
    flex: 1;
}

.k-offline-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
}

.k-offline-close:hover {
    background: rgba(255, 255, 255, 0.32);
}

.k-offline-drop-enter-active,
.k-offline-drop-leave-active {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.k-offline-drop-enter-from,
.k-offline-drop-leave-to {
    transform: translateY(-100%);
}
</style>
