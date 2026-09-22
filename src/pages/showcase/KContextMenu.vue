<template>
    <div class="sp">
        <h2 class="sp-title">KContextMenu</h2>
        <p class="sp-note">کلیک راست کنید</p>
        <KContextMenu :items="items" />
    </div>
</template>

<script setup lang="ts">
import KContextMenu from '../../ui-kit/components/KContextMenu.vue'
const items = [
    { label: 'ویرایش', icon: 'Edit' },
    { label: 'حذف', icon: 'Trash2' },
    { label: 'کپی', icon: 'Copy' },
    { label: 'انتقال', icon: 'Move' },
]
</script>
