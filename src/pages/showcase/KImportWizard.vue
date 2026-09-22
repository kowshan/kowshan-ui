<template>
    <div class="sp">
        <h2 class="sp-title">KImportWizard</h2>
        <p class="sp-note">
            ویزارد ورود داده از CSV — ستون‌ها را به فیلدهای مدل نگاشت می‌کند و ردیف‌های معتبر را با رویداد
            <code>imported</code> برمی‌گرداند.
        </p>

        <h3 class="sp-sub">کاربران (CSV از قبل پر شده)</h3>
        <div class="sp-card">
            <KImportWizard :fields="userFields" :initial-text="userCsv" @imported="onImported" @skipped="onSkipped" />
        </div>

        <h3 class="sp-sub">محصولات (CSV با ستون‌های بیشتر)</h3>
        <div class="sp-card">
            <KImportWizard :fields="productFields" :initial-text="productCsv" @imported="onImported" @skipped="onSkipped" />
        </div>

        <h3 class="sp-sub">بدون ستون از پیش تعریف‌شده</h3>
        <div class="sp-card">
            <KImportWizard />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">imported: {{ importedCount }} ردیف</div>
        <div class="sp-vmodel">skipped: {{ skippedCount }} ردیف</div>
        <div class="sp-vmodel">آخرین داده: {{ lastName }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KImportWizard, { type KImportField } from '../../ui-kit/components/KImportWizard.vue'

const userFields: KImportField[] = [
    { key: 'name', label: 'نام و نام خانوادگی' },
    { key: 'phone', label: 'شماره موبایل' },
    { key: 'email', label: 'ایمیل' },
    { key: 'city', label: 'شهر' },
]

const productFields: KImportField[] = [
    { key: 'title', label: 'عنوان محصول' },
    { key: 'price', label: 'قیمت' },
    { key: 'stock', label: 'موجودی' },
    { key: 'category', label: 'دسته‌بندی' },
]

const userCsv = `name,phone,email,city
علی رضایی,09121234567,ali@example.com,تهران
مریم احمدی,09351112233,maryam@example.com,شیراز
حسین کریمی,,hossein@example.com,اصفهان`

const productCsv = `title,price,stock,category
هدفون بی‌سیم,2500000,12,صوتی
کیبورد مکانیکی,4800000,5,لوازم جانبی`

const importedCount = ref(0)
const skippedCount = ref(0)
const lastName = ref('—')

const onImported = (rows: Record<string, any>[]) => {
    importedCount.value += rows.length
    lastName.value = rows[0] ? JSON.stringify(rows[0]) : '—'
}
const onSkipped = (count: number) => { skippedCount.value += count }
</script>
