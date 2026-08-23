<!-- components/KSplitPane.vue -->
<!--
    KSplitPane — resizable two-pane split:

      <KSplitPane v-model:size="pct" :min="20" :max="80" direction="horizontal">
        <template #first><div>…</div></template>
        <template #second><div>…</div></template>
      </KSplitPane>
-->
<template>
    <div
        ref="rootEl"
        class="k-split"
        :class="[`k-split--${direction}`, { 'is-dragging': dragging }]"
    >
        <div class="k-split-pane k-split-first" :style="firstStyle">
            <slot name="first" />
        </div>

        <div
            class="k-split-gutter"
            role="separator"
            :aria-orientation="direction === 'horizontal' ? 'horizontal' : 'vertical'"
            @mousedown="onDown"
        >
            <span class="k-split-grip" />
        </div>

        <div class="k-split-pane k-split-second" :style="secondStyle">
            <slot name="second" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
    /** first pane share (0-100) — use v-model:size */
    size?: number
    min?: number
    max?: number
    direction?: 'horizontal' | 'vertical'
    gutterSize?: number
}>(), {
    size: 50,
    min: 15,
    max: 85,
    direction: 'horizontal',
    gutterSize: 8
})

const emit = defineEmits<{
    (e: 'update:size', value: number): void
    (e: 'resize', value: number): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const internalSize = ref(props.size)

const firstStyle = computed(() =>
    props.direction === 'horizontal'
        ? { width: `calc(${internalSize.value}% - ${props.gutterSize / 2}px)`, height: '100%' }
        : { height: `calc(${internalSize.value}% - ${props.gutterSize / 2}px)`, width: '100%' }
)

const secondStyle = computed(() =>
    props.direction === 'horizontal'
        ? { width: `calc(${100 - internalSize.value}% - ${props.gutterSize / 2}px)`, height: '100%' }
        : { height: `calc(${100 - internalSize.value}% - ${props.gutterSize / 2}px)`, width: '100%' }
)

const clamp = (v: number) => Math.min(props.max, Math.max(props.min, v))

const onDown = (e: MouseEvent) => {
    e.preventDefault()
    dragging.value = true
    const onMove = (ev: MouseEvent) => {
        const rect = rootEl.value?.getBoundingClientRect()
        if (!rect) return
        let ratio =
            props.direction === 'horizontal'
                ? (ev.clientX - rect.left) / rect.width
                : (ev.clientY - rect.top) / rect.height
        // in RTL the first pane is on the right — mirror the drag so the
        // boundary follows the cursor and the first pane grows on drag-left
        if (props.direction === 'horizontal' && getComputedStyle(rootEl.value!).direction === 'rtl') {
            ratio = 1 - ratio
        }
        internalSize.value = clamp(Math.round(ratio * 1000) / 10)
        emit('update:size', internalSize.value)
        emit('resize', internalSize.value)
    }
    const onUp = () => {
        dragging.value = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}

// keep the internal size in sync with the parent's v-model (drag emits, parent may also set it)
watch(() => props.size, (v) => { internalSize.value = clamp(v) })

onMounted(() => { internalSize.value = clamp(props.size) })
onUnmounted(() => { dragging.value = false })
</script>

<style scoped>
.k-split {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 0;
}

.k-split--horizontal { flex-direction: row; }
.k-split--vertical { flex-direction: column; }

.k-split-pane {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    box-sizing: border-box;
}

.k-split-gutter {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    cursor: col-resize;
    transition: background 0.15s ease;
}

.k-split--vertical .k-split-gutter {
    cursor: row-resize;
    height: var(--gutter, 8px);
}

.k-split--horizontal .k-split-gutter {
    width: var(--gutter, 8px);
}

.k-split-gutter:hover,
.k-split.is-dragging .k-split-gutter {
    background: var(--k-primary-light, #e3f8ec);
    border-color: var(--k-primary, #1db954);
}

.k-split-grip {
    width: 3px;
    height: 22px;
    border-radius: 3px;
    background: var(--k-text-muted, #94a3b8);
    opacity: 0.5;
}

.k-split--vertical .k-split-grip {
    width: 22px;
    height: 3px;
}
</style>
