<template>
    <div class="sp">
        <h2 class="sp-title">KSidebar</h2>

        <h3 class="sp-sub">پایه — با گروه‌بندی و نشان</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active1" :groups="groups" brand="آکادمی زبان‌سرا" @change="onChange" />
            </div>
            <div class="sp-vmodel" style="margin-top: 12px;">
                فعال: {{ active1 }} — آخرین change: {{ lastChange ?? '—' }}
            </div>
        </div>

        <h3 class="sp-sub">قابل جمع‌شدن (collapsible)</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active2" :groups="groups" brand="پنل مدرس" logo-text="م" :collapsible="true" />
            </div>
            <p class="sp-note">روی آیکون بالای سایدبار بزنید تا جمع شود؛ برچسب‌ها مخفی و فقط آیکون‌ها می‌مانند.</p>
        </div>

        <h3 class="sp-sub">غیرقابل جمع‌شدن</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active3" :groups="groups" brand="پنل ثابت" :collapsible="false" />
            </div>
        </div>

        <h3 class="sp-sub">بدون برند</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active4" :groups="groups" />
            </div>
        </div>

        <h3 class="sp-sub">گروه بدون عنوان + یک آیتم</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active5" :groups="minimalGroups" brand="ساده" />
            </div>
        </div>

        <h3 class="sp-sub">نشان‌های عددی و متنی</h3>
        <div class="sp-card">
            <div class="sb-box">
                <KSidebar v-model="active6" :groups="badgeGroups" brand="پشتیبانی" logo-text="پ" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    BookOpen, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Wallet
} from 'lucide-vue-next'
import KSidebar from '../../ui-kit/components/KSidebar.vue'

const groups = [
    {
        title: 'اصلی',
        items: [
            { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
            { id: 'courses', label: 'دوره‌ها', icon: BookOpen, badge: 12 },
            { id: 'students', label: 'دانش‌آموزان', icon: Users },
            { id: 'finance', label: 'مالی', icon: Wallet, badge: 'جدید' },
        ],
    },
    {
        title: 'ارتباطات',
        items: [
            { id: 'messages', label: 'پیام‌ها', icon: MessageSquare, badge: 3 },
            { id: 'certificates', label: 'گواهی‌ها', icon: GraduationCap },
        ],
    },
    {
        title: 'سیستم',
        items: [
            { id: 'settings', label: 'تنظیمات', icon: Settings },
        ],
    },
]

const minimalGroups = [
    { items: [{ id: 'only', label: 'تنها آیتم', icon: BookOpen }] },
]

const badgeGroups = [
    {
        title: 'تیکت‌ها',
        items: [
            { id: 'open', label: 'باز', icon: MessageSquare, badge: 18 },
            { id: 'pending', label: 'در انتظار پاسخ', icon: MessageSquare, badge: 2 },
            { id: 'closed', label: 'بسته‌شده', icon: MessageSquare },
            { id: 'urgent', label: 'فوری', icon: LayoutDashboard, badge: 'فوری' },
        ],
    },
]

const active1 = ref('courses')
const active2 = ref('dashboard')
const active3 = ref('students')
const active4 = ref('messages')
const active5 = ref('only')
const active6 = ref('open')

const lastChange = ref<string | null>(null)
const onChange = (id: string) => { lastChange.value = id }
</script>

<style scoped>
.sb-box {
    height: 420px;
    border: 1px solid var(--k-border);
    border-radius: 14px;
    overflow: hidden;
}
</style>
