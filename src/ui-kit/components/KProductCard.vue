<!-- KProductCard.vue — e-commerce product card -->
<template>
    <div class="k-pc" :class="{ 'is-out-of-stock': outOfStock }">
        <div class="k-pc-media">
            <img :src="image" :alt="title" class="k-pc-img" loading="lazy" />

            <span v-if="badge" class="k-pc-badge" :style="{ background: badgeColor }">{{ badge }}</span>
            <button class="k-pc-fav" :class="{ 'is-active': favorited }" @click.stop="$emit('toggle-favorite')">
                <Heart :size="16" :fill="favorited ? 'currentColor' : 'none'" />
            </button>
        </div>
        <div class="k-pc-body">
            <span v-if="category" class="k-pc-category">{{ category }}</span>
            <h4 class="k-pc-title">{{ title }}</h4>
            <div v-if="rating != null" class="k-pc-rating">
                <Star :size="12" fill="currentColor" />
                <span>{{ rating }}</span>
                <span v-if="reviews" class="k-pc-reviews">({{ reviews }})</span>
            </div>
            <div class="k-pc-price-row">
                <div class="k-pc-price">
                    <span class="k-pc-price-current">{{ formatPrice(price) }}</span>
                </div>
                <button
                    v-if="!outOfStock"
                    class="k-pc-cart"
                    @click.stop="$emit('add-to-cart')"
                >
                    <ShoppingCart :size="14" />
                </button>
            </div>
            <div v-if="oldPrice || discount" class="k-pc-price-bottom">
                <span v-if="oldPrice" class="k-pc-price-old">{{ formatPrice(oldPrice) }}</span>
                <span v-if="discount" class="k-pc-discount-badge">{{ discount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Heart, Star, ShoppingCart } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    image: string
    title: string
    category?: string
    price: number
    oldPrice?: number
    discount?: string
    badge?: string
    badgeColor?: string
    rating?: number
    reviews?: number
    favorited?: boolean
    outOfStock?: boolean
    currency?: string
}>(), {
    badgeColor: '#1db954',
    currency: 'تومان',
})

defineEmits<{
    'add-to-cart': []
    'toggle-favorite': []
    click: []
}>()


const formatPrice = (n: number) => {
    const formatted = n.toLocaleString('fa-IR')
    return `${formatted} ${props.currency}`
}
</script>

<style scoped>
.k-pc {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    overflow: hidden;
    background: var(--k-bg, #fff);
    cursor: pointer;
    transition: all 0.2s ease;
}
.k-pc:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    transform: translateY(-2px);
}
.k-pc.is-out-of-stock { opacity: 0.6; }
.k-pc-media {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--k-surface, #f1f5f9);
}
.k-pc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.k-pc:hover .k-pc-img { transform: scale(1.04); }

.k-pc-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
    font-size: 0.58rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
}
.k-pc-fav {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: color-mix(in srgb, var(--k-bg, #fff) 90%, transparent);
    color: var(--k-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    backdrop-filter: blur(4px);
}
.k-pc-fav:hover { transform: scale(1.1); }
.k-pc-fav.is-active { color: #ef4444; }
.k-pc-body { padding: 12px 14px; }
.k-pc-category {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--k-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.k-pc-title {
    margin: 2px 0 4px;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--k-text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.k-pc-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #f59e0b;
    font-size: 0.68rem;
    font-weight: 700;
    margin-bottom: 6px;
}
.k-pc-reviews {
    color: var(--k-text-muted);
    font-weight: 500;
    font-size: 0.62rem;
}
.k-pc-price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.k-pc-price-current {
    font-size: 0.9rem;
    font-weight: 900;
    color: var(--k-text-primary);
    direction: ltr;
}
.k-pc-price-old {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    text-decoration: line-through;
    direction: ltr;
}
.k-pc-price-bottom {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
}
.k-pc-discount-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 6px;
    background: color-mix(in srgb, #ef4444 14%, transparent);
    color: #ef4444;
    font-size: 0.62rem;
    font-weight: 800;
    direction: rtl;
}
[data-theme='dark'] .k-pc-discount-badge {
    background: color-mix(in srgb, #ef4444 22%, transparent);
    color: #fca5a5;
}
.k-pc-cart {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 10px;
    background: var(--k-primary, #1db954);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
}
.k-pc-cart:hover { filter: brightness(1.1); transform: scale(1.05); }
</style>
