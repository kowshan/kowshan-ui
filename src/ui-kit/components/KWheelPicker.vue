<!-- components/KWheelPicker.vue -->
<template>
    <div
        class="k-wheel"
        :class="{ 'is-disabled': disabled }"
        :style="{ '--k-wheel-pad': `${((rows - 1) / 2) * itemHeight}px` }"
    >
        <div
            class="k-wheel-track"
            :style="{ height: viewHeight + 'px' }"
        >
            <div
                v-for="(col, ci) in columns"
                :key="col.key"
                ref="scrollers"
                class="k-wheel-col"
                :style="{ height: viewHeight + 'px' }"
                @pointerdown="onPointerDown($event, ci)"
                @pointermove="onPointerMove($event, ci)"
                @pointerup="onPointerUp($event, ci)"
                @pointercancel="onPointerUp($event, ci)"
                @scroll="onScroll(ci)"
                @scrollend="onScrollEnd(ci)"
            >
                <div class="k-wheel-col-pad"></div>
                <div
                    v-for="(v, vi) in col.values"
                    :key="vi"
                    class="k-wheel-item"
                    :class="{
                        'is-selected': pos(ci, vi) === 0,
                        'is-near': pos(ci, vi) === 1,
                        'is-dim': pos(ci, vi) >= 2
                    }"
                    :style="{ height: itemHeight + 'px' }"
                >
                    {{ v }}
                </div>
                <div class="k-wheel-col-pad"></div>
            </div>

            <!-- Click zones (top / bottom of each column) -->
            <div
                v-for="(col, ci) in columns"
                :key="'z' + ci"
                class="k-wheel-zone"
                :class="'zone-' + ci"
                :style="{ top: 0, height: zoneH + 'px' }"
                @click="step(ci, -1)"
            >
                <ChevronUp class="zone-icon" />
            </div>
            <div
                v-for="(col, ci) in columns"
                :key="'zb' + ci"
                class="k-wheel-zone is-bottom"
                :class="'zone-' + ci"
                :style="{ bottom: 0, height: zoneH + 'px' }"
                @click="step(ci, 1)"
            >
                <ChevronDown class="zone-icon" />
            </div>

            <!-- Selection band + gradients -->
            <div class="k-wheel-mask k-wheel-mask-top"></div>
            <div class="k-wheel-mask k-wheel-mask-bottom"></div>
            <div class="k-wheel-band" :style="{ top: bandTop + 'px', height: itemHeight + 'px' }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

export interface KWheelColumn {
    key: string
    values: string[]
}

const props = withDefaults(defineProps<{
    columns: KWheelColumn[]
    /** selected index per column */
    modelValue: number[]
    /** visible item rows (must be odd) */
    rows?: number
    itemHeight?: number
    disabled?: boolean
}>(), {
    rows: 5,
    itemHeight: 38,
    disabled: false
})

const emits = defineEmits<{
    'update:modelValue': [value: number[]]
    'change': [value: number[]]
}>()

const scrollers = ref<HTMLElement[]>([])
const itemHeight = computed(() => props.itemHeight)
const viewHeight = computed(() => props.rows * props.itemHeight)
const bandTop = computed(() => ((props.rows - 1) / 2) * props.itemHeight)
const zoneH = computed(() => ((props.rows - 1) / 2) * props.itemHeight)

/* Live (pre-finalize) indexes — drives the highlight so it follows the scroll */
const liveIndexes = ref<number[]>([...props.modelValue])
const pos = (ci: number, vi: number) => Math.abs(vi - (liveIndexes.value[ci] ?? 0))

/* ── Scrolling helpers ── */
const maxIndex = (ci: number) => (props.columns[ci]?.values.length || 1) - 1

const scrollToIndex = (ci: number, index: number, smooth = false) => {
    const el = scrollers.value[ci]
    if (!el) return
    const target = Math.min(maxIndex(ci), Math.max(0, index))
    el.scrollTo({ top: target * itemHeight.value, behavior: smooth ? 'smooth' : 'auto' })
    liveIndexes.value = [...liveIndexes.value]
}

const indexFromScroll = (el: HTMLElement) => Math.round(el.scrollTop / itemHeight.value)

/* ── Live scroll tracking ── */
const onScroll = (ci: number) => {
    const el = scrollers.value[ci]
    if (!el) return
    const idx = Math.min(maxIndex(ci), Math.max(0, indexFromScroll(el)))
    if (liveIndexes.value[ci] !== idx) {
        liveIndexes.value = [...liveIndexes.value.slice(0, ci), idx, ...liveIndexes.value.slice(ci + 1)]
    }
    // debounce: if the user wheel-scrolls (no scrollend support), still snap + emit after a pause
    scheduleFinalize(300)
}

const onScrollEnd = (ci: number) => {
    const el = scrollers.value[ci]
    if (!el) return
    // snap to the closest item, then emit once everything is settled
    const idx = Math.min(maxIndex(ci), Math.max(0, indexFromScroll(el)))
    scrollToIndex(ci, idx, true)
    scheduleFinalize(180)
}

/* ── Click zones (top / bottom of each column) ── */
const step = (ci: number, dir: number) => {
    const el = scrollers.value[ci]
    if (!el || props.disabled) return
    const current = liveIndexes.value[ci] ?? indexFromScroll(el)
    const next = Math.min(maxIndex(ci), Math.max(0, current + dir))
    if (next === current) return
    // animate the scroll, and mark the target so the model watch doesn't fight it
    const nextArr = props.columns.map((_, i) => liveIndexes.value[i] ?? 0)
    nextArr[ci] = next
    lastEmitted = [...nextArr]
    liveIndexes.value = [...nextArr]
    emits('update:modelValue', nextArr)
    emits('change', nextArr)
    scrollToIndex(ci, next, true)
}

/* ── Drag support ── */
let dragState: { ci: number; startY: number; startTop: number; moved: boolean } | null = null

const onPointerDown = (e: PointerEvent, ci: number) => {
    if (props.disabled) return
    const el = scrollers.value[ci]
    if (!el) return
    dragState = { ci, startY: e.clientY, startTop: el.scrollTop, moved: false }
    el.setPointerCapture(e.pointerId)
    el.classList.add('is-dragging')
}

const onPointerMove = (e: PointerEvent, ci: number) => {
    if (!dragState || dragState.ci !== ci) return
    const el = scrollers.value[ci]
    if (!el) return
    const dy = e.clientY - dragState.startY
    if (Math.abs(dy) > 3) dragState.moved = true
    el.scrollTop = dragState.startTop - dy
    onScroll(ci)
}

const onPointerUp = (e: PointerEvent, ci: number) => {
    if (!dragState || dragState.ci !== ci) return
    const el = scrollers.value[ci]
    if (el) {
        el.releasePointerCapture(e.pointerId)
        el.classList.remove('is-dragging')
    }
    const wasDrag = dragState.moved
    dragState = null
    if (wasDrag) scheduleFinalize(140)
}

/* ── Finalize (snap + emit) ── */
let finalizeTimer: ReturnType<typeof setTimeout> | null = null

const scheduleFinalize = (delay: number) => {
    if (finalizeTimer) clearTimeout(finalizeTimer)
    finalizeTimer = setTimeout(finalize, delay)
}

const finalize = () => {
    finalizeTimer = null
    const next = props.columns.map((_, ci) => {
        const el = scrollers.value[ci]
        return el ? Math.min(maxIndex(ci), Math.max(0, indexFromScroll(el))) : 0
    })
    const changed = next.some((v, i) => v !== (props.modelValue[i] ?? 0))
    liveIndexes.value = [...next]
    if (changed) {
        lastEmitted = [...next]
        emits('update:modelValue', next)
        emits('change', next)
    } else {
        props.columns.forEach((_, ci) => {
            const el = scrollers.value[ci]
            if (el && el.scrollTop % itemHeight.value !== 0) {
                scrollToIndex(ci, indexFromScroll(el), true)
            }
        })
    }
}

/* Track the array we emitted, so the model watch doesn't re-scroll mid-animation */
let lastEmitted: number[] = []

/* External model change -> scroll columns */
watch(() => props.modelValue, (val) => {
    if (lastEmitted.length && val.every((v, i) => v === (lastEmitted[i] ?? 0))) {
        lastEmitted = []
        return
    }
    lastEmitted = []
    val.forEach((idx, ci) => {
        const el = scrollers.value[ci]
        if (el && idx !== indexFromScroll(el)) scrollToIndex(ci, idx, true)
    })
    liveIndexes.value = [...val]
})

onMounted(() => {
    nextTick(() => {
        props.modelValue.forEach((idx, ci) => scrollToIndex(ci, idx))
        liveIndexes.value = [...props.modelValue]
    })
})
</script>

<style scoped>
.k-wheel {
    width: 100%;
    user-select: none;
    direction: ltr;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    touch-action: pan-y;
}

.k-wheel-track {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    overflow: hidden;
    border-radius: 12px;
    background: var(--k-surface, #f8fafc);
}

.k-wheel-col {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    scroll-snap-type: y mandatory;
    min-width: 0;
    cursor: grab;
    overscroll-behavior: contain;
}

.k-wheel-col::-webkit-scrollbar {
    display: none;
}

.k-wheel-col.is-dragging {
    cursor: grabbing;
}

.k-wheel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: center;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    opacity: 0.5;
    transform: scale(0.94);
    transition: opacity 0.15s ease, transform 0.15s ease, color 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 6px;
}

.k-wheel-item.is-selected {
    opacity: 1;
    transform: scale(1);
    color: var(--k-primary, #1db954);
    font-weight: 800;
}

.k-wheel-item.is-near {
    opacity: 0.78;
}

.k-wheel-item.is-dim {
    opacity: 0.28;
}

.k-wheel-col-pad {
    height: var(--k-wheel-pad, 76px);
    flex-shrink: 0;
}

/* ── Selection band: translucent so the picked row stays readable ── */
.k-wheel-band {
    position: absolute;
    left: 5px;
    right: 5px;
    background: color-mix(in srgb, var(--k-primary, #1db954) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 30%, transparent);
    border-radius: 10px;
    pointer-events: none;
    z-index: 1;
}

/* ── Invisible click zones (top / bottom of each column) ── */
.k-wheel-zone {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 4;
}

.k-wheel-zone:hover .zone-icon {
    opacity: 1;
}

.k-wheel-zone.is-bottom {
    top: auto;
    bottom: 0;
}

.zone-icon {
    width: 16px;
    height: 16px;
    opacity: 0.35;
    color: var(--k-text-secondary, #64748b);
    transition: opacity 0.15s ease, transform 0.15s ease;
    pointer-events: none;
}

.k-wheel-zone:hover .zone-icon {
    transform: scale(1.15);
}

/* ── Fade masks (top / bottom) ── */
.k-wheel-mask {
    position: absolute;
    left: 0;
    right: 0;
    height: var(--k-wheel-pad, 76px);
    pointer-events: none;
    z-index: 2;
}

.k-wheel-mask-top {
    top: 0;
    background: linear-gradient(to bottom, var(--k-surface, #f8fafc) 12%, transparent);
}

.k-wheel-mask-bottom {
    bottom: 0;
    background: linear-gradient(to top, var(--k-surface, #f8fafc) 12%, transparent);
}
</style>
