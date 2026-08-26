<!-- pages/forgot-password.vue — reset password: phone → OTP → new password -->
<template>
    <div class="auth-page">
        <h1 class="auth-title">بازیابی رمز عبور</h1>
        <p class="auth-sub">{{ stepLabels[step] }}</p>

        <!-- Progress dots -->
        <div class="auth-steps">
            <span v-for="i in 2" :key="i" class="auth-dot" :class="{ 'is-active': step >= i, 'is-current': step === i }" />
        </div>

        <!-- Step 1: Phone -->
        <form v-if="step === 1" class="auth-form" @submit.prevent="sendOtp">
            <KTextInput
                v-model="phone"
                label="شماره موبایل"
                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                :left-icon="Smartphone"
            />
            <div class="auth-captcha">
                <KCaptcha
                    v-model="captchaInput"
                    :src="captchaSrc"
                    :expires-in="120"
                    @refresh="refreshCaptcha"
                    @expired="refreshCaptcha"
                />
            </div>
            <KButton
                type="submit"
                text="ارسال کد بازیابی"
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

        <!-- Step 2: OTP + new password -->
        <form v-else-if="step === 2" class="auth-form" @submit.prevent="resetPassword">
            <div class="otp-info">
                <Smartphone :size="20" class="otp-icon" />
                <span>کد ۶ رقمی به <strong>{{ maskedPhone }}</strong> ارسال شد</span>
            </div>
            <div class="otp-inputs">
                <input
                    v-for="(_, i) in 6"
                    :key="i"
                    :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    class="otp-input"
                    :value="otp[i]"
                    @input="onOtpInput(i, $event)"
                    @keydown="onOtpKeydown(i, $event)"
                    @paste="onOtpPaste"
                />
            </div>
            <KTextInput
                v-model="newPassword"
                label="رمز عبور جدید"
                placeholder="حداقل ۸ کاراکتر"
                type="password"
                :left-icon="Lock"
            />
            <KTextInput
                v-model="confirmPassword"
                label="تکرار رمز عبور"
                placeholder="رمز عبور را دوباره وارد کنید"
                type="password"
                :left-icon="ShieldCheck"
            />
            <div class="password-strength">
                <div class="strength-bar">
                    <div class="strength-fill" :style="{ width: strengthPercent + '%' }" :class="strengthClass" />
                </div>
                <span class="strength-label">{{ strengthLabel }}</span>
            </div>
            <KButton
                type="submit"
                text="بازنشانی رمز"
                :loading="loading"
                :disabled="otp.join('').length < 6 || newPassword.length < 8 || newPassword !== confirmPassword"
                bg-color="var(--k-primary, #1db954)"
                text-color="#ffffff"
                width="100%"
                padding="12px"
                border-radius="12px"
                font-size="0.85rem"
                font-weight="700"
            />
            <div class="otp-resend">
                <span v-if="resendTimer > 0">ارسال مجدد تا {{ faNum(resendTimer) }} ثانیه</span>
                <a v-else href="#" @click.prevent="sendOtp">ارسال مجدد کد</a>
            </div>
        </form>

        <!-- Login link -->
        <p class="auth-switch">
            رمز عبور خود را به خاطر آوردید؟
            <router-link to="/auth/login">وارد شوید</router-link>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Smartphone, Lock, ShieldCheck } from 'lucide-vue-next'
import KTextInput from '../ui-kit/wrappers/KTextInput.vue'
import KCaptcha from '../ui-kit/components/KCaptcha.vue'
import KButton from '../ui-kit/components/KButton.vue'
import { useToast } from '../ui-kit/composables/useToast'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const router = useRouter()
const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const step = ref(1)
const loading = ref(false)

const stepLabels: Record<number, string> = {
    1: 'شماره موبایل خود را وارد کنید',
    2: 'کد تأیید و رمز جدید را وارد کنید',
}

/* ── Step 1 ── */
const phone = ref('')
const captchaInput = ref('')
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

const maskedPhone = computed(() => {
    const p = phone.value.replace(/\D/g, '')
    if (p.length < 4) return phone.value
    return p.slice(0, 4) + '***' + p.slice(-2)
})

function sendOtp() {
    if (!phone.value.trim()) {
        useToast.warning('لطفاً شماره موبایل را وارد کنید')
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
        step.value = 2
        startResendTimer()
        useToast.success('کد بازیابی ارسال شد')
        setTimeout(() => otpRefs.value[0]?.focus(), 100)
    }, 1000)
}

/* ── OTP ── */
const otp = ref(['', '', '', '', '', ''])
const otpRefs = ref<(HTMLInputElement | null)[]>([])
const resendTimer = ref(60)
let resendInterval: ReturnType<typeof setInterval> | null = null

function onOtpInput(i: number, e: Event) {
    const val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
    otp.value[i] = val.slice(0, 1)
    if (val && i < 5) otpRefs.value[i + 1]?.focus()
}

function onOtpKeydown(i: number, e: KeyboardEvent) {
    if (e.key === 'Backspace' && !otp.value[i] && i > 0) otpRefs.value[i - 1]?.focus()
}

function onOtpPaste(e: ClipboardEvent) {
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    for (let i = 0; i < 6; i++) otp.value[i] = text[i] || ''
    const nextEmpty = otp.value.findIndex(v => !v)
    otpRefs.value[nextEmpty >= 0 ? nextEmpty : 5]?.focus()
}

function startResendTimer() {
    resendTimer.value = 60
    if (resendInterval) clearInterval(resendInterval)
    resendInterval = setInterval(() => {
        resendTimer.value--
        if (resendTimer.value <= 0) { clearInterval(resendInterval!); resendInterval = null }
    }, 1000)
}

onBeforeUnmount(() => { if (resendInterval) clearInterval(resendInterval) })

/* ── Password ── */
const newPassword = ref('')
const confirmPassword = ref('')

const strengthScore = computed(() => {
    let s = 0
    if (newPassword.value.length >= 8) s++
    if (newPassword.value.length >= 12) s++
    if (/[A-Z]/.test(newPassword.value)) s++
    if (/[0-9]/.test(newPassword.value)) s++
    if (/[^A-Za-z0-9]/.test(newPassword.value)) s++
    return s
})

const strengthPercent = computed(() => (strengthScore.value / 5) * 100)
const strengthClass = computed(() => ['weak', 'fair', 'good', 'strong', 'strong'][strengthScore.value] || 'weak')
const strengthLabel = computed(() => ['ضعیف', 'متوسط', 'خوب', 'قوی', 'عالی'][strengthScore.value] || 'ضعیف')

function resetPassword() {
    if (otp.value.join('').length < 6) { useToast.warning('کد ۶ رقمی را کامل وارد کنید'); return }
    if (newPassword.value.length < 8) { useToast.warning('رمز عبور باید حداقل ۸ کاراکتر باشد'); return }
    if (newPassword.value !== confirmPassword.value) { useToast.error('رمز عبور و تکرار آن مطابقت ندارند'); return }
    loading.value = true
    setTimeout(() => {
        loading.value = false
        useToast.success('رمز عبور با موفقیت تغییر کرد')
        router.push('/auth/login')
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
    margin: 0 0 16px;
    font-size: 0.78rem;
    color: var(--k-text-muted);
    text-align: center;
}

.auth-steps {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
}

.auth-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--k-border, #e2e8f0);
    transition: all 0.3s ease;
}

.auth-dot.is-active {
    background: var(--k-primary, #1db954);
}

.auth-dot.is-current {
    width: 24px;
    border-radius: 4px;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.auth-captcha {
    margin-top: -4px;
}

.otp-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    font-size: 0.76rem;
    color: var(--k-text-secondary);
}

.otp-icon {
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.otp-inputs {
    display: flex;
    gap: 8px;
    justify-content: center;
    direction: ltr;
}

.otp-input {
    width: 44px;
    height: 50px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 700;
    border: 1.5px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    background: var(--k-bg, #fff);
    color: var(--k-text-primary);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-family: ui-monospace, monospace;
}

.otp-input:focus {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 15%, transparent);
}

.otp-resend {
    text-align: center;
    font-size: 0.72rem;
    color: var(--k-text-muted);
}

.otp-resend a {
    color: var(--k-primary, #1db954);
    font-weight: 700;
    text-decoration: none;
}

.otp-resend a:hover {
    text-decoration: underline;
}

.password-strength {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: -8px;
}

.strength-bar {
    flex: 1;
    height: 4px;
    background: var(--k-border, #e2e8f0);
    border-radius: 999px;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #1db954; }

.strength-label {
    font-size: 0.66rem;
    font-weight: 700;
    min-width: 36px;
    color: var(--k-text-muted);
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
