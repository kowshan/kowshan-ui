<!-- components/KKanban.vue -->
<template>
    <div class="k-kanban">
        <div
            v-for="col in columns"
            :key="col.id"
            class="k-kanban-col"
            :class="{ 'is-drag-over': dragOverCol === col.id }"
            @dragover.prevent="dragOverCol = col.id"
            @dragleave="dragOverCol = null"
            @drop.prevent="onDrop(col)"
        >
            <!-- Column header -->
            <div class="k-kanban-head">
                <span class="k-kanban-dot" :style="{ background: col.color || 'var(--k-primary)' }" />
                <span class="k-kanban-title">{{ col.title }}</span>
                <span class="k-kanban-count">{{ faNum(col.items.length) }}</span>
                <button
                    v-if="addable"
                    type="button"
                    class="k-kanban-add"
                    :aria-label="`افزودن به ${col.title}`"
                    @click="$emit('add', col)"
                >
                    <Plus class="icon" />
                </button>
            </div>

            <!-- Cards -->
            <div class="k-kanban-body">
                <TransitionGroup name="k-kanban">
                    <div
                        v-for="item in col.items"
                        :key="item.id"
                        class="k-kanban-card"
                        :class="{ 'is-dragging': draggingId === item.id }"
                        draggable="true"
                        @dragstart="onDragStart(item, col)"
                        @dragend="onDragEnd"
                        @click="$emit('cardClick', item, col)"
                    >
                        <div class="k-kanban-card-top">
                            <span v-if="item.label" class="k-kanban-card-label" :style="item.labelColor ? { background: item.labelColor } : {}">
                                {{ item.label }}
                            </span>
                            <button
                                type="button"
                                class="k-kanban-card-menu"
                                aria-label="گزینه‌ها"
                                @click.stop="$emit('cardMenu', item, col)"
                            >
                                <MoreHorizontal class="icon" />
                            </button>
                        </div>

                        <div class="k-kanban-card-title">{{ item.title }}</div>
                        <div v-if="item.subtitle" class="k-kanban-card-sub">{{ item.subtitle }}</div>

                        <div class="k-kanban-card-foot">
                            <div v-if="item.avatar || item.assignee" class="k-kanban-card-avatar">
                                <KAvatar :src="item.avatar" :name="item.assignee || '؟'" size="xs" />
                            </div>
                            <div v-if="item.amount != null" class="k-kanban-card-amount">
                                {{ item.amount }}
                            </div>
                            <div v-if="item.due" class="k-kanban-card-due" :class="{ 'is-late': item.late }">
                                <CalendarDays class="icon" />
                                {{ item.due }}
                            </div>
                        </div>
                    </div>
                </TransitionGroup>

                <div v-if="!col.items.length" class="k-kanban-empty">
                    بدون مورد — بکشید و رها کنید
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, MoreHorizontal, Plus } from 'lucide-vue-next'
import KAvatar from './KAvatar.vue'

export interface KKanbanItem {
    id: string
    title: string
    subtitle?: string
    label?: string
    labelColor?: string
    assignee?: string
    avatar?: string
    amount?: string
    due?: string
    late?: boolean
}

export interface KKanbanColumn {
    id: string
    title: string
    color?: string
    items: KKanbanItem[]
}

const props = withDefaults(defineProps<{
    modelValue: KKanbanColumn[]
    addable?: boolean
}>(), {
    addable: true
})

const emits = defineEmits<{
    'update:modelValue': [value: KKanbanColumn[]]
    'move': [payload: { item: KKanbanItem; from: string; to: string; index: number }]
    'cardClick': [item: KKanbanItem, column: KKanbanColumn]
    'cardMenu': [item: KKanbanItem, column: KKanbanColumn]
    'add': [column: KKanbanColumn]
}>()

// reactive — props.modelValue is replaced on every move
const columns = computed(() => props.modelValue)

const draggingId = ref<string | null>(null)
const dragFrom = ref<string | null>(null)
const dragOverCol = ref<string | null>(null)

const onDragStart = (item: KKanbanItem, col: KKanbanColumn) => {
    draggingId.value = item.id
    dragFrom.value = col.id
    try {
        const dt = new DataTransfer()
        dt.setData('text/plain', item.id)
        const ghost = document.createElement('div')
        ghost.textContent = item.title
        ghost.style.cssText = 'position:fixed;top:-9999px;font-size:12px;color:#fff;background:#1db954;padding:6px 12px;border-radius:8px;'
        document.body.appendChild(ghost)
        dt.setDragImage?.(ghost, 0, 0)
        setTimeout(() => ghost.remove(), 0)
    } catch { /* ignore */ }
}

const onDragEnd = () => {
    draggingId.value = null
    dragFrom.value = null
    dragOverCol.value = null
}

const onDrop = (target: KKanbanColumn) => {
    const fromId = dragFrom.value
    const itemId = draggingId.value
    dragOverCol.value = null
    draggingId.value = null
    dragFrom.value = null

    if (!fromId || !itemId || fromId === target.id) return

    const next = props.modelValue.map(c => ({ ...c, items: [...c.items] }))
    const fromCol = next.find(c => c.id === fromId)
    const toCol = next.find(c => c.id === target.id)
    if (!fromCol || !toCol) return

    const idx = fromCol.items.findIndex(i => i.id === itemId)
    if (idx < 0) return
    const [item] = fromCol.items.splice(idx, 1)
    toCol.items.push(item)

    emits('update:modelValue', next)
    emits('move', { item, from: fromId, to: target.id, index: toCol.items.length - 1 })
}

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: number | string) => String(n).replace(/\d/g, d => faDigits[Number(d)])
</script>

<style scoped>
.k-kanban {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(230px, 1fr);
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    direction: rtl;
}

.k-kanban-col {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    display: flex;
    flex-direction: column;
    max-height: 460px;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.k-kanban-col.is-drag-over {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-kanban-head {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 12px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-kanban-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.k-kanban-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    flex: 1;
}

.k-kanban-count {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 999px;
    padding: 1px 9px;
}

.k-kanban-add {
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-kanban-add:hover {
    color: var(--k-primary, #1db954);
    background: var(--k-bg, #ffffff);
}

.k-kanban-add .icon {
    width: 14px;
    height: 14px;
}

.k-kanban-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    flex: 1;
}

.k-kanban-card {
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    padding: 10px 11px;
    cursor: grab;
    box-shadow: 0 1px 3px rgba(2, 6, 23, 0.06);
    transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
    user-select: none;
}

.k-kanban-card:hover {
    box-shadow: 0 6px 16px rgba(2, 6, 23, 0.1);
    transform: translateY(-1px);
}

.k-kanban-card.is-dragging {
    opacity: 0.4;
    transform: rotate(2deg);
}

.k-kanban-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
}

.k-kanban-card-label {
    font-size: 0.62rem;
    font-weight: 700;
    color: #ffffff;
    border-radius: 6px;
    padding: 2px 8px;
    background: var(--k-primary, #1db954);
}

.k-kanban-card-menu {
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 2px;
    border-radius: 5px;
    display: flex;
}

.k-kanban-card-menu:hover {
    color: var(--k-text-primary, #1e293b);
    background: var(--k-surface-hover, #f1f5f9);
}

.k-kanban-card-menu .icon {
    width: 14px;
    height: 14px;
}

.k-kanban-card-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    line-height: 1.5;
}

.k-kanban-card-sub {
    font-size: 0.7rem;
    color: var(--k-text-secondary, #64748b);
    margin-top: 2px;
}

.k-kanban-card-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 9px;
}

.k-kanban-card-avatar {
    flex-shrink: 0;
}

.k-kanban-card-amount {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-success, #10b981);
    direction: ltr;
}

.k-kanban-card-due {
    margin-right: auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-kanban-card-due .icon {
    width: 12px;
    height: 12px;
}

.k-kanban-card-due.is-late {
    color: var(--k-error, #dc2626);
    font-weight: 600;
}

.k-kanban-empty {
    padding: 18px 10px;
    text-align: center;
    font-size: 0.7rem;
    color: var(--k-text-muted, #94a3b8);
    border: 1px dashed var(--k-border, #e2e8f0);
    border-radius: 10px;
}

/* Transition */
.k-kanban-move,
.k-kanban-enter-active,
.k-kanban-leave-active {
    transition: all 0.18s ease;
}

.k-kanban-enter-from {
    opacity: 0;
    transform: scale(0.96);
}

.k-kanban-leave-to {
    opacity: 0;
    transform: scale(0.94);
}

.k-kanban-leave-active {
    position: absolute;
}
</style>
