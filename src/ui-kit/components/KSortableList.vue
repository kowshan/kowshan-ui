<!-- KSortableList.vue — drag-and-drop reorderable list with handle -->
<template>
    <div class="k-sort">
        <TransitionGroup name="k-sort-item" tag="div">
            <div
                v-for="(item, i) in items"
                :key="item[keyProp] ?? i"
                class="k-sort-row"
                :class="{ 'is-dragging': dragIndex === i }"
                draggable="true"
                @dragstart="onDragStart(i, $event)"
                @dragover.prevent="onDragOver(i)"
                @dragend="onDragEnd"
                @drop.prevent="onDrop"
            >
                <div class="k-sort-handle" title="بکشید">
                    <GripVertical :size="14" />
                </div>
                <div class="k-sort-content">
                    <slot :item="item" :index="i" />
                </div>
                <button
                    v-if="removable"
                    class="k-sort-remove"
                    title="حذف"
                    @click="emit('remove', item, i)"
                >
                    <X :size="14" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GripVertical, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    items: any[]
    keyProp?: string
    removable?: boolean
}>(), {
    keyProp: 'id',
    removable: false,
})

const emit = defineEmits<{
    'update:items': [items: any[]]
    remove: [item: any, index: number]
}>()

const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

const onDragStart = (i: number, e: DragEvent) => {
    dragIndex.value = i
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const onDragOver = (i: number) => {
    overIndex.value = i
}

const onDrop = () => {
    if (dragIndex.value === null || overIndex.value === null || dragIndex.value === overIndex.value) return
    const list = [...props.items]
    const [moved] = list.splice(dragIndex.value, 1)
    list.splice(overIndex.value, 0, moved)
    emit('update:items', list)
    dragIndex.value = null
    overIndex.value = null
}

const onDragEnd = () => {
    dragIndex.value = null
    overIndex.value = null
}
</script>

<style scoped>
.k-sort-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    margin-bottom: 6px;
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
.k-sort-row:hover {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 30%, var(--k-border));
}
.k-sort-row.is-dragging {
    opacity: 0.5;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.k-sort-handle {
    cursor: grab;
    color: var(--k-text-muted);
    flex-shrink: 0;
    padding: 2px;
    display: flex;
    align-items: center;
}
.k-sort-handle:active { cursor: grabbing; }
.k-sort-content {
    flex: 1;
    min-width: 0;
}
.k-sort-remove {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    transition: all 0.12s ease;
    flex-shrink: 0;
}
.k-sort-remove:hover {
    background: color-mix(in srgb, #ef4444 10%, transparent);
    color: #ef4444;
}
/* Transition */
.k-sort-item-enter-active, .k-sort-item-leave-active {
    transition: all 0.2s ease;
}
.k-sort-item-enter-from { opacity: 0; transform: translateX(-10px); }
.k-sort-item-leave-to { opacity: 0; transform: translateX(10px); }
.k-sort-item-move { transition: transform 0.2s ease; }
</style>
