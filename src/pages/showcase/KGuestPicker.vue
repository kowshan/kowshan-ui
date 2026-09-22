<template>
    <div class="sp">
        <h2 class="sp-title">KGuestPicker</h2>

        <h3 class="sp-sub">پایه (رزرو هتل)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KGuestPicker v-model="basic" @change="onChange" />
            <div class="sp-vmodel">v-model: {{ JSON.stringify(basic) }}</div>
            <div class="sp-vmodel">change event: {{ lastChange }}</div>
        </div>

        <h3 class="sp-sub">مقادیر اولیه</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KGuestPicker v-model="preset" />
            <div class="sp-vmodel">v-model: {{ JSON.stringify(preset) }}</div>
        </div>

        <h3 class="sp-sub">کنفیگ سفارشی (تور)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KGuestPicker v-model="tour" :config="tourConfig" />
            <div class="sp-vmodel">v-model: {{ JSON.stringify(tour) }}</div>
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KGuestPicker v-model="basic" disabled />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KGuestPicker from '../../ui-kit/components/KGuestPicker.vue'

const basic = ref({ adults: 2, children: 0, rooms: 1 })
const preset = ref({ adults: 3, children: 2, rooms: 1 })
const tour = ref({ adults: 1, children: 0, rooms: 0 })
const lastChange = ref('—')

const tourConfig = {
    adults: { label: 'مسافر', sub: '۱۲ سال به بالا', min: 1, max: 6 },
    children: { label: 'کودک', sub: '۲ تا ۱۲ سال', min: 0, max: 4 },
    rooms: { label: 'اتاق', sub: '', min: 0, max: 3 },
    defaults: { adults: 1, children: 0, rooms: 0 },
}

const onChange = (v: { adults: number; children: number; rooms: number }) => {
    lastChange.value = JSON.stringify(v)
}
</script>
