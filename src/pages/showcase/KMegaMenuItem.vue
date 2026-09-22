<template>
    <div class="sp">
        <h2 class="sp-title">KMegaMenuItem</h2>
        <p class="sp-note">
            آیتم بازگشتی منوی مگا — داخل <code>KMegaMenu</code>/<code>KMegaMenuBar</code> استفاده می‌شود، اما مستقیم هم قابل رندر است.
            تنها پروپ آن <code>item</code> است و <code>select</code> می‌دهد.
        </p>

        <h3 class="sp-sub">آیتم ساده</h3>
        <div class="sp-card" style="max-width: 300px; padding: 4px;">
            <KMegaMenuItem :item="{ label: 'داشبورد' }" @select="onSelect" />
        </div>

        <h3 class="sp-sub">با آیکون، میان‌بر و بج</h3>
        <div class="sp-card" style="max-width: 320px; padding: 4px;">
            <KMegaMenuItem :item="{ label: 'ذخیره', icon: Save, shortcut: '⌘S' }" @select="onSelect" />
            <KMegaMenuItem :item="{ label: 'اعلان‌ها', icon: Bell, badge: '۴' }" @select="onSelect" />
        </div>

        <h3 class="sp-sub">با توضیح (دو خطی)</h3>
        <div class="sp-card" style="max-width: 340px; padding: 4px;">
            <KMegaMenuItem
                :item="{ label: 'گزارش فروش', icon: BarChart3, description: 'نمودار فروش ماهانه و مقایسه با ماه قبل' }"
                @select="onSelect"
            />
        </div>

        <h3 class="sp-sub">با زیرمنو (hover کنید تا flyout باز شود)</h3>
        <div class="sp-card" style="max-width: 320px; padding: 4px;">
            <KMegaMenuItem :item="withChildren" @select="onSelect" />
        </div>

        <h3 class="sp-sub">داخل پنل واقعی (بهترین نمایش)</h3>
        <div class="sp-card" style="max-width: 340px; padding: 4px;">
            <KMegaMenuItem :item="withChildren" @select="onSelect" />
            <KMegaMenuItem :item="{ label: 'تنظیمات', icon: Settings }" @select="onSelect" />
        </div>

        <h3 class="sp-sub">غیرفعال و خطرناک</h3>
        <div class="sp-card" style="max-width: 320px; padding: 4px;">
            <KMegaMenuItem :item="{ label: 'بایگانی (غیرفعال)', icon: Archive, disabled: true }" @select="onSelect" />
            <KMegaMenuItem :item="{ label: 'حذف کامل', icon: Trash2, danger: true }" @select="onSelect" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">select: {{ selected }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMegaMenuItem, { type KMegaItem } from '../../ui-kit/components/KMegaMenuItem.vue'
import { Save, Bell, BarChart3, Settings, Archive, Trash2, ShoppingCart, CreditCard, Truck } from 'lucide-vue-next'

const selected = ref('—')
const onSelect = (item: KMegaItem) => { selected.value = item.label }

const withChildren: KMegaItem = {
    label: 'سفارش‌ها',
    icon: ShoppingCart,
    description: 'مدیریت وضعیت سفارش‌ها',
    children: [
        { label: 'در انتظار پرداخت', icon: CreditCard },
        { label: 'در حال ارسال', icon: Truck, children: [{ label: 'ارسال عادی' }, { label: 'اکسپرس' }] },
        'divider',
        { label: 'لغو‌شده', danger: true },
    ],
}
</script>
