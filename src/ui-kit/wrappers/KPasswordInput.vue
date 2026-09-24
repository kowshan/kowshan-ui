<!-- wrappers/KPasswordInput.vue -->
<template>
    <KTextInput
        ref="passwordRef"
        v-bind="forwardedAttrs"
        :type="inputType"
        :model-value="modelValue"
        :right-icon="EyeIcon"
        :clearable="clearable"
        :label="label"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rules="rules"
        :validate-on="validateOn"
        :debounce-ms="debounceMs"
        :loading="loading"
        :maxlength="maxlength"
        :minlength="minlength"
        :hint="hint"
        @update:model-value="handleUpdate"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange"
        @clear="handleClear"
        @right-icon-click="toggleVisibility"
    />
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import KTextInput from './KTextInput.vue'
import type { ValidationRules } from '../types'

const props = defineProps<{
    modelValue?: string | number
    label?: string
    hint?: string
    clearable?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: ValidationRules
    validateOn?: 'input' | 'blur' | 'both'
    debounceMs?: number
    loading?: boolean
    maxlength?: number
    minlength?: number
}>()

const emits = defineEmits<{
    'update:modelValue': [value: string | number]
    'focus': [value: string | number]
    'blur': [value: string | number]
    'input': [value: string | number]
    'change': [value: string | number]
    'clear': []
}>()

/* This wrapper owns its input type: masked by default, revealed while the eye
   is on. A consumer's own `type` must therefore never reach the inner input —
   it would win over `inputType` and leave the field revealed in *both* states
   (the eye would flip its icon but never re-mask the text). */
/* inheritAttrs off is load-bearing: with it on, Vue ALSO merges this component's
   attrs onto the root component (KTextInput) and that merge wins over the props
   bound here — so a consumer's `type="text"` defeated the toggle even though it
   is filtered out of `forwardedAttrs` below. */
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const forwardedAttrs = computed(() => {
    const { type: _ignored, ...rest } = attrs
    return rest
})

const showPassword = ref(false)
const inputType = computed<any>(() => showPassword.value ? 'text' : 'password')

// Dynamic icon based on visibility state
const EyeIcon = computed(() => showPassword.value ? EyeOff : Eye)

const passwordRef = ref<InstanceType<typeof KTextInput> | null>(null)

const handleUpdate = (value: string | number) => {
    emits('update:modelValue', value)
}

const toggleVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleFocus = (value: string | number) => {
    emits('focus', value)
}

const handleBlur = (value: string | number) => {
    emits('blur', value)
}

const handleInput = (value: string | number) => {
    emits('input', value)
}

const handleChange = (value: string | number) => {
    emits('change', value)
}

const handleClear = () => {
    emits('clear')
}

defineExpose({
    focus: () => passwordRef.value?.focus(),
    blur: () => passwordRef.value?.blur(),
    validate: () => passwordRef.value?.validate(),
    clearError: () => passwordRef.value?.clearError(),
    toggleVisibility: () => { showPassword.value = !showPassword.value }
})
</script>