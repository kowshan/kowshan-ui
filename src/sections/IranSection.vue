<template>
    <DemoSection
        id="iran"
        index="12"
        title="ایران"
        description="کد ملی، کارت بانکی، شبا و کد پستی با اعتبارسنجی واقعی — به‌همراه انتخاب استان و شهر"
    >
        <!-- Identity inputs -->
        <p class="demo-caption">هویت و بانک — نمونه‌های معتبر از قبل پر شده‌اند</p>
        <div class="demo-grid-2">
            <div class="demo-stack">
                <KNationalIdInput v-model="ids.nationalId" label="کد ملی" required />
                <KPostalCodeInput v-model="ids.postal" label="کد پستی" />
                <KProvinceCitySelect v-model="location" />
                <p class="demo-caption-note">
                    استان: {{ location.province || '—' }} · شهر: {{ location.city || '—' }}
                </p>
            </div>

            <div class="demo-stack">
                <KBankCardInput v-model="ids.card" label="شماره کارت" />
                <KShibaInput v-model="ids.shiba" label="شماره شبا" />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Live bank card -->
        <p class="demo-caption">پیش‌نمایش زنده کارت — با تایپ شماره، کارت هم‌زمان عوض می‌شود</p>
        <div class="demo-grid-2">
            <div class="k-bankcard" :style="{ '--card-accent': cardAccent }">
                <div class="k-bankcard-chip"></div>
                <div class="k-bankcard-number">{{ cardDisplay }}</div>
                <div class="k-bankcard-bottom">
                    <div class="k-bankcard-holder">
                        <span class="k-bankcard-label">نام دارنده کارت</span>
                        <span class="k-bankcard-name">علی رضایی</span>
                    </div>
                    <div class="k-bankcard-bank">{{ cardBank || '—' }}</div>
                </div>
            </div>

            <div class="k-mobile-card">
                <p style="margin: 0 0 8px; font-size: 0.75rem; font-weight: 700; color: var(--k-text-primary)">
                    نحوه اعتبارسنجی
                </p>
                <ul class="k-iran-list">
                    <li>کد ملی: چک‌سام ۱۰ رقمی</li>
                    <li>کارت: الگوریتم Luhn + شناسایی بانک از ۶ رقم اول (BIN)</li>
                    <li>شبا: استاندارد ISO 7064 مد ۹۷ + شناسایی بانک از پیش‌وند</li>
                    <li>کد پستی: قالب ۱۰ رقمی + ناحیه</li>
                </ul>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import KNationalIdInput from '../ui-kit/components/KNationalIdInput.vue'
import KPostalCodeInput from '../ui-kit/components/KPostalCodeInput.vue'
import KBankCardInput from '../ui-kit/components/KBankCardInput.vue'
import KShibaInput from '../ui-kit/components/KShibaInput.vue'
import KProvinceCitySelect from '../ui-kit/components/KProvinceCitySelect.vue'
import { useIranianValidators } from '../ui-kit/composables/useIranianValidators'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const { bankFromCard } = useIranianValidators()

/* pre-filled with valid samples */
const ids = ref({
    nationalId: '0451726308',
    postal: '1912345678',
    card: '6037991000000137',
    shiba: 'IR010161234567890123456789',
})

const location = ref<{ province: string; city: string }>({ province: '', city: '' })

const cardBank = computed(() => bankFromCard(ids.value.card)?.name ?? '')
const cardAccent = computed(() => bankFromCard(ids.value.card)?.color ?? '#1e293b')

const cardDisplay = computed(() => {
    const d = ids.value.card.replace(/\D/g, '')
    const groups = d.match(/.{1,4}/g) ?? []
    return (groups.join(' ') || '···· ···· ···· ····').padEnd(19, '·')
})
</script>

<style scoped>
.k-bankcard {
    position: relative;
    width: 100%;
    max-width: 340px;
    aspect-ratio: 8 / 5;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, color-mix(in srgb, var(--card-accent, #1e293b) 82%, #000), var(--card-accent, #1e293b));
    box-shadow: 0 18px 40px color-mix(in srgb, var(--card-accent, #1e293b) 35%, transparent);
    color: #fff;
    direction: rtl;
}

.k-bankcard::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 85% -10%, rgba(255, 255, 255, 0.25), transparent 55%);
    pointer-events: none;
}

.k-bankcard-chip {
    width: 40px;
    height: 30px;
    border-radius: 6px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    position: relative;
}

.k-bankcard-chip::after {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 3px;
}

.k-bankcard-number {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    font-variant-numeric: tabular-nums;
    direction: ltr;
    text-align: left;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.k-bankcard-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.k-bankcard-label {
    display: block;
    font-size: 0.55rem;
    opacity: 0.75;
    margin-bottom: 2px;
}

.k-bankcard-name {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.k-bankcard-bank {
    font-size: 0.85rem;
    font-weight: 800;
    opacity: 0.95;
}

.k-iran-list {
    margin: 0;
    padding: 0 18px 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.72rem;
    color: var(--k-text-secondary);
    line-height: 1.7;
}

.k-iran-list li::marker {
    color: var(--k-primary);
}
</style>
