<template>
    <DemoSection
        id="calendar"
        index="07"
        title="تقویم"
        description="تقویم شمسی کامل با رویدادها، نمایش‌های ماه/هفته/روز/سال/فهرست و ۱۰۲ تم آماده"
    >
        <KCalendar :events="calendarEvents" :theme="calTheme" />

        <!-- Theme grid — all themes, no scroll -->
        <div class="cal-theme">
            <div class="cal-theme-head">
                <span class="cal-theme-title">همه تم‌های تقویم ({{ CALENDAR_THEMES.length }})</span>
                <span class="cal-theme-current">{{ calTheme }}</span>
            </div>
            <div class="cal-theme-grid">
                <button
                    v-for="t in calThemes"
                    :key="t.name"
                    type="button"
                    class="cal-theme-btn"
                    :class="{ 'is-active': calTheme === t.name }"
                    :title="t.name"
                    @click="calTheme = t.name"
                >
                    <span class="cal-theme-swatch" :style="{ background: t.color }"></span>
                    <span class="cal-theme-label">{{ t.label }}</span>
                </button>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import KCalendar from '../ui-kit/calendar/KCalendar.vue'
import { CALENDAR_THEMES } from '../ui-kit/calendar/types/theme'
import type { CalendarTheme } from '../ui-kit/calendar/types/theme'

const calendarEvents = [
    { id: 1, title: 'بازدید ملک', category: 'meeting', categoryTitle: 'ملاقات', startDate: '1403-05-12', color: '#3b82f6' },
    { id: 2, title: 'قرارداد فروش', category: 'contract', categoryTitle: 'قرارداد', startDate: '1403-05-15', color: '#10b981' },
    { id: 3, title: 'پرداخت اقساط', category: 'payment', categoryTitle: 'پرداخت', startDate: '1403-05-18', color: '#f59e0b' },
    { id: 4, title: 'جلسه کارشناسی', category: 'meeting', categoryTitle: 'ملاقات', startDate: '1403-05-22', endDate: '1403-05-23', color: '#8b5cf6' },
    { id: 5, title: 'انتقال سند', category: 'contract', categoryTitle: 'قرارداد', startDate: '1403-05-28', color: '#ef4444' },
]

/* swatch colors extracted from calendar.css (--cal-primary per theme) */
const themeColors: Record<string, string> = {
    light: '#f8fafc', dark: '#27272a', oled: '#000',
    royal: '#9b59b6', executive: '#d4af37', midnight: '#3b82f6', emerald: '#10b981', rosegold: '#e83e8c',
    forest: '#22c55e', ocean: '#0ea5e9', sunset: '#f97316', desert: '#e6b800', mountain: '#6c8aa0',
    lavender: '#9b59b6', rose: '#e83e8c', mint: '#27ae60', peach: '#e67e22', sky: '#2980b9',
    apple: '#0071e3', google: '#4285f4', microsoft: '#0078d4', meta: '#0064e1', amazon: '#ff9900',
    netflix: '#e50914', spotify: '#1db954', tesla: '#e82127', openai: '#10a37f', github: '#0366d6',
    gucci: '#d4af37', chanel: '#111', hermes: '#ff6600', rolex: '#004225', versace: '#f5d742',
    louis: '#6b3a2a', prada: '#111', dior: '#1a1a2e', cartier: '#ff1a1a', tiffany: '#0ab5b5',
    starbucks: '#1e3932', coca: '#f40000', pepsi: '#003087', mcd: '#ffbc0d', burger: '#8b4513',
    nike: '#111', adidas: '#111', ferrari: '#ff2800', lamborghini: '#f5a623', porsche: '#111',
    bmw: '#0066b4', mercedes: '#a1a1a1', aurora: '#00ff87', sunrise: '#ff7e5f', twilight: '#9b59b6',
    cosmic: '#00e5e5', candy: '#ff6b6b', neon: '#00ff00', pastel: '#f5c6d0', monochrome: '#333',
    vintage: '#8b5a2b', modern: '#3b82f6', nowruz: '#50c878', halloween: '#ff6b35', christmas: '#d32f2f',
    valentine: '#ff69b4', summer: '#ff8c00', autumn: '#d2691e', winter: '#4682b4', spring: '#7ccc6a',
    iran: '#008080', japan: '#8b0000', france: '#002b5c', italy: '#2a6a2a', germany: '#d4af37',
    uk: '#1a3a6a', canada: '#cc0000', brazil: '#008000', australia: '#8b5a2b', india: '#cc8a2a',
    zigzag: '#e94560', dots: '#ff6b6b', stripes: '#1a8a5a', waves: '#38bdf8', grid: '#3498db',
    marble: '#8a8a8a', leather: '#d4af37', wood: '#d4af37', glass: '#3b82f6', metal: '#c0c0c0',
    bitcoin: '#f7931a', ethereum: '#627eea', solana: '#14f195', ai: '#00b4d8', cyber: '#00ff00',
    instagram: '#833ab4', telegram: '#0088cc', x: '#111', whatsapp: '#25d366', linkedin: '#0077b5',
    'iran-premium': '#da0000', 'persian-royal': '#d4af37', garden: '#239f40', persepolis: '#8b5a2b',
}

/* Persian labels for recognizable themes; falls back to the raw name */
const themeLabels: Record<string, string> = {
    light: 'روشن', dark: 'تیره', oled: 'OLED',
    royal: 'سلطنتی', executive: 'مدیریتی', midnight: 'نیمه‌شب', emerald: 'زمردی', rosegold: 'رزگلد',
    forest: 'جنگل', ocean: 'اقیانوس', sunset: 'غروب', desert: 'کویر', mountain: 'کوهستان',
    lavender: 'اسطوخودوس', rose: 'رز', mint: 'نعنایی', peach: 'هلو', sky: 'آسمانی',
    apple: 'اپل', google: 'گوگل', microsoft: 'مایکروسافت', meta: 'متا', amazon: 'آمازون',
    netflix: 'نت‌فلیکس', spotify: 'اسپاتیفای', tesla: 'تسلا', openai: 'اوپن‌ای‌آی', github: 'گیت‌هاب',
    gucci: 'گوچی', chanel: 'شنل', hermes: 'هرمس', rolex: 'رولکس', versace: 'ورساچه',
    louis: 'لویی‌ویتون', prada: 'پرادا', dior: 'دیور', cartier: 'کارتیه', tiffany: 'تیفانی',
    starbucks: 'استارباکس', coca: 'کوکاکولا', pepsi: 'پپسی', mcd: 'مک‌دونالد', burger: 'برگرکینگ',
    nike: 'نایک', adidas: 'آدیداس', ferrari: 'فراری', lamborghini: 'لامبورگینی', porsche: 'پورشه',
    bmw: 'بی‌ام‌و', mercedes: 'مرسدس', aurora: 'شفق', sunrise: 'طلوع', twilight: 'گرگومیش',
    cosmic: 'کیهانی', candy: 'آب‌نباتی', neon: 'نئون', pastel: 'پاستلی', monochrome: 'تک‌رنگ',
    vintage: 'قدیمی', modern: 'مدرن', nowruz: 'نوروز', halloween: 'هالووین', christmas: 'کریسمس',
    valentine: 'ولنتاین', summer: 'تابستان', autumn: 'پاییز', winter: 'زمستان', spring: 'بهار',
    iran: 'ایران', japan: 'ژاپن', france: 'فرانسه', italy: 'ایتالیا', germany: 'آلمان',
    uk: 'انگلیس', canada: 'کانادا', brazil: 'برزیل', australia: 'استرالیا', india: 'هند',
    zigzag: 'زیگزاگ', dots: 'خال‌خالی', stripes: 'راه‌راه', waves: 'موج', grid: 'شطرنجی',
    marble: 'مرمر', leather: 'چرم', wood: 'چوب', glass: 'شیشه‌ای', metal: 'فلزی',
    bitcoin: 'بیت‌کوین', ethereum: 'اتریوم', solana: 'سولانا', ai: 'هوش مصنوعی', cyber: 'سایبر',
    instagram: 'اینستاگرام', telegram: 'تلگرام', x: 'ایکس', whatsapp: 'واتساپ', linkedin: 'لینکدین',
    'iran-premium': 'ایران پریمیوم', 'persian-royal': 'شاهنشاهی', garden: 'باغ ایرانی', persepolis: 'تخت جمشید',
}

const calThemes = CALENDAR_THEMES.map((name) => ({
    name,
    label: themeLabels[name] ?? name,
    color: themeColors[name] ?? '#888',
}))

const calTheme = ref<CalendarTheme>('light')
</script>

<style scoped>
.cal-theme {
    margin-top: 18px;
}

.cal-theme-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.cal-theme-title {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--k-text-secondary);
}

.cal-theme-current {
    font-size: 0.6rem;
    font-weight: 700;
    font-family: monospace;
    direction: ltr;
    color: var(--k-primary);
    background: var(--k-primary-light);
    border: 1px solid color-mix(in srgb, var(--k-primary) 25%, transparent);
    padding: 2px 10px;
    border-radius: 999px;
}

/* full grid — no scroll */
.cal-theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
    gap: 6px;
}

.cal-theme-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    padding: 6px 8px;
    font-size: 0.66rem;
    font-weight: 600;
    font-family: inherit;
    color: var(--k-text-secondary);
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.cal-theme-btn:hover {
    border-color: var(--k-primary);
    color: var(--k-text-primary);
}

.cal-theme-btn.is-active {
    background: var(--k-primary);
    border-color: var(--k-primary);
    color: #fff;
    font-weight: 700;
}

.cal-theme-swatch {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, #000 12%, transparent);
    flex-shrink: 0;
}

.cal-theme-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
