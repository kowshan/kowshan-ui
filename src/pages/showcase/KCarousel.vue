<template>
    <div class="sp">
        <h2 class="sp-title">KCarousel</h2>
        <KCarousel :items="items" />
    </div>
</template>

<script setup lang="ts">
import KCarousel from '../../ui-kit/components/KCarousel.vue'
const items = [
    { image: '', title: 'اسلاید اول', description: 'توضیحات اسلاید اول' },
    { image: '', title: 'اسلاید دوم', description: 'توضیحات اسلاید دوم' },
    { image: '', title: 'اسلاید سوم', description: 'توضیحات اسلاید سوم' },
]
</script>
