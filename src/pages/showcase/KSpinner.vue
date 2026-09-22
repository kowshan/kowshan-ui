<template>
    <div class="sp">
        <h2 class="sp-title">KSpinner</h2>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; align-items: center;">
                <div v-for="s in sizes" :key="s" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <KSpinner :size="s" />
                    <span style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ s }}</span>
                </div>
            </div>
        </div>

        <h3 class="sp-sub">رنگ سفارشی</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; align-items: center;">
                <KSpinner color="#1db954" size="lg" />
                <KSpinner color="#6366f1" size="lg" />
                <KSpinner color="#f59e0b" size="lg" />
                <KSpinner color="#ef4444" size="lg" />
            </div>
        </div>

        <h3 class="sp-sub">با برچسب</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KSpinner label="در حال بارگذاری…" />
            <KSpinner label="ذخیره تغییرات" size="lg" color="#6366f1" />
        </div>

        <h3 class="sp-sub">اورلی روی کارت (overlay)</h3>
        <div class="sp-card">
            <div
                style="position: relative; min-height: 160px; border: 1px solid var(--k-border); border-radius: 12px; padding: 16px;"
            >
                <div style="font-size: 0.85rem;">محتوای کارت که هنوز آماده نیست…</div>
                <KSpinner overlay label="در حال دریافت داده" />
            </div>
        </div>

        <h3 class="sp-sub">داخل دکمه (ترکیب)</h3>
        <div class="sp-card" style="display: flex; gap: 12px; align-items: center;">
            <KButton text="ذخیره" :bg-color="'transparent'" />
            <KButton text="در حال ذخیره" :bg-color="'transparent'" :disabled="true" />
            <KSpinner size="sm" />
        </div>

        <h3 class="sp-sub">در جدول — سلول در حال بارگذاری</h3>
        <div class="sp-card">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                <thead>
                    <tr style="text-align: start; color: var(--k-text-secondary);">
                        <th style="padding: 8px; text-align: start;">دوره</th>
                        <th style="padding: 8px; text-align: start;">دانش‌آموز</th>
                        <th style="padding: 8px; text-align: start;">وضعیت</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rows" :key="r.course" style="border-top: 1px solid var(--k-border);">
                        <td style="padding: 10px 8px;">{{ r.course }}</td>
                        <td style="padding: 10px 8px;">{{ r.student }}</td>
                        <td style="padding: 10px 8px;">
                            <KSpinner v-if="r.loading" size="xs" />
                            <span v-else style="color: var(--k-primary);">آماده</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="sp-sub">اورلی تمام‌صفحه (fullscreen)</h3>
        <div class="sp-card">
            <KButton text="نمایش اورلی تمام‌صفحه (۲ ثانیه)" @click="showFullscreen" />
            <KSpinner v-if="fullscreen" fullscreen label="در حال انتقال…" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KSpinner from '../../ui-kit/components/KSpinner.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const rows = [
    { course: 'مکالمه مقدماتی', student: 'سارا محمدی', loading: false },
    { course: 'گرامر پیشرفته', student: 'رضا کریمی', loading: true },
    { course: 'آیلتس فشرده', student: 'مینا رستمی', loading: true },
]

const fullscreen = ref(false)
const showFullscreen = () => {
    fullscreen.value = true
    setTimeout(() => { fullscreen.value = false }, 2000)
}
</script>
