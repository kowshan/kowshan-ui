<template>
    <div class="sp">
        <h2 class="sp-title">KNumberInput</h2>

        <h3 class="sp-sub">پایه (با تغییر رویداد)</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="qty" label="تعداد" @change="onChange" />
            <div class="sp-vmodel">v-model: {{ qty }}</div>
            <div class="sp-vmodel">change: {{ lastChange }}</div>
        </div>

        <h3 class="sp-sub">محدوده (۰ تا ۱۰)</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="bounded" label="تعداد نفرات" :min="0" :max="10" />
            <div class="sp-vmodel">v-model: {{ bounded }} — دکمه‌ها در لبه‌ها غیرفعال می‌شوند</div>
        </div>

        <h3 class="sp-sub">گام ۵</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="stepped" label="بسته ۵ تایی" :min="0" :max="50" :step="5" />
            <div class="sp-vmodel">v-model: {{ stepped }}</div>
        </div>

        <h3 class="sp-sub">محدوده منفی با گام اعشاری</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="decimal" label="دما (سانتی‌گراد)" :min="-10" :max="10" :step="0.5" />
            <div class="sp-vmodel">v-model: {{ decimal }}</div>
        </div>

        <h3 class="sp-sub">حالت خطا</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="qty" label="تعداد (نامعتبر)" :error="true" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 300px;">
            <KNumberInput v-model="qty" label="غیرفعال" :disabled="true" />
        </div>

        <h3 class="sp-sub">بدون برچسب (درون جدول/ردیف)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <div class="ni-row" v-for="row in rows" :key="row.id">
                <span class="ni-name">{{ row.name }}</span>
                <span class="ni-price">{{ row.price }} تومان</span>
                <KNumberInput v-model="row.qty" :min="1" :max="20" />
                <span class="ni-total">{{ (row.qty * row.unit).toLocaleString('fa-IR') }} تومان</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KNumberInput from '../../ui-kit/components/KNumberInput.vue'

const qty = ref(3)
const bounded = ref(5)
const stepped = ref(10)
const decimal = ref(0)
const lastChange = ref('—')

const onChange = (v: number) => { lastChange.value = String(v) }

const rows = reactive([
    { id: 1, name: 'هدفون بی‌سیم', price: '۲٫۵۰۰٫۰۰۰', unit: 2500000, qty: 1 },
    { id: 2, name: 'کیبورد مکانیکی', price: '۴٫۸۰۰٫۰۰۰', unit: 4800000, qty: 2 },
    { id: 3, name: 'پد ماوس', price: '۲۴۰٫۰۰۰', unit: 240000, qty: 3 },
])
</script>

<style scoped>
.ni-row {
    display: grid;
    grid-template-columns: 1.2fr 0.9fr 120px 0.9fr;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--k-border);
    font-size: 0.8rem;
}
.ni-row:last-child { border-bottom: none; }
.ni-name { color: var(--k-text-primary); font-weight: 600; }
.ni-price, .ni-total { color: var(--k-text-secondary); }
.ni-total { color: var(--k-success, #22c55e); font-weight: 700; }
</style>
