<template>
    <div class="sp">
        <h2 class="sp-title">KButton</h2>

        <h3 class="sp-sub">رنگ‌های مختلف</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <KButton text="اصلی" bg-color="var(--k-primary)" text-color="#fff" />
            <KButton text="موفقیت" bg-color="var(--k-success)" text-color="#fff" />
            <KButton text="هشدار" bg-color="var(--k-warning)" text-color="#fff" />
            <KButton text="خطر" bg-color="var(--k-error)" text-color="#fff" />
            <KButton text="اطلاعات" bg-color="var(--k-info)" text-color="#fff" />
            <KButton text="خطی" border="solid" border-color="var(--k-border)" bg-color="transparent" text-color="var(--k-text-primary)" />
        </div>

        <h3 class="sp-sub">سایزها</h3>
        <div style="display:flex;gap:8px;align-items:center">
            <KButton text="XS" style="height:24px;padding:0 8px;font-size:0.7rem" />
            <KButton text="SM" style="height:30px;padding:0 10px;font-size:0.75rem" />
            <KButton text="MD" style="height:36px;padding:0 14px;font-size:0.8rem" />
            <KButton text="LG" style="height:44px;padding:0 20px;font-size:0.9rem" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <KButton text="غیرفعال" style="opacity:0.5;pointer-events:none" />

        <h3 class="sp-sub">سایه</h3>
        <KButton text="با سایه" :shadow="true" shadow-color="rgba(29,185,84,0.4)" bg-color="var(--k-primary)" text-color="#fff" />
    </div>
</template>

<script setup lang="ts">
import KButton from '../../ui-kit/components/KButton.vue'
</script>
