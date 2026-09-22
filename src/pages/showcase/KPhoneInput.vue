<template>
    <div class="sp">
        <h2 class="sp-title">KPhoneInput</h2>

        <h3 class="sp-sub">پایه — با پیش‌شماره +98</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput v-model="phone1" label="شماره موبایل" hint="فرمت: ۰۹۱۲ ۳۴۵ ۶۷۸۹" @validate="onValidate" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                مقدار: {{ phone1 || '—' }} — اعتبار: {{ valid ? (valid.valid ? 'معتبر' : 'نامعتبر') : 'در انتظار' }}
            </div>
        </div>

        <h3 class="sp-sub">شماره معتبر از پیش پر‌شده</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput v-model="phone2" label="شماره تماس" />
        </div>

        <h3 class="sp-sub">بدون پیش‌شماره در مقدار خروجی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput v-model="phone3" label="شماره موبایل" :include-prefix="false" />
            <div class="sp-vmodel" style="margin-top: 12px;">خروجی: {{ phone3 || '—' }}</div>
        </div>

        <h3 class="sp-sub">پیش‌شماره کشور دیگر</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput v-model="phone4" label="شماره واتس‌اپ" prefix="+971" placeholder="۵۰ ۱۲۳ ۴۵۶۷" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput v-model="phone5" label="شماره موبایل" disabled />
        </div>

        <h3 class="sp-sub">با متن خطای سفارشی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPhoneInput
                v-model="phone6"
                label="شماره موبایل"
                error-text="شماره باید با ۰۹ شروع شود"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPhoneInput from '../../ui-kit/components/KPhoneInput.vue'

const phone1 = ref('')
const phone2 = ref('09123456789')
const phone3 = ref('')
const phone4 = ref('')
const phone5 = ref('09121112233')
const phone6 = ref('1234')

const valid = ref<{ valid: boolean; error: string | null } | null>(null)
const onValidate = (r: { valid: boolean; error: string | null }) => { valid.value = r }
</script>
