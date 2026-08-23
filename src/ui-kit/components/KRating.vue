<!-- components/KRating.vue -->
<template>
    <div
        class="k-rating"
        :class="[`k-rating-${size}`, { 'is-readonly': readonly, 'is-disabled': disabled }]"
        role="radiogroup"
        :aria-label="label || 'امتیاز'"
    >
        <span v-if="label" class="k-rating-label">{{ label }}</span>

        <div class="k-rating-stars" @mouseleave="hoverValue = null">
            <button
                v-for="i in max"
                :key="i"
                type="button"
                role="radio"
                class="k-rating-star"
                :class="{
                    'is-filled': i <= filled,
                    'is-hover': hoverValue != null && i <= hoverValue
                }"
                :aria-checked="i <= filled"
                :aria-label="`${i} از ${max}`"
                :disabled="readonly || disabled"
                @mouseenter="!readonly && (hoverValue = i)"
                @click="!readonly && select(i)"
            >
                <Star
                    class="star"
                    :class="{ 'is-half': showHalf && i === Math.ceil(filled) && filled % 1 >= 0.5 && filled < i }"
                />
            </button>
        </div>

        <span v-if="showValue" class="k-rating-value">{{ faNum(filled) }} / {{ faNum(max) }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    modelValue?: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    readonly?: boolean
    disabled?: boolean
    showValue?: boolean
    showHalf?: boolean
    label?: string
    color?: string
}>(), {
    modelValue: 0,
    max: 5,
    size: 'md',
    readonly: false,
    disabled: false,
    showValue: false,
    showHalf: false
})

const emits = defineEmits<{
    'update:modelValue': [value: number]
    'change': [value: number]
}>()

const hoverValue = ref<number | null>(null)

const filled = computed(() => Math.max(0, Math.min(props.max, props.modelValue || 0)))

const select = (i: number) => {
    const next = i === filled.value ? (props.showHalf ? i - 0.5 : 0) : i
    const clamped = Math.max(0, next)
    emits('update:modelValue', clamped)
    emits('change', clamped)
}

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: number) => String(n).replace(/\d/g, d => faDigits[Number(d)])
</script>

<style scoped>
.k-rating {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.k-rating-label {
    font-size: 0.8rem;
    color: var(--k-text-secondary, #64748b);
}

.k-rating-stars {
    display: inline-flex;
    align-items: center;
    gap: 2px;
}

.k-rating-star {
    display: inline-flex;
    border: none;
    background: transparent;
    padding: 2px;
    cursor: pointer;
    color: var(--k-border, #cbd5e1);
    transition: transform 0.1s ease, color 0.1s ease;
}

.k-rating-star:hover:not(:disabled) {
    transform: scale(1.12);
}

.k-rating-star.is-filled,
.k-rating-star.is-hover {
    color: #f59e0b;
}

.k-rating-star:disabled {
    cursor: default;
}

.k-rating-star:focus-visible {
    outline: 2px solid #f59e0b;
    outline-offset: 2px;
    border-radius: 4px;
}

.star {
    fill: currentColor;
}

/* Sizes */
.k-rating-sm .star { width: 15px; height: 15px; }
.k-rating-md .star { width: 20px; height: 20px; }
.k-rating-lg .star { width: 26px; height: 26px; }

.k-rating-value {
    font-size: 0.75rem;
    color: var(--k-text-muted, #94a3b8);
    direction: ltr;
}

.k-rating.is-disabled {
    opacity: 0.55;
}
</style>
