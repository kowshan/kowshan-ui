<!-- components/KSwiperButton.vue
     Prev/next control for <KSwiper>. Place it inside a swiper and it wires
     itself (the swiper provides its context); disabled state follows the
     track position unless `loop` is on.

       <KSwiper :per-page="3">
         <KSwiperButton direction="prev" />
         …slides…
         <KSwiperButton direction="next" />
       </KSwiper>

     Standalone (outside a swiper) it still renders and emits `click`, so you
     can drive your own logic.
-->
<template>
    <button
        type="button"
        class="k-swiper-btn"
        :class="[`size-${size}`, { 'is-disabled': isDisabled, 'is-plain': !bordered }]"
        :disabled="isDisabled"
        :aria-label="ariaLabel"
        @click="onClick"
    >
        <component :is="iconComp" :size="iconSize" />
    </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-vue-next'
import { KSwiperKey } from '../core/swiperContext'

const props = withDefaults(defineProps<{
    /** `'next'` moves forward, `'prev'` back */
    direction?: 'prev' | 'next'
    size?: 'sm' | 'md' | 'lg'
    /** Draw the border/surface (turn off for bare chevrons) */
    bordered?: boolean
    /** Override the auto Persian label */
    label?: string
    /** Force a disabled state on top of the swiper's own */
    disabled?: boolean
    /** Use your own icon component instead of the auto chevron */
    icon?: any
}>(), {
    direction: 'next',
    size: 'md',
    bordered: true,
    disabled: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const ctx = inject(KSwiperKey, null)

const rtl = computed(() => ctx?.isRtl.value ?? false)
const isNext = computed(() => props.direction === 'next')
const vertical = computed(() => ctx?.axis.value === 'vertical')

/** Horizontal: next points toward the inline end (left in RTL). Vertical: down. */
const iconComp = computed(() => {
    if (props.icon) return props.icon
    if (vertical.value) return isNext.value ? ChevronDown : ChevronUp
    const pointsRight = isNext.value ? !rtl.value : rtl.value
    return pointsRight ? ChevronRight : ChevronLeft
})

const iconSize = computed(() => props.size === 'sm' ? 14 : props.size === 'lg' ? 22 : 18)

const isDisabled = computed(() => {
    if (props.disabled) return true
    if (!ctx) return false
    return isNext.value ? ctx.atEnd.value : ctx.atStart.value
})

const ariaLabel = computed(() => props.label || (isNext.value ? 'بعدی' : 'قبلی'))

const onClick = (e: MouseEvent) => {
    emit('click', e)
    if (isNext.value) ctx?.next()
    else ctx?.prev()
}
</script>

<style scoped>
.k-swiper-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    border: 1px solid var(--k-border);
    border-radius: 50%;
    background: var(--k-surface);
    color: var(--k-text-primary);
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.k-swiper-btn:hover:not(:disabled) {
    background: var(--k-surface-hover);
    border-color: var(--k-border-focus, var(--k-primary));
    color: var(--k-primary);
}
.k-swiper-btn:active:not(:disabled) {
    transform: scale(0.94);
}
.k-swiper-btn:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}
.k-swiper-btn.is-plain {
    border-color: transparent;
    background: transparent;
}
.k-swiper-btn:disabled,
.k-swiper-btn.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.k-swiper-btn.size-sm { width: 26px; height: 26px; }
.k-swiper-btn.size-md { width: 34px; height: 34px; }
.k-swiper-btn.size-lg { width: 42px; height: 42px; }
</style>
