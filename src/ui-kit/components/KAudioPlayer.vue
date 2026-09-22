<!-- components/KAudioPlayer.vue -->
<!--
    KAudioPlayer — audio player with optional playlist:

      <KAudioPlayer :tracks="[{ src, title, artist }]" @end="onEnd" />
      <KAudioPlayer src="…" title="…" />           <!-- single track -->
-->
<template>
    <div dir="ltr" class="k-ap">
        <div class="k-ap-main">
            <button type="button" class="k-ap-play" :aria-label="playing ? 'توقف' : 'پخش'" @click="toggle">
                <Pause v-if="playing" :size="18" fill="currentColor" />
                <Play v-else :size="18" fill="currentColor" />
            </button>

            <div class="k-ap-info">
                <span class="k-ap-title">{{ active.title || title || 'بدون عنوان' }}</span>
                <span v-if="active.artist || artist" class="k-ap-artist">{{ active.artist || artist }}</span>
            </div>

            <div class="k-ap-seek" role="slider" tabindex="0"
                 :aria-valuemin="0" :aria-valuemax="duration || 0" :aria-valuenow="current"
                 @click="seekTo" @keydown.arrow-left.prevent="skip(-10)" @keydown.arrow-right.prevent="skip(10)">
                <div class="k-ap-seek-fill" :style="{ width: progress + '%' }" />
            </div>

            <span class="k-ap-time">{{ fmt(current) }} / {{ fmt(duration) }}</span>

            <button type="button" class="k-ap-vol" :aria-label="muted ? 'صدا روشن' : 'بی‌صدا'" @click="muted = !muted">
                <VolumeX v-if="muted || volume === 0" :size="15" />
                <Volume2 v-else-if="volume > 0.5" :size="15" />
                <Volume1 v-else :size="15" />
            </button>
        </div>

        <!-- Playlist -->
        <ul v-if="playlist.length > 1" class="k-ap-list">
            <li
                v-for="(t, i) in playlist"
                :key="t.src"
                class="k-ap-track"
                :class="{ 'is-active': i === index }"
                @click="select(i)"
            >
                <Music2 :size="13" />
                <span class="k-ap-track-title">{{ t.title || 'قطعه ' + i + 1 }}</span>
                <span v-if="t.artist" class="k-ap-track-artist">{{ t.artist }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Music2, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface KAudioTrack {
    src: string
    title?: string
    artist?: string
}

const props = withDefaults(defineProps<{
    src?: string
    title?: string
    artist?: string
    tracks?: KAudioTrack[]
    autoplay?: boolean
    muted?: boolean
}>(), {
    src: '',
    title: '',
    artist: '',
    tracks: () => [],
    autoplay: false,
    muted: false
})

const emit = defineEmits<{
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'end'): void
    (e: 'track', index: number): void
}>()

const { toPersianDigits } = usePersianNumbers()

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(props.muted)
const index = ref(0)

const playlist = computed<KAudioTrack[]>(() =>
    props.tracks.length ? props.tracks : (props.src ? [{ src: props.src, title: props.title, artist: props.artist }] : [])
)

const active = computed(() => playlist.value[index.value] ?? { src: '' })

const progress = computed(() => (duration.value ? (current.value / duration.value) * 100 : 0))

const fmt = (s: number) => {
    if (!isFinite(s)) return '۰:۰۰'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m)}:${String(sec).padStart(2, '0')}`
}

const load = () => {
    const a = audioEl.value
    if (!a) return
    a.src = active.value.src
    a.load()
    if (playing.value) a.play()
}

watch(active, load)

const toggle = () => {
    const a = audioEl.value
    if (!a || !a.src) return
    if (a.paused) { a.play(); playing.value = true; emit('play') }
    else { a.pause(); playing.value = false; emit('pause') }
}

const select = (i: number) => {
    if (i === index.value) { toggle(); return }
    index.value = i
    emit('track', i)
    if (playing.value) load()
}

const seekTo = (e: MouseEvent) => {
    const a = audioEl.value
    const el = e.currentTarget as HTMLElement
    if (!a || !duration.value) return
    const rect = el.getBoundingClientRect()
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration.value
}

const skip = (sec: number) => {
    const a = audioEl.value
    if (a) a.currentTime = Math.min(Math.max(0, a.currentTime + sec), duration.value)
}

const onEnded = () => {
    playing.value = false
    if (index.value < playlist.value.length - 1) {
        index.value++
        emit('track', index.value)
        playing.value = true
        load()
    } else {
        emit('end')
    }
}

watch(muted, (m) => { if (audioEl.value) audioEl.value.muted = m })

onMounted(() => {
    if (audioEl.value) {
        audioEl.value.muted = props.muted
        audioEl.value.volume = volume.value
        if (props.autoplay && active.value.src) audioEl.value.play()
    }
})
onUnmounted(() => { /* audio element is cleaned up by Vue */ })

defineExpose({ play: () => audioEl.value?.play(), pause: () => audioEl.value?.pause() })
</script>

<style scoped>
.k-ap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 12px 14px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
}

.k-ap-main {
    display: flex;
    align-items: center;
    gap: 12px;
}

.k-ap-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--k-primary, #1db954);
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
    padding-inline-start: 2px;
    transition: filter 0.15s ease, transform 0.15s ease;
}

.k-ap-play:hover { filter: brightness(1.08); transform: scale(1.04); }

.k-ap-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    max-width: 130px;
}

.k-ap-title {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-ap-artist {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-ap-seek {
    flex: 1;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    min-width: 60px;
}

.k-ap-seek::before {
    content: '';
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: var(--k-surface-hover, #f1f5f9);
}

.k-ap-seek-fill {
    position: absolute;
    height: 4px;
    border-radius: 4px;
    background: var(--k-primary, #1db954);
}

.k-ap-time {
    font-size: 0.62rem;
    color: var(--k-text-secondary, #64748b);
    direction: ltr;
    white-space: nowrap;
}

.k-ap-vol {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    padding: 4px;
    flex-shrink: 0;
}

.k-ap-list {
    list-style: none;
    margin: 0;
    padding: 6px 0 0;
    border-top: 1px dashed var(--k-border, #e2e8f0);
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 150px;
    overflow-y: auto;
}

.k-ap-track {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
    color: var(--k-text-secondary, #64748b);
    font-size: 0.7rem;
    transition: background 0.12s ease;
}

.k-ap-track:hover { background: var(--k-surface-hover, #f1f5f9); }

.k-ap-track.is-active {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
    font-weight: 700;
}

.k-ap-track-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-ap-track-artist {
    margin-inline-start: auto;
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
