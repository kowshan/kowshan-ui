<template>
    <div class="k-json-node" :style="{ paddingInlineStart: depth ? '16px' : '0' }">
        <template v-if="isContainer">
            <div class="k-json-line" :class="{ 'is-open': localOpen }" @click="toggle">
                <span class="k-json-toggle">{{ localOpen ? '▾' : '▸' }}</span>
                <span v-if="label !== null" class="k-json-key">{{ label }}: </span>
                <span class="k-json-bracket">{{ bracketOpen }}</span>
                <span v-if="collapsedSummary" class="k-json-summary">{{ collapsedSummary }}</span>
                <span v-else class="k-json-bracket">{{ bracketClose }}</span>
            </div>
            <div v-if="localOpen" class="k-json-children">
                <KJsonNode
                    v-for="(child, key) in children"
                    :key="key"
                    :node="child"
                    :label="keyLabel(key)"
                    :depth="depth + 1"
                    :collapsed="collapsed"
                    :expand-depth="expandDepth"
                />
            </div>
        </template>

        <div v-else class="k-json-line k-json-leaf">
            <span class="k-json-indent">•</span>
            <span v-if="label !== null" class="k-json-key">{{ label }}: </span>
            <span class="k-json-value" :class="valueClass">{{ valueText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    node: any
    label?: string | number | null
    depth: number
    collapsed: boolean
    expandDepth: number
}>()

const isContainer = computed(() => props.node !== null && typeof props.node === 'object')

const isArray = computed(() => Array.isArray(props.node))
const bracketOpen = computed(() => (isArray.value ? '[' : '{'))
const bracketClose = computed(() => (isArray.value ? ']' : '}'))

const children = computed(() => {
    if (!isContainer.value) return {}
    return props.node as Record<string, any>
})

const childCount = computed(() => Object.keys(children.value).length)

const collapsedSummary = computed(() => {
    if (!isContainer.value) return ''
    return `${isArray.value ? '…' : ''} ${childCount.value} ${isArray.value ? 'آیتم' : 'فیلد'}`
})

const localOpen = ref(!props.collapsed && props.depth < props.expandDepth)
watch(() => props.collapsed, (c) => { localOpen.value = !c })

const toggle = () => { localOpen.value = !localOpen.value }

const keyLabel = (key: string) => (isArray.value ? null : key)

const valueText = computed(() => {
    const v = props.node
    if (v === null) return 'null'
    if (typeof v === 'string') return `"${v}"`
    return String(v)
})

const valueClass = computed(() => {
    const v = props.node
    if (v === null) return 'is-null'
    if (typeof v === 'string') return 'is-string'
    if (typeof v === 'number') return 'is-number'
    if (typeof v === 'boolean') return 'is-bool'
    return ''
})
</script>

<style scoped>
.k-json-node {
    line-height: 1.7;
}

.k-json-line {
    display: flex;
    align-items: baseline;
    gap: 4px;
    white-space: pre;
}

.k-json-line.is-open { cursor: pointer; }
.k-json-line.is-open:hover { background: var(--k-surface-hover, #f1f5f9); border-radius: 4px; }

.k-json-toggle {
    color: var(--k-text-muted, #94a3b8);
    width: 10px;
    flex-shrink: 0;
}

.k-json-indent {
    color: var(--k-text-muted, #94a3b8);
    width: 10px;
    flex-shrink: 0;
    font-size: 0.6rem;
}

.k-json-key {
    color: var(--k-primary, #1db954);
}

.k-json-bracket {
    color: var(--k-text-muted, #94a3b8);
}

.k-json-summary {
    color: var(--k-text-muted, #94a3b8);
    font-style: italic;
    font-size: 0.68rem;
}

.k-json-value.is-string { color: #10b981; }
.k-json-value.is-number { color: #3b82f6; }
.k-json-value.is-bool { color: #8b5cf6; }
.k-json-value.is-null { color: var(--k-text-muted, #94a3b8); font-style: italic; }

.k-json-children {
    padding-inline-start: 14px;
    border-inline-start: 1px dashed var(--k-border, #e2e8f0);
}
</style>
