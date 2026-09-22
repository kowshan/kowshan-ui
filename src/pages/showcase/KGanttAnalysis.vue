<template>
    <div class="sp">
        <h2 class="sp-title">KGanttAnalysis</h2>

        <h3 class="sp-sub">پایه (دو ستون شغل + مشتری)</h3>
        <div class="sp-card">
            <KGanttAnalysis :career="career" :customer="customer" />
        </div>

        <h3 class="sp-sub">فقط شغل (تک‌ستونه)</h3>
        <div class="sp-card">
            <KGanttAnalysis :career="career" />
        </div>

        <h3 class="sp-sub">عنوان سفارشی</h3>
        <div class="sp-card">
            <KGanttAnalysis title="شکاف مهارتی تیم فروش" :career="career" :customer="customer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KGanttAnalysis from '../../ui-kit/components/KGanttAnalysis.vue'
import type { GanttCareerData, GanttCustomerData } from '../../ui-kit/components/KGanttChart.vue'

const career: GanttCareerData = {
    skills: [
        { id: 1, title: 'تحلیل داده', required: 5, customer: 3 },
        { id: 2, title: 'گزارش‌سازی', required: 4, customer: 4 },
        { id: 3, title: 'SQL', required: 4, customer: 2 },
        { id: 4, title: 'Power BI', required: 3, customer: 3 },
    ],
    knowledges: [
        { id: 5, title: 'آمار توصیفی', required: 3, customer: 1 },
        { id: 6, title: 'مدل‌سازی داده', required: 2, customer: 2 },
    ],
    characters: [
        { id: 7, title: 'درجه دقت', required: 5, customer: 4 },
        { id: 8, title: 'درجه صبر', required: 3, customer: 5 },
    ],
    abilities: [
        { id: 9, title: 'حل مسئله', required: 5, customer: 4 },
    ],
}

const customer: GanttCustomerData = career
</script>
