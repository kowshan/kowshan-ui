<!-- components/KBottomSheet.vue -->
<!--
    KBottomSheet — mobile-style sheet that slides up from the bottom edge.
    Store-driven by id (same pattern as KModal / KDrawer):

      const overlay = useModalStore()
      overlay.openSheet('filter-sheet')

      <KBottomSheet id="filter-sheet" title="فیلترها">
        ...
      </KBottomSheet>

    Features: drag handle (drag down or tap to dismiss), snap heights
    (40% / 70% / 92%), backdrop click, ESC, teleported + theme-aware.
-->
<template>
    <Teleport to="body">
        <Transition name="k-sheet-fade">
            <div
                v-if="isVisible"
                class="k-ui k-sheet-overlay"
                :data-theme="theme"
                @click.self="onOverlayClick"
            >
                <Transition name="k-sheet-up" appear>
                    <section
                        ref="sheetRef"
                        class="k-sheet"
                        :class="{ 'is-dragging': dragging }"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title || 'bottom sheet'"
                        :style="sheetStyle"
                        @pointerdown="onPointerDown"
                    >
                        <!-- Drag handle -->
                        <div class="k-sheet-handle-area">
                            <div class="k-sheet-handle"></div>
                        </div>

                        <!-- Header -->
                        <div v-if="title || $slots.header" class="k-sheet-header">
                            <slot name="header">
                                <span class="k-sheet-title">{{ title }}</span>
                            </slot>
                            <button
                                v-if="closable"
                                type="button"
                                class="k-sheet-close"
                                aria-label="بستن"
                                @click="close"
                            >
                                <X :size="15" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="k-sheet-body">
                            <slot />
                        </div>
                    </section>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useModalStore } from '../stores/modalStore'

const theme = useKitTheme()
const overlay = useModalStore()

const props = withDefaults(defineProps<{
    /** store-driven id — open/close with modalStore.openSheet(id) / closeSheet(id) */
    id?: string
    /** legacy local visibility (used when `id` is not provided) */
    visible?: boolean
    title?: string
    /** snap targets as % of viewport height */
    snaps?: number[]
    defaultSnap?: number
    closable?: boolean
    closeOnOverlay?: boolean
    lockScroll?: boolean
}>(), {
    visible: false,
    snaps: () => [40, 70, 92],
    defaultSnap: 70,
    closable: true,
    closeOnOverlay: true,
    lockScroll: true
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'update:snap': [value: number]
    'open': []
    'close': []
}>()

const sheetRef = ref<HTMLElement | null>(null)

const isVisible = computed(() =>
    props.id ? overlay.isSheetOpen(props.id) : props.visible
)

/* ---- drag logic ---- */
const dragStartY = ref(0)
const currentOffset = ref(0)
const dragging = ref(false)
const snapIndex = ref(Math.max(0, props.snaps.indexOf(props.defaultSnap)))

const snapPct = computed(() => props.snaps[snapIndex.value] ?? props.defaultSnap)

const sheetStyle = computed(() => {
    const base = { height: `${snapPct.value}%` }
    if (dragging.value && currentOffset.value > 0) {
        return { ...base, transform: `translateY(${currentOffset.value}px)`, transition: 'none' }
    }
    return base
})

const onPointerDown = (e: PointerEvent) => {
    // only start a drag from the handle area
    const handle = (e.target as HTMLElement).closest('.k-sheet-handle-area')
    if (!handle) return
    dragging.value = true
    dragStartY.value = e.clientY
    currentOffset.value = 0
    try {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {
        /* synthetic/unknown pointer ids are safe to ignore */
    }
}

const onPointerMove = (e: PointerEvent) => {
    if (!dragging.value) return
    const dy = e.clientY - dragStartY.value
    currentOffset.value = Math.max(0, dy)
}

const onPointerUp = () => {
    if (!dragging.value) return
    dragging.value = false
    const vh = window.innerHeight
    const pct = (currentOffset.value / vh) * 100
    if (pct > 18) {
        // dragged far enough → dismiss or step down a snap
        if (snapIndex.value === 0 || pct > 45) {
            close()
        } else {
            snapIndex.value -= 1
            emits('update:snap', props.snaps[snapIndex.value])
        }
    }
    currentOffset.value = 0
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !isVisible.value) return
    if (!props.id || overlay.topSheet() === props.id) close()
}

const close = () => {
    if (props.id) overlay.closeSheet(props.id)
    emits('update:visible', false)
    emits('close')
}

const onOverlayClick = () => {
    if (props.closeOnOverlay) close()
}

watch(() => isVisible.value, (v) => {
    if (props.lockScroll) {
        document.body.style.overflow = v ? 'hidden' : ''
    }
    if (v) {
        snapIndex.value = Math.max(0, props.snaps.indexOf(props.defaultSnap))
        emits('open')
    }
})

onMounted(() => {
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.k-sheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 10003;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    direction: rtl;
}

.k-sheet {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 560px;
    background: var(--k-bg, #ffffff);
    border-radius: 18px 18px 0 0;
    box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.22);
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    touch-action: none;
}

.k-sheet.is-dragging {
    transition: none;
}

.k-sheet-handle-area {
    display: flex;
    justify-content: center;
    padding: 10px 0 6px;
    cursor: grab;
    flex-shrink: 0;
}

.k-sheet-handle-area:active {
    cursor: grabbing;
}

.k-sheet-handle {
    width: 44px;
    height: 5px;
    border-radius: 999px;
    background: var(--k-text-muted);
    opacity: 0.45;
}

.k-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 18px 12px;
    flex-shrink: 0;
}

.k-sheet-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-sheet-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-sheet-close:hover {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-sheet-body {
    padding: 0 18px 22px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

/* Transitions */
.k-sheet-fade-enter-active,
.k-sheet-fade-leave-active {
    transition: opacity 0.2s ease;
}

.k-sheet-fade-enter-from,
.k-sheet-fade-leave-to {
    opacity: 0;
}

.k-sheet-up-enter-active,
.k-sheet-up-leave-active {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.k-sheet-up-enter-from,
.k-sheet-up-leave-to {
    transform: translateY(100%);
}
</style>
