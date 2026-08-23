<template>
    <DemoSection
        id="cards"
        index="13"
        title="کارت‌های زیبا"
        description="کارت قیمت‌گذاری، پروفایل، نظر مشتری، کارت با افکت نور تعقیب‌کننده و کارت ویژگی — ویترینی از کارت‌های آماده"
    >
        <!-- KCard variants -->
        <p class="demo-caption">کارت پایه — واریانت‌های gradient، glass و glow</p>
        <div class="demo-grid-3">
            <KCard
                title="کارت گرادیانی"
                subtitle="variant = gradient"
                variant="gradient"
                hoverable
            >
                زمینه با گرادیان نرم از رنگ برند شروع می‌شود و به پس‌زمینه ختم می‌شود — مناسب هدر بخش‌ها.
            </KCard>

            <KCard
                title="کارت شیشه‌ای"
                subtitle="variant = glass"
                variant="glass"
                hoverable
            >
                افکت بلور شیشه‌ای با back-drop filter — مناسب روی تصاویر و بنرهای رنگی.
            </KCard>

            <KCard
                title="کارت درخشان"
                subtitle="variant = glow"
                variant="glow"
                hoverable
            >
                قاب گرادیانی + هاله نور که با hover روشن می‌شود. روی هر پس‌زمینه‌ای برجسته است.
            </KCard>
        </div>

        <hr class="demo-divider" />

        <!-- Pricing -->
        <p class="demo-caption">کارت قیمت‌گذاری — پلن‌ها با نشان «پیشنهاد ویژه»</p>
        <div class="demo-grid-3">
            <KPricingCard
                name="پایه"
                description="برای شروع کار"
                :price="490000"
                period="/ سالانه"
                :features="['۵ پروژه فعال', '۱۰ گیگابایت فضا', 'پشتیبانی ایمیلی']"
                cta-label="شروع رایگان"
                note="بدون نیاز به کارت بانکی"
                @cta="onPlan"
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
                @cta="onPlan"
            />
            <KPricingCard
                name="سازمانی"
                description="برای سازمان‌های بزرگ"
                :price="1900000"
                period="/ سالانه"
                :features="['همه امکانات حرفه‌ای', 'SSO و نقش‌ها', 'مدیر اختصاصی', 'SLA ۹۹.۹٪']"
                cta-label="تماس با فروش"
                @cta="onPlan"
            />
        </div>

        <hr class="demo-divider" />

        <!-- Profile + Testimonial -->
        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">کارت پروفایل — با کاور، آمار و اکشن‌ها</p>
                <div class="demo-center">
                    <KProfileCard
                        name="علی رضایی"
                        role="مدیر فروش"
                        company="آژانس املاک آرا"
                        avatar="https://i.pravatar.cc/120?img=12"
                        cover="https://picsum.photos/seed/profile1/600/300"
                        :stats="[
                            { label: 'معاملات', value: 128 },
                            { label: 'مشتری', value: 340 },
                            { label: 'امتیاز', value: '4.9' },
                        ]"
                        :tags="['مسکونی', 'تجاری']"
                        :actions="[
                            { id: 'profile', label: 'پروفایل', icon: UserRound },
                            { id: 'chat', label: 'پیام', icon: MessageSquare, primary: true },
                        ]"
                        @action="onProfileAction"
                    />
                </div>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">کارت نظر مشتری — با امتیاز ستاره</p>
                <KTestimonialCard
                    quote="تجربه کار با این تیم فوق‌العاده بود. فرآیند خرید ملک را کاملاً شفاف و بدون دغدغه پیش بردند. قطعاً به دوستانم پیشنهاد می‌دهم."
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
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Spotlight + Feature -->
        <p class="demo-caption">کارت نور تعقیب‌کننده (Spotlight) — افکت نور با حرکت ماوس</p>
        <div class="demo-grid-2">
            <KSpotlightCard class="demo-spotlight-card">
                <div class="demo-spotlight-inner">
                    <div class="demo-spotlight-icon"><Zap :size="22" /></div>
                    <div class="demo-spotlight-title">پنل رزرو هوشمند</div>
                    <p class="demo-spotlight-desc">
                        ماوس را روی کارت حرکت دهید — نور از گوشه‌های کارت دنبال می‌کند. این افکت با
                        <code>KSpotlightCard</code> فقط با دو prop رنگ و حالت در دسترس است.
                    </p>
                </div>
            </KSpotlightCard>
            <div class="demo-stack">
                <p class="demo-caption">کارت ویژگی — با کاشی آیکون گرادیانی</p>
                <div class="demo-grid-2">
                    <KFeatureCard
                        title="گزارش لحظه‌ای"
                        description="نمودارها و آمار فروش به‌صورت زنده و قابل خروجی"
                        :icon="BarChart3"
                        icon-bg="linear-gradient(135deg, #10b981, #059669)"
                        link-text="مشاهده گزارش"
                        @click="onFeature"
                    />
                    <KFeatureCard
                        title="پشتیبانی ۲۴/۷"
                        description="تیم پشتیبانی همیشه در دسترس، در تمام ساعات شبانه‌روز"
                        :icon="Headphones"
                        icon-bg="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                        link-text="گفتگو با پشتیبانی"
                        @click="onFeature"
                    />
                    <KFeatureCard
                        title="امنیت پیشرفته"
                        description="رمزنگاری داده‌ها و احراز هویت دو مرحله‌ای"
                        :icon="ShieldCheck"
                        icon-bg="linear-gradient(135deg, #f59e0b, #d97706)"
                        @click="onFeature"
                    />
                    <KFeatureCard
                        title="همگام‌سازی خودکار"
                        description="اتصال به تقویم شمسی و یادآوری‌های خودکار قرارها"
                        :icon="RefreshCw"
                        icon-bg="linear-gradient(135deg, #499DF3, #2563eb)"
                        @click="onFeature"
                    />
                </div>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { BarChart3, Headphones, MessageSquare, RefreshCw, ShieldCheck, UserRound, Zap } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KCard from '../ui-kit/components/KCard.vue'
import KPricingCard from '../ui-kit/components/KPricingCard.vue'
import KProfileCard from '../ui-kit/components/KProfileCard.vue'
import KTestimonialCard from '../ui-kit/components/KTestimonialCard.vue'
import KSpotlightCard from '../ui-kit/components/KSpotlightCard.vue'
import KFeatureCard from '../ui-kit/components/KFeatureCard.vue'
import { useToast } from '../ui-kit/composables/useToast'

const onPlan = (name: string) => {
    useToast.info(`پلن «${name}» انتخاب شد`)
}

const onProfileAction = (id: string) => {
    useToast.info(id === 'chat' ? 'پیام به علی رضایی ارسال شد' : 'مشاهده پروفایل')
}

const onFeature = () => {
    useToast.success('این قابلیت در نسخه نمایشی فعال نیست')
}
</script>

<style scoped>
.demo-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
}

.demo-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-center {
    display: flex;
    justify-content: center;
}

.demo-spotlight-card {
    border-radius: 16px;
    min-height: 260px;
}

.demo-spotlight-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    text-align: center;
}

.demo-spotlight-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--k-primary, #1db954), var(--k-primary-hover, #17a34a));
    color: #fff;
    box-shadow: 0 8px 20px color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
}

.demo-spotlight-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.demo-spotlight-desc {
    font-size: 0.76rem;
    line-height: 1.8;
    color: var(--k-text-secondary);
    margin: 0;
    max-width: 340px;
}
</style>
