<template>
    <div class="sp">
        <h2 class="sp-title">KScatterPlot</h2>

        <h3 class="sp-sub">پایه — با خط رگرسیون</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot :points="studyHours" x-label="ساعت مطالعه" y-label="نمره" />
        </div>

        <h3 class="sp-sub">بدون رگرسیون</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot
                :points="studyHours"
                x-label="ساعت مطالعه"
                y-label="نمره"
                :show-regression="false"
            />
        </div>

        <h3 class="sp-sub">ارتفاع‌های مختلف</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 24px;">
            <KScatterPlot :points="studyHours" :height="160" x-label="کوتاه" />
            <KScatterPlot :points="studyHours" :height="320" x-label="بلند" />
        </div>

        <h3 class="sp-sub">گروه‌های رنگی و اندازه نقطه</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot
                :points="clustered"
                x-label="هزینه تبلیغات"
                y-label="تعداد ثبت‌نام"
                :height="280"
            />
        </div>

        <h3 class="sp-sub">دو نقطه (حداقل برای رگرسیون)</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot
                :points="[{ x: 1, y: 2, label: 'الف' }, { x: 9, y: 18, label: 'ب' }]"
                x-label="x"
                y-label="y"
            />
        </div>

        <h3 class="sp-sub">یک نقطه</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot :points="[{ x: 5, y: 5, label: 'تنها' }]" x-label="x" y-label="y" />
        </div>

        <h3 class="sp-sub">مقادیر منفی</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KScatterPlot :points="negative" x-label="سود ماهانه" y-label="رشد" :height="260" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KScatterPlot from '../../ui-kit/components/KScatterPlot.vue'

const studyHours = [
    { x: 2, y: 11, label: 'دانش‌آموز ۱' },
    { x: 3, y: 13, label: 'دانش‌آموز ۲' },
    { x: 4.5, y: 15, label: 'دانش‌آموز ۳' },
    { x: 5, y: 12, label: 'دانش‌آموز ۴' },
    { x: 6, y: 18, label: 'دانش‌آموز ۵' },
    { x: 7.5, y: 19, label: 'دانش‌آموز ۶' },
    { x: 8, y: 16, label: 'دانش‌آموز ۷' },
    { x: 9.5, y: 20, label: 'دانش‌آموز ۸' },
    { x: 11, y: 19, label: 'دانش‌آموز ۹' },
]

const clustered = [
    { x: 12, y: 24, label: 'کمپین A', color: '#1db954', size: 6 },
    { x: 15, y: 31, label: 'کمپین B', color: '#1db954', size: 6 },
    { x: 18, y: 36, label: 'کمپین C', color: '#1db954', size: 6 },
    { x: 30, y: 22, label: 'کمپین D', color: '#6366f1', size: 9 },
    { x: 34, y: 26, label: 'کمپین E', color: '#6366f1', size: 9 },
    { x: 38, y: 21, label: 'کمپین F', color: '#6366f1', size: 9 },
    { x: 55, y: 48, label: 'کمپین G', color: '#f59e0b', size: 12 },
    { x: 62, y: 52, label: 'کمپین H', color: '#f59e0b', size: 12 },
]

const negative = [
    { x: -12, y: -8, label: 'فروردین' },
    { x: -6, y: -2, label: 'اردیبهشت' },
    { x: 0, y: 4, label: 'خرداد' },
    { x: 8, y: 9, label: 'تیر' },
    { x: 14, y: 15, label: 'مرداد' },
]
</script>
