// composables/usePwaUpdate.ts
// Detects when a new service worker (and therefore a new app version) is
// waiting to activate, and applies it with a skip-waiting + reload.

import { ref, onMounted, onUnmounted } from 'vue'

export function usePwaUpdate() {
    const updateAvailable = ref(false)
    const checking = ref(false)
    let registration: ServiceWorkerRegistration | null = null

    /** register a controller-change handler so updates apply on reload */
    const onControllerChange = () => {
        if (navigator.serviceWorker?.controller) {
            window.location.reload()
        }
    }

    const onUpdateFound = () => {
        const sw = registration?.installing
        if (!sw) return
        sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker?.controller) {
                // new version installed but the old one is still controlling the page
                updateAvailable.value = true
            }
        })
    }

    /** start watching the active service worker registration */
    const watch = async () => {
        if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
        checking.value = true
        try {
            registration = (await navigator.serviceWorker.getRegistration()) ?? null
            if (registration) {
                registration.addEventListener('updatefound', onUpdateFound)
                // if it's already waiting, surface it right away
                if (registration.waiting && navigator.serviceWorker.controller) {
                    updateAvailable.value = true
                }
            }
        } finally {
            checking.value = false
        }
    }

    /** tell the waiting worker to activate, then reload */
    const applyUpdate = async () => {
        const sw = registration?.waiting
        if (!sw) {
            window.location.reload()
            return
        }
        sw.postMessage?.({ type: 'SKIP_WAITING' })
        updateAvailable.value = false
        // fallback if the controller doesn't change
        setTimeout(() => window.location.reload(), 1200)
    }

    onMounted(() => {
        watch()
        navigator.serviceWorker?.addEventListener('controllerchange', onControllerChange)
    })

    onUnmounted(() => {
        registration?.removeEventListener('updatefound', onUpdateFound)
        navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange)
    })

    return { updateAvailable, checking, watch, applyUpdate }
}
