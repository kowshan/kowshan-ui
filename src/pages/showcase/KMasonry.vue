<template>
    <div class="sp">
        <h2 class="sp-title">KMasonry</h2>
        <p class="sp-note">چیدمان ستونی نامتقارن — ارتفاع هر آیتم تعیین می‌کند در کدام ستون بنشیند. آیتم‌ها با اسلات پیش‌فرض رندر می‌شوند.</p>

        <h3 class="sp-sub">سه ستون (پیش‌فرض)</h3>
        <KMasonry :items="cards">
            <template #default="{ item }">
                <div class="ms-card" :style="{ height: item.h + 'px' }">
                    <strong>{{ item.title }}</strong>
                    <span class="ms-price">{{ item.price }} تومان</span>
                </div>
            </template>
        </KMasonry>

        <h3 class="sp-sub">دو ستون</h3>
        <KMasonry :items="cards" :columns="2">
            <template #default="{ item }">
                <div class="ms-card" :style="{ height: item.h + 'px' }">
                    <strong>{{ item.title }}</strong>
                    <span class="ms-price">{{ item.price }} تومان</span>
                </div>
            </template>
        </KMasonry>

        <h3 class="sp-sub">چهار ستون با فاصله کمتر</h3>
        <KMasonry :items="cards" :columns="4" :gap="8">
            <template #default="{ item }">
                <div class="ms-card" :style="{ height: item.h + 'px' }">
                    <strong>{{ item.title }}</strong>
                </div>
            </template>
        </KMasonry>

        <!-- `stagger` pushes every *other* column down: first column never, the
             second one by n px, the third again not — the "wall" look. -->
        <h3 class="sp-sub">پله‌ای — <code>stagger</code></h3>
        <p class="sp-note">
            <code>stagger</code> به پیکسل، ستون دوم را پایین‌هل می‌دهد (ستون اول هرگز، سومی دوباره
            نه) تا دیوار شروع پله‌ای بگیرد. ستون اولِ نمونهٔ «سه ستون» بالا همین حالت با مقدار صفر است.
        </p>
        <KMasonry :items="cards" :columns="3" :gap="12" :stagger="34">
            <template #default="{ item }">
                <div class="ms-card" :style="{ height: item.h + 'px' }">
                    <strong>{{ item.title }}</strong>
                    <span class="ms-price">{{ item.price }} تومان</span>
                </div>
            </template>
        </KMasonry>

        <h3 class="sp-sub">همان دیوار با <code>stagger="0"</code> (پیش‌فرض)</h3>
        <KMasonry :items="cards" :columns="3" :gap="12">
            <template #default="{ item }">
                <div class="ms-card" :style="{ height: item.h + 'px' }">
                    <strong>{{ item.title }}</strong>
                    <span class="ms-price">{{ item.price }} تومان</span>
                </div>
            </template>
        </KMasonry>

        <h3 class="sp-sub">تصاویر با ارتفاع محدود (min/max)</h3>
        <KMasonry :items="images" :columns="3" :min-item-height="90" :max-item-height="200">
            <template #default="{ item }">
                <img :src="item.src" :alt="item.alt" class="ms-img" />
            </template>
        </KMasonry>

        <h3 class="sp-sub">متن‌های بلند (ارتفاع نامنظم واقعی)</h3>
        <KMasonry :items="notes" :columns="3" :gap="12">
            <template #default="{ item }">
                <div class="ms-note">
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.body }}</p>
                </div>
            </template>
        </KMasonry>
    </div>
</template>

<script setup lang="ts">
import KMasonry from '../../ui-kit/components/KMasonry.vue'

const svg = (w: number, h: number, from: string, to: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(%23g)'/></svg>`

const cards = [
    { title: 'هدفون بی‌سیم', price: '۲٫۵۰۰٫۰۰۰', h: 180 },
    { title: 'کیبورد مکانیکی', price: '۴٫۸۰۰٫۰۰۰', h: 240 },
    { title: 'ماوس گیمینگ', price: '۹۸۰٫۰۰۰', h: 140 },
    { title: 'پایه لپ‌تاپ', price: '۶۵۰٫۰۰۰', h: 120 },
    { title: 'پد ماوس', price: '۲۴۰٫۰۰۰', h: 200 },
    { title: 'هاب USB-C', price: '۱٫۲۰۰٫۰۰۰', h: 160 },
    { title: 'کابل شارژ', price: '۱۸۰٫۰۰۰', h: 110 },
    { title: 'وب‌کم Full HD', price: '۲٫۱۰۰٫۰۰۰', h: 220 },
]

const images = [
    { src: svg(400, 600, '0ea5e9', '1db954'), alt: 'تصویر بلند' },
    { src: svg(400, 300, '8B5CF6', 'ec4899'), alt: 'تصویر کوتاه' },
    { src: svg(400, 450, 'f59e0b', 'ef4444'), alt: 'تصویر متوسط' },
    { src: svg(400, 700, '22c55e', '84cc16'), alt: 'تصویر خیلی بلند' },
    { src: svg(400, 350, '6366f1', '0ea5e9'), alt: 'تصویر کوتاه ۲' },
]

const notes = [
    { title: 'جلسه تیم', body: 'بررسی نقشه راه سهماهه و تقسیم تسک‌ها بین اعضای تیم محصول.' },
    { title: 'ایده محصول', body: 'افزودن حالت آفلاین به اپلیکیشن آموزشگاه با کش کردن درس‌های ویدیویی دیده‌شده. این متن عمداً طولانی‌تر است تا ارتفاع کارت متفاوت شود.' },
    { title: 'بازخورد کاربر', body: 'کاربران از سرعت بارگذاری راضی‌اند، اما درخواست جستجوی پیشرفته دارند.' },
    { title: 'باگ گزارش‌شده', body: 'در حالت اولد، رنگ متن راهنما کم‌کنتراست می‌شود.' },
    { title: 'یادداشت کوتاه', body: 'فردا جلسه دمو.' },
]
</script>

<style scoped>
.ms-card {
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    box-sizing: border-box;
}
.ms-card strong { font-size: 0.8rem; color: var(--k-text-primary); }
.ms-price { font-size: 0.72rem; color: var(--k-success, #22c55e); font-weight: 700; }
.ms-img { width: 100%; display: block; border-radius: 10px; object-fit: cover; }
.ms-note {
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: 12px;
    padding: 12px;
}
.ms-note strong { font-size: 0.8rem; color: var(--k-text-primary); }
.ms-note p { margin: 6px 0 0; font-size: 0.74rem; line-height: 1.7; color: var(--k-text-secondary); }
</style>
