<!-- components/KVerificationCard.vue -->
<!--
    KVerificationCard — KYC-style identity verification panel:

      <KVerificationCard
        status="pending"
        :steps="[
          { id: 'phone', label: 'تأیید شماره موبایل', done: true },
          { id: 'identity', label: 'احراز هویت با کد ملی', done: true, current: true },
          { id: 'selfie', label: 'عکس سلفی با کارت ملی', done: false },
        ]"
      >
        <template #actions>
          <KButton text="ادامه مراحل" bg-color="#1db954" text-color="#fff" />
        </template>
      </KVerificationCard>

    `progress` defaults to the ratio of done steps; pass it explicitly to override.
-->
<template>
    <div class="k-kvc" :class="`is-${status}`">
        <!-- Header -->
        <div class="k-kvc-header">
            <div class="k-kvc-head">
                <span class="k-kvc-icon">
                    <slot name="icon"><ShieldCheck :size="20" /></slot>
                </span>
                <div class="k-kvc-heading">
                    <span class="k-kvc-title">{{ title }}</span>
                    <span v-if="subtitle" class="k-kvc-subtitle">{{ subtitle }}</span>
                </div>
            </div>
            <KVerifyBadge :status="badgeStatus" />
        </div>

        <!-- Progress -->
        <div class="k-kvc-progress">
            <KProgress
                :model-value="progress"
                size="sm"
                :variant="progressVariant"
                show-percent
            />
        </div>

        <!-- Status banner -->
        <div class="k-kvc-banner" :class="`is-${status}`">
            <component :is="bannerIcon" :size="16" />
            <span>{{ bannerText }}</span>
        </div>

        <!-- Steps -->
        <ul class="k-kvc-steps">
            <li
                v-for="(s, i) in steps"
                :key="s.id"
                class="k-kvc-step"
                :class="{ 'is-done': s.done, 'is-current': s.current, 'is-pending': !s.done && !s.current }"
            >
                <span class="k-kvc-step-dot">
                    <Check v-if="s.done" :size="12" />
                    <span v-else>{{ faNum(i + 1) }}</span>
                </span>
                <span class="k-kvc-step-label">{{ s.label }}</span>
                <span v-if="s.current && status !== 'approved'" class="k-kvc-step-now">در حال انجام</span>
            </li>
        </ul>

        <!-- Actions -->
        <div v-if="$slots.actions || note" class="k-kvc-footer">
            <span v-if="note" class="k-kvc-note">{{ note }}</span>
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check, Clock3, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-vue-next'
import KProgress from './KProgress.vue'
import KVerifyBadge from './KVerifyBadge.vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface KVerificationStep {
    id: string
    label: string
    done?: boolean
    current?: boolean
}

const props = withDefaults(defineProps<{
    title?: string
    subtitle?: string
    status?: 'idle' | 'pending' | 'approved' | 'rejected'
    steps?: KVerificationStep[]
    /** override the auto-computed progress (0-100) */
    progress?: number
    note?: string
}>(), {
    title: 'احراز هویت',
    subtitle: 'وضعیت تأیید هویت حساب شما',
    status: 'idle',
    steps: () => [],
    progress: -1,
    note: ''
})

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const badgeStatus = computed(() => {
    if (props.status === 'approved') return 'verified'
    if (props.status === 'idle') return 'unverified'
    return props.status
})

const progress = computed(() => {
    if (props.progress >= 0) return props.progress
    if (!props.steps.length) return props.status === 'approved' ? 100 : 0
    const done = props.steps.filter(s => s.done).length
    return Math.round((done / props.steps.length) * 100)
})

const progressVariant = computed(() => {
    if (props.status === 'rejected') return 'danger'
    if (props.status === 'approved') return 'success'
    if (props.status === 'pending') return 'warning'
    return 'primary'
})

const BANNERS: Record<string, { icon: any; text: string }> = {
    idle: { icon: ShieldAlert, text: 'برای تکمیل احراز هویت، مراحل زیر را به ترتیب انجام دهید.' },
    pending: { icon: Clock3, text: 'مدارک شما در حال بررسی است — معمولاً کمتر از ۲۴ ساعت طول می‌کشد.' },
    approved: { icon: ShieldCheck, text: 'احراز هویت شما با موفقیت کامل شد. تمام امکانات فعال است.' },
    rejected: { icon: ShieldX, text: 'مدارک ارسالی رد شد. لطفاً مدارک معتبر را دوباره بارگذاری کنید.' }
}

const banner = computed(() => BANNERS[props.status])
const bannerIcon = computed(() => banner.value.icon)
const bannerText = computed(() => banner.value.text)
</script>

<style scoped>
.k-kvc {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 420px;
    padding: 20px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
}

.k-kvc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.k-kvc-head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.k-kvc-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.k-kvc.is-approved .k-kvc-icon {
    background: var(--k-success-light, #d1fae5);
    color: var(--k-success, #10b981);
}

.k-kvc.is-rejected .k-kvc-icon {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-kvc-heading {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.k-kvc-title {
    font-size: 0.92rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-kvc-subtitle {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-kvc-progress {
    width: 100%;
}

.k-kvc-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 0.72rem;
    line-height: 1.7;
}

.k-kvc-banner.is-idle {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
}

.k-kvc-banner.is-pending {
    background: var(--k-warning-light, #fef3c7);
    color: var(--k-warning, #f59e0b);
}

.k-kvc-banner.is-approved {
    background: var(--k-success-light, #d1fae5);
    color: var(--k-success, #10b981);
}

.k-kvc-banner.is-rejected {
    background: var(--k-error-light, #fee2e2);
    color: var(--k-error, #ef4444);
}

.k-kvc-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.k-kvc-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    transition: background 0.15s ease;
}

.k-kvc-step.is-current {
    background: var(--k-primary-light, #e3f8ec);
}

.k-kvc-step-dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 0.68rem;
    font-weight: 700;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-muted, #94a3b8);
    border: 1.5px solid var(--k-border, #e2e8f0);
}

.k-kvc-step.is-done .k-kvc-step-dot {
    background: var(--k-success, #10b981);
    border-color: var(--k-success, #10b981);
    color: #fff;
}

.k-kvc-step.is-current .k-kvc-step-dot {
    background: var(--k-primary, #1db954);
    border-color: var(--k-primary, #1db954);
    color: #fff;
}

.k-kvc-step-label {
    font-size: 0.76rem;
    color: var(--k-text-primary, #1e293b);
    font-weight: 500;
}

.k-kvc-step.is-pending .k-kvc-step-label {
    color: var(--k-text-muted, #94a3b8);
}

.k-kvc-step-now {
    margin-inline-start: auto;
    font-size: 0.62rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
    background: color-mix(in srgb, var(--k-primary, #1db954) 12%, transparent);
    padding: 2px 8px;
    border-radius: 999px;
    white-space: nowrap;
}

.k-kvc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-kvc-note {
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
