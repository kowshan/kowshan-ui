// composables/useNetworkStatus.ts
// Reactive online/offline detection for PWA-style apps.

import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
    const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

    const goOnline = () => { isOnline.value = true }
    const goOffline = () => { isOnline.value = false }

    onMounted(() => {
        window.addEventListener('online', goOnline)
        window.addEventListener('offline', goOffline)
    })

    onUnmounted(() => {
        window.removeEventListener('online', goOnline)
        window.removeEventListener('offline', goOffline)
    })

    return { isOnline }
}
