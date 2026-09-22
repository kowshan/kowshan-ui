<template>
    <div class="sp">
        <h2 class="sp-title">KAlert</h2>

        <h3 class="sp-sub">انواع</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
            <KAlert variant="info" title="اطلاعات" description="این یک پیام اطلاعاتی است" />
            <KAlert variant="success" title="موفقیت" description="عملیات با موفقیت انجام شد" />
            <KAlert variant="warning" title="هشدار" description="لطفاً موارد زیر را بررسی کنید" />
            <KAlert variant="danger" title="خطا" description="مشکلی در انجام عملیات رخ داد" />
        </div>

        <h3 class="sp-sub">با دکمه بستن</h3>
        <KAlert variant="success" title="موفقیت" description="عملیات با موفقیت انجام شد" :closable="true" />

        <h3 class="sp-sub">بدون آیکون</h3>
        <KAlert variant="warning" title="هشدار" description="پیام بدون آیکون" :show-icon="false" />

        <h3 class="sp-sub">فقط عنوان</h3>
        <KAlert variant="info" title="فقط یک پیام ساده" />
    </div>
</template>

<script setup lang="ts">
import KAlert from '../../ui-kit/components/KAlert.vue'
</script>
