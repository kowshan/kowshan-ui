<template>
    <DemoSection
        id="courses"
        index="11"
        title="دوره و تخفیف"
        description="کارت دوره، شمارش معکوس تخفیف، کد تخفیف و فهرست دروس — قطعات آموزش و فروش"
    >
        <!-- Course cards -->
        <p class="demo-caption">کارت دوره — با تخفیف، پیشرفت و ثبت‌نام</p>
        <div class="demo-grid-3">
            <KCourseCard
                v-for="course in courses"
                :key="course.title"
                v-bind="course"
                @enroll="onEnroll"
            />
        </div>

        <hr class="demo-divider" />

        <!-- Countdown + coupon -->
        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">شمارش معکوس پایان تخفیف</p>
                <div class="k-deal-box">
                    <div class="k-deal-box-top">
                        <span class="k-deal-box-title">تخفیف ویژه تابستان</span>
                        <span class="k-deal-box-tag">۴۰٪</span>
                    </div>
                    <KCountdownTimer
                        :target="countdownTarget"
                        label="تا پایان تخفیف:"
                        @end="onCountdownEnd"
                    />
                    <p v-if="countdownEnded" class="demo-caption-note" style="color: var(--k-error)">
                        تخفیف به پایان رسید!
                    </p>
                </div>
            </div>

        </div>

        <hr class="demo-divider" />

        <!-- Cart + checkout -->
        <p class="demo-caption">سبد خرید و تسویه — افزودن دوره، تغییر تعداد، کد تخفیف (KIT10 = ۱۰٪) و ارسال رایگان بالای {{ faNum(2_000_000) }} تومان</p>
        <div class="demo-grid-2">
            <div class="demo-stack">
                <div class="k-cart-actions">
                    <button v-for="c in courses" :key="c.title" type="button" class="k-demo-btn is-muted" @click="addToCart(c)">
                        <Plus :size="14" /> {{ c.title.slice(0, 22) }}
                    </button>
                </div>

                <div v-if="cart.isEmpty.value" class="k-cart-empty">
                    <ShoppingBag :size="26" />
                    <span>سبد خرید خالی است — یک دوره اضافه کنید</span>
                </div>

                <div v-else class="k-cart-list">
                    <KCartItem
                        v-for="item in cart.items"
                        :key="item.id"
                        :item="item"
                        :currency="cart.currency"
                        @update:qty="cart.setQty"
                        @remove="cart.remove"
                    />
                </div>
            </div>

            <KOrderSummary
                :subtotal="cart.subtotal.value"
                :discount="cart.discount.value"
                :shipping="cart.shipping.value"
                :total="cart.total.value"
                :free-shipping-threshold="2_000_000"
                :currency="cart.currency"
                note="پرداخت امن — پشتیبانی ۷ روزه"
                @checkout="onCheckout"
            >
                <template #coupon>
                    <KCouponInput
                        :coupons="coupons"
                        :base-price="cart.subtotal.value"
                        @applied="onCartCouponApplied"
                        @removed="cart.removeCoupon()"
                    />
                </template>
            </KOrderSummary>
        </div>

        <hr class="demo-divider" />

        <!-- Lesson list -->
        <p class="demo-caption">فهرست دروس دوره — درس انتخاب‌شده: {{ selectedLesson || '—' }}</p>
        <KLessonList :sections="curriculum" :current-id="currentLessonId" @select="onLessonSelect" />
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ShoppingBag } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KCourseCard from '../ui-kit/components/KCourseCard.vue'
import KCountdownTimer from '../ui-kit/components/KCountdownTimer.vue'
import KCouponInput, { type CouponDef } from '../ui-kit/components/KCouponInput.vue'
import KLessonList, { type LessonSection } from '../ui-kit/components/KLessonList.vue'
import KCartItem from '../ui-kit/components/KCartItem.vue'
import KOrderSummary from '../ui-kit/components/KOrderSummary.vue'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'
import { useCart } from '../ui-kit/composables/useCart'
import { useToast } from '../ui-kit/composables/useToast'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

const courses = [
    {
        title: 'آموزش جامع Vue 3 و Nuxt',
        category: 'برنامه‌نویسی',
        image: 'https://picsum.photos/seed/course1/600/340',
        instructor: 'علی رضایی',
        instructorAvatar: 'https://i.pravatar.cc/40?img=12',
        rating: 4.8,
        reviews: 1240,
        lessons: 42,
        hours: 18.5,
        price: 890000,
        oldPrice: 1450000,
        discount: '-۳۹٪',
        durationBadge: '18:30',
    },
    {
        title: 'املاک و سرمایه‌گذاری — از صفر تا قرارداد',
        category: 'املاک',
        image: 'https://picsum.photos/seed/course2/600/340',
        instructor: 'سارا محمدی',
        instructorAvatar: 'https://i.pravatar.cc/40?img=47',
        rating: 4.6,
        reviews: 862,
        lessons: 28,
        hours: 11,
        price: 640000,
        oldPrice: 980000,
        discount: '-۳۵٪',
        durationBadge: '11:00',
        progress: 65,
    },
    {
        title: 'بازاریابی دیجیتال برای مشاوران املاک',
        category: 'بازاریابی',
        image: 'https://picsum.photos/seed/course3/600/340',
        instructor: 'مریم کریمی',
        instructorAvatar: 'https://i.pravatar.cc/40?img=5',
        rating: 4.9,
        reviews: 2104,
        lessons: 36,
        hours: 15,
        price: 520000,
        discount: '-۲۰٪',
        durationBadge: '15:00',
        enrolled: true,
    },
]

const onEnroll = (c: any) => {
    console.log('enroll', c.title)
}

/* countdown — ~2 days from mount */
const countdownTarget = Date.now() + (2 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000)
const countdownEnded = ref(false)
const onCountdownEnd = () => { countdownEnded.value = true }

/* cart — useCart singleton with coupon rules + free shipping */
const coupons: CouponDef[] = [
    { code: 'KIT10', percent: 10 },
    { code: 'SUMMER', amount: 500000 },
]
const cart = useCart({
    coupons,
    freeShippingThreshold: 2_000_000,
    shippingCost: 60_000,
    currency: 'تومان'
})

const addToCart = (c: any) => {
    cart.add({
        id: c.title,
        title: c.title,
        meta: c.category,
        image: c.image,
        price: c.price,
        oldPrice: c.oldPrice
    })
}

const onCartCouponApplied = (c: { code: string; saving: number }) => {
    // KCouponInput validated against the same rule list; mirror it in the store
    cart.applyCoupon(c.code)
}

const onCheckout = () => {
    useToast.success(`سفارش با مبلغ ${faNum(cart.total.value)} تومان ثبت شد`)
    cart.clear()
}

/* curriculum */
const curriculum: LessonSection[] = [
    {
        title: 'مقدمه',
        lessons: [
            { id: 'l1', title: 'خوش‌آمدگویی و آشنایی با دوره', type: 'video', duration: '3:20', done: true },
            { id: 'l2', title: 'نصب ابزارها و راه‌اندازی', type: 'video', duration: '12:05', done: true },
            { id: 'l3', title: 'مبانی بازار املاک', type: 'video', duration: '18:40', done: true },
        ],
    },
    {
        title: 'اصول قیمت‌گذاری',
        lessons: [
            { id: 'l4', title: 'عوامل موثر بر قیمت', type: 'video', duration: '22:15' },
            { id: 'l5', title: 'تحلیل بازار منطقه', type: 'video', duration: '16:30' },
            { id: 'l6', title: 'آزمون قیمت‌گذاری', type: 'quiz', duration: '۶ سوال' },
        ],
    },
    {
        title: 'قراردادها',
        lessons: [
            { id: 'l7', title: 'انواع قراردادهای رایج', type: 'video', duration: '25:00', locked: true },
            { id: 'l8', title: 'مدارک لازم برای انتقال', type: 'doc', duration: '۴ صفحه', locked: true },
            { id: 'l9', title: 'آزمون پایانی', type: 'quiz', duration: '۱۰ سوال', locked: true },
        ],
    },
]

const selectedLesson = ref('')
const currentLessonId = ref<string | number | null>('l4')
const onLessonSelect = (l: any) => {
    selectedLesson.value = l.title
    currentLessonId.value = l.id
}
</script>

<style scoped>
.demo-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 16px;
}

.k-deal-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}

.k-deal-box-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.k-deal-box-title {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.k-deal-box-tag {
    font-size: 0.68rem;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--k-error);
    color: #fff;
}

.k-cart-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.k-cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 34px 16px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    color: var(--k-text-muted);
    font-size: 0.76rem;
    text-align: center;
}

.k-cart-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
