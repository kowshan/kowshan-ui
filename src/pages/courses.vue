<!-- pages/courses.vue — courses showcase with KCourseCard -->
<template>
    <div class="courses-page">
        <div class="courses-header">
            <h1>دوره‌ها</h1>
            <p>KCourseCard با داده‌های نمونه</p>
        </div>

        <!-- Category tabs -->
        <div class="courses-tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="courses-tab"
                :class="{ 'is-active': activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
                {{ tab.label }}
                <span class="courses-tab-count">{{ faNum(getCount(tab.id)) }}</span>
            </button>
        </div>

        <!-- Course grid -->
        <div class="courses-grid">
            <KCourseCard
                v-for="course in filteredCourses"
                :key="course.id"
                v-bind="course"
                @enroll="onEnroll"
            />
        </div>

        <div v-if="!filteredCourses.length" class="courses-empty">
            <BookOpen :size="36" />
            <span>دوره‌ای در این دسته‌بندی وجود ندارد</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookOpen } from 'lucide-vue-next'
import KCourseCard from '../ui-kit/components/KCourseCard.vue'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'
import { useToast } from '../ui-kit/composables/useToast'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

const activeTab = ref('all')

const tabs = [
    { id: 'all', label: 'همه' },
    { id: 'dev', label: 'برنامه‌نویسی' },
    { id: 'design', label: 'طراحی' },
    { id: 'business', label: 'کسب‌وکار' },
]

const courses = ref([
    {
        id: 1,
        title: 'آموزش جامع Vue 3 و Composition API',
        category: 'برنامه‌نویسی',
        catKey: 'dev',
        image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=240&fit=crop',
        instructor: 'علی رضایی',
        instructorAvatar: '',
        rating: 4.8,
        reviews: 1240,
        lessons: 42,
        hours: 18.5,
        price: 890000,
        oldPrice: 1450000,
        discount: '-۳۹٪',
        durationBadge: '۱۸.۵ ساعت',
    },
    {
        id: 2,
        title: 'طراحی رابط کاربری با Figma',
        category: 'طراحی',
        catKey: 'design',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=240&fit=crop',
        instructor: 'سارا کریمی',
        instructorAvatar: '',
        rating: 4.6,
        reviews: 890,
        lessons: 35,
        hours: 14,
        price: 750000,
        oldPrice: 0,
        discount: '',
        durationBadge: '۱۴ ساعت',
    },
    {
        id: 3,
        title: 'مدیریت پروژه Agile و Scrum',
        category: 'کسب‌وکار',
        catKey: 'business',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=240&fit=crop',
        instructor: 'محمد حسینی',
        instructorAvatar: '',
        rating: 4.5,
        reviews: 560,
        lessons: 28,
        hours: 12,
        price: 550000,
        oldPrice: 750000,
        discount: '-۲۷٪',
        durationBadge: '۱۲ ساعت',
    },
    {
        id: 4,
        title: 'TypeScript از مبتدی تا پیشرفته',
        category: 'برنامه‌نویسی',
        catKey: 'dev',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=240&fit=crop',
        instructor: 'امیر کاظمی',
        instructorAvatar: '',
        rating: 4.7,
        reviews: 780,
        lessons: 56,
        hours: 24,
        price: 990000,
        oldPrice: 0,
        discount: '',
        durationBadge: '۲۴ ساعت',
        progress: 65,
    },
    {
        id: 5,
        title: 'cean AI و یادگیری ماشین',
        category: 'برنامه‌نویسی',
        catKey: 'dev',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop',
        instructor: 'زهرا نوری',
        instructorAvatar: '',
        rating: 4.9,
        reviews: 2100,
        lessons: 68,
        hours: 32,
        price: 1500000,
        oldPrice: 2200000,
        discount: '-۳۲٪',
        durationBadge: '۳۲ ساعت',
    },
    {
        id: 6,
        title: 'بازاریابی دیجیتال و سئو',
        category: 'کسب‌وکار',
        catKey: 'business',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
        instructor: 'نیلوفر صادقی',
        instructorAvatar: '',
        rating: 4.4,
        reviews: 430,
        lessons: 32,
        hours: 16,
        price: 680000,
        oldPrice: 0,
        discount: '',
        durationBadge: '۱۶ ساعت',
        progress: 30,
    },
    {
        id: 7,
        title: 'Motion Design با After Effects',
        category: 'طراحی',
        catKey: 'design',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
        instructor: 'رضا شریفی',
        instructorAvatar: '',
        rating: 4.3,
        reviews: 320,
        lessons: 24,
        hours: 10,
        price: 450000,
        oldPrice: 600000,
        discount: '-۲۵٪',
        durationBadge: '۱۰ ساعت',
    },
    {
        id: 8,
        title: 'React Native — توسعه اپلیکیشن موبایل',
        category: 'برنامه‌نویسی',
        catKey: 'dev',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop',
        instructor: 'حسن عباسی',
        instructorAvatar: '',
        rating: 4.6,
        reviews: 650,
        lessons: 48,
        hours: 22,
        price: 1100000,
        oldPrice: 0,
        discount: '',
        durationBadge: '۲۲ ساعت',
    },
])

const filteredCourses = computed(() => {
    if (activeTab.value === 'all') return courses.value
    return courses.value.filter(c => c.catKey === activeTab.value)
})

const getCount = (tabId: string) => {
    if (tabId === 'all') return courses.value.length
    return courses.value.filter(c => c.catKey === tabId).length
}

const onEnroll = (course: any) => {
    useToast.success(`ثبت‌نام در دوره «${course.title}» با موفقیت انجام شد`)
}
</script>

<style scoped>
.courses-page {
    /* max-width handled by layout */
}

.courses-header {
    margin-bottom: 20px;
}

.courses-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.courses-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

/* Tabs */
.courses-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.courses-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #fff);
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
    font-family: inherit;
}

.courses-tab:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.courses-tab.is-active {
    background: var(--k-primary, #1db954);
    color: #fff;
    border-color: var(--k-primary, #1db954);
}

.courses-tab-count {
    font-size: 0.62rem;
    font-weight: 800;
    background: rgba(0, 0, 0, 0.08);
    padding: 1px 6px;
    border-radius: 6px;
}

.courses-tab.is-active .courses-tab-count {
    background: rgba(255, 255, 255, 0.25);
}

/* Grid */
.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
}

.courses-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 48px 24px;
    color: var(--k-text-muted);
    font-size: 0.85rem;
}
</style>
