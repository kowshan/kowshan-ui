<template>
    <div class="sp">
        <h2 class="sp-title">KChart</h2>
        <p class="sp-note">
            نمودار SVG خالص، بدون کتابخانه. محورها <b>۱:۱ با پیکسل</b> مقیاس می‌شوند (viewBox
            با عرض واقعی کانتینر هم‌اندازه می‌شود)، پس نه متن محور کشیده می‌شود و نه خطوط و
            گوشه‌ها. <code>height</code> ارتفاع واقعی نمودار است و کانتینر هر عرضی بگیرد،
            نمودار خودش را تطبیق می‌دهد.
        </p>

        <h3 class="sp-sub">میله‌ای — <code>type="bar"</code></h3>
        <KChart :data="data" type="bar" :height="220" />

        <h3 class="sp-sub">خطی نرم — <code>type="line"</code></h3>
        <KChart :data="data" type="line" :height="220" />

        <h3 class="sp-sub">سطحی — <code>type="area"</code></h3>
        <KChart :data="data" type="area" :height="220" />

        <h3 class="sp-sub">دونات — <code>type="donut"</code></h3>
        <p class="sp-note">
            <code>donut-size</code> قطر، <code>donut-thickness</code> ضخامت حلقه،
            <code>center-label</code> و <code>value-formatter</code> برای عدد مرکز.
        </p>
        <KChart
            :data="slices"
            type="donut"
            :donut-size="200"
            :donut-thickness="30"
            center-label="فروش کل"
            :value-formatter="faFmt"
        />

        <h3 class="sp-sub">پالت دلخواه — <code>colors</code></h3>
        <KChart :data="data" type="bar" :height="200" :colors="palette" />

        <h3 class="sp-sub">بدون شبکه و محور</h3>
        <KChart :data="data" type="line" :height="170" :show-grid="false" :show-axis="false" />

        <h3 class="sp-sub">همان داده در دو ارتفاع</h3>
        <div class="chart-row">
            <KChart :data="data" type="bar" :height="140" />
            <KChart :data="data" type="area" :height="260" />
        </div>

        <h3 class="sp-sub">تک‌داده و داده خالی</h3>
        <KChart :data="[{ label: 'تنها', value: 42 }]" type="bar" :height="160" />
        <KChart :data="[]" type="line" :height="160" />
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

const slices = [
    { label: 'دوره', value: 420 },
    { label: 'اشتراک', value: 260 },
    { label: 'مشاوره', value: 140 },
    { label: 'دیگر', value: 60 },
]

const palette = ['var(--k-primary)', '#d6336c', '#6741d9', '#c08a2e', '#0b7285', '#3b82f6']

const faFmt = (v: number) => v.toLocaleString('fa-IR')
</script>

<style scoped>
.chart-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: end;
}

@media (max-width: 700px) {
    .chart-row {
        grid-template-columns: 1fr;
    }
}
</style>
