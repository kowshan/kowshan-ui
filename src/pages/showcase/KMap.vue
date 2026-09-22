<template>
    <div class="sp">
        <h2 class="sp-title">KMap</h2>
        <p class="sp-note">
            نقشه مبتنی بر Leaflet + OpenStreetMap — بدون کلید API. کاشی‌ها از شبکه بارگذاری می‌شوند،
            پس در محیط آفلاین فقط کنترل‌ها و مارکرها دیده می‌شوند.
        </p>

        <h3 class="sp-sub">پایه (تهران)</h3>
        <KMap :lat="35.6892" :lng="51.3890" :zoom="12" height="320px" />

        <h3 class="sp-sub">مارکرها با پاپ‌آپ و رنگ</h3>
        <KMap
            :lat="35.7000" :lng="51.4000" :zoom="12" height="360px"
            :markers="markers"
            :show-coordinates="true"
        />

        <h3 class="sp-sub">مسیر (polyline)</h3>
        <KMap
            :lat="35.7200" :lng="51.4000" :zoom="11" height="360px"
            :markers="routeMarkers"
            :route="route"
        />

        <h3 class="sp-sub">نوع کاشی و کلید لایه‌ها</h3>
        <div class="sp-row">
            <KButton :text="'OSM'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="tile = 'osm'" />
            <KButton :text="'Carto'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="tile = 'carto'" />
            <KButton :text="'Satellite'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="tile = 'satellite'" />
            <span class="sp-vmodel">tile: {{ tile }}</span>
        </div>
        <KMap :lat="35.6892" :lng="51.3890" :zoom="11" height="320px" :tile="tile" :show-layer-switch="true" />

        <h3 class="sp-sub">محدوده زوم و بدون درگ</h3>
        <KMap
            :lat="35.7000" :lng="51.4100" :zoom="13" height="320px"
            :min-zoom="12" :max-zoom="16"
            :draggable="false"
            :show-coordinates="true"
        />

        <h3 class="sp-sub">کنترل‌ها با prop (controls)</h3>
        <div class="sp-row">
            <KButton :text="'فقط زوم'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="controls = ['zoom']" />
            <KButton :text="'زوم + مقیاس'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="controls = ['zoom', 'scale']" />
            <KButton :text="'همه'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="controls = ['zoom', 'locate', 'layer', 'coords', 'scale']" />
            <KButton :text="'بدون کنترل'" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="controls = []" />
            <span class="sp-vmodel">controls: [{{ controls.join(', ') }}]</span>
        </div>
        <KMap
            :lat="35.6892" :lng="51.3890" :zoom="12" height="300px"
            :controls="controls"
            :markers="markers"
        />

        <h3 class="sp-sub">کارت سفارشی برای مارکرها (اسلات <code>#marker</code>)</h3>
        <p class="sp-note">مارکرهایی با <code>overlay: true</code> به‌جای سوزن، به‌صورت کارت ووی روی نقشه رندر می‌شوند و با جابه‌جایی/زوم هم‌تراز می‌مانند.</p>
        <KMap :lat="35.7000" :lng="51.4000" :zoom="13" height="420px" :markers="propertyMarkers" :controls="['zoom', 'scale']">
            <template #marker="{ marker }">
                <div
                    class="mk-card"
                    :class="{ 'is-active': marker.title === selectedProperty }"
                    @click="selectedProperty = marker.title || ''"
                >
                    <img :src="marker.icon || ''" :alt="marker.title || ''" />
                    <div class="mk-body">
                        <strong>{{ marker.title }}</strong>
                        <span class="mk-price">{{ marker.popup }}</span>
                    </div>
                </div>
            </template>
        </KMap>

        <h3 class="sp-sub">پاپ‌آپ با HTML خام (html)</h3>
        <KMap
            :lat="35.6892" :lng="51.3890" :zoom="12" height="300px"
            :markers="htmlMarkers"
            :controls="['zoom', 'coords']"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMap, { type KMapMarker, type KMapRoute, type MapControl } from '../../ui-kit/wrappers/KMap.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const tile = ref<'osm' | 'carto' | 'satellite'>('osm')
const controls = ref<MapControl[]>(['zoom', 'locate'])
const selectedProperty = ref('آپارتمان سعادت‌آباد')

const markers: KMapMarker[] = [
    { lat: 35.7000, lng: 51.4000, title: 'دفتر مرکزی', popup: 'خیابان ولیعصر، پلاک ۱۲', color: '#1db954' },
    { lat: 35.7120, lng: 51.4200, title: 'انبار', popup: 'شهرک صنعتی', color: '#f59e0b' },
    { lat: 35.6850, lng: 51.3750, title: 'نمایندگی غرب', popup: 'میدان آزادی', color: '#ef4444' },
]

const routeMarkers: KMapMarker[] = [
    { lat: 35.7200, lng: 51.4000, title: 'مبدأ', color: '#3b82f6' },
    { lat: 35.7050, lng: 51.3900, title: 'ایستگاه ۱' },
    { lat: 35.6900, lng: 51.4050, title: 'مقصد', color: '#1db954' },
]

// ── marker cards (overlay: true) ──
const thumbs = [
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'80\'><rect width=\'120\' height=\'80\' fill=\'%230ea5e9\'/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'80\'><rect width=\'120\' height=\'80\' fill=\'%238B5CF6\'/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'80\'><rect width=\'120\' height=\'80\' fill=\'%23f59e0b\'/></svg>',
]

const propertyMarkers: KMapMarker[] = [
    { lat: 35.7050, lng: 51.3950, title: 'آپارتمان سعادت‌آباد', popup: '۴٫۲ میلیارد تومان', overlay: true, icon: thumbs[0] },
    { lat: 35.6980, lng: 51.4100, title: 'ویلا لواسان', popup: '۱۲ میلیارد تومان', overlay: true, icon: thumbs[1] },
    { lat: 35.7100, lng: 51.4150, title: 'دفتر ولیعصر', popup: '۸٫۵ میلیارد تومان', overlay: true, icon: thumbs[2] },
]

const htmlMarkers: KMapMarker[] = [
    {
        lat: 35.6892,
        lng: 51.3890,
        title: 'دفتر مرکزی',
        html: '<strong>دفتر مرکزی</strong><span style="display:block;font-size:.72rem">ولیعصر، پلاک ۱۲</span><a href="#" style="display:inline-block;margin-top:6px;font-size:.72rem;color:#1db954">مسیریابی</a>',
    },
]

const route: KMapRoute = {
    points: [
        { lat: 35.7200, lng: 51.4000 },
        { lat: 35.7150, lng: 51.3950 },
        { lat: 35.7050, lng: 51.3900 },
        { lat: 35.6980, lng: 51.3980 },
        { lat: 35.6900, lng: 51.4050 },
    ],
    color: '#8B5CF6',
    weight: 5,
}
</script>

<style scoped>
.sp-note code { direction: ltr; display: inline-block; }

.mk-card {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 200px;
    padding: 7px;
    border-radius: 12px;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.18);
    cursor: pointer;
}
.mk-card.is-active { border-color: var(--k-primary); }
.mk-card img { width: 46px; height: 34px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.mk-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.mk-body strong { font-size: 0.72rem; color: var(--k-text-primary); }
.mk-price { font-size: 0.66rem; color: var(--k-success, #22c55e); font-weight: 700; }
</style>
