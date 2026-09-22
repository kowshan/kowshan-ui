<template>
    <div class="sp">
        <h2 class="sp-title">KBottomNav</h2>

        <h3 class="sp-sub">ساده</h3>
        <KBottomNav v-model="active" :items="items" />

        <p class="sp-note">انتخاب شده: {{ active }}</p>

        <h3 class="sp-sub">شناور</h3>
        <KBottomNav v-model="active2" :items="items" :floating="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KBottomNav from '../../ui-kit/components/KBottomNav.vue'
const active = ref('home')
const active2 = ref('search')
const items = [
    { id: 'home', label: 'خانه', icon: 'Home' },
    { id: 'search', label: 'جستجو', icon: 'Search' },
    { id: 'notifications', label: 'اعلان‌ها', icon: 'Bell', badge: 3 },
    { id: 'profile', label: 'پروفایل', icon: 'User' },
]
</script>
