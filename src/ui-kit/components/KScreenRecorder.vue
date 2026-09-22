<!-- KScreenRecorder — browser-based screen capture + download -->
<template>
    <div class="k-sr">
        <div v-if="!recording && !recorded" class="k-sr-idle">
            <MonitorPlay :size="36" class="k-sr-icon" />
            <p class="k-sr-text">{{ title }}</p>
            <button type="button" class="k-sr-btn k-sr-btn-primary" @click="startCapture" :disabled="!supported">
                <Video :size="16" /> شروع ضبط
            </button>
            <p v-if="!supported" class="k-sr-unsupported">مرورگر شما از ضبط صفحه پشتیبانی نمی‌کند</p>
        </div>

        <div v-else-if="recording" class="k-sr-recording">
            <div class="k-sr-timer">
                <span class="k-sr-dot" />
                {{ timerDisplay }}
            </div>
            <video ref="previewRef" class="k-sr-preview" autoplay muted playsinline />
            <div class="k-sr-actions">
                <button type="button" class="k-sr-btn k-sr-btn-danger" @click="stopCapture">
                    <Square :size="14" /> توقف
                </button>
            </div>
        </div>

        <div v-else-if="recorded" class="k-sr-recorded">
            <video :src="recordedUrl" controls class="k-sr-preview" />
            <div class="k-sr-actions">
                <button type="button" class="k-sr-btn k-sr-btn-primary" @click="downloadVideo">
                    <Download :size="14" /> دانلود
                </button>
                <button type="button" class="k-sr-btn k-sr-btn-secondary" @click="reset">
                    <RefreshCw :size="14" /> ضبط مجدد
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { MonitorPlay, Video, Square, Download, RefreshCw } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    title?: string
    mimeType?: string
}>(), {
    title: 'ضبط صفحه نمایش',
    mimeType: 'video/webm'
})

const emit = defineEmits<{
    'start': []
    'stop': [blob: Blob]
    'download': [blob: Blob]
}>()

const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia

const recording = ref(false)
const recorded = ref(false)
const recordedUrl = ref('')
const timerDisplay = ref('00:00')

let stream: MediaStream | null = null
let recorder: MediaRecorder | null = null
let chunks: Blob[] = []
let timerInterval: ReturnType<typeof setInterval> | null = null
let elapsed = 0

const startCapture = async () => {
    if (!supported) return
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        chunks = []
        elapsed = 0
        recorder = new MediaRecorder(stream, { mimeType: props.mimeType })
        recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: props.mimeType })
            recordedUrl.value = URL.createObjectURL(blob)
            recorded.value = true
            emit('stop', blob)
        }
        recorder.start()
        recording.value = true
        emit('start')

        stream.getVideoTracks()[0].onended = () => stopCapture()

        timerInterval = setInterval(() => {
            elapsed++
            const m = String(Math.floor(elapsed / 60)).padStart(2, '0')
            const s = String(elapsed % 60).padStart(2, '0')
            timerDisplay.value = `${m}:${s}`
        }, 1000)
    } catch (err) {
        console.error('Screen capture failed:', err)
    }
}

const stopCapture = () => {
    recorder?.stop()
    stream?.getTracks().forEach(t => t.stop())
    recording.value = false
    if (timerInterval) clearInterval(timerInterval)
}

const downloadVideo = () => {
    const a = document.createElement('a')
    a.href = recordedUrl.value
    a.download = `screen-record-${Date.now()}.webm`
    a.click()
    emit('download', new Blob(chunks, { type: props.mimeType }))
}

const reset = () => {
    recorded.value = false
    recordedUrl.value = ''
    chunks = []
    elapsed = 0
    timerDisplay.value = '00:00'
}

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
    stream?.getTracks().forEach(t => t.stop())
})
</script>

<style scoped>
.k-sr {
    border: 2px dashed var(--k-border); border-radius: var(--k-radius-md);
    padding: 24px; text-align: center; display: flex; flex-direction: column;
    align-items: center; gap: 12px;
}
.k-sr-idle { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.k-sr-icon { color: var(--k-primary); }
.k-sr-text { margin: 0; font-size: 0.85rem; color: var(--k-text-primary); font-weight: 600; }
.k-sr-unsupported { font-size: 0.72rem; color: var(--k-error); margin: 0; }

.k-sr-recording { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.k-sr-timer { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 700; color: var(--k-error); font-variant-numeric: tabular-nums; }
.k-sr-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--k-error); animation: k-sr-blink 1s infinite; }

@keyframes k-sr-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.k-sr-recorded { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; }
.k-sr-preview { width: 100%; max-width: 560px; border-radius: 8px; background: #000; }
.k-sr-actions { display: flex; gap: 8px; }

.k-sr-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--k-radius-sm);
    font-size: 0.78rem; font-weight: 600; font-family: inherit;
    cursor: pointer; border: none; transition: all 0.15s;
}
.k-sr-btn-primary { background: var(--k-primary); color: #fff; }
.k-sr-btn-primary:hover { filter: brightness(1.08); }
.k-sr-btn-danger { background: var(--k-error); color: #fff; }
.k-sr-btn-secondary { background: var(--k-surface); color: var(--k-text-primary); border: 1px solid var(--k-border); }
.k-sr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
