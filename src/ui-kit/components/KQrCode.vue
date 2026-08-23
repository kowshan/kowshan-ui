<!-- components/KQrCode.vue -->
<!--
    KQrCode — dependency-free QR code (own encoder, byte mode, EC level L, v1-6):

      <KQrCode value="https://example.com/pay/123456" :size="160" />
      <KQrCode value="..." fg="#1db954" bg="#ffffff" :quiet-zone="2" />

    Modules are placed at integer coordinates in a `size` viewBox so the SVG
    stays pixel-crisp at any scale. Fires `error` when the value is too long.
-->
<template>
    <div class="k-qr" :title="title">
        <svg
            v-if="viewSize"
            :width="size"
            :height="size"
            :viewBox="`0 0 ${viewSize} ${viewSize}`"
            shape-rendering="crispEdges"
            role="img"
            :aria-label="title || 'کد کیو آر'"
        >
            <rect x="0" y="0" :width="viewSize" :height="viewSize" :fill="bg" />
            <g :fill="fg">
                <rect
                    v-for="cell in darkCells"
                    :key="cell.i"
                    :x="cell.x"
                    :y="cell.y"
                    width="1"
                    height="1"
                />
            </g>
        </svg>
        <div v-else class="k-qr-error">
            <AlertCircle :size="16" />
            <span>متن برای کد QR بسیار طولانی است</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { generateQrMatrix } from './qr-encoder'

const props = withDefaults(defineProps<{
    value?: string
    size?: number
    fg?: string
    bg?: string
    /** white quiet zone modules around the code */
    quietZone?: number
    title?: string
}>(), {
    value: '',
    size: 160,
    fg: '#1e293b',
    bg: '#ffffff',
    quietZone: 2,
    title: ''
})

const emit = defineEmits<{
    (e: 'error'): void
}>()

const result = computed(() => generateQrMatrix(props.value))

const matrix = computed(() => result.value?.matrix ?? null)

/** total module grid including the quiet zone */
const viewSize = computed(() => {
    const m = matrix.value
    return m ? m.length + props.quietZone * 2 : 0
})

const darkCells = computed(() => {
    const m = matrix.value
    if (!m) return []
    const cells: { i: number; x: number; y: number }[] = []
    let i = 0
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m.length; c++) {
            if (m[r][c]) cells.push({ i: i++, x: c + props.quietZone, y: r + props.quietZone })
        }
    }
    return cells
})

watch(result, (res) => {
    if (res === null && props.value) emit('error')
}, { immediate: true })
</script>

<style scoped>
.k-qr {
    display: inline-flex;
    width: fit-content;
}

.k-qr svg {
    display: block;
    border-radius: 8px;
    overflow: hidden;
}

.k-qr-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 200px;
    min-height: 120px;
    border: 1px dashed var(--k-error, #ef4444);
    border-radius: 10px;
    color: var(--k-error, #ef4444);
    font-size: 0.7rem;
    text-align: center;
    padding: 12px;
}
</style>
