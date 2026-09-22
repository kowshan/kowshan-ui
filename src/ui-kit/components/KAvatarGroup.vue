<!-- components/KAvatarGroup.vue -->
<template>
    <div class="k-avatar-group" :class="`size-${size}`">
        <div
            v-for="(a, i) in shown"
            :key="i"
            class="k-avatar-group-item"
            :class="{ 'is-hoverable': hoverable }"
            :title="typeof a === 'string' ? a : a.name"
        >
            <KAvatar
                :name="typeof a === 'string' ? a : a.name"
                :src="typeof a === 'string' ? undefined : a.src"
                :size="avatarSize"
                :status="typeof a === 'string' ? undefined : a.status"
            />
        </div>

        <div v-if="overflow > 0" class="k-avatar-group-more" :style="{ width: pixelSize + 'px', height: pixelSize + 'px' }">
            <span>+{{ overflow }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KAvatar from './KAvatar.vue'

export interface KAvatarGroupItem {
    name: string
    src?: string
    status?: 'online' | 'offline' | 'busy' | 'away'
}

const props = withDefaults(defineProps<{
    items: (KAvatarGroupItem | string)[]
    max?: number
    size?: 'sm' | 'md' | 'lg'
    hoverable?: boolean
}>(), {
    max: 4,
    size: 'md',
    hoverable: true
})

const avatarSize = computed<'sm' | 'md' | 'lg'>(() => props.size)
const pixelSize = computed(() => ({ sm: 28, md: 36, lg: 48 })[props.size])
const shown = computed(() => props.items.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.items.length - props.max))

</script>

<style scoped>
.k-avatar-group {
    display: inline-flex;
    align-items: center;
}

.k-avatar-group-item {
    border: 2px solid var(--k-bg, #ffffff);
    border-radius: 50%;
    transition: transform 0.15s ease;
}

.k-avatar-group-item + .k-avatar-group-item,
.k-avatar-group-more {
    margin-inline-end: -8px;
}

.k-avatar-group-item.is-hoverable:hover {
    transform: translateY(-3px);
    z-index: 2;
}

.k-avatar-group-more {
    border: 2px solid var(--k-bg, #ffffff);
    border-radius: 50%;
    margin-inline-end: -8px;
    background: var(--k-surface, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
}

.k-avatar-group-more:hover {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
}
</style>
