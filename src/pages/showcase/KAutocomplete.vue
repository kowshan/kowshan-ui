<template>
    <div class="sp">
        <h2 class="sp-title">KAutocomplete</h2>

        <h3 class="sp-sub">ساده</h3>
        <KAutocomplete v-model="val1" :options="options" placeholder="شهر را انتخاب کنید..." />

        <p class="sp-note">مقدار: {{ val1 || '—' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAutocomplete from '../../ui-kit/components/KAutocomplete.vue'

const val1 = ref('')
const options = [
    { label: 'تهران', value: 'tehran' },
    { label: 'اصفهان', value: 'isfahan' },
    { label: 'شیراز', value: 'shiraz' },
    { label: 'تبریز', value: 'tabriz' },
    { label: 'مشهد', value: 'mashhad' },
]
</script>
