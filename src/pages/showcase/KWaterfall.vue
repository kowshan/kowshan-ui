<template>
    <div class="sp">
        <h2 class="sp-title">KWaterfall</h2>
        <p class="sp-note">
            نمودار آبشاری — هر میله از مقدار تجمعی قبلی شروع می‌شود. مقدار منفی قرمز و مثبت سبز است،
            و آخرین آیتم را می‌توانید با رنگ سفارشی به‌عنوان «جمع کل» مشخص کنید.
        </p>

        <h3 class="sp-sub">پایه — گردش نقدی</h3>
        <div class="sp-card" style="max-width: 720px;">
            <KWaterfall :data="cashflow" :height="260" />
        </div>

        <h3 class="sp-sub">با جمع کل رنگی</h3>
        <div class="sp-card" style="max-width: 720px;">
            <KWaterfall :data="withTotal" :height="260" />
        </div>

        <h3 class="sp-sub">ارتفاع‌های مختلف</h3>
        <div class="sp-card" style="max-width: 720px; display: flex; flex-direction: column; gap: 28px;">
            <KWaterfall :data="short" :height="140" />
            <KWaterfall :data="short" :height="380" />
        </div>

        <h3 class="sp-sub">همه مقادیر منفی</h3>
        <div class="sp-card" style="max-width: 720px;">
            <KWaterfall :data="allNegative" :height="220" />
        </div>

        <h3 class="sp-sub">مقادیر بزرگ (میلیونی)</h3>
        <div class="sp-card" style="max-width: 720px;">
            <KWaterfall :data="millions" :height="260" />
        </div>

        <h3 class="sp-sub">مرزی</h3>
        <div class="sp-card" style="max-width: 720px; display: flex; flex-direction: column; gap: 28px;">
            <div>
                <span class="sp-note">یک آیتم:</span>
                <KWaterfall :data="[{ label: 'تنها', value: 100 }]" :height="180" style="margin-top: 8px;" />
            </div>
            <div>
                <span class="sp-note">دو آیتم (مثبت و منفی):</span>
                <KWaterfall :data="[{ label: 'ورودی', value: 200 }, { label: 'خروجی', value: -80 }]" :height="180" style="margin-top: 8px;" />
            </div>
            <div>
                <span class="sp-note">مقدار صفر:</span>
                <KWaterfall :data="[{ label: 'الف', value: 50 }, { label: 'صفر', value: 0 }, { label: 'ب', value: -20 }]" :height="180" style="margin-top: 8px;" />
            </div>
            <div>
                <span class="sp-note">فهرست خالی:</span>
                <KWaterfall :data="[]" :height="140" style="margin-top: 8px;" />
            </div>
        </div>

        <h3 class="sp-sub">کاربردی — سود و زیان دوره</h3>
        <div class="sp-card" style="max-width: 720px;">
            <KWaterfall :data="profit" :height="280" />
          <div class="sp-vmodel" style="margin-top: 12px;">
            جمع میانی: {{ middleSum.toLocaleString('fa-IR') }} — جمع نهایی: {{ finalSum.toLocaleString('fa-IR') }}
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KWaterfall from '../../ui-kit/components/KWaterfall.vue'

const cashflow = [
    { label: 'موجودی اولیه', value: 320 },
    { label: 'شهریه دوره‌ها', value: 480 },
    { label: 'هزینه مدرسان', value: -220 },
    { label: 'تبلیغات', value: -140 },
    { label: 'پشتیبانی', value: -60 },
]

const withTotal = [
    { label: 'درآمد', value: 850 },
    { label: 'هزینه‌ها', value: -410 },
    { label: 'مالیات', value: -95 },
    { label: 'سود خالص', value: 345, color: '#6366f1' },
]

const short = [
    { label: 'الف', value: 120 },
    { label: 'ب', value: -40 },
    { label: 'ج', value: 60 },
]

const allNegative = [
    { label: 'شروع', value: -100 },
    { label: 'هزینه الف', value: -80 },
    { label: 'هزینه ب', value: -45 },
    { label: 'هزینه ج', value: -30 },
]

const millions = [
    { label: 'درآمد کل', value: 48000000 },
    { label: 'دستمزد', value: -18000000 },
    { label: 'زیرساخت', value: -6500000 },
    { label: 'بازاریابی', value: -9000000 },
]

const profit = [
    { label: 'دوره مکالمه', value: 1240 },
    { label: 'دوره آیلتس', value: 980 },
    { label: 'مدرس', value: -760 },
    { label: 'پلتفرم', value: -320 },
    { label: 'تبلیغات', value: -280 },
    { label: 'سود', value: 860, color: '#8b5cf6' },
]

const middleSum = computed(() => profit.slice(0, 5).reduce((a, b) => a + b.value, 0))
const finalSum = computed(() => profit.reduce((a, b) => a + b.value, 0))
</script>
