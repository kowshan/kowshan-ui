<template>
    <div class="sp">
        <h2 class="sp-title">KStories</h2>

        <h3 class="sp-sub">پایه — سه استوری</h3>
        <div class="sp-card">
            <KStories :stories="basicStories" />
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 24px;">
            <KStories :stories="basicStories" size="sm" />
            <KStories :stories="basicStories" size="md" />
            <KStories :stories="basicStories" size="lg" />
        </div>

        <h3 class="sp-sub">سرعت پخش (۲ ثانیه برای هر تصویر)</h3>
        <div class="sp-card">
            <KStories :stories="basicStories" :duration="2000" />
        </div>

        <h3 class="sp-sub">چند سگمنت در یک استوری (نوار پیشرفت چندتکه)</h3>
        <div class="sp-card">
            <KStories :stories="multiSegment" :duration="3000" />
        </div>

        <h3 class="sp-sub">با آیکون به‌جای آواتار</h3>
        <div class="sp-card">
            <KStories :stories="iconStories" :duration="2500" />
        </div>

        <h3 class="sp-sub">یک استوری با یک تصویر</h3>
        <div class="sp-card">
            <KStories :stories="[multiSegment[0]]" :duration="2500" />
        </div>

        <p class="sp-note">
            روی هر آواتار کلیک کنید: نمایش تمام‌صفحه باز می‌شود، کلیک روی نیمه چپ/راست تصویر
            جابه‌جا می‌کند، Esc می‌بندد، و استوری دیده‌شده حلقه‌اش خاکستری می‌شود.
        </p>
    </div>
</template>

<script setup lang="ts">
import { BookOpen, GraduationCap, Mic } from 'lucide-vue-next'
import KStories from '../../ui-kit/components/KStories.vue'

const shot = (from: string, to: string, label: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='1280'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='720' height='1280' fill='url(%23g)'/><circle cx='580' cy='220' r='220' fill='%23ffffff' opacity='0.10'/><circle cx='120' cy='1060' r='180' fill='%23ffffff' opacity='0.08'/><text x='360' y='660' font-size='56' text-anchor='middle' fill='%23ffffff'>${label}</text></svg>`

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='96' height='96' fill='url(%23a)'/><text x='48' y='64' font-size='42' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const basicStories = [
    {
        name: 'سارا محمدی',
        avatar: avatar('#8b5cf6', '#6366f1', 'س'),
        media: [{ src: shot('#8b5cf6', '#6366f1', 'کلاس مکالمه') }],
    },
    {
        name: 'رضا کریمی',
        avatar: avatar('#f59e0b', '#ef4444', 'ر'),
        media: [{ src: shot('#f59e0b', '#ef4444', 'کارگاه گرامر') }],
    },
    {
        name: 'مینا رستمی',
        avatar: avatar('#1db954', '#0d9488', 'م'),
        media: [{ src: shot('#1db954', '#0d9488', 'آیلتس فشرده') }],
    },
]

const multiSegment = [
    {
        name: 'رضا کریمی',
        avatar: avatar('#f59e0b', '#ef4444', 'ر'),
        media: [
            { src: shot('#f59e0b', '#ef4444', 'قسمت ۱'), caption: 'شروع کارگاه' },
            { src: shot('#ef4444', '#be123c', 'قسمت ۲'), caption: 'تمرین گروهی' },
            { src: shot('#be123c', '#7f1d1d', 'قسمت ۳'), caption: 'جمع‌بندی' },
        ],
    },
]

const iconStories = [
    { name: 'دوره‌ها', icon: BookOpen, media: [{ src: shot('#0ea5e9', '#0369a1', 'همه دوره‌ها') }] },
    { name: 'گواهی‌ها', icon: GraduationCap, media: [{ src: shot('#6366f1', '#4338ca', 'گواهی‌نامه') }] },
    { name: 'پادکست', icon: Mic, media: [{ src: shot('#22c55e', '#15803d', 'پادکست هفته') }] },
]
</script>
