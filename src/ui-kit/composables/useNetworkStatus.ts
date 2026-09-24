// composables/useNetworkStatus.ts
// Reactive online/offline detection for PWA-style apps.

import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
    // Always start `true` so the server and the *first* client render agree —
    // reading navigator.onLine during setup would make an offline client
    // hydrate different markup than the server sent.
    const isOnline = ref(true)

    const goOnline = () => { isOnline.value = true }
    const goOffline = () => { isOnline.value = false }

    onMounted(() => {
        isOnline.value = navigator.onLine
        window.addEventListener('online', goOnline)
        window.addEventListener('offline', goOffline)
    })

    onUnmounted(() => {
        window.removeEventListener('online', goOnline)
        window.removeEventListener('offline', goOffline)
    })

    return { isOnline }
}
