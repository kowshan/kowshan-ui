<!-- components/KOTPInput.vue -->
<!--
    KOTPInput — one-time password / verification code input:

      <KOTPInput
        v-model="code"
        :length="6"
        :state="state"        // 'idle' | 'loading' | 'success' | 'error'
        @complete="onCodeComplete"
      />

    - Auto-advances focus, Backspace goes to the previous box
    - Paste a full code (Persian/Arabic digits are normalized to Latin)
    - Emits `complete` once all boxes are filled (only in 'idle' state)
-->
<template>
    <div class="k-otp" :class="[`k-otp--${state}`, { 'is-disabled': disabled }]">
        <div class="k-otp-boxes">
            <input
                v-for="(_, i) in length"
                :key="i"
                ref="boxEls"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                class="k-otp-box"
                :class="{ 'is-filled': !!boxes[i], 'is-active': activeIndex === i }"
                :value="boxes[i]"
                :disabled="disabled || state === 'loading'"
                :aria-label="`رقم ${faNum(i + 1)}`"
                @input="onInput(i, $event)"
                @keydown="onKeydown(i, $event)"
                @paste="onPaste(i, $event)"
                @focus="activeIndex = i"
                @blur="activeIndex = -1"
            />
        </div>

        <!-- Status row -->
        <div class="k-otp-status">
            <Loader2 v-if="state === 'loading'" :size="16" class="k-otp-spin" />
            <CheckCircle2 v-else-if="state === 'success'" :size="16" class="k-otp-success-icon" />
            <AlertCircle v-else-if="state === 'error'" :size="16" class="k-otp-error-icon" />

            <span
                v-if="state === 'success' && successText"
                class="k-otp-success-text"
            >{{ successText }}</span>
            <span
                v-else-if="state === 'error' && errorText"
                class="k-otp-error-text"
            >{{ errorText }}</span>

            <slot name="status" />

            <span v-if="state === 'idle' && filledCount === length && autoSubmit" class="k-otp-hint">
                در حال بررسی…
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    /** the full code as a plain Latin string ('' = empty) */
    modelValue?: string
    /** number of boxes */
    length?: number
    state?: 'idle' | 'loading' | 'success' | 'error'
    disabled?: boolean
    /** emit `complete` automatically when all boxes are filled */
    autoSubmit?: boolean
    successText?: string
    errorText?: string
}>(), {
    modelValue: '',
    length: 6,
    state: 'idle',
    disabled: false,
    autoSubmit: true,
    successText: '',
    errorText: ''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'complete', value: string): void
}>()

const { toEnglishDigits, toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const boxEls = ref<HTMLInputElement[]>([])
const boxes = ref<string[]>(Array(props.length).fill(''))
const activeIndex = ref(-1)

const code = computed(() => boxes.value.join(''))
const filledCount = computed(() => boxes.value.filter(b => b !== '').length)

/* external reset: an empty modelValue clears every box */
watch(
    () => props.modelValue,
    (v) => {
        if (v === '' || v == null) {
            boxes.value = Array(props.length).fill('')
        }
    }
)

const syncModel = () => {
    emit('update:modelValue', code.value)
    if (props.autoSubmit && filledCount.value === props.length && props.state === 'idle') {
        nextTick(() => emit('complete', code.value))
    }
}

const focusBox = (i: number) => {
    const el = boxEls.value[i]
    if (el) {
        el.focus()
        el.select()
    }
}

const onInput = (i: number, e: Event) => {
    const target = e.target as HTMLInputElement
    let raw = target.value

    // Multi-char input (autofill/IME): take the tail of the remaining code
    if (raw.length > 1) {
        const rest = toEnglishDigits(raw).replace(/\D/g, '').slice(0, props.length)
        for (let k = 0; k < rest.length; k++) {
            boxes.value[k] = rest[k] ?? ''
        }
        target.value = boxes.value[i] ?? ''
        focusBox(Math.min(props.length - 1, rest.length - 1))
        syncModel()
        return
    }

    raw = toEnglishDigits(raw).replace(/\D/g, '')
    boxes.value[i] = raw

    // keep the visible box value in sync (normalized)
    target.value = raw

    if (raw && i < props.length - 1) {
        focusBox(i + 1)
    }
    syncModel()
}

const onKeydown = (i: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
        if (boxes.value[i]) {
            boxes.value[i] = ''
            syncModel()
        } else if (i > 0) {
            boxes.value[i - 1] = ''
            focusBox(i - 1)
            syncModel()
        }
        return
    }
    if (e.key === 'ArrowLeft' && i > 0) {
        focusBox(i - 1)
        return
    }
    if (e.key === 'ArrowRight' && i < props.length - 1) {
        focusBox(i + 1)
    }
}

const onPaste = (i: number, e: ClipboardEvent) => {
    e.preventDefault()
    const raw = toEnglishDigits(e.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
    if (!raw) return

    const rest = raw.slice(0, props.length)
    for (let k = 0; k < rest.length; k++) {
        boxes.value[k] = rest[k] ?? ''
    }
    focusBox(Math.min(props.length - 1, rest.length - 1))
    syncModel()
}
</script>

<style scoped>
.k-otp {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.k-otp.is-disabled {
    opacity: 0.6;
    pointer-events: none;
}

.k-otp-boxes {
    display: flex;
    gap: 8px;
    direction: ltr;
    width: 100%;
    justify-content: center;
}

.k-otp-box {
    flex: 1 1 0;
    min-width: 0;
    max-width: 52px;
    height: 52px;
    border: 1.5px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    background: var(--k-bg, #ffffff);
    color: var(--k-text-primary, #1e293b);
    font-size: 1.2rem;
    font-weight: 700;
    font-family: inherit;
    text-align: center;
    outline: none;
    caret-color: var(--k-primary, #1db954);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.k-otp-box:focus,
.k-otp-box.is-active {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
}

.k-otp-box.is-filled {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 45%, var(--k-border, #e2e8f0));
}

/* states */
.k-otp--loading .k-otp-box.is-filled {
    border-color: var(--k-border, #e2e8f0);
}

.k-otp--success .k-otp-box {
    border-color: var(--k-success, #10b981);
    color: var(--k-success, #10b981);
}

.k-otp--error .k-otp-box {
    border-color: var(--k-error, #ef4444);
    animation: k-shake 0.35s ease;
}

.k-otp-status {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 18px;
    font-size: 0.75rem;
}

.k-otp-spin {
    animation: k-spin 0.8s linear infinite;
    color: var(--k-primary, #1db954);
}

.k-otp-success-icon { color: var(--k-success, #10b981); }
.k-otp-error-icon { color: var(--k-error, #ef4444); }

.k-otp-success-text { color: var(--k-success, #10b981); font-weight: 600; }
.k-otp-error-text { color: var(--k-error, #ef4444); font-weight: 600; }
.k-otp-hint { color: var(--k-text-muted, #94a3b8); }
</style>
