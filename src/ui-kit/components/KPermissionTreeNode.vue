<template>
    <div class="k-pt-node" :class="{ 'is-group': depth === 0 }" :style="{ paddingInlineStart: depth > 0 ? depth * 18 + 'px' : '0' }">
        <label
            class="k-pt-row"
            :class="{ 'is-disabled': node.disabled }"
            :style="depth ? { marginInlineStart: '14px' } : {}"
        >
            <span v-if="depth" class="k-pt-connector" />

            <KCheckbox
                :model-value="effectiveChecked"
                :indeterminate="indeterminate"
                :disabled="node.disabled"
                @update:model-value="onToggle"
            />

            <span class="k-pt-text">
                <span class="k-pt-name">{{ node.label }}</span>
                <span v-if="node.hint" class="k-pt-hint">{{ node.hint }}</span>
            </span>

            <span v-if="node.children?.length" class="k-pt-children-count">
                {{ checkedChildren }}/{{ node.children.length }}
            </span>
        </label>

        <div v-if="node.children?.length" class="k-pt-children">
            <KPermissionTreeNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :depth="depth + 1"
                :checked-ids="checkedIds"
                @toggle="emit('toggle', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KCheckbox from '../wrappers/KCheckbox.vue'
import type { KPermissionNode } from './KPermissionTree.vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = defineProps<{
    node: KPermissionNode
    depth: number
    checkedIds: string[]
}>()

const emit = defineEmits<{
    (e: 'toggle', payload: { id: string; checked: boolean; affect: string[] }): void
}>()

const { toPersianDigits } = usePersianNumbers()

/* every id reachable from this node (self + descendants) */
const collectIds = (n: KPermissionNode): string[] => {
    const ids = [n.id]
    n.children?.forEach(c => ids.push(...collectIds(c)))
    return ids
}

const affect = computed(() => collectIds(props.node))

const checked = computed(() => props.checkedIds.includes(props.node.id))

const children = computed(() => props.node.children ?? [])

const checkedChildIds = computed(() =>
    children.value.filter(c => props.checkedIds.includes(c.id))
)

const allChildrenChecked = computed(() =>
    children.value.length > 0 && checkedChildIds.value.length === children.value.length
)

/* indeterminate = partially selected: some (not all) children, or self checked
   while a child is missing — the checkbox then shows a dash instead of a check */
const indeterminate = computed(() =>
    children.value.length > 0 &&
    !allChildrenChecked.value &&
    (checkedChildIds.value.length > 0 || checked.value)
)

/* clicking an indeterminate group should CHECK everything, so the visual
   model-value is false while the group is indeterminate */
const effectiveChecked = computed(() => checked.value && !indeterminate.value)

const checkedChildren = computed(() => checkedChildIds.value.length)

const onToggle = (v: boolean | unknown) => {
    if (props.node.disabled) return
    emit('toggle', { id: props.node.id, checked: Boolean(v), affect: affect.value })
}
</script>

<style scoped>
.k-pt-node {
    display: flex;
    flex-direction: column;
}

.k-pt-node.is-group {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    padding: 4px;
}

.k-pt-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.12s ease;
}

.k-pt-row:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-pt-row.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-pt-connector {
    position: absolute;
    inset-inline-start: -14px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--k-border, #e2e8f0);
}

.k-pt-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.k-pt-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
}

.k-pt-hint {
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-pt-children-count {
    margin-inline-start: auto;
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-surface-hover, #f1f5f9);
    border: 1px solid var(--k-border, #e2e8f0);
    padding: 1px 8px;
    border-radius: 999px;
    direction: ltr;
}

.k-pt-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
