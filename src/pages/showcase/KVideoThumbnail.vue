<template>
    <div class="sp">
        <h2 class="sp-title">KVideoThumbnail</h2>

        <h3 class="sp-sub">پایه — تصویر + عنوان</h3>
        <div class="sp-card">
            <div style="max-width: 320px;">
                <KVideoThumbnail :thumb="thumb('#1db954', '#0d9488', 'درس ۱')" title="درس ۱ — سلام و احوال‌پرسی" />
            </div>
        </div>

        <h3 class="sp-sub">با زیرعنوان، مدت و برچسب</h3>
        <div class="sp-card">
            <div style="max-width: 320px;">
                <KVideoThumbnail
                    :thumb="thumb('#6366f1', '#4338ca', 'درس ۲')"
                    title="درس ۲ — اعداد و شمارش"
                    subtitle="مدرس: سارا محمدی"
                    duration="۱۸:۴۲"
                    badge="جدید"
                    badge-color="#f59e0b"
                />
            </div>
        </div>

        <h3 class="sp-sub">برچسب‌های مختلف</h3>
        <div class="sp-card">
            <div class="vt-grid">
                <KVideoThumbnail :thumb="thumb('#22c55e', '#15803d', 'رایگان')" title="مقدمه دوره" duration="۰۵:۱۰" badge="رایگان" badge-color="#22c55e" />
                <KVideoThumbnail :thumb="thumb('#ef4444', '#991b1b', 'ویژه')" title="کارگاه تلفظ" duration="۴۲:۰۰" badge="ویژه" badge-color="#ef4444" />
                <KVideoThumbnail :thumb="thumb('#0ea5e9', '#0369a1', 'آزمون')" title="مرور نهایی آیلتس" duration="۳۱:۲۵" badge="پرفروش" badge-color="#0ea5e9" />
            </div>
        </div>

        <h3 class="sp-sub">اسلات meta</h3>
        <div class="sp-card">
            <div style="max-width: 320px;">
                <KVideoThumbnail :thumb="thumb('#8b5cf6', '#6d28d9', 'زیرنویس')" title="درس ۳ — زمان حال کامل" duration="۲۰:۰۵">
                    <template #meta>
                        <span style="display: inline-flex; gap: 6px; align-items: center; font-size: 0.7rem; color: var(--k-text-secondary);">
                            <span style="padding: 1px 8px; border-radius: 999px; background: var(--k-primary-light); color: var(--k-primary);">زیرنویس فارسی</span>
                            <span>۹۶٪ تکمیل</span>
                        </span>
                    </template>
                </KVideoThumbnail>
            </div>
        </div>

        <h3 class="sp-sub">پیش‌نمایش با هاور (videoSrc)</h3>
        <div class="sp-card">
            <div style="max-width: 320px;">
                <KVideoThumbnail
                    :thumb="thumb('#f59e0b', '#d97706', 'هاور')"
                    :video-src="clip"
                    title="موس را نگه دارید تا پیش‌نمایش پخش شود"
                    subtitle="نیازمند اینترنت — وگرنه فقط تصویر می‌ماند"
                    duration="۱۲:۰۰"
                />
            </div>
        </div>

        <h3 class="sp-sub">بدون تصویر (poster خالی)</h3>
        <div class="sp-card">
            <div style="max-width: 320px;">
                <KVideoThumbnail title="فایل ویدیو بدون پوستر" subtitle="فقط عنوان و آیکون پخش" duration="۰۳:۲۰" />
            </div>
        </div>

        <h3 class="sp-sub">کتابخانه دوره</h3>
        <div class="sp-card">
            <div class="vt-grid">
                <KVideoThumbnail
                    v-for="v in library"
                    :key="v.title"
                    :thumb="v.thumb"
                    :title="v.title"
                    :subtitle="v.subtitle"
                    :duration="v.duration"
                    :badge="v.badge"
                    :badge-color="v.badgeColor"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KVideoThumbnail from '../../ui-kit/components/KVideoThumbnail.vue'

const clip = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const thumb = (from: string, to: string, label: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='640' height='360' fill='url(%23g)'/><circle cx='520' cy='80' r='120' fill='%23ffffff' opacity='0.12'/><text x='320' y='200' font-size='40' text-anchor='middle' fill='%23ffffff' opacity='0.92'>${label}</text></svg>`

const library = [
    { title: 'مقدمه — چطور شروع کنیم', subtitle: 'سارا محمدی', duration: '۰۸:۱۲', thumb: thumb('#1db954', '#0d9488', 'مقدمه'), badge: 'رایگان', badgeColor: '#22c55e' },
    { title: 'گرامر — زمان‌های ساده', subtitle: 'رضا کریمی', duration: '۲۴:۳۰', thumb: thumb('#6366f1', '#4338ca', 'گرامر'), badge: '', badgeColor: '#1db954' },
    { title: 'تلفظ — صداهای دشوار', subtitle: 'مینا رستمی', duration: '۱۵:۰۵', thumb: thumb('#f59e0b', '#d97706', 'تلفظ'), badge: 'ویژه', badgeColor: '#f59e0b' },
    { title: 'آیلتس — اسپیکینگ', subtitle: 'امیر تهرانی', duration: '۳۸:۴۴', thumb: thumb('#0ea5e9', '#0369a1', 'اسپیکینگ'), badge: 'پرفروش', badgeColor: '#0ea5e9' },
    { title: 'نوشتار — پاراگراف‌نویسی', subtitle: 'نگار احمدی', duration: '۲۱:۱۰', thumb: thumb('#ec4899', '#be185d', 'نوشتار'), badge: '', badgeColor: '#1db954' },
    { title: 'شنیداری — تمرین سرعت', subtitle: 'حسین نوری', duration: '۱۹:۳۳', thumb: thumb('#14b8a6', '#0f766e', 'شنیداری'), badge: 'جدید', badgeColor: '#8b5cf6' },
]
</script>

<style scoped>
.vt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}
</style>
