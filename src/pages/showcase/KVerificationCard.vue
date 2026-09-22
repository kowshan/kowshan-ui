<template>
    <div class="sp">
        <h2 class="sp-title">KVerificationCard</h2>

        <h3 class="sp-sub">idle — شروع نشده</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard
                title="احراز هویت"
                subtitle="برای فعال‌سازی پرداخت، هویت خود را تأیید کنید"
                status="idle"
                :steps="steps"
            />
        </div>

        <h3 class="sp-sub">pending — در حال بررسی (نصف مراحل)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard
                status="pending"
                :steps="halfSteps"
                note="بازبینی مدارک معمولاً تا ۲۴ ساعت کاری طول می‌کشد."
            />
        </div>

        <h3 class="sp-sub">approved — تأیید شده</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard status="approved" :steps="allDone" note="حساب شما برای دریافت وجه فعال است." />
        </div>

        <h3 class="sp-sub">rejected — رد شده</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard
                status="rejected"
                :steps="rejectedSteps"
                note="تصویر پشت کارت ملی ناخوانا بود؛ لطفاً دوباره ارسال کنید."
            />
        </div>

        <h3 class="sp-sub">بدون مراحل (فقط وضعیت)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard status="approved" title="تأیید نهایی" subtitle="همه مدارک پذیرفته شد" />
        </div>

        <h3 class="sp-sub">پیشرفت دستی (progress)</h3>
        <div class="sp-card" style="max-width: 560px; display: flex; flex-direction: column; gap: 24px;">
            <KVerificationCard status="pending" :steps="steps" :progress="15" note="تازه شروع شده" />
            <KVerificationCard status="pending" :steps="steps" :progress="80" note="تقریباً تمام" />
        </div>

        <h3 class="sp-sub">آیکون و متن‌های سفارشی</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVerificationCard
                title="احراز هویت مدرسان"
                subtitle="این مرحله برای انتشار دوره الزامی است"
                status="pending"
                :steps="halfSteps"
                :icon="GraduationCap"
                :banners="customBanners"
            />
        </div>

        <h3 class="sp-sub">کاربردی — مسیر تأیید پروفایل</h3>
        <div class="sp-card" style="max-width: 560px; display: flex; flex-direction: column; gap: 16px;">
            <KVerificationCard status="pending" :steps="dynamicSteps" :note="`${doneCount} از ${dynamicSteps.length} مرحله انجام شده`" />
            <KButton :text="nextLabel" :disabled="doneCount === dynamicSteps.length" @click="completeNext" />
            <KButton text="بازنشانی" :bg-color="'transparent'" @click="reset" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GraduationCap } from 'lucide-vue-next'
import KVerificationCard from '../../ui-kit/components/KVerificationCard.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { KVerificationStep } from '../../ui-kit/components/KVerificationCard.vue'

const steps: KVerificationStep[] = [
    { id: 'phone', label: 'تأیید شماره موبایل' },
    { id: 'id', label: 'ارسال تصویر کارت ملی' },
    { id: 'selfie', label: 'سلفی با کارت ملی' },
    { id: 'bank', label: 'ثبت شماره شبا' },
]

const halfSteps: KVerificationStep[] = [
    { id: 'phone', label: 'تأیید شماره موبایل', done: true },
    { id: 'id', label: 'ارسال تصویر کارت ملی', done: true },
    { id: 'selfie', label: 'سلفی با کارت ملی', current: true },
    { id: 'bank', label: 'ثبت شماره شبا' },
]

const allDone: KVerificationStep[] = steps.map(s => ({ ...s, done: true }))

const rejectedSteps: KVerificationStep[] = [
    { id: 'phone', label: 'تأیید شماره موبایل', done: true },
    { id: 'id', label: 'ارسال تصویر کارت ملی', done: true },
    { id: 'selfie', label: 'سلفی با کارت ملی', current: true },
    { id: 'bank', label: 'ثبت شماره شبا' },
]

const customBanners = {
    pending: { icon: GraduationCap, text: 'درخواست شما در نوبت بررسی کارشناس آموزش است.' },
}

const dynamicSteps = ref<KVerificationStep[]>([
    { id: 's1', label: 'تأیید ایمیل', done: false },
    { id: 's2', label: 'تکمیل پروفایل', done: false },
    { id: 's3', label: 'افزودن دوره نمونه', done: false },
])

const doneCount = computed(() => dynamicSteps.value.filter(s => s.done).length)

const nextLabel = computed(() => {
    const next = dynamicSteps.value.find(s => !s.done)
    return next ? `انجام: ${next.label}` : 'همه مراحل انجام شد'
})

const completeNext = () => {
    const next = dynamicSteps.value.find(s => !s.done)
    if (next) next.done = true
}

const reset = () => {
    dynamicSteps.value = dynamicSteps.value.map(s => ({ ...s, done: false, current: false }))
}
</script>
