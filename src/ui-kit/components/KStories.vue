<!-- components/KStories.vue -->
<template>
    <div class="k-stories" :class="{ 'is-fullscreen': fullscreen }">
        <!-- Avatar rail -->
        <div class="k-stories-rail">
            <button
                v-for="(story, i) in stories"
                :key="story.id ?? i"
                type="button"
                class="k-story-avatar"
                :class="{ 'is-seen': seen[i], 'is-active': fullscreen && viewerIndex === i }"
                :aria-label="story.name"
                @click="openAt(i)"
            >
                <span class="k-story-ring">
                    <KAvatar
                        :src="story.avatar"
                        :name="story.name"
                        :size="storySize"
                        :icon="story.icon"
                    />
                </span>
                <span class="k-story-name">{{ story.name }}</span>
            </button>
        </div>

        <!-- Fullscreen viewer -->
        <Teleport to="body">
            <Transition name="k-stories-fade">
                <div v-if="fullscreen" class="k-ui k-stories-viewer" :data-theme="theme" role="dialog" aria-modal="true">
                    <!-- Progress bars -->
                    <div class="k-stories-progress">
                        <div
                            v-for="(seg, si) in currentStory.media"
                            :key="si"
                            class="k-story-progress-track"
                            :class="{ 'is-active': si === segIndex, 'is-done': si < segIndex }"
                        >
                            <div
                                v-if="si === segIndex"
                                class="k-story-progress-fill"
                                :style="{ animationDuration: `${segDuration}ms` }"
                                @animationend="next"
                            ></div>
                        </div>
                    </div>

                    <!-- Header -->
                    <div class="k-stories-viewer-head">
                        <div class="k-stories-author">
                            <KAvatar :src="currentStory.avatar" :name="currentStory.name" :size="'sm'" />
                            <span class="k-stories-author-name">{{ currentStory.name }}</span>
                        </div>
                        <button type="button" class="k-stories-close" aria-label="بستن" @click="close">
                            <X class="icon" />
                        </button>
                    </div>

                    <!-- Media stage -->
                    <div class="k-stories-stage" @click="onStageClick">
                        <!-- Prev / next hit zones -->
                        <div class="k-stories-zone is-prev"></div>
                        <div class="k-stories-zone is-next"></div>

                        <Transition name="k-stories-media" mode="out-in">
                            <img
                                v-if="currentSegment.type !== 'video'"
                                :key="segIndex"
                                :src="currentSegment.src"
                                :alt="currentSegment.caption || ''"
                                class="k-stories-media"
                            />
                            <video
                                v-else
                                :key="segIndex"
                                :src="currentSegment.src"
                                :poster="currentSegment.poster"
                                class="k-stories-media"
                                controls
                                autoplay
                                playsinline
                            ></video>
                        </Transition>
                    </div>

                    <!-- Caption -->
                    <div v-if="currentSegment.caption" class="k-stories-caption">
                        {{ currentSegment.caption }}
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { X } from 'lucide-vue-next'
import KAvatar from './KAvatar.vue'
import { useKitTheme } from '../composables/useKitTheme'

const theme = useKitTheme()

export interface KStoryMedia {
    type?: 'image' | 'video'
    src: string
    caption?: string
    poster?: string
}

export interface KStory {
    id?: string | number
    name: string
    avatar?: string
    icon?: any
    media: KStoryMedia[]
}

const props = withDefaults(defineProps<{
    stories: KStory[]
    size?: 'sm' | 'md' | 'lg'
    /** ms per image segment */
    duration?: number
}>(), {
    size: 'md',
    duration: 4000
})

const storySize = computed(() => props.size)

const fullscreen = ref(false)
const viewerIndex = ref(0)
const segIndex = ref(0)
const seen = ref<boolean[]>([])

const segDuration = computed(() => props.duration)

const currentStory = computed(() => props.stories[viewerIndex.value] || { name: '', media: [] })
const currentSegment = computed(() => currentStory.value.media[segIndex.value] || { src: '' })

/* ── Navigation ── */
const openAt = (i: number) => {
    viewerIndex.value = i
    segIndex.value = 0
    fullscreen.value = true
    document.body.style.overflow = 'hidden'
}

const close = () => {
    fullscreen.value = false
    document.body.style.overflow = ''
}

const next = () => {
    // next segment, or next story, or close
    if (segIndex.value < currentStory.value.media.length - 1) {
        segIndex.value++
    } else if (viewerIndex.value < props.stories.length - 1) {
        seen.value[viewerIndex.value] = true
        viewerIndex.value++
        segIndex.value = 0
    } else {
        seen.value[viewerIndex.value] = true
        close()
    }
}

const prev = () => {
    if (segIndex.value > 0) {
        segIndex.value--
    } else if (viewerIndex.value > 0) {
        viewerIndex.value--
        segIndex.value = Math.max(0, props.stories[viewerIndex.value]?.media.length - 1 || 0)
    }
}

/* Click zones: right two-thirds = next, left third = prev (RTL-aware) */
const onStageClick = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 3) next()
    else prev()
}

/* Keyboard */
const onKeydown = (e: KeyboardEvent) => {
    if (!fullscreen.value) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
}

onUnmounted(() => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
})

onMounted(() => {
    document.addEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.k-stories {
    width: 100%;
}

/* ── Rail ── */
.k-stories-rail {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 4px;
    scrollbar-width: none;
}

.k-stories-rail::-webkit-scrollbar {
    display: none;
}

.k-story-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    min-width: 68px;
    font-family: inherit;
}

.k-story-ring {
    padding: 2.5px;
    border-radius: 50%;
    background: conic-gradient(from 90deg, #1db954, #f59e0b, #ef4444, #8b5cf6, #1db954);
    display: inline-flex;
}

.k-story-avatar.is-seen .k-story-ring {
    background: var(--k-border, #e2e8f0);
}

.k-story-avatar.is-active .k-story-ring {
    box-shadow: 0 0 0 3px color-mix(in srgb, #1db954 30%, transparent);
}

.k-story-name {
    font-size: 0.66rem;
    color: var(--k-text-secondary, #64748b);
    max-width: 68px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ── Viewer ── */
.k-stories-viewer {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: #000;
    display: flex;
    flex-direction: column;
}

.k-stories-progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 4px;
    padding: 10px 12px;
    z-index: 10;
}

.k-story-progress-track {
    flex: 1;
    height: 3px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.25);
    overflow: hidden;
}

.k-story-progress-track.is-done {
    background: rgba(255, 255, 255, 0.85);
}

.k-story-progress-fill {
    height: 100%;
    background: #fff;
    border-radius: 3px;
    animation-name: k-story-progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    transform-origin: right;
}

@keyframes k-story-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}

.k-stories-viewer-head {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 10;
}

.k-stories-author {
    display: flex;
    align-items: center;
    gap: 10px;
}

.k-stories-author-name {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
}

.k-stories-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    transition: background 0.15s ease;
}

.k-stories-close:hover {
    background: rgba(255, 255, 255, 0.25);
}

.k-stories-close .icon {
    width: 18px;
    height: 18px;
}

/* Stage */
.k-stories-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 0;
}

.k-stories-media {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
}

.k-stories-zone {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 5;
}

.k-stories-zone.is-prev {
    left: 0;
    width: 33%;
}

.k-stories-zone.is-next {
    right: 0;
    width: 67%;
}

.k-stories-caption {
    text-align: center;
    padding: 14px 20px 26px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.85rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

/* Transitions */
.k-stories-fade-enter-active,
.k-stories-fade-leave-active {
    transition: opacity 0.2s ease;
}

.k-stories-fade-enter-from,
.k-stories-fade-leave-to {
    opacity: 0;
}

.k-stories-media-enter-active,
.k-stories-media-leave-active {
    transition: all 0.18s ease;
}

.k-stories-media-enter-from {
    opacity: 0;
    transform: scale(1.04);
}

.k-stories-media-leave-to {
    opacity: 0;
    transform: scale(0.98);
}
</style>
