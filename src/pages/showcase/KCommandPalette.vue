<template>
    <div class="sp">
        <h2 class="sp-title">KCommandPalette</h2>
        <p class="sp-note">Ctrl+K یا دکمه زیر</p>
        <KButton label="باز کردن" @click="show = true" />
        <KCommandPalette v-model:visible="show" :groups="groups" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KCommandPalette from '../../ui-kit/components/KCommandPalette.vue'
import KButton from '../../ui-kit/components/KButton.vue'
const show = ref(false)
const groups = [
    { id: 'nav', title: 'ناوبری', items: [{ id: '1', label: 'خانه' }, { id: '2', label: 'تنظیمات' }, { id: '3', label: 'پروفایل' }] },
    { id: 'actions', title: 'عملیات', items: [{ id: '4', label: 'ایجاد جدید' }, { id: '5', label: 'حذف' }] },
]
</script>
