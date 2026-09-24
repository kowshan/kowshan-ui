/**
 * KSwiper context — shared between KSwiper and KSwiperButton.
 * Internal: consumers should not need this file.
 */
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface KSwiperContext {
    next: () => void
    prev: () => void
    goTo: (index: number) => void
    index: Ref<number>
    pages: ComputedRef<number>
    atStart: Ref<boolean>
    atEnd: Ref<boolean>
    isRtl: Ref<boolean>
    /** scroll axis — lets controls point up/down instead of right/left */
    axis: ComputedRef<'horizontal' | 'vertical'>
    perPage: ComputedRef<number | 'auto'>
}

export const KSwiperKey: InjectionKey<KSwiperContext> = Symbol('k-swiper')
