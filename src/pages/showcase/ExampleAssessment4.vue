<!-- showcase/ExampleAssessment4.vue — آزمون شنیداری/دیداری + پاسخ صوتی ضبط‌شده -->
<template>
    <div class="sp">
        <h2 class="sp-title">نمونه ۴ — صدا و ویدیو (۱۰ سؤال، ۳ در هر صفحه)</h2>
        <p class="sp-note">
            گزینه‌های صوتی و ویدیویی با پلیر بومی، صورت‌سؤال با کلیپ، و پاسخ <b>صوتی</b>:
            چون سؤال <code>accept="audio/*"</code> است، خودِ کامپوننت به‌جای فایل‌پیکر عمومی
            ضبط‌کنندهٔ صدا را می‌آورد — بدون هیچ اسلاتی. اگر ویجت دیگری خواستید،
            <code>widget: 'file' | 'image' | 'record'</code> روی همان سؤال کافی است.
        </p>

        <KAssessmentWizard :assessment="exam" :per-page="3" v-model="answers" @submit="onSubmit" />

        <h3 class="sp-sub">پاسخ‌ها (شامل فایل صوتی)</h3>
        <pre class="ex-out">{{ summarize(answers) }}</pre>

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

/** File/Blob objects don't survive JSON.stringify — summarize instead */
const summarize = (a: AssessmentAnswers) => JSON.stringify(
    Object.fromEntries(Object.entries(a).map(([k, v]) => {
        if (v instanceof Blob) return [k, `${v.constructor.name}(${Math.round(v.size / 1024)}KB)`]
        if (Array.isArray(v) && v[0] instanceof Blob) return [k, v.map((f: Blob) => `${f.constructor.name}(${Math.round(f.size / 1024)}KB)`)]
        return [k, v]
    })),
    null,
    2
)

const audio1 = 'https://www.w3schools.com/html/horse.mp3'
const audio2 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
const clip = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const exam: Assessment = {
    info: {
        title: 'آزمون شنیداری زبان',
        description: 'گزینه‌ها فایل صوتی/ویدیویی هستند؛ دو سؤال هم پاسخ صوتی می‌خواهند.',
        provider: 'language-academy',
    },
    instructions: {
        title: 'پیش از شروع',
        items: [
            'هدفون توصیه می‌شود؛ هر کلیپ یک‌بار پخش می‌شود.',
            'برای پاسخ صوتی، اجازهٔ دسترسی به میکروفون را بدهید.',
        ],
        agreement: { label: 'شرایط آزمون را می‌پذیرم.' },
    },
    sections: [
        {
            id: 'listening',
            title: 'بخش شنیداری',
            questions: [
                {
                    id: 'l1',
                    number: '۱',
                    title: 'به کلیپ گوش دهید؛ گوینده چه چیزی درخواست می‌کند؟',
                    contents: [{ kind: 'audio', src: audio1, title: 'کلیپ ۱' }],
                    input: {
                        kind: 'choice',
                        options: [
                            { id: 'a', kind: 'audio', media: audio1, label: 'گزینه شنیداری A' },
                            { id: 'b', kind: 'audio', media: audio2, label: 'گزینه شنیداری B' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'l2',
                    number: '۲',
                    title: 'کدام کلیپ به مکالمهٔ رسمی نزدیک‌تر است؟',
                    input: {
                        kind: 'choice',
                        options: [
                            { id: 'c1', kind: 'video', media: clip, poster: 'https://picsum.photos/seed/ex4-c1/600/340', label: 'کلیپ رسمی' },
                            { id: 'c2', kind: 'video', media: clip, poster: 'https://picsum.photos/seed/ex4-c2/600/340', label: 'کلیپ دوستانه' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'l3',
                    number: '۳',
                    title: 'متن کلیپ را تایپ کنید.',
                    contents: [{ kind: 'video', src: clip, poster: 'https://picsum.photos/seed/ex4-dict/700/340' }],
                    input: { kind: 'text', multiline: true, rows: 3, placeholder: 'متن شنیده‌شده…' },
                    validation: [{ kind: 'required' }, { kind: 'length', min: 5 }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'l4',
                    number: '۴',
                    title: 'پاسخ صوتی خود را ضبط کنید.',
                    hint: 'میکروفون را بزنید، پاسخ را بگویید و دوباره بزنید تا متوقف شود.',
                    input: { kind: 'upload', accept: 'audio/*', maxCount: 1, maxSize: 5 * 1024 * 1024 },
                    validation: [{ kind: 'required' }, { kind: 'file', accept: 'audio', maxSize: 5 * 1024 * 1024 }],
                    scoring: [{ points: 3 }],
                },
                {
                    id: 'l5',
                    number: '۵',
                    title: 'در کدام کلیپ لحن پرسشی شنیده می‌شود؟',
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 2,
                        options: [
                            { id: 'q1', kind: 'audio', media: audio1, label: 'کلیپ ۱', tag: 'الف' },
                            { id: 'q2', kind: 'audio', media: audio2, label: 'کلیپ ۲', tag: 'ب' },
                        ],
                    },
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'l6',
                    number: '۶',
                    title: 'کدام جمله دربارهٔ گوینده درست است؟',
                    contents: [{ kind: 'audio', src: audio2, title: 'کلیپ ۳' }],
                    input: {
                        kind: 'choice',
                        layout: 'pills',
                        options: [
                            { id: 'fast', label: 'سریع صحبت می‌کند' },
                            { id: 'slow', label: 'آهسته صحبت می‌کند' },
                            { id: 'angry', label: 'عصبانی است' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'l7',
                    number: '۷',
                    title: 'کدام کلیپ یک گفت‌وگوی سؤال و جواب است؟',
                    input: {
                        kind: 'choice',
                        options: [
                            { id: 'd1', kind: 'video', media: clip, poster: 'https://picsum.photos/seed/ex4-d1/600/340', label: 'کلیپ ۱' },
                            { id: 'd2', kind: 'video', media: clip, poster: 'https://picsum.photos/seed/ex4-d2/600/340', label: 'کلیپ ۲' },
                            { id: 'd3', kind: 'video', media: clip, poster: 'https://picsum.photos/seed/ex4-d3/600/340', label: 'کلیپ ۳' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'l8',
                    number: '۸',
                    title: 'جملهٔ پایانی کلیپ را بنویسید.',
                    contents: [{ kind: 'audio', src: audio1 }],
                    input: { kind: 'text', multiline: true, rows: 2, placeholder: '…' },
                    validation: [{ kind: 'length', min: 3 }],
                },
                {
                    id: 'l9',
                    number: '۹',
                    title: 'خلاصهٔ شنیدهٔ خود را ضبط کنید (۶۰ ثانیه).',
                    input: { kind: 'upload', accept: 'audio/*', maxCount: 1 },
                },
                {
                    id: 'l10',
                    number: '۱۰',
                    title: 'کدام گزینه بهترین ترجمهٔ جملهٔ اول است؟',
                    input: {
                        kind: 'choice',
                        options: [
                            { id: 't1', label: 'من هر روز صبح پیاده‌روی می‌کنم.' },
                            { id: 't2', label: 'من دیروز پیاده‌روی کردم.' },
                            { id: 't3', label: 'من فردا پیاده‌روی می‌کنم.' },
                        ],
                    },
                    scoring: [{ points: 2 }],
                },
            ],
        },
    ],
    bands: [
        { minPercent: 80, message: 'سطح پیشرفته' },
        { minPercent: 50, message: 'سطح متوسط' },
        { minPercent: 0, message: 'نیاز به تمرین بیشتر' },
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
    max-height: 240px;
    overflow: auto;
}
</style>
