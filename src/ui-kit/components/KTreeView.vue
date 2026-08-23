<!-- components/KTreeView.vue -->
<template>
    <div class="k-tree">
        <div
            v-for="(node, i) in nodes"
            :key="node.id"
            class="k-tree-node"
        >
            <KTreeNode
                :node="node"
                :depth="0"
                :expanded-keys="expandedKeys"
                :selected-key="selectedKey"
                @toggle="toggle"
                @select="select"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import KTreeNode from './KTreeNode.vue'

export interface KTreeNodeData {
    id: string
    label: string
    icon?: any
    children?: KTreeNodeData[]
    badge?: string | number
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    nodes: KTreeNodeData[]
    modelValue?: string | null
    defaultExpanded?: string[]
}>(), {
    modelValue: null,
    defaultExpanded: () => []
})

const emits = defineEmits<{
    'update:modelValue': [value: string | null]
    'select': [node: KTreeNodeData]
}>()

const expandedKeys = ref<Set<string>>(new Set(props.defaultExpanded))
const selectedKey = ref<string | null>(props.modelValue)

const toggle = (id: string) => {
    const set = new Set(expandedKeys.value)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    expandedKeys.value = set
}

const select = (node: KTreeNodeData) => {
    if (node.disabled) return
    selectedKey.value = node.id
    emits('update:modelValue', node.id)
    emits('select', node)
}

watch(() => props.modelValue, (v) => { selectedKey.value = v })
</script>

<style scoped>
.k-tree {
    width: 100%;
    direction: rtl;
    user-select: none;
}
</style>
