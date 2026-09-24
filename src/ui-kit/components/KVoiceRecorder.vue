<!-- KVoiceRecorder.vue — audio recording with waveform and timer -->
<template>
    <div class="k-vr">
        <!-- Waveform visualization -->
        <div class="k-vr-wave" @click="seek">
            <canvas ref="canvasEl" class="k-vr-canvas" />
            <div v-if="state === 'recorded'" class="k-vr-progress" :style="{ width: playPct + '%' }" />
        </div>

        <!-- Timer -->
        <div class="k-vr-timer">
            <span class="k-vr-time">{{ formatTime(displayTime) }}</span>
            <span v-if="duration" class="k-vr-duration">/ {{ formatTime(duration) }}</span>
        </div>

        <!-- Controls -->
        <div class="k-vr-controls">
            <!-- Recording -->
            <template v-if="state === 'recording'">
                <button class="k-vr-btn k-vr-btn-stop" @click="stopRecording">
                    <Square :size="16" fill="currentColor" />
                </button>
                <div class="k-vr-rec-dot" />
            </template>

            <!-- Idle -->
            <template v-else-if="state === 'idle'">
                <button class="k-vr-btn k-mic-btn" @click="startRecording">
                    <Mic :size="20" />
                </button>
            </template>

            <!-- Recorded -->
            <template v-else-if="state === 'recorded'">
                <button class="k-vr-btn" @click="deleteRecording">
                    <Trash2 :size="16" />
                </button>
                <button class="k-vr-btn k-play-btn" @click="togglePlay">
                    <Pause v-if="playing" :size="18" fill="currentColor" />
                    <Play v-else :size="18" fill="currentColor" />
                </button>
                <button class="k-vr-btn k-vr-btn-send" @click="$emit('send', dataUrl!)">
                    <SendHorizontal :size="16" />
                </button>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { cssVar } from '../utils/cssVar'
import { Mic, Square, Play, Pause, Trash2, SendHorizontal } from 'lucide-vue-next'

const emit = defineEmits<{
    send: [dataUrl: string]
    record: [blob: Blob]
}>()

const canvasEl = ref<HTMLCanvasElement>()
const state = ref<'idle' | 'recording' | 'recorded'>('idle')
const playing = ref(false)
const displayTime = ref(0)
const duration = ref(0)
const playPct = ref(0)
const dataUrl = ref('')

let mediaRecorder: MediaRecorder | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let animFrame: number | null = null
let stream: MediaStream | null = null
let audioEl: HTMLAudioElement | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null
let startTime = 0
const bars: number[] = []

const drawWaveform = (active = false) => {
    const c = canvasEl.value
    if (!c) return
    const ctx = c.getContext('2d')!
    const w = c.width
    const h = c.height
    ctx.clearRect(0, 0, w, h)

    const barW = 3
    const gap = 2
    const count = Math.floor(w / (barW + gap))

    if (active && analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const step = Math.floor(data.length / count)
        for (let i = 0; i < count; i++) {
            bars[i] = (data[i * step] || 0) / 255
        }
    } else {
        // Idle: gentle sine wave
        for (let i = 0; i < count; i++) {
            bars[i] = bars[i] || 0.1 + Math.sin(Date.now() / 500 + i * 0.3) * 0.05
        }
    }

    bars.forEach((val, i) => {
        const x = i * (barW + gap)
        const barH = Math.max(val * h * 0.8, 2)
        const y = (h - barH) / 2
        ctx.fillStyle = active ? cssVar(ctx.canvas, '--k-primary', '#1db954') : '#cbd5e1'
        ctx.beginPath()
        ctx.roundRect(x, y, barW, barH, 1)
        ctx.fill()
    })
}

const startRecording = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 128
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        mediaRecorder = new MediaRecorder(stream)
        const chunks: Blob[] = []
        mediaRecorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' })
            dataUrl.value = URL.createObjectURL(blob)
            duration.value = displayTime.value
            emit('record', blob)
        }

        mediaRecorder.start()
        state.value = 'recording'
        startTime = Date.now()
        displayTime.value = 0
        timerInterval = setInterval(() => {
            displayTime.value = (Date.now() - startTime) / 1000
        }, 100)

        const tick = () => { drawWaveform(true); animFrame = requestAnimationFrame(tick) }
        animFrame = requestAnimationFrame(tick)
    } catch {
        // denied
    }
}

const stopRecording = () => {
    mediaRecorder?.stop()
    stream?.getTracks().forEach(t => t.stop())
    if (animFrame) cancelAnimationFrame(animFrame)
    if (timerInterval) clearInterval(timerInterval)
    state.value = 'recorded'
}

const togglePlay = () => {
    if (playing.value) {
        audioEl?.pause()
        playing.value = false
    } else {
        audioEl = new Audio(dataUrl.value)
        audioEl.play()
        audioEl.ontimeupdate = () => {
            if (audioEl) playPct.value = (audioEl.currentTime / audioEl.duration) * 100
        }
        audioEl.onended = () => { playing.value = false; playPct.value = 0 }
        playing.value = true
    }
}

const deleteRecording = () => {
    dataUrl.value = ''
    displayTime.value = 0
    duration.value = 0
    state.value = 'idle'
    bars.length = 0
}

const seek = () => {}

const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
}

onUnmounted(() => {
    stream?.getTracks().forEach(t => t.stop())
    if (animFrame) cancelAnimationFrame(animFrame)
    if (timerInterval) clearInterval(timerInterval)
    audioEl?.pause()
})

// Draw idle waveform
watch(canvasEl, () => { if (canvasEl.value) drawWaveform() })
</script>

<style scoped>
.k-vr {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 16px;
    background: var(--k-bg, #fff);
    text-align: center;
}
.k-vr-wave {
    height: 64px;
    border-radius: 10px;
    background: var(--k-surface, #f8fafc);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    margin-bottom: 8px;
}
.k-vr-canvas {
    width: 100%;
    height: 100%;
}
.k-vr-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: color-mix(in srgb, var(--k-primary, #1db954) 10%, transparent);
    pointer-events: none;
}
.k-vr-timer {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    direction: ltr;
}
.k-vr-duration { color: var(--k-text-muted); font-weight: 500; }
.k-vr-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}
.k-vr-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
}
.k-vr-btn:hover { background: var(--k-border); }
.k-mic-btn {
    width: 56px;
    height: 56px;
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-mic-btn:hover { filter: brightness(1.08); transform: scale(1.05); }
.k-play-btn {
    width: 48px;
    height: 48px;
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-vr-btn-stop {
    background: #ef4444;
    color: #fff;
}
.k-vr-btn-send {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-vr-rec-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    animation: k-vr-blink 1s ease infinite;
}
@keyframes k-vr-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
</style>
