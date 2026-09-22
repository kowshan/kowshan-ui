<template>
    <div class="sp">
        <h2 class="sp-title">KJobCard</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="jc-grid">
            <KJobCard
                title="کارآموز فرانت‌اند"
                company="آکادمی کِی"
                location="تهران، ایران"
                type="کارآموزی"
                time="۲ روز پیش"
                @apply="onApply('کارآموز فرانت‌اند')"
            />
        </div>

        <h3 class="sp-sub">کامل (حقوق + برچسب‌ها + جدید)</h3>
        <div class="jc-grid">
            <KJobCard
                title="توسعه‌دهنده Vue.js"
                company="دیجی‌کِیت"
                company-avatar="/favicon.ico"
                location="تهران — دورکاری"
                type="تمام‌وقت"
                salary="۲۵ تا ۴۰ میلیون"
                :tags="['Vue', 'TypeScript', 'Tailwind']"
                time="امروز"
                :is-new="true"
                @apply="onApply('توسعه‌دهنده Vue.js')"
            />
        </div>

        <h3 class="sp-sub">با آواتار شرکت (SVG داخلی)</h3>
        <div class="jc-grid">
            <KJobCard
                title="طراح محصول"
                company="فن‌آوا"
                :company-avatar="avatar('#8B5CF6', '#ec4899', 'ف')"
                location="اصفهان"
                type="پیمانکاری"
                salary="۱۵ تا ۲۲ میلیون"
                :tags="['Figma', 'UX']"
                time="۳ روز پیش"
                @apply="onApply('طراح محصول')"
            />
            <KJobCard
                title="کارشناس پشتیبانی"
                company="همیار سیستم"
                :company-avatar="avatar('#0ea5e9', '#1db954', 'ه')"
                location="مشهد — حضوری"
                type="تمام‌وقت"
                salary="۱۰ تا ۱۴ میلیون"
                :tags="['پشتیبانی', 'CRM']"
                time="۱ هفته پیش"
                @apply="onApply('کارشناس پشتیبانی')"
            />
        </div>

        <h3 class="sp-sub">بورد آگهی‌ها</h3>
        <div class="jc-grid">
            <KJobCard
                v-for="job in jobs"
                :key="job.title"
                v-bind="job"
                @apply="onApply(job.title)"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین درخواست: {{ applied }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KJobCard from '../../ui-kit/components/KJobCard.vue'

const applied = ref('—')
const onApply = (title: string) => { applied.value = title }

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='48' height='48' rx='12' fill='url(%23g)'/><text x='24' y='32' font-size='22' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const jobs = [
    { title: 'مهندس DevOps', company: 'ابر آریا', location: 'دورکاری', type: 'تمام‌وقت', salary: '۴۰ تا ۶۰ میلیون', tags: ['Docker', 'CI/CD'], time: 'امروز', isNew: true, companyAvatar: avatar('#f59e0b', '#ef4444', 'ا') },
    { title: 'تحلیل‌گر داده', company: 'داده‌پرداز', location: 'تهران', type: 'تمام‌وقت', salary: '۳۰ تا ۴۵ میلیون', tags: ['SQL', 'Laravel'], time: '۴ روز پیش', companyAvatar: avatar('#22c55e', '#84cc16', 'د') },
    { title: 'مدرس زبان انگلیسی', company: 'زبان‌سرا', location: 'کرج', type: 'پاره‌وقت', tags: ['آموزش', 'ILTS'], time: '۱ هفته پیش', companyAvatar: avatar('#6366f1', '#8B5CF6', 'ز') },
]
</script>

<style scoped>
.jc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}
</style>
