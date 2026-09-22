<template>
    <div class="sp">
        <h2 class="sp-title">KImageGallery</h2>

        <h3 class="sp-sub">گرید (کلیک برای بزرگ‌نمایی + جابه‌جایی)</h3>
        <KImageGallery :images="images" @select="onSelect" @download="onDownload" />

        <h3 class="sp-sub">ویژه (featured)</h3>
        <KImageGallery :images="images" featured />

        <h3 class="sp-sub">چیدمان masonry</h3>
        <KImageGallery :images="images" layout="masonry" />

        <h3 class="sp-sub">چیدمان rows</h3>
        <KImageGallery :images="images" layout="rows" />

        <h3 class="sp-sub">چیدمان نامتقارن (mozaic) — یک بزرگ، بقیه کوچک</h3>
        <KImageGallery :images="products" layout="mosaic" />

        <h3 class="sp-sub">با برچسب و بج</h3>
        <KImageGallery :images="labeled" />

        <div class="sp-vmodel" style="margin-top: 16px;">انتخاب: {{ selected }}</div>
        <div class="sp-vmodel">دانلود: {{ downloaded }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KImageGallery from '../../ui-kit/components/KImageGallery.vue'

const svg = (w: number, h: number, from: string, to: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(%23g)'/></svg>`

const images = [
    { src: svg(400, 300, '1db954', '0ea5e9'), alt: 'تصویر ۱', download: '1' },
    { src: svg(400, 420, '8B5CF6', 'ec4899'), alt: 'تصویر ۲' },
    { src: svg(400, 260, 'f59e0b', 'ef4444'), alt: 'تصویر ۳', download: '3' },
    { src: svg(400, 340, '0ea5e9', '8B5CF6'), alt: 'تصویر ۴' },
    { src: svg(400, 300, '22c55e', '84cc16'), alt: 'تصویر ۵' },
    { src: svg(400, 380, 'ef4444', 'f59e0b'), alt: 'تصویر ۶' },
]

// گالری محصولات — چیدمان نامتقارن
const products = [
    { src: svg(800, 560, '0ea5e9', '1db954'), alt: 'محصول ویژه', caption: 'هدفون بی‌سیم Pro', badge: '٪۲۰ تخفیف' },
    { src: svg(400, 400, '8B5CF6', '6366f1'), alt: 'محصول ۲', caption: 'کیبورد مکانیکی' },
    { src: svg(400, 400, 'f59e0b', 'ef4444'), alt: 'محصول ۳', caption: 'ماوس گیمینگ' },
    { src: svg(400, 400, '22c55e', '84cc16'), alt: 'محصول ۴', caption: 'پایه لپ‌تاپ' },
    { src: svg(400, 400, 'ec4899', '8B5CF6'), alt: 'محصول ۵', caption: 'پد ماوس' },
    { src: svg(400, 400, '0ea5e9', '8B5CF6'), alt: 'محصول ۶', caption: 'هاب USB-C' },
    { src: svg(400, 400, 'ef4444', 'f59e0b'), alt: 'محصول ۷', caption: 'کابل شارژ' },
]

const labeled = images.map((img, i) => ({
    ...img,
    caption: `عنوان تصویر ${i + 1}`,
    label: 'محصول',
    badge: i === 0 ? 'جدید' : undefined,
}))

const selected = ref('—')
const downloaded = ref('—')

const onSelect = (p: { image: any; index: number }) => { selected.value = `#${p.index + 1}` }
const onDownload = (image: any) => { downloaded.value = image.alt || '—' }
</script>
