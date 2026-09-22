<template>
    <div class="sp">
        <h2 class="sp-title">KAvatarGroup</h2>

        <h3 class="sp-sub">سایز کوچک</h3>
        <KAvatarGroup :items="avatars" size="sm" :max="4" />

        <h3 class="sp-sub">سایز متوسط</h3>
        <KAvatarGroup :items="avatars" size="md" :max="3" />

        <h3 class="sp-sub">سایز بزرگ</h3>
        <KAvatarGroup :items="avatars" size="lg" :max="5" />
    </div>
</template>

<script setup lang="ts">
import KAvatarGroup from '../../ui-kit/components/KAvatarGroup.vue'

const avatars = [
    { name: 'علی رضایی' },
    { name: 'سارا احمدی' },
    { name: 'محمد محمدی' },
    { name: 'زهرا کریمی' },
    { name: 'حسین عباسی' },
    { name: 'نیلوفر احمدی' },
]
</script>
