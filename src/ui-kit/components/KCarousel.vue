<!-- KCarousel — swipeable image/card carousel with arrows, dots, autoplay -->
<template>
    <div
        class="k-carousel"
        :class="{ 'is-auto': autoPlay }"
        @mouseenter="pauseAuto"
        @mouseleave="resumeAuto"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
    >
        <!-- Track -->
        <div dir="ltr" class="k-carousel-track" :style="trackStyle" ref="trackRef">
            <div
                v-for="(item, i) in items"
                :key="i"
                class="k-carousel-slide"
                :class="{ 'is-active': i === currentIndex }"
            >
                <slot :name="'slide-' + i" :item="item" :index="i">
                    <div class="k-carousel-default-slide">
                        <img v-if="item.image" :src="item.image" :alt="item.alt || ''" draggable="false" />
                        <div v-else class="k-carousel-placeholder">
                            <slot name="placeholder" :index="i">
                                <ImageIcon :size="32" />
                            </slot>
                        </div>
                        <div v-if="item.title || item.description" class="k-carousel-caption">
                            <h3 v-if="item.title" class="k-carousel-title">{{ item.title }}</h3>
                            <p v-if="item.description" class="k-carousel-desc">{{ item.description }}</p>
                        </div>
                    </div>
                </slot>
            </div>
        </div>

        <!-- Arrows -->
        <button v-if="showArrows" type="button" class="k-carousel-arrow k-carousel-arrow-right" @click="prev">
            <ChevronRight :size="20" />
        </button>
        <button v-if="showArrows" type="button" class="k-carousel-arrow k-carousel-arrow-left" @click="next">
            <ChevronLeft :size="20" />
        </button>

        <!-- Dots -->
        <div v-if="showDots" class="k-carousel-dots">
            <button
                v-for="(_, i) in items"
                :key="i"
                type="button"
                class="k-carousel-dot"
                :class="{ 'is-active': i === currentIndex }"
                @click="goTo(i)"
            />
        </div>

        <!-- Counter -->
        <div v-if="showCounter" class="k-carousel-counter">
            {{ currentIndex + 1 }} / {{ items.length }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronRight, ChevronLeft, ImageIcon } from 'lucide-vue-next'

export interface CarouselItem {
    image?: string
    alt?: string
    title?: string
    description?: string
}

const props = withDefaults(defineProps<{
    items: CarouselItem[]
    modelValue?: number
    autoPlay?: boolean
    interval?: number
    loop?: boolean
    showArrows?: boolean
    showDots?: boolean
    showCounter?: boolean
}>(), {
    autoPlay: false,
    interval: 4000,
    loop: true,
    showArrows: true,
    showDots: true,
    showCounter: false,
    modelValue: 0
})

const emit = defineEmits<{
    'update:modelValue': [index: number]
    'change': [index: number]
}>()

const currentIndex = ref(props.modelValue)
const trackRef = ref<HTMLElement | null>(null)
let autoTimer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0
let touchDelta = 0

const trackStyle = computed(() => ({
    transform: `translateX(${(-currentIndex.value * 100) + (touchDelta / (trackRef.value?.offsetWidth || 1)) * 100}%)`,
    transition: touchDelta !== 0 ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
}))

const goTo = (index: number) => {
    currentIndex.value = index
    emit('update:modelValue', index)
    emit('change', index)
}

const next = () => {
    if (currentIndex.value < props.items.length - 1) {
        goTo(currentIndex.value + 1)
    } else if (props.loop) {
        goTo(0)
    }
}

const prev = () => {
    if (currentIndex.value > 0) {
        goTo(currentIndex.value - 1)
    } else if (props.loop) {
        goTo(props.items.length - 1)
    }
}

const startAuto = () => {
    if (!props.autoPlay) return
    autoTimer = setInterval(next, props.interval)
}

const pauseAuto = () => { if (autoTimer) clearInterval(autoTimer) }
const resumeAuto = () => { pauseAuto(); startAuto() }

const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; touchDelta = 0 }
const onTouchMove = (e: TouchEvent) => { touchDelta = e.touches[0].clientX - touchStartX }
const onTouchEnd = () => {
    if (Math.abs(touchDelta) > 50) {
        touchDelta < 0 ? next() : prev()
    }
    touchDelta = 0
}

watch(() => props.modelValue, (v) => { if (v !== currentIndex.value) currentIndex.value = v })

onMounted(() => startAuto())
onUnmounted(() => pauseAuto())

defineExpose({ next, prev, goTo, currentIndex })
</script>

<style scoped>
.k-carousel { position: relative; overflow: hidden; border-radius: var(--k-radius-md); }

.k-carousel-track {
    display: flex; width: 100%;
}

.k-carousel-slide { min-width: 100%; flex-shrink: 0; }

.k-carousel-default-slide { position: relative; width: 100%; }
.k-carousel-default-slide img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    aspect-ratio: 16/9; user-select: none;
}

.k-carousel-placeholder {
    width: 100%; aspect-ratio: 16/9;
    display: flex; align-items: center; justify-content: center;
    background: var(--k-surface); color: var(--k-text-muted);
}

.k-carousel-caption {
    position: absolute; bottom: 12px; right: 12px;
    max-width: min(60%, 320px);
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(6px);
    border-radius: 10px;
    padding: 10px 14px; color: #fff;
    text-align: right;
}
.k-carousel-title { margin: 0 0 4px; font-size: 0.95rem; font-weight: 700; }
.k-carousel-desc { margin: 0; font-size: 0.78rem; opacity: 0.85; }

.k-carousel-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: rgba(255,255,255,0.9); color: #1e293b;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 2; transition: all 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.k-carousel-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.08); }
.k-carousel-arrow-right { inset-inline-start: 10px; }
.k-carousel-arrow-left { inset-inline-end: 10px; }

.k-carousel-dots {
    position: absolute; bottom: 14px; left: 16px;
    display: flex; gap: 6px; z-index: 2;
}
.k-carousel-dot {
    width: 8px; height: 8px; border-radius: 50%; border: none;
    background: rgba(255,255,255,0.5); cursor: pointer;
    transition: all 0.2s; padding: 0;
}
.k-carousel-dot.is-active { background: #fff; width: 20px; border-radius: 4px; }

.k-carousel-counter {
    position: absolute; top: 10px; left: 10px; z-index: 2;
    background: rgba(0,0,0,0.5); color: #fff; padding: 3px 10px;
    border-radius: 999px; font-size: 0.7rem; font-weight: 600;
}
</style>
