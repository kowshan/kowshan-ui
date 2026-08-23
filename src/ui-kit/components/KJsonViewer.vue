<!-- components/KJsonViewer.vue -->
<!--
    KJsonViewer — collapsible JSON tree:

      <KJsonViewer :data="payload" />
-->
<template>
    <div class="k-json">
        <KJsonNode
            :node="data"
            :label="rootLabel"
            :depth="0"
            :collapsed="collapsed"
            :expand-depth="expandDepth"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KJsonNode from './KJsonNode.vue'

const props = withDefaults(defineProps<{
    data: any
    rootLabel?: string
    /** initial collapse state for containers */
    collapsed?: boolean
    /** containers at depth < this start expanded */
    expandDepth?: number
}>(), {
    rootLabel: 'root',
    collapsed: false,
    expandDepth: 2
})

const expanded = ref(!props.collapsed)
defineExpose({ expanded: () => (expanded.value = true), collapsed: () => (expanded.value = false) })
</script>

<style scoped>
.k-json {
    width: 100%;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    padding: 12px;
    overflow-x: auto;
    font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
    font-size: 0.74rem;
    direction: ltr;
    text-align: left;
}
</style>
