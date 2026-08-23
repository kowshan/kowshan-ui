<template>
    <DemoSection
        id="media"
        index="06"
        title="رسانه و نقشه"
        description="گالری، نقشه، کد QR، ویدیو، صدا، نمودار کوچک و فهرست مجازی"
    >
        <p class="demo-caption">گالری — کلیک برای بزرگ‌نمایی</p>
        <KMediaGallery :items="galleryItems" :cols="4" />

        <hr class="demo-divider" />

        <p class="demo-caption">نقشه</p>
        <KMap
            :lat="35.6892"
            :lng="51.3890"
            :zoom="12"
            provider="google"
            height="340px"
            title="موقعیت ملک"
            marker="تهران، ایران"
        />

        <hr class="demo-divider" />

        <!-- QR + sparkline + gauge -->
        <div class="demo-grid-3">
            <div class="demo-stack">
                <p class="demo-caption">کد QR — ساخته‌شده با انکودر داخلی کیت (بدون وابستگی)</p>
                <div class="demo-center">
                    <div class="demo-qr-box">
                        <KQrCode
                            :value="qrValue"
                            :size="140"
                            :fg="qrFg"
                        />
                        <KCopyButton :text="qrValue" />
                    </div>
                </div>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">نمودار کوچک (Sparkline) — روند هفتگی فروش</p>
                <div class="demo-stack">
                    <div class="demo-spark-row">
                        <span>این هفته</span>
                        <KSparkline :data="[12, 18, 14, 25, 21, 30, 34]" :width="140" :height="34" />
                    </div>
                    <div class="demo-spark-row">
                        <span>ماه گذشته</span>
                        <KSparkline :data="[40, 35, 42, 30, 45, 38, 50, 44]" :width="140" :height="34" color="#8b5cf6" />
                    </div>
                </div>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">گیج — نرخ تکمیل پروفایل</p>
                <div class="demo-center">
                    <KGauge :value="72" label="تکمیل پروفایل" />
                </div>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Video + audio -->
        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">پخش‌کننده ویدیو — بدون وابستگی خارجی</p>
                <KVideoPlayer
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    poster="https://picsum.photos/seed/vidposter/640/360"
                    title="ویدیوی نمونه"
                />
            </div>
            <div class="demo-stack">
                <p class="demo-caption">پخش‌کننده صدا — با لیست پخش</p>
                <KAudioPlayer
                    :tracks="audioTracks"
                    title="قطعه نمونه"
                />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Virtual list -->
        <p class="demo-caption">فهرست مجازی — ۱۰٬۰۰۰ ردیف با رندر پنجره‌ای (فقط ~۱۲ ردیف در DOM)</p>
        <KVirtualList :items="virtualRows" :item-height="44" :height="240">
            <template #default="{ item, index }">
                <span class="demo-vrow-index">{{ faNum(index + 1) }}</span>
                <span>{{ item.name }}</span>
                <span class="demo-vrow-city">{{ item.city }}</span>
            </template>
        </KVirtualList>
    </DemoSection>
</template>

<script setup lang="ts">
import DemoSection from '../components/DemoSection.vue'
import KMediaGallery from '../ui-kit/wrappers/KMediaGallery.vue'
import KMap from '../ui-kit/wrappers/KMap.vue'
import KQrCode from '../ui-kit/components/KQrCode.vue'
import KSparkline from '../ui-kit/components/KSparkline.vue'
import KGauge from '../ui-kit/components/KGauge.vue'
import KVideoPlayer from '../ui-kit/components/KVideoPlayer.vue'
import KAudioPlayer, { type KAudioTrack } from '../ui-kit/components/KAudioPlayer.vue'
import KVirtualList from '../ui-kit/components/KVirtualList.vue'
import KCopyButton from '../ui-kit/components/KCopyButton.vue'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

/* self-contained gallery previews — inline SVGs (house silhouette + caption)
   so the demo never depends on an external image CDN */
const svgFor = (label: string, from: string, to: string) => {
    const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>` +
        `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
        `<stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>` +
        `</linearGradient></defs>` +
        `<rect width='800' height='600' fill='url(#g)'/>` +
        `<circle cx='660' cy='120' r='140' fill='#ffffff' opacity='0.14'/>` +
        `<circle cx='120' cy='520' r='180' fill='#ffffff' opacity='0.10'/>` +
        // house silhouette
        `<path d='M400 170 L560 310 L560 480 L240 480 L240 310 Z' fill='#ffffff' opacity='0.92'/>` +
        `<rect x='340' y='360' width='120' height='120' rx='4' fill='${to}'/>` +
        `<rect x='240' y='310' width='320' height='14' fill='#ffffff' opacity='0.5'/>` +
        `<text x='400' y='545' font-family='yekan-bakh, Tahoma, sans-serif' font-size='30' font-weight='700' fill='#ffffff' text-anchor='middle'>${label}</text>` +
        `</svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const galleryItems = [
    { src: svgFor('نمای بیرونی', '#0ea5e9', '#0369a1'), caption: 'نمای بیرونی' },
    { src: svgFor('سالن پذیرایی', '#f59e0b', '#b45309'), caption: 'سالن پذیرایی' },
    { src: svgFor('آشپزخانه', '#10b981', '#065f46'), caption: 'آشپزخانه' },
    { src: svgFor('اتاق خواب', '#8b5cf6', '#5b21b6'), caption: 'اتاق خواب' },
    { src: svgFor('حمام', '#0ea5e9', '#155e75'), caption: 'حمام' },
    { src: svgFor('حیاط', '#22c55e', '#166534'), caption: 'حیاط' },
    { src: svgFor('استخر', '#38bdf8', '#1d4ed8'), caption: 'استخر' },
    { src: svgFor('پارکینگ', '#94a3b8', '#475569'), caption: 'پارکینگ' },
]

/* QR */
const qrValue = 'https://example.com/pay/IR0123-4512-8891'
const qrFg = '#1db954'

/* audio tracks */
const audioTracks: KAudioTrack[] = [
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'قطعه یک', artist: 'SoundHelix' },
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', title: 'قطعه دو', artist: 'SoundHelix' },
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', title: 'قطعه سه', artist: 'SoundHelix' },
]

/* virtual list rows */
const cities = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'رشت', 'کرج', 'اهواز']
const virtualRows = Array.from({ length: 10000 }, (_, i) => ({
    name: `مشتری ${i + 1}`,
    city: cities[i % cities.length],
}))
</script>

<style scoped>
.demo-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.demo-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-center {
    display: flex;
    justify-content: center;
}

.demo-qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px;
    border: 1px solid var(--k-border);
    border-radius: 14px;
    background: var(--k-surface);
}

.demo-spark-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--k-border);
    border-radius: 10px;
    font-size: 0.72rem;
    color: var(--k-text-secondary);
}

.demo-vrow-index {
    color: var(--k-text-muted);
    font-family: monospace;
    direction: ltr;
    min-width: 48px;
}

.demo-vrow-city {
    margin-inline-start: auto;
    font-size: 0.68rem;
    color: var(--k-text-muted);
}
</style>
