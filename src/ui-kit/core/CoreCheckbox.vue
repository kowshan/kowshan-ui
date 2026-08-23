<!-- core/CoreCheckbox.vue -->
<template>
    <input
        ref="checkboxRef"
        type="checkbox"
        :checked="isChecked"
        :indeterminate="indeterminate"
        :name="name"
        :disabled="disabled"
        :required="required"
        v-bind="ariaAttributes"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
    />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccessibility } from '../composables/useAccessibility'

// Props
const props = defineProps<{
    modelValue?: boolean | null
    label?: string  // Still here for convenience, but not rendered
    name?: string
    disabled?: boolean
    required?: boolean
    indeterminate?: boolean
    ariaLabel?: string
    ariaDescribedBy?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: boolean | null]
    'change': [value: boolean | null]
    'blur': [value: boolean | null]
    'focus': [value: boolean | null]
}>()

// Refs
const checkboxRef = ref<HTMLInputElement | null>(null)
// Preserve null (tri-state) — don't coerce to false with `||`
const internalValue = ref(props.modelValue ?? false)

// Computed
const isChecked = computed(() => {
    if (props.indeterminate || internalValue.value === null) return false
    return !!internalValue.value
})

// Accessibility
const { getAriaAttributes } = useAccessibility({
    label: props.ariaLabel || props.label,
    describedBy: props.ariaDescribedBy,
    required: props.required,
    disabled: props.disabled
})

const ariaAttributes = computed(() => getAriaAttributes())

// Handlers
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.checked
    
    internalValue.value = value
    emits('update:modelValue', value)
    emits('change', value)
}

const handleBlur = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.checked
    emits('blur', value)
}

const handleFocus = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.checked
    emits('focus', value)
}

// Watch
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal ?? false
    }
})

watch(() => props.indeterminate, (newVal) => {
    if (checkboxRef.value) {
        checkboxRef.value.indeterminate = newVal || false
    }
}, { immediate: true })

// Expose
defineExpose({
    focus: () => checkboxRef.value?.focus(),
    blur: () => checkboxRef.value?.blur(),
    checkboxRef
})
</script>

<style>
/* COMPLETELY INVISIBLE - no default checkbox styles */
.core-checkbox-wrapper {
    display: contents;
}

input[type="checkbox"].core-checkbox {
    all: unset;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    opacity: 0;
    position: absolute;
    pointer-events: none;
}
</style>