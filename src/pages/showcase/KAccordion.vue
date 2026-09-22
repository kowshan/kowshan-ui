<template>
    <div class="sp">
        <h2 class="sp-title">KAccordion</h2>

        <h3 class="sp-sub">ساده</h3>
        <KAccordion :items="items" />

        <h3 class="sp-sub">چند باز</h3>
        <KAccordion :items="items" :multiple="true" />

        <h3 class="sp-sub">با border</h3>
        <KAccordion :items="items" :bordered="true" />
    </div>
</template>

<script setup lang="ts">
import KAccordion from '../../ui-kit/components/KAccordion.vue'

const items = [
    { id: '1', title: 'آیتم اول', content: 'محتوای آیتم اول اینجاست. این یک متن تست است.' },
    { id: '2', title: 'آیتم دوم', content: 'محتوای آیتم دوم اینجاست.' },
    { id: '3', title: 'آیتم سوم', content: 'محتوای آیتم سوم اینجاست. این هم یک متن طولانی‌تر است.' },
    { id: '4', title: 'آیتم غیرفعال', content: 'این آیتم غیرفعال است', disabled: true },
]
</script>
