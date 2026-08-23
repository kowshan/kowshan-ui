<!-- components/KSignaturePad.vue -->
<template>
    <div class="k-signature">
        <canvas
            ref="canvasRef"
            class="k-signature-canvas"
            :class="{ 'is-empty': isEmpty }"
            :style="{ height: height + 'px' }"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointerleave="onUp"
        />

        <!-- Toolbar -->
        <div class="k-signature-toolbar">
            <span class="k-signature-status" :class="{ 'is-filled': !isEmpty }">
                {{ isEmpty ? placeholder : filledText }}
            </span>

            <div class="k-signature-tools">
                <button
                    v-for="c in colorOptions"
                    :key="c"
                    type="button"
                    class="k-signature-color"
                    :class="{ 'is-active': color === c }"
                    :style="{ background: c }"
                    :aria-label="`رنگ ${c}`"
                    @click="color = c"
                />
                <button type="button" class="k-signature-action" @click="undo">
                    <Undo2 class="icon" />
                    بازگشت
                </button>
                <button type="button" class="k-signature-action" :disabled="isEmpty" @click="clear">
                    <Eraser class="icon" />
                    پاک‌کردن
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Eraser, Undo2 } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue?: string | null
    height?: number
    penColor?: string
    penWidth?: number
    placeholder?: string
    filledText?: string
    colorOptions?: string[]
}>(), {
    modelValue: null,
    height: 180,
    penColor: '#1e293b',
    penWidth: 2.5,
    placeholder: 'امضا کنید — با ماوس یا انگشت',
    filledText: 'امضا ثبت شد',
    colorOptions: () => ['#1e293b', '#1db954', '#2563eb', '#16a34a', '#dc2626']
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
    'clear': []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const color = ref(props.penColor)

let drawing = false
let lastX = 0
let lastY = 0
const strokes = ref<{ color: string; width: number; points: { x: number; y: number }[] }[]>([])

const ctx = computed(() => canvasRef.value?.getContext('2d') || null)
const isEmpty = computed(() => strokes.value.length === 0)

const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

const resize = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.max(1, rect.width * DPR)
    canvas.height = Math.max(1, props.height * DPR)
    ctx.value?.setTransform(DPR, 0, 0, DPR, 0, 0)
    redraw()
}

const redraw = () => {
    const c = ctx.value
    const canvas = canvasRef.value
    if (!c || !canvas) return
    c.clearRect(0, 0, canvas.width, canvas.height)
    for (const s of strokes.value) {
        c.strokeStyle = s.color
        c.lineWidth = s.width
        c.lineCap = 'round'
        c.lineJoin = 'round'
        c.beginPath()
        s.points.forEach((p, i) => {
            if (i === 0) c.moveTo(p.x, p.y)
            else c.lineTo(p.x, p.y)
        })
        c.stroke()
    }
    if (strokes.value.length) emitData()
}

const pos = (e: PointerEvent) => {
    const canvas = canvasRef.value!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const onDown = (e: PointerEvent) => {
    drawing = true
    try { canvasRef.value?.setPointerCapture(e.pointerId) } catch { /* synthetic events */ }
    const p = pos(e)
    lastX = p.x
    lastY = p.y
    strokes.value.push({ color: color.value, width: props.penWidth, points: [p] })
    drawSegment(strokes.value[strokes.value.length - 1], p)
}

const onMove = (e: PointerEvent) => {
    if (!drawing || !strokes.value.length) return
    const p = pos(e)
    const s = strokes.value[strokes.value.length - 1]
    s.points.push(p)
    drawSegment(s, p)
    lastX = p.x
    lastY = p.y
}

const onUp = () => {
    if (!drawing) return
    drawing = false
    if (strokes.value.length) emitData()
}

const drawSegment = (s: { color: string; width: number }, p: { x: number; y: number }) => {
    const c = ctx.value
    if (!c) return
    c.strokeStyle = s.color
    c.lineWidth = s.width
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.beginPath()
    c.moveTo(lastX, lastY)
    c.lineTo(p.x, p.y)
    c.stroke()
}

const emitData = () => {
    const url = canvasRef.value?.toDataURL('image/png') || ''
    emits('update:modelValue', url)
    emits('change', url)
}

const undo = () => {
    strokes.value.pop()
    redraw()
    if (!strokes.value.length) emits('clear')
}

const clear = () => {
    strokes.value.length = 0
    redraw()
    emits('clear')
}

watch(color, () => redraw())

/* Restore an existing signature from modelValue */
onMounted(() => {
    resize()
    if (props.modelValue && ctx.value) {
        const img = new Image()
        img.onload = () => {
            ctx.value?.drawImage(img, 0, 0)
            strokes.value.push({ color: color.value, width: props.penWidth, points: [] })
        }
        img.src = props.modelValue
    }
})
</script>

<style scoped>
.k-signature {
    width: 100%;
    direction: rtl;
}

.k-signature-canvas {
    width: 100%;
    display: block;
    background: var(--k-bg, #ffffff);
    border: 2px dashed var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    cursor: crosshair;
    touch-action: none;
    transition: border-color 0.15s ease;
}

.k-signature-canvas.is-empty {
    background-image: radial-gradient(circle, var(--k-border, #e2e8f0) 1px, transparent 1px);
    background-size: 18px 18px;
}

.k-signature-canvas:active {
    border-color: var(--k-primary, #1db954);
}

.k-signature-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.k-signature-status {
    font-size: 0.75rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-signature-status.is-filled {
    color: var(--k-success, #16a34a);
    font-weight: 600;
}

.k-signature-tools {
    display: flex;
    align-items: center;
    gap: 8px;
}

.k-signature-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--k-bg, #ffffff);
    box-shadow: 0 0 0 1px var(--k-border, #e2e8f0);
    cursor: pointer;
    padding: 0;
    transition: transform 0.12s ease;
}

.k-signature-color:hover {
    transform: scale(1.15);
}

.k-signature-color.is-active {
    box-shadow: 0 0 0 2px var(--k-primary, #1db954);
}

.k-signature-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    border-radius: 8px;
    padding: 5px 10px;
    font-family: inherit;
    font-size: 0.72rem;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-signature-action:hover:not(:disabled) {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-signature-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-signature-action .icon {
    width: 13px;
    height: 13px;
}
</style>
