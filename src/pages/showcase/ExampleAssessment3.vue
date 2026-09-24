<!-- showcase/ExampleAssessment3.vue — جدولی: ماتریس، مقیاس، رتبه‌بندی، انتخابی جدولی -->
<template>
    <div class="sp">
        <h2 class="sp-title">نمونه ۳ — چیدمان‌های جدولی (۱۰ سؤال در هر مرحله)</h2>
        <p class="sp-note">
            <code>per-page="5"</code> روی کل آزمون (۲۰ سؤال = ۴ مرحله): ماتریس سطر×ستون، مقیاس لیکرت،
            رتبه‌بندی کشیدنی و انتخاب چندتایی جدولی. خطای ماتریس هم بررسی می‌شود
            (<code>required</code> روی ماتریس = همه‌ی سطرها باید پاسخ بگیرند).
        </p>

        <KAssessmentWizard :assessment="exam" :per-page="5" v-model="answers" @submit="onSubmit" />

        <h3 class="sp-sub">خروجی نهایی</h3>
        <pre class="ex-out">{{ submitted }}</pre>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentWizard from '../../ui-kit/components/KAssessmentWizard.vue'
import { choiceFillers, scaleFillers } from './_assessmentFixtures'
import type { Assessment, AssessmentAnswers } from '../../ui-kit/types/assessment'

const answers = ref<AssessmentAnswers>({})
const submitted = ref<any>(null)
const onSubmit = (payload: any) => { submitted.value = payload.list }

const likert = (minLabel: string, maxLabel: string) => ({
    kind: 'scale' as const,
    min: 1,
    max: 5,
    minLabel,
    maxLabel,
})

const exam: Assessment = {
    info: {
        title: 'نظرسنجی و سنجش مهارت',
        description: 'ترکیبی از جدول ماتریس، مقیاس‌ها و رتبه‌بندی.',
    },
    sections: [
        {
            id: 'matrix',
            title: 'بخش ۱ — جدول ارزیابی',
            description: 'برای هر مورد یک گزینه انتخاب کنید.',
            questions: [
                {
                    id: 'm1',
                    title: 'کیفیت هر بخش را ارزیابی کنید.',
                    input: {
                        kind: 'matrix',
                        matrixRows: [
                            { id: 'content', label: 'محتوای درسی', description: 'دقت و به‌روز بودن' },
                            { id: 'teacher', label: 'تدریس' },
                            { id: 'support', label: 'پشتیبانی' },
                            { id: 'price', label: 'قیمت' },
                        ],
                        matrixColumns: [
                            { id: '1', value: 1, label: 'ضعیف' },
                            { id: '2', value: 2, label: 'متوسط' },
                            { id: '3', value: 3, label: 'خوب' },
                            { id: '4', value: 4, label: 'عالی' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                },
                {
                    id: 'm2',
                    title: 'کدام گزینه‌ها را در کلاس دیده‌اید؟ (چند انتخابی)',
                    input: {
                        kind: 'choice',
                        multiple: true,
                        layout: 'grid',
                        columns: 3,
                        options: [
                            { id: 'quiz', label: 'آزمونک' },
                            { id: 'project', label: 'پروژه' },
                            { id: 'video', label: 'ویدیو' },
                        ],
                    },
                    scoring: [{ points: 1, perOption: true }],
                },
                {
                    id: 'm3',
                    title: 'مهارت هر عضو تیم را در پروژهٔ آخر ارزیابی کنید.',
                    input: {
                        kind: 'matrix',
                        matrixRows: [
                            { id: 'plan', label: 'برنامه‌ریزی' },
                            { id: 'code', label: 'کدنویسی' },
                            { id: 'test', label: 'تست' },
                        ],
                        matrixColumns: [
                            { id: '1', value: 1, label: '۱' },
                            { id: '2', value: 2, label: '۲' },
                            { id: '3', value: 3, label: '۳' },
                            { id: '4', value: 4, label: '۴' },
                            { id: '5', value: 5, label: '۵' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'm4',
                    title: 'کدام ابزارها را در پروژه استفاده کردید؟ (چندتایی، pills)',
                    input: {
                        kind: 'choice',
                        multiple: true,
                        layout: 'pills',
                        options: [
                            { id: 'git', label: 'Git' },
                            { id: 'ci', label: 'CI/CD' },
                            { id: 'docker', label: 'Docker' },
                            { id: 'k8s', label: 'Kubernetes' },
                            { id: 'redis', label: 'Redis' },
                        ],
                    },
                    scoring: [{ points: 1, perOption: true }],
                },
                ...choiceFillers('m', 6, 5),
            ],
        },
        {
            id: 'scales',
            title: 'بخش ۲ — مقیاس‌ها و رتبه‌بندی',
            questions: [
                { id: 's1', title: 'چقدر با مباحث آمار آشنا هستید؟', input: likert('هیچ', 'کامل'), scoring: [{ points: 1 }] },
                { id: 's2', title: 'چقدر احتمال دارد این دوره را معرفی کنید؟', input: likert('هرگز', 'قطعاً'), scoring: [{ points: 1 }] },
                ...scaleFillers('sc', 5, 3),
                {
                    id: 's3',
                    title: 'اولویت‌هایتان را مرتب کنید (بالا = مهم‌تر).',
                    input: {
                        kind: 'ranking',
                        options: [
                            { id: 'speed', label: 'سرعت یادگیری' },
                            { id: 'depth', label: 'عمق مطالب' },
                            { id: 'price', label: 'هزینه' },
                            { id: 'support', label: 'پشتیبانی' },
                        ],
                    },
                    scoring: [{ points: 1 }],
                },
                {
                    id: 's4',
                    title: 'ساعت‌های آموزش را مرتب کنید (بالا = بیشترین اهمیت).',
                    input: {
                        kind: 'ranking',
                        options: [
                            { id: 'morning', label: 'صبح' },
                            { id: 'noon', label: 'ظهر' },
                            { id: 'evening', label: 'عصر' },
                            { id: 'night', label: 'شب' },
                        ],
                    },
                },
                ...choiceFillers('s', 2, 5),
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
