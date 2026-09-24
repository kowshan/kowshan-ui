<!-- wrappers/KToggle.vue -->
<template>
    <div class="k-toggle" :class="[`k-toggle-${size}`, { 'is-disabled': disabled, 'is-on': isOn }]">
        <button
            type="button"
            role="switch"
            class="k-toggle-btn"
            :class="{ 'is-checked': isOn }"
            :aria-checked="isOn"
            :aria-label="label || ariaLabel"
            :disabled="disabled"
            :style="checkedColor ? { '--k-toggle-color': checkedColor } : {}"
            @click="toggle"
        >
            <span class="k-toggle-thumb"></span>
        </button>

        <span class="k-toggle-label" @click="!disabled && toggle()">
            <template v-if="label">{{ label }}</template>
            <template v-else-if="isOn && onText">{{ onText }}</template>
            <template v-else-if="!isOn && offText">{{ offText }}</template>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: boolean
    label?: string
    onText?: string
    offText?: string
    disabled?: boolean
    checkedColor?: string
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
}>(), {
    modelValue: false,
    size: 'md'
})

const emits = defineEmits<{
    'update:modelValue': [value: boolean]
    'change': [value: boolean]
}>()

const isOn = computed(() => props.modelValue)

const toggle = () => {
    if (props.disabled) return
    const next = !isOn.value
    emits('update:modelValue', next)
    emits('change', next)
}
</script>

<style scoped>
.k-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.k-toggle-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 44px;
    height: 24px;
    padding: 2px;
    border: none;
    border-radius: 999px;
    background: var(--k-border, #cbd5e1);
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
}

.k-toggle-btn.is-checked {
    background: var(--k-toggle-color, var(--k-primary));
}

.k-toggle-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    /* RTL: off = left */
    transform: translateX(0);
}

.k-toggle-btn.is-checked .k-toggle-thumb {
    transform: translateX(-20px);
}

/* Sizes */
.k-toggle-sm .k-toggle-btn {
    width: 36px;
    height: 20px;
}

.k-toggle-sm .k-toggle-thumb {
    width: 16px;
    height: 16px;
}

.k-toggle-sm .k-toggle-btn.is-checked .k-toggle-thumb {
    transform: translateX(-16px);
}

.k-toggle-lg .k-toggle-btn {
    width: 52px;
    height: 28px;
}

.k-toggle-lg .k-toggle-thumb {
    width: 24px;
    height: 24px;
}

.k-toggle-lg .k-toggle-btn.is-checked .k-toggle-thumb {
    transform: translateX(-24px);
}

/* Label */
.k-toggle-label {
    font-size: 0.85rem;
    color: var(--k-text-primary);
    cursor: pointer;
}

.k-toggle.is-disabled {
    opacity: 0.5;
    pointer-events: none;
}

.k-toggle-btn:focus-visible {
    outline: 2px solid var(--k-toggle-color, var(--k-primary));
    outline-offset: 2px;
}
</style>
