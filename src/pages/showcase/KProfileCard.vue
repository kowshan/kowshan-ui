<template>
    <div class="sp">
        <h2 class="sp-title">KProfileCard</h2>

        <h3 class="sp-sub">پایه (آواتار + نام + نقش)</h3>
        <div class="sp-row">
            <KProfileCard :name="'سارا محمدی'" :role="'مدرس زبان انگلیسی'" :avatar="avatar('#8b5cf6', '#6366f1', 'س')" />
        </div>

        <h3 class="sp-sub">کامل — کاور، شرکت، آمار، تگ و اکشن</h3>
        <div class="sp-row" style="max-width: 380px;">
            <KProfileCard
                name="رضا کریمی"
                role="مدیر محصول"
                company="آکادمی زبان‌سرا"
                :avatar="avatar('#f59e0b', '#ef4444', 'ر')"
                :cover="cover"
                status="online"
                :stats="stats"
                :tags="['SaaS', 'فارسی', 'B2B']"
                :actions="actions"
                @action="onAction"
            />
        </div>

        <h3 class="sp-sub">وضعیت‌های حضور</h3>
        <div class="sp-grid">
            <KProfileCard
                name="مینا رستمی"
                role="پشتیبانی"
                :avatar="avatar('#22c55e', '#16a34a', 'م')"
                status="online"
                :stats="[{ label: 'تیکت', value: 42 }]"
            />
            <KProfileCard
                name="امیر تهرانی"
                role="حسابداری"
                :avatar="avatar('#f59e0b', '#d97706', 'ا')"
                status="busy"
                :stats="[{ label: 'فاکتور', value: 17 }]"
            />
            <KProfileCard
                name="نگار احمدی"
                role="مدرس"
                :avatar="avatar('#0ea5e9', '#0284c7', 'ن')"
                status="away"
                :stats="[{ label: 'کلاس', value: 6 }]"
            />
            <KProfileCard
                name="حسین نوری"
                role="دانش‌آموز"
                :avatar="avatar('#94a3b8', '#64748b', 'ح')"
                status="offline"
                :stats="[{ label: 'دوره', value: 3 }]"
            />
        </div>

        <h3 class="sp-sub">کاور سفارشی + آمار زیاد</h3>
        <div class="sp-row" style="max-width: 380px;">
            <KProfileCard
                name="آکادمی زبان‌سرا"
                role="حساب سازمانی"
                company="تهران، سعادت‌آباد"
                :avatar="avatar('#14b8a6', '#0d9488', 'آ')"
                :cover="cover2"
                status="online"
                :stats="[
                    { label: 'دانش‌آموز', value: 1240 },
                    { label: 'دوره', value: 86 },
                    { label: 'مدرس', value: 34 },
                    { label: 'رضایت', value: '۹۶٪' },
                ]"
                :tags="['آموزشگاه', 'آنلاین']"
                :actions="actions"
                @action="onAction"
            />
        </div>

        <h3 class="sp-sub">بدون آمار، تگ و اکشن</h3>
        <div class="sp-row">
            <KProfileCard
                name="کاربر مهمان"
                :avatar="avatar('#cbd5e1', '#94a3b8', '؟')"
                status="offline"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین اکشن: {{ lastAction ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Phone, Settings } from 'lucide-vue-next'
import KProfileCard from '../../ui-kit/components/KProfileCard.vue'

const lastAction = ref<string | null>(null)
const onAction = (id: string) => { lastAction.value = id }

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='96' height='96' fill='url(%23g)'/><text x='48' y='64' font-size='42' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const cover = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='120'><defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%231db954'/><stop offset='1' stop-color='%236366f1'/></linearGradient></defs><rect width='400' height='120' fill='url(%23c)'/><circle cx='60' cy='30' r='50' fill='%23ffffff' opacity='0.12'/><circle cx='330' cy='100' r='60' fill='%23ffffff' opacity='0.10'/></svg>`

const cover2 = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='120'><defs><linearGradient id='c2' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23f59e0b'/><stop offset='1' stop-color='%23ef4444'/></linearGradient></defs><rect width='400' height='120' fill='url(%23c2)'/><path d='M0 90 Q100 40 200 90 T400 90 L400 120 L0 120 Z' fill='%23ffffff' opacity='0.14'/></svg>`

const stats = [
    { label: 'پروژه', value: 24 },
    { label: 'فالوور', value: 1830 },
    { label: 'امتیاز', value: '۴.۸' },
]

const actions = [
    { id: 'message', label: 'پیام', icon: Mail, primary: true },
    { id: 'call', label: 'تماس', icon: Phone },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
]
</script>

<style scoped>
.sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}
</style>
