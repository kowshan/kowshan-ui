<!-- pages/reports.vue — reports & analytics with charts and progress bars -->
<template>
    <div class="reports-page">
        <div class="reports-header">
            <div>
                <h1>گزارش‌ها</h1>
                <p>تحلیل عملکرد و آمار کلینیک</p>
            </div>
        </div>

        <!-- Stats row -->
        <div class="reports-stats">
            <div class="reports-stat">
                <span class="reports-stat-value">۱,۲۴۸</span>
                <span class="reports-stat-label">کل مراجعات</span>
            </div>
            <div class="reports-stat">
                <span class="reports-stat-value">۳۴۲</span>
                <span class="reports-stat-label">بیمار فعال</span>
            </div>
            <div class="reports-stat">
                <span class="reports-stat-value">۸۹٪</span>
                <span class="reports-stat-label">رضایت بیماران</span>
            </div>
            <div class="reports-stat">
                <span class="reports-stat-value">۴.۷</span>
                <span class="reports-stat-label">امتیاز کلی</span>
            </div>
        </div>

        <!-- Charts row -->
        <div class="reports-grid">
            <div class="reports-card">
                <h3 class="reports-card-title">نمودار مراجعات ماهانه</h3>
                <KChart
                    type="bar"
                    :data="monthlyData"
                    :height="200"
                    :show-axis="true"
                />
            </div>
            <div class="reports-card">
                <h3 class="reports-card-title">روند نسخه‌های صادره</h3>
                <KChart
                    type="line"
                    :data="prescriptionData"
                    :height="200"
                    :colors="['#8b5cf6']"
                    :show-axis="true"
                />
            </div>
        </div>

        <!-- Progress + Rating -->
        <div class="reports-grid">
            <div class="reports-card">
                <h3 class="reports-card-title">عملکرد بخش‌ها</h3>
                <div class="reports-progress-list">
                    <KProgress
                        v-for="item in departmentProgress"
                        :key="item.label"
                        :model-value="item.value"
                        :label="item.label"
                        :variant="item.variant"
                        show-percent
                        size="md"
                    />
                </div>
            </div>
            <div class="reports-card">
                <h3 class="reports-card-title">ارزیابی بیماران</h3>
                <div class="reports-rating-list">
                    <div v-for="r in ratings" :key="r.label" class="reports-rating-row">
                        <span class="reports-rating-label">{{ r.label }}</span>
                        <KRating :model-value="r.value" :readonly="true" size="md" />
                        <span class="reports-rating-val">{{ faNum(r.value) }} از ۵</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Accordion FAQ -->
        <div class="reports-card" style="margin-top: 0">
            <h3 class="reports-card-title">سوالات متداول گزارش‌گیری</h3>
            <KAccordion :items="faqItems" :open="0" :bordered="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'
import KChart, { type KChartDatum } from '../ui-kit/components/KChart.vue'
import KProgress from '../ui-kit/components/KProgress.vue'
import KRating from '../ui-kit/components/KRating.vue'
import KAccordion from '../ui-kit/components/KAccordion.vue'
import { FileText, BarChart3, Users, Clock } from 'lucide-vue-next'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

const monthlyData: KChartDatum[] = [
    { label: 'فروردین', value: 98 },
    { label: 'اردیبهشت', value: 112 },
    { label: 'خرداد', value: 89 },
    { label: 'تیر', value: 134 },
    { label: 'مرداد', value: 121 },
    { label: 'شهریور', value: 145 },
]

const prescriptionData: KChartDatum[] = [
    { label: 'شنبه', value: 18 },
    { label: 'یکشنبه', value: 24 },
    { label: 'دوشنبه', value: 15 },
    { label: 'سه‌شنبه', value: 28 },
    { label: 'چهارشنبه', value: 22 },
    { label: 'پنجشنبه', value: 20 },
]

const departmentProgress = [
    { label: 'داخلی', value: 87, variant: 'primary' as const },
    { label: 'اطفال', value: 72, variant: 'info' as const },
    { label: 'زنان', value: 93, variant: 'success' as const },
    { label: 'ارتوپدی', value: 65, variant: 'warning' as const },
    { label: 'پوست', value: 48, variant: 'danger' as const },
]

const ratings = [
    { label: 'کیفیت ویزیت', value: 4.8 },
    { label: 'سرعت پذیرش', value: 4.2 },
    { label: 'برخورد کارکنان', value: 4.9 },
    { label: 'نظافت محیط', value: 4.5 },
    { label: 'امکانات', value: 4.0 },
]

const faqItems = [
    {
        title: 'چگونه گزارش ماهانه تولید کنم؟',
        content: 'از بخش گزارش‌ها، بازه زمانی مورد نظر را انتخاب کرده و روی «تولید گزارش» کلیک کنید. گزارش به صورت PDF قابل دانلود است.',
        icon: FileText,
    },
    {
        title: 'آیا امکان صادر کردن گزارش اکسل وجود دارد؟',
        content: 'بله، پس از تولید گزارش، گزینه «خروجی اکسل» در بالای صفحه نمایش داده می‌شود.',
        icon: BarChart3,
    },
    {
        title: 'داده‌ها از کجا دریافت می‌شوند؟',
        content: 'تمام داده‌ها از سیستم داخلی کلینیک استخراج شده و به صورت لحظه‌ای بروزرسانی می‌شوند.',
        icon: Users,
    },
    {
        title: 'چه مدت داده‌ها نگهداری می‌شوند؟',
        content: 'داده‌های ۳ سال اخیر در سیستم موجود است. برای داده‌های قدیمی‌تر با پشتیبانی تماس بگیرید.',
        icon: Clock,
    },
]
</script>

<style scoped>
.reports-page {
    /* max-width handled by layout */
}

.reports-header {
    margin-bottom: 24px;
}

.reports-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.reports-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

/* Stats */
.reports-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
}

.reports-stat {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    padding: 18px 16px;
    text-align: center;
}

.reports-stat-value {
    display: block;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.reports-stat-label {
    font-size: 0.7rem;
    color: var(--k-text-muted);
}

/* Grid */
.reports-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 22px;
}

/* Card */
.reports-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 22px;
}

.reports-card-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary);
    margin: 0 0 16px;
}

/* Progress list */
.reports-progress-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* Rating list */
.reports-rating-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.reports-rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.reports-rating-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary);
    min-width: 110px;
}

.reports-rating-val {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    margin-inline-start: auto;
}

@media (max-width: 768px) {
    .reports-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    .reports-grid {
        grid-template-columns: 1fr;
    }
}
</style>
