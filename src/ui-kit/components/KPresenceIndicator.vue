<!-- KPresenceIndicator.vue — user presence status dot -->
<template>
    <span class="k-presence" :class="[`is-${status}`, `size-${size}`]" :title="label">
        <span v-if="animate" class="k-presence-ping" />
        <span class="k-presence-dot" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    status?: 'online' | 'offline' | 'away' | 'busy'
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
}>(), {
    status: 'offline',
    size: 'md',
    animate: true,
})

const labels: Record<string, string> = {
    online: 'آنلاین',
    offline: 'آفلاین',
    away: 'غایب',
    busy: 'مشغول',
}

const label = computed(() => labels[props.status] || props.status)
</script>

<style scoped>
.k-presence {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.k-presence-dot {
    position: relative;
    z-index: 1;
    border-radius: 50%;
    border: 2px solid var(--k-bg, #fff);
}
.k-presence-ping {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    animation: k-presence-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Sizes */
.k-presence.is-online .k-presence-dot { width: 10px; height: 10px; background: var(--k-success); }
.k-presence.is-online .k-presence-ping { background: var(--k-success); }
.k-presence.is-away .k-presence-dot { width: 10px; height: 10px; background: #f59e0b; }
.k-presence.is-away .k-presence-ping { background: #f59e0b; }
.k-presence.is-busy .k-presence-dot { width: 10px; height: 10px; background: #ef4444; }
.k-presence.is-busy .k-presence-ping { background: #ef4444; }
.k-presence.is-offline .k-presence-dot { width: 10px; height: 10px; background: #94a3b8; }

/* No ping for offline */
.k-presence.is-offline .k-presence-ping { display: none; }

/* Sizes — class lives on the root, so no descendant wrapper */
.k-presence.size-sm .k-presence-dot { width: 8px; height: 8px; }
.k-presence.size-lg .k-presence-dot { width: 14px; height: 14px; }

@keyframes k-presence-ping {
    75%, 100% {
        transform: scale(2.5);
        opacity: 0;
    }
}
</style>
