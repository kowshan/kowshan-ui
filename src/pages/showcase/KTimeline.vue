<template>
    <div class="sp">
        <h2 class="sp-title">KTimeline</h2>

        <h3 class="sp-sub">پایه — رخدادهای سفارش</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="order" />
        </div>

        <h3 class="sp-sub">همه variant‌ها</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="variants" />
        </div>

        <h3 class="sp-sub">رنگ دلخواه (hex)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="customColors" />
        </div>

        <h3 class="sp-sub">با آیکون</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="withIcons" />
        </div>

        <h3 class="sp-sub">بدون توضیح و بدون زمان (نقطه‌های خالی)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="minimal" />
        </div>

        <h3 class="sp-sub">یک آیتم و فهرست خالی</h3>
        <div class="sp-card" style="max-width: 560px; display: flex; flex-direction: column; gap: 24px;">
            <KTimeline :items="[{ title: 'فقط یک رخداد', time: 'امروز' }]" />
            <KTimeline :items="[]" />
            <p class="sp-note">فهرست دوم خالی است — هیچ چیزی رندر نمی‌شود.</p>
        </div>

        <h3 class="sp-sub">اسلات سفارشی برای یک آیتم</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="order">
                <template #item-1="{ item }">
                    <div style="border: 1px dashed var(--k-primary); border-radius: 10px; padding: 10px 12px;">
                        <strong style="font-size: 0.85rem;">{{ item.title }}</strong>
                        <div style="font-size: 0.75rem; color: var(--k-text-secondary); margin-top: 4px;">
                            این ردیف با اسلات سفارشی رندر شده است.
                        </div>
                    </div>
                </template>
            </KTimeline>
        </div>

        <h3 class="sp-sub">فهرست بلند — تاریخچه فعالیت</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KTimeline :items="activity" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { BookOpen, CheckCircle2, CreditCard, MessageSquare, UserPlus } from 'lucide-vue-next'
import KTimeline from '../../ui-kit/components/KTimeline.vue'
import type { KTimelineItem } from '../../ui-kit/components/KTimeline.vue'

const order: KTimelineItem[] = [
    { title: 'ثبت سفارش', description: 'سفارش ۱۲۳۴۵ ثبت شد', time: '۱۰:۱۲', color: 'info' },
    { title: 'پرداخت موفق', description: 'مبلغ ۱٬۲۹۰٬۰۰۰ تومان از درگاه شاپرک کسر شد', time: '۱۰:۱۵', color: 'success' },
    { title: 'در حال آماده‌سازی', description: 'دسترسی دوره فعال شد', time: '۱۰:۱۶', color: 'warning' },
    { title: 'ارسال ایمیل', description: 'اطلاعات ورود به حساب ارسال شد', time: '۱۰:۱۷', color: 'primary' },
    { title: 'لغو درخواست فاکتور', description: 'درخواست فاکتور رسمی لغو شد', time: '۱۱:۰۲', color: 'danger' },
]

const variants: KTimelineItem[] = [
    { title: 'primary', description: 'رنگ اصلی', time: '۰۱', color: 'primary' },
    { title: 'success', description: 'عملیات موفق', time: '۰۲', color: 'success' },
    { title: 'warning', description: 'نیاز به توجه', time: '۰۳', color: 'warning' },
    { title: 'danger', description: 'خطا یا حذف', time: '۰۴', color: 'danger' },
    { title: 'info', description: 'اطلاع‌رسانی', time: '۰۵', color: 'info' },
]

const customColors: KTimelineItem[] = [
    { title: 'بنفش سفارشی', description: '#8b5cf6', time: '۰۱', color: '#8b5cf6' },
    { title: 'فیروزه‌ای', description: '#14b8a6', time: '۰۲', color: '#14b8a6' },
    { title: 'صورتی', description: '#ec4899', time: '۰۳', color: '#ec4899' },
]

const withIcons: KTimelineItem[] = [
    { title: 'ثبت‌نام زبان‌آموز', time: '۰۹:۳۰', icon: UserPlus, color: 'info' },
    { title: 'پرداخت شهریه', time: '۰۹:۴۱', icon: CreditCard, color: 'success' },
    { title: 'شروع دوره', time: '۱۰:۰۰', icon: BookOpen, color: 'primary' },
    { title: 'پیام از پشتیبانی', time: '۱۲:۲۰', icon: MessageSquare, color: 'warning' },
]

const minimal: KTimelineItem[] = [
    { title: 'نام‌نویسی اولیه' },
    { title: 'تأیید مدارک' },
    { title: 'تعیین سطح' },
]

const activity: KTimelineItem[] = [
    { title: 'ورود به حساب', time: '۰۸:۱۲', color: 'info' },
    { title: 'مشاهده ویدیو جلسه ۵', time: '۰۸:۱۵', color: 'info' },
    { title: 'تکمیل تمرین شنیداری', time: '۰۸:۴۰', color: 'success' },
    { title: 'ارسال تکلیف نوشتاری', time: '۰۹:۰۵', color: 'primary' },
    { title: 'نمره تکلیف: ۱۸ از ۲۰', time: '۱۱:۳۰', color: 'success' },
    { title: 'یادداشت مدرس', description: 'روی زمان حال کامل تمرین بیشتری لازم است.', time: '۱۱:۳۳', color: 'warning' },
    { title: 'رزرو جلسه خصوصی', time: '۱۴:۰۰', color: 'info' },
    { title: 'پرداخت جلسه خصوصی', time: '۱۴:۰۲', color: 'success' },
    { title: 'خروج از حساب', time: '۲۲:۴۵', color: 'info', icon: CheckCircle2 },
]
</script>
