<template>
    <div class="sp">
        <h2 class="sp-title">KPillTabs</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KPillTabs v-model="tab1" :tabs="basicTabs" />
            <div class="sp-vmodel" style="margin-top: 12px;">تب فعال: {{ tab1 }}</div>
        </div>

        <h3 class="sp-sub">با آیکون</h3>
        <div class="sp-card">
            <KPillTabs v-model="tab2" :tabs="iconTabs" />
        </div>

        <h3 class="sp-sub">با شمارنده</h3>
        <div class="sp-card">
            <KPillTabs v-model="tab3" :tabs="countTabs" />
        </div>

        <h3 class="sp-sub">آیکون + شمارنده + تب غیرفعال</h3>
        <div class="sp-card">
            <KPillTabs v-model="tab4" :tabs="fullTabs" />
        </div>

        <h3 class="sp-sub">شمارنده صفر و زیاد</h3>
        <div class="sp-card">
            <KPillTabs v-model="tab5" :tabs="edgeTabs" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, GraduationCap, LayoutGrid, Users, Wallet } from 'lucide-vue-next'
import KPillTabs from '../../ui-kit/components/KPillTabs.vue'

const basicTabs = [
    { id: 'all', label: 'همه' },
    { id: 'active', label: 'فعال' },
    { id: 'archived', label: 'بایگانی' },
]

const iconTabs = [
    { id: 'grid', label: 'شبکه‌ای', icon: LayoutGrid },
    { id: 'courses', label: 'دوره‌ها', icon: BookOpen },
    { id: 'students', label: 'دانش‌آموزان', icon: Users },
]

const countTabs = [
    { id: 'pending', label: 'در انتظار', count: 12 },
    { id: 'paid', label: 'پرداخت‌شده', count: 148 },
    { id: 'failed', label: 'ناموفق', count: 3 },
]

const fullTabs = [
    { id: 'overview', label: 'نمای کل', icon: LayoutGrid },
    { id: 'enrolled', label: 'ثبت‌نام‌شده', icon: GraduationCap, count: 24 },
    { id: 'finance', label: 'مالی', icon: Wallet, count: 8 },
    { id: 'staff', label: 'پرسنل', icon: Users, disabled: true },
]

const edgeTabs = [
    { id: 'zero', label: 'خالی', count: 0 },
    { id: 'many', label: 'پرترافیک', count: 1250 },
    { id: 'none', label: 'بدون شمارنده' },
]

const tab1 = ref('all')
const tab2 = ref('courses')
const tab3 = ref('paid')
const tab4 = ref('overview')
const tab5 = ref('many')
</script>
