<template>
    <div class="sp">
        <h2 class="sp-title">KTextInput</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="v1" label="نام و نام خانوادگی" />
            <KTextInput v-model="v2" label="با برچسب و راهنما" hint="همان‌طور که در کارت ملی نوشته شده" />
            <KTextInput v-model="v3" placeholder="فقط placeholder، بدون برچسب" />
        </div>

        <h3 class="sp-sub">نوع‌ها (type)</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="v4" label="متن" type="text" />
            <KTextInput v-model="v5" label="ایمیل" type="email" placeholder="name@example.com" />
            <KTextInput v-model="v6" label="رمز عبور (بدون آیکون چشم — از KPasswordInput استفاده کنید)" type="password" />
            <KTextInput v-model="v7" label="موبایل" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
            <KTextInput v-model="v8" label="آدرس سایت" type="url" placeholder="https://" />
            <KTextInput v-model="v9" label="جستجو" type="search" placeholder="جستجو…" />
        </div>

        <h3 class="sp-sub">آیکون چپ و راست</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="v10" label="آیکون راست" :right-icon="Search" placeholder="جستجو…" />
            <KTextInput v-model="v11" label="آیکون چپ" :left-icon="Mail" placeholder="ایمیل" />
            <KTextInput v-model="v12" label="هر دو" :right-icon="Search" :left-icon="Mail" />
        </div>

        <h3 class="sp-sub">قابل پاک‌کردن (clearable)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTextInput v-model="v13" label="قابل پاک‌کردن" clearable />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ v13 || '—' }}</div>
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTextInput v-model="v14" label="در حال بررسی…" loading />
        </div>

        <h3 class="sp-sub">غیرفعال و فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="v15" label="غیرفعال" disabled />
            <KTextInput v-model="v16" label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">الزامی + اعتبارسنجی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput
                v-model="v17"
                label="ایمیل (الزامی)"
                type="email"
                required
                :rules="emailRules"
                validate-on="blur"
            />
            <KTextInput
                v-model="v18"
                label="کد ملی ۱۰ رقمی"
                :rules="nationalRules"
                validate-on="both"
                :maxlength="10"
            />
        </div>

        <h3 class="sp-sub">حد طول و شمارنده</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="v19" label="حداکثر ۲۰ کاراکتر" :maxlength="20" />
            <KTextInput v-model="v20" label="حداقل ۵ کاراکتر" :minlength="5" />
        </div>

        <h3 class="sp-sub">فرم کاربردی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.name" label="نام" required :rules="[{ required: true, message: 'نام الزامی است' }]" validate-on="blur" />
            <KTextInput v-model="form.email" label="ایمیل" type="email" required :rules="emailRules" validate-on="blur" clearable />
            <KTextInput v-model="form.site" label="وب‌سایت (اختیاری)" type="url" />
            <KButton text="ثبت" @click="submit" />
            <div v-if="result" class="sp-vmodel">{{ result }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Mail, Search } from 'lucide-vue-next'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { ValidationRules } from '../../ui-kit/types'

const emailRules: ValidationRules = [
    { required: true, message: 'ایمیل الزامی است' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'ایمیل معتبر نیست' },
]

const nationalRules: ValidationRules = [
    { pattern: /^\d{10}$/, message: 'باید دقیقاً ۱۰ رقم باشد' },
]

const v1 = ref('سارا محمدی')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('متن نمونه')
const v5 = ref('')
const v6 = ref('secret123')
const v7 = ref('')
const v8 = ref('')
const v9 = ref('')
const v10 = ref('')
const v11 = ref('')
const v12 = ref('')
const v13 = ref('قابل پاک‌کردن')
const v14 = ref('در حال بررسی')
const v15 = ref('غیرفعال')
const v16 = ref('فقط‌خواندنی')
const v17 = ref('')
const v18 = ref('')
const v19 = ref('')
const v20 = ref('')

const form = reactive({ name: '', email: '', site: '' })
const result = ref('')
const submit = () => {
    result.value = form.name && form.email ? `ثبت شد: ${form.name} — ${form.email}` : 'فیلدهای الزامی را پر کنید'
}
</script>
