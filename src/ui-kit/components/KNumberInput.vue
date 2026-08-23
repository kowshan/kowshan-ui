<!-- components/KNumberInput.vue -->
<template>
    <div
        class="k-number-input"
        :class="{
            'is-disabled': disabled,
            'has-error': error
        }"
    >
        <label v-if="label" class="k-number-label">{{ label }}</label>
        <button
            type="button"
            class="k-number-btn"
            :disabled="disabled || atMin"
            aria-label="کاهش"
            @click="step(-1)"
        >
            <Minus class="icon" />
        </button>

        <input
            class="k-number-field"
            type="text"
            inputmode="numeric"
            :value="display"
            :disabled="disabled"
            @focus="editing = true"
            @blur="commit"
            @keydown.enter="commit"
            @keydown.up.prevent="step(1)"
            @keydown.down.prevent="step(-1)"
            @input="onInput"
        />

        <button
            type="button"
            class="k-number-btn"
            :disabled="disabled || atMax"
            aria-label="افزایش"
            @click="step(1)"
        >
            <Plus class="icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    error?: boolean
    label?: string
}>(), {
    min: -Infinity,
    max: Infinity,
    step: 1,
    disabled: false,
    error: false
})

const emits = defineEmits<{
    'update:modelValue': [value: number]
    'change': [value: number]
}>()

const editing = ref(false)
const draft = ref('')

const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n))

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: number | string) => String(n).replace(/\d/g, d => faDigits[Number(d)])

// Persian kit — always show Persian digits
const display = computed(() => {
    if (editing.value) return draft.value
    return faNum(props.modelValue)
})

const atMin = computed(() => props.modelValue <= props.min)
const atMax = computed(() => props.modelValue >= props.max)

const step = (dir: number) => {
    const next = clamp(props.modelValue + props.step * dir)
    if (next !== props.modelValue) {
        emits('update:modelValue', next)
        emits('change', next)
    }
}

const onInput = (e: Event) => {
    const el = e.target as HTMLInputElement
    // Persian/Arabic digits → Latin so the model always holds clean numbers
    const v = el.value.replace(/[۰-۹٠-٩]/g, d => String('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d) % 10))
    if (v !== el.value) el.value = v
    draft.value = v
}

const commit = () => {
    editing.value = false
    const parsed = parseInt(draft.value.replace(/[۰-۹٠-٩]/g, d => String('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d) % 10)), 10)
    if (isNaN(parsed)) {
        draft.value = ''
        return
    }
    const next = clamp(parsed)
    draft.value = ''
    if (next !== props.modelValue) {
        emits('update:modelValue', next)
        emits('change', next)
    }
}

/* Sync draft when the model changes externally */
watch(() => props.modelValue, () => { if (!editing.value) draft.value = '' })
</script>

<style scoped>
.k-number-input {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 10px);
    padding: 2px;
    transition: border-color 0.15s ease;
    direction: rtl;
    position: relative;
}

.k-number-label {
    position: absolute;
    top: -8px;
    right: 10px;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-bg, #ffffff);
    padding: 0 5px;
}

.k-number-input:focus-within {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 15%, transparent);
}

.k-number-input.has-error {
    border-color: var(--k-error, #dc2626);
}

.k-number-input.is-disabled {
    opacity: 0.55;
    pointer-events: none;
}

.k-number-btn {
    width: 30px;
    height: 30px;
    border: none;
    background: var(--k-surface, #f8fafc);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--k-text-secondary, #64748b);
    transition: all 0.12s ease;
    flex-shrink: 0;
}

.k-number-btn:hover:not(:disabled) {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
}

.k-number-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.k-number-btn .icon {
    width: 14px;
    height: 14px;
}

.k-number-field {
    width: 64px;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    padding: 6px 4px;
}

.k-number-field:disabled {
    background: transparent;
}
</style>
