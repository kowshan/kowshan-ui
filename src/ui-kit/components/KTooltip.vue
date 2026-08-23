<!-- components/KTooltip.vue -->
<template>
    <span
        class="k-tooltip-host"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
        @click="onClick"
    >
        <slot />

        <Transition name="k-tooltip-fade">
            <div
                v-if="visible && content"
                class="k-tooltip"
                :class="[`pos-${position}`, `theme-${theme}`, `size-${size}`]"
                role="tooltip"
            >
                {{ content }}
            </div>
        </Transition>
    </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
    content?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    theme?: 'dark' | 'light'
    trigger?: 'hover' | 'click'
    size?: 'sm' | 'md' | 'lg'
    delay?: number
    disabled?: boolean
}>(), {
    position: 'top',
    theme: 'dark',
    trigger: 'hover',
    size: 'md',
    delay: 150
})

const visible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const show = () => {
    if (props.disabled || !props.content) return
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => { visible.value = true }, props.delay)
}

const hide = () => {
    if (timeoutId) clearTimeout(timeoutId)
    visible.value = false
}

const toggle = () => {
    if (visible.value) hide()
    else show()
}

const onEnter = () => { if (props.trigger !== 'click') show() }
const onLeave = () => { if (props.trigger !== 'click') hide() }
const onFocusIn = () => { if (props.trigger !== 'click') show() }
const onFocusOut = () => { if (props.trigger !== 'click') hide() }
const onClick = () => { if (props.trigger === 'click') toggle() }
</script>

<style scoped>
.k-tooltip-host {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.k-tooltip {
    position: absolute;
    z-index: 1000;
    white-space: nowrap;
    border-radius: 6px;
    font-weight: 500;
    pointer-events: none;
    text-align: center;
    max-width: 260px;
}

/* Position offsets (relative to the host) */
.pos-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
}

.pos-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
}

.pos-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
}

.pos-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
}

/* Themes */
.theme-dark {
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.theme-light {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid var(--k-border, #e2e8f0);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Sizes */
.size-sm { font-size: 0.68rem; padding: 3px 8px; }
.size-md { font-size: 0.75rem; padding: 5px 10px; }
.size-lg { font-size: 0.85rem; padding: 7px 14px; }

.k-tooltip-fade-enter-active,
.k-tooltip-fade-leave-active {
    transition: opacity 0.15s ease;
}

.k-tooltip-fade-enter-from,
.k-tooltip-fade-leave-to {
    opacity: 0;
}
</style>
