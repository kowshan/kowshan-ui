<!-- showcase/ExampleAssessment5.vue — آزمون بلند: ۵ سؤال در هر صفحه + list/multiselect -->
<template>
    <div class="sp">
        <h2 class="sp-title">نمونه ۵ — آزمون بلند (۳۰ سؤال، ۱۰ در هر صفحه)</h2>
        <p class="sp-note">
            حالت واقعی: ده‌ها سؤال، صفحه‌بندی <code>per-page="10"</code>، لیست بلند کشور/شهر با
            <code>select</code> و <code>multiselect</code>، و اعتبارسنجی: چند سؤال را خالی بگذارید و
            «ثبت» بزنید — اسکرول می‌کند به اولین سؤال ناقص و همه‌ی خطاها را نشان می‌دهد.
            در پایان، <code>list</code> مرتب پاسخ‌ها آماده‌ی مپ کردن است.
        </p>

        <KAssessmentWizard
            :assessment="exam"
            :per-page="10"
            v-model="answers"
            :show-stepper="false"
            @submit="onSubmit"
        />

        <h3 class="sp-sub">پاسخ‌های ثبت‌شده ({{ Object.keys(submitted).length || 0 }} سؤال)</h3>
        <pre class="ex-out">{{ submittedPreview }}</pre>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KAssessmentWizard from '../../ui-kit/components/KAssessmentWizard.vue'
import { choiceFillers, countries, interests } from './_assessmentFixtures'
import type { Assessment, AssessmentAnswers } from '../../ui-kit/types/assessment'

const answers = ref<AssessmentAnswers>({})
const submittedList = ref<any[]>([])

const onSubmit = (payload: any) => { submittedList.value = payload.list }

const submitted = computed(() =>
    Object.fromEntries(submittedList.value.filter(a => a.value != null).map(a => [a.questionId, a.value]))
)

const submittedPreview = computed(() => JSON.stringify(submitted.value, null, 2))

/* 30 questions: the first 10 are the "real" ones, the rest generated so the
   pager, the stepper-less flow and the scroll-to-error path all get exercised. */
const generated = choiceFillers('auto', 20, 11)

const exam: Assessment = {
    info: {
        title: 'آزمون جامع پذیرش',
        description: '۳۰ سؤال، ۱۰ سؤال در هر صفحه. بدون stepper — فقط نوار پیشرفت و دکمه‌ها.',
        durationMinutes: 45,
        passScore: 15,
        meta: [{ label: 'نمره هر سؤال', value: '۱' }],
    },
    instructions: {
        title: 'دستورالعمل',
        items: [
            'پاسخ‌ها به‌صورت خودکار ذخیره می‌شوند؛ می‌توانید بین صفحات جابه‌جا شوید.',
            { kind: 'link', url: 'https://example.com/faq', title: 'سؤالات متداول آزمون' },
        ],
        agreement: { label: 'می‌پذیرم که پس از ثبت، امکان ویرایش نباشد.' },
    },
    sections: [
        {
            id: 'identity',
            title: 'اطلاعات شناسنامه‌ای',
            questions: [
                {
                    id: 'country',
                    number: '۱',
                    title: 'کشور محل سکونت',
                    hint: 'لیست کامل ۶۰ کشور — با جستجو سریع پیدا می‌شود.',
                    input: { kind: 'select', options: countries, placeholder: 'انتخاب کشور…' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'interests',
                    number: '۲',
                    title: 'حوزه‌های مورد علاقه (چندتایی)',
                    input: { kind: 'multiselect', options: interests, placeholder: 'انتخاب کنید…' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'phone',
                    number: '۳',
                    title: 'شماره موبایل',
                    input: { kind: 'text', placeholder: '09…' },
                    validation: [{ kind: 'required' }, { kind: 'format', format: 'mobile' }],
                },
                {
                    id: 'postal',
                    number: '۴',
                    title: 'کد پستی (اختیاری)',
                    input: { kind: 'text', placeholder: '۱۰ رقم' },
                    validation: [{ kind: 'format', format: 'postalCode' }],
                },
                {
                    id: 'birth',
                    number: '۵',
                    title: 'تاریخ تولد',
                    input: { kind: 'date' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'start-time',
                    number: '۶',
                    title: 'ساعت مناسب برای تماس',
                    input: { kind: 'time' },
                },
                {
                    id: 'score',
                    number: '۷',
                    title: 'معدل دیپلم',
                    input: { kind: 'number', min: 0, max: 20, step: 0.25, precision: 2, suffix: 'از ۲۰' },
                    validation: [{ kind: 'range', min: 0, max: 20 }],
                },
                {
                    id: 'bio',
                    number: '۸',
                    title: 'معرفی کوتاه',
                    input: { kind: 'text', multiline: true, rows: 4, placeholder: 'چند خط درباره خودتان…', length: { max: 300 } },
                    validation: [{ kind: 'length', max: 300 }],
                },
                {
                    id: 'level',
                    number: '۹',
                    title: 'سطح فعلی شما',
                    input: {
                        kind: 'choice',
                        layout: 'pills',
                        options: [
                            { id: 'beginner', label: 'مقدماتی' },
                            { id: 'mid', label: 'متوسط' },
                            { id: 'advanced', label: 'پیشرفته' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'cv',
                    number: '۱۰',
                    title: 'رزومه (PDF)',
                    input: { kind: 'upload', accept: 'application/pdf', maxCount: 1, maxSize: 4 * 1024 * 1024 },
                    validation: [{ kind: 'file', accept: 'pdf', maxSize: 4 * 1024 * 1024 }],
                },
            ],
        },
        { id: 'knowledge', title: 'بخش دانشی (۲۰ سؤال)', questions: generated },
    ],
    bands: [
        { minPercent: 80, message: 'قبول قطعی — به مرحله مصاحبه دعوت می‌شوید.' },
        { minPercent: 50, message: 'قبول مشروط.' },
        { minPercent: 0, message: 'نیاز به مطالعه بیشتر.' },
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
    max-height: 260px;
    overflow: auto;
}
</style>
