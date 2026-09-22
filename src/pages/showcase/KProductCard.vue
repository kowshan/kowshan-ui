<template>
    <div class="sp">
        <h2 class="sp-title">KProductCard</h2>

        <h3 class="sp-sub">تک‌کارت پایه</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#22c55e', '#16a34a', 'کتاب')"
                title="کتاب ۵۰۴ واژه ضروری"
                category="کتاب آموزشی"
                :price="185000"
                :rating="4.6"
                :reviews="128"
                @add-to-cart="onAdd('کتاب ۵۰۴')"
                @toggle-favorite="onFav('کتاب ۵۰۴')"
            />
        </div>

        <h3 class="sp-sub">با تخفیف و برچسب</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#8b5cf6', '#6366f1', 'دوره')"
                title="دوره جامع مکالمه انگلیسی"
                category="دوره ویدیویی"
                :price="1290000"
                :old-price="1990000"
                discount="۳۵٪ تخفیف"
                badge="پرفروش"
                badge-color="#f59e0b"
                :rating="4.9"
                :reviews="412"
                @add-to-cart="onAdd('دوره مکالمه')"
                @toggle-favorite="onFav('دوره مکالمه')"
            />
        </div>

        <h3 class="sp-sub">علاقه‌مندی فعال + بدون تخفیف</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#0ea5e9', '#06b6d4', 'فلش')"
                title="فلش‌کارت لغات آیلتس"
                category="لوازم کمک‌آموزشی"
                :price="420000"
                :rating="4.2"
                :reviews="57"
                :favorited="true"
                @add-to-cart="onAdd('فلش‌کارت')"
                @toggle-favorite="onFav('فلش‌کارت')"
            />
        </div>

        <h3 class="sp-sub">ناموجود</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#94a3b8', '#64748b', 'چاپ')"
                title="چاپ اختصاصی جزوه"
                category="خدمات"
                :price="95000"
                :rating="4.0"
                :reviews="12"
                :out-of-stock="true"
                badge="ناموجود"
                badge-color="#ef4444"
                @add-to-cart="onAdd('چاپ جزوه')"
            />
        </div>

        <h3 class="sp-sub">بدون امتیاز و دسته‌بندی</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#f472b6', '#db2777', 'هدیه')"
                title="کارت هدیه آموزشگاه"
                :price="500000"
                @add-to-cart="onAdd('کارت هدیه')"
            />
        </div>

        <h3 class="sp-sub">واحد پول دلاری</h3>
        <div class="sp-row">
            <KProductCard
                :image="img('#14b8a6', '#0d9488', 'IELTS')"
                title="IELTS Speaking Course"
                category="Online course"
                :price="49"
                :old-price="79"
                discount="38% OFF"
                currency="$"
                :rating="4.8"
                :reviews="96"
                @add-to-cart="onAdd('IELTS')"
            />
        </div>

        <h3 class="sp-sub">فروشگاه — شبکه‌ای</h3>
        <div class="pc-grid">
            <KProductCard
                v-for="p in products"
                :key="p.title"
                :image="p.image"
                :title="p.title"
                :category="p.category"
                :price="p.price"
                :old-price="p.oldPrice"
                :discount="p.discount"
                :rating="p.rating"
                :reviews="p.reviews"
                :favorited="favorites.has(p.title)"
                :badge="p.badge"
                :badge-color="p.badgeColor"
                @add-to-cart="onAdd(p.title)"
                @toggle-favorite="onFav(p.title)"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            سبد خرید: {{ cart.length ? cart.join('، ') : '—' }}<br />
            علاقه‌مندی‌ها: {{ [...favorites].join('، ') || '—' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KProductCard from '../../ui-kit/components/KProductCard.vue'

const img = (from: string, to: string, label: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='400' height='300' fill='url(%23g)'/><circle cx='330' cy='60' r='90' fill='%23ffffff' opacity='0.12'/><circle cx='60' cy='250' r='70' fill='%23ffffff' opacity='0.10'/><text x='200' y='165' font-size='34' text-anchor='middle' fill='%23ffffff' opacity='0.9'>${label}</text></svg>`

const cart = ref<string[]>([])
const favorites = ref(new Set<string>())

const onAdd = (title: string) => { cart.value = [...cart.value, title] }
const onFav = (title: string) => {
    const next = new Set(favorites.value)
    next.has(title) ? next.delete(title) : next.add(title)
    favorites.value = next
}

const products = [
    { title: 'گرامر پیشرفته', category: 'کتاب', price: 260000, oldPrice: 320000, discount: '۱۹٪ تخفیف', rating: 4.5, reviews: 84, badge: 'جدید', badgeColor: '#6366f1', image: img('#6366f1', '#4338ca', 'گرامر') },
    { title: 'کلاس آنلاین اسپیکینگ', category: 'دوره زنده', price: 890000, oldPrice: 0, discount: '', rating: 4.7, reviews: 210, badge: '', badgeColor: '#1db954', image: img('#f59e0b', '#d97706', 'اسپیک') },
    { title: 'دیکشنری تصویری', category: 'کتاب', price: 340000, oldPrice: 0, discount: '', rating: 4.3, reviews: 41, badge: '', badgeColor: '#1db954', image: img('#ef4444', '#b91c1c', 'دیکشنری') },
    { title: 'پکیج صوتی تلفظ', category: 'فایل صوتی', price: 150000, oldPrice: 220000, discount: '۳۲٪ تخفیف', rating: 4.9, reviews: 320, badge: 'ویژه', badgeColor: '#8b5cf6', image: img('#14b8a6', '#0f766e', 'صوت') },
]
</script>

<style scoped>
.pc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
}
</style>
