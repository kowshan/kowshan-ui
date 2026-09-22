<template>
    <div class="k-org-node">
        <button
            type="button"
            class="k-org-card"
            :class="{ 'has-children': hasChildren, 'is-open': open }"
            @click="onClick"
        >
            <KAvatar
                v-if="node.avatar"
                :src="node.avatar"
                :name="node.name"
                size="sm"
            />
            <span v-else class="k-org-avatar-fallback">{{ initials }}</span>

            <span class="k-org-meta">
                <span class="k-org-name">{{ node.name }}</span>
                <span v-if="node.role" class="k-org-role">{{ node.role }}</span>
            </span>

            <span
                v-if="node.badge"
                class="k-org-badge"
                :style="node.badgeColor ? { background: node.badgeColor } : {}"
            >{{ node.badge }}</span>

            <ChevronDown
                v-if="hasChildren"
                :size="14"
                class="k-org-chevron"
                :class="{ 'is-open': open }"
            />
        </button>

        <!-- Children with subtle bracket -->
        <div v-if="hasChildren && open" class="k-org-children">
            <KOrgNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :depth="depth + 1"
                @select="onSelect"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import KAvatar from './KAvatar.vue'
import type { KOrgNodeData } from './KOrgChart.vue'

const props = withDefaults(defineProps<{
    node: KOrgNodeData
    depth?: number
}>(), {
    depth: 0
})

const emit = defineEmits<{
    (e: 'select', node: KOrgNodeData): void
}>()

const open = ref(props.depth < 1)
const hasChildren = computed(() => !!props.node.children?.length)

const initials = computed(() =>
    props.node.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
)

const onClick = () => {
    if (hasChildren.value) open.value = !open.value
    emit('select', props.node)
}

const onSelect = (node: KOrgNodeData) => emit('select', node)
</script>

<style scoped>
.k-org-node {
    display: flex;
    flex-direction: column;
}

.k-org-card {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 170px;
    padding: 8px 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    cursor: pointer;
    font-family: inherit;
    text-align: start;
    transition: all 0.15s ease;
}

.k-org-card:hover {
    border-color: var(--k-primary, #1db954);
    box-shadow: var(--k-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
}

.k-org-card.is-open {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 50%, var(--k-border));
}

.k-org-avatar-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
    font-size: 0.7rem;
    font-weight: 800;
    flex-shrink: 0;
}

.k-org-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    flex: 1;
}

.k-org-name {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
}

.k-org-role {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-org-badge {
    font-size: 0.56rem;
    font-weight: 800;
    color: #fff;
    background: var(--k-primary, #1db954);
    padding: 2px 7px;
    border-radius: 999px;
    white-space: nowrap;
}

.k-org-chevron {
    color: var(--k-text-muted, #94a3b8);
    transition: transform 0.15s ease;
    flex-shrink: 0;
}

.k-org-chevron.is-open {
    transform: rotate(180deg);
}

/* ── Minimal bracket children ── */
.k-org-children {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-inline-start: 28px;
    margin-top: 8px;
    position: relative;
}

/* Single vertical spine */
.k-org-children::before {
    content: '';
    position: absolute;
    inset-inline-start: 12px;
    top: 0;
    bottom: 12px;
    width: 1px;
    background: var(--k-border, #e2e8f0);
    border-radius: 1px;
}

/* Each child gets a horizontal tick from the spine */
.k-org-children > :deep(.k-org-node) {
    position: relative;
}

.k-org-children > :deep(.k-org-node)::before {
    content: '';
    position: absolute;
    inset-inline-start: -16px;
    top: 16px;
    width: 16px;
    height: 1px;
    background: var(--k-border, #e2e8f0);
}
</style>
