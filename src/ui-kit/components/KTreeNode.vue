<!-- components/KTreeNode.vue -->
<template>
    <div>
        <div
            class="k-tree-row"
            :class="{
                'is-selected': selectedKey === node.id,
                'is-disabled': node.disabled,
                'is-parent': hasChildren
            }"
            :style="{ paddingRight: (depth * 18) + 'px' }"
            role="treeitem"
            :aria-expanded="hasChildren ? isExpanded : undefined"
            :aria-selected="selectedKey === node.id"
            @click="rowClick"
        >
            <button
                v-if="hasChildren"
                type="button"
                class="k-tree-caret"
                :aria-label="isExpanded ? 'بستن' : 'بازکردن'"
                @click.stop="toggleSelf"
            >
                <ChevronDown class="caret-icon" :class="{ 'is-open': isExpanded }" />
            </button>
            <span v-else class="k-tree-caret-spacer" />

            <span v-if="node.icon" class="k-tree-icon">
                <component :is="node.icon" class="icon" />
            </span>

            <span class="k-tree-label">{{ node.label }}</span>

            <span v-if="node.badge != null" class="k-tree-badge">
                {{ node.badge }}
            </span>
        </div>

        <Transition name="k-tree">
            <div v-if="hasChildren && isExpanded" class="k-tree-children">
                <KTreeNode
                    v-for="child in node.children"
                    :key="child.id"
                    :node="child"
                    :depth="depth + 1"
                    :expanded-keys="expandedKeys"
                    :selected-key="selectedKey"
                    @toggle="forwardToggle"
                    @select="select"
                />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { KTreeNodeData } from './KTreeView.vue'

const props = defineProps<{
    node: KTreeNodeData
    depth: number
    expandedKeys: Set<string>
    selectedKey: string | null
}>()

const emits = defineEmits<{
    'toggle': [id: string]
    'select': [node: KTreeNodeData]
}>()

const hasChildren = computed(() => !!props.node.children?.length)
const isExpanded = computed(() => props.expandedKeys.has(props.node.id))

/** used by the row caret/click — emits this node's own id */
const toggleSelf = () => emits('toggle', props.node.id)

/** forwards child toggle events with the CHILD's id (must not rewrite it) */
const forwardToggle = (id: string) => emits('toggle', id)

const rowClick = () => {
    if (props.node.disabled) return
    emits('select', props.node)
    if (hasChildren.value) toggleSelf()
}

const select = (node: KTreeNodeData) => emits('select', node)
</script>

<style scoped>
.k-tree-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.1s ease;
}

.k-tree-row:hover:not(.is-disabled) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-tree-row.is-selected {
    background: var(--k-primary-light, #e3f8ec);
}

.k-tree-row.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-tree-caret {
    width: 22px;
    height: 22px;
    border: none;
    background: transparent;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--k-text-secondary, #64748b);
    flex-shrink: 0;
    padding: 0;
}

.k-tree-caret:hover {
    background: var(--k-bg, #ffffff);
    color: var(--k-primary, #1db954);
}

.k-tree-caret-spacer {
    width: 22px;
    flex-shrink: 0;
}

.caret-icon {
    width: 14px;
    height: 14px;
    transition: transform 0.18s ease;
}

.caret-icon.is-open {
    transform: rotate(180deg);
}

.k-tree-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-text-secondary, #64748b);
    flex-shrink: 0;
}

.k-tree-row.is-selected .k-tree-icon {
    color: var(--k-primary, #1db954);
}

.k-tree-icon .icon {
    width: 15px;
    height: 15px;
}

.k-tree-label {
    flex: 1;
    font-size: 0.83rem;
    font-weight: 500;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-tree-badge {
    font-size: 0.66rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-surface, #f1f5f9);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 999px;
    padding: 1px 8px;
    flex-shrink: 0;
}

.k-tree-children {
    margin-right: 11px;
    border-right: 1px solid var(--k-border, #e2e8f0);
    margin-top: 2px;
}

/* Transition */
.k-tree-enter-active,
.k-tree-leave-active {
    transition: all 0.18s ease;
}

.k-tree-enter-from,
.k-tree-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
