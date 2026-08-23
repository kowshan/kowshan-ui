<!-- components/KPhoneInput.vue -->
<!--
    KPhoneInput — Iranian mobile input:

      <KPhoneInput v-model="phone" label="شماره موبایل" />

    Stores a plain 11-digit string ("09121234567"); Persian/Arabic digits
    are normalized, +98 / 0098 prefixes are stripped automatically.
    Emits `validate` with { valid, error } on change/blur.
-->
<template>
    <div class="k-phone">
        <label v-if="label" class="k-phone-label">{{ label }}</label>
        <div class="k-phone-field" :class="fieldClass">
            <span class="k-phone-prefix">
                +98
            </span>
            <input
                :value="display"
                type="tel"
                inputmode="tel"
                class="k-phone-input"
                :placeholder="placeholder"
                :disabled="disabled"
                @input="onInput"
                @blur="emitValidate"
                @keyup.enter="emitValidate"
            />
            <CheckCircle2
                v-if="valid === true"
                :size="16"
                class="k-phone-ok"
            />
            <AlertCircle
                v-else-if="valid === false"
                :size="16"
                class="k-phone-bad"
            />
        </div>
        <span v-if="hint" class="k-phone-hint" :class="{ 'is-error': valid === false }">
            {{ valid === false && errorText ? errorText : hint }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { useIranianValidators } from '../composables/useIranianValidators'

const props = withDefaults(defineProps<{
    modelValue?: string
    label?: string
    hint?: string
    placeholder?: string
    disabled?: boolean
    errorText?: string
}>(), {
    modelValue: '',
    label: '',
    hint: '',
    placeholder: '۰۹۱۲ ۳۴۵ ۶۷۸۹',
    disabled: false,
    errorText: 'شماره موبایل معتبر نیست'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'validate', result: { valid: boolean; error: string | null }): void
}>()

const { normalize } = usePersianNumbers()
const { isValidMobile } = useIranianValidators()

const raw = ref(props.modelValue)
const valid = ref<boolean | null>(null)

/* normalized value without +98/0098 prefix */
const clean = computed(() => {
    let d = normalize(raw.value).replace(/\D/g, '')
    if (d.startsWith('0098')) d = '0' + d.slice(4)
    else if (d.startsWith('98') && d.length === 12) d = '0' + d.slice(2)
    return d.slice(0, 11)
})

const display = computed(() => {
    const d = clean.value
    if (!d) return ''
    if (d.length <= 4) return d
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
})

const fieldClass = computed(() => ({
    'is-valid': valid.value === true,
    'is-invalid': valid.value === false,
    'is-disabled': props.disabled
}))

const onInput = (e: Event) => {
    raw.value = normalize((e.target as HTMLInputElement).value)
    emit('update:modelValue', clean.value)
    if (clean.value.length === 11) emitValidate()
    else valid.value = clean.value ? false : null
}

const emitValidate = () => {
    const ok = clean.value.length === 0 ? true : isValidMobile(clean.value)
    valid.value = clean.value ? ok : null
    emit('validate', { valid: ok, error: ok ? null : props.errorText })
}
</script>

<style scoped>
.k-phone {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.k-phone-label {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
}

.k-phone-field {
    display: flex;
    align-items: center;
    height: 42px;
    background: var(--k-bg, #fff);
    border: 1.5px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-phone-field:focus-within {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
}

.k-phone-field.is-valid { border-color: var(--k-success, #10b981); }
.k-phone-field.is-invalid { border-color: var(--k-error, #ef4444); }
.k-phone-field.is-disabled { opacity: 0.6; pointer-events: none; }

.k-phone-prefix {
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0 12px;
    background: var(--k-surface, #f8fafc);
    border-inline-end: 1px solid var(--k-border, #e2e8f0);
    color: var(--k-text-secondary, #64748b);
    font-size: 0.76rem;
    font-weight: 700;
    direction: ltr;
}

.k-phone-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0 12px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--k-text-primary, #1e293b);
    font-size: 0.84rem;
    font-family: inherit;
    direction: ltr;
    text-align: start;
}

.k-phone-input::placeholder { color: var(--k-placeholder, #cbd5e1); }

.k-phone-ok {
    color: var(--k-success, #10b981);
    margin-inline-end: 12px;
    flex-shrink: 0;
}

.k-phone-bad {
    color: var(--k-error, #ef4444);
    margin-inline-end: 12px;
    flex-shrink: 0;
}

.k-phone-hint {
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-phone-hint.is-error { color: var(--k-error, #ef4444); }
</style>
