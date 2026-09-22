<template>
    <div class="sp">
        <h2 class="sp-title">KBookmarkBar</h2>
        <KBookmarkBar :bookmarks="bookmarks" />
    </div>
</template>

<script setup lang="ts">
import KBookmarkBar from '../../ui-kit/components/KBookmarkBar.vue'
const bookmarks = [
    { id: '1', name: 'گوگل', url: 'https://google.com' },
    { id: '2', name: 'گیت‌هاب', url: 'https://github.com' },
    { id: '3', name: 'یوتیوب', url: 'https://youtube.com' },
]
</script>
