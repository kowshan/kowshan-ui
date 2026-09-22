<!-- components/KCartItem.vue -->
<!--
    KCartItem — one cart row: thumbnail, title + meta, unit price (with
    optional strikethrough), quantity stepper, line total, remove.

      <KCartItem
        :item="{ id: 1, title: 'دوره Vue', price: 890000, oldPrice: 1450000, image: '…', meta: 'آموزش جامع' }"
        @update:qty="cart.setQty"
        @remove="cart.remove"
      />
-->
<template>
    <div class="k-cart-item">
        <!-- Top: thumb + title / description / unit price -->
        <div class="k-cart-top">
            <div class="k-cart-thumb">
                <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" />
                <BookOpen v-else :size="18" />
            </div>

            <div class="k-cart-info">
                <div class="k-cart-title">{{ item.title }}</div>
                <div v-if="item.meta" class="k-cart-meta">{{ item.meta }}</div>
                <div class="k-cart-unit">
                    <span class="k-cart-price-now">{{ item.price }}</span>
                    <span v-if="item.oldPrice" class="k-cart-price-old">{{ item.oldPrice }}</span>
                    <span class="k-cart-currency">{{ currency }}</span>
                </div>
            </div>
        </div>

        <!-- Bottom: qty stepper + total + remove -->
        <div class="k-cart-bottom">
            <div class="k-cart-qty">
                <button type="button" class="k-cart-qty-btn" aria-label="کم کردن" :disabled="(item.qty ?? 1) <= 1" @click="emits('update:qty', item.id, (item.qty ?? 1) - 1)">
                    <Minus :size="12" />
                </button>
                <span class="k-cart-qty-num">{{ item.qty ?? 1 }}</span>
                <button type="button" class="k-cart-qty-btn is-plus" aria-label="زیاد کردن" @click="emits('update:qty', item.id, (item.qty ?? 1) + 1)">
                    <Plus :size="12" />
                </button>
            </div>

            <span class="k-cart-total">{{ lineTotal }} <small>{{ currency }}</small></span>

            <button type="button" class="k-cart-remove" aria-label="حذف" @click="emits('remove', item.id)">
                <Trash2 :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, Minus, Plus, Trash2 } from 'lucide-vue-next'
import type { CartItem } from '../composables/useCart'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    item: CartItem
    currency?: string
}>(), {
    currency: 'تومان'
})

const emits = defineEmits<{
    (e: 'update:qty', id: string | number, qty: number): void
    (e: 'remove', id: string | number): void
}>()

const { toPersianDigits } = usePersianNumbers()

const lineTotal = computed(() => props.item.price * (props.item.qty ?? 1))
</script>

<style scoped>
.k-cart-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 12px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
}

.k-cart-top {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.k-cart-bottom {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}

.k-cart-thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 9px;
    overflow: hidden;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-cart-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.k-cart-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-cart-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-cart-meta {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-cart-unit {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    margin-top: 2px;
}

.k-cart-price-now {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-cart-price-old {
    font-size: 0.6rem;
    color: var(--k-text-muted, #94a3b8);
    text-decoration: line-through;
}

.k-cart-currency {
    font-size: 0.56rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-cart-qty {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.k-cart-qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-cart-qty-btn.is-plus {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 40%, var(--k-border));
    color: var(--k-primary, #1db954);
}

.k-cart-qty-btn:hover:not(:disabled) {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-cart-qty-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.k-cart-qty-num {
    min-width: 18px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-cart-total {
    margin-inline-start: auto;
}

.k-cart-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-cart-remove:hover {
    background: color-mix(in srgb, var(--k-error, #ef4444) 12%, transparent);
    color: var(--k-error, #ef4444);
}

.k-cart-total {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
}

.k-cart-total small {
    font-size: 0.56rem;
    font-weight: 500;
    color: var(--k-text-muted, #94a3b8);
}
</style>
