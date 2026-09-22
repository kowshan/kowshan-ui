<!-- components/KPostalCodeInput.vue -->
<!--
    KPostalCodeInput — Iranian postal code (کد پستی) input. 10 digits,
    live format sanity check (leading digit 1-9, district digit 0-5).

      <KPostalCodeInput v-model="postal" label="کد پستی" />
-->
<template>
    <div class="k-iran-input" :class="[`is-${state}`, { 'is-disabled': disabled }]">
        <label v-if="label" class="k-iran-label">
            {{ label }}
            <span v-if="required" class="k-iran-required">*</span>
        </label>

        <div class="k-iran-field">
            <input
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

        <div v-if="state === 'invalid'" class="k-iran-message is-error">کد پستی معتبر نیست</div>
        <div v-else-if="state === 'valid'" class="k-iran-message is-ok">کد پستی معتبر است</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { useIranianValidators } from '../composables/useIranianValidators'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { toAsciiDigits } from '../utils/digits'

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
    placeholder: 'کد پستی ۱۰ رقمی',
    required: false,
    disabled: false,
    readonly: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'validate': [result: { valid: boolean }]
}>()

const { isValidPostalCode } = useIranianValidators()
const { toPersianDigits } = usePersianNumbers()

const state = ref<'idle' | 'valid' | 'invalid'>('idle')

const display = computed(() => (props.modelValue ? props.modelValue : ''))

const onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value
    const digits = toAsciiDigits(raw).replace(/\D/g, '').slice(0, 10)
    emits('update:modelValue', digits)
    ;(e.target as HTMLInputElement).value = digits
    check(false)
}

const check = (touched: boolean) => {
    const v = props.modelValue
    if (!v) {
        state.value = 'idle'
        return
    }
    const valid = isValidPostalCode(v)
    state.value = v.length === 10 ? (valid ? 'valid' : 'invalid') : 'idle'
    if (touched || v.length === 10) emits('validate', { valid })
}

watch(() => props.modelValue, () => check(false), { immediate: true })
</script>

<style scoped>
@import './iran-input.css';
</style>
