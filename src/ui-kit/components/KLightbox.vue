<!-- components/KLightbox.vue -->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="lightbox-fade">
            <div
                v-if="visible"
                class="k-ui k-lightbox"
                :data-theme="theme"
                role="dialog"
                aria-modal="true"
                :aria-label="currentItem?.caption || 'نمایش رسانه'"
                @click.self="close"
                @keydown.esc="close"
            >
                <!-- Close -->
                <button class="k-lightbox-btn close" type="button" aria-label="بستن" @click.stop="close">
                    <X class="icon" />
                </button>

                <!-- Prev / Next -->
                <button
                    v-if="items.length > 1"
                    class="k-lightbox-btn nav prev"
                    type="button"
                    aria-label="قبلی"
                    @click.stop="prev"
                >
                    <ChevronRight class="icon" />
                </button>
                <button
                    v-if="items.length > 1"
                    class="k-lightbox-btn nav next"
                    type="button"
                    aria-label="بعدی"
                    @click.stop="next"
                >
                    <ChevronLeft class="icon" />
                </button>

                <!-- Media stage -->
                <div
                    class="k-lightbox-stage"
                    @dblclick.self="toggleZoom"
                    @mousemove="onStageMouseMove"
                >
                    <Transition name="lightbox-slide" mode="out-in">
                        <div dir="ltr" :key="currentIndex" class="k-lightbox-media" :class="{ zoomed: zoomed }">
                            <!-- Video -->
                            <video
                                v-if="currentItem && currentItem.type === 'video'"
                                :src="currentItem.src"
                                :poster="currentItem.poster"
                                class="k-lightbox-video"
                                controls
                                autoplay
                                playsinline
                            ></video>

                            <!-- Image -->
                            <img
                                v-else-if="currentItem"
                                :src="currentItem.src"
                                :alt="currentItem.caption || ''"
                                class="k-lightbox-img"
                                @click="toggleZoom"
                            />
                        </div>
                    </Transition>
                </div>

                <!-- Caption + counter -->
                <div class="k-lightbox-footer">
                    <span class="k-lightbox-counter">{{ currentIndex + 1 }} / {{ items.length }}</span>
                    <span v-if="currentItem?.caption" class="k-lightbox-caption">{{ currentItem.caption }}</span>
                    <span v-if="zoomed" class="k-lightbox-zoom-hint">برای کوچک‌نمایی کلیک کنید</span>
                    <span v-else-if="currentItem && currentItem.type === 'image'" class="k-lightbox-zoom-hint">برای بزرگ‌نمایی دوبار کلیک کنید</span>
                </div>

                <!-- Thumbnails -->
                <div v-if="items.length > 1 && showThumbnails" class="k-lightbox-thumbs">
                    <button
                        v-for="(item, i) in items"
                        :key="i"
                        type="button"
                        class="k-lightbox-thumb"
                        :class="{ active: i === currentIndex }"
                        @click="goTo(i)"
                    >
                        <img v-if="item.type !== 'video'" :src="item.thumb || item.src" :alt="item.caption || ''" />
                        <span v-else class="thumb-video"><Play class="icon" /></span>
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'

const theme = useKitTheme()

export interface KLightboxItem {
    src: string
    type?: 'image' | 'video'
    caption?: string
    poster?: string
    thumb?: string
}

const props = withDefaults(defineProps<{
    visible: boolean
    items: KLightboxItem[]
    startIndex?: number
    showThumbnails?: boolean
}>(), {
    startIndex: 0,
    showThumbnails: true
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'close': []
    'change': [index: number]
}>()

const currentIndex = ref(props.startIndex)
const zoomed = ref(false)

const currentItem = computed(() => props.items[currentIndex.value] || null)


const close = () => {
    zoomed.value = false
    emits('update:visible', false)
    emits('close')
}

const goTo = (i: number) => {
    if (i < 0 || i >= props.items.length) return
    currentIndex.value = i
    zoomed.value = false
    emits('change', i)
}

const next = () => goTo((currentIndex.value + 1) % props.items.length)
const prev = () => goTo((currentIndex.value - 1 + props.items.length) % props.items.length)

const toggleZoom = () => {
    if (currentItem.value?.type === 'image') zoomed.value = !zoomed.value
}

// Keyboard navigation
const onKeydown = (e: KeyboardEvent) => {
    if (!props.visible) return
    switch (e.key) {
        case 'Escape':
            close()
            break
        case 'ArrowLeft':
            next()
            break
        case 'ArrowRight':
            prev()
            break
    }
}

// Prevent body scroll while open
watch(() => props.visible, (v) => {
    document.body.style.overflow = v ? 'hidden' : ''
})

// Reset to startIndex when opened
watch(() => props.visible, (v) => {
    if (v) {
        currentIndex.value = props.startIndex
        zoomed.value = false
    }
})

// Pan when zoomed
const onStageMouseMove = (e: MouseEvent) => {
    if (!zoomed.value) return
    const stage = (e.currentTarget as HTMLElement)
    const rect = stage.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    stage.style.setProperty('--zoom-x', `${x}%`)
    stage.style.setProperty('--zoom-y', `${y}%`)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.k-lightbox {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    direction: ltr;
}

/* Buttons */
.k-lightbox-btn {
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    transition: background 0.2s ease;
    backdrop-filter: blur(4px);
}

.k-lightbox-btn:hover {
    background: rgba(255, 255, 255, 0.25);
}

.k-lightbox-btn:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
}

.k-lightbox-btn.close {
    top: 20px;
    right: 20px;
}

.k-lightbox-btn.nav {
    top: 50%;
    transform: translateY(-50%);
}

.k-lightbox-btn.nav.prev {
    right: 20px;
}

.k-lightbox-btn.nav.next {
    left: 20px;
}

.icon {
    width: 20px;
    height: 20px;
}

/* Stage */
.k-lightbox-stage {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.k-lightbox-media {
    max-width: 90%;
    max-height: 85%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-lightbox-media.zoomed {
    max-width: none;
    max-height: none;
    transform-origin: var(--zoom-x, 50%) var(--zoom-y, 50%);
}

.k-lightbox-img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 4px;
    cursor: zoom-in;
    transition: transform 0.2s ease;
    user-select: none;
}

.k-lightbox-media.zoomed .k-lightbox-img {
    max-width: none;
    max-height: none;
    transform: scale(2);
    cursor: zoom-out;
}

.k-lightbox-video {
    max-width: 90vw;
    max-height: 85vh;
    border-radius: 4px;
    background: #000;
}

/* Footer */
.k-lightbox-footer {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 16px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.85rem;
    direction: rtl;
    max-width: 90vw;
    text-align: center;
    flex-wrap: wrap;
    justify-content: center;
}

.k-lightbox-counter {
    font-weight: 600;
    direction: ltr;
}

.k-lightbox-caption {
    color: #fff;
}

.k-lightbox-zoom-hint {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.55);
}

/* Thumbnails */
.k-lightbox-thumbs {
    position: absolute;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 8px;
    max-width: 90vw;
    overflow-x: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}

.k-lightbox-thumb {
    width: 56px;
    height: 42px;
    border: 2px solid transparent;
    border-radius: 6px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    background: #222;
    flex-shrink: 0;
    transition: border-color 0.15s ease;
}

.k-lightbox-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.k-lightbox-thumb.active {
    border-color: #fff;
}

.thumb-video {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
}

/* Transitions */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
    transition: opacity 0.25s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
    opacity: 0;
}

.lightbox-slide-enter-active,
.lightbox-slide-leave-active {
    transition: all 0.2s ease;
}

.lightbox-slide-enter-from {
    opacity: 0;
    transform: scale(0.96);
}

.lightbox-slide-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

@media (max-width: 640px) {
    .k-lightbox-thumbs {
        display: none;
    }
}
</style>
