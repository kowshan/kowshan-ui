<template>
    <div class="sp">
        <h2 class="sp-title">KOnboardingTour</h2>
        <p class="sp-note">
            تور راهنما — هر گام یک <code>target</code> (سلکتور CSS) را هایلایت می‌کند و با
            <code>v-model</code> باز/بسته می‌شود.
        </p>

        <h3 class="sp-sub">تور ۳ مرحله‌ای روی همین صفحه</h3>
        <div class="sp-row">
            <KButton text="شروع تور" bg-color="var(--k-primary)" text-color="#fff" @click="startTour" />
            <span class="sp-vmodel">وضعیت: {{ tourOpen ? 'فعال' : 'بسته' }} · گام: {{ stepLabel }}</span>
        </div>

        <div class="sp-card" style="display: flex; gap: 12px; flex-wrap: wrap;">
            <KButton id="tour-search" text="جستجو" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" />
            <KButton id="tour-create" text="ساخت پروژه" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" />
            <KButton id="tour-profile" text="پروفایل" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" />
        </div>

        <KOnboardingTour v-model="tourOpen" :steps="steps" @complete="onComplete" />

        <h3 class="sp-sub">تور دو مرحله‌ای (موقعیت‌های مختلف)</h3>
        <div class="sp-row">
            <KButton text="شروع تور دوم" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="shortOpen = true" />
        </div>
        <div class="sp-card" style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <KButton id="tour-a" text="هدف چپ" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" />
            <KButton id="tour-b" text="هدف راست" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" />
        </div>
        <KOnboardingTour v-model="shortOpen" :steps="shortSteps" @complete="onComplete" />

        <div class="sp-vmodel" style="margin-top: 16px;">complete: {{ completes }} بار کامل شد</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KOnboardingTour from '../../ui-kit/components/KOnboardingTour.vue'
import KButton from '../../ui-kit/components/KButton.vue'

type TourStep = { target: string; title: string; description: string; position?: 'top' | 'bottom' | 'left' | 'right' }

const tourOpen = ref(false)
const shortOpen = ref(false)
const completes = ref(0)
const stepLabel = ref('—')

const steps: TourStep[] = [
    {
        target: '#tour-search',
        title: 'جستجوی سریع',
        description: 'از اینجا می‌توانید بین پروژه‌ها، دوره‌ها و مشتریان جستجو کنید.',
        position: 'bottom',
    },
    {
        target: '#tour-create',
        title: 'ساخت پروژه جدید',
        description: 'هر پروژه یک فضای کاری جدا با اعضا و دسترسی‌های خودش است.',
        position: 'bottom',
    },
    {
        target: '#tour-profile',
        title: 'حساب کاربری',
        description: 'تنظیمات پروفایل، اعلان‌ها و خروج از حساب در این بخش است.',
        position: 'left',
    },
]

const shortSteps: TourStep[] = [
    { target: '#tour-a', title: 'گام اول', description: 'این یک توضیح کوتاه برای گام اول است.', position: 'right' },
    { target: '#tour-b', title: 'گام دوم', description: 'و این هم گام دوم؛ دکمه پایان تور را بزنید.', position: 'top' },
]

const startTour = () => { tourOpen.value = true; stepLabel.value = '۱' }

const onComplete = () => {
    completes.value++
    stepLabel.value = 'پایان'
}
</script>
