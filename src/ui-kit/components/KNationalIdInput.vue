<!-- components/KNationalIdInput.vue -->
<!--
    KNationalIdInput — Iranian national ID (کد ملی) input. Normalizes
    Persian/Arabic digits, live-validates the 10-digit checksum and shows
    an inline result. Model holds the clean 10-digit string.

      <KNationalIdInput v-model="nationalId" label="کد ملی" />
-->
<template>
    <div class="k-iran-input" :class="[`is-${state}`, { 'is-disabled': disabled }]">
        <label v-if="label" class="k-iran-label">
            {{ label }}
            <span v-if="required" class="k-iran-required">*</span>
        </label>

        <div class="k-iran-field">
            <input
                ref="inputEl"
                class="k-iran-text"
                type="text"
                inputmode="numeric"
                dir="ltr"
                :value="display"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :maxlength="10"
                @input="onInput"
                @blur="check(true)"
            />
            <span class="k-iran-status">
                <CheckCircle2 v-if="state === 'valid'" :size="15" class="is-valid" />
                <AlertCircle v-else-if="state === 'invalid'" :size="15" class="is-invalid" />
            </span>
        </div>

        <div v-if="state === 'invalid'" class="k-iran-message is-error">کد ملی معتبر نیست</div>
        <div v-else-if="state === 'valid'" class="k-iran-message is-ok">کد ملی معتبر است</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { useIranianValidators } from '../composables/useIranianValidators'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
}>(), {
    modelValue: '',
    label: '',
    placeholder: 'کد ملی ۱۰ رقمی',
    required: false,
    disabled: false,
    readonly: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'validate': [result: { valid: boolean }]
}>()

const { isValidNationalId } = useIranianValidators()
const { toPersianDigits } = usePersianNumbers()

const state = ref<'idle' | 'valid' | 'invalid'>('idle')
const inputEl = ref<HTMLInputElement | null>(null)

const display = computed(() => {
    if (!props.modelValue) return ''
    return toPersianDigits(props.modelValue)
})

const onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value
    const digits = raw.replace(/[۰-۹٠-٩\d]/g, d => String('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d) % 10)).replace(/\D/g, '').slice(0, 10)
    emits('update:modelValue', digits)
    // rewrite the field with Persian digits as the user types
    ;(e.target as HTMLInputElement).value = toPersianDigits(digits)
    check(false)
}

const check = (touched: boolean) => {
    const v = props.modelValue
    if (!v) {
        state.value = 'idle'
        return
    }
    const valid = isValidNationalId(v)
    state.value = v.length === 10 ? (valid ? 'valid' : 'invalid') : 'idle'
    if (touched || v.length === 10) emits('validate', { valid })
}

watch(() => props.modelValue, () => check(false), { immediate: true })

defineExpose({ check, clear: () => emits('update:modelValue', '') })
</script>

<style scoped>
@import './iran-input.css';
</style>
