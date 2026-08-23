<!-- components/KBankCardInput.vue -->
<!--
    KBankCardInput — Iranian bank-card input. Groups 4-4-4-4, validates the
    16 digits with Luhn and detects the issuing bank from the BIN (first 6
    digits). Model holds the clean 16-digit string.

      <KBankCardInput v-model="card" label="شماره کارت" />
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
                :maxlength="19"
                @input="onInput"
                @blur="check(true)"
            />
            <span
                v-if="bank"
                class="k-iran-bank"
                :style="{ background: `color-mix(in srgb, ${bank.color} 16%, transparent)`, color: bank.color }"
            >
                {{ bank.name }}
            </span>
            <span class="k-iran-status">
                <CheckCircle2 v-if="state === 'valid'" :size="15" class="is-valid" />
                <AlertCircle v-else-if="state === 'invalid'" :size="15" class="is-invalid" />
            </span>
        </div>

        <div v-if="state === 'invalid'" class="k-iran-message is-error">شماره کارت معتبر نیست</div>
        <div v-else-if="state === 'valid'" class="k-iran-message is-ok">کارت معتبر — {{ bank?.name }}</div>
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
    placeholder: '۴۴۴۴ ۴۴۴۴ ۴۴۴۴ ۴۴۴۴',
    required: false,
    disabled: false,
    readonly: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'validate': [result: { valid: boolean }]
}>()

const { validateCard } = useIranianValidators()
const { toPersianDigits } = usePersianNumbers()

const state = ref<'idle' | 'valid' | 'invalid'>('idle')
const bank = computed(() => (props.modelValue ? validateCard(props.modelValue).bank : null))

const display = computed(() => {
    if (!props.modelValue) return ''
    const groups = props.modelValue.match(/.{1,4}/g) ?? []
    return toPersianDigits(groups.join(' '))
})

const onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value
    const digits = raw.replace(/[۰-۹٠-٩\d]/g, d => String('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d) % 10)).replace(/\D/g, '').slice(0, 16)
    emits('update:modelValue', digits)
    ;(e.target as HTMLInputElement).value = displayFromDigits(digits)
    check(false)
}

const displayFromDigits = (d: string) => {
    const groups = d.match(/.{1,4}/g) ?? []
    return toPersianDigits(groups.join(' '))
}

const check = (touched: boolean) => {
    const v = props.modelValue
    if (!v) {
        state.value = 'idle'
        return
    }
    const { valid } = validateCard(v)
    state.value = v.length === 16 ? (valid ? 'valid' : 'invalid') : 'idle'
    if (touched || v.length === 16) emits('validate', { valid })
}

watch(() => props.modelValue, () => check(false), { immediate: true })
</script>

<style scoped>
@import './iran-input.css';
</style>
