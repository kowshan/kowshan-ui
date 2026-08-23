<!-- components/KShibaInput.vue -->
<!--
    KShibaInput — Iranian Sheba (شماره شبا / IBAN) input. Auto-prefixes
    "IR", groups digits 4-by-4, validates ISO 7064 mod-97 and detects the
    bank from the 3-digit prefix. Model holds the full code ("IR…").

      <KShibaInput v-model="sheba" label="شماره شبا" />
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
                :maxlength="29"
                @input="onInput"
                @blur="check(true)"
            />
            <span v-if="bank" class="k-iran-bank">{{ bank.name }}</span>
            <span class="k-iran-status">
                <CheckCircle2 v-if="state === 'valid'" :size="15" class="is-valid" />
                <AlertCircle v-else-if="state === 'invalid'" :size="15" class="is-invalid" />
            </span>
        </div>

        <div v-if="state === 'invalid'" class="k-iran-message is-error">شماره شبا معتبر نیست</div>
        <div v-else-if="state === 'valid'" class="k-iran-message is-ok">شبا معتبر — {{ bank?.name }}</div>
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
    placeholder: 'IR ۱۲۳۴ ۵۶۷۸ …',
    required: false,
    disabled: false,
    readonly: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'validate': [result: { valid: boolean }]
}>()

const { normalizeShiba, isValidShiba, bankFromShiba } = useIranianValidators()
const { toPersianDigits } = usePersianNumbers()

const state = ref<'idle' | 'valid' | 'invalid'>('idle')
const bank = computed(() => (props.modelValue ? bankFromShiba(props.modelValue) : null))

/* display: IR + 4-digit groups (26 chars max) */
const display = computed(() => {
    const s = normalizeShiba(props.modelValue)
    const body = s.slice(2)
    const groups = body.match(/.{1,4}/g) ?? []
    return 'IR ' + groups.join(' ')
})

const onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value
    const cleaned = normalizeShiba(raw)
    // keep IR + at most 24 digits
    const digits = cleaned.slice(2).replace(/\D/g, '').slice(0, 24)
    emits('update:modelValue', 'IR' + digits)
    check(false)
}

const check = (touched: boolean) => {
    const v = props.modelValue
    if (!v || v.length < 10) {
        state.value = 'idle'
        return
    }
    const valid = isValidShiba(v)
    state.value = v.length === 26 ? (valid ? 'valid' : 'invalid') : 'idle'
    if (touched || v.length === 26) emits('validate', { valid })
}

watch(() => props.modelValue, () => check(false), { immediate: true })
</script>

<style scoped>
@import './iran-input.css';
</style>
