<!-- wrappers/KMediaGallery.vue -->
<template>
    <div class="k-media-gallery" :class="[`cols-${Math.min(cols, 6)}`, { 'is-compact': compact }]">
        <button
            v-for="(item, i) in items"
            :key="i"
            type="button"
            class="k-media-item"
            :style="itemStyle(item, i)"
            :aria-label="item.caption || 'نمایش رسانه'"
            @click="openAt(i)"
        >
            <img
                v-if="item.type !== 'video'"
                :src="item.thumb || item.src"
                :alt="item.caption || ''"
                loading="lazy"
                @error="(e) => onImgError(e, i)"
            />
            <div v-else class="k-media-video">
                <Play class="icon" />
            </div>

            <!-- Hover overlay -->
            <div class="k-media-overlay">
                <ZoomIn class="icon" />
                <span v-if="item.caption" class="k-media-caption">{{ item.caption }}</span>
            </div>
        </button>

        <!-- Lightbox -->
        <KLightbox
            v-model:visible="lightboxOpen"
            :items="items"
            :start-index="lightboxIndex"
            :show-thumbnails="showThumbnails"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Play, ZoomIn } from 'lucide-vue-next'
import KLightbox, { type KLightboxItem } from '../components/KLightbox.vue'

const props = withDefaults(defineProps<{
    items: KLightboxItem[]
    cols?: number
    compact?: boolean
    showThumbnails?: boolean
}>(), {
    cols: 3,
    compact: false,
    showThumbnails: true
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openAt = (i: number) => {
    lightboxIndex.value = i
    lightboxOpen.value = true
}

/* a missing/broken image source falls back to the placeholder tile instead of
   an empty box — keeps the gallery looking intentional on slow/unreachable CDNs */
const onImgError = (e: Event, i: number) => {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'
    const item = props.items[i]
    if (item) {
        ;(img.parentElement as HTMLElement).classList.add('is-broken')
    }
}

const itemStyle = (item: KLightboxItem, i: number) => {
    // First item in non-compact mode spans 2x2 when there are enough items
    if (!props.compact && i === 0 && props.items.length > 3) {
        return { gridRow: 'span 2', gridColumn: 'span 2' }
    }
    return {}
}
</script>

<style scoped>
.k-media-gallery {
    display: grid;
    grid-template-columns: repeat(var(--k-gallery-cols, 3), 1fr);
    gap: 8px;
    width: 100%;
}

.k-media-gallery.cols-2 { --k-gallery-cols: 2; }
.k-media-gallery.cols-3 { --k-gallery-cols: 3; }
.k-media-gallery.cols-4 { --k-gallery-cols: 4; }
.k-media-gallery.cols-5 { --k-gallery-cols: 5; }
.k-media-gallery.cols-6 { --k-gallery-cols: 6; }

.k-media-item {
    position: relative;
    border: none;
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    background: var(--k-surface, #f1f5f9);
    aspect-ratio: 4 / 3;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.k-media-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.k-media-item:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}

.k-media-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.k-media-video {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e293b, #334155);
    color: #fff;
}

/* broken/missing image → placeholder tile */
.k-media-item.is-broken {
    background: linear-gradient(135deg, var(--k-surface, #f1f5f9), var(--k-surface-hover, #e2e8f0));
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-media-item.is-broken::after {
    content: '';
    width: 28px;
    height: 28px;
    background: color-mix(in srgb, var(--k-text-muted, #94a3b8) 60%, transparent);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E") center / contain no-repeat;
}

.k-media-video .icon {
    width: 32px;
    height: 32px;
    opacity: 0.9;
}

/* Overlay */
.k-media-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(15, 23, 42, 0.55);
    color: #fff;
    opacity: 0;
    transition: opacity 0.2s ease;
    padding: 10px;
    text-align: center;
}

.k-media-item:hover .k-media-overlay {
    opacity: 1;
}

.k-media-overlay .icon {
    width: 26px;
    height: 26px;
}

.k-media-caption {
    font-size: 0.75rem;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Compact */
.k-media-gallery.is-compact {
    gap: 6px;
}

.is-compact .k-media-item {
    aspect-ratio: 1;
    border-radius: 6px;
}

.is-compact .k-media-overlay .icon {
    width: 20px;
    height: 20px;
}

@media (max-width: 768px) {
    .k-media-gallery {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}
</style>
