<!-- KDiffView — side-by-side code/text diff viewer -->
<template>
    <div class="k-diff" :class="{ 'is-unified': unified }">
        <div class="k-diff-header">
            <template v-if="!unified">
                <div class="k-diff-header-side">
                    <span class="k-diff-label">{{ leftLabel }}</span>
                    <span class="k-diff-meta" v-if="leftMeta">{{ leftMeta }}</span>
                </div>
                <div class="k-diff-header-side">
                    <span class="k-diff-label">{{ rightLabel }}</span>
                    <span class="k-diff-meta" v-if="rightMeta">{{ rightMeta }}</span>
                </div>
            </template>
            <div v-else class="k-diff-header-side" style="flex:1;text-align:center;">
                <span class="k-diff-label">{{ leftLabel }} → {{ rightLabel }}</span>
            </div>
        </div>

        <div class="k-diff-body" ref="scrollRef">
            <template v-if="!unified">
                <div class="k-diff-pane k-diff-left">
                    <div
                        v-for="(line, i) in leftLines"
                        :key="i"
                        class="k-diff-line"
                        :class="line.type"
                    >
                        <span class="k-diff-ln">{{ line.lineNo || '' }}</span>
                        <span class="k-diff-content">{{ line.text }}</span>
                    </div>
                </div>
                <div class="k-diff-pane k-diff-right">
                    <div
                        v-for="(line, i) in rightLines"
                        :key="i"
                        class="k-diff-line"
                        :class="line.type"
                    >
                        <span class="k-diff-ln">{{ line.lineNo || '' }}</span>
                        <span class="k-diff-content">{{ line.text }}</span>
                    </div>
                </div>
            </template>
            <div v-else class="k-diff-pane k-diff-unified">
                <div
                    v-for="(line, i) in unifiedLines"
                    :key="i"
                    class="k-diff-line"
                    :class="line.type"
                >
                    <span class="k-diff-ln">{{ line.leftLineNo || '' }}</span>
                    <span class="k-diff-ln">{{ line.rightLineNo || '' }}</span>
                    <span class="k-diff-marker">{{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}</span>
                    <span class="k-diff-content">{{ line.text }}</span>
                </div>
            </div>
        </div>

        <div v-if="stats" class="k-diff-stats">
            <span class="k-diff-stat k-diff-stat-add">+{{ stats.added }}</span>
            <span class="k-diff-stat k-diff-stat-remove">-{{ stats.removed }}</span>
            <span class="k-diff-stat k-diff-stat-same">{{ stats.unchanged }} unchanged</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DiffLine {
    text: string
    type: 'added' | 'removed' | 'unchanged' | 'empty'
    lineNo?: number
}

const props = withDefaults(defineProps<{
    left?: string
    right?: string
    leftLabel?: string
    rightLabel?: string
    leftMeta?: string
    rightMeta?: string
    unified?: boolean
}>(), {
    left: '',
    right: '',
    leftLabel: 'قبل',
    rightLabel: 'بعد',
    unified: false
})

const scrollRef = ref<HTMLElement | null>(null)

const leftLines = computed(() => {
    const leftArr = props.left.split('\n')
    const rightArr = props.right.split('\n')
    const maxLen = Math.max(leftArr.length, rightArr.length)
    const result: DiffLine[] = []
    for (let i = 0; i < maxLen; i++) {
        const l = leftArr[i]
        const r = rightArr[i]
        if (l === r) {
            result.push({ text: l || '', type: 'unchanged', lineNo: i + 1 })
        } else if (r === undefined) {
            result.push({ text: l, type: 'removed', lineNo: i + 1 })
        } else if (l === undefined) {
            result.push({ text: '', type: 'empty', lineNo: undefined })
        } else {
            result.push({ text: l, type: 'removed', lineNo: i + 1 })
        }
    }
    return result
})

const rightLines = computed(() => {
    const leftArr = props.left.split('\n')
    const rightArr = props.right.split('\n')
    const maxLen = Math.max(leftArr.length, rightArr.length)

    const result: DiffLine[] = []
    for (let i = 0; i < maxLen; i++) {
        const l = leftArr[i]
        const r = rightArr[i]
        if (l === r) {
            result.push({ text: r || '', type: 'unchanged', lineNo: i + 1 })
        } else if (l === undefined) {
            result.push({ text: r || '', type: 'added', lineNo: i + 1 })
        } else if (r === undefined) {
            result.push({ text: l, type: 'removed', lineNo: i + 1 })
        } else {
            result.push({ text: r, type: 'added', lineNo: i + 1 })
        }
    }
    return result
})

const unifiedLines = computed(() => {
    const leftArr = props.left.split('\n')
    const rightArr = props.right.split('\n')
    const maxLen = Math.max(leftArr.length, rightArr.length)
    const result: (DiffLine & { leftLineNo?: number; rightLineNo?: number })[] = []

    for (let i = 0; i < maxLen; i++) {
        const l = leftArr[i]
        const r = rightArr[i]
        if (l === r) {
            result.push({ text: r || '', type: 'unchanged', leftLineNo: i + 1, rightLineNo: i + 1 })
        } else {
            if (l !== undefined) result.push({ text: l, type: 'removed', leftLineNo: i + 1 })
            if (r !== undefined) result.push({ text: r, type: 'added', rightLineNo: i + 1 })
        }
    }
    return result
})

const stats = computed(() => {
    const leftArr = props.left.split('\n')
    const rightArr = props.right.split('\n')
    const maxLen = Math.max(leftArr.length, rightArr.length)
    let added = 0, removed = 0, unchanged = 0
    for (let i = 0; i < maxLen; i++) {
        if (leftArr[i] === rightArr[i]) unchanged++
        else {
            if (leftArr[i] !== undefined) removed++
            if (rightArr[i] !== undefined) added++
        }
    }
    return { added, removed, unchanged }
})
</script>

<style scoped>
.k-diff {
    direction: ltr; border: 1px solid var(--k-border); border-radius: var(--k-radius-sm); overflow: hidden; font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size: 0.78rem; }

.k-diff-header {
    display: flex; background: var(--k-surface); border-bottom: 1px solid var(--k-border);
}
.k-diff-header-side { flex: 1; padding: 8px 14px; }
.k-diff-header-side:not(:last-child) { border-inline-start: 1px solid var(--k-border); }
.k-diff-label { font-weight: 700; font-size: 0.75rem; color: var(--k-text-primary); font-family: var(--k-font-family, 'yekan-bakh', sans-serif); }
.k-diff-meta { font-size: 0.68rem; color: var(--k-text-muted); margin-inline-end: 8px; font-family: var(--k-font-family, 'yekan-bakh', sans-serif); }

.k-diff-body { display: flex; max-height: 500px; overflow: auto; }
.k-diff .k-diff-pane { flex: 1; min-width: 0;}
.k-diff:not(.is-unified) .k-diff-left:not(:last-child),
.k-diff:not(.is-unified) .k-diff-right:not(:last-child) { border-inline-start: 1px solid var(--k-border); }

.k-diff-line {
    display: flex; min-height: 22px; line-height: 22px;
    border-bottom: 1px solid transparent;
}
.k-diff-line.unchanged { color: var(--k-text-secondary); }
.k-diff-line.added { background: color-mix(in srgb, var(--k-success) 10%, transparent); color: var(--k-success-text); }
.k-diff-line.removed { background: rgba(239, 68, 68, 0.08); color: #dc2626; text-decoration: line-through; opacity: 0.8; }

.k-diff-ln {
    display: inline-block; min-width: 36px; padding: 0 8px; text-align: start;
    color: var(--k-text-muted); user-select: none; border-inline-start: 1px solid var(--k-border);
    font-size: 0.7rem; flex-shrink: 0;
}
.k-diff-marker { padding: 0 4px; font-weight: 700; flex-shrink: 0; min-width: 16px; text-align: center; }
.k-diff-content { padding: 0 10px; white-space: pre-wrap; word-break: break-all; flex: 1; }

.k-diff-stats {
    display: flex; gap: 12px; padding: 8px 14px;
    border-top: 1px solid var(--k-border); background: var(--k-surface);
}
.k-diff-stat { font-size: 0.72rem; font-weight: 600; font-family: inherit; }
.k-diff-stat-add { color: var(--k-success-text); }
.k-diff-stat-remove { color: #dc2626; }
.k-diff-stat-same { color: var(--k-text-muted); }
</style>
