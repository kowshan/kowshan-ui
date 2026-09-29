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

        <h3 class="sp-sub">یک مرحله غیرفعال در میانه</h3>
        <div class="sp-card">
            <KStepper v-model="s4" :steps="disabledSteps" />
            <p class="sp-note">
                مرحله «پرداخت» غیرفعال است: نه با کلیک و نه با کلید انتخاب نمی‌شود،
                اما بقیه مراحل آزادانه قابل انتخاب‌اند.
            </p>
        </div>

        <h3 class="sp-sub">همه مراحل غیرفعال</h3>
        <div class="sp-card">
            <KStepper v-model="s9" :steps="allDisabledSteps" />
            <p class="sp-note">
                برای زمانی که هیچ مرحله‌ای قابل پرش نیست و استپر فقط وضعیت را نمایش می‌دهد
                (نتیجهٔ آزمون، فرم قفل‌شده).
            </p>
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

        <h3 class="sp-sub">زیرمرحله‌ها — نقطه‌های مدار</h3>
        <div class="sp-card" style="max-width: 640px; display: flex; flex-direction: column; gap: 14px;">
            <KStepper v-model="s10" :steps="subStepSteps" :sub-step="inner" :clickable="false" />
            <p class="sp-note">
                هر مرحله می‌تواند زیرمرحله داشته باشد. زیرمرحله‌ها به‌جای دایره‌های تازه،
                <b>نقطه‌هایی روی مدار همان دایره</b>اند — پس ۳۰ صفحهٔ سؤال همان‌قدر جا می‌گیرد که
                ۲ صفحه. نقطهٔ فعال پررنگ است، گذشت‌ه‌ها سبز می‌شوند و گذاشتن موس روی هر نقطه
                برچسبِ همان زیرمرحله را نشان می‌دهد. <code>v-model</code> همان شناسهٔ مرحله می‌ماند؛
                زیرمرحلهٔ فعال با پراپ جداگانهٔ <code>sub-step</code> (اندیس، از صفر) می‌آید،
                چون فقط مدارِ مرحلهٔ جاری روشن می‌شود.
            </p>
            <div style="display: flex; gap: 10px;">
                <KButton text="زیرمرحله بعد" @click="inner = Math.min(inner + 1, 4)" />
                <KButton text="زیرمرحله قبل" :bg-color="'transparent'" @click="inner = Math.max(inner - 1, 0)" />
            </div>
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

/* یک مرحلهٔ «پرسش‌ها» با ۵ صفحه — همان الگوی KAssessmentWizard */
const subStepSteps = [
    { id: 'form', label: 'فرم' },
    { id: 'birth', label: 'تاریخ تولد' },
    {
        id: 'survey',
        label: 'پرسش‌ها',
        subSteps: [
            'اطلاعات پایه · سؤال ۱–۴',
            'دانش فنی · سؤال ۵–۸',
            'مهارت‌ها · سؤال ۹–۱۲',
            'شواهد · سؤال ۱۳–۱۶',
            'بازبینی · سؤال ۱۷–۱۸',
        ],
    },
    { id: 'done', label: 'تأیید' },
]

const s10 = ref('survey')
const inner = ref(2)

const s1 = ref('content')
const s2 = ref('info')
const s3 = ref('review')
const s4 = ref('address')
const s5 = ref('c')
const s7 = ref('c')
const s8 = ref('m3')
const s9 = ref('q2')

const allDisabledSteps = [
    { id: 'q1', label: 'اطلاعات', disabled: true },
    { id: 'q2', label: 'تأیید شمارهٔ موبایل', disabled: true },
    { id: 'q3', label: 'انتشار', disabled: true },
]

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
