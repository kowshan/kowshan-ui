<template>
    <div class="sp">
        <h2 class="sp-title">KLightbox</h2>
        <p class="sp-note">
            نمایشگر تمام‌صفحه — با <code>v-model:visible</code> کنترل می‌شود و بین آیتم‌ها جابه‌جا می‌شود.
        </p>

        <h3 class="sp-sub">تصاویر با تامبنیل</h3>
        <div class="sp-row">
            <KButton text="باز کردن (از ابتدا)" bg-color="var(--k-primary)" text-color="#fff" @click="open(0)" />
            <KButton text="باز کردن از تصویر ۴" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="open(3)" />
        </div>

        <h3 class="sp-sub">بدون تامبنیل</h3>
        <div class="sp-row">
            <KButton text="باز کردن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openNoThumbs = true" />
        </div>

        <h3 class="sp-sub">با آیتم ویدیو (پوستر نمایش داده می‌شود)</h3>
        <div class="sp-row">
            <KButton text="باز کردن گالری ترکیبی" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openMixed = true" />
        </div>

        <h3 class="sp-sub">تک‌تصویری</h3>
        <div class="sp-row">
            <KButton text="باز کردن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openSingle = true" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین تغییر ایندکس: {{ lastChange }}</div>

        <KLightbox v-model:visible="visible" :items="items" :start-index="startIndex" @change="onChange" />
        <KLightbox v-model:visible="openNoThumbs" :items="items" :show-thumbnails="false" @change="onChange" />
        <KLightbox v-model:visible="openMixed" :items="mixed" @change="onChange" />
        <KLightbox v-model:visible="openSingle" :items="[items[0]]" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KLightbox, { type KLightboxItem } from '../../ui-kit/components/KLightbox.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const svg = (w: number, h: number, from: string, to: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(%23g)'/></svg>`

const items: KLightboxItem[] = [
    { src: svg(1200, 800, '0ea5e9', '1db954'), thumb: svg(300, 200, '0ea5e9', '1db954'), caption: 'کوهستان شمال' },
    { src: svg(1200, 800, '8B5CF6', 'ec4899'), thumb: svg(300, 200, '8B5CF6', 'ec4899'), caption: 'غروب دریا' },
    { src: svg(1200, 800, 'f59e0b', 'ef4444'), thumb: svg(300, 200, 'f59e0b', 'ef4444'), caption: 'کویر' },
    { src: svg(1200, 800, '22c55e', '84cc16'), thumb: svg(300, 200, '22c55e', '84cc16'), caption: 'جنگل' },
    { src: svg(1200, 800, '6366f1', '0ea5e9'), thumb: svg(300, 200, '6366f1', '0ea5e9'), caption: 'شهر شبانه' },
]

const mixed: KLightboxItem[] = [
    items[0],
    items[1],
    {
        // منبع ویدیو در پیش‌نمایش آفلاین بارگذاری نمی‌شود، اما پوستر و کنترلها نمایش داده می‌شوند
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        poster: svg(1200, 800, '8B5CF6', '6366f1'),
        thumb: svg(300, 200, '8B5CF6', '6366f1'),
        caption: 'کلیپ معرفی دوره',
    },
    items[3],
]

const visible = ref(false)
const openNoThumbs = ref(false)
const openMixed = ref(false)
const openSingle = ref(false)
const startIndex = ref(0)
const lastChange = ref('—')

const open = (i: number) => { startIndex.value = i; visible.value = true }
const onChange = (index: number) => { lastChange.value = String(index + 1) }
</script>
