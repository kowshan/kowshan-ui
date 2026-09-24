<template>
    <div class="sp">
        <h2 class="sp-title">KStepper</h2>

        <h3 class="sp-sub">پایه — قابل کلیک</h3>
        <div class="sp-card">
            <KStepper v-model="s1" :steps="steps" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                مرحله فعال: {{ s1 }} — (با کلیدهای ← → و Home/End هم جابه‌جا می‌شود)
            </div>
        </div>

        <h3 class="sp-sub">در ابتدای مسیر (هیچ‌کدام انجام‌نشده)</h3>
        <div class="sp-card">
            <KStepper v-model="s2" :steps="steps" />
        </div>

        <h3 class="sp-sub">در انتها (همه انجام‌شده)</h3>
        <div class="sp-card">
            <KStepper v-model="s3" :steps="steps" />
        </div>

        <h3 class="sp-sub">با مرحله غیرفعال</h3>
        <div class="sp-card">
            <KStepper v-model="s4" :steps="disabledSteps" />
            <p class="sp-note">مرحله «پرداخت» غیرفعال است و با کلیک جابه‌جا نمی‌شود.</p>
        </div>

        <h3 class="sp-sub">۵ مرحله</h3>
        <div class="sp-card">
            <KStepper v-model="s5" :steps="fiveSteps" />
        </div>

        <h3 class="sp-sub">فقط نمایش پیشرفت — بدون کلیک</h3>
        <div class="sp-card">
            <KStepper v-model="s7" :steps="fiveSteps" :clickable="false" />
            <p class="sp-note">
                با <code>:clickable="false"</code> استپر تنها وضعیت را نشان می‌دهد (مثل ویزارد آزمون):
                نه کلیک و نه کلیدهای ← → جابه‌جا نمی‌کنند. <code>KAssessmentWizard</code> همین حالت را
                استفاده می‌کند تا کاربر مرحله‌به‌مرحله جلو برود.
            </p>
        </div>

        <h3 class="sp-sub">برچسب‌های بلند</h3>
        <div class="sp-card">
            <KStepper v-model="s6" :steps="longSteps" />
        </div>

        <h3 class="sp-sub">مراحل زیاد — اسکرول افقی با محو شدن لبه‌ها</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KStepper v-model="s8" :steps="manySteps" />
            <p class="sp-note">
                وقتی برچسب‌ها جا نشوند، خودِ استپر افقی اسکرول می‌شود؛ لبه‌ای که محتوایش پنهان است
                با یک ماسک محو می‌شود (نه با رنگ ثابت، پس روی کارت و دارک‌مود هم درست است) و
                نوار اسکرول دیده نمی‌شود. با درگ، شیفت+ویدیل یا موس هم می‌شود اسکرول کرد.
            </p>
        </div>

        <h3 class="sp-sub">فرم چندمرحله‌ای — محتوای هر گام</h3>
        <div class="sp-card" style="max-width: 640px; display: flex; flex-direction: column; gap: 18px;">
            <KStepper v-model="wizard" :steps="steps" />
            <div style="border: 1px solid var(--k-border); border-radius: 12px; padding: 16px;">
                <div v-if="wizard === 'info'" style="display: flex; flex-direction: column; gap: 12px;">
                    <KTextInput v-model="name" label="نام دوره" />
                    <KTextInput v-model="teacher" label="مدرس" />
                </div>
                <div v-else-if="wizard === 'content'" style="display: flex; flex-direction: column; gap: 12px;">
                    <KTextarea v-model="desc" label="توضیح کوتاه" :rows="3" />
                </div>
                <div v-else-if="wizard === 'price'" style="display: flex; flex-direction: column; gap: 12px;">
                    <KNumberInput v-model="price" label="قیمت (تومان)" :step="50000" />
                </div>
                <div v-else style="font-size: 0.85rem;">
                    بازبینی: {{ name || '—' }} / {{ teacher || '—' }} / {{ price ? price.toLocaleString('fa-IR') + ' تومان' : 'بدون قیمت' }}
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <KButton text="مرحله بعد" @click="nextStep" />
                <KButton text="مرحله قبل" :bg-color="'transparent'" @click="prevStep" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KStepper from '../../ui-kit/components/KStepper.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KTextarea from '../../ui-kit/wrappers/KTextarea.vue'
import KNumberInput from '../../ui-kit/components/KNumberInput.vue'

const steps = [
    { id: 'info', label: 'اطلاعات دوره' },
    { id: 'content', label: 'محتوا' },
    { id: 'price', label: 'قیمت‌گذاری' },
    { id: 'review', label: 'بازبینی و انتشار' },
]

const disabledSteps = [
    { id: 'cart', label: 'سبد خرید' },
    { id: 'address', label: 'آدرس' },
    { id: 'pay', label: 'پرداخت', disabled: true },
    { id: 'done', label: 'تأیید' },
]

const fiveSteps = [
    { id: 'a', label: 'ثبت‌نام' },
    { id: 'b', label: 'تعیین سطح' },
    { id: 'c', label: 'انتخاب کلاس' },
    { id: 'd', label: 'پرداخت' },
    { id: 'e', label: 'شروع دوره' },
]

const longSteps = [
    { id: 'one', label: 'تکمیل اطلاعات هویتی و مدارک' },
    { id: 'two', label: 'آزمون تعیین سطح آنلاین' },
    { id: 'three', label: 'انتخاب استاد و ساعت کلاس' },
]

const s1 = ref('content')
const s2 = ref('info')
const s3 = ref('review')
const s4 = ref('address')
const s5 = ref('c')
const s7 = ref('c')
const s8 = ref('m3')

const manySteps = [
    'ثبت‌نام اولیه', 'تأیید شمارهٔ موبایل', 'انتخاب رشته', 'تعیین سطح آنلاین',
    'مصاحبهٔ شفاهی', 'انتخاب استاد', 'زمان‌بندی کلاس', 'پرداخت شهریه', 'تکمیل مدارک', 'شروع دوره',
].map((label, i) => ({ id: `m${i + 1}`, label }))
const s6 = ref('two')

const wizard = ref('info')
const name = ref('')
const teacher = ref('')
const desc = ref('')
const price = ref(0)

const nextStep = () => {
    const i = steps.findIndex(s => s.id === wizard.value)
    if (i < steps.length - 1) wizard.value = steps[i + 1].id
}
const prevStep = () => {
    const i = steps.findIndex(s => s.id === wizard.value)
    if (i > 0) wizard.value = steps[i - 1].id
}
</script>
