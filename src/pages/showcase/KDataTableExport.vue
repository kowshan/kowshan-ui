<template>
    <div class="sp">
        <h2 class="sp-title">KDataTableExport</h2>

        <h3 class="sp-sub">همه گزینه‌ها (CSV / JSON / چاپ)</h3>
        <KDataTable :data="rows" :columns="cols" :no-header="true" />
        <KDataTableExport
            :columns="cols"
            :rows="rows"
            filename="employees"
        />

        <h3 class="sp-sub">فقط CSV</h3>
        <KDataTable :data="rows" :columns="cols" :no-header="true" />
        <KDataTableExport
            :columns="cols"
            :rows="rows"
            :show-json="false"
            :show-print="false"
        />

        <h3 class="sp-sub">با ستون فرمت‌شده (قیمت)</h3>
        <KDataTable :data="products" :columns="priceCols" :no-header="true" />
        <KDataTableExport
            :columns="priceCols"
            :rows="products"
            filename="products"
        />
    </div>
</template>

<script setup lang="ts">
import KDataTableExport from '../../ui-kit/components/KDataTableExport.vue'
import KDataTable from '../../ui-kit/wrappers/KDataTable.vue'

const rows = [
    { name: 'علی رضایی', age: 28, city: 'تهران' },
    { name: 'سارا محمدی', age: 32, city: 'اصفهان' },
    { name: 'محمد کریمی', age: 25, city: 'شیراز' },
]

const cols = [
    { key: 'name', label: 'نام' },
    { key: 'age', label: 'سن' },
    { key: 'city', label: 'شهر' },
]

const products = [
    { title: 'دوره Vue 3', price: 299000, stock: 12 },
    { title: 'دوره Nuxt', price: 450000, stock: 5 },
]

const priceCols = [
    { key: 'title', label: 'محصول' },
    { key: 'price', label: 'قیمت', format: (v: number) => `${v.toLocaleString('en-US')} تومان` },
    { key: 'stock', label: 'موجودی' },
]
</script>
