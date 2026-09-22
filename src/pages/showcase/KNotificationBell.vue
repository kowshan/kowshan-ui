<template>
    <div class="sp">
        <h2 class="sp-title">KNotificationBell</h2>

        <h3 class="sp-sub">چند اعلان (با خوانده‌نشده‌ها)</h3>
        <div class="sp-row" style="align-items: flex-start; gap: 24px;">
            <KNotificationBell :items="items" @read="onRead" @read-all="onReadAll" />
            <div>
                <div class="sp-vmodel">read: {{ lastRead }}</div>
                <div class="sp-vmodel">read-all: {{ readAllCount }} بار</div>
                <div class="sp-vmodel">خوانده‌نشده: {{ items.filter(i => !i.read).length }}</div>
            </div>
        </div>

        <h3 class="sp-sub">انواع اعلان (info / success / warning / error)</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KNotificationBell :items="typed" @read="onRead" />
        </div>

        <h3 class="sp-sub">همه خوانده‌شده</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KNotificationBell :items="allRead" @read="onRead" />
        </div>

        <h3 class="sp-sub">خالی</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KNotificationBell :items="[]" />
        </div>

        <h3 class="sp-sub">متن‌های بلند</h3>
        <div class="sp-row" style="align-items: flex-start;">
            <KNotificationBell :items="longItems" @read="onRead" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KNotificationBell, { type KNotification } from '../../ui-kit/components/KNotificationBell.vue'

const lastRead = ref('—')
const readAllCount = ref(0)

const onRead = (n: KNotification) => { lastRead.value = n.title }
const onReadAll = () => { readAllCount.value++ }

const items = ref<KNotification[]>([
    { id: 1, title: 'سفارش جدید ثبت شد', message: 'سفارش #۱۰۲۴ برای «دوره Vue پیشرفته»', time: '۲ دقیقه پیش', type: 'success' },
    { id: 2, title: 'موجودی کم است', message: 'هدفون بی‌سیم — ۳ عدد باقی مانده', time: '۱ ساعت پیش', type: 'warning' },
    { id: 3, title: 'پرداخت ناموفق', message: 'تراکنش سفارش #۱۰۱۹ برگشت خورد', time: 'دیروز', type: 'error' },
    { id: 4, title: 'به‌روزرسانی کیت', message: 'نسخه ۲٫۴ منتشر شد', time: '۳ روز پیش', read: true, type: 'info' },
])

const typed: KNotification[] = [
    { id: 'a', title: 'اطلاعیه سیستم', message: 'پشتیبان‌گیری شبانه انجام شد', time: '۰۱:۰۰', type: 'info' },
    { id: 'b', title: 'عملیات موفق', message: 'فایل اکسل با موفقیت ایمپورت شد', time: '۰۸:۳۰', type: 'success' },
    { id: 'c', title: 'هشدار اعتبار', message: 'اعتبار سند رو به اتمام است', time: '۱۰:۱۵', type: 'warning' },
    { id: 'd', title: 'خطای درگاه', message: 'اتصال به درگاه پرداخت قطع شد', time: '۱۱:۴۵', type: 'error' },
]

const allRead: KNotification[] = items.value.map(i => ({ ...i, read: true }))

const longItems: KNotification[] = [
    {
        id: 'l1',
        title: 'گزارش هفتگی فروش آماده شد',
        message: 'گزارش کامل فروش هفته گذشته شامل تفکیک کانال‌های فروش، بازگشتی‌ها و مقایسه با هفته قبل آماده دانلود است.',
        time: '۲ روز پیش',
        type: 'info',
    },
    {
        id: 'l2',
        title: 'یک عنوان بسیار طولانی برای بررسی رفتار متن در پنل اعلان‌ها که ممکن است در چند خط بشکند',
        message: 'پیام کوتاه همراه با یک عنوان بلند.',
        time: '۳ روز پیش',
        type: 'warning',
    },
]
</script>
