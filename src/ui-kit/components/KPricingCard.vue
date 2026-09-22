<!-- components/KPricingCard.vue -->
<!--
    KPricingCard — pricing plan card:

      <KPricingCard
        name="حرفه‌ای"
        description="برای تیم‌های در حال رشد"
        :price="890000"
        period="/ سالانه"
        :features="['نامحدود پروژه', 'پشتیبانی ۲۴/۷', 'گزارش پیشرفته']"
        :highlighted-features="['دسترسی API']"
        popular
        @cta="onChoose"
      />
-->
<template>
    <article class="k-pricing" :class="{ 'is-popular': popular }">
        <!-- Head -->
        <div class="k-pricing-head">
            <span class="k-pricing-icon"><slot name="icon"><Sparkles :size="18" /></slot></span>
            <div class="k-pricing-name">{{ name }}</div>
            <div class="k-pricing-desc">{{ description }}</div>
        </div>

        <!-- Price -->
        <div class="k-pricing-price">
            <span class="k-pricing-amount">{{ priceText }}</span>
            <span class="k-pricing-currency">{{ currencyOf }}</span>
            <span v-if="period" class="k-pricing-period">{{ period }}</span>
        </div>
        <div v-if="oldPrice" class="k-pricing-old">{{ oldPriceText }} {{ currencyOf }}</div>

        <!-- Features -->
        <ul class="k-pricing-features">
            <li
                v-for="f in features"
                :key="f"
                :class="{ 'is-highlighted': highlighted.includes(f) }"
            >
                <Check :size="13" class="k-pricing-check" />
                <span>{{ f }}</span>
                <Sparkle v-if="highlighted.includes(f)" :size="11" class="k-pricing-sparkle" />
            </li>
        </ul>

        <!-- CTA -->
        <button type="button" class="k-pricing-cta" :class="{ 'is-popular': popular }" @click="emits('cta', name)">
            {{ ctaLabel }}
        </button>
        <span v-if="note" class="k-pricing-note">{{ note }}</span>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check, Sparkle, Sparkles } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    name: string
    description?: string
    price: number
    oldPrice?: number
    currency?: string
    period?: string
    features: string[]
    /** features rendered with a special highlight */
    highlighted?: string[]
    popular?: boolean
    ctaLabel?: string
    note?: string
}>(), {
    description: '',
    oldPrice: 0,
    currency: 'تومان',
    period: '',
    highlighted: () => [],
    popular: false,
    ctaLabel: 'انتخاب این پلن',
    note: ''
})

const emits = defineEmits<{
    (e: 'cta', name: string): void
}>()

const { toPersianDigits } = usePersianNumbers()

/* grouped thousands + Persian digits — a raw 1250000 is unreadable on a price tag */
const priceText = computed(() => toPersianDigits(props.price.toLocaleString('fa-IR')))
const oldPriceText = computed(() => toPersianDigits(props.oldPrice.toLocaleString('fa-IR')))
const currencyOf = computed(() => props.currency)
</script>

<style scoped>
.k-pricing {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 300px;
    padding: 22px 20px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 18px;
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease;
    overflow: hidden;
}

.k-pricing:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.k-pricing.is-popular {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 55%, var(--k-border));
    box-shadow: 0 18px 44px color-mix(in srgb, var(--k-primary, #1db954) 22%, transparent);
}

.k-pricing.is-popular::before {
    content: '';
    position: absolute;
    top: 0;
    inset-inline: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--k-primary, #1db954), color-mix(in srgb, var(--k-primary, #1db954) 40%, #fff));
}

.k-pricing-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
}

.k-pricing-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: linear-gradient(135deg, var(--k-primary, #1db954), color-mix(in srgb, var(--k-primary, #1db954) 55%, #fff));
    color: #fff;
    box-shadow: 0 8px 18px color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
    margin-bottom: 4px;
}

.k-pricing-name {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-pricing-desc {
    font-size: 0.7rem;
    color: var(--k-text-muted, #94a3b8);
    line-height: 1.6;
}

.k-pricing-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
}

.k-pricing-amount {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--k-text-primary, #1e293b);
}

.k-pricing.is-popular .k-pricing-amount {
    color: var(--k-primary, #1db954);
}

.k-pricing-currency {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
}

.k-pricing-period {
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-pricing-old {
    text-align: center;
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
    text-decoration: line-through;
    margin-top: -10px;
}

.k-pricing-features {
    list-style: none;
    margin: 0;
    padding: 12px 0;
    border-top: 1px dashed var(--k-border, #e2e8f0);
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.k-pricing-features li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.76rem;
    color: var(--k-text-secondary, #64748b);
}

.k-pricing-features li.is-highlighted {
    color: var(--k-text-primary, #1e293b);
    font-weight: 700;
}

.k-pricing-check {
    color: var(--k-success, #16a34a);
    flex-shrink: 0;
}

.k-pricing-features li.is-highlighted .k-pricing-check {
    color: var(--k-primary, #1db954);
}

.k-pricing-sparkle {
    color: var(--k-primary, #1db954);
    margin-inline-start: auto;
}

.k-pricing-cta {
    margin-top: auto;
    width: 100%;
    padding: 11px 16px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 11px;
    background: var(--k-bg, #ffffff);
    color: var(--k-text-primary, #1e293b);
    font-size: 0.8rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.18s ease;
}

.k-pricing-cta:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-pricing-cta.is-popular {
    background: linear-gradient(135deg, var(--k-primary, #1db954), color-mix(in srgb, var(--k-primary, #1db954) 72%, #000));
    border-color: transparent;
    color: #fff;
    box-shadow: 0 8px 20px color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
}

.k-pricing-cta.is-popular:hover {
    filter: brightness(1.07);
}

.k-pricing-note {
    text-align: center;
    font-size: 0.6rem;
    color: var(--k-text-muted, #94a3b8);
}
</style>
