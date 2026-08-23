<!-- components/KOrderSummary.vue -->
<!--
    KOrderSummary — checkout totals panel:

      <KOrderSummary
        :subtotal="cart.subtotal.value"
        :discount="cart.discount.value"
        :shipping="cart.shipping.value"
        :total="cart.total.value"
        :free-shipping-threshold="1_000_000"
        @checkout="onCheckout"
      >
        <template #coupon> <KCouponInput :coupons="[…]"/> </template>
        <template #footer> <KCouponInput …/> extra rows / terms </template>
      </KOrderSummary>
-->
<template>
    <aside class="k-order">
        <div class="k-order-title">
            <Receipt :size="16" />
            <span>خلاصه سفارش</span>
        </div>

        <!-- Coupon -->
        <div v-if="$slots.coupon" class="k-order-coupon">
            <slot name="coupon" />
        </div>

        <!-- Rows -->
        <div class="k-order-rows">
            <div class="k-order-row">
                <span>جمع کالاها</span>
                <span>{{ faNum(subtotal) }} <small>{{ currency }}</small></span>
            </div>

            <div v-if="discount > 0" class="k-order-row is-discount">
                <span>تخفیف کد</span>
                <span>-{{ faNum(discount) }} <small>{{ currency }}</small></span>
            </div>

            <div class="k-order-row" :class="{ 'is-free': shipping === 0 }">
                <span>هزینه ارسال</span>
                <span v-if="shipping === 0" class="k-order-free-badge">رایگان</span>
                <span v-else>{{ faNum(shipping) }} <small>{{ currency }}</small></span>
            </div>

            <div v-if="$slots.rows" class="k-order-extra">
                <slot name="rows" />
            </div>
        </div>

        <!-- Free-shipping hint -->
        <div v-if="freeShippingThreshold && shipping > 0" class="k-order-hint">
            <Truck :size="13" />
            با خرید {{ faNum(remainingForFreeShipping) }} {{ currency }} دیگر، ارسال رایگان می‌شود
        </div>
        <div v-else-if="freeShippingThreshold && shipping === 0" class="k-order-hint is-met">
            <Truck :size="13" />
            ارسال شما رایگان است
        </div>

        <!-- Total -->
        <div class="k-order-total">
            <span>مبلغ قابل پرداخت</span>
            <span class="k-order-total-num">{{ faNum(total) }} <small>{{ currency }}</small></span>
        </div>

        <!-- Footer slot (extra rows, terms…) -->
        <div v-if="$slots.footer" class="k-order-footer">
            <slot name="footer" />
        </div>

        <!-- Checkout -->
        <button type="button" class="k-order-checkout" :disabled="disabled" @click="emits('checkout')">
            <CreditCard :size="15" />
            {{ checkoutLabel }}
        </button>
        <p v-if="note" class="k-order-note">{{ note }}</p>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CreditCard, Receipt, Truck } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    subtotal: number
    discount?: number
    shipping?: number
    total: number
    freeShippingThreshold?: number
    currency?: string
    checkoutLabel?: string
    note?: string
    disabled?: boolean
}>(), {
    discount: 0,
    shipping: 0,
    freeShippingThreshold: 0,
    currency: 'تومان',
    checkoutLabel: 'ادامه و پرداخت',
    note: '',
    disabled: false
})

const emits = defineEmits<{
    (e: 'checkout'): void
}>()

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const remainingForFreeShipping = computed(() =>
    Math.max(0, (props.freeShippingThreshold ?? 0) - props.subtotal)
)
</script>

<style scoped>
.k-order {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 340px;
    padding: 16px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
}

.k-order-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-order-coupon {
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--k-border, #e2e8f0);
}

.k-order-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.k-order-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.74rem;
    color: var(--k-text-secondary, #64748b);
}

.k-order-row small {
    font-size: 0.56rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-order-row.is-discount {
    color: var(--k-success, #16a34a);
    font-weight: 700;
}

.k-order-row.is-free {
    color: var(--k-success, #16a34a);
}

.k-order-free-badge {
    font-size: 0.66rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--k-success, #16a34a) 14%, transparent);
}

.k-order-extra {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.k-order-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
    padding: 8px 10px;
    border-radius: 9px;
    background: color-mix(in srgb, var(--k-warning, #f59e0b) 10%, transparent);
}

.k-order-hint.is-met {
    color: var(--k-success, #16a34a);
    background: color-mix(in srgb, var(--k-success, #16a34a) 10%, transparent);
}

.k-order-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-order-total-num {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
}

.k-order-total-num small {
    font-size: 0.6rem;
    font-weight: 500;
    color: var(--k-text-muted, #94a3b8);
}

.k-order-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.k-order-checkout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    padding: 11px 16px;
    border: none;
    border-radius: 11px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-order-checkout:hover:not(:disabled) {
    filter: brightness(1.08);
}

.k-order-checkout:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.k-order-note {
    margin: 0;
    text-align: center;
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
