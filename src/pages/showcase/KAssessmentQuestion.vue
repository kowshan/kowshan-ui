<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentQuestion</h2>
        <p class="sp-note">
            یک سؤال کامل: شماره → عنوان → راهنما → بلوک‌های محتوا → ورودی پاسخ → خطا → توضیح
            (بعد از <code>revealed</code>). کامپوننت خالص نمایشی است: مقدار و خطا را از بیرون می‌گیرد.
        </p>

        <h3 class="sp-sub">۱) سؤال متنی ساده + الزامی</h3>
        <KAssessmentQuestion
            :question="simple"
            :model-value="answers.simple"
            :error="errors.simple"
            required
            @update:model-value="answer('simple', $event)"
        />

        <h3 class="sp-sub">۲) با تصویر صورت سؤال و پاسخ عددی</h3>
        <KAssessmentQuestion
            :question="withImage"
            :model-value="answers.image"
            @update:model-value="answer('image', $event)"
        />

        <h3 class="sp-sub">۳) چندگزینه‌ای با امتیاز و توضیح (revealed)</h3>
        <KAssessmentQuestion
            :question="multi"
            :model-value="answers.multi"
            :revealed="true"
            @update:model-value="answer('multi', $event)"
            />

        <h3 class="sp-sub">۴) خطای اعتبارسنجی + مقدار پیش‌فرض</h3>
        <KAssessmentQuestion
            :question="ranged"
            :model-value="answers.range"
            error="مقدار باید بین ۱۰ و ۹۰ باشد."
            :required="true"
            @update:model-value="answer('range', $event)"
        />

        <h3 class="sp-sub">۵) غیرفعال (در حال ارسال)</h3>
        <KAssessmentQuestion :question="simple" :model-value="'پاسخ قفل‌شده'" disabled />

        <h3 class="sp-sub">مقدارهای فعلی</h3>
        <pre class="sp-pre">{{ answers }}</pre>
        <KButton text="پاک کردن" border="solid" @click="clear" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import KAssessmentQuestion from '../../ui-kit/components/KAssessmentQuestion.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { AssessmentQuestion } from '../../ui-kit/types/assessment'

const answers = reactive<Record<string, any>>({ simple: '', image: '', multi: [], range: 5 })
const errors = reactive<Record<string, string | null>>({})

const answer = (key: string, value: any) => {
    answers[key] = value
    errors[key] = null
}

const clear = () => {
    answers.simple = ''
    answers.image = ''
    answers.multi = []
    answers.range = 5
}

const simple: AssessmentQuestion = {
    id: 'q-simple',
    number: '۱',
    title: 'پایتخت ایران کجاست؟',
    hint: 'پاسخ کوتاه بنویسید.',
    input: { kind: 'text', placeholder: 'نام شهر…' },
    validation: [{ kind: 'required' }],
}

const withImage: AssessmentQuestion = {
    id: 'q-image',
    number: '۲',
    title: 'مساحت شکل زیر چند سانتی‌متر مربع است؟',
    contents: [
        { kind: 'text', text: 'طول ۸ و عرض ۵ سانتی‌متر است.' },
        { kind: 'image', src: 'https://picsum.photos/seed/aq-1/700/320', caption: 'شکل نمونه' },
    ],
    input: { kind: 'number', min: 0, max: 200, suffix: 'cm²' },
    validation: [{ kind: 'required' }, { kind: 'range', min: 1, max: 200 }],
    scoring: [{ points: 2 }],
}

const multi: AssessmentQuestion = {
    id: 'q-multi',
    number: '۳',
    title: 'کدام موارد از زبان‌های برنامه‌نویسی هستند؟',
    input: {
        kind: 'choice',
        multiple: true,
        layout: 'grid',
        columns: 2,
        options: [
            { id: 'js', label: 'JavaScript' },
            { id: 'html', label: 'HTML' },
            { id: 'py', label: 'Python' },
            { id: 'css', label: 'CSS' },
        ],
    },
    scoring: [{ points: 1, perOption: true }],
    explanation: 'JavaScript و Python زبان برنامه‌نویسی‌اند؛ HTML و CSS زبان نشانه‌گذاری هستند.',
}

const ranged: AssessmentQuestion = {
    id: 'q-range',
    number: '۴',
    title: 'سن شما چند سال است؟',
    input: { kind: 'number', min: 10, max: 90, suffix: 'سال' },
    validation: [{ kind: 'required' }, { kind: 'range', min: 10, max: 90 }],
}
</script>

<style scoped>
.sp-pre {
    margin: 0;
    padding: 12px;
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    color: var(--k-text-secondary);
    font-size: 0.72rem;
    direction: ltr;
    overflow: auto;
}
</style>
