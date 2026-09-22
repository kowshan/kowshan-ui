<template>
    <div class="sp">
        <h2 class="sp-title">KPricingCard</h2>

        <h3 class="sp-sub">تک‌کارت پایه</h3>
        <div class="sp-row">
            <KPricingCard
                name="پایه"
                description="برای شروع یادگیری"
                :price="299000"
                period="/ ماهانه"
                :features="['۲ دوره فعال', 'پشتیبانی ایمیلی', 'دسترسی موبایل']"
                @cta="onCta"
            />
        </div>

        <h3 class="sp-sub">سه پلن (یکی محبوب)</h3>
        <div class="sp-grid">
            <KPricingCard
                name="پایه"
                description="برای شروع یادگیری"
                :price="299000"
                period="/ ماهانه"
                :features="['۲ دوره فعال', 'پشتیبانی ایمیلی', 'دسترسی موبایل']"
                @cta="onCta"
            />
            <KPricingCard
                name="حرفه‌ای"
                description="محبوب‌ترین انتخاب مدرسان"
                :price="699000"
                :old-price="890000"
                period="/ ماهانه"
                popular
                :features="['همه دوره‌ها', 'پشتیبانی ۲۴ ساعته', 'گواهی پایان دوره', 'جلسه خصوصی ماهانه']"
                :highlighted="['گواهی پایان دوره', 'جلسه خصوصی ماهانه']"
                cta-label="شروع کنید"
                note="۷ روز اول رایگان"
                @cta="onCta"
            />
            <KPricingCard
                name="سازمانی"
                description="برای تیم‌ها و آموزشگاه‌ها"
                :price="4200000"
                period="/ ماهانه"
                currency="تومان"
                :features="['تا ۵۰ کاربر', 'پنل مدیر اختصاصی', 'گزارش تحلیلی', 'پشتیبانی اختصاصی']"
                :highlighted="['پنل مدیر اختصاصی']"
                cta-label="گفتگو با فروش"
                @cta="onCta"
            />
        </div>

        <h3 class="sp-sub">واحد پول دلاری و تخفیف</h3>
        <div class="sp-row">
            <KPricingCard
                name="Pro"
                description="International plan"
                :price="19"
                :old-price="29"
                currency="$"
                period="/ month"
                :features="['Unlimited courses', 'Priority support', 'Offline access']"
                :highlighted="['Priority support']"
                cta-label="Subscribe"
                note="Cancel anytime"
                @cta="onCta"
            />
        </div>

        <h3 class="sp-sub">پلن رایگان (قیمت صفر)</h3>
        <div class="sp-row">
            <KPricingCard
                name="رایگان"
                description="بدون هزینه، بدون کارت بانکی"
                :price="0"
                :features="['۱ دوره آزمایشی', 'دسترسی ۷ روزه']"
                cta-label="ثبت‌نام"
                @cta="onCta"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین CTA: {{ lastCta ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPricingCard from '../../ui-kit/components/KPricingCard.vue'

const lastCta = ref<string | null>(null)
const onCta = (name: string) => { lastCta.value = name }
</script>

<style scoped>
.sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    align-items: start;
}
</style>
