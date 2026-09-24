<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentResult</h2>
        <p class="sp-note">
            کارنامه: حلقه نمره، بنر قبول/رد، نوار درصد، تفکیک هر بخش و اسلات اکشن‌ها.
            ورودی‌اش یک <code>AssessmentResult</code> است — چه از سرور آمده باشد، چه خروجی
            <code>useAssessment</code>.
        </p>

        <h3 class="sp-sub">قبول — با تفکیک بخش‌ها</h3>
        <KAssessmentResult :result="passResult" :assessment="assessment">
            <template #actions>
                <KButton text="مشاهده پاسخ‌نامه" border="solid" />
                <KButton text="آزمون مجدد" bg-color="var(--k-primary)" text-color="#fff" />
            </template>
        </KAssessmentResult>

        <h3 class="sp-sub">رد — نمره کم، بدون تفکیک</h3>
        <KAssessmentResult :result="failResult" :assessment="assessment" />

        <h3 class="sp-sub">فشرده — فقط هیرو (برای کارت خلاصه)</h3>
        <KAssessmentResult :result="passResult" compact :ring-size="72" />

        <h3 class="sp-sub">بخش‌های بدون امتیاز (سؤالات نمره‌دار نیستند)</h3>
        <KAssessmentResult :result="noScoreResult" />

        <h3 class="sp-sub">درصد صفر و صد</h3>
        <div class="grid-2">
            <KAssessmentResult :result="zeroResult" compact :ring-size="80" />
            <KAssessmentResult :result="fullResult" compact :ring-size="80" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KAssessmentResult from '../../ui-kit/components/KAssessmentResult.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { Assessment, AssessmentResult } from '../../ui-kit/types/assessment'

const assessment: Assessment = {
    info: { title: 'آزمون ریاضی پایه نهم' },
    sections: [],
}

const passResult: AssessmentResult = {
    score: 15,
    maxScore: 18,
    percent: 83,
    passed: true,
    answered: 9,
    total: 10,
    sections: [
        { sectionId: 's1', title: 'بخش اول: جبر', score: 9, maxScore: 10, answered: 4, total: 4 },
        { sectionId: 's2', title: 'بخش دوم: مهارت‌ها', score: 6, maxScore: 8, answered: 5, total: 6 },
    ],
    message: 'عالی بود! آماده‌ی مباحث پیشرفته‌ای.',
}

const failResult: AssessmentResult = {
    score: 4,
    maxScore: 18,
    percent: 22,
    passed: false,
    answered: 7,
    total: 10,
    sections: [
        { sectionId: 's1', title: 'بخش اول: جبر', score: 3, maxScore: 10, answered: 3, total: 4 },
        { sectionId: 's2', title: 'بخش دوم: مهارت‌ها', score: 1, maxScore: 8, answered: 4, total: 6 },
    ],
}

const noScoreResult: AssessmentResult = {
    score: 0,
    maxScore: 0,
    percent: 0,
    passed: false,
    answered: 5,
    total: 5,
    sections: [{ sectionId: 'survey', title: 'نظرسنجی', score: 0, maxScore: 0, answered: 5, total: 5 }],
    message: 'این پرسش‌نامه نمره ندارد و فقط برای بازخورد است.',
}

const zeroResult: AssessmentResult = {
    score: 0, maxScore: 20, percent: 0, passed: false, answered: 0, total: 10, sections: [],
}

const fullResult: AssessmentResult = {
    score: 20, maxScore: 20, percent: 100, passed: true, answered: 10, total: 10, sections: [],
    message: 'نمره کامل!',
}
</script>

<style scoped>
.grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
}
</style>
