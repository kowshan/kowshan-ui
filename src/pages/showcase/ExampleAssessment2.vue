<!-- showcase/ExampleAssessment2.vue — آزمون تصویری: صورت‌سؤال تصویری، گزینه‌های تصویری، پاسخ تصویری -->
<template>
    <div class="sp">
        <h2 class="sp-title">نمونه ۲ — آزمون تصویری (۱۰ سؤال، یک سؤال در هر صفحه)</h2>
        <p class="sp-note">
            هر مرحله محتوای متفاوتی دارد: صورت‌سؤال تصویری، گزینه‌های تصویری در گرید ۲×۲ و ۳ ستونه،
            مقایسه‌ی ویدیویی، و در آخر <b>پاسخ تصویری</b> — چون <code>accept="image/*"</code> است،
            خودِ کامپوننت انتخاب‌گر تصویر را به‌جای فایل‌پیکر عمومی می‌آورد (<code>per-page="1"</code>).
        </p>

        <KAssessmentWizard :assessment="exam" :per-page="1" v-model="answers" @submit="onSubmit" />

        <h3 class="sp-sub">خروجی نهایی</h3>
        <pre class="ex-out">{{ submitted }}</pre>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentWizard from '../../ui-kit/components/KAssessmentWizard.vue'
import type { Assessment, AssessmentAnswers } from '../../ui-kit/types/assessment'

const answers = ref<AssessmentAnswers>({})
const submitted = ref<any>(null)
const onSubmit = (payload: any) => { submitted.value = payload.list }

const exam: Assessment = {
    info: {
        title: 'آزمون تشخیص تصویری',
        description: 'شکل‌ها، نمودارها و کلیپ‌ها — همه به‌صورت محتوا و گزینه.',
        provider: 'vision-test',
    },
    sections: [
        {
            id: 'shapes',
            title: 'بخش تصویری',
            questions: [
                {
                    id: 'v1',
                    number: '۱',
                    title: 'کدام شکل با توضیح زیر مطابقت دارد؟',
                    contents: [
                        { kind: 'text', text: 'شکلی با چهار ضلع برابر و چهار زاویه‌ی قائمه.' },
                        { kind: 'image', src: 'https://picsum.photos/seed/ex2-prompt/900/360', caption: 'شکل مرجع' },
                    ],
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 2,
                        options: [
                            { id: 'a', kind: 'image', media: 'https://picsum.photos/seed/ex2-a/500/380', label: 'گزینه A' },
                            { id: 'b', kind: 'image', media: 'https://picsum.photos/seed/ex2-b/500/380', label: 'گزینه B' },
                            { id: 'c', kind: 'image', media: 'https://picsum.photos/seed/ex2-c/500/380', label: 'گزینه C' },
                            { id: 'd', kind: 'image', media: 'https://picsum.photos/seed/ex2-d/500/380', label: 'گزینه D' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                    explanation: 'گزینه B مربع است: چهار ضلع برابر و چهار زاویه‌ی ۹۰ درجه.',
                },
                {
                    id: 'v2',
                    number: '۲',
                    title: 'کدام تصویر نمودار یک تابع صعودی است؟',
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 3,
                        options: [
                            { id: 'up', kind: 'image', media: 'https://picsum.photos/seed/ex2-up/420/320', label: 'نمودار ۱', tag: 'الف' },
                            { id: 'flat', kind: 'image', media: 'https://picsum.photos/seed/ex2-flat/420/320', label: 'نمودار ۲', tag: 'ب' },
                            { id: 'down', kind: 'image', media: 'https://picsum.photos/seed/ex2-down/420/320', label: 'نمودار ۳', tag: 'ج' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'v3',
                    number: '۳',
                    title: 'کدام کلیپ نشان‌دهنده‌ی حرکت یکنواخت است؟',
                    input: {
                        kind: 'choice',
                        options: [
                            {
                                id: 'clip1',
                                kind: 'video',
                                media: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                                poster: 'https://picsum.photos/seed/ex2-clip1/600/340',
                                label: 'کلیپ اول',
                            },
                            {
                                id: 'clip2',
                                kind: 'video',
                                media: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                                poster: 'https://picsum.photos/seed/ex2-clip2/600/340',
                                label: 'کلیپ دوم',
                            },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'v4',
                    number: '۴',
                    title: 'کدام تصویر یک زاویهٔ باز (بیش از ۹۰ درجه) را نشان می‌دهد؟',
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 3,
                        options: [
                            { id: 'acute', kind: 'image', media: 'https://picsum.photos/seed/ex2-acute/420/300', label: 'زاویهٔ تند' },
                            { id: 'right', kind: 'image', media: 'https://picsum.photos/seed/ex2-right/420/300', label: 'زاویهٔ قائمه' },
                            { id: 'obtuse', kind: 'image', media: 'https://picsum.photos/seed/ex2-obtuse/420/300', label: 'زاویهٔ باز' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'v5',
                    number: '۵',
                    title: 'تصویر زیر را توصیف کنید (یک جمله).',
                    contents: [{ kind: 'image', src: 'https://picsum.photos/seed/ex2-describe/900/360', caption: 'تصویر مرجع' }],
                    input: { kind: 'text', placeholder: 'در این تصویر می‌بینم که…' },
                    validation: [{ kind: 'required' }, { kind: 'length', min: 10 }],
                },
                {
                    id: 'v6',
                    number: '۶',
                    title: 'کدام نمودار روند نزولی را نشان می‌دهد؟',
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 2,
                        options: [
                            { id: 'rose', kind: 'image', media: 'https://picsum.photos/seed/ex2-rose/500/380', label: 'نمودار ۱', tag: 'الف' },
                            { id: 'fall', kind: 'image', media: 'https://picsum.photos/seed/ex2-fall/500/380', label: 'نمودار ۲', tag: 'ب' },
                        ],
                    },
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'v7',
                    number: '۷',
                    title: 'کدام کلیپ حرکت چرخشی را بهتر نشان می‌دهد؟',
                    input: {
                        kind: 'choice',
                        options: [
                            {
                                id: 'r1',
                                kind: 'video',
                                media: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                                poster: 'https://picsum.photos/seed/ex2-r1/600/340',
                                label: 'کلیپ چرخشی',
                            },
                            {
                                id: 'r2',
                                kind: 'video',
                                media: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                                poster: 'https://picsum.photos/seed/ex2-r2/600/340',
                                label: 'کلیپ خطی',
                            },
                        ],
                    },
                },
                {
                    id: 'v8',
                    number: '۸',
                    title: 'شکل هندسی مقابل را نام ببرید.',
                    contents: [{ kind: 'image', src: 'https://picsum.photos/seed/ex2-shape/700/300', caption: 'شکل هندسی' }],
                    input: { kind: 'text', placeholder: 'نام شکل…' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'v9',
                    number: '۹',
                    title: 'راه‌حل کاغذی خود را بارگذاری کنید.',
                    hint: 'حداکثر ۲ تصویر، هر کدام تا ۲ مگابایت — انتخاب‌گر تصویر.',
                    input: { kind: 'upload', accept: 'image/*', maxCount: 2, maxSize: 2 * 1024 * 1024 },
                    validation: [{ kind: 'required' }, { kind: 'file', maxCount: 2, accept: 'image' }],
                },
                {
                    id: 'v10',
                    number: '۱۰',
                    title: 'یک تصویر از محیط کارتان بارگذاری کنید (اختیاری).',
                    input: { kind: 'upload', accept: 'image/*', maxCount: 1, maxSize: 3 * 1024 * 1024 },
                },
            ],
        },
    ],
}
</script>

<style scoped>
.ex-out {
    margin: 0;
    padding: 12px;
    border-radius: var(--k-radius-md);
    border: 1px solid var(--k-border);
    background: var(--k-surface);
    color: var(--k-text-secondary);
    font-size: 0.7rem;
    direction: ltr;
    max-height: 220px;
    overflow: auto;
}
</style>
