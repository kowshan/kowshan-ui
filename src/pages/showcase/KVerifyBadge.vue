<template>
    <div class="sp">
        <h2 class="sp-title">KVerifyBadge</h2>

        <h3 class="sp-sub">چهار وضعیت</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                <KVerifyBadge v-for="s in statuses" :key="s" :status="s" />
            </div>
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 16px; align-items: center;">
                <KVerifyBadge v-for="s in statuses" :key="`sm-${s}`" :status="s" size="sm" />
            </div>
            <div style="display: flex; gap: 16px; align-items: center;">
                <KVerifyBadge v-for="s in statuses" :key="`md-${s}`" :status="s" size="md" />
            </div>
        </div>

        <h3 class="sp-sub">برچسب سفارشی</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                <KVerifyBadge status="verified" label="هویت تأیید شد" />
                <KVerifyBadge status="pending" label="در حال بررسی — ۲۴ ساعت" />
                <KVerifyBadge status="rejected" label="مدارک ناخوانا" />
                <KVerifyBadge status="unverified" label="برای خرید لازم است" />
            </div>
        </div>

        <h3 class="sp-sub">با tooltip (title)</h3>
        <div class="sp-card">
            <KVerifyBadge status="pending" title="آخرین بروزرسانی: امروز ۰۹:۴۱" />
        </div>

        <h3 class="sp-sub">در کنار نام کاربر</h3>
        <div class="sp-card" style="max-width: 460px;">
            <div
                v-for="u in users"
                :key="u.name"
                style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--k-border);"
            >
                <span style="font-size: 0.85rem;">{{ u.name }}</span>
                <KVerifyBadge :status="u.status" size="sm" />
            </div>
        </div>

        <h3 class="sp-sub">در جدول مدرسان</h3>
        <div class="sp-card">
          <div style="overflow: auto;">
            <table style="width: 100%; min-width: 420px; border-collapse: collapse; font-size: 0.82rem;">
                <thead>
                    <tr style="color: var(--k-text-secondary);">
                        <th style="text-align: start; padding: 8px;">مدرس</th>
                        <th style="text-align: start; padding: 8px;">دوره</th>
                        <th style="text-align: start; padding: 8px;">وضعیت هویت</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rows" :key="r.teacher" style="border-top: 1px solid var(--k-border);">
                        <td style="padding: 10px 8px;">{{ r.teacher }}</td>
                        <td style="padding: 10px 8px;">{{ r.course }}</td>
                        <td style="padding: 10px 8px;"><KVerifyBadge :status="r.status" size="sm" /></td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KVerifyBadge from '../../ui-kit/components/KVerifyBadge.vue'

const statuses = ['verified', 'pending', 'unverified', 'rejected'] as const

const users = [
    { name: 'سارا محمدی', status: 'verified' as const },
    { name: 'رضا کریمی', status: 'pending' as const },
    { name: 'مینا رستمی', status: 'rejected' as const },
    { name: 'امیر تهرانی', status: 'unverified' as const },
]

const rows = [
    { teacher: 'نگار احمدی', course: 'مکالمه مقدماتی', status: 'verified' as const },
    { teacher: 'حسین نوری', course: 'گرامر پیشرفته', status: 'pending' as const },
    { teacher: 'لیلا صادقی', course: 'آیلتس فشرده', status: 'unverified' as const },
]
</script>
