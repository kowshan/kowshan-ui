<!-- pages/index.vue — landing page -->
<template>
    <div class="landing">
        <!-- ═══════ HERO ═══════ -->
        <section class="hero">
            <div class="hero-content">
                <div class="hero-badge">نسخه ۲٫۰</div>
                <h1 class="hero-title">K UI Kit</h1>
                <p class="hero-sub">کیت رابط کاربری فارسی برای Vue 3</p>
                <p class="hero-desc">
                    ۱۱۰+ کامپوننت — فرم، جدول، نمودار، تقویم شمسی، احراز هویت، ابزارهای CRM.
                    <br />بدون وابستگی سنگین، فقط <code>lucide-vue-next</code> برای آیکون‌ها.
                </p>

                <div class="hero-actions">
                    <router-link to="/components" class="btn-primary">
                        مشاهده کامپوننت‌ها
                    </router-link>
                    <router-link to="/dash" class="btn-ghost">
                        داشبورد نمونه
                    </router-link>
                </div>
            </div>
        </section>

        <!-- ═══════ STATS ═══════ -->
        <section ref="statsRef" class="stats-section">
            <div class="stats-grid" :class="{ 'is-visible': statsVisible }">
                <div v-for="(s, i) in stats" :key="s.label" class="stat-item" :style="{ transitionDelay: `${i * 80}ms` }">
                    <span class="stat-num">{{ s.value }}</span>
                    <span class="stat-label">{{ s.label }}</span>
                </div>
            </div>
        </section>

        <!-- ═══════ TECH STACK ═══════ -->
        <section class="tech-section">
            <h2 class="section-title">تکنولوژی</h2>
            <div class="tech-grid">
                <div v-for="t in techStack" :key="t.name" class="tech-item">
                    <div class="tech-icon" :style="{ background: t.color }">{{ t.letter }}</div>
                    <div>
                        <div class="tech-name">{{ t.name }}</div>
                        <div class="tech-desc">{{ t.desc }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════ WHAT'S INCLUDED ═══════ -->
        <section ref="includedRef" class="included-section" :class="{ 'is-visible': includedVisible }">
            <h2 class="section-title">شامل چه چیزهایی است</h2>
            <div class="included-grid">
                <div v-for="(item, i) in included" :key="item.title" class="included-card" :style="{ transitionDelay: `${i * 60}ms` }">
                    <div class="included-num">{{ String(i + 1).padStart(2, '0') }}</div>
                    <div class="included-text">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════ LIVE COMPONENT PREVIEW ═══════ -->
        <section class="preview-section">
            <h2 class="section-title">پیش‌نمایش زنده</h2>
            <p class="section-desc">نمونه‌هایی از کامپوننت‌های این کیت — مستقیماً از پروژه اجرا شده‌اند</p>
            <div class="preview-grid">
                <div class="preview-card">
                    <div class="preview-label">KStatCard</div>
                    <KStatCard title="بیماران فعال" :value="342" :icon="Users" variant="primary" :delta="8" />
                </div>
                <div class="preview-card">
                    <div class="preview-label">KGauge</div>
                    <KGauge :value="87" label="رضایت" :size="120" />
                </div>
                <div class="preview-card">
                    <div class="preview-label">KChart (area)</div>
                    <KChart type="area" :data="previewChart" :height="120" :colors="['#1db954']" :show-grid="true" :show-axis="false" />
                </div>
                <div class="preview-card">
                    <div class="preview-label">KBadge + KProgress</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; gap: 6px;">
                            <KBadge variant="success" size="sm">تأیید شده</KBadge>
                            <KBadge variant="warning" size="sm">در انتظار</KBadge>
                            <KBadge variant="danger" size="sm">رد شده</KBadge>
                        </div>
                        <KProgress :model-value="72" label="پیشرفت دوره" variant="primary" show-percent />
                    </div>
                </div>
                <div class="preview-card">
                    <div class="preview-label">KSparkline</div>
                    <KSparkline :data="[12, 19, 14, 22, 18, 26, 20, 28, 24, 30]" :width="200" :height="50" :fill="true" />
                </div>
                <div class="preview-card">
                    <div class="preview-label">KRating</div>
                    <KRating :model-value="4.5" size="lg" />
                </div>
            </div>
        </section>

        <!-- ═══════ CTA ═══════ -->
        <section class="cta-section">
            <div class="cta-card">
                <h2>شروع کنید</h2>
                <p>فایل‌ها را کپی کنید، ایمپورت کنید، تمام. بدون CLI، بدون پلاگین.</p>
                <div class="cta-actions">
                    <router-link to="/components" class="btn-primary">
                        فهرست کامپوننت‌ها
                    </router-link>
                    <router-link to="/dash" class="btn-ghost">
                        داشبورد نمونه
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Users } from 'lucide-vue-next'
import type { KChartDatum } from '../ui-kit/components/KChart.vue'
import KStatCard from '../ui-kit/components/KStatCard.vue'
import KGauge from '../ui-kit/components/KGauge.vue'
import KChart from '../ui-kit/components/KChart.vue'
import KBadge from '../ui-kit/components/KBadge.vue'
import KProgress from '../ui-kit/components/KProgress.vue'
import KSparkline from '../ui-kit/components/KSparkline.vue'
import KRating from '../ui-kit/components/KRating.vue'

/* ── stats ── */
const stats = [
    { value: '۱۱۰+', label: 'کامپوننت' },
    { value: '۳۷', label: 'کامپوزبل' },
    { value: '۹', label: 'ماژول تقویم' },
    { value: '۱', label: 'وابستگی خارجی' },
]

/* ── tech stack ── */
const techStack = [
    { name: 'Vue 3', desc: 'Composition API + script setup', color: '#42b883', letter: 'V' },
    { name: 'TypeScript', desc: 'تایپ‌ایمنی کامل', color: '#3178c6', letter: 'T' },
    { name: 'Vite', desc: 'ساخت سریع و HMR', color: '#646cff', letter: 'V' },
    { name: 'Lucide', desc: 'آیکون‌های سبک و استاندارد', color: '#f59e0b', letter: 'L' },
]

/* ── what's included ── */
const included = [
    { title: 'فرم و ورودی', desc: 'ورودی متن، انتخابگر، تاریخ، فایل، تلفن، رمز و بیش از ۳۰ کامپوننت فرم' },
    { title: 'نمایش داده', desc: 'جدول، نمودار، درخت، آواتار، تایم‌لاین، وضعیت خالی و لیست مجازی' },
    { title: 'بازخورد', desc: 'هشدار، مدال، تولتیپ، پیشرفت، اسپینر، تأیید و شمارش معکوس' },
    { title: 'پیمایش', desc: 'تب، منوی مگا، دستور پالت، آکاردئون، قدم‌شمار و سایدبار' },
    { title: 'پوشش', desc: 'کشو، مودال، لایتباکس، منوی زمینه و شیت پایینی' },
    { title: 'ابزار CRM', desc: 'کانبان، کارت تماس، فیلتر پیشرفته، ارزیابی و پر کردن جادویی' },
    { title: 'تقویم شمسی', desc: '۹ نمای تقویم شامل ماهانه، هفتگی، روزانه، سالانه و دستور کار' },
    { title: 'کارت و طرح', desc: 'کارت پروفایل، قیمت‌گذاری، ویژگی، نقطه‌کانونی و توصیه‌نامه' },
]

/* ── preview chart ── */
const previewChart: KChartDatum[] = [
    { label: '۱', value: 12 }, { label: '۲', value: 19 }, { label: '۳', value: 14 },
    { label: '۴', value: 22 }, { label: '۵', value: 18 }, { label: '۶', value: 26 },
]

/* ── scroll reveal ── */
const statsRef = ref<HTMLElement | null>(null)
const includedRef = ref<HTMLElement | null>(null)
const statsVisible = ref(false)
const includedVisible = ref(false)

let statsObs: IntersectionObserver | null = null
let includedObs: IntersectionObserver | null = null

onMounted(() => {
    statsObs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) statsVisible.value = true },
        { threshold: 0.2 }
    )
    includedObs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) includedVisible.value = true },
        { threshold: 0.15 }
    )
    if (statsRef.value) statsObs.observe(statsRef.value)
    if (includedRef.value) includedObs.observe(includedRef.value)
})

onBeforeUnmount(() => {
    statsObs?.disconnect()
    includedObs?.disconnect()
})
</script>

<style scoped>
/* ── Hero ── */
.hero {
    background: linear-gradient(160deg, #1db954 0%, #15803d 40%, #14532d 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 24px 80px;
    margin: 0 -24px;
    margin-top: -32px;
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
}

.hero::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
}

.hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 560px;
}

.hero-badge {
    display: inline-flex;
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.15);
    padding: 4px 12px;
    border-radius: 999px;
    margin-bottom: 16px;
}

.hero-title {
    font-size: 3.2rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: -0.03em;
    line-height: 1;
}

.hero-sub {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 16px;
}

.hero-desc {
    font-size: 0.88rem;
    line-height: 2;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 32px;
}

.hero-desc code {
    font-size: 0.8rem;
    background: rgba(255,255,255,0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
}

.hero-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: #fff;
    color: #15803d;
    font-size: 0.82rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
}

.btn-ghost:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.35);
}

/* ── Stats ── */
.stats-section {
    padding: 48px 24px;
    max-width: 700px;
    margin: 0 auto;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.stat-item {
    text-align: center;
    padding: 20px 12px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 14px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.stats-grid.is-visible .stat-item {
    opacity: 1;
    transform: translateY(0);
}

.stat-num {
    display: block;
    font-size: 1.6rem;
    font-weight: 900;
    color: var(--k-primary);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin-bottom: 6px;
}

.stat-label {
    font-size: 0.68rem;
    color: var(--k-text-muted);
}

/* ── Tech Stack ── */
.tech-section {
    padding: 40px 24px;
    max-width: 700px;
    margin: 0 auto;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--k-text-primary);
    margin: 0 0 8px;
    text-align: center;
}

.section-desc {
    font-size: 0.74rem;
    color: var(--k-text-muted);
    margin: 0 0 24px;
    text-align: center;
}

.tech-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.tech-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 12px;
}

.tech-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
    flex-shrink: 0;
}

.tech-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary);
}

.tech-desc {
    font-size: 0.66rem;
    color: var(--k-text-muted);
}

/* ── Included ── */
.included-section {
    padding: 40px 24px 60px;
    max-width: 700px;
    margin: 0 auto;
}

.included-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.included-card {
    display: flex;
    gap: 14px;
    padding: 18px 16px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 12px;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.included-section.is-visible .included-card {
    opacity: 1;
    transform: translateY(0);
}

.included-num {
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--k-primary);
    opacity: 0.5;
    flex-shrink: 0;
    padding-top: 2px;
    font-variant-numeric: tabular-nums;
}

.included-text h3 {
    margin: 0 0 4px;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--k-text-primary);
}

.included-text p {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.8;
    color: var(--k-text-secondary);
}

/* ── Live Preview ── */
.preview-section {
    padding: 40px 24px 60px;
    max-width: 800px;
    margin: 0 auto;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.preview-card {
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 14px;
    padding: 16px;
    overflow: hidden;
}

.preview-label {
    font-size: 0.64rem;
    font-weight: 800;
    color: var(--k-text-muted);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

/* ── CTA ── */
.cta-section {
    padding: 40px 24px 60px;
    max-width: 600px;
    margin: 0 auto;
}

.cta-card {
    text-align: center;
    padding: 40px 32px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 16px;
}

.cta-card h2 {
    font-size: 1.2rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 8px;
}

.cta-card p {
    font-size: 0.82rem;
    color: var(--k-text-muted);
    margin: 0 0 24px;
    line-height: 1.8;
}

.cta-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

@media (max-width: 600px) {
    .hero {
        min-height: 85vh;
        padding: 100px 20px 60px;
    }
    .hero-title {
        font-size: 2.4rem;
    }
    .stats-grid,
    .tech-grid,
    .preview-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .included-grid {
        grid-template-columns: 1fr;
    }
}
</style>
