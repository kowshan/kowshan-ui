<!-- components/KAvatar.vue -->
<template>
    <div
        class="k-avatar"
        :class="[
            `k-avatar-${size}`,
            `k-avatar-${shape}`,
            { 'is-bordered': bordered, 'is-status': status }
        ]"
        :title="name || undefined"
    >
        <!-- Image -->
        <img
            v-if="src"
            :src="src"
            :alt="name || 'avatar'"
            loading="lazy"
            @error="onImgError"
        />

        <!-- Initials / icon fallback -->
        <div v-else class="k-avatar-fallback" :style="fallbackStyle">
            <component :is="icon" v-if="icon" class="k-avatar-icon" />
            <span v-else class="k-avatar-initials">{{ initials }}</span>
        </div>

        <!-- Status dot -->
        <span v-if="status" class="k-avatar-status" :class="[`is-${status}`, `pos-${statusPosition}`]"></span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    src?: string
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    shape?: 'circle' | 'square' | 'rounded'
    status?: 'online' | 'offline' | 'away' | 'busy'
    statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    bordered?: boolean
    icon?: any
    fallbackColor?: string
}>(), {
    size: 'md',
    shape: 'circle',
    statusPosition: 'bottom-left'
})

const imgFailed = ref(false)
watch(() => props.src, () => { imgFailed.value = false })

const initials = computed(() => {
    if (!props.name) return '?'
    // Take first letter of each word (up to 2)
    const words = props.name.trim().split(/\s+/)
    const letters = words
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    return letters || '?'
})

const fallbackStyle = computed(() => {
    const colors = [
        '#1db954', '#3b82f6', '#10b981', '#8b5cf6',
        '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'
    ]
    // Deterministic color from name
    let hash = 0
    const str = props.name || '?'
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = props.fallbackColor || colors[Math.abs(hash) % colors.length]
    return { backgroundColor: color }
})

const onImgError = () => { imgFailed.value = true }
</script>

<style scoped>
.k-avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--k-surface, #e2e8f0);
    overflow: visible;
    flex-shrink: 0;
}

.k-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* inherit the container shape so photos aren't square on circles */
    border-radius: inherit;
}

.k-avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}

.k-avatar-initials {
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.5px;
}

.k-avatar-icon {
    width: 45%;
    height: 45%;
}

/* Shapes */
.k-avatar-circle { border-radius: 50%; }
.k-avatar-square { border-radius: 0; }
.k-avatar-rounded { border-radius: 20%; }

/* Sizes */
.k-avatar-xs { width: 24px; height: 24px; }
.k-avatar-xs .k-avatar-initials { font-size: 0.6rem; }

.k-avatar-sm { width: 32px; height: 32px; }
.k-avatar-sm .k-avatar-initials { font-size: 0.7rem; }

.k-avatar-md { width: 44px; height: 44px; }
.k-avatar-md .k-avatar-initials { font-size: 0.85rem; }

.k-avatar-lg { width: 60px; height: 60px; }
.k-avatar-lg .k-avatar-initials { font-size: 1.1rem; }

.k-avatar-xl { width: 84px; height: 84px; }
.k-avatar-xl .k-avatar-initials { font-size: 1.5rem; }

/* Border */
.k-avatar.is-bordered {
    border: 2px solid #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* Status dot */
.k-avatar-status {
    position: absolute;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background: #94a3b8;
}

.k-avatar-status.is-online { background: #22c55e; }
.k-avatar-status.is-offline { background: #94a3b8; }
.k-avatar-status.is-away { background: #f59e0b; }
.k-avatar-status.is-busy { background: #ef4444; }

.pos-bottom-right { bottom: 0; right: 0; }
.pos-bottom-left { bottom: 0; left: 0; }
.pos-top-right { top: 0; right: 0; }
.pos-top-left { top: 0; left: 0; }
</style>
