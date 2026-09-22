<template>
    <div class="sp">
        <h2 class="sp-title">KFunnel</h2>

        <h3 class="sp-sub">قیف فروشگاه</h3>
        <KFunnel :stages="shopStages" />

        <h3 class="sp-sub">قیف استخدام</h3>
        <KFunnel :stages="hiringStages" />

        <h3 class="sp-sub">رنگ سفارشی هر مرحله</h3>
        <KFunnel :stages="customStages" />

        <h3 class="sp-sub">تبهیت بالا</h3>
        <KFunnel :stages="emailStages" />
    </div>
</template>

<script setup lang="ts">
import KFunnel from '../../ui-kit/components/KFunnel.vue'

const shopStages = [
    { label: 'بازدید محصول', value: 12400 },
    { label: 'افزودن به سبد', value: 3100 },
    { label: 'شروع پرداخت', value: 1450 },
    { label: 'خرید موفق', value: 980 },
]

const hiringStages = [
    { label: 'رزومه دریافتی', value: 860 },
    { label: 'مصاحبه اول', value: 120 },
    { label: 'مصاحبه فنی', value: 38 },
    { label: 'پیشنهاد شغلی', value: 12 },
    { label: 'استخدام', value: 9 },
]

const customStages = [
    { label: 'ثبت‌نام', value: 5000, color: '#8b5cf6' },
    { label: 'فعال‌سازی', value: 2800, color: '#3b82f6' },
    { label: 'کاربر فعال', value: 1600, color: '#1db954' },
]

const emailStages = [
    { label: 'ارسال', value: 10000 },
    { label: 'باز شدن', value: 4200 },
    { label: 'کلیک', value: 940 },
]
</script>
