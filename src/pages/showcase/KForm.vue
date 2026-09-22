<template>
    <div class="sp">
        <h2 class="sp-title">KForm</h2>

        <h3 class="sp-sub">فرم ثبت‌نام با اعتبارسنجی</h3>
        <div class="form-box">
            <KForm :model="form" :rules="rules" @submit="onSubmit" @invalid="onInvalid">
                <div class="fields">
                    <KTextInput v-model="form.name" label="نام و نام خانوادگی" name="name" />
                    <KTextInput v-model="form.email" label="ایمیل" name="email" dir="ltr" />
                    <KTextInput v-model="form.phone" label="موبایل" name="phone" dir="ltr" />
                    <KTextInput v-model="form.company" label="شرکت (اختیاری)" name="company" />
                </div>
                <template #actions>
                    <KButton type="submit" text="ثبت‌نام" bg-color="var(--k-primary)" text-color="#fff" />
                    <KButton text="خالی کردن" @click="reset" />
                </template>
            </KForm>
        </div>
        <p class="sp-note">نتیجه آخرین ارسال: {{ result || '—' }}</p>

        <h3 class="sp-sub">بدون خلاصه خطا (showSummary=false)</h3>
        <div class="form-box">
            <KForm :model="form2" :rules="rules2" :show-summary="false" @submit="r2 = 'ارسال شد'">
                <KTextInput v-model="form2.code" label="کد تخفیف" name="code" dir="ltr" />
                <template #actions>
                    <KButton type="submit" text="اعمال" />
                </template>
            </KForm>
            <p class="sp-note">{{ r2 || 'کد را وارد و ارسال کنید' }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KForm from '../../ui-kit/components/KForm.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const result = ref('')
const r2 = ref('')

const form = reactive({ name: '', email: '', phone: '', company: '' })
const form2 = reactive({ code: '' })

const rules = {
    name: [{ required: true as const, message: 'نام الزامی است' }],
    email: [
        { required: true as const, message: 'ایمیل الزامی است' },
        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'ایمیل معتبر نیست' },
    ],
    phone: [{ pattern: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست (۰۹xxxxxxxxx)' }],
}

const rules2 = {
    code: [{ required: true as const, message: 'کد تخفیف را وارد کنید' }],
}

const onSubmit = (model: Record<string, any>) => {
    result.value = `خوش آمدی ${model.name}!`
}
const onInvalid = (errors: Record<string, string>) => {
    result.value = `${Object.keys(errors).length} خطا`
}

const reset = () => {
    form.name = ''
    form.email = ''
    form.phone = ''
    form.company = ''
    result.value = ''
}
</script>

<style scoped>
.form-box {
    border: 1px solid var(--k-border);
    border-radius: 12px;
    padding: 16px;
    max-width: 460px;
}
.fields { display: flex; flex-direction: column; gap: 4px; }
</style>
