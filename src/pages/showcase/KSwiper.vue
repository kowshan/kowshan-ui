<template>
    <div class="sp">
        <h2 class="sp-title">KSwiper</h2>
        <p class="sp-note">
            اسلایدر بدون وابستگی — اسکرول نیتیو با scroll-snap، پس درگ/سوایپ لمسی و کیبورد رایگان است.
            <code>per-page</code> عدد یا <code>'auto'</code>، <code>breakpoints</code> به شکل
            <code>{'{ 1200: 3 }'}</code> یعنی «عرض کانتینر ≥ ۱۲۰۰ → ۳ در هر صفحه».
            <code>direction="vertical"</code> هم همان کامپوننت را عمودی می‌کند — فقط محور عوض می‌شود.
            عمداً هیچ درگ ماوسی با جاوااسکریپت نوشته نشده: اسکرول نیتیو مرورگر (لمس، ترک‌پد، چرخ ماوس،
            نوار پایین مرورگر) کار می‌کند و کد کامپوننت سبک می‌ماند.
        </p>

        <!-- ── Pattern A: controls slot (auto-wired buttons) ─────── -->
        <h3 class="sp-sub">الگوی ۱ — اسلات <code>#controls</code> (دکمه‌ها خودکار وصل می‌شوند)</h3>
        <div class="ks-frame">
            <KSwiper :per-page="1" :gap="10" :loop="true">
                <template #controls="{ next, prev, index, pages }">
                    <KSwiperButton direction="prev" />
                    <span class="sp-note">{{ index + 1 }} از {{ pages }}</span>
                    <KSwiperButton direction="next" />
                </template>
                <template #default="{ index, pages }">
                    <div v-for="i in 5" :key="i" class="ks-slide tall">{{ i }}</div>
                    <p class="sp-note">اسلاید {{ index + 1 }} از {{ pages }}</p>
                </template>
            </KSwiper>
            <p class="sp-note">هر دو اسلات همان scope را می‌گیرند: <code>next</code>، <code>prev</code>، <code>goTo</code>، <code>index</code>، <code>pages</code>، <code>atStart</code>، <code>atEnd</code>.</p>
        </div>

        <!-- ── Pattern B: buttons outside, template ref ──────────── -->
        <h3 class="sp-sub">الگوی ۲ — دکمه بیرون از اسلایدر با <code>ref</code></h3>
        <div class="ks-frame">
            <KSwiper ref="basic" :per-page="2" :gap="10">
                <div v-for="i in 6" :key="i" class="ks-slide small">{{ i }}</div>
            </KSwiper>
            <div class="ks-row">
                <KSwiperButton direction="prev" @click="basic?.prev()" />
                <KSwiperButton direction="next" @click="basic?.next()" />
                <button type="button" class="ks-text-btn" @click="basic?.goTo(2)">برو به صفحه ۳</button>
            </div>
        </div>

        <!-- ── per-page ──────────────────────────────────────────── -->
        <h3 class="sp-sub">۳ در هر صفحه + دات</h3>
        <KSwiper :per-page="3" :gap="12" :dots="true">
            <div v-for="i in 10" :key="i" class="ks-card">
                <div class="ks-card-img">{{ i }}</div>
                <div class="ks-card-title">کارت {{ i }}</div>
                <div class="ks-card-text">توضیح کوتاه نمونه برای اسلاید {{ i }}</div>
            </div>
        </KSwiper>
        <p class="sp-note">
            ۱۰ آیتم ÷ ۳ = ۳ صفحهٔ کامل + یک صفحهٔ ناقص ← دات‌ها <b>۴</b> تاست. صفحهٔ ناقص هم یک
            موقعیت واقعی است (به انتهای نوار می‌چسبد، نه به فضای خالی) و اگر شمرده نشود، سه
            کارت آخرِ ردیف هیچ راه رسیدنی ندارند.
        </p>

        <h3 class="sp-sub">۱ / ۲ / ۴ در هر صفحه</h3>
        <KSwiper :per-page="1" :gap="10"><div v-for="i in 3" :key="i" class="ks-wide">۱ در صفحه — {{ i }}</div></KSwiper>
        <KSwiper :per-page="2" :gap="10"><div v-for="i in 6" :key="i" class="ks-wide">۲ در صفحه — {{ i }}</div></KSwiper>
        <KSwiper :per-page="4" :gap="10"><div v-for="i in 8" :key="i" class="ks-wide">۴ — {{ i }}</div></KSwiper>

        <!-- Cross-axis bleed: 2px of padding *inside* the scrollport, so a
             slide's own border is not shaved at the clip edge. At one slide per
             page that same inset peeks at the next slide — hence the prop. -->
        <h3 class="sp-sub">حاشیهٔ لبه — <code>inline-bleed</code></h3>
        <p class="sp-note">
            نوار ۲ پیکسل پدینگ <b>داخل</b> قاب اسکرول دارد تا حاشیهٔ خود اسلاید در لبهٔ برش خورده
            نشود. همان ۲ پیکسل چون داخل قاب است، در حالت «۱ در هر صفحه» ذره‌ای از اسلاید بعدی را
            نشان می‌دهد؛ برای کاروسل تک‌اسلایدی <code>:inline-bleed="false"</code> بدهید.
        </p>
        <div class="ks-frame">
            <span class="sp-note">پیش‌فرض (روشن) — لبهٔ سمت پایان، ذره‌ای از اسلاید بعدی</span>
            <KSwiper :per-page="1" :gap="10" :dots="true">
                <div v-for="i in 3" :key="i" class="ks-wide">اسلاید {{ i }}</div>
            </KSwiper>
        </div>
        <div class="ks-frame">
            <span class="sp-note">کاروسل تک‌اسلایدی — <code>:inline-bleed="false"</code></span>
            <KSwiper :per-page="1" :gap="10" :dots="true" :inline-bleed="false">
                <div v-for="i in 3" :key="i" class="ks-wide">اسلاید {{ i }}</div>
            </KSwiper>
        </div>

        <h3 class="sp-sub">۴ در هر صفحه (تصویر)</h3>
        <KSwiper :per-page="4" :gap="10" :dots="true">
            <img
                v-for="i in 9"
                :key="i"
                class="ks-img"
                :src="`https://picsum.photos/seed/kswiper${i}/400/260`"
                alt="تصویر اسلاید"
            />
        </KSwiper>

        <!-- ── autoplay / loop ───────────────────────────────────── -->
        <h3 class="sp-sub">اسکرول خودکار (۲۵۰۰ms) + loop</h3>
        <p class="sp-note">روی آن hover کنید تا متوقف شود.</p>
        <KSwiper :per-page="2" :gap="14" :autoplay="2500" :loop="true" :dots="true">
            <div v-for="i in 6" :key="i" class="ks-wide">اسلاید {{ i }}</div>
        </KSwiper>

        <!-- ── auto width ───────────────────────────────────────── -->
        <h3 class="sp-sub">per-page=&quot;auto&quot; — عرض هر اسلاید به اندازه محتوای خودش</h3>
        <KSwiper per-page="auto" :gap="10" :dots="true">
            <span v-for="t in tags" :key="t" class="ks-tag">{{ t }}</span>
        </KSwiper>

        <KSwiper per-page="auto" :gap="12" :autoplay="3000" :loop="true">
            <div
                v-for="(w, i) in autoWidths"
                :key="i"
                class="ks-auto-card"
                :style="{ width: w + 'px' }"
            >{{ w }}px</div>
        </KSwiper>

        <!-- ── breakpoints ───────────────────────────────────────── -->
        <h3 class="sp-sub">breakpoints — عرض کانتینر را کم/زیاد کنید</h3>
        <p class="sp-note"><code>{{ JSON.stringify(bps) }}</code> — فعلی: {{ perPage }} در هر صفحه</p>
        <KSwiper :per-page="1" :breakpoints="bps" :gap="10" :dots="true" @change="onChange" @end="onEnd">
            <div v-for="i in 8" :key="i" class="ks-slide small">{{ i }}</div>
        </KSwiper>
        <p class="sp-note">آخرین رویداد: {{ lastEvent || '—' }}</p>

        <!-- ── disabled ends / sizes ─────────────────────────────── -->
        <h3 class="sp-sub">بدون loop — در ابتدا/انتها دکمه غیرفعال می‌شود</h3>
        <div class="ks-frame">
            <KSwiper ref="ends" :per-page="2" :gap="10">
                <div v-for="i in 6" :key="i" class="ks-slide small">{{ i }}</div>
            </KSwiper>
            <div class="ks-row">
                <KSwiperButton direction="prev" />
                <KSwiperButton direction="next" />
                <KSwiperButton direction="prev" size="sm" :bordered="false" />
                <KSwiperButton direction="next" size="lg" />
            </div>
        </div>

        <!-- ── keyboard ──────────────────────────────────────────── -->
        <h3 class="sp-sub">کیبورد — فوکوس روی نوار و ← → (Home / End هم کار می‌کند)</h3>
        <KSwiper :per-page="1" :gap="10" :dots="true">
            <div v-for="i in 4" :key="i" class="ks-wide">اسلاید {{ i }}</div>
        </KSwiper>

        <!-- ── vertical ──────────────────────────────────────────── -->
        <h3 class="sp-sub">عمودی — <code>direction="vertical"</code> + <code>height</code></h3>
        <p class="sp-note">
            همین کامپوننت، فقط محور اسکرول عمودی می‌شود؛ دکمه‌های <code>KSwiperButton</code>
            خودشان بالا/پایین می‌شوند و کلیدهای ↑ ↓ هم کار می‌کنند.
            <code>height</code> عدد (پیکسل) یا هر طول CSS مثل <code>'60vh'</code> است.
        </p>
        <div class="ks-frame">
            <KSwiper direction="vertical" :height="260" :per-page="1" :gap="10" :dots="true">
                <template #controls="{ next, prev, index, pages }">
                    <KSwiperButton direction="prev" size="sm" />
                    <span class="sp-note">اسلاید {{ index + 1 }} از {{ pages }}</span>
                    <KSwiperButton direction="next" size="sm" />
                </template>
                <template #default="{ index, pages }">
                    <div v-for="i in 5" :key="i" class="ks-vslide">{{ i }}</div>
                    <p class="sp-note">اسلاید {{ index + 1 }} از {{ pages }}</p>
                </template>
            </KSwiper>
        </div>

        <h3 class="sp-sub">عمودی با ردیف‌های کم‌ارتفاع (۳ در هر صفحه)</h3>
        <KSwiper direction="vertical" :height="240" :per-page="3" :gap="8" :dots="true">
            <div v-for="i in 9" :key="i" class="ks-vrow">ردیف {{ i }}</div>
        </KSwiper>

        <!-- ── drag ──────────────────────────────────────────────── -->
        <h3 class="sp-sub">کشیدن (درگ) چطور کار می‌کند؟</h3>
        <p class="sp-note">
            همان اسکرول خود مرورگر است: روی موبایل/تبلت با انگشت بکشید، روی دسکتاپ با ترک‌پد
            دو‌انگشتی یا چرخ ماوس، و <code>scroll-snap</code> باعث می‌شود روی هر صفحه بایستد.
            اگر دسترسی به نوار اسکرول لازم دارید (کاربر ماوس بدون ترک‌پد)، یک نمونه با نوار نمایان:
        </p>
        <div class="ks-frame">
            <KSwiper :per-page="2" :gap="10" class="ks-native-scroll">
                <div v-for="i in 6" :key="i" class="ks-slide small">اسلاید {{ i }}</div>
            </KSwiper>
        </div>

        <!-- ── edges ─────────────────────────────────────────────── -->
        <h3 class="sp-sub">حالت‌های مرزی: تک اسلاید / خالی</h3>
        <KSwiper :per-page="2" :gap="10" :dots="true">
            <div class="ks-slide small">تنها اسلاید</div>
        </KSwiper>
        <KSwiper :per-page="2" :gap="10" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KSwiper from '../../ui-kit/components/KSwiper.vue'
import KSwiperButton from '../../ui-kit/components/KSwiperButton.vue'

const tags = ['ویو', 'تایپ‌اسکریپت', 'طراحی', 'فرانت‌اند', 'پرفورمنس', 'دسترس‌پذیری', 'RTL', 'تم تاریک']
const autoWidths = [160, 240, 120, 200, 300]
const bps = { 1100: 4, 900: 3, 600: 2, 0: 1 }

const perPage = ref(1)
const lastEvent = ref('')
const basic = ref()
const ends = ref()

const onChange = (i: number) => { lastEvent.value = `change → ${i}` }
const onEnd = () => { lastEvent.value = 'end' }
</script>

<style scoped>
.ks-frame {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.ks-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.ks-text-btn {
    padding: 6px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-secondary);
    font-family: inherit;
    font-size: 0.72rem;
    cursor: pointer;
}
.ks-text-btn:hover { color: var(--k-text-primary); border-color: var(--k-border-focus); }
.ks-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    border-radius: var(--k-radius-md);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    border: 1px solid var(--k-primary);
    color: var(--k-primary);
    font-size: 1.4rem;
    font-weight: 800;
}
.ks-slide.small { height: 84px; font-size: 1rem; }
.ks-slide.tall { height: 160px; }
.ks-vslide {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--k-radius-md);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    border: 1px solid var(--k-primary);
    color: var(--k-primary);
    font-size: 1.4rem;
    font-weight: 800;
}
/* اسکرول نیتیو با نوار نمایان — فقط از بیرون، بدون تغییر در کامپوننت */
.ks-native-scroll :deep(.k-swiper-track) {
    scrollbar-width: thin;
}
.ks-native-scroll :deep(.k-swiper-track)::-webkit-scrollbar {
    display: block;
    height: 6px;
}
.ks-vrow {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: var(--k-radius-sm);
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    color: var(--k-text-primary);
    font-size: 0.8rem;
    font-weight: 600;
}
.ks-wide {
    display: flex;
    align-items: center;
    padding: 20px;
    height: 140px;
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    color: var(--k-text-primary);
    font-weight: 600;
}
.ks-card {
    padding: 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.ks-card-img {
    height: 90px;
    border-radius: var(--k-radius-sm);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    color: var(--k-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 8px;
}
.ks-card-title { font-size: 0.82rem; font-weight: 700; color: var(--k-text-primary); }
.ks-card-text { font-size: 0.72rem; color: var(--k-text-muted); }
.ks-img {
    height: 150px;
    width: 100%;
    object-fit: cover;
    border-radius: var(--k-radius-md);
    background: var(--k-surface-hover);
}
.ks-tag {
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    color: var(--k-text-secondary);
    font-size: 0.78rem;
    white-space: nowrap;
}
.ks-auto-card {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    border-radius: var(--k-radius-md);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    border: 1px solid var(--k-border);
    color: var(--k-text-primary);
    font-size: 0.8rem;
    font-weight: 700;
}
</style>
