<template>
    <div class="sp">
        <h2 class="sp-title">KTestimonialCard</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard
                    quote="بعد از سه ماه کلاس، توانستم بدون ترجمه ذهنی مکالمه کنم. تمرین‌های شنیداری فوق‌العاده بود."
                    author-name="سارا محمدی"
                    author-role="زبان‌آموز سطح B1"
                    :author-image="avatar('#8b5cf6', '#6366f1', 'س')"
                    :rating="5"
                />
            </div>
        </div>

        <h3 class="sp-sub">variant = accent</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard
                    quote="پنل مدیریت دوره‌ها دقیقاً همان چیزی بود که برای آموزشگاه‌مان لازم داشتیم."
                    author-name="رضا کریمی"
                    author-role="مدیر آموزشگاه"
                    :author-image="avatar('#f59e0b', '#ef4444', 'ر')"
                    :rating="5"
                    variant="accent"
                />
            </div>
        </div>

        <h3 class="sp-sub">امتیازهای مختلف</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard
                    v-for="r in ratings"
                    :key="r.rating"
                    :quote="r.quote"
                    :author-name="r.name"
                    :author-role="r.role"
                    :author-image="avatar(r.from, r.to, r.letter)"
                    :rating="r.rating"
                />
            </div>
        </div>

        <h3 class="sp-sub">بدون آواتار و فقط نقل‌قول کوتاه</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard quote="سریع، ساده و کاربردی." author-name="مهمان" :rating="4" />
            </div>
        </div>

        <h3 class="sp-sub">نقل‌قول بلند</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard
                    quote="سه بار در دوره‌های آنلاین دیگر ثبت‌نام کرده بودم و هر بار نیمه‌راه رها کردم. اینجا تفاوت در پیگیری مدرس و تمرین‌های کوتاه روزانه بود؛ برای اولین بار تا پایان دوره ماندم و مدرک آیلتس ۷ گرفتم."
                    author-name="مینا رستمی"
                    author-role="دانش‌آموز دوره آیلتس"
                    :author-image="avatar('#22c55e', '#0d9488', 'م')"
                />
            </div>
        </div>

        <h3 class="sp-sub">اسلات محتوای دلخواه</h3>
        <div class="sp-card">
            <div class="t-grid">
                <KTestimonialCard author-name="امیر تهرانی" author-role="مهندس نرم‌افزار" :rating="5" variant="accent">
                    <p style="margin: 0;">
                        من به‌عنوان توسعه‌دهنده از
                        <strong>کامپوننت‌های این کیت</strong>
                        در پروژه Nuxt خودم استفاده کردم؛ مستندات و ساختار props خیلی تمیز بود.
                    </p>
                </KTestimonialCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KTestimonialCard from '../../ui-kit/components/KTestimonialCard.vue'

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='96' height='96' fill='url(%23a)'/><text x='48' y='64' font-size='42' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const ratings = [
    { rating: 5, quote: 'بهترین دوره‌ای که تا حالا داشتم.', name: 'لیلا صادقی', role: 'زبان‌آموز', from: '#ec4899', to: '#be185d', letter: 'ل' },
    { rating: 4, quote: 'محتوای خوبی داشت، فقط زمان‌بندی کلاس‌ها می‌توانست بهتر باشد.', name: 'حسین نوری', role: 'زبان‌آموز', from: '#14b8a6', to: '#0f766e', letter: 'ح' },
    { rating: 3, quote: 'برای شروع مناسب است ولی برای سطح پیشرفته کافی نیست.', name: 'پویا رحیمی', role: 'زبان‌آموز', from: '#0ea5e9', to: '#1d4ed8', letter: 'پ' },
    { rating: 2, quote: 'صوت بعضی جلسات کیفیت پایینی داشت.', name: 'نگار احمدی', role: 'زبان‌آموز', from: '#a855f7', to: '#7e22ce', letter: 'ن' },
]
</script>

<style scoped>
.t-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
}
</style>
