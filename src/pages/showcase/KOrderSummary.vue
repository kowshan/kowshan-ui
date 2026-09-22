<template>
    <div class="sp">
        <h2 class="sp-title">KOrderSummary</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary :subtotal="4850000" :total="4850000" @checkout="onCheckout" />
        </div>

        <h3 class="sp-sub">با تخفیف و هزینه ارسال</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary
                :subtotal="4850000"
                :discount="500000"
                :shipping="45000"
                :total="4395000"
                note="کد تخفیف «بهار» اعمال شد."
                @checkout="onCheckout"
            />
        </div>

        <h3 class="sp-sub">آستانه ارسال رایگان (رسیده)</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary
                :subtotal="4850000"
                :discount="0"
                :shipping="0"
                :total="4850000"
                :free-shipping-threshold="3000000"
                @checkout="onCheckout"
            />
        </div>

        <h3 class="sp-sub">آستانه ارسال رایگان (نرسیده)</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary
                :subtotal="1250000"
                :shipping="45000"
                :total="1295000"
                :free-shipping-threshold="3000000"
                @checkout="onCheckout"
            />
        </div>

        <h3 class="sp-sub">غیرفعال (سبد خالی)</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary :subtotal="0" :total="0" :disabled="true" @checkout="onCheckout" />
        </div>

        <h3 class="sp-sub">واحد پول و برچسب سفارشی</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KOrderSummary
                :subtotal="120"
                :shipping="15"
                :total="135"
                currency="$"
                checkout-label="رفتن به درگاه"
                note="پرداخت بین‌المللی — درگاه Stripe"
                @checkout="onCheckout"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">checkout: {{ checkoutCount }} بار</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KOrderSummary from '../../ui-kit/components/KOrderSummary.vue'

const checkoutCount = ref(0)
const onCheckout = () => { checkoutCount.value++ }
</script>
