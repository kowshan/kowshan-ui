<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentInput</h2>
        <p class="sp-note">
            بخش پاسخ یک سؤال — نه نوع: <code>text / number / choice / scale / matrix / ranking / upload / date / time</code>.
            هر نوع به کامپوننت موجود کیت واگذار می‌شود، پس همان تم، همان دسترس‌پذیری و همان اعتبارسنجی را دارد.
            با اسلات <code>#input-&lt;kind&gt;</code> می‌توانید ویجت خودتان را جایگزین کنید (مثلاً ضبط صدا).
        </p>

        <h3 class="sp-sub">متنی — یک‌خطی / چندخطی / با محدودیت طول</h3>
        <div class="sp-card">
            <KAssessmentInput :input="{ kind: 'text', placeholder: 'پاسخ کوتاه' }" :model-value="a.text" @update:model-value="a.text = $event" />
            <KAssessmentInput :input="{ kind: 'text', multiline: true, rows: 4, placeholder: 'پاسخ تشریحی…' }" v-model="a.long" />
            <KAssessmentInput :input="{ kind: 'text', length: { min: 5, max: 12 } }" v-model="a.len" />
        </div>

        <h3 class="sp-sub">عددی — با بازه و واحد</h3>
        <div class="sp-card">
            <KAssessmentInput :input="{ kind: 'number', min: 0, max: 100, step: 5, suffix: 'درصد' }" v-model="a.number" />
            <KAssessmentInput :input="{ kind: 'number', min: -10, max: 10, step: 0.5, precision: 1 }" v-model="a.decimal" />
        </div>

        <h3 class="sp-sub">انتخابی — تکی / چندتایی / گرید تصویری</h3>
        <div class="sp-card">
            <KAssessmentInput :input="choiceInput" v-model="a.choice" />
            <KAssessmentInput :input="multiChoiceInput" v-model="a.multi" />
            <KAssessmentInput :input="imageChoiceInput" v-model="a.imageChoice" />
        </div>

        <h3 class="sp-sub">مقیاس — لیکرت ۱ تا ۵ و ۰ تا ۱۰</h3>
        <div class="sp-card">
            <KAssessmentInput :input="likert" v-model="a.likert" />
            <KAssessmentInput :input="{ kind: 'scale', min: 0, max: 10, minLabel: 'هیچ', maxLabel: 'همیشه' }" v-model="a.nps" />
        </div>

        <h3 class="sp-sub">ماتریس — سطر × ستون (رادیو در هر سطر)</h3>
        <div class="sp-card">
            <KAssessmentInput :input="matrix" v-model="a.matrix" />
        </div>

        <h3 class="sp-sub">رتبه‌بندی — با کشیدن و رها کردن</h3>
        <div class="sp-card">
            <KAssessmentInput :input="ranking" v-model="a.ranking" />
            <p class="sp-note">مقدار: {{ a.ranking || '—' }}</p>
        </div>

        <h3 class="sp-sub">بارگذاری فایل — تصویر و صدا (پاسخ صوتی)</h3>
        <div class="sp-card">
            <KAssessmentInput :input="{ kind: 'upload', accept: 'image/*', maxCount: 2, maxSize: 2 * 1024 * 1024 }" v-model="a.file" />
            <KAssessmentInput :input="{ kind: 'upload', accept: 'audio/*', maxCount: 1 }" v-model="a.voice">
                <template #input-upload="{ input }">
                    <div class="sp-note">
                        جایگزین سفارشی برای <code>{{ input.accept }}</code> — اینجا می‌توانید ضبط صدا را وصل کنید.
                    </div>
                    <KFileInput v-model="a.voice" accept="audio/*" />
                </template>
            </KAssessmentInput>
        </div>

        <h3 class="sp-sub">تاریخ و ساعت (تقویم جلالی)</h3>
        <div class="sp-card">
            <KAssessmentInput :input="{ kind: 'date' }" v-model="a.date" />
            <KAssessmentInput :input="{ kind: 'time', withSeconds: false }" v-model="a.time" />
            <KAssessmentInput :input="{ kind: 'time', withSeconds: true }" v-model="a.timeSec" />
        </div>

        <h3 class="sp-sub">حالت غیرفعال</h3>
        <div class="sp-card">
            <KAssessmentInput :input="choiceInput" v-model="a.choice" disabled />
            <KAssessmentInput :input="{ kind: 'text' }" model-value="پاسخ قفل‌شده" disabled />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import KAssessmentInput from '../../ui-kit/components/KAssessmentInput.vue'
import KFileInput from '../../ui-kit/wrappers/KFileInput.vue'
import type { QuestionInput } from '../../ui-kit/types/assessment'

const a = reactive<Record<string, any>>({
    text: '',
    long: '',
    len: '',
    number: 50,
    decimal: 0.5,
    choice: null,
    multi: [],
    imageChoice: null,
    likert: 3,
    nps: 5,
    matrix: {},
    ranking: [],
    file: null,
    voice: null,
    date: '',
    time: null,
    timeSec: null,
})

const choiceInput: QuestionInput = {
    kind: 'choice',
    options: [
        { id: 'a', label: 'گزینه اول' },
        { id: 'b', label: 'گزینه دوم' },
        { id: 'c', label: 'گزینه سوم', description: 'با توضیح' },
    ],
}

const multiChoiceInput: QuestionInput = { ...choiceInput, multiple: true, layout: 'grid', columns: 2 }

const imageChoiceInput: QuestionInput = {
    kind: 'choice',
    layout: 'grid',
    columns: 3,
    options: [
        { id: '1', kind: 'image', media: 'https://picsum.photos/seed/ai-1/400/300', label: 'شکل ۱' },
        { id: '2', kind: 'image', media: 'https://picsum.photos/seed/ai-2/400/300', label: 'شکل ۲' },
        { id: '3', kind: 'image', media: 'https://picsum.photos/seed/ai-3/400/300', label: 'شکل ۳' },
    ],
}

const likert: QuestionInput = {
    kind: 'scale',
    min: 1,
    max: 5,
    minLabel: 'کاملاً مخالفم',
    maxLabel: 'کاملاً موافقم',
}

const matrix: QuestionInput = {
    kind: 'matrix',
    matrixRows: [
        { id: 'r1', label: 'کیفیت محتوا' },
        { id: 'r2', label: 'سرعت پاسخ‌گویی', description: 'پشتیبانی' },
        { id: 'r3', label: 'قیمت' },
    ],
    matrixColumns: [
        { id: '1', value: 1, label: 'ضعیف' },
        { id: '2', value: 2, label: 'متوسط' },
        { id: '3', value: 3, label: 'خوب' },
        { id: '4', value: 4, label: 'عالی' },
    ],
}

const ranking: QuestionInput = {
    kind: 'ranking',
    options: [
        { id: 'p1', label: 'سرعت' },
        { id: 'p2', label: 'دقت' },
        { id: 'p3', label: 'قیمت' },
        { id: 'p4', label: 'پشتیبانی' },
    ],
}
</script>

<style scoped>
.sp-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
</style>
