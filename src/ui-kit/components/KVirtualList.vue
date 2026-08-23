<!-- components/KVirtualList.vue -->
<!--
    KVirtualList — windowed rendering for long lists (fixed row height):

      <KVirtualList :items="rows" :item-height="48" :height="360">
        <template #default="{ item, index }">
          <div>{{ item.name }}</div>
        </template>
      </KVirtualList>
-->
<template>
    <div
        ref="containerEl"
        class="k-vlist"
        :style="{ height: height + 'px', maxHeight: maxHeight }"
        @scroll.passive="onScroll"
    >
        <div
            class="k-vlist-spacer"
            :style="{ height: items.length * itemHeight + 'px' }"
        >
            <div
                class="k-vlist-window"
                :style="{ transform: `translateY(${offset}px)` }"
            >
                <div
                    v-for="(item, i) in visible"
                    :key="keyOf(item, visibleStart + i)"
                    class="k-vlist-row"
                    :style="{ height: itemHeight + 'px' }"
                >
                    <slot :item="item" :index="visibleStart + i" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onScopeDispose } from 'vue'

const props = withDefaults(defineProps<{
    items?: any[]
    itemHeight?: number
    /** fixed pixel height of the scroll container */
    height?: number
    /** CSS max-height (overrides height when set) */
    maxHeight?: string
    /** extra rows rendered above/below the viewport */
    buffer?: number
    itemKey?: (item: any, index: number) => string | number
}>(), {
    items: () => [],
    itemHeight: 44,
    height: 320,
    maxHeight: '',
    buffer: 4,
    itemKey: undefined
})

const containerEl = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportH = ref(0)

const keyOf = (item: any, index: number) =>
    props.itemKey ? props.itemKey(item, index) : index

const start = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer))
const end = computed(() => Math.min(props.items.length, Math.ceil((scrollTop.value + viewportH.value) / props.itemHeight) + props.buffer))

const visible = computed(() => props.items.slice(start.value, end.value))
const visibleStart = computed(() => start.value)
const offset = computed(() => start.value * props.itemHeight)

const onScroll = () => {
    scrollTop.value = containerEl.value?.scrollTop ?? 0
}

/* measure via ResizeObserver — its initial callback delivers the size
   asynchronously (before the next paint), so mounting never forces a
   synchronous reflow; if the element is hidden (0 height) it waits
   until it becomes visible instead of trusting a stale read */
onMounted(() => {
    const el = containerEl.value
    if (!el) return
    const ro = new ResizeObserver(() => {
        const h = el.clientHeight
        if (h > 0) viewportH.value = h
    })
    ro.observe(el)
    onScopeDispose(() => ro.disconnect())
})
</script>

<style scoped>
.k-vlist {
    width: 100%;
    overflow-y: auto;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
}

.k-vlist-spacer {
    position: relative;
    width: 100%;
}

.k-vlist-window {
    position: absolute;
    top: 0;
    inset-inline: 0;
    will-change: transform;
}

.k-vlist-row {
    display: flex;
    align-items: center;
    padding-inline: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    color: var(--k-text-primary, #1e293b);
    font-size: 0.78rem;
}

.k-vlist-row:last-child { border-bottom: none; }
</style>
