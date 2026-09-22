<template>
    <div class="sp">
        <h2 class="sp-title">KOTPInput</h2>

        <h3 class="sp-sub">۶ رقمی (ارسال خودکار)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KOTPInput v-model="code" @complete="onComplete" />
            <div class="sp-vmodel">v-model: {{ code || '—' }}</div>
            <div class="sp-vmodel">complete: {{ lastComplete }}</div>
        </div>

        <h3 class="sp-sub">۴ رقمی</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KOTPInput v-model="code4" :length="4" @complete="onComplete" />
            <div class="sp-vmodel">v-model: {{ code4 || '—' }}</div>
        </div>

        <h3 class="sp-sub">بدون ارسال خودکار (autoSubmit = false)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KOTPInput v-model="manual" :auto-submit="false" />
            <div class="sp-vmodel">v-model: {{ manual || '—' }}</div>
        </div>

        <h3 class="sp-sub">حالت‌ها: در حال بررسی / موفق / خطا</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 20px;">
            <KOTPInput v-model="demoCode" :state="'loading'" :auto-submit="false" />
            <KOTPInput v-model="demoCode" :state="'success'" :auto-submit="false" success-text="کد تأیید شد" />
            <KOTPInput v-model="demoCode" :state="'error'" :auto-submit="false" error-text="کد وارد شده نادرست است" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KOTPInput v-model="demoCode" :disabled="true" />
        </div>

        <h3 class="sp-sub">جریان تأیید (شبیه‌سازی)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KOTPInput v-model="verify" :state="verifyState" :auto-submit="false" :success-text="'تأیید شد'" :error-text="'کد اشتباه است (۱۲۳۴۵۶ درست است)'" />
            <div class="sp-row" style="margin-top: 12px;">
                <KButton text="بررسی کد" bg-color="var(--k-primary)" text-color="#fff" :disabled="verify.length !== 6 || verifyState === 'loading'" @click="submit" />
                <KButton text="پاک کردن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="reset" />
                <span class="sp-vmodel">state: {{ verifyState }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KOTPInput from '../../ui-kit/components/KOTPInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const code = ref('')
const code4 = ref('')
// shared prefill for the state demos (v-model needs a member expression, not a literal)
const demoCode = ref('123456')
const manual = ref('')
const lastComplete = ref('—')

const onComplete = (v: string) => { lastComplete.value = v }

const verify = ref('')
const verifyState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const submit = () => {
    verifyState.value = 'loading'
    setTimeout(() => {
        verifyState.value = verify.value === '123456' ? 'success' : 'error'
    }, 900)
}

const reset = () => { verify.value = ''; verifyState.value = 'idle' }
</script>
