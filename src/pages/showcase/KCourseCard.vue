<template>
    <div class="sp">
        <h2 class="sp-title">KCourseCard</h2>
        <div style="max-width:350px">
            <KCourseCard v-bind="course" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KCourseCard from '../../ui-kit/components/KCourseCard.vue'
const course = {
    title: 'آموزش Vue 3 از صفر', instructor: 'استاد محمدی',
    price: 299000, oldPrice: 499000, discount: '۴۰٪',
    rating: 4.8, reviews: 1250, lessons: 24, hours: 12,
    progress: 35, durationBadge: '۱۲ ساعت',
}
</script>
