<!-- wrappers/KButton.vue -->
<template>
    <button
        :type="type"
        class="k-button"
        :class="{
            'has-border': border !== 'none',
            'has-shadow': shadow,
            'has-shimmer': shimmer && !loading,
            'is-loading': loading,
            'is-disabled': disabled,
            [`justify-${justifyContent}`]: true
        }"
        :style="buttonStyles"
        :disabled="disabled || loading"
        @click="handleClick"
    >
        <!-- Right Icon (replaced by Loader2 when loading on right) -->
        <component 
            v-if="rightIcon && !(loading && loadingType === 'right')" 
            :is="rightIcon" 
            class="icon right-icon" 
        />
        
        <!-- Loading Spinner (when loading type is left or both) -->
        <Loader2 
            v-if="loading && (loadingType === 'left' || loadingType === 'both')" 
            class="icon spin" 
        />
        
        <!-- Text -->
        <span v-if="text" class="button-text">{{ text }}</span>
        
        <!-- Left Icon (replaced by Loader2 when loading on left) -->
        <component 
            v-if="leftIcon && !(loading && loadingType === 'left')" 
            :is="leftIcon" 
            class="icon left-icon" 
        />
        
        <!-- Loading Spinner (when loading type is right or both) -->
        <Loader2 
            v-if="loading && (loadingType === 'right' || loadingType === 'both')" 
            class="icon spin" 
        />
        
        <!-- Shimmer Effect -->
        <div v-if="shimmer && !loading" class="shimmer"></div>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

// Props
const props = defineProps<{
    text?: string
    leftIcon?: any
    rightIcon?: any
    type?: 'button' | 'submit' | 'reset'
    
    // Colors
    bgColor?: string           // Background color
    textColor?: string         // Text and icon color
    hoverBgColor?: string      // Hover background (if not set, auto-calculated)
    hoverTextColor?: string    // Hover text color (if not set, auto-calculated)
    activeBgColor?: string     // Active background (if not set, auto-calculated)
    
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
    padding?: string
    borderRadius?: string
    
    // Icon spacing
    iconSpacing?: string
    
    // Content alignment
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
    
    // Loading
    loading?: boolean
    loadingType?: 'left' | 'right' | 'both'
    
    // Effects
    shimmer?: boolean
    disabled?: boolean
    
    // Font
    fontSize?: string
    fontWeight?: string
}>()

// Emits
const emits = defineEmits<{
    click: [event: MouseEvent]
}>()

// Default values
const defaultBgColor = '#3b82f6'
const defaultTextColor = '#ffffff'

// Helper to lighten/darken colors
const adjustColor = (color: string, percent: number): string => {
    // Handle hex colors
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
    if (props.bgColor) {
        // Darken by 10% for hover
        return adjustColor(props.bgColor, -10)
    }
    return adjustColor(defaultBgColor, -10)
})

// Calculate hover text color
const hoverTextColor = computed(() => {
    if (props.hoverTextColor) return props.hoverTextColor
    if (props.textColor) return props.textColor
    return defaultTextColor
})

// Calculate active background
const activeBgColor = computed(() => {
    if (props.activeBgColor) return props.activeBgColor
    if (props.bgColor) {
        // Darken by 20% for active
        return adjustColor(props.bgColor, -20)
    }
    return adjustColor(defaultBgColor, -20)
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
    width: props.width || 'auto',
    height: props.height || 'auto',
    padding: props.padding || "8px 16px",
    borderRadius: props.borderRadius || '6px',
    
    // Font
    fontSize: props.fontSize,
    fontWeight: props.fontWeight || '500',
    
    // Icon spacing
    gap: props.iconSpacing || '8px',
    
    // Hover states (will be handled by CSS)
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
.k-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    font-family: inherit;
}

/* Hover state */
.k-button:hover:not(.is-disabled):not(.is-loading) {
    background-color: var(--hover-bg) !important;
    color: var(--hover-color) !important;
    transform: translateY(-1px);
}

/* Active state */
.k-button:active:not(.is-disabled):not(.is-loading) {
    background-color: var(--active-bg) !important;
    transform: translateY(0);
}

/* Justify content */
.k-button.justify-flex-start {
    justify-content: flex-start;
}
.k-button.justify-center {
    justify-content: center;
}
.k-button.justify-flex-end {
    justify-content: flex-end;
}
.k-button.justify-space-between {
    justify-content: space-between;
}

/* Icons */
.icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
}

/* Disabled */
.k-button.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Loading */
.k-button.is-loading {
    cursor: wait;
}

.spin {
    animation: k-spin 0.8s linear infinite;
}

/* Shimmer Animation */
.k-button.has-shimmer {
    position: relative;
    overflow: hidden;
}

.shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    animation: shimmer 1.5s infinite;
}

/* Focus */
.k-button:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes shimmer {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
</style>