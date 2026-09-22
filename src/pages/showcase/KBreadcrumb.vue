<template>
    <div class="sp">
        <h2 class="sp-title">KBreadcrumb</h2>

        <h3 class="sp-sub">ساده</h3>
        <KBreadcrumb :items="items" />

        <h3 class="sp-sub">عمیق</h3>
        <KBreadcrumb :items="deepItems" />
    </div>
</template>

<script setup lang="ts">
import KBreadcrumb from '../../ui-kit/components/KBreadcrumb.vue'
const items = [
    { label: 'خانه', to: '/' },
    { label: 'محصولات', to: '/products' },
    { label: 'جزئیات' },
]
const deepItems = [
    { label: 'داشبورد', to: '/' },
    { label: 'کاربران', to: '/users' },
    { label: 'پروفایل', to: '/users/1' },
    { label: 'ویرایش' },
]
</script>
