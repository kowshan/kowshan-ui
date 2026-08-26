<!-- pages/dashboard.vue — rich dashboard showcasing UI kit components -->
<template>
    <div class="dash-page">
        <!-- Alert banner -->
        <KAlert
            variant="info"
            title=" به‌روزرسانی سیستم"
            description="نسخه جدید کیت رابط کاربری با قابلیت‌های تازه منتشر شد — مشاهده تغییرات"
            :closable="true"
            style="margin-bottom: 20px"
        />

        <!-- Welcome -->
        <div class="dash-welcome">
            <div>
                <h1>صبح بخیر، دکتر احمدی</h1>
                <p>امروز ۱۲ نوبت دارید — ۳ بیمار منتظر نتیجه آزمایش هستند</p>
            </div>
            <div class="dash-welcome-date">
                <CalendarCheck :size="16" />
                <span>{{ todayJalali }}</span>
            </div>
        </div>

        <!-- Stat cards (using KStatCard) -->
        <div class="dash-stats">
            <KStatCard
                v-for="s in stats"
                :key="s.title"
                :title="s.title"
                :value="s.value"
                :icon="s.icon"
                :variant="s.variant"
                :delta="s.delta"
                :trend="s.trend"
            >
                <KSparkline :data="s.sparkline" :width="140" :height="32" :color="s.sparkColor" />
            </KStatCard>
        </div>

        <!-- Asymmetric row: Area chart (2/3) + Donut (1/3) -->
        <div class="dash-row-asym">
            <div class="dash-card dash-col-wide">
                <h3 class="dash-card-title">
                    <BarChart3 :size="16" />
                    روند هفتگی مراجعات
                </h3>
                <KChart
                    type="area"
                    :data="weeklyData"
                    :height="200"
                    :colors="['#1db954']"
                    :show-axis="true"
                />
            </div>
            <div class="dash-card dash-col-narrow">
                <h3 class="dash-card-title">
                    <PieChart :size="16" />
                    وضعیت نوبت‌ها
                </h3>
                <div class="dash-donut-wrap">
                    <KChart
                        type="donut"
                        :data="appointmentStatus"
                        :donut-size="150"
                        :donut-thickness="22"
                        center-label="نوبت"
                    />
                </div>
                <div class="dash-donut-legend">
                    <div v-for="item in appointmentStatus" :key="item.label" class="dash-donut-legend-item">
                        <span class="dash-donut-dot" :style="{ background: item.color }"></span>
                        <span class="dash-donut-label">{{ item.label }}</span>
                        <span class="dash-donut-val">{{ faNum(item.value) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Asymmetric row: Data table (3/5) + Gauges (2/5) -->
        <div class="dash-row-asym-2">
            <div class="dash-card dash-col-table">
                <h3 class="dash-card-title">
                    <Users :size="16" />
                    بیماران اخیر
                </h3>
                <KFilterBar
                    v-model="patientSearch"
                    :chips="patientChips"
                    search-placeholder="جستجوی بیمار..."
                    @toggle-chip="togglePatientChip"
                    @reset="resetPatientFilter"
                    style="margin-bottom: 14px"
                />
                <div class="dash-table-wrap">
                    <table class="dash-table">
                        <thead>
                            <tr>
                                <th>نام</th>
                                <th>سن</th>
                                <th>آخرین مراجعه</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in filteredPatients" :key="p.id">
                                <td>
                                    <div class="dash-patient-cell">
                                        <KAvatar :name="p.name" size="sm" />
                                        <span>{{ p.name }}</span>
                                    </div>
                                </td>
                                <td>{{ faNum(p.age) }} سال</td>
                                <td>{{ p.lastVisit }}</td>
                                <td>
                                    <KBadge
                                        :variant="p.statusVariant"
                                        size="sm"
                                        :dot="true"
                                    >{{ p.statusLabel }}</KBadge>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="dash-card dash-col-gauges">
                <h3 class="dash-card-title">
                    <Activity :size="16" />
                    شاخص‌های کلیدی
                </h3>
                <div class="dash-gauges-grid">
                    <div class="dash-gauge-item">
                        <KGauge :value="87" label="رضایت بیماران" :size="120" />
                    </div>
                    <div class="dash-gauge-item">
                        <KGauge :value="64" label="تکمیل پرونده" :size="120" color="#f59e0b" />
                    </div>
                    <div class="dash-gauge-item">
                        <KGauge :value="92" label="حضور به موقع" :size="120" color="#3b82f6" />
                    </div>
                    <div class="dash-gauge-item">
                        <KGauge :value="78" label="رضایت کارکنان" :size="120" color="#8b5cf6" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Kanban: Patient Status -->
        <div class="dash-section">
            <h2 class="dash-section-title">
                <ClipboardList :size="18" />
                وضعیت بیماران امروز
            </h2>
            <KKanban
                v-model="kanbanColumns"
                :addable="false"
                @move="onKanbanMove"
            />
        </div>

        <!-- Asymmetric: Timeline (2/3) + Quick actions (1/3) -->
        <div class="dash-row-asym">
            <div class="dash-card dash-col-wide">
                <h3 class="dash-card-title">
                    <Clock :size="16" />
                    فعالیت‌های اخیر سیستم
                </h3>
                <KTimeline :items="timelineItems" />
            </div>
            <div class="dash-card dash-col-narrow">
                <h3 class="dash-card-title">
                    <Zap :size="16" />
                    دسترسی سریع
                </h3>
                <div class="dash-quick-actions">
                    <router-link to="/dash/appointments" class="dash-action-btn">
                        <CalendarCheck :size="18" />
                        <span>نوبت جدید</span>
                    </router-link>
                    <router-link to="/dash/users" class="dash-action-btn">
                        <UserPlus :size="18" />
                        <span>بیمار جدید</span>
                    </router-link>
                    <router-link to="/dash/courses" class="dash-action-btn">
                        <FileText :size="18" />
                        <span>نسخه جدید</span>
                    </router-link>
                    <router-link to="/dash/settings" class="dash-action-btn">
                        <Settings :size="18" />
                        <span>تنظیمات</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    Users, CalendarCheck, Clock, Activity,
    ClipboardList, FileText, HeartPulse, Settings,
    BarChart3, PieChart, Zap, UserPlus,
} from 'lucide-vue-next'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'
import { toJalali } from '../ui-kit/calendar/core/calendarEngine'
import { useToast } from '../ui-kit/composables/useToast'
import KAlert from '../ui-kit/components/KAlert.vue'
import KStatCard from '../ui-kit/components/KStatCard.vue'
import KSparkline from '../ui-kit/components/KSparkline.vue'
import KChart, { type KChartDatum } from '../ui-kit/components/KChart.vue'
import KFilterBar, { type KFilterChip } from '../ui-kit/components/KFilterBar.vue'
import KBadge from '../ui-kit/components/KBadge.vue'
import KGauge from '../ui-kit/components/KGauge.vue'
import KKanban, { type KKanbanColumn } from '../ui-kit/components/KKanban.vue'
import KAvatar from '../ui-kit/components/KAvatar.vue'
import KTimeline from '../ui-kit/components/KTimeline.vue'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

const todayJalali = (() => {
    const j = toJalali(new Date())
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
    return `${faNum(j.day)} ${months[j.month - 1]} ${faNum(j.year)}`
})()

// ── Stat cards ──
const stats = [
    {
        title: 'بیماران فعال', value: 342, icon: Users, variant: 'primary' as const,
        delta: 8, trend: 'up' as const, sparkline: [180, 210, 240, 280, 310, 320, 342], sparkColor: '#1db954',
    },
    {
        title: 'نوبت‌های امروز', value: 12, icon: CalendarCheck, variant: 'info' as const,
        delta: null, trend: 'up' as const, sparkline: [8, 10, 9, 12, 11, 13, 12], sparkColor: '#3b82f6',
    },
    {
        title: 'نسخه‌های صادره', value: 89, icon: FileText, variant: 'success' as const,
        delta: 15, trend: 'up' as const, sparkline: [45, 52, 61, 70, 78, 82, 89], sparkColor: '#10b981',
    },
    {
        title: 'مراجعه این هفته', value: 67, icon: HeartPulse, variant: 'warning' as const,
        delta: -4, trend: 'down' as const, sparkline: [72, 70, 68, 65, 69, 66, 67], sparkColor: '#f59e0b',
    },
]

// ── Area chart: weekly visits ──
const weeklyData: KChartDatum[] = [
    { label: 'شنبه', value: 14 },
    { label: 'یکشنبه', value: 18 },
    { label: 'دوشنبه', value: 12 },
    { label: 'سه‌شنبه', value: 22 },
    { label: 'چهارشنبه', value: 16 },
    { label: 'پنجشنبه', value: 20 },
    { label: 'جمعه', value: 6 },
]

// ── Donut: appointment status ──
const appointmentStatus: KChartDatum[] = [
    { label: 'انجام شده', value: 5, color: '#10b981' },
    { label: 'در حال ویزیت', value: 1, color: '#3b82f6' },
    { label: 'در انتظار', value: 4, color: '#f59e0b' },
    { label: 'لغو شده', value: 1, color: '#ef4444' },
]

// ── Patient data for table ──
const patientSearch = ref('')
const activeChip = ref<string | null>(null)

const patientChips: KFilterChip[] = [
    { id: 'all', label: 'همه', active: true },
    { id: 'today', label: 'امروز', count: 3 },
    { id: 'yesterday', label: 'دیروز', count: 2 },
    { id: 'old', label: 'قدیمی‌تر', count: 1 },
]

const allPatients = [
    { id: 1, name: 'مریم جعفری', age: 45, lastVisit: 'امروز', statusVariant: 'success' as const, statusLabel: 'ویزیت شده', period: 'today' },
    { id: 2, name: 'رضا شریفی', age: 38, lastVisit: 'امروز', statusVariant: 'info' as const, statusLabel: 'در حال ویزیت', period: 'today' },
    { id: 3, name: 'سارا کریمی', age: 29, lastVisit: 'امروز', statusVariant: 'warning' as const, statusLabel: 'در انتظار', period: 'today' },
    { id: 4, name: 'محمد حسینی', age: 52, lastVisit: 'دیروز', statusVariant: 'success' as const, statusLabel: 'ویزیت شده', period: 'yesterday' },
    { id: 5, name: 'زهرا نوری', age: 61, lastVisit: 'دیروز', statusVariant: 'success' as const, statusLabel: 'ویزیت شده', period: 'yesterday' },
    { id: 6, name: 'امیر کاظمی', age: 34, lastVisit: '۳ روز پیش', statusVariant: 'danger' as const, statusLabel: 'پیگیری لازم', period: 'old' },
]

const filteredPatients = computed(() => {
    let list = allPatients
    if (activeChip.value && activeChip.value !== 'all') {
        list = list.filter(p => p.period === activeChip.value)
    }
    if (patientSearch.value) {
        const q = patientSearch.value.toLowerCase()
        list = list.filter(p => p.name.includes(q))
    }
    return list
})

const togglePatientChip = (chip: KFilterChip) => {
    activeChip.value = activeChip.value === chip.id ? null : chip.id
    patientChips.forEach(c => (c.active = c.id === activeChip.value))
}

const resetPatientFilter = () => {
    patientSearch.value = ''
    activeChip.value = null
    patientChips.forEach(c => (c.active = c.id === 'all'))
}

// ── Kanban ──
const kanbanColumns = ref<KKanbanColumn[]>([
    {
        id: 'waiting', title: 'در انتظار', color: '#f59e0b',
        items: [
            { id: 'p1', title: 'علی محمدی', subtitle: 'ویزیت اولیه — فشار خون', label: 'نوبت ۱۰:۳۰', labelColor: '#f59e0b', due: 'امروز ۱۰:۳۰' },
            { id: 'p2', title: 'فاطمه رضایی', subtitle: 'پیگیری دیابت نوع ۲', label: 'نوبت ۱۱:۰۰', labelColor: '#f59e0b', due: 'امروز ۱۱:۰۰' },
            { id: 'p3', title: 'حسن عباسی', subtitle: 'درد مزمن کمر', label: 'نوبت ۱۱:۳۰', labelColor: '#f59e0b', due: 'امروز ۱۱:۳۰' },
        ],
    },
    {
        id: 'in-progress', title: 'در حال ویزیت', color: '#3b82f6',
        items: [
            { id: 'p4', title: 'سارا کریمی', subtitle: 'آزمایش خون — بررسی کم‌خونی', label: 'در حال بررسی', labelColor: '#3b82f6', assignee: 'دکتر احمدی' },
        ],
    },
    {
        id: 'prescribed', title: 'نسخه صادر شده', color: '#1db954',
        items: [
            { id: 'p5', title: 'محمد حسینی', subtitle: 'سرماخوردگی حاد — استراحت', label: 'تمام شده', labelColor: '#1db954', assignee: 'دکتر احمدی' },
            { id: 'p6', title: 'زهرا نوری', subtitle: 'مراجعه مجدد آزمایش', label: 'تمام شده', labelColor: '#1db954', assignee: 'دکتر احمدی' },
        ],
    },
    {
        id: 'followup', title: 'پیگیری لازم', color: '#8b5cf6',
        items: [
            { id: 'p7', title: 'امیر کاظمی', subtitle: 'نتیجه MRI — نیاز به مشاوره', label: 'پیگیری', labelColor: '#8b5cf6', due: 'فردا', late: false },
            { id: 'p8', title: 'نیلوفر صادقی', subtitle: 'تغییر دارو — بررسی عوارض', label: 'پیگیری', labelColor: '#8b5cf6', due: '۳ روز دیگر', late: false },
        ],
    },
])

const onKanbanMove = (payload: { item: { id: string; title: string }; from: string; to: string }) => {
    useToast.success(`وضعیت «${payload.item.title}» بروزرسانی شد`)
}

// ── Timeline ──
const timelineItems = [
    { time: '۱۰:۱۵', title: 'ورود موفق به سیستم', description: 'دکتر احمدی از آدرس IP: ۱۹۲.۱۶۸.۱.۴۵ وارد شد', color: 'info' },
    { time: '۰۹:۴۲', title: 'نسخه صادر شد', description: 'برای بیمار محمد حسینی — آنتی‌بیوتیک + مسکن', color: 'success' },
    { time: '۰۹:۱۰', title: 'نتیجه آزمایش بارگذاری شد', description: 'فایل PDF آزمایش سارا کریمی در سیستم ثبت شد', color: 'info' },
    { time: '۰۸:۵۵', title: 'تغییر دارو', description: 'نسخه قبلی زهرا نوری ویرایش شد — دوز افزایش یافت', color: 'warning' },
    { time: '۰۸:۳۰', title: 'ورود ناموفق', description: 'تلاش ناموفق ورود با نام کاربری admin — IP: ۱۰.۰.۰.۱۲', color: 'danger' },
]
</script>

<style scoped>
.dash-page {
    /* padding provided by layout */
}

.dash-welcome {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 22px;
}

.dash-welcome h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.dash-welcome p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

.dash-welcome-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--k-text-secondary);
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border);
    padding: 6px 12px;
    border-radius: 10px;
    flex-shrink: 0;
}

/* ── Stats ── */
.dash-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
}

/* ── Asymmetric rows ── */
.dash-row-asym {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    margin-bottom: 22px;
}

.dash-row-asym-2 {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 16px;
    margin-bottom: 22px;
}

/* ── Card ── */
.dash-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px;
    overflow: visible;
}

.dash-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

/* ── Donut ── */
.dash-donut-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
}

.dash-donut-legend {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.dash-donut-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: var(--k-text-secondary);
}

.dash-donut-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.dash-donut-label {
    flex: 1;
}

.dash-donut-val {
    font-weight: 700;
    color: var(--k-text-primary);
}

/* ── Patient table ── */
.dash-table-wrap {
    overflow-x: auto;
}

.dash-table {
    width: 100%;
    border-collapse: collapse;
}

.dash-table th {
    text-align: right;
    padding: 8px 10px;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-text-muted);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    white-space: nowrap;
}

.dash-table td {
    padding: 10px;
    font-size: 0.78rem;
    color: var(--k-text-primary);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.dash-table tbody tr:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

.dash-table tbody tr:last-child td {
    border-bottom: none;
}

.dash-patient-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ── Gauges ── */
.dash-gauges-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    justify-items: center;
    padding: 8px 0;
}

.dash-gauge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

/* ── Section ── */
.dash-section {
    margin-bottom: 22px;
}

.dash-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

/* ── Quick actions ── */
.dash-quick-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.dash-action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--k-text-secondary);
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    transition: all 0.15s ease;
}

.dash-action-btn:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 6%, transparent));
}

@media (max-width: 900px) {
    .dash-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    .dash-row-asym,
    .dash-row-asym-2 {
        grid-template-columns: 1fr;
    }
}
</style>
