<template>
    <div class="sp">
        <h2 class="sp-title">KInlineEdit</h2>

        <h3 class="sp-sub">متن</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KInlineEdit v-model="text" label="عنوان پروژه" placeholder="عنوان را وارد کنید" @save="onSave" @cancel="cancels++" />
            <div class="sp-vmodel">v-model: {{ text }}</div>
        </div>

        <h3 class="sp-sub">عدد</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KInlineEdit v-model="qty" type="number" label="تعداد موجودی" />
            <div class="sp-vmodel">v-model: {{ qty }}</div>
        </div>

        <h3 class="sp-sub">انتخاب (select)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KInlineEdit v-model="status" type="select" :options="statuses" label="وضعیت سفارش" />
            <div class="sp-vmodel">v-model: {{ status }}</div>
        </div>

        <h3 class="sp-sub">ذخیره فقط با Enter (saveOnBlur = false)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KInlineEdit v-model="noBlur" label="ایمیل" :save-on-blur="false" />
            <div class="sp-vmodel">v-model: {{ noBlur }}</div>
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KInlineEdit v-model="locked" label="شناسه" :disabled="true" />
        </div>

        <h3 class="sp-sub">درون جدول (ویرایش سریع ردیف‌ها)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <div class="ie-row" v-for="row in rows" :key="row.id">
                <span class="ie-id">#{{ row.id }}</span>
                <KInlineEdit v-model="row.name" label="نام" />
                <KInlineEdit v-model="row.city" type="select" :options="cities" label="شهر" />
            </div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">save: {{ lastSave }} · cancel: {{ cancels }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import KInlineEdit from '../../ui-kit/components/KInlineEdit.vue'

const text = ref('پروژه فروشگاه')
const qty = ref(12)
const status = ref('در انتظار')
const noBlur = ref('user@example.com')
const locked = ref('SKU-1002')

const statuses = ['در انتظار', 'در حال ارسال', 'تحویل شده', 'لغو شده']
const cities = ['تهران', 'شیراز', 'اصفهان', 'مشهد']

const rows = reactive([
    { id: 1, name: 'علی رضایی', city: 'تهران' },
    { id: 2, name: 'مریم احمدی', city: 'شیراز' },
    { id: 3, name: 'حسین کریمی', city: 'اصفهان' },
])

const lastSave = ref('—')
const cancels = ref(0)
const onSave = (v: string | number) => { lastSave.value = String(v) }
</script>

<style scoped>
.ie-row {
    display: grid; grid-template-columns: 40px 1fr 1fr; gap: 10px; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--k-border);
}
.ie-row:last-child { border-bottom: none; }
.ie-id { font-size: 0.72rem; color: var(--k-text-muted); direction: ltr; }
</style>
