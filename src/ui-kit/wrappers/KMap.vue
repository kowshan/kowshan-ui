<!-- wrappers/KMap.vue -->
<template>
    <div class="k-map" :style="{ height }">
        <!-- Map iframe -->
        <iframe
            :src="embedSrc"
            class="k-map-frame"
            :title="title || 'نقشه'"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <!-- Overlay: loading + controls -->
        <div class="k-map-toolbar">
            <button
                type="button"
                class="k-map-btn"
                :class="{ 'is-loading': locating }"
                :disabled="locating"
                :aria-label="locating ? 'در حال یافتن موقعیت...' : 'موقعیت من'"
                @click="locate"
            >
                <LocateFixed v-if="!locating" class="icon" />
                <Loader2 v-else class="icon spin" />
            </button>
        </div>

        <!-- Marker hint -->
        <div v-if="marker" class="k-map-marker">
            <MapPin class="icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader2, LocateFixed, MapPin } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    /** latitude (default: Tehran) */
    lat?: number
    /** longitude (default: Tehran) */
    lng?: number
    /** map zoom level 1-19 */
    zoom?: number
    /** provider: 'google' | 'osm' */
    provider?: 'google' | 'osm'
    height?: string
    title?: string
    /** marker address/query label shown over the pin */
    marker?: string
    /** optional Google Maps embed API key (required for marker in google mode) */
    googleApiKey?: string
}>(), {
    lat: 35.6892,
    lng: 51.3890,
    zoom: 12,
    provider: 'google',
    height: '300px'
})

const locating = ref(false)

const embedSrc = computed(() => {
    const q = `${props.lat},${props.lng}`

    if (props.provider === 'osm') {
        const url = new URL('https://www.openstreetmap.org/export/embed.html')
        url.searchParams.set('bbox', bboxString())
        url.searchParams.set('layer', 'mapnik')
        url.searchParams.set('marker', q)
        return url.toString()
    }

    // Google Maps embed
    const url = new URL('https://www.google.com/maps/embed/v1/place')
    if (props.googleApiKey) {
        url.searchParams.set('key', props.googleApiKey)
        url.searchParams.set('q', props.marker || q)
        url.searchParams.set('zoom', String(props.zoom))
    } else {
        // Keyless mode: use the older /maps?q= embed format
        const params = new URLSearchParams({
            q: props.marker || q,
            z: String(props.zoom),
            output: 'embed'
        })
        return `https://maps.google.com/maps?${params.toString()}`
    }
    return url.toString()
})

// Small bounding box around the center for OSM
const bboxString = () => {
    const d = 0.045 * Math.max(1, 12 / Math.max(props.zoom, 1))
    return `${props.lng - d},${props.lat - d},${props.lng + d},${props.lat + d}`
}

const emits = defineEmits<{
    'located': [value: { lat: number; lng: number }]
    'error': [message: string]
}>()

const locate = () => {
    if (!navigator.geolocation) {
        emits('error', 'مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند')
        return
    }
    locating.value = true
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            locating.value = false
            emits('located', { lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => {
            locating.value = false
            emits('error', err.message || 'خطا در دریافت موقعیت')
        },
        { enableHighAccuracy: true, timeout: 10000 }
    )
}
</script>

<style scoped>
.k-map {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    min-height: 160px;
}

.k-map-frame {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

/* Toolbar */
.k-map-toolbar {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 5;
}

.k-map-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 8px;
    background: #ffffff;
    color: var(--k-text-primary, #1e293b);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.k-map-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.k-map-btn:disabled {
    opacity: 0.7;
    cursor: wait;
}

.k-map-btn:focus-visible {
    outline: 2px solid var(--k-primary, #3b82f6);
    outline-offset: 2px;
}

.icon {
    width: 18px;
    height: 18px;
}

.spin {
    animation: k-spin 0.8s linear infinite;
}

/* Marker */
.k-map-marker {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
    color: #ef4444;
    z-index: 4;
    pointer-events: none;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}

.k-map-marker .icon {
    width: 34px;
    height: 34px;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
