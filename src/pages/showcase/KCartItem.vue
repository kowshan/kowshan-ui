<template>
    <div class="sp">
        <h2 class="sp-title">KCartItem</h2>
        <div style="max-width:500px;display:flex;flex-direction:column;gap:12px">
            <KCartItem v-for="item in items" :key="item.id" :item="item" currency="تومان" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KCartItem from '../../ui-kit/components/KCartItem.vue'
const items = [
    { id: '1', title: 'دوره Vue 3 پیشرفته', meta: 'آموزش Composition API', price: 299000, oldPrice: 499000, image: '', qty: 1 },
    { id: '2', title: 'دوره TypeScript', price: 199000, qty: 2, image: '' },
    { id: '3', title: 'کتاب طراحی رابط کاربری', meta: 'اصول UI/UX', price: 89000, image: '', qty: 1 },
]
</script>
