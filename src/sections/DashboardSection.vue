<template>
    <DemoSection
        id="dashboard"
        index="01"
        title="داشبورد"
        description="کارت‌های آماری، نمودارها و تایم‌لاین — قطعات آماده برای صفحه‌های مدیریتی"
    >
        <!-- Stat cards -->
        <div class="demo-grid">
            <KStatCard title="فروش این ماه" :value="4285000000" :delta="12.4" :icon="Banknote" variant="primary" suffix=" تومان" />
            <KStatCard title="مشتری جدید" :value="184" :delta="8.2" :icon="Users" variant="success" />
            <KStatCard title="بازدید ملک" :value="1293" :delta="3.1" :icon="Eye" variant="info" />
            <KStatCard title="قرارداد فعال" :value="37" :delta="-4.6" trend="down" :icon="FileCheck2" variant="warning" />
        </div>

        <hr class="demo-divider" />

        <!-- Charts -->
        <p class="demo-caption">نمودار فروش ۱۲ ماه گذشته — خطی و دونات</p>
        <div class="demo-grid-2">
            <KChart type="line" :data="salesData" :height="230" />
            <KChart type="donut" :data="categoryData" center-label="فروش سال" :donut-size="190" />
        </div>

        <hr class="demo-divider" />

        <p class="demo-caption">نمودار مساحتی و میله‌ای</p>
        <div class="demo-grid-2">
            <KChart type="area" :data="trafficData" :height="230" />
            <KChart type="bar" :data="revenueData" :height="230" />
        </div>

        <hr class="demo-divider" />

        <!-- Timeline + card -->
        <div class="demo-grid-2">
            <div>
                <p class="demo-caption">فعالیت‌های اخیر</p>
                <KTimeline :items="activities" />
            </div>

            <div class="demo-stack">
                <p class="demo-caption">کارت اطلاعاتی با هدر و فوتر</p>
                <KCard title="ملک شاخص" subtitle="به‌روزرسانی دیروز" variant="primary" padding="lg">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
                        <span style="font-weight: 700; font-size: 1rem">ویلا دوبلکس لوکس</span>
                        <KBadge text="فروش" variant="success" dot />
                    </div>
                    <p style="margin: 0 0 6px; font-size: 0.8rem; color: var(--k-text-secondary)">
                        متراژ ۳۲۰ متر — ۴ خواب، استخر و باغچه
                    </p>
                    <p style="margin: 0; font-weight: 800; font-size: 1.1rem; direction: ltr; text-align: right">
                        {{ faNum((25000000000).toLocaleString('en-US')) }} تومان
                    </p>

                    <template #footer>
                        <KButton text="مشاهده جزئیات" bg-color="#1db954" text-color="#fff" :left-icon="ArrowLeft" width="100%" />
                    </template>
                </KCard>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ArrowLeft, Banknote, Eye, FileCheck2, Users } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KStatCard from '../ui-kit/components/KStatCard.vue'
import KChart from '../ui-kit/components/KChart.vue'
import KTimeline from '../ui-kit/components/KTimeline.vue'
import KCard from '../ui-kit/components/KCard.vue'
import KButton from '../ui-kit/components/KButton.vue'
import KBadge from '../ui-kit/components/KBadge.vue'

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: string | number) => String(n).replace(/\d/g, d => faDigits[Number(d)])

const salesData = [
    { label: 'فرو', value: 120 },
    { label: 'ارد', value: 160 },
    { label: 'خرد', value: 140 },
    { label: 'تیر', value: 210 },
    { label: 'مرد', value: 250 },
    { label: 'شهر', value: 230 },
    { label: 'مهر', value: 280 },
    { label: 'آبا', value: 320 },
    { label: 'آذر', value: 300 },
    { label: 'دی', value: 360 },
    { label: 'بهم', value: 410 },
    { label: 'اسف', value: 380 },
]

const categoryData = [
    { label: 'مسکونی', value: 45, color: '#1db954' },
    { label: 'تجاری', value: 25, color: '#3b82f6' },
    { label: 'اداری', value: 18, color: '#10b981' },
    { label: 'زمین', value: 12, color: '#f59e0b' },
]

const trafficData = [
    { label: '۱', value: 40 },
    { label: '۲', value: 65 },
    { label: '۳', value: 55 },
    { label: '۴', value: 90 },
    { label: '۵', value: 80 },
    { label: '۶', value: 120 },
    { label: '۷', value: 100 },
    { label: '۸', value: 140 },
]

const revenueData = [
    { label: 'فر', value: 85 },
    { label: 'ارد', value: 110 },
    { label: 'خرد', value: 95 },
    { label: 'تیر', value: 140 },
    { label: 'مرد', value: 125 },
    { label: 'شهر', value: 170 },
    { label: 'مهر', value: 155 },
]

const activities = [
    { title: 'قرارداد ملک ۱۴۲ ثبت شد', description: 'ویلا دوبلکس — مبلغ ۲۵ میلیارد تومان', time: '۱۰:۲۴', color: 'success' },
    { title: 'مشتری جدید اضافه شد', description: 'علی رضایی — از کمپین تابستانی', time: '۰۹:۵۱', color: 'primary' },
    { title: 'بازدید ملک انجام شد', description: 'آپارتمان ۹۵ متری — نتیجه مثبت', time: '۰۹:۱۲', color: 'info' },
    { title: 'قرارداد تمدید شد', description: 'مغازه تجاری — دوره ۱۲ ماهه', time: '۰۸:۴۰', color: 'warning' },
    { title: 'گزارش ماهانه ارسال شد', description: 'خلاصه عملکرد مرداد ماه', time: '۰۸:۰۵', color: 'neutral' as any },
]
</script>
