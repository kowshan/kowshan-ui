<!-- components/KVideoPlayer.vue -->
<!--
    KVideoPlayer — self-contained HTML5 video player:

      <KVideoPlayer src="https://…/video.mp4" poster="https://…/poster.jpg"
                    title="معرفی پروژه" />
-->
<template>
    <div class="k-vp" :class="{ 'is-playing': playing }">
        <video
            ref="videoEl"
            class="k-vp-video"
            :src="src"
            :poster="poster"
            :controls="false"
            preload="metadata"
            @loadedmetadata="onMeta"
            @timeupdate="onTime"
            @play="playing = true"
            @pause="playing = false"
            @ended="playing = false"
            @click="toggle"
        />

        <!-- Title overlay -->
        <div v-if="title" class="k-vp-title">{{ title }}</div>

        <!-- Big center play -->
        <button
            v-if="!playing"
            type="button"
            class="k-vp-bigplay"
            aria-label="پخش"
            @click="toggle"
        >
            <Play :size="26" fill="currentColor" />
        </button>

        <!-- Controls bar -->
        <div class="k-vp-bar" :class="{ 'is-hidden': !controlsVisible }" @click.stop>
            <div
                class="k-vp-seek"
                role="slider"
                tabindex="0"
                :aria-valuemin="0"
                :aria-valuemax="duration || 0"
                :aria-valuenow="current"
                @click="seekTo"
                @keydown.arrow-left.prevent="skip(-5)"
                @keydown.arrow-right.prevent="skip(5)"
            >
                <div class="k-vp-seek-fill" :style="{ width: progress + '%' }" />
                <span class="k-vp-seek-thumb" :style="{ insetInlineStart: progress + '%' }" />
            </div>

            <div class="k-vp-controls">
                <button type="button" class="k-vp-btn" aria-label="پخش/توقف" @click="toggle">
                    <Pause v-if="playing" :size="16" />
                    <Play v-else :size="16" />
                </button>

                <span class="k-vp-time">{{ fmt(current) }} / {{ fmt(duration) }}</span>

                <div class="k-vp-spacer" />

                <button
                    type="button"
                    class="k-vp-btn"
                    aria-label="صدا"
                    @click="muted = !muted"
                >
                    <VolumeX v-if="muted || volume === 0" :size="16" />
                    <Volume2 v-else-if="volume > 0.5" :size="16" />
                    <Volume1 v-else :size="16" />
                </button>

                <button type="button" class="k-vp-btn" aria-label="تمام‌صفحه" @click="fullscreen">
                    <Maximize :size="16" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Maximize, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    src: string
    poster?: string
    title?: string
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
}>(), {
    poster: '',
    title: '',
    autoplay: false,
    loop: false,
    muted: false
})

const emit = defineEmits<{
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'ended'): void
    (e: 'timeupdate', time: number): void
}>()

const { toPersianDigits } = usePersianNumbers()

const videoEl = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(props.muted)
const controlsVisible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const progress = computed(() => (duration.value ? (current.value / duration.value) * 100 : 0))

const fmt = (s: number) => {
    if (!isFinite(s)) return '۰۰:۰۰'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    const mm = toPersianDigits(String(m).padStart(2, '0'))
    const ss = toPersianDigits(String(sec).padStart(2, '0'))
    return `${mm}:${ss}`
}

const onMeta = () => { duration.value = videoEl.value?.duration || 0 }
const onTime = () => {
    current.value = videoEl.value?.currentTime || 0
    emit('timeupdate', current.value)
}

const toggle = () => {
    const v = videoEl.value
    if (!v) return
    if (v.paused) { v.play(); emit('play') } else { v.pause(); emit('pause') }
}

const seekTo = (e: MouseEvent) => {
    const v = videoEl.value
    const el = e.currentTarget as HTMLElement
    if (!v || !duration.value) return
    const rect = el.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * duration.value
}

const skip = (sec: number) => {
    const v = videoEl.value
    if (v) v.currentTime = Math.min(Math.max(0, v.currentTime + sec), duration.value)
}

const fullscreen = () => {
    const root = videoEl.value?.parentElement
    if (!root) return
    if (document.fullscreenElement) document.exitFullscreen()
    else root.requestFullscreen?.()
}

const showControls = () => {
    controlsVisible.value = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => { if (playing.value) controlsVisible.value = false }, 2600)
}

watch(muted, (m) => { if (videoEl.value) videoEl.value.muted = m })
watch(volume, (v) => { if (videoEl.value) videoEl.value.volume = v })

watch(() => props.autoplay, (a) => { if (a) videoEl.value?.play() }, { immediate: true })
watch(() => props.loop, (l) => { if (videoEl.value) videoEl.value.loop = l }, { immediate: true })

onMounted(() => {
    if (videoEl.value) {
        videoEl.value.muted = props.muted
        videoEl.value.loop = props.loop
        videoEl.value.volume = volume.value
    }
})
onUnmounted(() => { if (hideTimer) clearTimeout(hideTimer) })

defineExpose({ videoEl, play: () => videoEl.value?.play(), pause: () => videoEl.value?.pause() })
</script>

<style scoped>
.k-vp {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    cursor: pointer;
    user-select: none;
}

.k-vp-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.k-vp-title {
    position: absolute;
    top: 0;
    inset-inline: 0;
    padding: 12px 14px;
    background: linear-gradient(to bottom, rgb(0 0 0 / 0.55), transparent);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    text-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
    pointer-events: none;
}

.k-vp-bigplay {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: rgb(0 0 0 / 0.45);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline-start: 4px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: transform 0.15s ease, background 0.15s ease;
}

.k-vp-bigplay:hover { transform: scale(1.08); background: rgb(0 0 0 / 0.6); }

.k-vp-bar {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 8px 10px 10px;
    background: linear-gradient(to top, rgb(0 0 0 / 0.75), transparent);
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: opacity 0.25s ease;
}

.k-vp-bar.is-hidden { opacity: 0; pointer-events: none; }

.k-vp-seek {
    position: relative;
    height: 14px;
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;
}

.k-vp-seek::before {
    content: '';
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: rgb(255 255 255 / 0.3);
}

.k-vp-seek-fill {
    position: absolute;
    inset-inline-start: 0;
    height: 4px;
    border-radius: 4px;
    background: var(--k-primary, #1db954);
}

.k-vp-seek-thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.4);
}

.k-vp-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
}

.k-vp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: background 0.15s ease;
}

.k-vp-btn:hover { background: rgb(255 255 255 / 0.18); }

.k-vp-time {
    font-size: 0.68rem;
    font-weight: 600;
    font-family: inherit;
    direction: ltr;
}

.k-vp-spacer { flex: 1; }
</style>
