<!-- showcase/ExampleAssessment1.vue — آزمون عمومی: متنی، انتخابی، عددی + اعتبارسنجی زنده -->
<template>
    <div class="sp">
        <h2 class="sp-title">نمونه ۱ — آزمون عمومی (۱۰ سؤال در هر مرحله)</h2>
        <p class="sp-note">
            شکل واقعی یک آزمون: <code>per-page="10"</code> روی کل آزمون (۲۰ سؤال = ۲ مرحله).
            متن، عدد، تاریخ، ساعت، <code>select</code>/<code>multiselect</code> از لیست بلند،
            و اعتبارسنجی زنده (<code>format: url / email / mobile</code>) که تا اصلاح نشود دکمه «بعدی» را
            غیرفعال نگه می‌دارد. سؤال‌های ناقص هنگام «بعدی» مشخص می‌شوند و صفحه به آن‌ها اسکرول می‌کند.
            استپر بالا فقط وضعیت است — قابل کلیک نیست.
        </p>

        <KAssessmentWizard
            :assessment="exam"
            :per-page="10"
            v-model="answers"
            @submit="onSubmit"
        />

        <h3 class="sp-sub">پاسخ‌های لحظه‌ای (v-model)</h3>
        <pre class="ex-out">{{ answers }}</pre>

        <h3 class="sp-sub">خروجی نهایی <code>list</code> (همان چیزی که به بک‌اند می‌دهید)</h3>
        <pre class="ex-out">{{ submitted }}</pre>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentWizard from '../../ui-kit/components/KAssessmentWizard.vue'
import { choiceFillers, countries, interests } from './_assessmentFixtures'
import type { Assessment, AssessmentAnswers } from '../../ui-kit/types/assessment'

const answers = ref<AssessmentAnswers>({})
const submitted = ref<any>(null)

const onSubmit = (payload: any) => { submitted.value = payload.list }

const exam: Assessment = {
    info: {
        title: 'آزمون عمومی ثبت‌نام',
        description: 'اطلاعات پایه و دو سؤال دانشی — نمونه‌ی کوتاه برای تست جریان کامل.',
        passScore: 3,
        meta: [{ label: 'زمان', value: 'نامحدود' }],
    },
    instructions: {
        title: 'راهنمای کوتاه',
        items: ['هر صفحه دو سؤال دارد.', 'می‌توانید به مرحله قبل برگردید.'],
        agreement: { label: 'با شرایط آزمون موافقم.' },
    },
    sections: [
        {
            id: 'base',
            title: 'اطلاعات پایه',
            questions: [
                {
                    id: 'name',
                    title: 'نام و نام خانوادگی',
                    input: { kind: 'text', placeholder: 'مثلاً سارا محمدی' },
                    validation: [{ kind: 'required' }, { kind: 'length', min: 3, max: 60 }],
                },
                {
                    id: 'email',
                    title: 'ایمیل',
                    hint: 'نتیجه آزمون به این ایمیل ارسال می‌شود.',
                    input: { kind: 'text', placeholder: 'you@example.com' },
                    // LIVE rule: blocks «بعدی» until it looks like an email
                    validation: [{ kind: 'required' }, { kind: 'format', format: 'email' }],
                },
                {
                    id: 'site',
                    title: 'وب‌سایت یا شبکه اجتماعی (اختیاری)',
                    input: { kind: 'text', placeholder: 'https://…' },
                    validation: [{ kind: 'format', format: 'url' }],
                },
                {
                    id: 'age',
                    title: 'سن',
                    input: { kind: 'number', min: 10, max: 90, suffix: 'سال' },
                    validation: [{ kind: 'range', min: 10, max: 90 }],
                },
                {
                    id: 'mobile',
                    title: 'شماره موبایل',
                    input: { kind: 'text', placeholder: '09…' },
                    validation: [{ kind: 'required' }, { kind: 'format', format: 'mobile' }],
                },
                {
                    id: 'birth',
                    title: 'تاریخ تولد',
                    input: { kind: 'date' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'call-time',
                    title: 'ساعت مناسب برای تماس',
                    hint: 'اختیاری — بعداً هم می‌توانید تغییر دهید.',
                    input: { kind: 'time' },
                },
                {
                    id: 'city',
                    title: 'شهر محل سکونت',
                    hint: 'لیست بلند ۶۰ کشور — با جستجو سریع پیدا می‌شود.',
                    input: { kind: 'select', options: countries, placeholder: 'انتخاب کنید…' },
                    validation: [{ kind: 'required' }],
                },
                {
                    id: 'interests',
                    title: 'حوزه‌های مورد علاقه (چندتایی)',
                    input: { kind: 'multiselect', options: interests, placeholder: 'انتخاب کنید…' },
                },
            ],
        },
        {
            id: 'knowledge',
            title: 'بخش دانشی',
            questions: [
                {
                    id: 'k1',
                    title: 'کدام مورد یک زبان برنامه‌نویسی است؟',
                    input: {
                        kind: 'choice',
                        layout: 'pills',
                        options: [
                            { id: 'html', label: 'HTML' },
                            { id: 'python', label: 'Python' },
                            { id: 'css', label: 'CSS' },
                            { id: 'sql', label: 'SQL' },
                        ],
                    },
                    validation: [{ kind: 'required' }],
                    scoring: [{ points: 2 }],
                    explanation: 'Python یک زبان برنامه‌نویسی عمومی است.',
                },
                {
                    id: 'k2',
                    title: 'خروجی ۲ + ۳ × ۴ چند است؟',
                    input: { kind: 'number', min: 0, max: 100 },
                    validation: [{ kind: 'required' }, { kind: 'range', min: 0, max: 100 }],
                    scoring: [{ points: 1 }],
                    explanation: '۳ × ۴ = ۱۲ و ۲ + ۱۲ = ۱۴',
                },
                ...choiceFillers('g', 8, 3),
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
