<!-- KVideoThumbnail.vue — compact video card with hover preview, duration badge, play overlay -->
<template>
    <div class="k-vt" :class="{ 'is-hovered': hovered }" @mouseenter="hovered = true" @mouseleave="onLeave">
        <div class="k-vt-media">
            <img
                v-if="thumb || poster"
                :src="hovered && videoSrc ? undefined : (thumb || poster)"
                :alt="title"
                class="k-vt-img"
                loading="lazy"
            />
            <video
                v-if="hovered && videoSrc"
                ref="videoEl"
                :src="videoSrc"
                class="k-vt-video"
                muted
                autoplay
                loop
                preload="none"
            />
            <div v-if="!hovered || !videoSrc" class="k-vt-overlay">
                <div class="k-vt-play">
                    <Play :size="20" fill="currentColor" />
                </div>
            </div>
            <span v-if="duration" class="k-vt-duration">{{ duration }}</span>
            <span v-if="badge" class="k-vt-badge" :style="{ background: badgeColor }">{{ badge }}</span>
        </div>
        <div class="k-vt-info">
            <h4 class="k-vt-title">{{ title }}</h4>
            <p v-if="subtitle" class="k-vt-subtitle">{{ subtitle }}</p>
            <div v-if="$slots.meta" class="k-vt-meta">
                <slot name="meta" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Play } from 'lucide-vue-next'

withDefaults(defineProps<{
    thumb?: string
    poster?: string
    videoSrc?: string
    title: string
    subtitle?: string
    duration?: string
    badge?: string
    badgeColor?: string
}>(), {
    badgeColor: 'var(--k-primary, #1db954)',
})

const hovered = ref(false)
const videoEl = ref<HTMLVideoElement>()

const onLeave = () => {
    hovered.value = false
    if (videoEl.value) {
        videoEl.value.pause()
        videoEl.value.currentTime = 0
    }
}
</script>

<style scoped>
.k-vt {
    border-radius: 14px;
    overflow: hidden;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.k-vt:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}
.k-vt-media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #0f172a;
}
.k-vt-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.k-vt:hover .k-vt-img { transform: scale(1.04); }
.k-vt-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.k-vt-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.25);
    transition: background 0.2s ease;
}
.k-vt:hover .k-vt-overlay { background: rgba(0,0,0,0.15); }
.k-vt-play {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    color: var(--k-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s ease;
}
.k-vt:hover .k-vt-play { transform: scale(1.1); }
.k-vt-duration {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0,0,0,0.75);
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    direction: ltr;
}
.k-vt-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #fff;
    font-size: 0.58rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
}
.k-vt-info {
    padding: 12px 14px;
}
.k-vt-title {
    margin: 0 0 2px;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--k-text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.k-vt-subtitle {
    margin: 0;
    font-size: 0.7rem;
    color: var(--k-text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.k-vt-meta {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.66rem;
    color: var(--k-text-muted);
}
</style>
