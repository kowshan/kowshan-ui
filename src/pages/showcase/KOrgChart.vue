<template>
    <div class="sp">
        <h2 class="sp-title">KOrgChart</h2>

        <h3 class="sp-sub">تیم کوچک</h3>
        <div class="sp-card">
            <KOrgChart :nodes="small" @select="onSelect" />
        </div>

        <h3 class="sp-sub">ساختار سه‌سطحی</h3>
        <div class="sp-card">
            <KOrgChart :nodes="threeLevel" @select="onSelect" />
        </div>

        <h3 class="sp-sub">پهن (چند زیرمجموعه در یک سطح)</h3>
        <div class="sp-card">
            <KOrgChart :nodes="wide" @select="onSelect" />
        </div>

        <h3 class="sp-sub">با آواتار و بج</h3>
        <div class="sp-card">
            <KOrgChart :nodes="withBadges" @select="onSelect" />
        </div>

        <h3 class="sp-sub">زنجیره عمیق (۵ سطح)</h3>
        <div class="sp-card">
            <KOrgChart :nodes="deep" @select="onSelect" />
        </div>

        <h3 class="sp-sub">تک‌نود</h3>
        <div class="sp-card">
            <KOrgChart :nodes="single" @select="onSelect" />
        </div>

        <h3 class="sp-sub">خالی (بدون نود)</h3>
        <div class="sp-card">
            <KOrgChart :nodes="[]" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">select: {{ selected }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KOrgChart, { type KOrgNodeData } from '../../ui-kit/components/KOrgChart.vue'

const selected = ref('—')
const onSelect = (n: KOrgNodeData) => { selected.value = `${n.name}${n.role ? ' — ' + n.role : ''}` }

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='48' height='48' rx='24' fill='url(%23g)'/><text x='24' y='31' font-size='20' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const small: KOrgNodeData[] = [
    {
        id: 1,
        name: 'مریم احمدی',
        role: 'مدیرعامل',
        children: [
            { id: 2, name: 'علی رضایی', role: 'مدیر فنی' },
            { id: 3, name: 'سارا نوری', role: 'مدیر محصول' },
        ],
    },
]

const threeLevel: KOrgNodeData[] = [
    {
        id: 1,
        name: 'آکادمی کِی',
        role: 'ستاد مرکزی',
        children: [
            {
                id: 2,
                name: 'واحد آموزش',
                role: 'مدیریت',
                children: [
                    { id: 4, name: 'مدرس فرانت‌اند', role: 'تمام‌وقت' },
                    { id: 5, name: 'مدرس بک‌اند', role: 'پاره‌وقت' },
                ],
            },
            {
                id: 3,
                name: 'واحد پشتیبانی',
                role: 'مدیریت',
                children: [
                    { id: 6, name: 'پشتیبان فنی', role: 'شیفت صبح' },
                    { id: 7, name: 'پشتیبان فروش', role: 'شیفت عصر' },
                    { id: 8, name: 'کارشناس شکایات', role: 'تمام‌وقت' },
                ],
            },
        ],
    },
]

const wide: KOrgNodeData[] = [
    {
        id: 'w1',
        name: 'تیم محصول',
        role: '۹ نفر',
        children: Array.from({ length: 7 }, (_, i) => ({
            id: `w-${i}`,
            name: `عضو تیم ${i + 1}`,
            role: ['فرانت‌اند', 'بک‌اند', 'طراحی', 'تحلیل'][i % 4],
        })),
    },
]

const withBadges: KOrgNodeData[] = [
    {
        id: 'b1',
        name: 'حسین کریمی',
        role: 'مدیرعامل',
        avatar: avatar('1db954', '0ea5e9', 'ح'),
        badge: 'فعال',
        badgeColor: '#22c55e',
        children: [
            { id: 'b2', name: 'مریم احمدی', role: 'CFO', avatar: avatar('8B5CF6', 'ec4899', 'م'), badge: 'مرخصی', badgeColor: '#f59e0b' },
            { id: 'b3', name: 'علی رضایی', role: 'CTO', avatar: avatar('f59e0b', 'ef4444', 'ع') },
            { id: 'b4', name: 'سارا نوری', role: 'CPO', avatar: avatar('6366f1', '0ea5e9', 'س'), badge: 'جدید', badgeColor: '#3b82f6' },
        ],
    },
]

const deep: KOrgNodeData[] = [
    {
        id: 'd1',
        name: 'سطح ۱',
        role: 'ریشه',
        children: [
            {
                id: 'd2',
                name: 'سطح ۲',
                children: [
                    {
                        id: 'd3',
                        name: 'سطح ۳',
                        children: [
                            {
                                id: 'd4',
                                name: 'سطح ۴',
                                children: [{ id: 'd5', name: 'سطح ۵', role: 'برگ' }],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

const single: KOrgNodeData[] = [{ id: 's1', name: 'کاربر مهمان', role: 'بدون زیرمجموعه', badge: 'آزمایشی' }]
</script>
