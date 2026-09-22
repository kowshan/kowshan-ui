<template>
    <div class="sp">
        <h2 class="sp-title">KMultiStepWizard</h2>
        <p class="sp-note">
            ویزارد چندمرحله‌ای — ناوبری و نشانگر مرحله داخلی است، محتوای هر مرحله با اسلات
            <code>#step-N</code> می‌آید و <code>{ step, data }</code> می‌گیرد.
        </p>

        <h3 class="sp-sub">ویزارد ثبت‌نام (۳ مرحله با اعتبارسنجی)</h3>
        <div class="sp-card">
            <KMultiStepWizard :steps="signupSteps" @finish="onFinish" @step-change="onStepChange" @step-validate="onValidate">
                <template #step-0="{ data }">
                    <div class="wz-grid">
                        <KTextInput v-model="data.firstName" label="نام" required />
                        <KTextInput v-model="data.lastName" label="نام خانوادگی" required />
                    </div>
                </template>
                <template #step-1="{ data }">
                    <div class="wz-grid">
                        <KTextInput v-model="data.phone" label="شماره موبایل" placeholder="09xxxxxxxxx" required />
                        <KTextInput v-model="data.email" label="ایمیل" hint="اختیاری" />
                    </div>
                </template>
                <template #step-2="{ data }">
                    <div class="wz-summary">
                        <div v-for="(v, k) in data" :key="k" class="wz-summary-row">
                            <strong>{{ labels[k as string] || k }}:</strong>
                            <span>{{ v || '—' }}</span>
                        </div>
                    </div>
                </template>
            </KMultiStepWizard>
            <div class="sp-vmodel" style="margin-top: 12px;">finish: {{ finished }}</div>
            <div class="sp-vmodel">step-change: {{ stepChange }} · validate: {{ validation }}</div>
        </div>

        <h3 class="sp-sub">متن پایان سفارشی</h3>
        <div class="sp-card">
            <KMultiStepWizard :steps="simpleSteps" finish-text="ثبت نهایی" @finish="onFinish">
                <template #step-0><p>گام اول — اطلاعات پایه.</p></template>
                <template #step-1><p>گام دوم — بازبینی.</p></template>
            </KMultiStepWizard>
        </div>

        <h3 class="sp-sub">شروع از مرحله دوم</h3>
        <div class="sp-card">
            <KMultiStepWizard :steps="simpleSteps" :initial-step="1" finish-text="ذخیره" @finish="onFinish">
                <template #step-0><p>گام اول (پرش‌شده).</p></template>
                <template #step-1><p>از همین مرحله شروع شده است.</p></template>
            </KMultiStepWizard>
        </div>

        <h3 class="sp-sub">بدون اسلات (نمایش پیش‌فرض)</h3>
        <div class="sp-card">
            <KMultiStepWizard :steps="fourSteps" @finish="onFinish" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMultiStepWizard, { type WizardStep } from '../../ui-kit/components/KMultiStepWizard.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'

const finished = ref('—')
const stepChange = ref('—')
const validation = ref('—')

const onFinish = (data: any) => { finished.value = JSON.stringify(data) }
const onStepChange = (s: number) => { stepChange.value = `مرحله ${s + 1}` }
const onValidate = (s: number, valid: boolean) => { validation.value = `مرحله ${s + 1} → ${valid ? 'معتبر' : 'ناقص'}` }

const labels: Record<string, string> = {
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    phone: 'موبایل',
    email: 'ایمیل',
}

const signupSteps: WizardStep[] = [
    {
        title: 'اطلاعات شخصی',
        subtitle: 'نام و نام خانوادگی',
        validate: (d: any) => (d.firstName && d.lastName ? true : 'نام و نام خانوادگی الزامی است'),
    },
    {
        title: 'تماس',
        subtitle: 'موبایل و ایمیل',
        validate: (d: any) => (/^09\d{9}$/.test(String(d.phone || '')) ? true : 'شماره موبایل معتبر نیست'),
    },
    { title: 'بازبینی', subtitle: 'تأیید نهایی' },
]

const simpleSteps: WizardStep[] = [
    { title: 'گام اول' },
    { title: 'گام دوم' },
]

const fourSteps: WizardStep[] = [
    { title: 'انتخاب پلن' },
    { title: 'اطلاعات پرداخت' },
    { title: 'تأیید ایمیل', subtitle: 'کد ۶ رقمی' },
    { title: 'پایان' },
]
</script>

<style scoped>
.wz-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.wz-summary { display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem; }
.wz-summary-row { display: flex; gap: 8px; align-items: center; }
.wz-summary-row strong { color: var(--k-text-primary); min-width: 120px; }
.wz-summary-row span { color: var(--k-text-secondary); }
</style>
