// composables/useToast.ts
/**
 * Toast helpers on top of the global toast store — same shape as the app's
 * Pinia-backed composable, so `useToast.success('…')` works identically.
 *
 *   useToast.success('ذخیره شد')
 *   useToast.error({ title: 'ثبت‌نام نامعتبر', message: ['شماره تماس معتبر نیست', 'کد پستی الزامی است'] })
 *   useToast.warning({ message: 'اعتبار سند رو به اتمام است', timeout: 0, buttons: [{ label: 'تمدید', onClick }] })
 *
 * Laravel validation summary:
 *   useToast.showErrors({ phone: ['معتبر نیست'], postal: ['الزامی است'] }, 'ثبت‌نام نامعتبر')
 *
 * A single message renders as a normal toast; several render as a titled list.
 */
import { useToastStore } from '../stores/toastStore'
import type { ToastOptions, ToastType } from '../stores/toastStore'

type ToastInput = string | (ToastOptions & { message?: string | string[] })

const store = useToastStore()

const show = (input: ToastInput, type?: ToastType): number => {
    if (typeof input === 'string') {
        return store.showToast({ message: input, type })
    }
    return store.showToast({ ...input, type: type ?? input.type ?? 'info' })
}

/** Laravel validation-summary helper — errors: Record<field, string[]> or a string[] */
const showErrors = (errors: Record<string, string[]> | string[] | null | undefined, title?: string): number => {
    if (!errors) return store.showToast({ type: 'error', title: title || 'خطا', message: 'خطای غیرمنتظره' })
    const list = Array.isArray(errors) ? errors : Object.values(errors).flatMap(v => v)
    if (list.length > 1) {
        return store.showToast({ type: 'error', title: title || 'اطلاعات را بررسی کنید', message: list })
    }
    return store.showToast({ type: 'error', title, message: list[0] || 'خطای غیرمنتظره' })
}

export const useToast = {
    success(input: ToastInput) { return show(input, 'success') },
    error(input: ToastInput) { return show(input, 'error') },
    warning(input: ToastInput) { return show(input, 'warning') },
    info(input: ToastInput) { return show(input, 'info') },
    show,
    showErrors,
    removeToast: store.removeToast,
    clearToasts: store.clearToasts
}
