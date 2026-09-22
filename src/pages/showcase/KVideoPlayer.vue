<template>
    <div class="sp">
        <h2 class="sp-title">KVideoPlayer</h2>
        <p class="sp-note">
            پوسترها آفلاین رندر می‌شوند (SVG درون‌خطی)، اما فایل ویدیو از اینترنت می‌آید — اگر آفلاین
            باشید فقط پوستر و کنترل‌ها را می‌بینید.
        </p>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 640px;">
            <KVideoPlayer
                :src="clip"
                :poster="poster('#1db954', '#0d9488', 'مکالمه')"
                title="درس ۱ — سلام و احوال‌پرسی"
                @play="onPlay"
                @pause="onPause"
                @ended="onEnded"
            />
            <div class="sp-vmodel" style="margin-top: 14px;">
                play: {{ plays }} بار — pause: {{ pauses }} بار — ended: {{ ends }} بار
            </div>
        </div>

        <h3 class="sp-sub">بدون عنوان</h3>
        <div class="sp-card" style="max-width: 640px;">
            <KVideoPlayer :src="clip" :poster="poster('#6366f1', '#4338ca', 'بدون عنوان')" />
        </div>

        <h3 class="sp-sub">حالت بی‌صدا و حلقه‌ای</h3>
        <div class="sp-card" style="max-width: 640px;">
            <KVideoPlayer
                :src="clip"
                :poster="poster('#f59e0b', '#d97706', 'بی‌صدا')"
                title="نمونه بی‌صدا (loop)"
                :muted="true"
                :loop="true"
            />
        </div>

        <h3 class="sp-sub">بدون پوستر (فقط پس‌زمینه تیره)</h3>
        <div class="sp-card" style="max-width: 640px;">
            <KVideoPlayer :src="clip" title="بدون پوستر" />
        </div>

        <h3 class="sp-sub">رویداد timeupdate</h3>
        <div class="sp-card" style="max-width: 640px;">
            <KVideoPlayer :src="clip" :poster="poster('#ec4899', '#be185d', 'زمان')" title="ردیابی زمان" @timeupdate="onTime" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                ثانیه فعلی: {{ currentTime.toFixed(2) }} — رویداد: {{ timeEvents }} بار
            </div>
        </div>

        <h3 class="sp-sub">کاربردی — پخش‌کننده درس</h3>
        <div class="sp-card" style="max-width: 720px; display: flex; flex-direction: column; gap: 16px;">
            <KVideoPlayer
                :src="clip"
                :poster="poster('#0ea5e9', '#0369a1', 'جلسه ۵')"
                title="جلسه ۵ — زمان حال کامل"
                @ended="lessonEnded = true"
            />
            <div
                v-for="l in lessons"
                :key="l.title"
                style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--k-border); font-size: 0.82rem;"
            >
                <span>{{ l.title }}</span>
                <span style="color: var(--k-text-muted); font-size: 0.75rem;">{{ l.time }}</span>
            </div>
            <div v-if="lessonEnded" class="sp-vmodel">جلسه تمام شد — جلسه بعدی فعال شد ✅</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KVideoPlayer from '../../ui-kit/components/KVideoPlayer.vue'

const clip = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const poster = (from: string, to: string, label: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='1280' height='720' fill='url(%23g)'/><circle cx='1040' cy='150' r='220' fill='%23ffffff' opacity='0.10'/><text x='640' y='390' font-size='76' text-anchor='middle' fill='%23ffffff' opacity='0.92'>${label}</text></svg>`

const plays = ref(0)
const pauses = ref(0)
const ends = ref(0)
const onPlay = () => { plays.value++ }
const onPause = () => { pauses.value++ }
const onEnded = () => { ends.value++ }

const currentTime = ref(0)
const timeEvents = ref(0)
const onTime = (t: number) => {
    currentTime.value = t
    timeEvents.value++
}

const lessonEnded = ref(false)
const lessons = [
    { title: 'جلسه ۱ — مرور زمان‌های ساده', time: '۱۸ دقیقه' },
    { title: 'جلسه ۲ — حال استمراری', time: '۲۲ دقیقه' },
    { title: 'جلسه ۳ — گذشته ساده', time: '۲۰ دقیقه' },
    { title: 'جلسه ۴ — تمرین ترکیبی', time: '۲۵ دقیقه' },
    { title: 'جلسه ۵ — زمان حال کامل', time: '۲۳ دقیقه' },
]
</script>
