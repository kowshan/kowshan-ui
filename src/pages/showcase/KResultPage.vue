<template>
    <div class="sp">
        <h2 class="sp-title">KResultPage</h2>

        <h3 class="sp-sub">پرداخت موفق</h3>
        <div class="sp-card">
            <KResultPage
                status="success"
                title="پرداخت با موفقیت انجام شد"
                description="شماره پیگیری: ۸۴۹۲۳۱ — دوره «مکالمه پیشرفته» به دوره‌های شما اضافه شد."
            >
                <template #actions>
                    <KButton text="مشاهده دوره" @click="onAction('view')" />
                    <KButton text="بازگشت به فروشگاه" :bg-color="'transparent'" @click="onAction('back')" />
                </template>
            </KResultPage>
        </div>

        <h3 class="sp-sub">خطا در پرداخت</h3>
        <div class="sp-card">
            <KResultPage
                status="error"
                title="پرداخت ناموفق بود"
                description="مبلغ از حساب شما کسر نشده است. می‌توانید دوباره تلاش کنید."
            >
                <template #actions>
                    <KButton text="تلاش دوباره" @click="onAction('retry')" />
                </template>
            </KResultPage>
        </div>

        <h3 class="sp-sub">هشدار</h3>
        <div class="sp-card">
            <KResultPage
                status="warning"
                title="اشتراک شما تا ۳ روز دیگر تمام می‌شود"
                description="برای جلوگیری از قطع دسترسی، اشتراک خود را تمدید کنید."
            />
        </div>

        <h3 class="sp-sub">اطلاع</h3>
        <div class="sp-card">
            <KResultPage
                status="info"
                title="در حال بررسی مدارک"
                description="نتیجه بررسی تا ۴۸ ساعت آینده پیامک می‌شود."
            />
        </div>

        <h3 class="sp-sub">۴۰۴ — یافت نشد</h3>
        <div class="sp-card">
            <KResultPage status="404" title="صفحه پیدا نشد" description="آدرس وارد‌شده وجود ندارد یا حذف شده است.">
                <template #actions>
                    <KButton text="بازگشت به داشبورد" @click="onAction('home')" />
                </template>
            </KResultPage>
        </div>

        <h3 class="sp-sub">خالی — بدون نتیجه</h3>
        <div class="sp-card">
            <KResultPage
                status="empty"
                title="نتیجه‌ای یافت نشد"
                description="با فیلترهای انتخابی هیچ دوره‌ای مطابقت ندارد."
            />
        </div>

        <h3 class="sp-sub">بدون توضیح و اکشن (فقط عنوان)</h3>
        <div class="sp-card">
            <KResultPage status="success" title="ذخیره شد" />
        </div>

        <h3 class="sp-sub">محتوای اسلاتی (HTML دلخواه)</h3>
        <div class="sp-card">
            <KResultPage status="info" title="گزارش آماده است">
                <p class="sp-note">فایل گزارش در تاریخ ۱۴۰۵/۰۶/۳۱ ساخته شد.</p>
                <template #actions>
                    <KButton text="دانلود گزارش" @click="onAction('download')" />
                </template>
            </KResultPage>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین اکشن: {{ lastAction ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KResultPage from '../../ui-kit/components/KResultPage.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const lastAction = ref<string | null>(null)
const onAction = (id: string) => { lastAction.value = id }
</script>
