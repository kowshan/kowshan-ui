<template>
    <div class="sp">
        <h2 class="sp-title">KAppBar</h2>

        <h3 class="sp-sub">ساده</h3>
        <KAppBar title="نوار ابزار" />

        <h3 class="sp-sub">با دکمه‌ها</h3>
        <KAppBar title="مدیریت کاربران">
            <template #right>
                <KButton label="ذخیره" size="sm" />
                <KButton label="انصراف" size="sm" variant="outline" />
            </template>
        </KAppBar>

        <h3 class="sp-sub">با جستجو</h3>
        <KAppBar title="جستجوی پیشرفته">
            <template #right>
                <KSearchInput placeholder="جستجو..." />
            </template>
        </KAppBar>
    </div>
</template>

<script setup lang="ts">
import KAppBar from '../../ui-kit/components/KAppBar.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KSearchInput from '../../ui-kit/components/KSearchInput.vue'
</script>
