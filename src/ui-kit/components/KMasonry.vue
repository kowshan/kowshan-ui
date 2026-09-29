<!-- KMasonry.vue — Pinterest-style masonry grid with optional variable heights -->
<template>
    <div ref="root" class="k-masonry" :style="{ gap: gap + 'px' }">
        <div
            v-for="(col, ci) in cols"
            :key="ci"
            class="k-masonry-col"
            :style="columnStyle(ci)"
        >
            <div
                v-for="(item, ri) in col"
                :key="ri"
                class="k-masonry-item"
                :style="getItemStyle(ci, ri)"
            >
                <slot :item="item" :index="ci * cols.length + ri" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
    items: any[]
    columns?: number
    gap?: number
    minItemHeight?: number
    maxItemHeight?: number
    /** Push every other column down by n px — the staggered "wall" look. The
     *  first column is never offset, the second is, the third is not, and so on. */
    stagger?: number
}>(), {
    columns: 3,
    gap: 16,
    minItemHeight: 0,
    maxItemHeight: 0,
    stagger: 0,
})

const root = ref<HTMLElement>()
const width = ref(0)
let ro: ResizeObserver | null = null

const responsiveColumns = computed(() => {
    if (width.value < 480) return 1
    if (width.value < 768) return 2
    return props.columns
})

// NOTE: named `cols` — a computed called `columns` collides with the `columns` prop
// and the template would resolve the prop (a number) instead of the column lists.
const cols = computed(() => {
    const list: any[][] = Array.from({ length: responsiveColumns.value }, () => [])
    props.items.forEach((item, i) => {
        list[i % list.length].push(item)
    })
    return list
})

const hasVarHeight = computed(() => props.maxItemHeight > props.minItemHeight && props.maxItemHeight > 0)

/** Column box: the shared gap, plus the stagger offset on every other column. */
const columnStyle = (col: number) => ({
    gap: `${props.gap}px`,
    ...(props.stagger ? { paddingBlockStart: `${col % 2 ? props.stagger : 0}px` } : {}),
})

// Generate pseudo-random but deterministic heights based on index
const getItemStyle = (col: number, row: number) => {
    if (!hasVarHeight.value) return {}
    const seed = col * 100 + row
    const hash = ((seed * 2654435761) >>> 0) / 4294967295 // Knuth multiplicative hash
    const h = props.minItemHeight + hash * (props.maxItemHeight - props.minItemHeight)
    return { minHeight: `${Math.round(h)}px` }
}

onMounted(() => {
    const el = root.value
    if (!el) return
    ro = new ResizeObserver(entries => {
        for (const e of entries) width.value = e.contentRect.width
    })
    ro.observe(el)
    width.value = el.clientWidth
})

onUnmounted(() => ro?.disconnect())
</script>

<style scoped>
.k-masonry {
    display: flex;
    width: 100%;
}
.k-masonry-col {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
