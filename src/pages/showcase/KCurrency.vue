<template>
    <div class="sp">
        <h2 class="sp-title">KCurrency</h2>

        <h3 class="sp-sub">پایه</h3>
        <KCurrency v-model="price" label="قیمت" />
        <p class="sp-note">مقدار: {{ price }}</p>

        <h3 class="sp-sub">با hint</h3>
        <KCurrency v-model="price2" label="مبلغ پرداختی" hint="به تومان وارد کنید" />

        <h3 class="sp-sub">خطا</h3>
        <KCurrency v-model="price3" label="مبلغ" error="مبلغ نامعتبر است" />

        <h3 class="sp-sub">غیرفعال</h3>
        <KCurrency :model-value="250000" label="غیرفعال" disabled />

        <h3 class="sp-sub">واحد ارز (show-symbol)</h3>
        <KCurrency v-model="price4" label="به تومان" show-symbol />
        <KCurrency v-model="price5" label="دلار" currency="USD" show-symbol :decimals="2" />

        <h3 class="sp-sub">لوکال (نماد و ارقام)</h3>
        <KCurrency v-model="price6" label="fa-IR — ارقام فارسی" locale="fa-IR" show-symbol />
        <KCurrency v-model="price7" label="en-US — ارقام لاتین" locale="en-US" currency="USD" :decimals="2" />

        <h3 class="sp-sub">min / max</h3>
        <KCurrency v-model="price8" label="حداقل ۱۰٬۰۰۰" :min="10000" hint="کمتر از حد مجاز خطا می‌دهد" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KCurrency from '../../ui-kit/wrappers/KCurrency.vue'

const price = ref(null)
const price2 = ref(null)
const price3 = ref(null)
const price4 = ref(null)
const price5 = ref<number | null>(250000)
const price6 = ref<number | null>(1250000)
const price7 = ref<number | null>(199.9)
const price8 = ref<number | null>(null)
</script>
