<!-- components/KCouponInput.vue -->
<!--
    KCouponInput — coupon code box for checkouts:

      <KCouponInput
        :coupons="[{ code: 'KIT10', percent: 10 }, { code: 'SUMMER', amount: 500000 }]"
        :base-price="890000"
        @applied="onApplied"
      />

    `coupons` entries: { code, percent? } for a percent discount or
    { code, amount } for a fixed amount. A custom `validate` function wins
    over `coupons`. Shows applied state with the computed saving.
-->
<template>
    <div dir="ltr" class="k-coupon" :class="`is-${status}`">
        <!-- Input row -->
        <div class="k-coupon-row">
            <div class="k-coupon-field">
                <Tag :size="15" class="k-coupon-field-icon" />
                <input
                    v-model="draft"
                    class="k-coupon-input"
                    type="text"
                    placeholder="کد تخفیف را وارد کنید"
                    dir="ltr"
                    :disabled="status === 'applied'"
                    @keydown.enter.prevent="apply"
                />
            </div>
            <button
                v-if="status !== 'applied'"
                type="button"
                class="k-coupon-apply"
                :disabled="!draft.trim()"
                @click="apply"
            >
                اعمال
            </button>
            <button v-else type="button" class="k-coupon-remove" aria-label="حذف کد تخفیف" @click="remove">
                <X :size="14" />
            </button>
        </div>

        <!-- States -->
        <Transition name="k-coupon-fade">
            <div v-if="status === 'applied'" class="k-coupon-applied">
                <span class="k-coupon-applied-code">{{ applied?.code }}</span>
                <span class="k-coupon-applied-saving">
                    {{ applied?.saving ?? 0 }} تومان تخفیف
                </span>
            </div>
            <div v-else-if="status === 'error'" class="k-coupon-error">
                <AlertCircle :size="13" /> {{ errorText }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertCircle, Tag, X } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export type CouponDef = {
    code: string
    /** percent discount (e.g. 10 = 10%) */
    percent?: number
    /** fixed-amount discount in Toman */
    amount?: number
}

const props = withDefaults(defineProps<{
    coupons?: CouponDef[]
    /** custom validator — returns the discount in Toman or 0/false */
    validate?: (code: string) => number | false
    basePrice?: number
    errorText?: string
}>(), {
    coupons: () => [],
    validate: undefined,
    basePrice: 0,
    errorText: 'کد تخفیف معتبر نیست'
})

const emits = defineEmits<{
    (e: 'applied', coupon: { code: string; saving: number; percent?: number }): void
    (e: 'removed'): void
    (e: 'error', code: string): void
}>()

const { toPersianDigits } = usePersianNumbers()

const draft = ref('')
const status = ref<'idle' | 'applied' | 'error'>('idle')
const applied = ref<{ code: string; saving: number; percent?: number } | null>(null)

const computeSaving = (code: string): number | false => {
    if (props.validate) return props.validate(code)
    const found = props.coupons.find(c => c.code.trim().toLowerCase() === code.trim().toLowerCase())
    if (!found) return false
    if (found.amount) return Math.min(found.amount, props.basePrice)
    if (found.percent) return Math.round((props.basePrice * found.percent) / 100)
    return false
}

const apply = () => {
    const code = draft.value.trim()
    if (!code) return
    const saving = computeSaving(code)
    if (saving === false || saving <= 0) {
        status.value = 'error'
        emits('error', code)
        return
    }
    status.value = 'applied'
    applied.value = { code, saving }
    emits('applied', applied.value)
}

const remove = () => {
    status.value = 'idle'
    applied.value = null
    draft.value = ''
    emits('removed')
}
</script>

<style scoped>
.k-coupon {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 320px;
}

.k-coupon-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.k-coupon-field {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    height: 38px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-coupon-field:focus-within {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 16%, transparent);
}

.k-coupon.is-applied .k-coupon-field {
    border-color: color-mix(in srgb, var(--k-success, #16a34a) 45%, var(--k-border));
}

.k-coupon.is-error .k-coupon-field {
    border-color: var(--k-error, #ef4444);
}

.k-coupon-field-icon {
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-coupon-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--k-text-primary, #1e293b);
    text-transform: uppercase;
}

.k-coupon-input::placeholder {
    text-transform: none;
    letter-spacing: 0;
    color: var(--k-text-muted, #94a3b8);
    font-weight: 400;
}

.k-coupon-apply {
    height: 38px;
    padding: 0 16px;
    border: none;
    border-radius: 10px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-coupon-apply:hover:not(:disabled) {
    filter: brightness(1.08);
}

.k-coupon-apply:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-coupon-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 10px;
    background: color-mix(in srgb, var(--k-error, #ef4444) 12%, transparent);
    color: var(--k-error, #ef4444);
    cursor: pointer;
    transition: background 0.15s ease;
}

.k-coupon-remove:hover {
    background: color-mix(in srgb, var(--k-error, #ef4444) 22%, transparent);
}

.k-coupon-applied {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 9px;
    background: color-mix(in srgb, var(--k-success, #16a34a) 12%, transparent);
    font-size: 0.72rem;
}

.k-coupon-applied-code {
    font-weight: 800;
    letter-spacing: 0.05em;
    color: var(--k-success, #16a34a);
}

.k-coupon-applied-saving {
    color: var(--k-text-secondary, #64748b);
    font-weight: 600;
}

.k-coupon-error {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--k-error, #ef4444);
}

.k-coupon-fade-enter-active,
.k-coupon-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.k-coupon-fade-enter-from,
.k-coupon-fade-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}
</style>
