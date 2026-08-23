// stores/modalStore.ts
/**
 * Global id-based overlay store — modals AND side drawers.
 *
 * Overlays are opened/closed by id from anywhere — no local `visible` state:
 *
 *   const modal = useModalStore()
 *   modal.openModal('confirm-delete')
 *   modal.openDrawer('lead-detail')
 *
 *   <!-- anywhere in the tree -->
 *   <KModal id="confirm-delete"> ... </KModal>
 *   <KDrawer id="lead-detail">  ... </KDrawer>
 */
import { reactive } from 'vue'

export interface ConfirmConfig {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    /** colors the confirm button */
    variant?: 'danger' | 'primary' | 'warning'
}

const state = reactive<{ openIds: string[]; openDrawers: string[]; openSheets: string[] }>({
    openIds: [],
    openDrawers: [],
    openSheets: []
})

/* ---- promise-based confirm dialog ---- */
const confirmState = reactive<{
    visible: boolean
    config: ConfirmConfig | null
    resolve: ((v: boolean) => void) | null
}>({
    visible: false,
    config: null,
    resolve: null
})

export function useModalStore() {
    /* ---- modals ---- */
    const isOpen = (id: string) => state.openIds.includes(id)

    const openModal = (id: string) => {
        if (!id) return
        if (!state.openIds.includes(id)) state.openIds.push(id)
    }

    const closeModal = (id: string) => {
        state.openIds = state.openIds.filter(x => x !== id)
    }

    const toggleModal = (id: string) => (isOpen(id) ? closeModal(id) : openModal(id))

    const closeAll = () => {
        state.openIds = []
        state.openDrawers = []
        state.openSheets = []
    }

    /** the most recently opened modal id (for stacking / ESC handling) */
    const topModal = () => state.openIds[state.openIds.length - 1] ?? null

    /* ---- drawers ---- */
    const isDrawerOpen = (id: string) => state.openDrawers.includes(id)

    const openDrawer = (id: string) => {
        if (!id) return
        if (!state.openDrawers.includes(id)) state.openDrawers.push(id)
    }

    const closeDrawer = (id: string) => {
        state.openDrawers = state.openDrawers.filter(x => x !== id)
    }

    const toggleDrawer = (id: string) => (isDrawerOpen(id) ? closeDrawer(id) : openDrawer(id))

    const closeAllDrawers = () => { state.openDrawers = [] }

    /** the most recently opened drawer id (for ESC handling) */
    const topDrawer = () => state.openDrawers[state.openDrawers.length - 1] ?? null

    /* ---- confirm dialog ---- */
    /**
     * Promise-based confirm — resolves true/false:
     *
     *   const ok = await useModalStore().confirm({
     *     title: 'حذف سند',
     *     message: 'این عمل قابل بازگشت نیست',
     *     confirmText: 'حذف',
     *     variant: 'danger'
     *   })
     *   if (ok) deleteRecord(id)
     */
    const confirm = (config: ConfirmConfig = {}): Promise<boolean> => {
        confirmState.config = {
            title: 'تأیید عملیات',
            message: 'آیا از انجام این عملیات مطمئن هستید؟',
            confirmText: 'تأیید',
            cancelText: 'انصراف',
            variant: 'primary',
            ...config
        }
        confirmState.visible = true
        return new Promise<boolean>(resolve => {
            confirmState.resolve = resolve
        })
    }

    const resolveConfirm = (v: boolean) => {
        confirmState.visible = false
        confirmState.resolve?.(v)
        confirmState.resolve = null
    }

    /* ---- bottom sheets ---- */
    const isSheetOpen = (id: string) => state.openSheets.includes(id)

    const openSheet = (id: string) => {
        if (!id) return
        if (!state.openSheets.includes(id)) state.openSheets.push(id)
    }

    const closeSheet = (id: string) => {
        state.openSheets = state.openSheets.filter(x => x !== id)
    }

    const toggleSheet = (id: string) => (isSheetOpen(id) ? closeSheet(id) : openSheet(id))

    const closeAllSheets = () => { state.openSheets = [] }

    /** the most recently opened sheet id (for ESC handling) */
    const topSheet = () => state.openSheets[state.openSheets.length - 1] ?? null

    return {
        state,
        confirmState,
        confirm,
        resolveConfirm,
        isOpen,
        openModal,
        closeModal,
        toggleModal,
        closeAll,
        topModal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        closeAllDrawers,
        topDrawer,
        isSheetOpen,
        openSheet,
        closeSheet,
        toggleSheet,
        closeAllSheets,
        topSheet
    }
}
