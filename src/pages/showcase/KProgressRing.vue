<template>
    <div class="sp">
        <h2 class="sp-title">KProgressRing</h2>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing v-for="s in sizes" :key="s" :model-value="72" :size="s" />
            </div>
        </div>

        <h3 class="sp-sub">با برچسب</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing :model-value="45" label="پیشرفت دوره" />
                <KProgressRing :model-value="90" label="نمره آزمون" color="#22c55e" />
                <KProgressRing :model-value="20" label="مصرف فضای ابری" color="#f59e0b" />
            </div>
        </div>

        <h3 class="sp-sub">بدون درصد در مرکز</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing :model-value="63" :show-percent="false" />
                <KProgressRing :model-value="88" :show-percent="false" color="#6366f1" label="بدون درصد" />
            </div>
        </div>

        <h3 class="sp-sub">اندازه و ضخامت دلخواه (px)</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing :model-value="55" :px="120" :stroke="4" label="نازک" />
                <KProgressRing :model-value="55" :px="120" :stroke="16" label="ضخیم" />
                <KProgressRing :model-value="55" :px="140" color="#8b5cf6" label="سفارشی" />
            </div>
        </div>

        <h3 class="sp-sub">مقیاس کسری (max = 1)</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing :model-value="0.25" :max="1" label="۲۵٪" />
                <KProgressRing :model-value="0.5" :max="1" color="#f59e0b" label="۵۰٪" />
                <KProgressRing :model-value="0.9" :max="1" color="#22c55e" label="۹۰٪" />
            </div>
        </div>

        <h3 class="sp-sub">مقادیر مرزی</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KProgressRing :model-value="0" label="صفر" />
                <KProgressRing :model-value="100" label="صد" color="#22c55e" />
                <KProgressRing :model-value="150" label="بیش از حد" color="#ef4444" />
            </div>
        </div>

        <h3 class="sp-sub">اسلات سفارشی مرکز</h3>
        <div class="sp-card">
            <KProgressRing :model-value="82" :px="110" color="#0ea5e9">
                <div style="text-align: center; line-height: 1.2;">
                    <div style="font-size: 1.1rem; font-weight: 800;">۸۲</div>
                    <div style="font-size: 0.6rem; color: var(--k-text-secondary);">از ۱۰۰</div>
                </div>
            </KProgressRing>
        </div>

        <h3 class="sp-sub">آمار — نمرات دانش‌آموزان</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; align-items: center; flex-wrap: wrap;">
                <KProgressRing
                    v-for="st in students"
                    :key="st.name"
                    :model-value="st.score"
                    :size="'md'"
                    :color="st.color"
                    :label="st.name"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KProgressRing from '../../ui-kit/components/KProgressRing.vue'

const sizes = ['sm', 'md', 'lg'] as const

const students = [
    { name: 'سارا', score: 94, color: '#22c55e' },
    { name: 'رضا', score: 71, color: '#0ea5e9' },
    { name: 'مینا', score: 58, color: '#f59e0b' },
    { name: 'امیر', score: 33, color: '#ef4444' },
]
</script>
