<!-- components/KCourseCard.vue -->
<!--
    KCourseCard — course/education card for learning platforms:

      <KCourseCard
        title="آموزش جامع Vue 3 و Nuxt"
        category="برنامه‌نویسی"
        image="…"
        instructor="علی رضایی"
        instructorAvatar="…"
        rating="4.8"
        reviews="1240"
        lessons="42"
        hours="18.5"
        price="890000"
        old-price="1450000"
        discount="-39٪"
        :progress="65"
        @click="…"
        @enroll="…"
      />
-->
<template>
    <article class="k-course" :class="{ 'is-in-progress': hasProgress }" @click="emits('click', $event)">
        <!-- Thumbnail -->
        <div dir="ltr" class="k-course-media">
            <img :src="image" :alt="title" loading="lazy" />
            <span v-if="category" class="k-course-category">{{ category }}</span>
            <span v-if="discount" class="k-course-discount">{{ discount }}</span>
            <div v-if="durationBadge || hasProgress" class="k-course-meta-bar">
                <span v-if="durationBadge" class="k-course-duration">
                    <Clock :size="11" /> {{ durationBadge }}
                </span>
                <div v-if="hasProgress" class="k-course-progress">
                    <div class="k-course-progress-bar" :style="{ width: progress + '%' }"></div>
                    <span class="k-course-progress-label">{{ progress }}٪ تکمیل</span>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="k-course-body">
            <h3 class="k-course-title">{{ title }}</h3>

            <div class="k-course-instructor">
                <img :src="instructorAvatar" :alt="instructor" loading="lazy" />
                <span>{{ instructor }}</span>
            </div>

            <div class="k-course-meta">
                <span class="k-course-rating">
                    <Star :size="13" fill="currentColor" /> {{ rating }}
                    <span class="k-course-reviews">({{ reviews }} نظر)</span>
                </span>
                <span v-if="lessons || hours" class="k-course-stats">
                    <span v-if="lessons"><PlayCircle :size="12" /> {{ lessons }} درس</span>
                    <span v-if="hours"><Hourglass :size="12" /> {{ hours }} ساعت</span>
                </span>
            </div>
        </div>

        <!-- Footer -->
        <div class="k-course-footer">
            <div class="k-course-price">
                <span class="k-course-price-now">{{ price }} <small>تومان</small></span>
                <span v-if="oldPrice" class="k-course-price-old">{{ oldPrice }}</span>
            </div>
            <button
                type="button"
                class="k-course-enroll"
                :class="{ 'is-done': enrolled }"
                @click.stop="onEnroll"
            >
                <Check v-if="enrolled" :size="13" />
                <ShoppingCart v-else :size="13" />
                {{ enrolled ? 'ثبت‌نام شد' : 'ثبت‌نام' }}
            </button>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Clock, Hourglass, PlayCircle, ShoppingCart, Star } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    title: string
    image?: string
    category?: string
    instructor?: string
    instructorAvatar?: string
    rating?: number
    reviews?: number
    lessons?: number
    hours?: number
    /** price in Toman */
    price: number
    oldPrice?: number
    /** e.g. "۳۹٪" or "-39%" */
    discount?: string
    /** show a completion progress bar (0-100) */
    progress?: number
    durationBadge?: string
    /** initially enrolled */
    enrolled?: boolean
}>(), {
    image: '',
    category: '',
    instructor: '',
    instructorAvatar: '',
    rating: 0,
    reviews: 0,
    lessons: 0,
    hours: 0,
    oldPrice: 0,
    discount: '',
    progress: 0,
    durationBadge: '',
    enrolled: false
})

const emits = defineEmits<{
    (e: 'click', event: MouseEvent): void
    (e: 'enroll', card: typeof props): void
}>()

const { toPersianDigits } = usePersianNumbers()

const hasProgress = computed(() => props.progress && props.progress > 0)
const enrolled = ref(props.enrolled)

const onEnroll = () => {
    if (!enrolled.value) {
        enrolled.value = true
        emits('enroll', props)
    }
}
</script>

<style scoped>
.k-course {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.k-course:hover {
    transform: translateY(-3px);
    box-shadow: var(--k-shadow-lg, 0 14px 34px rgba(15, 23, 42, 0.14));
}

.k-course-media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--k-surface-hover, #f1f5f9);
}

.k-course-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.k-course-category {
    position: absolute;
    top: 10px;
    inset-inline-start: 10px;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--k-primary, #1db954) 90%, #fff);
    color: #fff;
}

.k-course-discount {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    font-size: 0.66rem;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 8px;
    background: #ef4444;
    color: #fff;
}

.k-course-meta-bar {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 10px 8px;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.78) 0%, transparent 100%);
}

.k-course-duration {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 7px;
    background: rgba(15, 23, 42, 0.72);
    color: #fff;
    backdrop-filter: blur(2px);
}

.k-course-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.k-course-progress-bar {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: color-mix(in srgb, #fff 30%, transparent);
    overflow: hidden;
}

.k-course-progress-bar::after {
    content: '';
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--k-primary, #1db954);
    transition: width 0.4s ease;
}

.k-course-progress-label {
    font-size: 0.6rem;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
}

.k-course-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px 0;
    flex: 1;
}

.k-course-title {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 800;
    line-height: 1.55;
    color: var(--k-text-primary, #1e293b);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.k-course-instructor {
    display: flex;
    align-items: center;
    gap: 7px;
}

.k-course-instructor img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
}

.k-course-instructor span {
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
}

.k-course-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
}

.k-course-rating {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
}

.k-course-reviews {
    color: var(--k-text-muted, #94a3b8);
    font-weight: 500;
}

.k-course-stats {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.64rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-course-stats span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
}

.k-course-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    margin-top: 10px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-course-price {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.k-course-price-now {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-course-price-now small {
    font-size: 0.56rem;
    font-weight: 500;
    color: var(--k-text-muted, #94a3b8);
}

.k-course-price-old {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
    text-decoration: line-through;
}

.k-course-enroll {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: none;
    border-radius: 9px;
    padding: 7px 12px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease, background 0.15s ease;
}

.k-course-enroll:hover {
    filter: brightness(1.08);
}

.k-course-enroll.is-done {
    background: var(--k-success, #16a34a);
}
</style>
