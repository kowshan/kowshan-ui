<template>
    <div class="sp">
        <h2 class="sp-title">KTreeMap</h2>

        <h3 class="sp-sub">پایه — سهم دسته‌بندی دوره‌ها</h3>
        <div class="sp-card" style="max-width: 620px;">
            <div style="height: 320px;">
                <KTreeMap :data="categories" />
            </div>
        </div>

        <h3 class="sp-sub">رنگ دلخواه برای هر خانه</h3>
        <div class="sp-card" style="max-width: 620px;">
            <div style="height: 300px;">
                <KTreeMap :data="colored" />
            </div>
        </div>

        <h3 class="sp-sub">ارتفاع‌های مختلف</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 24px;">
            <div style="height: 140px;"><KTreeMap :data="small" /></div>
            <div style="height: 420px;"><KTreeMap :data="small" /></div>
        </div>

        <h3 class="sp-sub">داده‌های نامتوازن (یک خانه غالب)</h3>
        <div class="sp-card" style="max-width: 620px;">
            <div style="height: 280px;">
                <KTreeMap :data="unbalanced" />
            </div>
        </div>

        <h3 class="sp-sub">داده‌های نزدیک به هم (خانه‌های برابر)</h3>
        <div class="sp-card" style="max-width: 620px;">
            <div style="height: 280px;">
                <KTreeMap :data="even" />
            </div>
        </div>

        <h3 class="sp-sub">مرزی</h3>
        <div class="sp-card" style="max-width: 620px; display: flex; flex-direction: column; gap: 24px;">
            <div>
                <span class="sp-note">یک آیتم:</span>
                <div style="height: 160px; margin-top: 8px;"><KTreeMap :data="[{ label: 'تنها', value: 42 }]" /></div>
            </div>
            <div>
                <span class="sp-note">دو آیتم:</span>
                <div style="height: 160px; margin-top: 8px;"><KTreeMap :data="[{ label: 'الف', value: 70 }, { label: 'ب', value: 30 }]" /></div>
            </div>
            <div>
                <span class="sp-note">فهرست خالی (مجموع صفر):</span>
                <div style="height: 120px; margin-top: 8px;"><KTreeMap :data="[]" /></div>
            </div>
            <div>
                <span class="sp-note">همه مقادیر صفر:</span>
                <div style="height: 120px; margin-top: 8px;"><KTreeMap :data="[{ label: 'الف', value: 0 }, { label: 'ب', value: 0 }]" /></div>
            </div>
        </div>

        <h3 class="sp-sub">کاربردی — منابع درآمد آموزشگاه</h3>
        <div class="sp-card" style="max-width: 620px;">
            <div style="height: 340px;">
                <KTreeMap :data="revenue" />
            </div>
            <div class="sp-vmodel" style="margin-top: 12px;">
                مجموع: {{ revenue.reduce((a, b) => a + b.value, 0).toLocaleString('fa-IR') }} میلیون تومان
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KTreeMap from '../../ui-kit/components/KTreeMap.vue'

const categories = [
    { label: 'برنامه‌نویسی', value: 42 },
    { label: 'زبان انگلیسی', value: 30 },
    { label: 'طراحی', value: 14 },
    { label: 'موسیقی', value: 8 },
    { label: 'عکاسی', value: 6 },
]

const colored = [
    { label: 'دوره‌های آنلاین', value: 45, color: '#1db954' },
    { label: 'کلاس حضوری', value: 25, color: '#6366f1' },
    { label: 'محصولات دیجیتال', value: 18, color: '#f59e0b' },
    { label: 'مشاوره', value: 12, color: '#ec4899' },
]

const small = [
    { label: 'مقدماتی', value: 40 },
    { label: 'متوسط', value: 35 },
    { label: 'پیشرفته', value: 25 },
]

const unbalanced = [
    { label: 'دوره اصلی', value: 900 },
    { label: 'کارگاه', value: 40 },
    { label: 'کتاب', value: 30 },
    { label: 'گواهی', value: 20 },
]

const even = [
    { label: 'الف', value: 25 },
    { label: 'ب', value: 25 },
    { label: 'ج', value: 25 },
    { label: 'د', value: 25 },
]

const revenue = [
    { label: 'شهریه دوره‌ها', value: 480 },
    { label: 'کلاس خصوصی', value: 210 },
    { label: 'پکیج آیلتس', value: 160 },
    { label: 'کارگاه تلفظ', value: 95 },
    { label: 'فروش کتاب', value: 62 },
    { label: 'گواهی‌نامه', value: 38 },
    { label: 'مشاوره تحصیلی', value: 24 },
]
</script>
