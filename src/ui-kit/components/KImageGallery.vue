<!-- KImageGallery.vue — responsive image grid with hover effects + built-in lightbox -->
<template>
    <div class="k-ig" :class="`k-ig-${layout}`">
        <div
            v-for="(img, i) in images"
            :key="i"
            class="k-ig-item"
            :class="{ 'is-featured': i === 0 && featured }"
            @click="open(i)"
        >
            <img
                :src="img.thumb || img.src"
                :alt="img.alt || ''"
                class="k-ig-img"
                loading="lazy"
            />
            <div class="k-ig-overlay">
                <div class="k-ig-actions">
                    <button type="button" class="k-ig-action" title="مشاهده" @click.stop="open(i)">
                        <Expand :size="16" />
                    </button>
                    <button v-if="img.download" type="button" class="k-ig-action" title="دانلود" @click.stop="$emit('download', img)">
                        <Download :size="16" />
                    </button>
                </div>
                <div v-if="img.caption || img.label" class="k-ig-caption">
                    {{ img.caption || img.label }}
                </div>
            </div>
            <span v-if="img.badge" class="k-ig-badge">{{ img.badge }}</span>
        </div>

        <!-- lightbox (lazily mounted → safe to teleport into the hub) -->
        <Teleport to="#k-teleport-hub">
            <div
                v-if="active !== null"
                class="k-ui k-ig-lightbox"
                :data-theme="theme"
                role="dialog"
                aria-modal="true"
                @click.self="close"
            >
                <button type="button" class="k-ig-lb-btn is-close" title="بستن" @click="close">
                    <X :size="20" />
                </button>

                <button
                    v-if="images.length > 1"
                    type="button" class="k-ig-lb-btn is-nav is-prev"
                    title="قبلی" @click.stop="step(-1)"
                >
                    <ChevronRight :size="26" />
                </button>

                <figure class="k-ig-lb-figure">
                    <img :src="current.src" :alt="current.alt || ''" class="k-ig-lb-img" />
                    <figcaption v-if="current.caption || current.label || images.length > 1" class="k-ig-lb-caption">
                        <span>{{ current.caption || current.label || '' }}</span>
                        <span class="k-ig-lb-count">{{ active + 1 }} / {{ images.length }}</span>
                    </figcaption>
                </figure>

                <button
                    v-if="images.length > 1"
                    type="button" class="k-ig-lb-btn is-nav is-next"
                    title="بعدی" @click.stop="step(1)"
                >
                    <ChevronLeft :size="26" />
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Expand, Download, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'

export interface GalleryImage {
    src: string
    thumb?: string
    alt?: string
    caption?: string
    label?: string
    badge?: string
    download?: string
}

const props = defineProps<{
    images: GalleryImage[]
    layout?: 'grid' | 'masonry' | 'rows' | 'mosaic'
    featured?: boolean
}>()

const emit = defineEmits<{
    select: [payload: { image: GalleryImage; index: number }]
    download: [image: GalleryImage]
}>()

const theme = useKitTheme()

const active = ref<number | null>(null)
const current = computed<GalleryImage>(() => props.images[active.value ?? 0] || ({} as GalleryImage))

const open = (i: number) => {
    active.value = i
    emit('select', { image: props.images[i], index: i })
}
const close = () => { active.value = null }
const step = (dir: number) => {
    if (active.value === null || !props.images.length) return
    active.value = (active.value + dir + props.images.length) % props.images.length
}

const onKey = (e: KeyboardEvent) => {
    if (active.value === null) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft') step(1)
    else if (e.key === 'ArrowRight') step(-1)
}

// lock page scroll while the lightbox is open
watch(active, v => { document.documentElement.style.overflow = v === null ? '' : 'hidden' })

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.k-ig {
    display: grid;
    gap: 8px;
}
.k-ig-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.k-ig-masonry {
    columns: 3;
    column-gap: 8px;
}
.k-ig-masonry .k-ig-item {
    break-inside: avoid;
    margin-bottom: 8px;
}
.k-ig-rows {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
/* asymmetric: first image is 2x2, the rest fill in around it */
.k-ig-mosaic {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 110px;
}
.k-ig-mosaic .k-ig-item {
    aspect-ratio: auto;
}
.k-ig-mosaic .k-ig-item:first-child {
    grid-column: span 2;
    grid-row: span 2;
}
.k-ig-item {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 1;
    background: var(--k-surface, #f1f5f9);
}
.k-ig-item.is-featured {
    grid-column: 1 / -1;
    aspect-ratio: 2 / 1;
}
.k-ig-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.k-ig-item:hover .k-ig-img { transform: scale(1.05); }
.k-ig-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 40%, rgba(0,0,0,0.6));
    opacity: 0;
    transition: opacity 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
}
.k-ig-item:hover .k-ig-overlay { opacity: 1; }
.k-ig-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 6px;
}
/* theme-aware buttons — never hardcode white/black here */
.k-ig-action {
    width: 30px;
    height: 30px;
    border: 1px solid var(--k-border);
    border-radius: 8px;
    background: var(--k-surface, #fff);
    color: var(--k-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}
.k-ig-action:hover {
    background: var(--k-surface-hover);
    color: var(--k-primary);
}
.k-ig-caption {
    color: #fff;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.4;
}
.k-ig-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.56rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
}

/* ── lightbox ── */
.k-ig-lightbox {
    position: fixed;
    inset: 0;
    z-index: 21000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.86);
    font-family: inherit;
}
.k-ig-lb-figure {
    margin: 0;
    max-width: min(1100px, 92vw);
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}
.k-ig-lb-img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 12px;
    display: block;
}
.k-ig-lb-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    color: #fff;
    font-size: 0.78rem;
}
.k-ig-lb-count {
    direction: ltr;
    font-size: 0.74rem;
    color: rgba(255, 255, 255, 0.75);
}
.k-ig-lb-btn {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    transition: background 0.15s;
}
.k-ig-lb-btn:hover { background: rgba(255, 255, 255, 0.24); }
.k-ig-lb-btn.is-close { top: 18px; inset-inline-end: 18px; }
/* logical sides: in RTL "previous" sits on the right, which is what Persian users expect */
.k-ig-lb-btn.is-prev { inset-inline-start: 16px; }
.k-ig-lb-btn.is-next { inset-inline-end: 16px; }

@media (max-width: 640px) {
    .k-ig-masonry { columns: 2; }
    .k-ig-grid { grid-template-columns: repeat(2, 1fr); }
    .k-ig-mosaic { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 92px; }
    .k-ig-lb-btn { width: 36px; height: 36px; }
}
</style>
