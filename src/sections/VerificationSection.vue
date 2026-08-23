<template>
    <DemoSection
        id="verify"
        index="14"
        title="تأیید هویت"
        description="ورود کد تأیید (OTP)، نشان‌های وضعیت تأیید و کارت احراز هویت — قطعات امنیت و KYC"
    >
        <!-- OTP -->
        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">
                    ورود کد تأیید — کد صحیح <code>۱۲۳۴۵۶</code> است (پیش‌فرض ۶ خانه؛ چسباندن و ارقام فارسی پشتیبانی می‌شود)
                </p>
                <div class="k-otp-demo">
                    <div class="k-otp-demo-top">
                        <div class="k-otp-demo-icon"><MessageSquareCode :size="18" /></div>
                        <div class="k-otp-demo-heading">
                            <span class="k-otp-demo-title">کد تأیید پیامکی</span>
                            <span class="k-otp-demo-sub">کد ۶ رقمی ارسال‌شده به ۰۹۱۲ *** ۳۴۵۶ را وارد کنید</span>
                        </div>
                    </div>

                    <KOTPInput
                        v-model="otpCode"
                        :state="otpState"
                        :disabled="otpState === 'loading'"
                        success-text="کد تأیید شد"
                        error-text="کد اشتباه است — دوباره تلاش کنید"
                        @complete="onOtpComplete"
                    />

                    <div class="k-otp-demo-actions">
                        <button type="button" class="k-demo-btn" :disabled="otpState === 'loading'" @click="onVerify">
                            <BadgeCheck :size="14" /> تأیید کد
                        </button>
                        <button
                            type="button"
                            class="k-demo-btn is-muted"
                            :disabled="!resend.canResend.value"
                            @click="onResend"
                        >
                            <RefreshCw :size="14" />
                            {{ resend.canResend.value ? 'ارسال مجدد کد' : `ارسال مجدد تا ${resend.persian.value} ثانیه دیگر` }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">نشان‌های وضعیت تأیید</p>
                <div class="k-badge-row">
                    <KVerifyBadge status="verified" />
                    <KVerifyBadge status="pending" />
                    <KVerifyBadge status="unverified" />
                    <KVerifyBadge status="rejected" />
                </div>

                <p class="demo-caption">کارت احراز هویت — وضعیت فعلی: {{ statusLabel }}</p>
                <div class="k-kvc-actions">
                    <button
                        v-for="s in statuses"
                        :key="s.id"
                        type="button"
                        class="k-demo-btn"
                        :class="{ 'is-muted': kycStatus !== s.id }"
                        @click="kycStatus = s.id"
                    >
                        {{ s.label }}
                    </button>
                </div>

                <div class="demo-center">
                    <KVerificationCard
                        :status="kycStatus"
                        :steps="kycSteps"
                        :note="kycNote"
                    >
                        <template v-if="kycStatus === 'idle' || kycStatus === 'rejected'" #actions>
                            <button type="button" class="k-demo-btn" @click="onStartKyc">
                                <ArrowLeft :size="14" /> ادامه مراحل
                            </button>
                        </template>
                    </KVerificationCard>
                </div>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, BadgeCheck, MessageSquareCode, RefreshCw } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KOTPInput from '../ui-kit/components/KOTPInput.vue'
import KVerifyBadge from '../ui-kit/components/KVerifyBadge.vue'
import KVerificationCard, { type KVerificationStep } from '../ui-kit/components/KVerificationCard.vue'
import { useResendTimer } from '../ui-kit/composables/useResendTimer'
import { useToast } from '../ui-kit/composables/useToast'

/* ---- OTP demo: correct code is 123456 ---- */
const otpCode = ref('')
const otpState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | null = null

const resend = useResendTimer({ initial: 30 })

const onOtpComplete = () => {
    if (otpState.value !== 'idle') return
    onVerify()
}

const onVerify = () => {
    if (otpState.value === 'loading') return
    if (otpCode.value.length < 6) {
        useToast.warning('لطفاً هر ۶ رقم کد را وارد کنید')
        return
    }
    otpState.value = 'loading'
    setTimeout(() => {
        if (otpCode.value === '123456') {
            otpState.value = 'success'
            useToast.success('کد تأیید شد — ورود موفق')
        } else {
            otpState.value = 'error'
            useToast.error('کد وارد شده صحیح نیست')
        }
        if (resetTimer) clearTimeout(resetTimer)
        resetTimer = setTimeout(() => {
            otpState.value = 'idle'
            otpCode.value = ''
        }, 2600)
    }, 900)
}

const onResend = () => {
    resend.start()
    otpState.value = 'idle'
    otpCode.value = ''
    useToast.info('کد جدید ارسال شد')
}

/* ---- KYC card demo ---- */
const statuses = [
    { id: 'idle', label: 'شروع نشده' },
    { id: 'pending', label: 'در حال بررسی' },
    { id: 'approved', label: 'تأیید شده' },
    { id: 'rejected', label: 'رد شده' },
] as const

const kycStatus = ref<'idle' | 'pending' | 'approved' | 'rejected'>('pending')

const kycSteps = computed<KVerificationStep[]>(() => {
    const approved = kycStatus.value === 'approved'
    return [
        { id: 'phone', label: 'تأیید شماره موبایل', done: true },
        {
            id: 'identity',
            label: 'احراز هویت با کد ملی',
            done: approved || kycStatus.value === 'rejected' || kycStatus.value === 'pending',
            current: kycStatus.value === 'pending'
        },
        {
            id: 'selfie',
            label: 'عکس سلفی با کارت ملی',
            done: approved,
            current: kycStatus.value === 'rejected'
        }
    ]
})

const statusLabel = computed(() => statuses.find(s => s.id === kycStatus.value)?.label ?? '')
const kycNote = computed(() => {
    if (kycStatus.value === 'pending') return 'آخرین بروزرسانی: ۲ ساعت پیش'
    if (kycStatus.value === 'approved') return 'تأیید شده در ۱۴۰۴/۰۵/۱۸'
    if (kycStatus.value === 'rejected') return 'دلیل: کیفیت پایین تصویر مدرک'
    return ''
})

const onStartKyc = () => {
    kycStatus.value = 'pending'
    useToast.info('درخواست احراز هویت ثبت شد')
}
</script>

<style scoped>
.demo-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-center {
    display: flex;
    justify-content: center;
}

.k-otp-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-lg);
    background: var(--k-surface);
}

.k-otp-demo-top {
    display: flex;
    align-items: center;
    gap: 10px;
}

.k-otp-demo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: var(--k-primary-light);
    color: var(--k-primary);
    flex-shrink: 0;
}

.k-otp-demo-heading {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-otp-demo-title {
    font-size: 0.84rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.k-otp-demo-sub {
    font-size: 0.68rem;
    color: var(--k-text-muted);
}

.k-otp-demo-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.k-demo-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 10px;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-demo-btn:hover { filter: brightness(1.08); }
.k-demo-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.k-demo-btn.is-muted {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}

.k-badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.k-kvc-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
