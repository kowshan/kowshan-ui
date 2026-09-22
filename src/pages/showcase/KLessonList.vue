<template>
    <div class="sp">
        <h2 class="sp-title">KLessonList</h2>

        <h3 class="sp-sub">پایه (با پیشرفت و درس جاری)</h3>
        <div class="sp-card">
            <KLessonList :sections="sections" :current-id="'l3'" @select="onSelect" />
            <div class="sp-vmodel">انتخاب‌شده: {{ selected }}</div>
        </div>

        <h3 class="sp-sub">عنوان سفارشی</h3>
        <div class="sp-card">
            <KLessonList :sections="sections" header-text="محتوای دوره Vue پیشرفته" @select="onSelect" />
        </div>

        <h3 class="sp-sub">بدون نوار پیشرفت</h3>
        <div class="sp-card">
            <KLessonList :sections="sections" :show-progress="false" @select="onSelect" />
        </div>

        <h3 class="sp-sub">همه انجام‌شده</h3>
        <div class="sp-card">
            <KLessonList :sections="completed" @select="onSelect" />
        </div>

        <h3 class="sp-sub">درس قفل‌شده و انواع محتوا</h3>
        <div class="sp-card">
            <KLessonList :sections="mixed" @select="onSelect" />
        </div>

        <h3 class="sp-sub">فقط یک بخش (تک‌فصل)</h3>
        <div class="sp-card">
            <KLessonList :sections="[sections[0]]" @select="onSelect" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KLessonList, { type LessonSection } from '../../ui-kit/components/KLessonList.vue'

const selected = ref('—')
const onSelect = (lesson: { title: string }) => { selected.value = lesson.title }

const sections: LessonSection[] = [
    {
        title: 'فصل ۱ — مقدمه',
        lessons: [
            { id: 'l1', title: 'معرفی دوره', type: 'video', duration: '۰۸:۳۰', done: true },
            { id: 'l2', title: 'نصب و راه‌اندازی', type: 'video', duration: '۱۵:۲۰', done: true },
            { id: 'l3', title: 'آزمون فصل اول', type: 'quiz', duration: '۱۰ دقیقه' },
        ],
    },
    {
        title: 'فصل ۲ — کامپوننت‌ها',
        lessons: [
            { id: 'l4', title: 'پراپ‌ها و رویدادها', type: 'video', duration: '۲۲:۱۰' },
            { id: 'l5', title: 'جزوه الگوها', type: 'doc', duration: '۱۲ صفحه' },
            { id: 'l6', title: 'تمرین عملی', type: 'quiz', duration: '۲۰ دقیقه', locked: true },
        ],
    },
    {
        title: 'فصل ۳ — پیشرفته',
        lessons: [
            { id: 'l7', title: 'ترکیب Composables', type: 'video', duration: '۱۸:۴۵', locked: true },
            { id: 'l8', title: 'بهینه‌سازی عملکرد', type: 'video', duration: '۲۵:۰۰', locked: true },
        ],
    },
]

const completed: LessonSection[] = [
    {
        title: 'فصل ۱ — مقدمه',
        lessons: [
            { id: 'c1', title: 'معرفی دوره', type: 'video', duration: '۰۸:۳۰', done: true },
            { id: 'c2', title: 'نصب و راه‌اندازی', type: 'video', duration: '۱۵:۲۰', done: true },
            { id: 'c3', title: 'آزمون فصل اول', type: 'quiz', duration: '۱۰ دقیقه', done: true },
        ],
    },
]

const mixed: LessonSection[] = [
    {
        title: 'محتوای تکمیلی',
        lessons: [
            { id: 'm1', title: 'ویدیو بدون پیشرفت', type: 'video', duration: '۰۵:۰۰' },
            { id: 'm2', title: 'جزوه PDF', type: 'doc', duration: '۸ صفحه' },
            { id: 'm3', title: 'آزمون بدون مدت', type: 'quiz' },
            { id: 'm4', title: 'جلسه زنده (قفل)', type: 'video', duration: '۶۰:۰۰', locked: true },
        ],
    },
]
</script>
