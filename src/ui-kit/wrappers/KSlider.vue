<!-- wrappers/KSlider.vue -->
<template>
    <div
        class="k-slider"
        :class="{
            'is-disabled': disabled,
            'is-range': range
        }"
    >
        <!-- Label -->
        <label v-if="label" class="k-label">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Value display -->
        <div v-if="showValue" class="k-slider-value">
            <span v-if="range">{{ displayValue[0] }}</span>
            <span v-else>{{ displayValue }}</span>
            <span v-if="suffix" class="k-slider-suffix">{{ suffix }}</span>
        </div>

        <!-- Track -->
        <div
            ref="trackRef"
            class="k-slider-track"
            @mousedown.prevent="onTrackMouseDown"
            @touchstart="onTrackTouchStart"
        >
            <!-- Filled portion (single) -->
            <div
                v-if="!range"
                class="k-slider-fill"
                :style="{ width: `${fillPercent}%` }"
            ></div>

            <!-- Filled portion (range) -->
            <div
                v-else
                class="k-slider-fill"
                :style="{
                    insetInlineStart: `${rangePercent[0]}%`,
                    width: `${rangePercent[1] - rangePercent[0]}%`
                }"
            ></div>

            <!-- Min/Max labels -->
            <span v-if="showBounds" class="k-slider-bound">{{ formatNum(min) }}</span>
            <span v-if="showBounds" class="k-slider-bound">{{ formatNum(max) }}</span>

            <!-- Thumb (single) -->
            <div
                v-if="!range"
                class="k-slider-thumb"
                role="slider"
                tabindex="0"
                :aria-valuemin="min"
                :aria-valuemax="max"
                :aria-valuenow="singleValue"
                :aria-label="label || 'مقدار'"
                :style="{ insetInlineStart: `${fillPercent}%` }"
                @keydown="onThumbKeydown($event, 'single')"
            >
                <span class="k-slider-tooltip">{{ displayValue }}<template v-if="suffix">{{ ' ' + suffix }}</template></span>
            </div>

            <!-- Thumbs (range) -->
            <template v-else>
                <div
                    class="k-slider-thumb"
                    role="slider"
                    tabindex="0"
                    :aria-valuemin="min"
                    :aria-valuemax="max"
                    :aria-valuenow="rangeValue[0]"
                    :aria-label="`${label || 'مقدار'} - حداقل`"
                    :style="{ insetInlineStart: `${rangePercent[0]}%` }"
                    @keydown="onThumbKeydown($event, 'min')"
                >
                    <span class="k-slider-tooltip">{{ formatNum(rangeValue[0]) }}<template v-if="suffix">{{ ' ' + suffix }}</template></span>
                </div>
                <div
                    class="k-slider-thumb"
                    role="slider"
                    tabindex="0"
                    :aria-valuemin="min"
                    :aria-valuemax="max"
                    :aria-valuenow="rangeValue[1]"
                    :aria-label="`${label || 'مقدار'} - حداکثر`"
                    :style="{ insetInlineStart: `${rangePercent[1]}%` }"
                    @keydown="onThumbKeydown($event, 'max')"
                >
                    <span class="k-slider-tooltip">{{ formatNum(rangeValue[1]) }}<template v-if="suffix">{{ ' ' + suffix }}</template></span>
                </div>
            </template>
        </div>

        <!-- Hint -->
        <div v-if="hint" class="k-hint-message">{{ hint }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    modelValue?: number | [number, number]
    label?: string
    hint?: string
    min?: number
    max?: number
    step?: number
    range?: boolean
    disabled?: boolean
    required?: boolean
    suffix?: string
    showValue?: boolean
    showBounds?: boolean
    /** number of decimal places to display (default: 0) */
    precision?: number
}>(), {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    showValue: true,
    showBounds: false,
    precision: 0
})

const emits = defineEmits<{
    'update:modelValue': [value: number | [number, number]]
    'change': [value: number | [number, number]]
    'input': [value: number | [number, number]]
}>()

const { toPersianDigits } = usePersianNumbers()

const trackRef = ref<HTMLDivElement | null>(null)

const clamp = (v: number) => Math.min(props.max, Math.max(props.min, v))

// Normalize modelValue
const singleValue = computed(() => {
    const raw = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
    return clamp(typeof raw === 'number' && !isNaN(raw) ? raw : props.min)
})

const rangeValue = computed<[number, number]>(() => {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : [props.min, props.max]
    const a = clamp(typeof arr[0] === 'number' && !isNaN(arr[0]) ? arr[0] : props.min)
    const b = clamp(typeof arr[1] === 'number' && !isNaN(arr[1]) ? arr[1] : props.max)
    return [Math.min(a, b), Math.max(a, b)]
})

const percent = (v: number) => ((v - props.min) / (props.max - props.min)) * 100
const fillPercent = computed(() => percent(singleValue.value))
const rangePercent = computed<[number, number]>(() => [percent(rangeValue.value[0]), percent(rangeValue.value[1])])

const displayValue = computed(() => formatNum(singleValue.value))

const formatNum = (v: number) => {
    const fixed = v.toFixed(props.precision)
    return toPersianDigits(fixed.replace(/\.0+$/, ''))
}

// Emit helpers
const emitSingle = (v: number) => {
    const val = clamp(v)
    emits('update:modelValue', val)
    emits('input', val)
}
const emitRange = (a: number, b: number) => {
    const [lo, hi] = [clamp(a), clamp(b)].sort((x, y) => x - y)
    const val: [number, number] = [lo, hi]
    emits('update:modelValue', val)
    emits('input', val)
}

// Pointer interaction
let dragging: 'single' | 'min' | 'max' | null = null

/* the track positions everything with logical properties, so in RTL the min sits
   at the right edge and the pointer fraction has to be mirrored to match.
   Read the direction once per gesture instead of on every move. */
let rtl = false

const readDirection = () => {
    const track = trackRef.value
    rtl = !!track && getComputedStyle(track).direction === 'rtl'
}

const valueFromClientX = (clientX: number) => {
    const track = trackRef.value
    if (!track) return props.min
    const rect = track.getBoundingClientRect()
    const ltrFraction = (clientX - rect.left) / rect.width
    const fraction = rtl ? 1 - ltrFraction : ltrFraction
    const raw = props.min + fraction * (props.max - props.min)
    const stepped = Math.round(raw / props.step) * props.step
    return clamp(stepped)
}

const onTrackMouseDown = (e: MouseEvent) => {
    if (props.disabled) return
    readDirection()
    const val = valueFromClientX(e.clientX)
    if (props.range) {
        const [lo, hi] = rangeValue.value
        dragging = Math.abs(val - lo) < Math.abs(val - hi) ? 'min' : 'max'
    } else {
        dragging = 'single'
    }
    moveThumb(val)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

const onTrackTouchStart = (e: TouchEvent) => {
    if (props.disabled) return
    readDirection()
    const touch = e.touches[0]
    const val = valueFromClientX(touch.clientX)
    if (props.range) {
        const [lo, hi] = rangeValue.value
        dragging = Math.abs(val - lo) < Math.abs(val - hi) ? 'min' : 'max'
    } else {
        dragging = 'single'
    }
    moveThumb(val)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
}

const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return
    moveThumb(valueFromClientX(e.clientX))
}

const onTouchMove = (e: TouchEvent) => {
    if (!dragging) return
    e.preventDefault()
    const touch = e.touches[0]
    moveThumb(valueFromClientX(touch.clientX))
}

const onMouseUp = () => {
    finishDrag()
}

const onTouchEnd = () => {
    finishDrag()
}

const finishDrag = () => {
    if (dragging) emits('change', props.range ? [...rangeValue.value] as [number, number] : singleValue.value)
    dragging = null
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
}

const moveThumb = (val: number) => {
    if (!dragging) return
    if (props.range) {
        let [lo, hi] = rangeValue.value
        if (dragging === 'min') lo = Math.min(val, hi)
        else hi = Math.max(val, lo)
        emitRange(lo, hi)
    } else {
        emitSingle(val)
    }
}

// Keyboard
const onThumbKeydown = (e: KeyboardEvent, which: 'single' | 'min' | 'max') => {
    if (props.disabled) return
    const delta = e.shiftKey ? props.step * 5 : props.step

    if (which === 'single') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') emitSingle(singleValue.value + delta)
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') emitSingle(singleValue.value - delta)
        else if (e.key === 'Home') emitSingle(props.min)
        else if (e.key === 'End') emitSingle(props.max)
        else return
        e.preventDefault()
        emits('change', singleValue.value)
    } else {
        const [lo, hi] = rangeValue.value
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            if (which === 'min') emitRange(lo + delta, hi)
            else emitRange(lo, hi + delta)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            if (which === 'min') emitRange(lo - delta, hi)
            else emitRange(lo, hi - delta)
        } else if (e.key === 'Home') {
            if (which === 'min') emitRange(props.min, hi)
            else emitRange(lo, props.max)
        } else if (e.key === 'End') {
            if (which === 'min') emitRange(props.max, hi)
            else emitRange(lo, props.min)
        } else return
        e.preventDefault()
        emits('change', [...rangeValue.value] as [number, number])
    }
}

onUnmounted(finishDrag)
</script>

<style scoped>
.k-slider {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    --k-slider-color: #1db954;
}

.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

/* Value */
.k-slider-value {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--k-text-primary);
    text-align: start;
}

.k-slider-suffix {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--k-text-muted);
    margin-left: 4px;
}

/* Track */
.k-slider-track {
    position: relative;
    /* dragging must not scroll the page on touch */
    touch-action: none;
    height: 6px;
    border-radius: 999px;
    background: var(--k-surface-hover, #f1f5f9);
    border: 1px solid var(--k-border);
    cursor: pointer;
    margin: 10px 2px;
}

.k-slider-track:focus-within {
    outline: none;
}

/* Fill */
.k-slider-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    background: var(--k-slider-color);
    border-radius: 999px;
    pointer-events: none;
}

/* Bounds */
.k-slider-bound {
    position: absolute;
    top: 100%;
    margin-top: 2px;
    font-size: 0.65rem;
    color: var(--k-text-muted);
    direction: ltr;
}

.k-slider-bound:first-of-type {
    inset-inline-start: 0;
}

.k-slider-bound:last-of-type {
    inset-inline-end: 0;
}

/* Thumb */
.k-slider-thumb {
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--k-slider-color);
    border: 2.5px solid #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    /* logical: centres the thumb on its inset-inline-start in both directions */
    transform: translateY(-50%);
    margin-inline-start: -9px;
    cursor: grab;
    transition: box-shadow 0.15s ease;
    outline: none;
}

.k-slider-thumb:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.k-slider-thumb:focus-visible {
    box-shadow: 0 0 0 3px rgba(202, 114, 38, 0.35);
}

.k-slider-thumb:active {
    cursor: grabbing;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}

/* Tooltip */
.k-slider-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.85);
    transform-origin: bottom center;
    background: #1e293b;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 5px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.15s ease;
    direction: ltr;
}

.k-slider-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1e293b;
}

.k-slider-thumb:hover .k-slider-tooltip,
.k-slider-thumb:focus-visible .k-slider-tooltip,
.k-slider-thumb:active .k-slider-tooltip {
    opacity: 1;
    transform: translateX(-50%) scale(1);
}

/* Hint */
.k-hint-message {
    font-size: 0.7rem;
    color: var(--k-text-muted);
}

/* Disabled */
.k-slider.is-disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
