<!-- _viewer.vue — loads individual page from showcase/ or falls back to inline registry -->
<template>
    <div class="demo-area" v-if="pageComponent">
        <component :is="pageComponent" />
    </div>
    <div v-else-if="fallbackComp" class="demo-area">
        <h2 class="demo-title">{{ name }}</h2>
        <div class="demo-box">
            <component :is="fallbackComp.component" v-bind="fallbackComp.props || {}" />
        </div>
    </div>
    <div v-else class="demo-empty">
        <p>کامپوننت یافت نشد: {{ name }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, inject, watch, markRaw, shallowRef, type Component } from 'vue'
import { useRoute } from 'vue-router'
import {
    demoItems, demoOptions, demoChartData, demoHeatmapData, demoMessages,
    demoBreadcrumbs, demoComments, demoKanban, demoJsonData, demoMarkdown,
    demoDiff, demoTimeline, demoTagInput, demoTreeData, demoPermissionData,
    demoPricingFeatures, demoLessonList, demoStoryItems, demoOrgData,
    demoGanttData, demoContactCard, demoCourseCard, demoProductCard,
    demoJobCard, demoTeamCard, demoTestimonial, demoQuizCard, demoAssessment,
    demoOrderSummary, demoCouponConfig, demoInfiniteItems, demoFilterBarData,
    demoVirtualListItems,
} from '../demo-data'

const route = useRoute()
const selected = inject<import('vue').Ref<string>>('selected')!

const lazy = (path: string) => defineAsyncComponent({
    loader: () => import(`../../ui-kit/components/${path}.vue`),
    delay: 30,
    timeout: 8000,
    onError(_e: any, _r: any, fail: any) { fail() },
})

const lazyWrapper = (path: string) => defineAsyncComponent({
    loader: () => import(`../../ui-kit/wrappers/${path}.vue`),
    delay: 30,
    timeout: 8000,
    onError(_e: any, _r: any, fail: any) { fail() },
})

const name = ref('')

// Statically discover every showcase page (Vite-friendly, no dynamic-import guessing)
const pages = import.meta.glob<{ default: Component }>(['./K*.vue', './Example*.vue'])

const pageComponent = shallowRef<Component | null>(null)

const loadPage = (componentName: string) => {
    name.value = componentName
    const loader = pages[`./${componentName}.vue`]
    if (!loader) {
        pageComponent.value = null
        return
    }
    pageComponent.value = markRaw(defineAsyncComponent({ loader, delay: 20, timeout: 8000 }))
}

// Fallback registry for components without individual pages
const fallbackComp = computed(() => name.value ? fallbackRegistry[name.value] || null : null)

const fallbackRegistry: Record<string, { component: Component; props?: Record<string, any> }> = {
    KBackToTop: { component: lazy('KBackToTop') },
    KBadge: { component: lazy('KBadge'), props: { count: 5 } },
    KBankCardInput: { component: lazy('KBankCardInput') },
    KBookmarkBar: { component: lazy('KBookmarkBar'), props: { bookmarks: [{ id: '1', title: 'گوگل', url: 'https://google.com', favicon: '' }] } },
    KBottomNav: { component: lazy('KBottomNav'), props: { modelValue: 'home', items: [{ id: 'home', label: 'خانه', icon: 'Home' }, { id: 'search', label: 'جستجو', icon: 'Search' }, { id: 'profile', label: 'پروفایل', icon: 'User' }] } },
    KBottomSheet: { component: lazy('KBottomSheet'), props: { title: 'عنوان' } },
    KBreadcrumb: { component: lazy('KBreadcrumb'), props: { items: demoBreadcrumbs } },
    KButton: { component: lazy('KButton'), props: { label: 'دکمه' } },
    KCalendarHeatmap: { component: lazy('KCalendarHeatmap') },
    KCameraCapture: { component: lazy('KCameraCapture') },
    KCaptcha: { component: lazy('KCaptcha') },
    KCard: { component: lazy('KCard'), props: { title: 'عنوان کارت', description: 'توضیحات کارت' } },
    KCarousel: { component: lazy('KCarousel'), props: { items: [{ image: '', title: 'اسلاید ۱' }, { image: '', title: 'اسلاید ۲' }, { image: '', title: 'اسلاید ۳' }] } },
    KCartItem: { component: lazy('KCartItem'), props: { item: { id: '1', name: 'دوره Vue 3', price: 299000, quantity: 1, image: '' } } },
    KChart: { component: lazy('KChart'), props: { data: demoChartData, type: 'bar', height: 250 } },
    KChat: { component: lazy('KChat'), props: { messages: demoMessages, userId: 'u1' } },
    KChatInput: { component: lazy('KChatInput') },
    KColorPicker: { component: lazy('KColorPicker') },
    KCommandLine: { component: lazy('KCommandLine') },
    KCommandPalette: { component: lazy('KCommandPalette'), props: { visible: true, groups: [{ id: 'nav', title: 'ناوبری', items: [{ id: '1', label: 'خانه' }, { id: '2', label: 'تنظیمات' }] }] } },
    KCommentThread: { component: lazy('KCommentThread'), props: { comments: demoComments } },
    KConfirmDialog: { component: lazy('KConfirmDialog') },
    KContactCard: { component: lazy('KContactCard'), props: { contact: demoContactCard } },
    KContentManager: { component: lazy('KContentManager') },
    KContextMenu: { component: lazy('KContextMenu'), props: { items: [{ label: 'ویرایش', icon: 'Edit' }, { label: 'حذف', icon: 'Trash2' }, { label: 'کپی', icon: 'Copy' }] } },
    KCopyButton: { component: lazy('KCopyButton'), props: { text: 'متن تست' } },
    KCountdownTimer: { component: lazy('KCountdownTimer'), props: { target: Date.now() + 86400000 * 3, label: 'زمان باقی‌مانده' } },
    KCouponInput: { component: lazy('KCouponInput'), props: { coupons: demoCouponConfig } },
    KCourseCard: { component: lazy('KCourseCard'), props: demoCourseCard },
    KDataTableAdvanced: { component: lazy('KDataTableAdvanced'), props: { columns: [{ key: 'name', label: 'نام' }, { key: 'age', label: 'سن' }], rows: [{ name: 'علی', age: 28 }, { name: 'سارا', age: 32 }, { name: 'محمد', age: 25 }] } },
    KDataTableExport: { component: lazy('KDataTableExport') },
    KDatePickerModal: { component: lazy('KDatePickerModal') },
    KDateRange: { component: lazy('KDateRange') },
    KDiffView: { component: lazy('KDiffView'), props: { left: demoDiff.left, right: demoDiff.right } },
    KDrawer: { component: lazy('KDrawer'), props: { title: 'کشویی' } },
    KDropdownMenu: { component: lazy('KDropdownMenu'), props: { items: [{ label: 'پروفایل' }, { label: 'تنظیمات' }, { label: 'خروج' }] } },
    KEmbedPreview: { component: lazy('KEmbedPreview') },
    KEmojiPicker: { component: lazy('KEmojiPicker') },
    KEmptyState: { component: lazy('KEmptyState') },
    KFab: { component: lazy('KFab') },
    KFeatureCard: { component: lazy('KFeatureCard'), props: { title: 'ویژگی جدید', description: 'توضیحات ویژگی', icon: 'Zap' } },
    KFileExplorer: { component: lazy('KFileExplorer') },
    KFileUpload: { component: lazy('KFileUpload') },
    KFilterBar: { component: lazy('KFilterBar'), props: { filters: demoFilterBarData } },
    KForm: { component: lazy('KForm') },
    KFunnel: { component: lazy('KFunnel'), props: { data: [{ label: 'بازدید', value: 1000 }, { label: 'ثبت‌نام', value: 500 }, { label: 'خرید', value: 120 }, { label: 'پرداخت', value: 80 }] } },
    KGanttAnalysis: { component: lazy('KGanttAnalysis') },
    KGanttChart: { component: lazy('KGanttChart'), props: { tasks: demoGanttData } },
    KGauge: { component: lazy('KGauge'), props: { value: 72 } },
    KGlobalLayer: { component: lazy('KGlobalLayer') },
    KGuestPicker: { component: lazy('KGuestPicker') },
    KIconButton: { component: lazy('KIconButton'), props: { icon: 'Settings' } },
    KImageGallery: { component: lazy('KImageGallery') },
    KImportWizard: { component: lazy('KImportWizard') },
    KInfiniteScroll: { component: lazy('KInfiniteScroll'), props: { items: demoInfiniteItems } },
    KInlineEdit: { component: lazy('KInlineEdit'), props: { modelValue: 'متن قابل ویرایش' } },
    KInstallPrompt: { component: lazy('KInstallPrompt') },
    KJobCard: { component: lazy('KJobCard'), props: demoJobCard },
    KJsonNode: { component: lazy('KJsonNode'), props: { data: demoJsonData, key: 'root' } },
    KJsonViewer: { component: lazy('KJsonViewer'), props: { data: demoJsonData } },
    KKanban: { component: lazy('KKanban'), props: { columns: demoKanban } },
    KLessonList: { component: lazy('KLessonList'), props: { lessons: demoLessonList } },
    KLightbox: { component: lazy('KLightbox') },
    KMagicFill: { component: lazy('KMagicFill') },
    KMarkdownRenderer: { component: lazy('KMarkdownRenderer'), props: { source: demoMarkdown } },
    KMasonry: { component: lazy('KMasonry'), props: { columns: 3 } },
    KMegaMenu: { component: lazy('KMegaMenu') },
    KMegaMenuBar: { component: lazy('KMegaMenuBar') },
    KMegaMenuItem: { component: lazy('KMegaMenuItem') },
    KModal: { component: lazy('KModal'), props: { title: 'عنوان مدال' } },
    KMultiStepWizard: { component: lazy('KMultiStepWizard'), props: { steps: [{ title: 'مرحله ۱' }, { title: 'مرحله ۲' }, { title: 'مرحله ۳' }] } },
    KNationalIdInput: { component: lazy('KNationalIdInput') },
    KNotificationBell: { component: lazy('KNotificationBell') },
    KNumberInput: { component: lazy('KNumberInput') },
    KOfflineBanner: { component: lazy('KOfflineBanner') },
    KOnboardingTour: { component: lazy('KOnboardingTour') },
    KOrderSummary: { component: lazy('KOrderSummary'), props: { order: demoOrderSummary } },
    KOrgChart: { component: lazy('KOrgChart'), props: { data: demoOrgData } },
    KOrgNode: { component: lazy('KOrgNode') },
    KOTPInput: { component: lazy('KOTPInput') },
    KPageHeader: { component: lazy('KPageHeader'), props: { title: 'عنوان صفحه', description: 'توضیحات صفحه' } },
    KPagination: { component: lazy('KPagination'), props: { total: 100, perPage: 10 } },
    KPasswordStrength: { component: lazy('KPasswordStrength') },
    KPermissionTree: { component: lazy('KPermissionTree'), props: { data: demoPermissionData } },
    KPermissionTreeNode: { component: lazy('KPermissionTreeNode') },
    KPhoneInput: { component: lazy('KPhoneInput') },
    KPillTabs: { component: lazy('KPillTabs'), props: { items: [{ id: '1', label: 'تب اول' }, { id: '2', label: 'تب دوم' }, { id: '3', label: 'تب سوم' }] } },
    KPivotTable: { component: lazy('KPivotTable') },
    KPostalCodeInput: { component: lazy('KPostalCodeInput') },
    KPresenceIndicator: { component: lazy('KPresenceIndicator'), props: { status: 'online' } },
    KPricingCard: { component: lazy('KPricingCard'), props: { title: 'پرو', price: '۹۹,۰۰۰', period: 'ماهانه', features: demoPricingFeatures, featured: true } },
    KProductCard: { component: lazy('KProductCard'), props: demoProductCard },
    KProfileCard: { component: lazy('KProfileCard'), props: { name: 'علی رضایی', role: 'توسعه‌دهنده', bio: 'علاقه‌مند به Vue و TypeScript' } },
    KProgress: { component: lazy('KProgress'), props: { value: 65 } },
    KProgressRing: { component: lazy('KProgressRing'), props: { value: 75 } },
    KProvinceCitySelect: { component: lazy('KProvinceCitySelect') },
    KQrCode: { component: lazy('KQrCode'), props: { value: 'https://k-kit.dev' } },
    KQuizCard: { component: lazy('KQuizCard'), props: demoQuizCard },
    KRating: { component: lazy('KRating'), props: { modelValue: 4 } },
    KResultPage: { component: lazy('KResultPage'), props: { status: 'success', title: 'موفق', description: 'عملیات با موفقیت انجام شد' } },
    KScatterPlot: { component: lazy('KScatterPlot') },
    KScreenRecorder: { component: lazy('KScreenRecorder') },
    KSearchInput: { component: lazy('KSearchInput') },
    KShibaInput: { component: lazy('KShibaInput') },
    KSidebar: { component: lazy('KSidebar') },
    KSignaturePad: { component: lazy('KSignaturePad') },
    KSkeleton: { component: lazy('KSkeleton') },
    KSortableList: { component: lazy('KSortableList'), props: { items: [{ id: '1', label: 'آیتم اول' }, { id: '2', label: 'آیتم دوم' }, { id: '3', label: 'آیتم سوم' }] } },
    KSparkline: { component: lazy('KSparkline'), props: { data: [10, 25, 15, 40, 30, 55, 45, 70] } },
    KSpinner: { component: lazy('KSpinner') },
    KSplitPane: { component: lazy('KSplitPane') },
    KSpotlightCard: { component: lazy('KSpotlightCard') },
    KStatCard: { component: lazy('KStatCard'), props: { title: 'کاربران', value: '۱۲,۵۰۰', change: 12.5 } },
    KStepper: { component: lazy('KStepper'), props: { steps: ['ثبت‌نام', 'تکمیل پروفایل', 'تأیید هویت'], current: 1 } },
    KStickyHeader: { component: lazy('KStickyHeader') },
    KStories: { component: lazy('KStories'), props: { items: demoStoryItems } },
    KTabs: { component: lazy('KTabs'), props: { items: [{ id: '1', label: 'تب اول' }, { id: '2', label: 'تب دوم' }] } },
    KTagInput: { component: lazy('KTagInput'), props: { modelValue: demoTagInput } },
    KTeamCard: { component: lazy('KTeamCard'), props: demoTeamCard },
    KTeleportHub: { component: lazy('KTeleportHub') },
    KTestimonialCard: { component: lazy('KTestimonialCard'), props: demoTestimonial },
    KTimeline: { component: lazy('KTimeline'), props: { items: demoTimeline } },
    KTimePickerModal: { component: lazy('KTimePickerModal') },
    KToastHost: { component: lazy('KToastHost') },
    KTooltip: { component: lazy('KTooltip'), props: { text: 'متن راهنما' } },
    KTreeMap: { component: lazy('KTreeMap') },
    KTreeNode: { component: lazy('KTreeNode') },
    KTreeView: { component: lazy('KTreeView'), props: { data: demoTreeData } },
    KTypingIndicator: { component: lazy('KTypingIndicator') },
    KUpdatePrompt: { component: lazy('KUpdatePrompt') },
    KVerificationCard: { component: lazy('KVerificationCard') },
    KVerifyBadge: { component: lazy('KVerifyBadge'), props: { status: 'verified' } },
    KVideoPlayer: { component: lazy('KVideoPlayer') },
    KVideoThumbnail: { component: lazy('KVideoThumbnail') },
    KVirtualList: { component: lazy('KVirtualList'), props: { items: demoVirtualListItems, itemHeight: 48 } },
    KVoiceRecorder: { component: lazy('KVoiceRecorder') },
    KWaterfall: { component: lazy('KWaterfall') },
    KWheelPicker: { component: lazy('KWheelPicker') },
    KCheckbox: { component: lazyWrapper('KCheckbox') },
    KCurrency: { component: lazyWrapper('KCurrency') },
    KDataTable: { component: lazyWrapper('KDataTable') },
    KDatePicker: { component: lazyWrapper('KDatePicker') },
    KFileInput: { component: lazyWrapper('KFileInput') },
    KImageUpload: { component: lazyWrapper('KImageUpload') },
    KMap: { component: lazyWrapper('KMap') },
    KMediaGallery: { component: lazyWrapper('KMediaGallery') },
    KMultiSelect: { component: lazyWrapper('KMultiSelect') },
    KPasswordInput: { component: lazyWrapper('KPasswordInput') },
    KRadioGroup: { component: lazyWrapper('KRadioGroup') },
    KSelect: { component: lazyWrapper('KSelect') },
    KSlider: { component: lazyWrapper('KSlider') },
    KTextarea: { component: lazyWrapper('KTextarea') },
    KTextInput: { component: lazyWrapper('KTextInput') },
    KTimePicker: { component: lazyWrapper('KTimePicker') },
    KToggle: { component: lazyWrapper('KToggle') },
}

// Sync from sidebar or URL
watch(() => route.params.name, (n) => {
    if (n && typeof n === 'string') {
        selected.value = n
        loadPage(n)
    }
}, { immediate: true })

watch(selected, (v) => {
    if (v) loadPage(v)
}, { immediate: true })
</script>

<style>
/* NOT scoped — child showcase pages need .sp classes */
.demo-area { min-height: 100px; }
.demo-title {
    font-size: 1rem; font-weight: 700; color: var(--k-text-primary);
    margin: 0 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--k-border);
}
.demo-empty {
    display: flex; align-items: center; justify-content: center;
    height: 100%; color: var(--k-text-muted); font-size: 0.9rem;
}
.sp { display: flex; flex-direction: column; gap: 16px; }
.sp-title { font-size: 1rem; font-weight: 700; margin: 0; color: var(--k-text-primary); }
.sp-sub { font-size: 0.82rem; font-weight: 600; margin: 0; color: var(--k-text-secondary); }
.sp-note { font-size: 0.78rem; color: var(--k-text-muted); }
</style>
