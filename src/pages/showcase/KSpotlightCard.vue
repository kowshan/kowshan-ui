<template>
    <div class="sp">
        <h2 class="sp-title">KSpotlightCard</h2>
        <p class="sp-note">ماوس را روی کارت‌ها حرکت دهید — نور نقطه‌ای و حاشیه درخشان دنبال نشانگر می‌آید.</p>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KSpotlightCard style="width: 280px;">
                <div class="body">
                    <h4 class="t">پلن حرفه‌ای</h4>
                    <p class="d">همه دوره‌ها با گواهی پایان دوره</p>
                    <span class="price">۶۹۹٬۰۰۰ تومان</span>
                </div>
            </KSpotlightCard>
        </div>

        <h3 class="sp-sub">رنگ‌های مختلف</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KSpotlightCard v-for="c in colors" :key="c.hex" :color="c.hex" style="width: 220px;">
                <div class="body">
                    <h4 class="t">{{ c.name }}</h4>
                    <p class="d">{{ c.hex }}</p>
                </div>
            </KSpotlightCard>
        </div>

        <h3 class="sp-sub">بدون درخشش (glow=false)</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KSpotlightCard :glow="false" style="width: 260px;">
                <div class="body">
                    <h4 class="t">بدون درخشش</h4>
                    <p class="d">فقط نور داخلی، بدون هاله بیرونی</p>
                </div>
            </KSpotlightCard>
            <KSpotlightCard :glow="true" style="width: 260px;">
                <div class="body">
                    <h4 class="t">با درخشش</h4>
                    <p class="d">برای مقایسه</p>
                </div>
            </KSpotlightCard>
        </div>

        <h3 class="sp-sub">گردی گوشه‌ها (radius)</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KSpotlightCard v-for="r in ['4px', '16px', '32px', '48px']" :key="r" :radius="r" style="width: 190px;">
                <div class="body" style="padding: 18px;">
                    <h4 class="t">{{ r }}</h4>
                </div>
            </KSpotlightCard>
        </div>

        <!-- Surface: off by default, because this is an effect layer rather than
             a card — the same component inside a page that already has surfaces
             would otherwise double-box. -->
        <h3 class="sp-sub">سطح — <code>surface</code> روشن / خاموش</h3>
        <p class="sp-note">
            پیش‌فرض <code>surface=false</code> است: کامپوننت فقط لایهٔ افکت است و پس‌زمینه/حاشیه
            ندارد، پس روی هر سطحی می‌نشیند. با <code>surface</code> خودش کارت می‌شود و از توکن‌های
            تم پس‌زمینه و حاشیه می‌گیرد.
        </p>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KSpotlightCard style="width: 240px;">
                <div class="body">
                    <h4 class="t">بدون سطح (پیش‌فرض)</h4>
                    <p class="d">شفاف — افکت روی پس‌زمینهٔ والد می‌نشیند</p>
                </div>
            </KSpotlightCard>
            <KSpotlightCard surface style="width: 240px;">
                <div class="body">
                    <h4 class="t">با سطح</h4>
                    <p class="d">پس‌زمینه + حاشیه از <code>--k-surface</code> و <code>--k-border</code></p>
                </div>
            </KSpotlightCard>
        </div>

        <h3 class="sp-sub">کاربردی — کارت ویژگی محصول</h3>
        <div class="sp-card" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <KSpotlightCard v-for="f in features" :key="f.title" :color="f.color">
                <div class="body">
                    <span class="icon" :style="{ background: f.color + '22', color: f.color }">
                        <component :is="f.icon" :size="16" />
                    </span>
                    <h4 class="t">{{ f.title }}</h4>
                    <p class="d">{{ f.desc }}</p>
                </div>
            </KSpotlightCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BarChart3, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
import KSpotlightCard from '../../ui-kit/components/KSpotlightCard.vue'

const colors = [
    { name: 'سبز', hex: '#1db954' },
    { name: 'بنفش', hex: '#6366f1' },
    { name: 'نارنجی', hex: '#f59e0b' },
    { name: 'آبی', hex: '#0ea5e9' },
]

const features = [
    { title: 'پرداخت امن', desc: 'اتصال مستقیم به درگاه شاپرک', icon: ShieldCheck, color: '#1db954' },
    { title: 'سرعت بالا', desc: 'بارگذاری زیر ۲ ثانیه در موبایل', icon: Zap, color: '#f59e0b' },
    { title: 'گزارش تحلیلی', desc: 'داشبورد زنده ثبت‌نام‌ها', icon: BarChart3, color: '#6366f1' },
    { title: 'هوش مصنوعی', desc: 'پیشنهاد دوره بر اساس سطح', icon: Sparkles, color: '#ec4899' },
]
</script>

<style scoped>
.body {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.t {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--k-text-primary);
}
.d {
    margin: 0;
    font-size: 0.78rem;
    color: var(--k-text-secondary);
    line-height: 1.7;
}
.price {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-primary);
}
.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    margin-bottom: 4px;
}
</style>
