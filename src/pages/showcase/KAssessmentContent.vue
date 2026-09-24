<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentContent</h2>
        <p class="sp-note">
            بخش محتوای یک سؤال — شش نوع: <code>text / image / audio / video / file / link</code>.
            پرووایدر خودش را به <code>ContentBlock[]</code> تبدیل کنید، این کامپوننت رسمش می‌کند.
        </p>

        <h3 class="sp-sub">همه‌ی شش نوع در یک بلوک</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="allKinds" />
        </div>

        <h3 class="sp-sub">متنی — ساده / چندخطی / HTML</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="textBlocks" />
        </div>

        <h3 class="sp-sub">تصویر — با و بدون caption</h3>
        <div class="sp-card" style="max-width: 420px">
            <KAssessmentContent :blocks="imageBlocks" />
        </div>

        <h3 class="sp-sub">صدا و ویدیو — پلیر بومی</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="mediaBlocks" />
        </div>

        <h3 class="sp-sub">فایل و لینک — با متادیتا و دانلود</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="fileBlocks" />
        </div>

        <h3 class="sp-sub">جهت‌ها: خودکار / اجباری RTL / LTR</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="[{ kind: 'text', text: 'RTL: این متن راست‌چین است.' }]" direction="rtl" />
            <KAssessmentContent :blocks="[{ kind: 'text', text: 'LTR: this line stays left aligned.' }]" direction="ltr" />
        </div>

        <h3 class="sp-sub">حالت مرزی — بدون بلوک / بلوک ناقص (بدون src)</h3>
        <div class="sp-card">
            <KAssessmentContent :blocks="[]" />
            <KAssessmentContent :blocks="[{ kind: 'audio' }, { kind: 'file', name: 'بدون لینک' }]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KAssessmentContent from '../../ui-kit/components/KAssessmentContent.vue'
import type { ContentBlock } from '../../ui-kit/types/assessment'

const allKinds: ContentBlock[] = [
    { kind: 'text', text: 'متن صورت سؤال با پشتیبانی از خط جدید.' },
    { kind: 'image', src: 'https://picsum.photos/seed/ac-all/800/400', caption: 'تصویر صورت سؤال' },
    { kind: 'audio', src: 'https://www.w3schools.com/html/horse.mp3', title: 'فایل صوتی' },
    { kind: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'https://picsum.photos/seed/ac-vid/800/400', caption: 'کلیپ کوتاه' },
    { kind: 'file', name: 'کاربرگ تمرین.pdf', size: 248_000, mime: 'application/pdf', url: '#' },
    { kind: 'link', url: 'https://example.com/reference', title: 'منبع مرجع' },
]

const textBlocks: ContentBlock[] = [
    { kind: 'text', text: 'خط اول\nخط دوم' },
    { kind: 'text', html: 'متن با <b>تأکید</b> و <code>کد</code>' },
]

const imageBlocks: ContentBlock[] = [
    { kind: 'image', src: 'https://picsum.photos/seed/ac-img/600/300', alt: 'توپ و مسیر' },
    { kind: 'image', src: 'https://picsum.photos/seed/ac-img2/600/300', caption: 'با caption' },
]

const mediaBlocks: ContentBlock[] = [
    { kind: 'audio', src: 'https://www.w3schools.com/html/horse.mp3', title: 'سؤال شنیداری' },
    { kind: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'https://picsum.photos/seed/ac-vid2/800/400' },
]

const fileBlocks: ContentBlock[] = [
    { kind: 'file', name: 'داده‌ها.csv', size: 1_450_000, mime: 'text/csv', url: '#' },
    { kind: 'file', name: 'puzzle.zip', size: 32_000, url: '#' },
    { kind: 'link', url: 'https://vuejs.org', title: 'مستندات Vue' },
]
</script>

<style scoped>
.sp-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
</style>
