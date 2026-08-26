<!-- pages/login.vue — login with phone + password + captcha -->
<template>
    <div class="auth-page">
        <h1 class="auth-title">ورود</h1>
        <p class="auth-sub">با شماره موبایل و رمز عبور وارد شوید</p>

        <form class="auth-form" @submit.prevent="handleLogin">
            <!-- Phone -->
            <KTextInput
                v-model="phone"
                label="شماره موبایل"
                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                :left-icon="Smartphone"
            />

            <!-- Password -->
            <KTextInput
                v-model="password"
                label="رمز عبور"
                placeholder="رمز عبور خود را وارد کنید"
                type="password"
                :left-icon="Lock"
            />

            <!-- Captcha -->
            <div class="auth-captcha">
                <KCaptcha
                    v-model="captchaInput"
                    :src="captchaSrc"
                    :expires-in="120"
                    @refresh="refreshCaptcha"
                    @expired="refreshCaptcha"
                />
            </div>

            <!-- Remember + forgot -->
            <div class="auth-options">
                <KCheckbox v-model="remember" label="مرا به خاطر بسپار" />
                <router-link to="/auth/forgot-password" class="auth-forgot">فراموشی رمز؟</router-link>
            </div>

            <!-- Submit -->
            <KButton
                type="submit"
                text="ورود"
                :loading="loading"
                bg-color="var(--k-primary, #1db954)"
                text-color="#ffffff"
                width="100%"
                padding="12px"
                border-radius="12px"
                font-size="0.85rem"
                font-weight="700"
            />
        </form>

        <!-- Signup link -->
        <p class="auth-switch">
            حساب ندارید؟
            <router-link to="/auth/signup">ثبت‌نام کنید</router-link>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Smartphone, Lock } from 'lucide-vue-next'
import KTextInput from '../ui-kit/wrappers/KTextInput.vue'
import KCheckbox from '../ui-kit/wrappers/KCheckbox.vue'
import KCaptcha from '../ui-kit/components/KCaptcha.vue'
import KButton from '../ui-kit/components/KButton.vue'
import { useToast } from '../ui-kit/composables/useToast'

const phone = ref('')
const password = ref('')
const captchaInput = ref('')
const remember = ref(false)
const loading = ref(false)

/* Captcha mock */
const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const captchaCode = ref(genCode())
const captchaSrc = ref(genSvg(captchaCode.value))

function genCode() {
    let t = ''
    for (let i = 0; i < 5; i++) t += chars[Math.floor(Math.random() * chars.length)]
    return t
}

function genSvg(code: string) {
    const letters = code.split('').map((ch, i) => {
        const rot = (Math.random() * 30 - 15).toFixed(1)
        const y = 34 + Math.random() * 10
        const x = 30 + i * 44 + Math.random() * 10
        return `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-family="monospace" font-size="26" font-weight="bold" fill="#334155" transform="rotate(${rot} ${x} ${y})">${ch}</text>`
    }).join('')
    const lines = Array.from({ length: 4 }, () => {
        const x1 = Math.random() * 220, y1 = Math.random() * 56, x2 = Math.random() * 220, y2 = Math.random() * 56
        return `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="#1db954" stroke-opacity="0.35" stroke-width="1"/>`
    }).join('')
    const dots = Array.from({ length: 18 }, () => {
        const x = Math.random() * 250, y = Math.random() * 50
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.2" fill="#94a3b8" fill-opacity="0.5"/>`
    }).join('')
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="56" viewBox="0 0 260 56"><rect width="260" height="56" rx="8" fill="#f1f5f9"/>${dots}${lines}${letters}</svg>`)
}

function refreshCaptcha() {
    captchaCode.value = genCode()
    captchaSrc.value = genSvg(captchaCode.value)
    captchaInput.value = ''
}

const handleLogin = () => {
    if (!phone.value || !password.value || !captchaInput.value) {
        useToast.warning('لطفاً تمام فیلدها را پر کنید')
        return
    }
    if (captchaInput.value.toUpperCase() !== captchaCode.value) {
        useToast.error('کد امنیتی صحیح نیست')
        refreshCaptcha()
        return
    }
    loading.value = true
    setTimeout(() => {
        loading.value = false
        useToast.success('ورود موفقیت‌آمیز بود')
    }, 1500)
}
</script>

<style scoped>
.auth-page {
    display: flex;
    flex-direction: column;
}

.auth-title {
    margin: 0 0 4px;
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    text-align: center;
}

.auth-sub {
    margin: 0 0 24px;
    font-size: 0.78rem;
    color: var(--k-text-muted);
    text-align: center;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.auth-captcha {
    margin-top: -4px;
}

.auth-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.auth-forgot {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--k-primary, #1db954);
    text-decoration: none;
}

.auth-forgot:hover {
    text-decoration: underline;
}

.auth-switch {
    margin: 20px 0 0;
    font-size: 0.76rem;
    color: var(--k-text-muted);
    text-align: center;
}

.auth-switch a {
    color: var(--k-primary, #1db954);
    font-weight: 700;
    text-decoration: none;
}

.auth-switch a:hover {
    text-decoration: underline;
}
</style>
