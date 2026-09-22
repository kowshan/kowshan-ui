<template>
    <div class="sp">
        <h2 class="sp-title">KGanttChart</h2>

        <h3 class="sp-sub">کارت کامل (شغل + مشتری)</h3>
        <div class="sp-card">
            <KGanttChart :career="fullCareer" :customer="fullCustomer" />
            <div class="sp-vmodel">cell-click: {{ lastCell }}</div>
        </div>

        <h3 class="sp-sub">فقط شغل + شماره اولویت</h3>
        <div class="sp-card">
            <KGanttChart :career="careerOnly" show-priority />
        </div>

        <h3 class="sp-sub">حالت inline (بدون قاب)</h3>
        <KGanttChart :career="careerOnly" inline />

        <h3 class="sp-sub">عنوان سفارشی + ستون محدود</h3>
        <div class="sp-card">
            <KGanttChart title="تحلیل تطابق کاندیدا" :career="fullCareer" :customer="fullCustomer" :columns="5" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KGanttChart, { type GanttCareerData, type GanttCustomerData } from '../../ui-kit/components/KGanttChart.vue'

const lastCell = ref('—')

const fullCareer: GanttCareerData = {
    skills: [
        { id: 1, title: 'کار تیمی', required: 4, customer: 3 },
        { id: 2, title: 'مدیریت زمان', required: 3, customer: 2 },
        { id: 3, title: 'مذاکره', required: 5, customer: 5 },
        { id: 4, title: 'ارائه', required: 2, customer: 1 },
    ],
    knowledges: [
        { id: 5, title: 'بازاریابی دیجیتال', required: 3, customer: 2 },
        { id: 6, title: 'اصول فروش', required: 4, customer: 4 },
        { id: 7, title: 'رفتار مشتری', required: 2, customer: 1 },
    ],
    characters: [
        { id: 8, title: 'درجه همدلی', required: 5, customer: 3 },
        { id: 9, title: 'درجه انعطاف‌پذیری', required: 4, customer: 3 },
    ],
    abilities: [
        { id: 10, title: 'توان تحلیل', required: 3, customer: 2 },
        { id: 11, title: 'توان برنامه‌ریزی', required: 2, customer: 2 },
    ],
}

const fullCustomer: GanttCustomerData = fullCareer

const careerOnly: GanttCareerData = {
    skills: [
        { id: 1, title: 'جاوااسکریپت', required: 4, customer: 0 },
        { id: 2, title: 'TypeScript', required: 3, customer: 0 },
        { id: 3, title: 'Vue', required: 5, customer: 0 },
        { id: 4, title: 'CSS', required: 3, customer: 0 },
        { id: 5, title: 'تست‌نویسی', required: 2, customer: 0 },
    ],
    knowledges: [
        { id: 6, title: 'الگوهای طراحی', required: 2, customer: 0 },
        { id: 7, title: 'معماری نرم‌افزار', required: 3, customer: 0 },
    ],
    characters: [
        { id: 8, title: 'درجه کنجکاوی', required: 4, customer: 0 },
    ],
    abilities: [
        { id: 9, title: 'توان یادگیری', required: 5, customer: 0 },
    ],
}
</script>
