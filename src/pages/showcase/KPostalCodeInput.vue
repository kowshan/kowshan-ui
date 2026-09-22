<template>
    <div class="sp">
        <h2 class="sp-title">KPostalCodeInput</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code1" label="کد پستی" @validate="onValidate" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                مقدار: {{ code1 || '—' }} — وضعیت: {{ valid1 === null ? 'در انتظار' : (valid1 ? 'معتبر' : 'نامعتبر') }}
            </div>
        </div>

        <h3 class="sp-sub">کد معتبر از پیش پر‌شده</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code2" label="کد پستی" />
        </div>

        <h3 class="sp-sub">کد ناقص (کمتر از ۱۰ رقم)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code3" label="کد پستی" hint="تا تکمیل نشدن، وضعیتی نشان داده نمی‌شود" />
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code4" label="کد پستی" required />
        </div>

        <h3 class="sp-sub">فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code5" label="کد پستی ثبت‌شده" readonly />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code6" label="کد پستی" disabled />
        </div>

        <h3 class="sp-sub">ورودی فارسی/عربی — تبدیل خودکار</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPostalCodeInput v-model="code7" label="کد پستی" placeholder="۱۲۳۴۵۶۷۸۹۰ را امتحان کنید" />
            <div class="sp-vmodel" style="margin-top: 12px;">ذخیره‌شده (ایسکی): {{ code7 || '—' }}</div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">فرم: {{ district }} — {{ code1 || 'بدون کد' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KPostalCodeInput from '../../ui-kit/components/KPostalCodeInput.vue'

const code1 = ref('')
const code2 = ref('1969732133')
const code3 = ref('1969')
const code4 = ref('')
const code5 = ref('1416933661')
const code6 = ref('1969732133')
const code7 = ref('')

const valid1 = ref<boolean | null>(null)
const onValidate = (r: { valid: boolean }) => { valid1.value = r.valid }

const district = computed(() => (code1.value ? 'منطقه ثبت شد' : 'منطقه نامشخص'))
</script>
