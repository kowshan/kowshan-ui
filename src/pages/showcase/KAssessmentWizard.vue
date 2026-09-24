<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentWizard</h2>
        <p class="sp-note">
            ارزیابی کامل: <code>Info → Instructions → Sections → Result</code>. اسکیمای پایه در
            <code>ui-kit/types/assessment.ts</code> است و هیچ چیز وابسته به یک سرویس‌دهنده خاص نیست —
            برای هر پرووایدر یک mapper ساده در <code>ui-kit/data/assessmentProviders.ts</code> می‌نویسید.
            منطق (شرط‌ها، اعتبارسنجی، امتیاز) در <code>useAssessment</code> است.
        </p>

        <h3 class="sp-sub">۱) آزمون کامل — انواع سؤال، مدیا، شرط نمایش، تایمر</h3>
        <KAssessmentWizard
            :assessment="mathExam"
            @submit="onSubmit"
            @timeout="lastEvent = 'timeout'"
            @step-change="(i, id) => lastEvent = `step ${i}: ${id}`"
        />
        <p class="sp-note">آخرین رویداد: {{ lastEvent || '—' }} · پاسخ‌های ثبت‌شده: {{ Object.keys(lastAnswers).length }}</p>

        <h3 class="sp-sub">۲) همان آزمون، بعد از ثبت (خارجی: نتیجه از سرور)</h3>
        <KAssessmentWizard
            :assessment="mathExam"
            :result="serverResult"
            :start-at-result="true"
            :show-stepper="true"
        >
            <template #result-actions>
                <KButton text="دانلود کارنامه" border="solid" @click="lastEvent = 'download'" />
            </template>
        </KAssessmentWizard>

        <h3 class="sp-sub">۳) خروجی mapper پرووایدر (generic API)</h3>
        <p class="sp-note">
            همان داده خام پرووایدر → <code>fromGenericProvider()</code> → اسکیمای کیت. سؤال دوم
            (تصویری، پاسخ تصویری) و سؤال چهارم (شرطی) فقط چون <code>choices[].image</code> و
            <code>show_if</code> داشتند تبدیل شده‌اند.
        </p>
        <KAssessmentWizard :assessment="mapped" @submit="onSubmit" />

        <h3 class="sp-sub">۴) خروجی mapper پرووایدر فرم‌محور (سؤالات در بخش‌ها)</h3>
        <KAssessmentWizard :assessment="formsMapped" @submit="onSubmit" />

        <h3 class="sp-sub">۵) کارنامه فشرده + یک بخش (review mode)</h3>
        <KAssessmentResult :result="serverResult" :assessment="mathExam" :compact="true" />

        <h3 class="sp-sub">۶) بدون stepper و بدون راهنما (فقط سؤالات)</h3>
        <KAssessmentWizard
            :assessment="quickQuiz"
            :show-stepper="false"
            :reveal-answers="true"
            @submit="onSubmit"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentWizard from '../../ui-kit/components/KAssessmentWizard.vue'
import KAssessmentResult from '../../ui-kit/components/KAssessmentResult.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { fromFormsProvider, fromGenericProvider } from '../../ui-kit/data/assessmentProviders'
import type { Assessment, AssessmentResult } from '../../ui-kit/types/assessment'

const lastEvent = ref('')
const lastAnswers = ref<Record<string, any>>({})

const onSubmit = ({ answers }: { answers: Record<string, any>; result: AssessmentResult }) => {
    lastAnswers.value = answers
    lastEvent.value = 'submit'
}

/* small inline SVG so the "math" prompt renders offline */
const mathImg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140">
       <rect width="420" height="140" fill="#eef2f7"/>
       <text x="24" y="62" font-size="30" fill="#0f172a">۲x + ۶ = ۲۰</text>
       <text x="24" y="110" font-size="18" fill="#64748b">مقدار x چند است؟</text>
     </svg>`
)

/* ── 1. a full exam ───────────────────────────────────────── */
const mathExam: Assessment = {
    info: {
        id: 'math-101',
        title: 'آزمون ریاضی پایه نهم',
        description: 'آزمون نمونه با انواع سؤال: متنی، تصویری، چندگزینه‌ای، مقیاس، ماتریس، رتبه‌بندی، بارگذاری، تاریخ و ساعت.',
        provider: 'academy',
        durationMinutes: 30,
        questionCount: 9,
        passScore: 12,
        meta: [
            { label: 'سطح', value: 'متوسط' },
            { label: 'نمره منفی', value: 'ندارد' },
        ],
    },
    instructions: {
        title: 'پیش از شروع',
        items: [
            'پاسخ‌ها را با دقت بخوانید؛ برخی سؤال‌ها تصویر یا فایل صوتی دارند.',
            'می‌توانید بین بخش‌ها جابه‌جا شوید، اما پس از «ثبت» امکان تغییر نیست.',
            { kind: 'link', url: 'https://example.com/rules', title: 'مقررات کامل آزمون' },
        ],
        agreement: { label: 'مقررات آزمون را خوانده‌ام و می‌پذیرم.' },
    },
    sections: [
        {
            id: 's1',
            title: 'بخش اول: جبر',
            description: 'سه سؤال چهارگزینه‌ای و یک سؤال تصویری',
            instructions: ['استفاده از ماشین‌حساب مجاز نیست.'],
            weight: 1,
            questions: [
                {
                    id: 'q1',
                    title: 'حاصل ۷ × ۸ کدام است؟',
                    input: {
                        kind: 'choice',
                        options: [
                            { id: 'a', label: '۵۴' },
                            { id: 'b', label: '۵۶' },
                            { id: 'c', label: '۶۴' },
                            { id: 'd', label: '۴۸' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                    explanation: '۷ × ۸ = ۵۶',
                },
                {
                    id: 'q2',
                    title: 'معادله زیر را حل کنید و مقدار x را بنویسید.',
                    contents: [{ kind: 'image', src: mathImg, alt: 'معادله ۲x + ۶ = ۲۰' }],
                    input: { kind: 'text', placeholder: 'مثلاً ۷', max: 4 },
                    validation: [{ kind: 'required' }, { kind: 'length', min: 1, max: 4 }],
                    scoring: [{ points: 3 }],
                    explanation: '۲x = ۱۴ → x = ۷',
                },
                {
                    id: 'q3',
                    title: 'کدام گزینه‌ها عدد اول هستند؟ (چند گزینه‌ای)',
                    input: {
                        kind: 'choice',
                        multiple: true,
                        layout: 'grid',
                        options: [
                            { id: '11', label: '۱۱' },
                            { id: '15', label: '۱۵' },
                            { id: '17', label: '۱۷' },
                            { id: '21', label: '۲۱' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2, perOption: true }],
                },
                {
                    id: 'q4-img',
                    title: 'نمودار کدام تابع خطی است؟',
                    input: {
                        kind: 'choice',
                        layout: 'grid',
                        columns: 3,
                        options: [
                            { id: 'a', kind: 'image', media: 'https://picsum.photos/seed/assess-a/400/300', label: 'نمودار A' },
                            { id: 'b', kind: 'image', media: 'https://picsum.photos/seed/assess-b/400/300', label: 'نمودار B' },
                            { id: 'c', kind: 'image', media: 'https://picsum.photos/seed/assess-c/400/300', label: 'نمودار C' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 3 }],
                },
            ],
        },
        {
            id: 's2',
            title: 'بخش دوم: مهارت‌ها',
            description: 'مقیاس، ماتریس، رتبه‌بندی، بارگذاری فایل، تاریخ و ساعت',
            weight: 1,
            questions: [
                {
                    id: 'q5',
                    title: 'چقدر با مشتق آشنایی دارید؟',
                    input: {
                        kind: 'scale',
                        min: 1,
                        max: 10,
                        step: 1,
                        minLabel: 'کاملاً ناآشنا',
                        maxLabel: 'کاملاً مسلط',
                    },
                    scoring: [{ points: 1 }],
                },
                {
                    id: 'q6',
                    title: 'میزان علاقه‌تان به هر مبحث را مشخص کنید.',
                    input: {
                        kind: 'matrix',
                        matrixRows: [
                            { id: 'geo', label: 'هندسه', description: 'شکل‌ها و اثبات‌ها' },
                            { id: 'alg', label: 'جبر' },
                            { id: 'stat', label: 'آمار و احتمال' },
                        ],
                        matrixColumns: [
                            { id: '2', value: 2, label: '۲', description: 'کم' },
                            { id: '3', value: 3, label: '۳', description: 'متوسط' },
                            { id: '4', value: 4, label: '۴', description: 'زیاد' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'q7',
                    title: 'مباحث را به ترتیب اهمیت مرتب کنید (بالا = مهم‌تر).',
                    input: {
                        kind: 'ranking',
                        options: [
                            { id: 'algebra', label: 'جبر' },
                            { id: 'geometry', label: 'هندسه' },
                            { id: 'statistics', label: 'آمار' },
                        ],
                    },
                    scoring: [{ points: 1 }],
                },
                {
                    id: 'q8',
                    title: 'عکس راه‌حل خود را بارگذاری کنید.',
                    hint: 'فرمت تصویر، حداکثر ۲ مگابایت',
                    input: { kind: 'upload', accept: 'image/*', maxSize: 2 * 1024 * 1024, maxCount: 2 },
                    validation: [{ kind: 'file', maxCount: 2, maxSize: 2 * 1024 * 1024, accept: 'image' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'q9',
                    title: 'زمان جلسه‌ی مطالعه بعدی‌تان را بگویید.',
                    input: { kind: 'date' },
                    logic: [{ when: { questionId: 'q5', operator: 'gte', value: 5 }, effect: 'require', message: 'برای سطح شما ثبت برنامه لازم است.' }],
                },
                {
                    id: 'q10',
                    title: 'ساعت شروع همان جلسه',
                    input: { kind: 'time', withSeconds: false },
                    condition: { questionId: 'q9', operator: 'isNotEmpty' },
                },
            ],
        },
    ],
    bands: [
        { minPercent: 80, message: 'عالی بود! آماده‌ی مباحث پیشرفته‌ای.' },
        { minPercent: 50, message: 'پایه‌ات خوب است، فقط چند مبحث را تمرین کن.' },
    ],
}

const serverResult: AssessmentResult = {
    score: 14,
    maxScore: 18,
    percent: 78,
    passed: true,
    answered: 10,
    total: 10,
    sections: [
        { sectionId: 's1', title: 'بخش اول: جبر', score: 9, maxScore: 10, answered: 4, total: 4 },
        { sectionId: 's2', title: 'بخش دوم: مهارت‌ها', score: 5, maxScore: 8, answered: 6, total: 6 },
    ],
    message: 'پایه‌ات خوب است، فقط چند مبحث را تمرین کن.',
}

/* ── 3. provider-mapped (generic API) ─────────────────────── */
const mapped = fromGenericProvider({
    id: 'prov-77',
    title: 'آزمون زبان — پرووایدر بیرونی',
    description: 'همه سؤال‌ها از API خام به اسکیمای کیت تبدیل شده‌اند.',
    duration_minutes: 12,
    pass_score: 4,
    questions: [
        { id: 1, type: 'short_text', prompt: 'پایتخت فرانسه؟', required: true, points: 2 },
        {
            id: 2,
            type: 'single_choice',
            prompt: 'تصویر درست را انتخاب کنید.',
            image: 'https://picsum.photos/seed/prov-q2/500/300',
            choices: [
                { id: 'a', image: 'https://picsum.photos/seed/prov-a/300/220' },
                { id: 'b', image: 'https://picsum.photos/seed/prov-b/300/220' },
            ],
            points: 2,
        },
        { id: 3, type: 'scale', prompt: 'سطح خود را بسنجید', min: 1, max: 5 },
        {
            id: 4,
            type: 'long_text',
            prompt: 'چرا این پاسخ را انتخاب کردید؟',
            show_if: { question_id: 2, equals: 'a' },
        },
    ],
})

/* ── 4. provider-mapped (forms-style) ─────────────────────── */
const formsMapped = fromFormsProvider({
    formId: 'form-9',
    title: 'فرم ارزیابی کلاس',
    sections: [
        {
            sectionId: 'part-a',
            title: 'بخش الف — دانش',
            items: [
                { itemId: 'f1', title: 'جاهای خالی را کامل کنید', type: 'TEXT', required: true, points: 1 },
                {
                    itemId: 'f2',
                    title: 'کدام گزینه صحیح است؟',
                    type: 'RADIO',
                    points: 2,
                    options: [
                        { value: 'a', text: 'گزینه اول' },
                        { value: 'b', text: 'گزینه دوم' },
                        { value: 'c', text: 'گزینه سوم' },
                    ],
                },
            ],
        },
        {
            sectionId: 'part-b',
            title: 'بخش ب — نگرش',
            items: [
                { itemId: 'f3', title: 'میزان رضایت', type: 'SCALE', scale: { low: 1, high: 5, lowLabel: 'کم', highLabel: 'زیاد' } },
                {
                    itemId: 'f4',
                    title: 'کیفیت هر بخش را بسنجید',
                    type: 'GRID',
                    rows: ['محتوای درسی', 'روش تدریس'],
                    scale: { low: 1, high: 4 },
                },
                { itemId: 'f5', title: 'وضعیت خود را توضیح دهید', type: 'PARAGRAPH' },
            ],
        },
    ],
})

/* ── 6. quick quiz (no instructions) ─────────────────────── */
const quickQuiz: Assessment = {
    info: { title: 'کوییز سریع', durationMinutes: 5 },
    sections: [
        {
            id: 'quick',
            title: 'سه سؤال کوتاه',
            questions: [
                { id: 'k1', title: 'چه کسی Vue را ساخت؟', input: { kind: 'text' }, scoring: [{ points: 1 }], explanation: 'Evan You' },
                {
                    id: 'k2',
                    title: 'سن شما',
                    input: { kind: 'number', min: 10, max: 90, suffix: 'سال' },
                    validation: [{ kind: 'required' }, { kind: 'range', min: 10, max: 90 }],
                },
                { id: 'k3', title: 'ساعت کلاس مناسب شما', input: { kind: 'time' } },
            ],
        },
    ],
}
</script>
