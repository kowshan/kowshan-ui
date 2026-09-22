<template>
    <div class="sp">
        <h2 class="sp-title">KCouponInput</h2>

        <h3 class="sp-sub">پایه</h3>
        <KCouponInput :coupons="coupons" :base-price="500000" />

        <h3 class="sp-sub">کد نامعتبر</h3>
        <KCouponInput :coupons="coupons" :base-price="500000" error-text="کد تخفیف نامعتبر است" />
    </div>
</template>

<script setup lang="ts">
import KCouponInput from '../../ui-kit/components/KCouponInput.vue'

const coupons = [
    { code: 'WELCOME', discount: 20, type: 'percent' as const },
    { code: 'FLAT50', discount: 50000, type: 'fixed' as const },
]
</script>
