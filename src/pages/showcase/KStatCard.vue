<template>
    <div class="sp">
        <h2 class="sp-title">KStatCard</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KStatCard title="درآمد ماه" :value="48500000" />
        </div>

        <h3 class="sp-sub">همه variant‌ها</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard v-for="v in variants" :key="v" :title="variantLabels[v]" :value="1240" :variant="v" :icon="icons[v]" />
            </div>
        </div>

        <h3 class="sp-sub">با دلتا (افزایش / کاهش)</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard title="کاربر جدید" :value="1248" :delta="12.5" trend="up" variant="success" :icon="UserPlus" />
                <KStatCard title="نرخ ریزش" :value="86" :delta="-4.2" trend="down" variant="danger" :icon="TrendingDown" />
                <KStatCard title="بدون تغییر" :value="540" :delta="0" variant="neutral" />
            </div>
        </div>

        <h3 class="sp-sub">با پیشوند و پسوند</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard title="سود خالص" :value="12500000" prefix="" suffix=" تومان" variant="success" />
                <KStatCard title="نرخ تبدیل" :value="3.8" suffix="٪" variant="info" />
                <KStatCard title="میانگین امتیاز" :value="4.6" prefix="" suffix=" از ۵" variant="warning" />
            </div>
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard title="درآمد" :loading="true" />
                <KStatCard title="کاربران" :loading="true" />
                <KStatCard title="سفارش‌ها" :loading="true" />
            </div>
        </div>

        <h3 class="sp-sub">مقدار متنی و بدون مقدار</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard title="وضعیت سرویس" value="فعال" variant="success" />
                <KStatCard title="بدون مقدار" variant="neutral" />
            </div>
        </div>

        <h3 class="sp-sub">با اسلات محتوای اضافه</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard title="فروش هفتگی" :value="18400000" variant="primary" :delta="8.4" trend="up">
                    <div style="font-size: 0.72rem; color: var(--k-text-muted);">آخرین بروزرسانی: ۱۰ دقیقه پیش</div>
                </KStatCard>
                <KStatCard title="دوره‌های فعال" :value="86" variant="info">
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        <span style="font-size: 0.68rem; padding: 2px 8px; border-radius: 999px; background: var(--k-primary-light);">آنلاین ۴۲</span>
                        <span style="font-size: 0.68rem; padding: 2px 8px; border-radius: 999px; background: var(--k-primary-light);">حضوری ۴۴</span>
                    </div>
                </KStatCard>
            </div>
        </div>

        <h3 class="sp-sub">داشبورد کامل</h3>
        <div class="sp-card">
            <div class="stat-grid">
                <KStatCard
                    v-for="d in dashboard"
                    :key="d.title"
                    :title="d.title"
                    :value="d.value"
                    :variant="d.variant"
                    :delta="d.delta"
                    :trend="d.trend"
                    :icon="d.icon"
                    :suffix="d.suffix"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Activity, AlertTriangle, BadgeCheck, Info, Package, TrendingDown, TrendingUp, UserPlus, Users, Wallet
} from 'lucide-vue-next'
import KStatCard from '../../ui-kit/components/KStatCard.vue'

const variants = ['primary', 'success', 'warning', 'danger', 'info', 'neutral'] as const
const variantLabels: Record<string, string> = {
    primary: 'اصلی',
    success: 'موفق',
    warning: 'هشدار',
    danger: 'خطر',
    info: 'اطلاع',
    neutral: 'خنثی',
}
const icons: Record<string, any> = {
    primary: Activity,
    success: BadgeCheck,
    warning: AlertTriangle,
    danger: TrendingDown,
    info: Info,
    neutral: Package,
}

const dashboard = [
    { title: 'ثبت‌نام هفته', value: 324, variant: 'success' as const, delta: 9.1, trend: 'up' as const, icon: UserPlus, suffix: '' },
    { title: 'کاربران فعال', value: 2841, variant: 'primary' as const, delta: 3.4, trend: 'up' as const, icon: Users, suffix: '' },
    { title: 'درآمد ماه', value: 48500000, variant: 'info' as const, delta: -2.1, trend: 'down' as const, icon: Wallet, suffix: ' تومان' },
    { title: 'نرخ تبدیل', value: 3.8, variant: 'warning' as const, delta: 1.2, trend: 'up' as const, icon: TrendingUp, suffix: '٪' },
]
</script>

<style scoped>
.stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}
</style>
