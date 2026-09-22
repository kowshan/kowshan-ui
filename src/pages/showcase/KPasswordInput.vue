<template>
    <div class="sp">
        <h2 class="sp-title">KPasswordInput</h2>

        <h3 class="sp-sub">پایه (نمایش/مخفی)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPasswordInput v-model="pass1" label="رمز عبور" hint="با آیکون چشم نمایش داده می‌شود" />
            <div class="sp-vmodel" style="margin-top: 12px;">مقدار: {{ pass1 || '—' }}</div>
        </div>

        <h3 class="sp-sub">الزامی + با اعتبارسنجی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPasswordInput
                v-model="pass2"
                label="رمز عبور جدید"
                required
                :rules="passwordRules"
                @blur="() => {}"
            />
        </div>

        <h3 class="sp-sub">حداقل طول</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPasswordInput
                v-model="pass3"
                label="رمز عبور"
                :minlength="10"
                :maxlength="32"
                hint="بین ۱۰ تا ۳۲ کاراکتر"
            />
        </div>

        <h3 class="sp-sub">پاک‌شدنی (clearable)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPasswordInput v-model="pass4" label="رمز عبور" clearable :placeholder="'رمز خود را بنویسید'" />
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KPasswordInput v-model="pass5" label="رمز عبور" loading />
        </div>

        <h3 class="sp-sub">غیرفعال و فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 380px; display: flex; flex-direction: column; gap: 16px;">
            <KPasswordInput v-model="pass6" label="غیرفعال" disabled />
            <KPasswordInput v-model="pass7" label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">فرم ورود</h3>
        <div class="sp-card" style="max-width: 380px; display: flex; flex-direction: column; gap: 16px;">
            <KTextInput v-model="email" label="ایمیل" />
            <KPasswordInput v-model="pass8" label="رمز عبور" clearable />
            <KButton text="ورود" @click="login" />
            <div v-if="loginMsg" class="sp-vmodel">{{ loginMsg }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPasswordInput from '../../ui-kit/wrappers/KPasswordInput.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { ValidationRules } from '../../ui-kit/types'

const pass1 = ref('')
const pass2 = ref('')
const pass3 = ref('Abcdef12')
const pass4 = ref('secret123')
const pass5 = ref('loading-value')
const pass6 = ref('disabled-value')
const pass7 = ref('readonly-value')
const pass8 = ref('')
const email = ref('')
const loginMsg = ref('')

const passwordRules: ValidationRules = [
    { required: true, message: 'رمز عبور الزامی است' },
    { validator: (v: string) => v.length >= 8 || 'حداقل ۸ کاراکتر' },
]

const login = () => {
    loginMsg.value = email.value && pass8.value
        ? `تلاش برای ورود با ${email.value}`
        : 'ایمیل و رمز عبور را وارد کنید'
}
</script>
