<template>
    <div class="sp">
        <h2 class="sp-title">KMegaMenuBar</h2>
        <p class="sp-note">نوار منوی افقی — هر آیتم می‌تواند پنل ستونی (groups)، لیست تودرتو، یا یک لینک ساده باشد.</p>

        <h3 class="sp-sub">نوار کامل (لینک + پنل دسته‌بندی + لیست + اسلات ویژه)</h3>
        <div class="sp-card" style="padding: 0; overflow: hidden;">
            <KMegaMenuBar :items="barItems" @select="onSelect" @open="onOpen" @close="onClose">
                <template #featured="{ item }">
                    <div class="mb-featured">
                        <strong>ویژه {{ item.label }}</strong>
                        <p>با ۲۰٪ تخفیف تا پایان هفته</p>
                    </div>
                </template>
                <template #footer="{ item }">
                    <span class="mb-footer">مشاهده همه {{ item.label }} ←</span>
                </template>
            </KMegaMenuBar>
        </div>

        <h3 class="sp-sub">فقط لینک‌های ساده (بدون پنل)</h3>
        <div class="sp-card" style="padding: 0; overflow: hidden;">
            <KMegaMenuBar :items="linksOnly" />
        </div>

        <h3 class="sp-sub">با بج و غیرفعال‌شده</h3>
        <div class="sp-card" style="padding: 0; overflow: hidden;">
            <KMegaMenuBar :items="badged" :close-on-select="false" @select="onSelect" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            select: {{ selected }} · open: {{ opened }} · close: {{ closes }} بار بسته شد
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMegaMenuBar, { type KMegaBarItem } from '../../ui-kit/components/KMegaMenuBar.vue'
import type { KMegaItem } from '../../ui-kit/components/KMegaMenuItem.vue'
import {
    Package, Tag, Users, FileText, BarChart3, ShoppingCart, Settings, CreditCard, Truck,
} from 'lucide-vue-next'

const selected = ref('—')
const opened = ref('—')
const closes = ref(0)

const onSelect = (item: KMegaItem) => { selected.value = item.label }
const onOpen = (i: number) => { opened.value = `پنل شماره ${i + 1}` }
const onClose = () => { closes.value++ }

const barItems: KMegaBarItem[] = [
    { label: 'خانه', href: '#' },
    {
        label: 'فروشگاه',
        featured: true,
        groups: [
            { title: 'دسته‌بندی', items: [
                { label: 'کتاب', icon: FileText },
                { label: 'لوازم جانبی', icon: Package, badge: 'جدید' },
                { label: 'تخفیف‌دار', icon: Tag },
            ] },
            { title: 'پرفروش‌ها', items: [
                { label: 'هدفون', icon: Package },
                { label: 'کیبورد', icon: Package },
            ] },
        ],
    },
    {
        label: 'حساب من',
        groups: [
            { items: [
                { label: 'سفارش‌های من', icon: ShoppingCart, children: [
                    { label: 'در انتظار پرداخت', icon: CreditCard },
                    { label: 'در حال ارسال', icon: Truck },
                ] },
                { label: 'تنظیمات', icon: Settings },
            ] },
        ],
    },
    {
        label: 'گزارش‌ها',
        items: [
            { label: 'فروش', icon: BarChart3 },
            { label: 'مشتریان', icon: Users },
            'divider',
            { label: 'خروجی CSV', icon: FileText },
        ],
    },
    { label: 'وبلاگ', href: '#' },
]

const linksOnly: KMegaBarItem[] = [
    { label: 'خانه', href: '#' },
    { label: 'دوره‌ها', href: '#' },
    { label: 'درباره ما', href: '#' },
    { label: 'تماس', href: '#' },
]

const badged: KMegaBarItem[] = [
    { label: 'اعلان‌ها', badge: '۵', items: [
        { label: 'سفارش جدید ثبت شد' },
        { label: 'موجودی یک محصول کم است', danger: true },
    ] },
    { label: 'محصول جدید', items: [
        { label: 'افزودن دستی', icon: Package },
        { label: 'ورود از CSV', icon: FileText },
    ] },
]
</script>

<style scoped>
.mb-featured {
    min-width: 180px;
    background: linear-gradient(160deg, var(--k-primary), #0ea5e9);
    color: #fff;
    border-radius: 12px;
    padding: 14px;
}
.mb-featured strong { font-size: 0.82rem; }
.mb-featured p { margin: 6px 0 0; font-size: 0.72rem; opacity: 0.9; }
.mb-footer { font-size: 0.74rem; color: var(--k-primary); font-weight: 700; }
</style>
