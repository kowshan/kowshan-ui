<!-- wrappers/KMap.vue — Interactive map with Leaflet + OpenStreetMap -->
<template>
    <div class="k-map" :style="{ height }">
        <div ref="container" class="k-map-container" />

        <!-- Toolbar -->
        <div v-if="hasControl('locate') || hasControl('zoom')" class="k-map-toolbar">
            <button
                v-if="hasControl('locate')"
                type="button"
                class="k-map-btn"
                :class="{ 'is-loading': locating }"
                :disabled="locating"
                title="موقعیت من"
                @click="locate"
            >
                <LocateFixed v-if="!locating" :size="18" />
                <Loader2 v-else :size="18" class="spin" />
            </button>
            <button v-if="hasControl('zoom')" type="button" class="k-map-btn" title="بزرگ‌نمایی" @click="zoomIn">
                <Plus :size="18" />
            </button>
            <button v-if="hasControl('zoom')" type="button" class="k-map-btn" title="کوچک‌نمایی" @click="zoomOut">
                <Minus :size="18" />
            </button>
        </div>

        <!-- Tile layer selector -->
        <div v-if="hasControl('layer')" class="k-map-layers">
            <button
                v-for="layer in tileLayers"
                :key="layer.id"
                type="button"
                class="k-map-layer-btn"
                :class="{ 'is-active': activeLayer === layer.id }"
                :title="layer.name"
                @click="switchLayer(layer.id)"
            >
                <component :is="layer.icon" :size="14" />
            </button>
        </div>

        <!-- Coordinates display -->
        <div v-if="hasControl('coords') && cursorCoords" class="k-map-coords">
            {{ cursorCoords.lat.toFixed(5) }}, {{ cursorCoords.lng.toFixed(5) }}
        </div>

        <!-- Custom marker cards — `overlay: true` markers render the #marker slot here,
             projected to screen pixels on every move/zoom -->
        <div v-if="$slots.marker && overlays.length" class="k-map-overlays">
            <div
                v-for="o in overlays"
                :key="o.index"
                class="k-map-overlay"
                :style="{ left: o.x + 'px', top: o.y + 'px' }"
            >
                <slot name="marker" :marker="o.marker" :index="o.index" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import type * as LeafletNS from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cssVar } from '../utils/cssVar'

/** Leaflet reads `window`/`document` **when it is evaluated**, so a static import
 *  makes every server render of a page that uses a map die with
 *  `window is not defined` — and `<ClientOnly>` does not save it, because the
 *  import still runs on the server. It is loaded on mount instead; everything
 *  below that touches the library runs only after that (`L!`). */
type Leaflet = typeof LeafletNS

let L: Leaflet | null = null

async function loadLeaflet(): Promise<Leaflet> {
    if (L) return L

    /* Vite's CJS→ESM interop puts the library on `default`; the named exports are
       the fallback. */
    const mod = await import('leaflet')
    const lib = ((mod as any).default ?? mod) as Leaflet

    /* Vite bundles Leaflet's marker images differently from the CDN build, so the
       icon URLs are set explicitly — this needs the real module in hand. */
    delete (lib.Icon.Default.prototype as any)._getIconUrl
    lib.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    L = lib
    return lib
}
import {
    LocateFixed, Loader2, Plus, Minus,
    Map, Satellite, Mountain,
} from 'lucide-vue-next'

export interface KMapMarker {
    lat: number
    lng: number
    title?: string
    popup?: string
    /** raw HTML popup body (overrides `popup`; you own the escaping) */
    html?: string
    color?: string
    icon?: string
    /** render this marker as a custom card via the #marker slot instead of a pin */
    overlay?: boolean
}

export type MapControl = 'zoom' | 'locate' | 'layer' | 'coords' | 'scale'

export interface KMapRoute {
    points: { lat: number; lng: number }[]
    color?: string
    weight?: number
}

const props = withDefaults(defineProps<{
    lat?: number
    lng?: number
    zoom?: number
    height?: string
    markers?: KMapMarker[]
    marker?: string
    route?: KMapRoute
    tile?: 'osm' | 'carto' | 'satellite'
    showLayerSwitch?: boolean
    showCoordinates?: boolean
    draggable?: boolean
    minZoom?: number
    maxZoom?: number
    /** which built-in controls to render — e.g. ['zoom', 'scale'] (legacy show* flags still work) */
    controls?: MapControl[]
}>(), {
    controls: () => ['zoom', 'locate'] as MapControl[],
    lat: 35.6892,
    lng: 51.3890,
    zoom: 12,
    height: '340px',
    tile: 'osm',
    showLayerSwitch: false,
    showCoordinates: false,
    draggable: true,
    minZoom: 1,
    maxZoom: 19,
})

const emit = defineEmits<{
    'click': [coords: { lat: number; lng: number }]
    'marker-click': [marker: KMapMarker, index: number]
    'move': [coords: { lat: number; lng: number }]
    'located': [coords: { lat: number; lng: number }]
    'error': [message: string]
}>()

const container = ref<HTMLElement>()
const locating = ref(false)
const cursorCoords = ref<{ lat: number; lng: number } | null>(null)
const overlays = ref<{ index: number; x: number; y: number; marker: KMapMarker }[]>([])

/** the legacy show* props stay additive so existing usages keep working */
const hasControl = (id: MapControl) => {
    if (id === 'layer') return props.controls.includes('layer') || props.showLayerSwitch
    if (id === 'coords') return props.controls.includes('coords') || props.showCoordinates
    return props.controls.includes(id)
}

let map: LeafletNS.Map | null = null
let markerLayers: LeafletNS.Marker[] = []
let routeLayer: LeafletNS.Polyline | null = null

// ── Tile layers ──
const tileLayerUrls: Record<string, string> = {
    osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

const tileLayerAttribution: Record<string, string> = {
    osm: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    carto: '&copy; <a href="https://carto.com/">CARTO</a>',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
}

const activeLayer = ref<string>(props.tile)
let currentTileLayer: LeafletNS.TileLayer | null = null

const tileLayers: { id: string; name: string; icon: any }[] = [
    { id: 'osm', name: 'نقشه', icon: Map },
    { id: 'carto', name: 'کارتو', icon: Mountain },
    { id: 'satellite', name: 'ماهواره', icon: Satellite },
]

const switchLayer = (id: string) => {
    if (!map) return
    activeLayer.value = id
    if (currentTileLayer) map.removeLayer(currentTileLayer)
    currentTileLayer = L!.tileLayer(tileLayerUrls[id], {
        attribution: tileLayerAttribution[id],
        maxZoom: props.maxZoom,
    }).addTo(map)
}

// ── Create marker with custom color ──
const createMarker = (m: KMapMarker, index: number) => {
    const color = m.color || '#ef4444'
    const svg = `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.268 21.732 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`

    const icon = L!.divIcon({
        html: svg,
        className: 'k-map-custom-marker',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -38],
    })

    const marker = L!.marker([m.lat, m.lng], { icon, draggable: false }).addTo(map!)

    if (m.html) {
        marker.bindPopup(`<div class="k-map-popup">${m.html}</div>`, { className: 'k-map-popup-wrap' })
    } else if (m.popup || m.title) {
        const content = m.popup
            ? `<div class="k-map-popup"><strong>${m.title || ''}</strong><br/>${m.popup}</div>`
            : `<div class="k-map-popup"><strong>${m.title}</strong></div>`
        marker.bindPopup(content, { className: 'k-map-popup-wrap' })
    }

    marker.on('click', () => emit('marker-click', m, index))
    return marker
}

// ── Init map ──
onMounted(async () => {
    if (!container.value) return

    /* The library is fetched here, so the first render (server or client) only
       ever draws the container element. */
    const L = await loadLeaflet()
    const el = container.value
    if (!el) return

    /* `instance` is the local, non-null handle: `map` is module-level and
       mutable, so narrowing on it does not survive the `await` or the callbacks
       below, even though both are only reached once it exists. */
    const instance = L.map(el, {
        center: [props.lat, props.lng],
        zoom: props.zoom,
        zoomControl: false,
        attributionControl: true,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
    })
    map = instance

    // Add initial tile layer
    switchLayer(activeLayer.value)

    // Add default marker
    if (props.marker) {
        const defaultMarker: KMapMarker = { lat: props.lat, lng: props.lng, title: props.marker }
        const m = createMarker(defaultMarker, 0)
        m.openPopup()
        markerLayers.push(m)
    }

    // Add custom markers (skip cards — those render through the #marker slot)
    if (props.markers?.length) {
        props.markers.forEach((m, i) => {
            if (m.overlay) return
            markerLayers.push(createMarker(m, i))
        })
    }
    updateOverlays()

    // Scale bar
    if (hasControl('scale')) {
        L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(instance)
    }

    // Keep the slot cards pinned to their coordinates
    instance.on('move zoom viewreset resize moveend', updateOverlays)

    // Add route
    if (props.route?.points?.length) {
        drawRoute(props.route)
    }

    // Click handler
    instance.on('click', (e: LeafletNS.LeafletMouseEvent) => {
        emit('click', { lat: e.latlng.lat, lng: e.latlng.lng })
    })

    // Cursor coordinates
    if (props.showCoordinates) {
        instance.on('mousemove', (e: LeafletNS.LeafletMouseEvent) => {
            cursorCoords.value = { lat: e.latlng.lat, lng: e.latlng.lng }
        })
        instance.on('mouseout', () => { cursorCoords.value = null })
    }

    // Center on drag
    instance.on('moveend', () => {
        const center = instance.getCenter()
        emit('move', { lat: center.lat, lng: center.lng })
    })
})

// ── Watch for prop changes ──
watch(() => [props.lat, props.lng, props.zoom], () => {
    if (!map) return
    map.setView([props.lat, props.lng], props.zoom)
})

watch(() => props.markers, (newMarkers) => {
    if (!map) return
    // Clear old markers
    markerLayers.forEach(m => map!.removeLayer(m))
    markerLayers = []
    // Add new
    newMarkers?.forEach((m, i) => {
        if (m.overlay) return
        markerLayers.push(createMarker(m, i))
    })
    updateOverlays()
}, { deep: true })

/** project every `overlay: true` marker to container pixels */
function updateOverlays() {
    if (!map) return
    overlays.value = (props.markers || [])
        .map((marker, index) => ({ marker, index }))
        .filter(({ marker }) => marker.overlay)
        .map(({ marker, index }) => {
            const p = map!.latLngToContainerPoint([marker.lat, marker.lng])
            return { index, x: p.x, y: p.y, marker }
        })
}

watch(() => props.route, (r) => {
    if (!map || !r) return
    if (routeLayer) map.removeLayer(routeLayer)
    drawRoute(r)
}, { deep: true })

// ── Draw route polyline ──
const drawRoute = (route: KMapRoute) => {
    if (!map || !route.points?.length) return
    routeLayer = L!.polyline(
        route.points.map(p => [p.lat, p.lng]),
        {
            /* A route is drawn on a canvas/SVG path by Leaflet, where `var()`
               cannot resolve — so the brand token is *read* instead. */
            color: route.color || cssVar(container.value, '--k-primary', '#358f80'),
            weight: route.weight || 3,
            opacity: 0.8,
            dashArray: '6, 4',
        }
    ).addTo(map)
}

// ── Controls ──
const zoomIn = () => map?.zoomIn()
const zoomOut = () => map?.zoomOut()

const locate = () => {
    if (!navigator.geolocation) {
        emit('error', 'مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند')
        return
    }
    locating.value = true
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            locating.value = false
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            emit('located', coords)
            if (map) {
                map.setView([coords.lat, coords.lng], 15)
                // Add location marker
                const locMarker: KMapMarker = { ...coords, title: 'موقعیت من', color: '#3b82f6' }
                markerLayers.push(createMarker(locMarker, markerLayers.length))
            }
        },
        (err) => {
            locating.value = false
            emit('error', err.message || 'خطا در دریافت موقعیت')
        },
        { enableHighAccuracy: true, timeout: 10000 }
    )
}

// ── Public methods ──
defineExpose({
    flyTo: (lat: number, lng: number, zoom?: number) => map?.flyTo([lat, lng], zoom),
    setView: (lat: number, lng: number, zoom?: number) => map?.setView([lat, lng], zoom),
    addMarker: (m: KMapMarker) => {
        if (!map) return
        markerLayers.push(createMarker(m, markerLayers.length))
    },
    clearMarkers: () => {
        markerLayers.forEach(m => map?.removeLayer(m))
        markerLayers = []
    },
    fitBounds: (markers: KMapMarker[]) => {
        if (!map || !markers.length) return
        const bounds = L!.latLngBounds(markers.map(m => [m.lat, m.lng]))
        map.fitBounds(bounds, { padding: [40, 40] })
    },
    getMap: () => map,
})

onUnmounted(() => {
    map?.remove()
    map = null
})
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

.k-map-container {
    width: 100%;
    height: 100%;
    z-index: 0;
}

/* Toolbar */
.k-map-toolbar {
    position: absolute;
    top: 12px;
    inset-inline-start: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 5;
}

.k-map-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 8px;
    background: var(--k-surface, #ffffff);
    color: var(--k-text-primary, #1e293b);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
}

.k-map-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.k-map-btn:disabled {
    opacity: 0.7;
    cursor: wait;
}

.spin {
    animation: k-spin 0.8s linear infinite;
}

@keyframes k-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Layer switcher */
.k-map-layers {
    position: absolute;
    top: 12px;
    inset-inline-end: 12px;
    display: flex;
    gap: 4px;
    z-index: 5;
    background: var(--k-surface, #ffffff);
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.k-map-layer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--k-text-muted);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-map-layer-btn:hover {
    background: var(--k-surface-hover);
    color: var(--k-text-primary);
}

.k-map-layer-btn.is-active {
    background: var(--k-primary, #1db954);
    color: #fff;
}

/* Marker cards rendered through the #marker slot */
.k-map-overlays {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 4;
}

.k-map-overlay {
    position: absolute;
    transform: translate(-50%, -100%);
    pointer-events: auto;
}

/* Coordinates */
.k-map-coords {
    position: absolute;
    bottom: 8px;
    inset-inline-end: 8px;
    background: var(--k-surface, rgba(255, 255, 255, 0.9));
    backdrop-filter: blur(4px);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--k-text-muted);
    direction: ltr;
    font-family: inherit;
    z-index: 5;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>

<style>
/* Global styles for Leaflet overrides + custom markers */
.k-map-custom-marker {
    background: none !important;
    border: none !important;
}

.k-map-popup-wrap .leaflet-popup-content-wrapper {
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    font-size: 0.78rem;
}

.k-map-popup-wrap .leaflet-popup-tip {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.k-map-popup strong {
    font-weight: 700;
    display: block;
    margin-bottom: 2px;
}

/* Fix Leaflet default control backgrounds */
.k-map .leaflet-bar a {
    background: var(--k-surface, #ffffff) !important;
    color: var(--k-text-primary, #1e293b) !important;
    border-color: var(--k-border, #e2e8f0) !important;
    font-family: inherit !important;
}
.k-map .leaflet-bar a:hover {
    background: var(--k-surface-hover, #f1f5f9) !important;
}
.k-map .leaflet-bar {
    border-color: var(--k-border, #e2e8f0) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.k-map .leaflet-control-attribution {
    background: var(--k-surface, rgba(255,255,255,0.8)) !important;
    color: var(--k-text-muted) !important;
    font-size: 0.5rem;
}
</style>
