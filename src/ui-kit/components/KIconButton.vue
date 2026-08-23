<!-- wrappers/KIconButton.vue -->
<template>
    <button
        :type="type"
        class="k-icon-button"
        :class="{
            'has-border': border !== 'none',
            'has-shadow': shadow,
            'is-loading': loading,
            'is-disabled': disabled
        }"
        :style="buttonStyles"
        :disabled="disabled || loading"
        @click="handleClick"
    >
        <!-- Loading Spinner -->
        <Loader2 v-if="loading" class="icon spin" />
        
        <!-- Icon -->
        <component v-else :is="icon" class="icon" />
        
        <!-- Tooltip -->
        <span v-if="tooltip" class="k-tooltip">{{ tooltip }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

// Props
const props = defineProps<{
    icon: any
    type?: 'button' | 'submit' | 'reset'
    
    // Colors
    bgColor?: string
    textColor?: string
    hoverBgColor?: string
    hoverTextColor?: string
    activeBgColor?: string
    
    // Border
    border?: 'none' | 'solid' | 'dashed'
    borderColor?: string
    borderWidth?: string
    
    // Shadow
    shadow?: boolean
    shadowColor?: string
    
    // Layout
    width?: string
    height?: string
    borderRadius?: string
    
    // Loading
    loading?: boolean
    
    // Effects
    disabled?: boolean
    
    // Tooltip
    tooltip?: string
}>()

// Emits
const emits = defineEmits<{
    click: [event: MouseEvent]
}>()

// Default values
const defaultBgColor = 'transparent'
const defaultTextColor = 'var(--k-text-secondary)'

// Color adjustment helper
const adjustColor = (color: string, percent: number): string => {
    if (!color || color === 'transparent') return color
    
    let r, g, b
    if (color.startsWith('#')) {
        r = parseInt(color.slice(1, 3), 16)
        g = parseInt(color.slice(3, 5), 16)
        b = parseInt(color.slice(5, 7), 16)
    } else if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g)
        if (match) {
            r = parseInt(match[0])
            g = parseInt(match[1] ?? "ff")
            b = parseInt(match[2] ?? "ff")
        } else {
            return color
        }
    } else {
        return color
    }
    
    const newR = Math.min(255, Math.max(0, r + (r * percent) / 100))
    const newG = Math.min(255, Math.max(0, g + (g * percent) / 100))
    const newB = Math.min(255, Math.max(0, b + (b * percent) / 100))
    
    return `rgb(${newR}, ${newG}, ${newB})`
}

// Calculate hover background
const hoverBgColor = computed(() => {
    if (props.hoverBgColor) return props.hoverBgColor
    if (props.bgColor && props.bgColor !== 'transparent') {
        return adjustColor(props.bgColor, -10)
    }
    return 'var(--k-surface-hover)'
})

// Calculate hover text color
const hoverTextColor = computed(() => {
    if (props.hoverTextColor) return props.hoverTextColor
    if (props.textColor) return props.textColor
    return 'var(--k-text-primary)'
})

// Calculate active background
const activeBgColor = computed(() => {
    if (props.activeBgColor) return props.activeBgColor
    if (props.bgColor && props.bgColor !== 'transparent') {
        return adjustColor(props.bgColor, -20)
    }
    return 'var(--k-surface)'
})

// Button styles
const buttonStyles = computed(() => ({
    // Colors
    backgroundColor: props.bgColor || defaultBgColor,
    color: props.textColor || defaultTextColor,
    
    // Border
    border: props.border !== 'none' ? `${props.borderWidth || '1px'} ${props.border} ${props.borderColor || 'currentColor'}` : 'none',
    
    // Shadow
    boxShadow: props.shadow ? `0 2px 8px ${props.shadowColor || 'rgba(0,0,0,0.15)'}` : 'none',
    
    // Layout
    width: props.width || '36px',
    height: props.height || '36px',
    borderRadius: props.borderRadius || 'var(--k-radius-sm)',
    
    // Hover states
    '--hover-bg': hoverBgColor.value,
    '--hover-color': hoverTextColor.value,
    '--active-bg': activeBgColor.value,
}))

const handleClick = (e: MouseEvent) => {
    if (!props.disabled && !props.loading) {
        emits('click', e)
    }
}
</script>

<style scoped>
.k-icon-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

/* Hover state */
.k-icon-button:hover:not(.is-disabled):not(.is-loading) {
    background-color: var(--hover-bg) !important;
    color: var(--hover-color) !important;
    transform: scale(1.05);
}

/* Active state */
.k-icon-button:active:not(.is-disabled):not(.is-loading) {
    transform: scale(0.98);
}

/* Icons */
.icon {
    width: 1em;
    height: 1em;
}

/* Disabled */
.k-icon-button.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Loading */
.k-icon-button.is-loading {
    cursor: wait;
}

.spin {
    animation: k-spin 0.8s linear infinite;
}

/* Tooltip */
.k-tooltip {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--k-surface);
    color: var(--k-text-primary);
    padding: 4px 8px;
    border-radius: var(--k-radius-sm);
    font-size: 0.7rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
}

.k-icon-button:hover .k-tooltip {
    opacity: 1;
}

/* Focus */
.k-icon-button:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>