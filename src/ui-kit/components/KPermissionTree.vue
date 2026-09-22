<!-- components/KPermissionTree.vue -->
<!--
    KPermissionTree — group → sub-permission checkbox tree (permission manager):

      <KPermissionTree v-model="checked" :nodes="permissionGroups" />

    node: { id, label, hint?, disabled?, children? }
    - checking a group checks all of its sub-permissions
    - a group becomes "indeterminate" when only some sub-permissions are checked
    - `hint` renders as a small muted note under the label
-->
<template>
    <div dir="ltr" class="k-ptree">
        <!-- Select-all row -->
        <label v-if="selectAll" class="k-ptree-row is-select-all">
            <KCheckbox
                :model-value="allChecked"
                :indeterminate="someChecked && !allChecked"
                @update:model-value="toggleAll"
            />
            <span class="k-ptree-label">{{ selectAllLabel }}</span>
            <span class="k-ptree-count">{{ modelValue.length }} انتخاب شده</span>
        </label>

        <KPermissionTreeNode
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :depth="0"
            :checked-ids="modelValue"
            @toggle="onToggle"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KCheckbox from '../wrappers/KCheckbox.vue'
import KPermissionTreeNode from './KPermissionTreeNode.vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface KPermissionNode {
    id: string
    label: string
    hint?: string
    disabled?: boolean
    children?: KPermissionNode[]
}

const props = withDefaults(defineProps<{
    modelValue?: string[]
    nodes?: KPermissionNode[]
    selectAll?: boolean
    selectAllLabel?: string
}>(), {
    modelValue: () => [],
    nodes: () => [],
    selectAll: true,
    selectAllLabel: 'انتخاب همه'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>()

const { toPersianDigits } = usePersianNumbers()

/* collect every id (and its descendants) reachable from a node */
const collectIds = (node: KPermissionNode): string[] => {
    const ids = [node.id]
    node.children?.forEach(c => ids.push(...collectIds(c)))
    return ids
}

const allNodes = computed(() => {
    const ids: string[] = []
    props.nodes.forEach(n => ids.push(...collectIds(n)))
    return ids
})

const allChecked = computed(
    () => allNodes.value.length > 0 && allNodes.value.every(id => props.modelValue.includes(id))
)

const someChecked = computed(() => allNodes.value.some(id => props.modelValue.includes(id)))

const toggleAll = (v: boolean | unknown) => {
    const checked = Boolean(v)
    emit('update:modelValue', checked ? allNodes.value : [])
}

const onToggle = (payload: { id: string; checked: boolean; affect: string[] }) => {
    const set = new Set(props.modelValue)
    if (payload.checked) {
        payload.affect.forEach(id => set.add(id))
    } else {
        payload.affect.forEach(id => set.delete(id))
    }
    emit('update:modelValue', [...set])
}
</script>

<style scoped>
.k-ptree {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    width: 100%;
}

/* Select-all spans full width */
.k-ptree-row.is-select-all {
    grid-column: 1 / -1;
}

.k-ptree-row.is-select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    cursor: pointer;
}

.k-ptree-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-ptree-count {
    margin-inline-start: auto;
    font-size: 0.66rem;
    font-weight: 600;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    padding: 2px 10px;
    border-radius: 999px;
}
</style>
