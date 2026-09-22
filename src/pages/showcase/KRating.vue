<template>
    <div class="sp">
        <h2 class="sp-title">KRating</h2>

        <h3 class="sp-sub">پایه — قابل تغییر</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KRating v-model="r1" label="امتیاز شما" @change="onChange" />
            <div class="sp-vmodel">مقدار: {{ r1 }} — آخرین change: {{ lastChange ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KRating v-model="r2" size="sm" show-value label="کوچک" />
            <KRating v-model="r2" size="md" show-value label="متوسط" />
            <KRating v-model="r2" size="lg" show-value label="بزرگ" />
        </div>

        <h3 class="sp-sub">حداکثر ۱۰ ستاره</h3>
        <div class="sp-card">
            <KRating v-model="r3" :max="10" show-value label="نمره از ۱۰" />
        </div>

        <h3 class="sp-sub">نیم‌ستاره</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KRating v-model="r4" :show-half="true" show-value label="با نیم‌ستاره — دوباره روی ستاره فعال بزنید" />
            <div class="sp-vmodel">مقدار: {{ r4 }}</div>
        </div>

        <h3 class="sp-sub">فقط نمایش (readonly) — نمرات کسر‌اعشاری</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px;">
            <KRating v-for="s in scores" :key="s.name" :model-value="s.value" readonly show-value :label="s.name" />
        </div>

        <h3 class="sp-sub">رنگ سفارشی</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KRating v-model="r5" color="#6366f1" label="بنفش" show-value />
            <KRating v-model="r5" color="#22c55e" label="سبز" show-value />
            <KRating v-model="r5" color="#ef4444" label="قرمز" show-value />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card">
            <KRating v-model="r6" disabled show-value label="غیرقابل تغییر" />
        </div>

        <h3 class="sp-sub">بدون برچسب و مقدار</h3>
        <div class="sp-card">
            <KRating v-model="r7" />
        </div>

        <h3 class="sp-sub">در کارت محصول (ترکیب نمایشی)</h3>
        <div class="sp-card">
            <div
                v-for="p in products"
                :key="p.name"
                style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--k-border);"
            >
                <span style="font-size: 0.85rem;">{{ p.name }}</span>
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <KRating :model-value="p.rating" readonly size="sm" />
                    <span style="font-size: 0.75rem; color: var(--k-text-secondary);">({{ p.reviews }} نظر)</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KRating from '../../ui-kit/components/KRating.vue'

const r1 = ref(3)
const r2 = ref(4)
const r3 = ref(7)
const r4 = ref(3.5)
const r5 = ref(4)
const r6 = ref(2)
const r7 = ref(0)

const lastChange = ref<number | null>(null)
const onChange = (v: number) => { lastChange.value = v }

const scores = [
    { name: 'کیفیت تدریس', value: 4.5 },
    { name: 'پشتیبانی', value: 3 },
    { name: 'محتوای دوره', value: 5 },
    { name: 'قیمت', value: 2.5 },
]

const products = [
    { name: 'دوره مکالمه انگلیسی', rating: 4.5, reviews: 412 },
    { name: 'کتاب ۵۰۴ واژه', rating: 4, reviews: 128 },
    { name: 'فلش‌کارت آیلتس', rating: 3.5, reviews: 57 },
]
</script>
