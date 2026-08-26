<template>
    <DemoSection
        id="kanban"
        index="17"
        title="برد و منوی مگا"
        description="برد کانبان با درگ‌اند‌دراپ و چهار نوع منوی بزرگ — تک‌سطحی، دوسطحی، سه‌سطحی و دسته‌بندی‌شده"
    >
        <!-- ═══════ KANBAN ═══════ -->
        <p class="demo-caption">
            فانل فروش (Kanban) — کارت‌ها را بین ستون‌ها بکشید
            <template v-if="lastMove">· آخرین جابه‌جایی: {{ lastMove }}</template>
        </p>
        <KKanban
            v-model="pipeline"
            @move="onMove"
            @card-click="onCardClick"
            @add="onAdd"
            @card-menu="onCardMenu"
        />

        <hr class="demo-divider" />

        <!-- ═══════ HEADER MEGA MENU BAR ═══════ -->
        <hr class="demo-divider" />

        <p class="demo-caption">
            منوی هدر (Mega Menu Bar) — پنل متصل و تمام‌عرض، نه شناور. دسته‌ها از کاتالوگ همین کیت ساخته شده‌اند؛
            روی هر کامپوننت کلیک کنید تا مستنداتش باز شود
        </p>
        <div class="header-mock">
            <div class="header-mock-logo">
                <span class="header-mock-mark">K</span>
                <span class="header-mock-name">K UI Kit</span>
            </div>

            <KMegaMenuBar :items="headerMenus" @select="onHeaderSelect">
                <template #featured="{ item }">
                    <div class="header-featured">
                        <div class="header-featured-title">مستندات زنده</div>
                        <p class="header-featured-desc">
                            هر کامپوننت را در پلی‌گراند زنده امتحان کنید — پراپ‌ها، کد استفاده و سورس.
                        </p>
                        <button
                            type="button"
                            class="header-featured-btn"
                            @click="onHeaderSelect({ label: 'مستندات', value: 'KButton' })"
                        >
                            ورود به مستندات
                        </button>
                    </div>
                </template>
            </KMegaMenuBar>
        </div>

        <hr class="demo-divider" />

        <!-- ═══════ MEGA MENUS ═══════ -->
        <p class="demo-caption">منوی مگا — یک کامپوننت با چهار شکل: تک‌سطحی، دوسطحی، سه‌سطحی و دسته‌بندی‌شده</p>
        <div class="mega-row">
            <div class="mega-demo">
                <p class="mega-demo-title">تک‌سطحی — غنی با آیکون و توضیح</p>
                <KMegaMenu label="گزارش‌ها" :items="singleMenu" @select="onSelect" />
            </div>

            <div class="mega-demo">
                <p class="mega-demo-title">دوسطحی — زیرمنوی پروازی</p>
                <KMegaMenu label="پروژه‌ها" :items="twoLevelMenu" @select="onSelect" />
            </div>

            <div class="mega-demo">
                <p class="mega-demo-title">سه‌سطحی — زیرمنوی تودرتو</p>
                <KMegaMenu label="مدیریت" :items="threeLevelMenu" @select="onSelect" />
            </div>

            <div class="mega-demo">
                <p class="mega-demo-title">دسته‌بندی — پنل ستونی پهن</p>
                <KMegaMenu label="مرکز پشتیبانی" :groups="categorizedMenu" @select="onSelect" />
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    Archive, Award, BarChart3, Bell, BookOpen, Building2, CalendarCheck, CalendarDays, CheckCircle2,
    Clock, Compass, CreditCard, Download, FileBarChart, FileSearch, FolderKanban, Globe, GraduationCap,
    Headphones, KeyRound, Layers, LayoutDashboard, LifeBuoy, Lock, Megaphone, MessageSquare, MonitorSmartphone,
    Palette, PieChart, PlusCircle, Rocket, Settings, ShieldCheck, Smartphone, TextCursorInput, Ticket,
    TrendingUp, UserCog, UserPlus, Users, Wallet,
} from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KKanban from '../ui-kit/components/KKanban.vue'
import type { KKanbanColumn } from '../ui-kit/components/KKanban.vue'
import KMegaMenu from '../ui-kit/components/KMegaMenu.vue'
import type { KMegaItem, KMegaGroup } from '../ui-kit/components/KMegaMenu.vue'
import KMegaMenuBar from '../ui-kit/components/KMegaMenuBar.vue'
import type { KMegaBarItem } from '../ui-kit/components/KMegaMenuBar.vue'
import { useToast } from '../ui-kit/composables/useToast'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()

/* ── kanban board ── */
const pipeline = ref<KKanbanColumn[]>([
    {
        id: 'new',
        title: 'جدید',
        color: '#3b82f6',
        items: [
            { id: 'n1', title: 'زمین ۴۰۰ متری — سعادت‌آباد', subtitle: 'کارشناسی: فردا', label: 'زمین', labelColor: '#8b5cf6', assignee: 'علی رضایی', amount: '۱.۲ میلیارد' },
            { id: 'n2', title: 'آپارتمان ۹۵ متری — تهرانپارس', subtitle: 'منبع: دیوار', label: 'مسکونی', labelColor: '#3b82f6', assignee: 'سارا محمدی', amount: '۳.۸ میلیارد', due: 'امروز', late: true },
            { id: 'n3', title: 'مغازه تجاری — ولیعصر', subtitle: 'تماس اولیه', label: 'تجاری', labelColor: '#f59e0b', assignee: 'مریم کریمی' },
        ],
    },
    {
        id: 'contact',
        title: 'در تماس',
        color: '#f59e0b',
        items: [
            { id: 'c1', title: 'ویلا دوبلکس — لواسان', subtitle: 'بازدید انجام شد', label: 'ویلا', labelColor: '#10b981', assignee: 'علی رضایی', amount: '۲۵ میلیارد', due: '۲ روز بعد' },
            { id: 'c2', title: 'اداری ۲۲۰ متری — سعادت‌آباد', subtitle: 'پیشنهاد قیمت ارسال شد', label: 'اداری', labelColor: '#0ea5e9', assignee: 'سارا محمدی', amount: '۹.۵ میلیارد', due: 'فردا' },
            { id: 'c3', title: 'برج مسکونی — نیاوران', subtitle: 'در انتظار پاسخ', label: 'مسکونی', labelColor: '#3b82f6', assignee: 'مریم کریمی', amount: '۱۸ میلیارد' },
        ],
    },
    {
        id: 'negotiation',
        title: 'مذاکره',
        color: '#8b5cf6',
        items: [
            { id: 'g1', title: 'پنت‌هاوس ۲۵۰ متری — الهیه', subtitle: 'دور دوم مذاکره', label: 'لاکچری', labelColor: '#e11d48', assignee: 'علی رضایی', amount: '۴۲ میلیارد', due: '۳ روز بعد' },
            { id: 'g2', title: 'مغازه — میدان ونک', subtitle: 'پیش‌پرداخت توافق شد', label: 'تجاری', labelColor: '#f59e0b', assignee: 'سارا محمدی', amount: '۸ میلیارد', due: 'امروز', late: true },
        ],
    },
    {
        id: 'won',
        title: 'بسته شده',
        color: '#10b981',
        items: [
            { id: 'w1', title: 'آپارتمان ۱۲۰ متری — جردن', subtitle: 'قرارداد امضا شد', label: 'مسکونی', labelColor: '#3b82f6', assignee: 'علی رضایی', amount: '۱۲ میلیارد', due: 'انجام شد' },
            { id: 'w2', title: 'زمین ۸۰۰ متری — کمال‌آباد', subtitle: 'پرداخت کامل', label: 'زمین', labelColor: '#8b5cf6', assignee: 'مریم کریمی', amount: '۵.۲ میلیارد', due: 'انجام شد' },
        ],
    },
])

const lastMove = ref('')

const colTitle = (id: string) => pipeline.value.find(c => c.id === id)?.title || id

const onMove = ({ item, from, to }: { item: { title: string }; from: string; to: string }) => {
    lastMove.value = `«${item.title}» از ${colTitle(from)} به ${colTitle(to)}`
    useToast.success(`کارت «${item.title}» جابه‌جا شد`)
}

const onCardClick = (item: { title: string }) => {
    useToast.info(`کارت «${item.title}»`)
}

const onAdd = (col: { id: string; title: string }) => {
    const c = pipeline.value.find(c => c.id === col.id)
    if (!c) return
    c.items.push({
        id: `new-${Date.now()}`,
        title: 'سرنخ جدید',
        subtitle: 'تازه اضافه شد',
        label: 'جدید',
        labelColor: '#3b82f6',
        assignee: 'بدون مسئول',
    })
    useToast.success(`کارت جدید به «${col.title}» اضافه شد`)
}

const onCardMenu = (item: { title: string }) => {
    useToast.info(`گزینه‌های «${item.title}»`)
}

/* ── mega menus ── */
const onSelect = (item: KMegaItem) => {
    useToast.info(`«${item.label}» انتخاب شد`)
}

const singleMenu: (KMegaItem | 'divider')[] = [
    { label: 'گزارش فروش', description: 'خلاصه عملکرد فروش ماهانه', icon: TrendingUp },
    { label: 'گزارش مالی', description: 'سود و زیان، ترازنامه', icon: Wallet },
    { label: 'گزارش مشتریان', description: 'تحلیل رفتار مشتری', icon: Users },
    'divider',
    { label: 'گزارش سفارشی', description: 'ساخت گزارش دلخواه', icon: FileBarChart, badge: 'جدید' },
    { label: 'خروجی اکسل', description: 'دانلود با یک کلیک', icon: Download, shortcut: 'Ctrl+E' },
]

const twoLevelMenu: (KMegaItem | 'divider')[] = [
    {
        label: 'پروژه‌های فعال', icon: FolderKanban,
        children: [
            { label: 'سامانه رزرو', description: 'آخرین فعالیت: دیروز', icon: CalendarDays },
            { label: 'اپلیکیشن موبایل', description: 'در حال توسعه', icon: Smartphone },
            { label: 'پنل مدیریت', description: 'مرحله آزمایشی', icon: LayoutDashboard },
        ],
    },
    {
        label: 'پروژه‌های بایگانی', icon: Archive,
        children: [
            { label: 'سایت شرکتی', description: 'بسته شد — ۱۴۰۲', icon: Building2 },
            { label: 'سامانه فروش', description: 'بسته شد — ۱۴۰۱', icon: Megaphone },
        ],
    },
    'divider',
    { label: 'پروژه جدید', description: 'ایجاد از قالب آماده', icon: PlusCircle, badge: 'رایگان' },
]

const threeLevelMenu: (KMegaItem | 'divider')[] = [
    {
        label: 'مدیریت کاربران', icon: UserCog,
        children: [
            { label: 'لیست کاربران', icon: Users },
            {
                label: 'نقش‌ها و دسترسی‌ها', icon: ShieldCheck,
                children: [
                    { label: 'مدیریت نقش‌ها', icon: UserCog },
                    { label: 'دسترسی‌های سطحی', icon: KeyRound },
                    { label: 'گزارش حسابرسی', icon: FileSearch },
                ],
            },
            { label: 'دعوت اعضا', icon: UserPlus },
        ],
    },
    {
        label: 'تنظیمات', icon: Settings,
        children: [
            { label: 'عمومی', description: 'زبان، قالب، اعلان‌ها', icon: Globe },
            {
                label: 'امنیت', icon: Lock,
                children: [
                    { label: 'رمز عبور', icon: KeyRound },
                    { label: 'ورود دومرحله‌ای', icon: ShieldCheck },
                    { label: 'نشست‌های فعال', icon: MonitorSmartphone },
                ],
            },
            { label: 'ظاهر و رنگ', icon: Palette },
        ],
    },
    'divider',
    { label: 'خروج از سیستم', icon: Lock, danger: true },
]

/* ── header mega menu bar — built from an inline component catalog ── */
const categoryIcon = (cat: string) => ({
    'فرم و ورودی': TextCursorInput,
    'نمایش داده': BarChart3,
    'بازخورد': Bell,
    'پیمایش': Compass,
    'پوشش (Overlay)': Layers,
    'CRM': Users,
    'کارت‌های زیبا': CreditCard,
    'دوره و تخفیف': GraduationCap,
    'رزرو': CalendarCheck,
})[cat]

const chunk = <T,>(arr: T[], size: number): T[][] => {
    const out: T[][] = []
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
    return out
}

const componentCatalog: Record<string, string[]> = {
    'فرم و ورودی': ['KAutocomplete', 'KBankCardInput', 'KCaptcha', 'KCheckbox', 'KColorPicker', 'KCurrency', 'KDatePicker', 'KDatePickerModal', 'KDateRange', 'KFileInput', 'KFileUpload', 'KForm', 'KGuestPicker', 'KImageUpload', 'KInlineEdit', 'KMultiSelect', 'KNationalIdInput', 'KNumberInput', 'KOTPInput', 'KPasswordInput', 'KPhoneInput', 'KPostalCodeInput', 'KProvinceCitySelect', 'KRadioGroup', 'KRating', 'KSearchInput', 'KSelect', 'KSignaturePad', 'KSlider', 'KTextarea', 'KTextInput', 'KTimePickerModal', 'KToggle', 'KWheelPicker'],
    'نمایش داده': ['KActivityHeatmap', 'KAvatar', 'KAvatarGroup', 'KAvailabilityGrid', 'KChart', 'KDataTable', 'KEmptyState', 'KJsonNode', 'KJsonViewer', 'KPagination', 'KSkeleton', 'KSparkline', 'KStatCard', 'KTimeline', 'KTreeNode', 'KTreeView', 'KVirtualList'],
    'بازخورد': ['KAlert', 'KConfirmDialog', 'KCountdownTimer', 'KGauge', 'KNotificationBell', 'KProgress', 'KProgressRing', 'KResultPage', 'KSpinner', 'KToastHost', 'KTooltip'],
    'پیمایش': ['KAccordion', 'KAppBar', 'KBreadcrumb', 'KCommandPalette', 'KDropdownMenu', 'KSidebar', 'KStepper', 'KTabs'],
    'پوشش (Overlay)': ['KBottomSheet', 'KContextMenu', 'KDrawer', 'KLightbox', 'KModal'],
    'CRM': ['KAssessment', 'KContactCard', 'KFilterBar', 'KKanban', 'KMagicFill', 'KStories'],
    'رزرو': ['KAvailabilityGrid', 'KCountdownTimer', 'KDateRange', 'KGuestPicker'],
    'کارت‌های زیبا': ['KCard', 'KFeatureCard', 'KPricingCard', 'KProfileCard', 'KSpotlightCard', 'KTestimonialCard'],
    'دوره و تخفیف': ['KCartItem', 'KCouponInput', 'KCourseCard', 'KLessonList', 'KOrderSummary'],
}

const headerMenus = computed<KMegaBarItem[]>(() => {
    const wanted = ['فرم و ورودی', 'نمایش داده', 'بازخورد', 'پیمایش', 'پوشش (Overlay)', 'CRM', 'کارت‌های زیبا', 'دوره و تخفیف', 'رزرو']
    const items: KMegaBarItem[] = wanted.map((cat) => {
        const names = componentCatalog[cat] || []
        return {
            label: cat,
            icon: categoryIcon(cat),
            featured: cat === 'فرم و ورودی',
            groups: chunk(names, 9).map((part, ci) => ({
                title: ci === 0 ? cat : undefined,
                items: part.map((n) => ({ label: n, value: n })),
            })),
        }
    })
    const totalCount = Object.values(componentCatalog).reduce((s, a) => s + a.length, 0)
    items.push({
        label: 'همه کامپوننت‌ها',
        icon: LayoutDashboard,
        badge: toPersianDigits(String(totalCount)),
        value: 'KButton',
    })
    return items
})

const onHeaderSelect = (item: KMegaItem) => {
    useToast.info(`«${item.label}»`)
}

const categorizedMenu: KMegaGroup[] = [
    {
        title: 'شروع سریع',
        items: [
            { label: 'راهنمای شروع', description: '۵ دقیقه', icon: Rocket },
            { label: 'فیلم آموزشی', description: '۱۲ قسمت', icon: BookOpen },
            { label: 'سوالات متداول', icon: MessageSquare },
        ],
    },
    {
        title: 'حساب و صورتحساب',
        items: [
            { label: 'اشتراک‌ها', icon: Award },
            { label: 'فاکتورها', description: 'ماهیانه', icon: FileBarChart },
            { label: 'روش‌های پرداخت', icon: Wallet },
        ],
    },
    {
        title: 'پشتیبانی',
        items: [
            { label: 'تیکت پشتیبانی', icon: Ticket },
            { label: 'گفتگوی زنده', icon: Headphones, badge: 'آنلاین' },
            { label: 'تماس با ما', icon: LifeBuoy },
        ],
    },
    {
        title: 'وضعیت سامانه',
        items: [
            { label: 'وضعیت سرورها', description: 'همه عملیاتی', icon: CheckCircle2 },
            { label: 'گزارش خرابی', icon: Clock },
            { label: 'نسخه‌ها', description: 'آخرین: ۲٫۴٫۱', icon: LayoutDashboard },
        ],
    },
]
</script>

<style scoped>
.mega-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}

.mega-demo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
}

.mega-demo-title {
    margin: 0;
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
}

/* header mock */
.header-mock {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 10px 14px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
}

.header-mock .k-mega-bar {
    flex: 1;
    min-width: 0;
}

.header-mock-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
}

.header-mock-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--k-primary, #1db954), var(--k-primary-hover, #17a34a));
    color: #fff;
    font-weight: 900;
    font-size: 1rem;
    box-shadow: 0 6px 14px color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
}

.header-mock-name {
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.header-featured {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    border-radius: 12px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--k-primary, #1db954) 14%, var(--k-bg, #fff)), var(--k-bg, #fff) 60%);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 30%, var(--k-border, #e2e8f0));
}

.header-featured-title {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.header-featured-desc {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1.7;
    color: var(--k-text-secondary, #64748b);
}

.header-featured-btn {
    border: none;
    border-radius: 8px;
    padding: 7px 12px;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    color: #fff;
    background: var(--k-primary, #1db954);
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
}

.header-featured-btn:hover {
    background: var(--k-primary-hover, #17a34a);
    transform: translateY(-1px);
}
</style>
