<!-- KInfiniteScroll.vue — scroll-to-load-more with loading sentinel -->
<template>
    <div class="k-inf">
        <slot />
        <div ref="sentinel" class="k-inf-sentinel">
            <div v-if="loading" class="k-inf-loading">
                <KSpinner size="sm" />
                <span>{{ loadingText }}</span>
            </div>
            <div v-else-if="finished" class="k-inf-finished">
                <span>{{ finishedText }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import KSpinner from './KSpinner.vue'

const props = withDefaults(defineProps<{
    loading?: boolean
    finished?: boolean
    threshold?: number
    loadingText?: string
    finishedText?: string
}>(), {
    loading: false,
    finished: false,
    threshold: 100,
    loadingText: 'در حال بارگذاری…',
    finishedText: 'همه موارد بارگذاری شد',
})

const emit = defineEmits<{ load: [] }>()

const sentinel = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

onMounted(() => {
    if (!sentinel.value) return
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting && !props.loading && !props.finished) {
                emit('load')
            }
        },
        { rootMargin: `${props.threshold}px` }
    )
    observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.k-inf-sentinel {
    padding: 20px 0;
    display: flex;
    justify-content: center;
}
.k-inf-loading, .k-inf-finished {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: var(--k-text-muted);
}
.k-inf-finished {
    opacity: 0.6;
}
</style>
