<template>
    <div class="sp">
        <h2 class="sp-title">KMegaMenu</h2>
        <p class="sp-note">منوی مگا با پنل عریض — دو حالت: لیست تودرتو (flyout) و ستون‌های دسته‌بندی‌شده.</p>

        <h3 class="sp-sub">حالت لیست با زیرمنو (سطح ۲ و ۳)</h3>
        <div class="sp-row">
            <KMegaMenu label="محصولات (align=start)" :items="listItems" @select="onSelect" />
            <KMegaMenu label="چپ‌چین (align=end)" :items="listItems" align="end" />
            <KMegaMenu label="به بالا (dir=up)" :items="listItems" dir="up" />
        </div>

        <h3 class="sp-sub">حالت دسته‌بندی‌شده (groups)</h3>
        <div class="sp-row">
            <KMegaMenu label="دسته‌بندی‌ها" :groups="groups" />
        </div>

        <h3 class="sp-sub">داخل قاب با overflow: hidden (پنل تله‌پورت می‌شود و بریده نمی‌شود)</h3>
        <div class="sp-card" style="overflow: hidden; padding: 12px;">
            <KMegaMenu label="افتتاح در قاب بسته" :groups="groups" @select="onSelect" />
            <span class="sp-vmodel" style="margin-inline-start: 12px;">این قاب overflow: hidden دارد</span>
        </div>

        <h3 class="sp-sub">عرض ثابت + بسته نشدن پس از انتخاب</h3>
        <div class="sp-row">
            <KMegaMenu label="چند انتخابی" :items="listItems" width="280px" :close-on-select="false" />
        </div>

        <h3 class="sp-sub">تریگر سفارشی (اسلات)</h3>
        <div class="sp-row">
            <KMegaMenu :groups="groups">
                <template #trigger="{ open, toggle }">
                    <button type="button" class="mm-custom-trigger" :class="{ 'is-open': open }" @click="toggle()">
                        <Sparkles :size="15" />
                        <span>افزودن سریع</span>
                    </button>
                </template>
            </KMegaMenu>
        </div>

        <h3 class="sp-sub">آیتم غیرفعال و خطرناک</h3>
        <div class="sp-row">
            <KMegaMenu label="مدیریت" :items="mixedItems" @select="onSelect" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">انتخاب‌شده: {{ selected }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMegaMenu from '../../ui-kit/components/KMegaMenu.vue'
import { Sparkles } from 'lucide-vue-next'
import type { KMegaGroup, KMegaItem } from '../../ui-kit/components/KMegaMenuItem.vue'
import {
    LayoutDashboard, ShoppingCart, Users, BarChart3, Settings, FileText,
    Package, Tag, Truck, CreditCard, Trash2, Archive,
} from 'lucide-vue-next'

const selected = ref('—')
const onSelect = (item: KMegaItem) => { selected.value = item.label }

const listItems: (KMegaItem | 'divider')[] = [
    { label: 'داشبورد', icon: LayoutDashboard, shortcut: '⌘1' },
    { label: 'سفارش‌ها', icon: ShoppingCart, badge: '۱۲', children: [
        { label: 'در انتظار پرداخت', icon: CreditCard },
        { label: 'در حال ارسال', icon: Truck, children: [
            { label: 'ارسال عادی' },
            { label: 'ارسال اکسپرس' },
        ] },
        'divider',
        { label: 'بازگشتی‌ها', icon: Archive },
    ] },
    { label: 'مشتریان', icon: Users, description: 'مدیریت مخاطبان و سرنخ‌ها' },
    { label: 'گزارش‌ها', icon: BarChart3, description: 'فروش، بازدید، تبدیل' },
    'divider',
    { label: 'تنظیمات', icon: Settings },
]

const groups: KMegaGroup[] = [
    {
        title: 'فروش',
        items: [
            { label: 'محصولات', icon: Package, description: 'کاتالوگ و موجودی' },
            { label: 'تخفیف‌ها', icon: Tag, badge: '۳' },
            { label: 'سفارش‌ها', icon: ShoppingCart },
        ],
    },
    {
        title: 'محتوا',
        items: [
            { label: 'مقالات', icon: FileText },
            { label: 'دسته‌بندی‌ها', icon: Archive },
        ],
    },
    {
        title: 'کاربران',
        items: [
            { label: 'مشتریان', icon: Users },
            { label: 'کارکنان', icon: LayoutDashboard },
        ],
    },
]

const mixedItems: (KMegaItem | 'divider')[] = [
    { label: 'ویرایش', icon: Settings },
    { label: 'آرشیو', icon: Archive },
    { label: 'غیرفعال (دمو)', icon: Package, disabled: true },
    'divider',
    { label: 'حذف', icon: Trash2, danger: true },
]
</script>

<style scoped>
.mm-custom-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid var(--k-primary);
    border-radius: 10px;
    background: var(--k-primary-light, rgba(29, 185, 84, 0.1));
    color: var(--k-primary);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
}
.mm-custom-trigger.is-open { background: var(--k-primary); color: #fff; }
</style>
