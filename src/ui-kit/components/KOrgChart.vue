<!-- components/KOrgChart.vue -->
<!--
    KOrgChart — organizational tree (departments / agents):

      <KOrgChart :nodes="orgNodes" @select="onSelect" />

    node: { id, name, role?, avatar?, children?, badge? }
-->
<template>
    <div class="k-org">
        <div class="k-org-root">
            <KOrgNode
                v-for="node in nodes"
                :key="node.id"
                :node="node"
                :depth="0"
                @select="onSelect"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import KOrgNode from './KOrgNode.vue'

export interface KOrgNodeData {
    id: string | number
    name: string
    role?: string
    avatar?: string
    badge?: string
    badgeColor?: string
    children?: KOrgNodeData[]
}

const props = withDefaults(defineProps<{
    nodes?: KOrgNodeData[]
}>(), {
    nodes: () => []
})

const emit = defineEmits<{
    (e: 'select', node: KOrgNodeData): void
}>()

const onSelect = (node: KOrgNodeData) => emit('select', node)
</script>

<style scoped>
.k-org {
    width: 100%;
    overflow-x: auto;
    padding: 8px;
}

.k-org-root {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}
</style>
