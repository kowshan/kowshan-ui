// composables/usePwaInstall.ts
// PWA install-prompt handling: captures the browser's `beforeinstallprompt`
// event, exposes whether the app is installable, and lets you trigger the
// native install dialog on demand.

import { ref, onMounted, onUnmounted } from 'vue'

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function usePwaInstall() {
    const canInstall = ref(false)
    const installed = ref(false)
    let deferred: BeforeInstallPromptEvent | null = null

    const onBeforeInstall = (e: Event) => {
        e.preventDefault()
        deferred = e as BeforeInstallPromptEvent
        canInstall.value = true
    }

    const onAppInstalled = () => {
        installed.value = true
        canInstall.value = false
        deferred = null
    }

    /** show the native install dialog; resolves true when the user installs */
    const install = async (): Promise<boolean> => {
        if (!deferred) return false
        const evt = deferred
        deferred = null
        canInstall.value = false
        await evt.prompt()
        const choice = await evt.userChoice
        return choice.outcome === 'accepted'
    }

    onMounted(() => {
        window.addEventListener('beforeinstallprompt', onBeforeInstall)
        window.addEventListener('appinstalled', onAppInstalled)
    })

    onUnmounted(() => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall)
        window.removeEventListener('appinstalled', onAppInstalled)
    })

    return { canInstall, installed, install }
}
