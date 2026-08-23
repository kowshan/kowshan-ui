<template>
    <DemoSection
        id="navigation"
        index="05"
        title="پیمایش"
        description="تب، گام‌نما، آکاردئون و راهنما"
    >
        <!-- Tabs -->
        <p class="demo-caption">تب‌ها — سه واریانت</p>
        <div class="demo-stack">
            <div>
                <KTabs v-model="tab" :tabs="tabItems" variant="underline">
                    <div class="k-tabs-panel">
                        محتوای تب فعال: <strong>{{ tabLabel }}</strong>
                    </div>
                </KTabs>
            </div>

            <div>
                <KTabs v-model="tabPills" :tabs="tabItems" variant="pills">
                    <div class="k-tabs-panel">تب‌های قرصی — انتخاب: {{ tabPillsLabel }}</div>
                </KTabs>
            </div>

            <div>
                <KTabs v-model="tabBoxed" :tabs="tabItems" variant="boxed" size="sm">
                    <div class="k-tabs-panel">تب‌های جعبه‌ای — انتخاب: {{ tabBoxedLabel }}</div>
                </KTabs>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Stepper -->
        <p class="demo-caption">گام‌نما</p>
        <div class="demo-row" style="justify-content: center">
            <KStepper v-model="step" :steps="steps" style="max-width: 620px" />
        </div>

        <hr class="demo-divider" />

        <!-- Accordion -->
        <p class="demo-caption">آکاردئون</p>
        <div style="max-width: 560px">
            <KAccordion :items="accItems" multiple />
        </div>

        <hr class="demo-divider" />

        <!-- Breadcrumb -->
        <p class="demo-caption">مسیر ناوبری</p>
        <KBreadcrumb :items="crumbs" @select="(i: any) => (crumbMsg = 'کلیک روی: ' + i.label)" />
        <p v-if="crumbMsg" style="font-size: 0.72rem; color: var(--k-primary); margin: 6px 0 0">{{ crumbMsg }}</p>

        <hr class="demo-divider" />

        <!-- Dropdown -->
        <p class="demo-caption">منوی کشویی</p>
        <div class="demo-row">
            <KDropdownMenu :items="dropdownItems" @select="onDropdownSelect">
                <template #trigger="{ toggle }">
                    <KButton text="منوی عملیات" :left-icon="MoreHorizontal" bg-color="#1db954" text-color="#fff" @click="toggle" />
                </template>
            </KDropdownMenu>

            <KDropdownMenu :items="dropdownDanger" align="start" dir="up">
                <template #trigger="{ toggle }">
                    <KButton text="مخرب" :left-icon="Trash2" bg-color="#fee2e2" text-color="#b91c1c" @click="toggle" />
                </template>
            </KDropdownMenu>
        </div>
        <p v-if="dropdownMsg" style="font-size: 0.72rem; color: var(--k-primary); margin: 6px 0 0">{{ dropdownMsg }}</p>

        <hr class="demo-divider" />

        <!-- Command palette -->
        <p class="demo-caption">پالت فرمان — کلید میان‌بر Ctrl+K</p>
        <div class="demo-row">
            <KButton text="باز کردن پالت (Ctrl+K)" :left-icon="Command" bg-color="#1db954" text-color="#fff" @click="paletteOpen = true" />
            <span style="font-size: 0.72rem; color: var(--k-text-muted)">تعداد فرمان‌ها: {{ cmdGroups.reduce((n, g) => n + g.items.length, 0) }}</span>
        </div>
        <KCommandPalette v-model:visible="paletteOpen" :groups="cmdGroups" @select="onCommand" />
        <p v-if="cmdMsg" style="font-size: 0.72rem; color: var(--k-primary); margin: 6px 0 0">{{ cmdMsg }}</p>
    </DemoSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    Building2, FileText, Home, Image, LayoutDashboard, MoreHorizontal,
    Plus, Search, Settings, Trash2, UserPlus, Users, Command,
    Download, Printer, FilePlus2, LogOut, Building
} from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'

import KTabs from '../ui-kit/components/KTabs.vue'
import KStepper from '../ui-kit/components/KStepper.vue'
import KAccordion from '../ui-kit/components/KAccordion.vue'
import KBreadcrumb from '../ui-kit/components/KBreadcrumb.vue'
import KDropdownMenu, { type KDropdownItem } from '../ui-kit/components/KDropdownMenu.vue'
import KCommandPalette from '../ui-kit/components/KCommandPalette.vue'
import KButton from '../ui-kit/components/KButton.vue'

/* Tabs */
const tabItems = [
    { id: 'info', label: 'اطلاعات', icon: FileText, count: 6 },
    { id: 'media', label: 'تصاویر', icon: Image, count: 12 },
    { id: 'options', label: 'تنظیمات', icon: Settings },
    { id: 'docs', label: 'مستندات', icon: Building2, disabled: true },
]

const tab = ref('info')
const tabPills = ref('media')
const tabBoxed = ref('options')

const tabLabel = computed(() => tabItems.find(t => t.id === tab.value)?.label || '')
const tabPillsLabel = computed(() => tabItems.find(t => t.id === tabPills.value)?.label || '')
const tabBoxedLabel = computed(() => tabItems.find(t => t.id === tabBoxed.value)?.label || '')

/* Stepper */
const step = ref('basic')
const steps = [
    { id: 'basic', label: 'اطلاعات پایه' },
    { id: 'location', label: 'موقعیت' },
    { id: 'media', label: 'تصاویر' },
    { id: 'done', label: 'ثبت نهایی' },
]

/* Accordion */
const accItems = [
    { title: 'شرایط پرداخت', content: 'پرداخت اقساطی تا ۲۴ ماه بدون بهره برای خریداران محترم فراهم است.' },
    { title: 'نحوه بازدید', content: 'هماهنگی بازدید از طریق تماس با کارشناس فروش، روزهای کاری ۹ تا ۱۸ انجام می‌شود.' },
    { title: 'مدارک لازم', content: 'سند مالکیت، پایان کار و مفاصا حساب عوارض شهرداری برای انتقال رسمی لازم است.' },
]

/* Breadcrumb */
const crumbMsg = ref('')
const crumbs = [
    { label: 'داشبورد', icon: Home },
    { label: 'املاک', icon: Building },
    { label: 'ملک ۱۴۰۵-۰۱۲', icon: FileText },
]

/* Dropdown */
const dropdownMsg = ref('')
const onDropdownSelect = (item: any) => { dropdownMsg.value = 'انتخاب شد: ' + item.label }

const dropdownItems: (KDropdownItem | 'divider')[] = [
    { label: 'افزودن ملک جدید', icon: Plus, shortcut: 'N' },
    { label: 'افزودن مشتری', icon: UserPlus, shortcut: 'M' },
    'divider',
    { label: 'گزارش فروش', icon: FilePlus2 },
    { label: 'چاپ قرارداد', icon: Printer, shortcut: 'P' },
]

const dropdownDanger: KDropdownItem[] = [
    { label: 'حذف ردیف', icon: Trash2, danger: true },
    { label: 'بستن پرونده', icon: LogOut, danger: true },
]

/* Command palette */
const paletteOpen = ref(false)
const cmdMsg = ref('')
const onCommand = (item: any) => { cmdMsg.value = 'فرمان اجرا شد: ' + item.label }

const cmdGroups = [
    {
        id: 'nav',
        title: 'ناوبری',
        items: [
            { id: 'go-dash', label: 'رفتن به داشبورد', icon: LayoutDashboard, shortcut: 'G+D', keywords: ['home'] },
            { id: 'go-props', label: 'فهرست املاک', icon: Building, shortcut: 'G+P', keywords: ['properties', 'estate'] },
            { id: 'go-customers', label: 'مشتریان', icon: Users, shortcut: 'G+C', keywords: ['clients'] },
        ],
    },
    {
        id: 'actions',
        title: 'عملیات',
        items: [
            { id: 'new-property', label: 'ثبت ملک جدید', icon: Plus, shortcut: 'N', keywords: ['add', 'create'] },
            { id: 'search', label: 'جستجوی پیشرفته', icon: Search, shortcut: '/', keywords: ['find', 'filter'] },
            { id: 'export', label: 'خروجی اکسل', icon: Download, shortcut: 'E', keywords: ['xlsx', 'csv'] },
            { id: 'settings', label: 'تنظیمات', icon: Settings, shortcut: 'S', keywords: ['config'] },
        ],
    },
]
</script>

<style scoped>
.k-tabs-panel {
    padding: 16px;
    background: var(--k-surface, #f8fafc);
    border: 1px dashed var(--k-border, #e2e8f0);
    border-radius: 10px;
    font-size: 0.8rem;
    color: var(--k-text-secondary, #64748b);
}
</style>
