<template>
    <div class="sp">
        <h2 class="sp-title">KPageHeader</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KPageHeader title="داشبورد" />
        </div>

        <h3 class="sp-sub">با زیرعنوان</h3>
        <div class="sp-card">
            <KPageHeader title="مدیریت دوره‌ها" subtitle="۴۸ دوره فعال در ۶ دسته‌بندی" />
        </div>

        <h3 class="sp-sub">با آیکون و خط جداکننده</h3>
        <div class="sp-card">
            <KPageHeader
                title="گزارش فروش"
                subtitle="بازه: مرداد ۱۴۰۵"
                :icon="BarChart3"
                border
            />
        </div>

        <h3 class="sp-sub">با مسیر راهنما (breadcrumb)</h3>
        <div class="sp-card">
            <KPageHeader
                title="جزئیات سفارش"
                subtitle="سفارش ۱۲۳۴۵ — پرداخت‌شده"
                :icon="FileText"
                :breadcrumbs="crumbs"
                border
            />
        </div>

        <h3 class="sp-sub">با اکشن‌ها (slot)</h3>
        <div class="sp-card">
            <KPageHeader title="لیست دانش‌آموزان" subtitle="۲۳۱ نفر" :breadcrumbs="crumbs" border>
                <template #actions>
                    <KButton text="فیلتر" :left-icon="SlidersHorizontal" :bg-color="'transparent'" />
                    <KButton text="دانش‌آموز جدید" :left-icon="Plus" @click="actionLog.push('افزودن')" />
                </template>
            </KPageHeader>
        </div>

        <h3 class="sp-sub">با محتوای اضافه (extra)</h3>
        <div class="sp-card">
            <KPageHeader title="پروفایل" subtitle="ویرایش اطلاعات حساب" :icon="UserCircle" border>
                <template #extra>
                    <KPresenceIndicator status="online" />
                    <span style="font-size: 0.8rem; color: var(--k-text-secondary);">آخرین ورود: امروز ۰۹:۴۱</span>
                </template>
            </KPageHeader>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">اکشن‌ها: {{ actionLog.length ? actionLog.join('، ') : '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, FileText, Plus, SlidersHorizontal, UserCircle } from 'lucide-vue-next'
import KPageHeader from '../../ui-kit/components/KPageHeader.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KPresenceIndicator from '../../ui-kit/components/KPresenceIndicator.vue'

const crumbs = [
    { label: 'خانه', to: '/' },
    { label: 'فروشگاه' },
    { label: 'سفارش‌ها' },
]

const actionLog = ref<string[]>([])
</script>
