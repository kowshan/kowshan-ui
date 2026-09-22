<template>
    <div class="sp">
        <h2 class="sp-title">KProgress</h2>

        <h3 class="sp-sub">وضعیت‌ها (variant)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px; max-width: 520px;">
            <KProgress v-for="v in variants" :key="v" :model-value="62" :variant="v" :label="variantsLabel[v]" :show-percent="true" />
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px; max-width: 520px;">
            <KProgress v-for="s in sizes" :key="s" :model-value="45" :size="s" :label="`سایز ${s}`" />
        </div>

        <h3 class="sp-sub">راه‌راه (striped) و متحرک</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px; max-width: 520px;">
            <KProgress :model-value="70" striped label="راه‌راه" />
            <KProgress :model-value="70" striped animated variant="success" label="راه‌راه متحرک" />
            <KProgress :model-value="70" animated variant="warning" label="متحرک (بدون راه‌راه)" />
        </div>

        <h3 class="sp-sub">نامعین (indeterminate)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KProgress indeterminate label="در حال بارگذاری…" />
        </div>

        <h3 class="sp-sub">رنگ سفارشی</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px; max-width: 520px;">
            <KProgress :model-value="88" color="#8b5cf6" label="بنفش سفارشی" :show-percent="true" />
            <KProgress :model-value="33" color="linear-gradient(90deg, #f59e0b, #ef4444)" label="گرادیان" :show-percent="true" />
        </div>

        <h3 class="sp-sub">مقادیر مرزی (۰ ، ۱۰۰ ، بیشتر از ۱۰۰ ، منفی)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px; max-width: 520px;">
            <KProgress :model-value="0" label="صفر" :show-percent="true" />
            <KProgress :model-value="100" label="صد" :show-percent="true" variant="success" />
            <KProgress :model-value="140" label="۱۴۰ (باید به ۱۰۰ محدود شود)" :show-percent="true" variant="danger" />
            <KProgress :model-value="-20" label="منفی (باید صفر شود)" :show-percent="true" />
        </div>

        <h3 class="sp-sub">زنده — با دکمه</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KProgress :model-value="live" :show-percent="true" label="پیشرفت آپلود" :variant="live === 100 ? 'success' : 'primary'" />
            <div style="display: flex; gap: 8px; margin-top: 12px;">
                <KButton text="+۱۰" @click="live = Math.min(100, live + 10)" />
                <KButton text="بازنشانی" :bg-color="'transparent'" @click="live = 0" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KProgress from '../../ui-kit/components/KProgress.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const variants = ['primary', 'success', 'warning', 'danger', 'info'] as const
const sizes = ['sm', 'md', 'lg'] as const
const variantsLabel: Record<string, string> = {
    primary: 'اصلی',
    success: 'موفق',
    warning: 'هشدار',
    danger: 'خطر',
    info: 'اطلاع',
}

const live = ref(30)
</script>
