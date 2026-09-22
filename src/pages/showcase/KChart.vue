<template>
    <div class="sp">
        <h2 class="sp-title">KChart</h2>
        <h3 class="sp-sub">میله‌ای</h3>
        <KChart :data="data" type="bar" :height="250" />
        <h3 class="sp-sub">خطی</h3>
        <KChart :data="data" type="line" :height="250" />
    </div>
</template>

<script setup lang="ts">
import KChart from '../../ui-kit/components/KChart.vue'
const data = [
    { label: 'فروردین', value: 45 },
    { label: 'اردیبهشت', value: 72 },
    { label: 'خرداد', value: 58 },
    { label: 'تیر', value: 90 },
    { label: 'مرداد', value: 65 },
    { label: 'شهریور', value: 80 },
]
</script>
