<!-- KPasswordStrength — password input with animated strength meter and criteria checklist -->
<template>
    <div class="k-pws">
        <label v-if="label && showInput" class="k-label">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <div v-if="showInput" class="k-pws-input-wrap" :class="{ 'is-focused': isFocused, 'has-error': errorMessage }">
            <Lock v-if="!showPassword" :size="16" class="k-pws-icon" />
            <Unlock v-else :size="16" class="k-pws-icon" />
            <input
                ref="inputRef"
                :type="showPassword ? 'text' : 'password'"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                class="k-pws-input"
                @input="onInput"
                @focus="isFocused = true"
                @blur="isFocused = false"
            />
            <button
                type="button"
                class="k-pws-toggle"
                @click="showPassword = !showPassword"
                tabindex="-1"
            >
                <EyeOff v-if="!showPassword" :size="16" />
                <Eye v-else :size="16" />
            </button>
        </div>

        <!-- Strength Bar -->
        <div v-if="modelValue" class="k-pws-meter">
            <div class="k-pws-meter-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }" />
        </div>
        <div v-if="modelValue" class="k-pws-label" :class="strengthClass">
            {{ strengthText }}
        </div>

        <!-- Criteria List -->
        <div v-if="modelValue && showCriteria" class="k-pws-criteria">
            <div v-for="c in criteria" :key="c.key" class="k-pws-criterion" :class="{ 'is-met': c.met }">
                <CheckCircle2 v-if="c.met" :size="13" />
                <Circle v-else :size="13" />
                <span>{{ c.label }}</span>
            </div>
        </div>

        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle :size="12" /> {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Lock, Unlock, Eye, EyeOff, CheckCircle2, Circle, AlertCircle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    minLength?: number
    showCriteria?: boolean
    /** `false` renders the meter + criteria only — for forms that use
     *  `KPasswordInput` for the password and the confirmation side by side
     *  and want the strength block underneath both. */
    showInput?: boolean
    rules?: { key: string; label: string; test: (v: string) => boolean }[]
}>(), {
    modelValue: '',
    placeholder: 'رمز عبور را وارد کنید...',
    minLength: 8,
    showCriteria: true,
    showInput: true,
    rules: () => [
        { key: 'length', label: 'حداقل ۸ کاراکتر', test: (v) => v.length >= 8 },
        { key: 'upper', label: 'حداقل یک حرف بزرگ', test: (v) => /[A-Z]/.test(v) },
        { key: 'lower', label: 'حداقل یک حرف کوچک', test: (v) => /[a-z]/.test(v) },
        { key: 'number', label: 'حداقل یک عدد', test: (v) => /[0-9]/.test(v) },
        { key: 'special', label: 'حداقل یک نماد (!@#$...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
    ]
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'strength-change': [level: number, label: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const criteria = computed(() => props.rules.map(r => ({
    ...r,
    met: r.test(props.modelValue || '')
})))

const metCount = computed(() => criteria.value.filter(c => c.met).length)

const strengthLevel = computed(() => {
    if (!props.modelValue) return 0
    const ratio = metCount.value / props.rules.length
    if (ratio <= 0.2) return 1
    if (ratio <= 0.4) return 2
    if (ratio <= 0.6) return 3
    if (ratio <= 0.8) return 4
    return 5
})

const strengthPct = computed(() => (strengthLevel.value / 5) * 100)
const strengthClass = computed(() => ['weak', 'fair', 'good', 'strong', 'very-strong'][strengthLevel.value - 1] || '')
const strengthText = computed(() => ['ضعیف', 'متوسط', 'خوب', 'قوی', 'بسیار قوی'][strengthLevel.value - 1] || '')

watch(strengthLevel, (l) => emit('strength-change', l, strengthText.value))

const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}

defineExpose({ focus: () => inputRef.value?.focus(), strengthLevel })
</script>

<style scoped>
.k-pws { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.k-label { font-size: 0.75rem; font-weight: 500; color: var(--k-text-secondary); }
.k-required { color: var(--k-error); margin-inline-end: 2px; }

.k-pws-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--k-bg); border: 1px solid var(--k-border); border-radius: var(--k-radius-sm);
    padding: 0 12px; min-height: 36px; transition: border-color 0.15s;
}
.k-pws-input-wrap.is-focused { border-color: var(--k-primary); }
.k-pws-input-wrap.has-error { border-color: var(--k-error); }

.k-pws-icon { color: var(--k-text-muted); flex-shrink: 0; }
.k-pws-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 0.85rem; color: var(--k-text-primary); font-family: inherit;
}
.k-pws-input::placeholder { color: var(--k-text-muted); }
.k-pws-toggle {
    display: flex; align-items: center; border: none; background: transparent;
    color: var(--k-text-muted); cursor: pointer; padding: 4px;
}
.k-pws-toggle:hover { color: var(--k-text-primary); }

.k-pws-meter { height: 4px; background: var(--k-border); border-radius: 999px; overflow: hidden; margin-top: 2px; }
.k-pws-meter-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease, background 0.3s; }
.k-pws-meter-fill.weak { background: #ef4444; }
.k-pws-meter-fill.fair { background: #f97316; }
.k-pws-meter-fill.good { background: #eab308; }
.k-pws-meter-fill.strong { background: var(--k-success); }
.k-pws-meter-fill.very-strong { background: var(--k-primary); }

.k-pws-label { font-size: 0.7rem; font-weight: 600; }
.k-pws-label.weak { color: #ef4444; }
.k-pws-label.fair { color: #f97316; }
.k-pws-label.good { color: #eab308; }
.k-pws-label.strong { color: var(--k-success); }
.k-pws-label.very-strong { color: var(--k-primary); }

.k-pws-criteria { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.k-pws-criterion {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.7rem; color: var(--k-text-muted); transition: color 0.15s;
}
.k-pws-criterion.is-met { color: var(--k-success); }

.k-message-area { font-size: 0.7rem; }
.k-error-message { display: flex; align-items: center; gap: 4px; color: var(--k-error); }
</style>
