<template>
    <div class="sp">
        <h2 class="sp-title">KMediaGallery</h2>
        <p class="sp-note">
            گالری رسانه (پوسته روی KLightbox) — گرید تصاویر/ویدیو با نمایشگر تمام‌صفحه یکپارچه.
        </p>

        <h3 class="sp-sub">سه ستون (پیش‌فرض)</h3>
        <div class="sp-card">
            <KMediaGallery :items="items" />
        </div>

        <h3 class="sp-sub">دو ستون</h3>
        <div class="sp-card">
            <KMediaGallery :items="items" :cols="2" />
        </div>

        <h3 class="sp-sub">چهار ستون</h3>
        <div class="sp-card">
            <KMediaGallery :items="items" :cols="4" />
        </div>

        <h3 class="sp-sub">حالت فشرده (compact)</h3>
        <div class="sp-card">
            <KMediaGallery :items="items" compact />
        </div>

        <h3 class="sp-sub">بدون نوار تامبنیل</h3>
        <div class="sp-card">
            <KMediaGallery :items="items" :show-thumbnails="false" />
        </div>

        <h3 class="sp-sub">آلبوم محصول (با ویدیو)</h3>
        <div class="sp-card">
            <KMediaGallery :items="productAlbum" :cols="3" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KMediaGallery from '../../ui-kit/wrappers/KMediaGallery.vue'
import type { KLightboxItem } from '../../ui-kit/components/KLightbox.vue'

const svg = (w: number, h: number, from: string, to: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(%23g)'/></svg>`

const items: KLightboxItem[] = [
    { src: svg(1200, 800, '0ea5e9', '1db954'), thumb: svg(300, 200, '0ea5e9', '1db954'), caption: 'نمای بیرونی' },
    { src: svg(1200, 800, '8B5CF6', 'ec4899'), thumb: svg(300, 200, '8B5CF6', 'ec4899'), caption: 'اتاق اصلی' },
    { src: svg(1200, 800, 'f59e0b', 'ef4444'), thumb: svg(300, 200, 'f59e0b', 'ef4444'), caption: 'آشپزخانه' },
    { src: svg(1200, 800, '22c55e', '84cc16'), thumb: svg(300, 200, '22c55e', '84cc16'), caption: 'حیاط' },
    { src: svg(1200, 800, '6366f1', '0ea5e9'), thumb: svg(300, 200, '6366f1', '0ea5e9'), caption: 'پارکینگ' },
    { src: svg(1200, 800, 'ef4444', 'f59e0b'), thumb: svg(300, 200, 'ef4444', 'f59e0b'), caption: 'نما از بالا' },
]

const productAlbum: KLightboxItem[] = [
    { src: svg(1200, 800, '1db954', '0ea5e9'), thumb: svg(300, 200, '1db954', '0ea5e9'), caption: 'هدفون — نمای جلو' },
    { src: svg(1200, 800, '0ea5e9', '8B5CF6'), thumb: svg(300, 200, '0ea5e9', '8B5CF6'), caption: 'هدفون — نمای کنار' },
    {
        // ویدیو در محیط آفلاین بارگذاری نمی‌شود اما پوستر نمایش داده می‌شود
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        poster: svg(1200, 800, '8B5CF6', '6366f1'),
        thumb: svg(300, 200, '8B5CF6', '6366f1'),
        caption: 'ویدیو معرفی محصول',
    },
]
</script>
