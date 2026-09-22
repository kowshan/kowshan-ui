<template>
    <div class="sp">
        <h2 class="sp-title">KRadioGroup</h2>

        <h3 class="sp-sub">پایه — عمودی</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KRadioGroup v-model="v1" :options="plans" label="پلن اشتراک" @change="onChange" />
            <div class="sp-vmodel" style="margin-top: 12px;">انتخاب: {{ v1 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">افقی</h3>
        <div class="sp-card">
            <KRadioGroup v-model="v2" :options="levels" label="سطح دوره" direction="horizontal" />
        </div>

        <h3 class="sp-sub">سبک قطعه‌ای (segmented)</h3>
        <div class="sp-card">
            <KRadioGroup v-model="v3" :options="ranges" variant="segmented" />
            <div class="sp-vmodel" style="margin-top: 12px;">بازه: {{ v3 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">سبک کارتی (cards) — با توضیح</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KRadioGroup v-model="v4" :options="methods" variant="cards" label="روش پرداخت" />
        </div>

        <h3 class="sp-sub">کارتی افقی</h3>
        <div class="sp-card">
            <KRadioGroup v-model="v5" :options="durations" variant="cards" direction="horizontal" label="مدت اشتراک" />
        </div>

        <h3 class="sp-sub">گزینه غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KRadioGroup v-model="v6" :options="withDisabled" label="نقش کاربر" />
        </div>

        <h3 class="sp-sub">کل گروه غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KRadioGroup v-model="v7" :options="plans" label="پلن اشتراک" disabled />
        </div>

        <h3 class="sp-sub">آرایه ساده رشته‌ای</h3>
        <div class="sp-card">
            <KRadioGroup v-model="v8" :options="['روزانه', 'هفتگی', 'ماهانه']" direction="horizontal" label="تناوب گزارش" />
        </div>

        <h3 class="sp-sub">فرم ثبت‌نام</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="name" label="نام و نام خانوادگی" />
            <KRadioGroup v-model="v9" :options="levels" label="سطح فعلی زبان" variant="segmented" />
            <KRadioGroup v-model="v10" :options="methods" variant="cards" label="روش پرداخت" />
            <KButton text="ثبت‌نام" @click="submit" />
            <div v-if="result" class="sp-vmodel">{{ result }}</div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین change: {{ lastChange ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KRadioGroup from '../../ui-kit/wrappers/KRadioGroup.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { KRadioOption } from '../../ui-kit/wrappers/KRadioGroup.vue'

const plans: KRadioOption[] = [
    { value: 'basic', label: 'پایه', description: '۲ دوره فعال' },
    { value: 'pro', label: 'حرفه‌ای', description: 'همه دوره‌ها + گواهی' },
    { value: 'org', label: 'سازمانی', description: 'تا ۵۰ کاربر' },
]

const levels: (string | number)[] = ['مبتدی', 'متوسط', 'پیشرفته']

const ranges: KRadioOption[] = [
    { value: '7', label: '۷ روز' },
    { value: '30', label: '۳۰ روز' },
    { value: '90', label: '۹۰ روز' },
]

const methods: KRadioOption[] = [
    { value: 'card', label: 'کارت بانکی', description: 'پرداخت آنی از درگاه شاپرک' },
    { value: 'wallet', label: 'کیف پول', description: 'استفاده از موجودی حساب' },
    { value: 'installment', label: 'قسطی', description: '۴ قسط بدون بهره', disabled: true },
]

const durations: KRadioOption[] = [
    { value: '1m', label: '۱ ماهه' },
    { value: '3m', label: '۳ ماهه' },
    { value: '12m', label: '۱۲ ماهه' },
]

const withDisabled: KRadioOption[] = [
    { value: 'student', label: 'دانش‌آموز' },
    { value: 'teacher', label: 'مدرس' },
    { value: 'admin', label: 'مدیر سیستم', disabled: true },
]

const v1 = ref<string | number | null>('pro')
const v2 = ref<string | number | null>('متوسط')
const v3 = ref<string | number | null>('30')
const v4 = ref<string | number | null>('card')
const v5 = ref<string | number | null>('3m')
const v6 = ref<string | number | null>('student')
const v7 = ref<string | number | null>('basic')
const v8 = ref<string | number | null>('هفتگی')
const v9 = ref<string | number | null>(null)
const v10 = ref<string | number | null>('wallet')

const name = ref('')
const result = ref('')
const lastChange = ref<string | number | null>(null)
const onChange = (v: string | number) => { lastChange.value = v }

const submit = () => {
    result.value = name.value && v9.value && v10.value
        ? `ثبت‌نام ${name.value} — سطح ${v9.value} — پرداخت ${v10.value}`
        : 'همه فیلدها را کامل کنید'
}
</script>
