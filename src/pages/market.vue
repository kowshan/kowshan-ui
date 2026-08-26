<!-- pages/market.vue — card showcase: profiles, courses, pricing, testimonials, features -->
<template>
    <div class="market-page">
        <!-- ═══════ HERO ═══════ -->
        <section class="market-hero">
            <div class="market-hero-badge">نمونه کارت‌های آماده</div>
            <h1>مارکت</h1>
            <p>قالب‌ها و کارت‌های از پیش طراحی‌شده برای سناریوهای مختلف — فقط کپی کنید</p>
        </section>

        <!-- ═══════ PROFILE CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت پروفایل</h2>
            <p class="market-section-desc">برای صفحه تیم، مشتریان یا کارشناسان فروش</p>
            <div class="market-row market-row--center">
                <KProfileCard
                    name="علی رضایی"
                    role="مدیر فروش"
                    company="آژانس املاک آرا"
                    avatar="https://i.pravatar.cc/120?img=12"
                    cover="https://picsum.photos/seed/profile1/600/300"
                    status="online"
                    :stats="[
                        { label: 'معاملات', value: 128 },
                        { label: 'مشتری', value: 340 },
                        { label: 'امتیاز', value: '4.9' },
                    ]"
                    :tags="['مسکونی', 'تجاری']"
                    :actions="[
                        { id: 'profile', label: 'پروفایل', icon: User },
                        { id: 'chat', label: 'پیام', icon: MessageSquare, primary: true },
                    ]"
                />
                <KProfileCard
                    name="سارا محمدی"
                    role="مشاور املاک"
                    company="گروه مسکن پارسیان"
                    avatar="https://i.pravatar.cc/120?img=47"
                    cover="https://picsum.photos/seed/profile2/600/300"
                    status="away"
                    :stats="[
                        { label: 'معاملات', value: 87 },
                        { label: 'مشتری', value: 210 },
                        { label: 'امتیاز', value: '4.7' },
                    ]"
                    :tags="['اجاره', 'زمین']"
                    :actions="[
                        { id: 'profile', label: 'پروفایل', icon: User },
                        { id: 'chat', label: 'پیام', icon: MessageSquare, primary: true },
                    ]"
                />
                <KProfileCard
                    name="مریم کریمی"
                    role="کارشناس حقوقی"
                    avatar="https://i.pravatar.cc/120?img=5"
                    status="online"
                    :stats="[
                        { label: 'پرونده', value: 56 },
                        { label: 'موفقیت', value: '98٪' },
                    ]"
                    :tags="['حقوقی', 'قرارداد']"
                    :actions="[
                        { id: 'profile', label: 'پروفایل', icon: User },
                        { id: 'call', label: 'تماس', icon: Phone, primary: true },
                    ]"
                />
            </div>
        </section>

        <!-- ═══════ COURSE CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت دوره آموزشی</h2>
            <p class="market-section-desc">برای پلتفرم‌های آموزشی و یادگیری</p>
            <div class="market-row">
                <KCourseCard
                    title="آموزش جامع Vue 3 و Nuxt"
                    category="برنامه‌نویسی"
                    image="https://picsum.photos/seed/vue3/600/340"
                    instructor="علی رضایی"
                    instructor-avatar="https://i.pravatar.cc/40?img=12"
                    :rating="4.8"
                    :reviews="1240"
                    :lessons="42"
                    :hours="18.5"
                    :price="890000"
                    :old-price="1450000"
                    discount="-39٪"
                />
                <KCourseCard
                    title="طراحی رابط کاربری با Figma"
                    category="طراحی"
                    image="https://picsum.photos/seed/figma/600/340"
                    instructor="سارا محمدی"
                    instructor-avatar="https://i.pravatar.cc/40?img=47"
                    :rating="4.9"
                    :reviews="890"
                    :lessons="36"
                    :hours="14"
                    :price="650000"
                    duration-badge="۱۴ ساعت"
                />
                <KCourseCard
                    title="مدیریت پروژه Agile و Scrum"
                    category="مدیریت"
                    image="https://picsum.photos/seed/agile/600/340"
                    instructor="مریم کریمی"
                    instructor-avatar="https://i.pravatar.cc/40?img=5"
                    :rating="4.6"
                    :reviews="560"
                    :lessons="28"
                    :hours="10"
                    :price="420000"
                    :progress="65"
                />
            </div>
        </section>

        <!-- ═══════ PRICING CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت قیمت‌گذاری</h2>
            <p class="market-section-desc">برای صفحه اشتراک و پلن‌های سرویس</p>
            <div class="market-row market-row--center">
                <KPricingCard
                    name="پایه"
                    description="برای شروع کار"
                    :price="490000"
                    period="/ سالانه"
                    :features="['۵ پروژه فعال', '۱۰ گیگابایت فضا', 'پشتیبانی ایمیلی']"
                    cta-label="شروع رایگان"
                    note="بدون نیاز به کارت بانکی"
                />
                <KPricingCard
                    name="حرفه‌ای"
                    description="برای تیم‌های در حال رشد"
                    :price="890000"
                    :old-price="1200000"
                    period="/ سالانه"
                    :features="['پروژه نامحدود', 'پشتیبانی ۲۴/۷', 'گزارش پیشرفته', 'دسترسی API']"
                    :highlighted="['دسترسی API']"
                    popular
                    cta-label="انتخاب این پلن"
                    note="۲ ماه هدیه با پرداخت سالانه"
                />
                <KPricingCard
                    name="سازمانی"
                    description="برای سازمان‌های بزرگ"
                    :price="1900000"
                    period="/ سالانه"
                    :features="['همه امکانات حرفه‌ای', 'SSO و نقش‌ها', 'مدیر اختصاصی', 'SLA ۹۹.۹٪']"
                    cta-label="تماس با فروش"
                />
            </div>
        </section>

        <!-- ═══════ TESTIMONIAL CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت نظر مشتری</h2>
            <p class="market-section-desc">برای نمایش رضایت‌نامه و بازخورد کاربران</p>
            <div class="market-row">
                <KTestimonialCard
                    quote="تجربه کار با این تیم فوق‌العاده بود. فرآیند خرید ملک را کاملاً شفاف و بدون دغدغه پیش بردند."
                    author-name="سارا محمدی"
                    author-role="خریدار — تهران"
                    author-image="https://i.pravatar.cc/80?img=47"
                    :rating="5"
                />
                <KTestimonialCard
                    quote="ابزارهای مدیریت قرارداد و پیگیری مشتری دقیقاً چیزی بود که دفتر ما کم داشت. سرعت کار ما تقریباً دو برابر شد."
                    author-name="مریم کریمی"
                    author-role="مشاور املاک — اصفهان"
                    author-image="https://i.pravatar.cc/80?img=5"
                    :rating="4"
                />
                <KTestimonialCard
                    quote="پس از استفاده از این سیستم، مدیریت اسناد و قراردادها بسیار ساده‌تر شده. پیشنهاد می‌کنم."
                    author-name="رضا قاسمی"
                    author-role="مدیر دفتر — شیراز"
                    author-image="https://i.pravatar.cc/80?img=15"
                    :rating="5"
                    variant="accent"
                />
            </div>
        </section>

        <!-- ═══════ FEATURE CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت ویژگی</h2>
            <p class="market-section-desc">برای نمایش قابلیت‌ها و سرویس‌ها</p>
            <div class="market-grid">
                <KFeatureCard
                    title="گزارش لحظه‌ای"
                    description="نمودارها و آمار فروش به‌صورت زنده و قابل خروجی"
                    :icon="BarChart3"
                    icon-bg="linear-gradient(135deg, #10b981, #059669)"
                    link-text="مشاهده گزارش"
                />
                <KFeatureCard
                    title="پشتیبانی ۲۴/۷"
                    description="تیم پشتیبانی همیشه در دسترس، در تمام ساعات شبانه‌روز"
                    :icon="Headphones"
                    icon-bg="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                    link-text="گفتگو با پشتیبانی"
                />
                <KFeatureCard
                    title="امنیت پیشرفته"
                    description="رمزنگاری داده‌ها و احراز هویت دو مرحله‌ای"
                    :icon="ShieldCheck"
                    icon-bg="linear-gradient(135deg, #f59e0b, #d97706)"
                />
                <KFeatureCard
                    title="همگام‌سازی خودکار"
                    description="اتصال به تقویم شمسی و یادآوری‌های خودکار قرارها"
                    :icon="RefreshCw"
                    icon-bg="linear-gradient(135deg, #1db954, #2563eb)"
                />
                <KFeatureCard
                    title="داشبورد مدیریتی"
                    description="نمای کلی از عملکرد تیم، فروش و مشتریان در یک نگاه"
                    :icon="LayoutDashboard"
                    icon-bg="linear-gradient(135deg, #ec4899, #be185d)"
                    link-text="ورود به داشبورد"
                />
                <KFeatureCard
                    title="جستجوی پیشرفته"
                    description="فیلتر دقیق بر اساس مکان، قیمت، متراژ و ویژگی‌ها"
                    :icon="Search"
                    icon-bg="linear-gradient(135deg, #06b6d4, #0284c7)"
                    link-text="جستجو کنید"
                />
            </div>
        </section>

        <!-- ═══════ SPOTLIGHT CARDS ═══════ -->
        <section class="market-section">
            <h2 class="market-section-title">کارت نور تعقیب‌کننده</h2>
            <p class="market-section-desc">افکت نور با حرکت ماوس — برای بخش‌های ویژه و CTA</p>
            <div class="market-row">
                <KSpotlightCard class="spotlight-demo" color="#1db954">
                    <div class="spotlight-inner">
                        <div class="spotlight-icon" style="background: linear-gradient(135deg, #1db954, #17a34a)">
                            <Zap :size="22" />
                        </div>
                        <div class="spotlight-title">رزرو هوشمند</div>
                        <p class="spotlight-desc">
                            سیستم رزرو آنلاین با تقویم شمسی، انتخاب ساعت و تأیید خودکار —
                            آماده اتصال به درگاه پرداخت.
                        </p>
                    </div>
                </KSpotlightCard>
                <KSpotlightCard class="spotlight-demo" color="#8b5cf6">
                    <div class="spotlight-inner">
                        <div class="spotlight-icon" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9)">
                            <ShieldCheck :size="22" />
                        </div>
                        <div class="spotlight-title">احراز هویت</div>
                        <p class="spotlight-desc">
                            ورود با شماره موبایل، OTP شش‌رقمی و رمز عبور —
                            با کپچا و محافظت در برابر حمله Brute Force.
                        </p>
                    </div>
                </KSpotlightCard>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import {
    BarChart3, Headphones, LayoutDashboard, MessageSquare, Phone,
    RefreshCw, Search, ShieldCheck, User, Zap,
} from 'lucide-vue-next'
import KProfileCard from '../ui-kit/components/KProfileCard.vue'
import KCourseCard from '../ui-kit/components/KCourseCard.vue'
import KPricingCard from '../ui-kit/components/KPricingCard.vue'
import KTestimonialCard from '../ui-kit/components/KTestimonialCard.vue'
import KFeatureCard from '../ui-kit/components/KFeatureCard.vue'
import KSpotlightCard from '../ui-kit/components/KSpotlightCard.vue'
</script>

<style scoped>
.market-page {
    max-width: 1060px;
    margin: 0 auto;
    padding: 0 24px 60px;
}

/* ── Hero ── */
.market-hero {
    text-align: center;
    padding: 60px 0 40px;
}

.market-hero-badge {
    display: inline-flex;
    font-size: 0.64rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 12%, transparent));
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 25%, transparent);
    padding: 4px 14px;
    border-radius: 999px;
    margin-bottom: 14px;
}

.market-hero h1 {
    font-size: 2rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 8px;
}

.market-hero p {
    font-size: 0.85rem;
    color: var(--k-text-muted);
    margin: 0;
    max-width: 480px;
    margin-inline: auto;
    line-height: 1.8;
}

/* ── Sections ── */
.market-section {
    margin-bottom: 48px;
}

.market-section-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.market-section-desc {
    font-size: 0.74rem;
    color: var(--k-text-muted);
    margin: 0 0 20px;
}

/* ── Rows & Grids ── */
.market-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.market-row--center {
    justify-content: center;
}

.market-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
}

/* ── Spotlight demo ── */
.spotlight-demo {
    flex: 1 1 280px;
    min-height: 240px;
    border-radius: 16px;
}

.spotlight-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 28px;
    text-align: center;
}

.spotlight-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.spotlight-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.spotlight-desc {
    font-size: 0.76rem;
    line-height: 1.8;
    color: var(--k-text-secondary);
    margin: 0;
    max-width: 320px;
}

@media (max-width: 640px) {
    .market-row {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
