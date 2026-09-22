<!-- KCameraCapture.vue — webcam/selfie capture component -->
<template>
    <div class="k-cam" :style="{ height }">
        <!-- Camera feed -->
        <video v-show="state === 'streaming'" ref="videoEl" class="k-cam-video" autoplay playsinline muted />

        <!-- Canvas (hidden) -->
        <canvas ref="canvasEl" style="display: none" />

        <!-- Captured preview -->
        <img v-if="capturedUrl" :src="capturedUrl" class="k-cam-preview" />

        <!-- Empty state -->
        <div v-if="state === 'idle'" class="k-cam-empty">
            <Camera :size="32" />
            <p>دوربین را فعال کنید</p>
        </div>

        <!-- Error -->
        <div v-if="state === 'error'" class="k-cam-empty k-cam-error">
            <AlertCircle :size="32" />
            <p>{{ errorMsg }}</p>
        </div>

        <!-- Controls -->
        <div v-if="state === 'streaming'" class="k-cam-controls">
            <button class="k-cam-btn k-cam-btn-switch" title="Flip camera" @click="flipCamera">
                <RefreshCcw :size="16" />
            </button>
            <button class="k-cam-btn k-cam-btn-capture" @click="capture">
                <div class="k-cam-btn-ring" />
            </button>
            <button class="k-cam-btn k-cam-btn-stop" title="Stop" @click="stop">
                <X :size="16" />
            </button>
        </div>

        <!-- After capture -->
        <div v-if="state === 'captured'" class="k-cam-controls">
            <button class="k-cam-btn k-cam-btn-retake" @click="retake">
                <RefreshCcw :size="16" />
                <span>Retake</span>
            </button>
            <button class="k-cam-btn k-cam-btn-use" @click="usePhoto">
                <Check :size="16" />
                <span>Use photo</span>
            </button>
        </div>

        <!-- Start button -->
        <button v-if="state === 'idle' || state === 'error'" class="k-cam-start" @click="start">
            <Camera :size="18" />
            <span>Activate Camera</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Camera, RefreshCcw, X, Check, AlertCircle } from 'lucide-vue-next'

withDefaults(defineProps<{
    height?: string
}>(), {
    height: '300px',
})

const emit = defineEmits<{
    capture: [dataUrl: string]
    error: [message: string]
}>()

const videoEl = ref<HTMLVideoElement>()
const canvasEl = ref<HTMLCanvasElement>()
const state = ref<'idle' | 'streaming' | 'captured' | 'error'>('idle')
const capturedUrl = ref('')
const errorMsg = ref('')
let stream: MediaStream | null = null
let facingMode: 'user' | 'environment' = 'user'

const start = async () => {
    try {
        errorMsg.value = ''
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
        })
        if (videoEl.value) {
            videoEl.value.srcObject = stream
            await videoEl.value.play()
        }
        state.value = 'streaming'
    } catch (e: any) {
        errorMsg.value = e.message || 'Camera access denied'
        state.value = 'error'
        emit('error', errorMsg.value)
    }
}

const stop = () => {
    stream?.getTracks().forEach(t => t.stop())
    stream = null
    state.value = 'idle'
}

const capture = () => {
    const video = videoEl.value
    const canvas = canvasEl.value
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    capturedUrl.value = canvas.toDataURL('image/jpeg', 0.92)
    state.value = 'captured'
}

const retake = () => {
    capturedUrl.value = ''
    state.value = 'streaming'
}

const usePhoto = () => {
    emit('capture', capturedUrl.value)
    stop()
}

const flipCamera = () => {
    facingMode = facingMode === 'user' ? 'environment' : 'user'
    stop()
    start()
}

onUnmounted(() => {
    stream?.getTracks().forEach(t => t.stop())
})
</script>

<style scoped>
.k-cam {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
}
.k-cam-video, .k-cam-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.k-cam-preview { position: absolute; inset: 0; }
.k-cam-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.4);
}
.k-cam-empty p { margin: 0; font-size: 0.78rem; }
.k-cam-error { color: #ef4444; }
.k-cam-controls {
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 2;
}
.k-cam-btn {
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    color: #fff;
}
.k-cam-btn-capture {
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.9);
    position: relative;
}
.k-cam-btn-ring {
    width: 44px;
    height: 44px;
    border: 3px solid #0f172a;
    border-radius: 50%;
}
.k-cam-btn-capture:hover { transform: scale(1.08); }
.k-cam-btn-switch, .k-cam-btn-stop {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(4px);
}
.k-cam-btn-retake, .k-cam-btn-use {
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    gap: 6px;
    display: flex;
    align-items: center;
}
.k-cam-btn-retake { background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); }
.k-cam-btn-use { background: var(--k-primary, #1db954); }
.k-cam-start {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
    z-index: 2;
}
.k-cam-start:hover { background: rgba(255,255,255,0.25); }
</style>
