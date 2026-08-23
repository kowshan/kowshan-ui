// stores/toastStore.ts
/**
 * Global toast store — a singleton reactive list rendered by KToastHost
 * (mount once, e.g. <KGlobalLayer /> in the app layout).
 *
 * API mirrors the app's Pinia toast store so switching between them is a
 * one-line change: showToast / addToast / removeToast / clearToasts / hasToasts.
 *
 * Laravel-style: `message` can be a single string OR an array (multi-message
 * toast with a title). `errors` is accepted too and merges into the list.
 */
import { computed, reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastButton {
    label: string
    onClick: () => void
    /** 'primary' | 'ghost' | 'danger' */
    variant?: 'primary' | 'ghost' | 'danger'
}

export interface ToastOptions {
    type?: ToastType
    /** single message or a list (multi-message toast) */
    message?: string | string[]
    /** optional title — shown above multi-message lists */
    title?: string
    /** secondary text under the message */
    description?: string
    /** validation error list; merges into the message list */
    errors?: string[]
    /** auto-dismiss after this many ms; 0 = sticky */
    duration?: number
    /** alias of duration (used by the app's Laravel helpers) */
    timeout?: number
    closable?: boolean
    buttons?: ToastButton[]
    icon?: any
    /** per-toast corner override: 'top' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' */
    position?: string
}

export interface ToastItem {
    id: number
    type: ToastType
    message: string[]
    title?: string
    description?: string
    duration: number
    closable: boolean
    buttons: ToastButton[]
    icon?: any
    position?: string
    createdAt: number
}

let nextId = 1

const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] })

export function useToastStore() {
    const hasToasts = computed(() => state.toasts.length > 0)

    const addToast = (toastData: ToastOptions): number => {
        const id = nextId++
        const messages = Array.isArray(toastData.message)
            ? toastData.message
            : (toastData.message ? [toastData.message] : [])
        const errors = toastData.errors ?? []
        const item: ToastItem = {
            id,
            type: toastData.type ?? 'info',
            message: [...messages, ...errors],
            title: toastData.title,
            description: toastData.description,
            duration: toastData.timeout ?? toastData.duration ?? 4000,
            closable: toastData.closable ?? true,
            buttons: toastData.buttons ?? [],
            icon: toastData.icon,
            position: toastData.position,
            createdAt: Date.now()
        }
        state.toasts.push(item)
        return id
    }

    const showToast = (toastData: ToastOptions): number => addToast(toastData)

    const removeToast = (id: number) => {
        const i = state.toasts.findIndex(t => t.id === id)
        if (i >= 0) state.toasts.splice(i, 1)
    }

    const clearToasts = () => { state.toasts = [] }

    return {
        state,
        toasts: state.toasts,
        hasToasts,
        addToast,
        showToast,
        removeToast,
        clearToasts
    }
}
