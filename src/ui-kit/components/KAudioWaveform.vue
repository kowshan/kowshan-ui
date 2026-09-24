<!-- KAudioWaveform.vue — audio waveform visualization with progress (SoundCloud-style) -->
<template>
    <div class="k-wave">
        <div class="k-wave-visual" @click="seek">
            <canvas ref="canvas" class="k-wave-canvas" />
            <div class="k-wave-overlay" :style="{ width: progressPct + '%' }" />
        </div>
        <!-- Controls below waveform -->
        <div class="k-wave-controls">
            <button type="button" class="k-wave-play" @click.stop="togglePlay">
                <Pause v-if="playing" :size="16" fill="currentColor" />
                <Play v-else :size="16" fill="currentColor" />
            </button>
            <div class="k-wave-time">
                <span>{{ formatTime(currentTime) }}</span>
                <span class="k-wave-time-sep">/</span>
                <span>{{ formatTime(duration) }}</span>
            </div>
            <div v-if="$slots.default" class="k-wave-extra">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { cssVar } from '../utils/cssVar'
import { Play, Pause } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    src?: string
    height?: number
    barWidth?: number
    barGap?: number
    color?: string
    progressColor?: string
}>(), {
    height: 64,
    barWidth: 2,
    barGap: 1,
    color: '#cbd5e1',
    /** defaults to the brand colour (resolved from --k-primary on the canvas) */
    progressColor: '',
})

const emit = defineEmits<{
    'update:time': [time: number]
    play: []
    pause: []
}>()

const canvas = ref<HTMLCanvasElement>()
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progressPct = ref(0)
let audio: HTMLAudioElement | null = null
let bars: number[] = []
let animFrame: number | null = null

const generateBars = (count: number) => {
    bars = Array.from({ length: count }, () => {
        const base = Math.random() * 0.6 + 0.1
        return base + Math.sin(Math.random() * Math.PI) * 0.3
    })
}

const draw = () => {
    const c = canvas.value
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const w = c.width
    const h = c.height
    ctx.clearRect(0, 0, w, h)

    const totalBar = props.barWidth + props.barGap
    const count = Math.floor(w / totalBar)
    if (bars.length !== count) generateBars(count)

    const progressX = (progressPct.value / 100) * w

    bars.forEach((val, i) => {
        const x = i * totalBar
        const barH = val * h * 0.85
        const y = (h - barH) / 2
        ctx.fillStyle = x + props.barWidth < progressX
            ? props.progressColor || cssVar(ctx.canvas, '--k-primary', '#1db954')
            : props.color
        ctx.beginPath()
        ctx.roundRect(x, y, props.barWidth, barH, 1)
        ctx.fill()
    })
}

const togglePlay = () => {
    if (!audio) return
    playing.value ? audio.pause() : audio.play()
}

const seek = (e: MouseEvent) => {
    if (!audio || !canvas.value) return
    const rect = canvas.value.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * duration.value
}

const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
}

onMounted(() => {
    if (props.src) {
        audio = new Audio(props.src)
        audio.addEventListener('loadedmetadata', () => {
            duration.value = audio!.duration
        })
        audio.addEventListener('timeupdate', () => {
            currentTime.value = audio!.currentTime
            progressPct.value = (currentTime.value / (duration.value || 1)) * 100
            emit('update:time', currentTime.value)
        })
        audio.addEventListener('play', () => { playing.value = true; emit('play') })
        audio.addEventListener('pause', () => { playing.value = false; emit('pause') })
    }
    // Generate initial bars
    if (canvas.value) {
        canvas.value.width = canvas.value.clientWidth * 2
        canvas.value.height = props.height * 2
        generateBars(Math.floor(canvas.value.width / (props.barWidth + props.barGap)))
        draw()
    }
})

watch([progressPct, playing], () => {
    draw()
    if (playing.value) {
        const tick = () => { draw(); animFrame = requestAnimationFrame(tick) }
        animFrame = requestAnimationFrame(tick)
    } else if (animFrame) {
        cancelAnimationFrame(animFrame)
        animFrame = null
    }
})

onUnmounted(() => {
    audio?.pause()
    audio = null
    if (animFrame) cancelAnimationFrame(animFrame)
})

// Expose for external use
defineExpose({
    play: () => audio?.play(),
    pause: () => audio?.pause(),
    seekTo: (t: number) => { if (audio) audio.currentTime = t },
})
</script>

<style scoped>
.k-wave {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
}
.k-wave-visual {
    position: relative;
    cursor: pointer;
    overflow: hidden;
}
.k-wave-canvas {
    display: block;
    width: 100%;
    height: 64px;
}
.k-wave-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--k-primary) 6%, transparent) 100%);
    transition: width 0.1s linear;
}
.k-wave-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}
.k-wave-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--k-primary, #1db954);
    color: #fff;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--k-primary) 30%, transparent);
    transition: transform 0.15s ease;
}
.k-wave-play:hover { transform: scale(1.08); }
.k-wave-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--k-text-muted);
    font-variant-numeric: tabular-nums;
}
.k-wave-time-sep {
    opacity: 0.4;
}
.k-wave-extra {
    margin-inline-start: auto;
}
</style>
