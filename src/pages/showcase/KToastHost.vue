<template>
    <div class="sp">
        <h2 class="sp-title">KToastHost</h2>
        <p class="sp-note">
            میزبان توست‌ها است و در layout یک بار رندر می‌شود (به‌صورت سراسری، بدون تلمپورت).
            برای نمایش توست از استور استفاده کنید: <code>useKToast.success('…')</code>.
        </p>

        <h3 class="sp-sub">کاربردی — با استور</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <KButton text="موفقیت" bg-color="var(--k-success, #22c55e)" text-color="#fff" @click="success" />
            <KButton text="خطا" bg-color="var(--k-error, #ef4444)" text-color="#fff" @click="error" />
            <KButton text="هشدار" bg-color="var(--k-warning, #f59e0b)" text-color="#fff" @click="warning" />
            <KButton text="اطلاع" bg-color="var(--k-info, #3b82f6)" text-color="#fff" @click="info" />
        </div>

        <h3 class="sp-sub">گوشه‌ها (position برای هر توست)</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <KButton v-for="p in corners" :key="p.value" :text="p.label" :bg-color="'transparent'" @click="atCorner(p.value)" />
        </div>

        <h3 class="sp-sub">با عنوان و مدت سفارشی</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <KButton text="طولانی (۸ ثانیه)" @click="longToast" />
            <KButton text="کوتاه (۱.۵ ثانیه)" :bg-color="'transparent'" @click="shortToast" />
            <KButton text="بدون دکمه بستن" :bg-color="'transparent'" @click="noClose" />
        </div>

        <h3 class="sp-sub">با دکمه اکشن</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <KButton text="پایداری با دکمه" @click="withButtons" />
            <KButton text="دو دکمه" :bg-color="'transparent'" @click="twoButtons" />
        </div>

        <h3 class="sp-sub">خطاهای فرم (showErrors)</h3>
        <div class="sp-card">
            <KButton text="نمایش خطاهای لاراول" @click="formErrors" />
        </div>

        <h3 class="sp-sub">انبوه (چند توست هم‌زمان)</h3>
        <div class="sp-card">
            <KButton text="۵ توست پشت‌سرهم" @click="burst" />
        </div>

        <h3 class="sp-sub">پاک‌کردن دستی</h3>
        <div class="sp-card" style="display: flex; align-items: center; gap: 12px;">
            <KButton text="پاک‌کردن همه توست‌ها" bg-color="var(--k-error, #ef4444)" text-color="#fff" @click="clearAll" />
            <span class="sp-vmodel">توست‌های فعال: {{ activeCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { useKToast } from '../../ui-kit/composables/useKToast'
import { useToastStore } from '../../ui-kit/stores/toastStore'

const store = useToastStore()
const activeCount = computed(() => store.toasts.length)

const corners = [
    { label: 'بالا-راست', value: 'top-right' },
    { label: 'بالا-چپ', value: 'top-left' },
    { label: 'پایین-راست', value: 'bottom-right' },
    { label: 'پایین-چپ', value: 'bottom-left' },
]

const success = () => useKToast.success('دوره با موفقیت ایجاد شد')
const error = () => useKToast.error('ذخیره تغییرات ناموفق بود')
const warning = () => useKToast.warning('اعتبار اشتراک شما رو به پایان است')
const info = () => useKToast.info('گزارش جدید آماده شد')

const atCorner = (position: string) =>
    useKToast.info({ message: `این توست در گوشه ${position} است`, position: position as any, timeout: 3000 })

const longToast = () => useKToast.success({ title: 'بارگذاری کامل شد', message: 'فایل students.xlsx پردازش شد (۲۴۰ ردیف)', timeout: 8000 })
const shortToast = () => useKToast.info({ message: 'کپی شد', timeout: 1500 })
const noClose = () => useKToast.warning({ message: 'بدون دکمه بستن، خودکار می‌رود', timeout: 3000, closable: false })

const withButtons = () =>
    useKToast.warning({ message: 'تغییرات ذخیره نشده است', timeout: 0, buttons: [{ label: 'ذخیره', onClick: () => useKToast.success('ذخیره شد') }] })
const twoButtons = () =>
    useKToast.info({
        message: 'درس جدید اضافه شد',
        timeout: 0,
        buttons: [
            { label: 'مشاهده', onClick: () => useKToast.info('رفتن به درس') },
            { label: 'بازگردانی', onClick: () => useKToast.error('حذف شد') },
        ],
    })

const formErrors = () => useKToast.showErrors({ phone: ['شماره تماس معتبر نیست'], postal: ['کد پستی الزامی است'], level: ['سطح را انتخاب کنید'] }, 'ثبت‌نام نامعتبر')

const burst = () => {
    useKToast.info({ message: 'گام ۱ — دریافت داده', timeout: 4000 })
    setTimeout(() => useKToast.info({ message: 'گام ۲ — اعتبارسنجی', timeout: 4000 }), 200)
    setTimeout(() => useKToast.success({ message: 'گام ۳ — ذخیره‌سازی', timeout: 4000 }), 400)
    setTimeout(() => useKToast.warning({ message: 'گام ۴ — هشدار سازگاری', timeout: 4000 }), 600)
    setTimeout(() => useKToast.error({ message: 'گام ۵ — خطای شبیه‌سازی‌شده', timeout: 4000 }), 800)
}

const clearAll = () => store.clearToasts()
</script>
