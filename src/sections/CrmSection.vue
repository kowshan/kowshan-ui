<template>
    <DemoSection
        id="crm"
        index="07"
        title="ابزارهای CRM"
        description="استوری، تقویم رزرو و پرسش — قطعات پرکاربرد در سامانه‌های املاک و مدیریت مشتری"
    >
        <!-- Stories -->
        <p class="demo-caption">استوری — کلیک روی آواتار برای نمایش</p>
        <KStories :stories="stories" />

        <hr class="demo-divider" />

        <!-- Availability grid + assessment -->
        <div class="demo-grid-2">
            <div>
                <p class="demo-caption">تقویم رزرو ملک — مرداد ۱۴۰۵</p>
                <KAvailabilityGrid
                    :year="1405"
                    :month="5"
                    :statuses="reservations"
                    @select="(d: number) => (selectedDay = d)"
                />
                <p v-if="selectedDay" style="font-size: 0.75rem; color: var(--k-primary); margin-top: 8px">
                    روز انتخاب‌شده: {{ faNum(selectedDay) }} مرداد
                </p>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">کارت مشتری (سرنخ)</p>
                <KContactCard :contact="lead" selectable v-model:selected="leadSelected" @call="onLeadAction" />
                <p v-if="leadSelected" style="font-size: 0.72rem; color: var(--k-success); margin: 0">
                    سرنخ انتخاب شد — آماده عملیات دسته‌جمعی
                </p>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Kanban pipeline -->
        <p class="demo-caption">فانل فروش (Kanban) — کارت را بین ستون‌ها بکشید: {{ lastMove || 'هنوز جابه‌جایی‌ای نشده' }}</p>
        <KKanban v-model="pipeline" :addable="false" @card-click="onCardClick" />

        <hr class="demo-divider" />

        <!-- Inline edit + magic fill + heatmap + drawer -->
        <p class="demo-caption">ویرایش درجا — روی مقدار کلیک کنید</p>
        <div class="k-demo-inline-row">
            <KInlineEdit v-model="leadEditable.name" label="نام" />
            <KInlineEdit v-model="leadEditable.stage" type="select" label="مرحله" :options="['جدید', 'در تماس', 'قرارداد', 'بسته شده']" />
            <KInlineEdit v-model="leadEditable.budget" label="بودجه (میلیون)" />
        </div>
        <p class="demo-caption-note">
            آخرین مقدار ذخیره‌شده: {{ leadEditable.name }} · {{ leadEditable.stage }} ·
            {{ leadEditable.budget ? leadEditable.budget + ' میلیون' : '—' }}
        </p>

        <hr class="demo-divider" />

        <div class="demo-grid-2">
            <!-- Magic fill -->
            <div>
                <p class="demo-caption">افزودن سرنخ جادویی — متن خام را بچسبانید</p>
                <KMagicFill
                    v-model="magicLead"
                    placeholder="مثلاً: علی رضایی — ۰۹۱۲۱۲۳۴۵۶۷ — تهران، سعادت‌آباد — خریدار آپارتمان ۱۰۰ متری از سایت"
                />
                <p v-if="Object.keys(magicLead).length" class="demo-caption-note" style="color: var(--k-success)">
                    سرنخ آماده: {{ JSON.stringify(magicLead) }}
                </p>
            </div>

            <!-- Activity heatmap -->
            <div>
                <p class="demo-caption">گرمای فعالیت تیم — ۱۲ ماه گذشته</p>
                <KActivityHeatmap :data="activityData" />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Drawer -->
        <p class="demo-caption">نمای جزئیات — کشوی کناری با استور سراسری</p>
        <div class="demo-stack">
            <div>
                <button type="button" class="k-demo-btn" @click="overlay.openDrawer('lead-detail')">
                    <PanelRight :size="15" /> باز کردن جزئیات سرنخ (openDrawer)
                </button>
            </div>

            <KDrawer id="lead-detail" title="جزئیات سرنخ — نگار حسینی" size="md">
                <div class="k-demo-drawer-body">
                    <div class="k-demo-drawer-head">
                        <img :src="lead.src" class="k-demo-drawer-avatar" alt="" />
                        <div>
                            <div class="k-demo-drawer-name">{{ lead.name }}</div>
                            <div class="k-demo-drawer-sub">{{ lead.role }}</div>
                        </div>
                        <span class="k-demo-drawer-badge">داغ 🔥</span>
                    </div>

                    <div class="k-demo-drawer-rows">
                        <div class="k-demo-drawer-row"><Phone :size="14" /> {{ faNum(lead.phone) }}</div>
                        <div class="k-demo-drawer-row"><Mail :size="14" /> {{ lead.email }}</div>
                        <div class="k-demo-drawer-row"><MapPin :size="14" /> {{ lead.address }}</div>
                        <div class="k-demo-drawer-row"><CalendarDays :size="14" /> پیگیری بعدی: ۱۴۰۵/۰۵/۲۵</div>
                    </div>

                    <div class="k-demo-drawer-section">فعالیت‌ها</div>
                    <div v-for="(act, i) in drawerActivity" :key="i" class="k-demo-drawer-activity">
                        <span class="k-demo-drawer-activity-dot" :style="{ background: act.color }"></span>
                        <div class="k-demo-drawer-activity-main">
                            <span class="k-demo-drawer-activity-text">{{ act.text }}</span>
                            <span class="k-demo-drawer-activity-time">{{ act.time }}</span>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <button type="button" class="k-demo-btn is-muted" @click="overlay.closeDrawer('lead-detail')">بستن</button>
                    <button type="button" class="k-demo-btn" @click="drawerAction">ثبت پیگیری</button>
                </template>
            </KDrawer>
        </div>

        <div class="demo-stack">
            <p class="demo-caption">پرسش — ارزیابی مشتری</p>
                <KAssessment
                    question="آیا ملک را از نزدیک بازدید کرده‌اید؟"
                    :options="['بله، بازدید کردم', 'خیر، هنوز نه']"
                    mode="boolean"
                    layout="inline"
                    v-model="assess1"
                />

                <KAssessment
                    question="نوع ملک مورد نظر شما کدام است؟"
                    :options="[
                        { id: 'apt', label: 'آپارتمان', description: 'مسکونی — واحد' },
                        { id: 'villa', label: 'ویلا', description: 'باغ و حیاط' },
                        { id: 'office', label: 'اداری', description: 'دفتر کار' },
                        { id: 'land', label: 'زمین', description: 'سرمایه‌گذاری' },
                    ]"
                    :number="2"
                    layout="grid"
                    v-model="assess2"
                />

                <KAssessment
                    question="کدام امکانات برای شما مهم است؟ (چند انتخابی)"
                    :options="['استخر', 'بالکن', 'آسانسور', 'پارکینگ']"
                    mode="multi"
                    layout="grid"
                    v-model="assess3"
                />
            </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CalendarDays, Mail, MapPin, PanelRight, Phone } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KStories from '../ui-kit/components/KStories.vue'
import KAvailabilityGrid from '../ui-kit/components/KAvailabilityGrid.vue'
import KContactCard from '../ui-kit/components/KContactCard.vue'
import KKanban from '../ui-kit/components/KKanban.vue'
import KAssessment from '../ui-kit/components/KAssessment.vue'
import KInlineEdit from '../ui-kit/components/KInlineEdit.vue'
import KMagicFill from '../ui-kit/components/KMagicFill.vue'
import KActivityHeatmap from '../ui-kit/components/KActivityHeatmap.vue'
import KDrawer from '../ui-kit/components/KDrawer.vue'
import { useModalStore } from '../ui-kit/stores/modalStore'

const overlay = useModalStore()

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: number | string) => String(n).replace(/\d/g, d => faDigits[Number(d)])

const stories = [
    {
        id: 1,
        name: 'علی رضایی',
        avatar: 'https://i.pravatar.cc/80?img=12',
        media: [
            { src: 'https://picsum.photos/seed/st1a/800/1200', caption: 'نمای ساختمان' },
            { src: 'https://picsum.photos/seed/st1b/800/1200', caption: 'لابی' },
        ],
    },
    {
        id: 2,
        name: 'سارا محمدی',
        avatar: 'https://i.pravatar.cc/80?img=32',
        media: [
            { src: 'https://picsum.photos/seed/st2a/800/1200', caption: 'ملک جدید در منطقه ۱' },
        ],
    },
    {
        id: 3,
        name: 'مریم کریمی',
        avatar: 'https://i.pravatar.cc/80?img=47',
        media: [
            { src: 'https://picsum.photos/seed/st3a/800/1200', caption: 'بازدید امروز' },
            { src: 'https://picsum.photos/seed/st3b/800/1200', caption: 'قرارداد ثبت شد' },
            { src: 'https://picsum.photos/seed/st3c/800/1200', caption: 'تبریک!' },
        ],
    },
    {
        id: 4,
        name: 'محمد احمدی',
        avatar: 'https://i.pravatar.cc/80?img=60',
        media: [
            { src: 'https://picsum.photos/seed/st4a/800/1200', caption: 'آگهی جدید' },
        ],
    },
]

/* Contact card lead */
const lead = {
    name: 'نگار حسینی',
    src: 'https://i.pravatar.cc/80?img=47',
    role: 'خریدار — آپارتمان ۱۰۰ متری',
    company: 'اشاره به کمپین تابستانی',
    phone: '09121234567',
    email: 'negar.h@example.com',
    address: 'تهران، سعادت‌آباد',
    status: 'online' as const,
    code: 'L-1024',
    tags: [
        { label: 'داغ 🔥', variant: 'danger' as const },
        { label: 'تماس گرفته', variant: 'success' as const },
        { label: 'از سایت', variant: 'info' as const },
    ],
}
const leadSelected = ref(false)
const lastMove = ref('')
const onLeadAction = (c: any) => { console.log('lead action', c) }
const onCardClick = (item: any) => { lastMove.value = 'کارت باز شد: ' + item.title }

/* Kanban pipeline (v-model so drag moves persist) */
const pipeline = ref([
    {
        id: 'new',
        title: 'جدید',
        color: '#3b82f6',
        items: [
            { id: 'k1', title: 'استعلام آپارتمان ۹۵ متری', subtitle: 'منبع: سایت — امروز ۱۰:۲۰', label: 'داغ', labelColor: '#dc2626', assignee: 'علی رضایی', avatar: 'https://i.pravatar.cc/40?img=12', amount: '۸.۵ میلیارد', due: 'فردا', late: false },
            { id: 'k2', title: 'ویلا دوبلکس — بازدید پنجشنبه', subtitle: 'منبع: معرفی', assignee: 'سارا محمدی', avatar: 'https://i.pravatar.cc/40?img=47', amount: '۲۵ میلیارد', due: '۱۲ مرداد' },
        ],
    },
    {
        id: 'contacted',
        title: 'در تماس',
        color: '#f59e0b',
        items: [
            { id: 'k3', title: 'مغازه تجاری خیابان ولیعصر', subtitle: 'دو پیگیری انجام شده', label: 'پیگیری', labelColor: '#1db954', assignee: 'مریم کریمی', avatar: 'https://i.pravatar.cc/40?img=5', amount: '۱۲۰ میلیارد', due: 'امروز', late: true },
            { id: 'k4', title: 'سوئیت استودیو — پیشنهاد ۴.۲', subtitle: 'در انتظار پاسخ به پیشنهاد', assignee: 'رضا قاسمی', avatar: 'https://i.pravatar.cc/40?img=15', amount: '۴.۲ میلیارد' },
        ],
    },
    {
        id: 'contract',
        title: 'قرارداد',
        color: '#10b981',
        items: [
            { id: 'k5', title: 'پنت‌هاوس — انعقاد قرارداد', subtitle: 'مراحل حقوقی در حال انجام', label: 'امضا', labelColor: '#10b981', assignee: 'علی رضایی', avatar: 'https://i.pravatar.cc/40?img=12', amount: '۶۸ میلیارد', due: '۲۰ مرداد' },
        ],
    },
    {
        id: 'closed',
        title: 'بسته شده',
        color: '#94a3b8',
        items: [
            { id: 'k6', title: 'انبار صنعتی — فروش نهایی', subtitle: 'کمیسیون ۲٪ ثبت شد', label: 'بسته', labelColor: '#64748b', assignee: 'مینا کریمی', avatar: 'https://i.pravatar.cc/40?img=32', amount: '۴۵ میلیارد', due: '۲ مرداد' },
        ],
    },
])

/* Sample reservations for مرداد ۱۴۰۵ (days 1-31) */
const reservations: Record<number, any> = {
    2: 'booked', 3: 'booked', 4: 'partial',
    8: 'blocked', 9: 'blocked', 10: 'blocked',
    14: 'booked', 15: 'booked', 16: 'booked', 17: 'booked',
    21: 'partial', 22: 'partial',
    27: 'booked', 28: 'booked',
}

const selectedDay = ref<number | null>(null)

const assess1 = ref<string | null>(null)
const assess2 = ref<string | null>(null)
const assess3 = ref<string[]>([])

/* Inline-edit demo state */
const leadEditable = ref({ name: 'نگار حسینی', stage: 'در تماس', budget: '1200' })

/* Magic-fill demo state */
const magicLead = ref<Record<string, string>>({})

/* Heatmap mock — deterministic activity for the past 12 weeks */
const activityData: Record<string, number> = {}
{
    const today = new Date()
    for (let i = 0; i < 90; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        // seeded pseudo-random 0..14, weekends calmer
        const seed = (d.getDate() * 7 + d.getMonth() * 31) % 15
        const weekend = d.getDay() === 5 || d.getDay() === 6 ? 0.4 : 1
        activityData[key] = Math.round(seed * weekend)
    }
}

/* Drawer demo state */
const drawerActivity = [
    { text: 'تماس تلفنی — گفتگوی ۱۲ دقیقه', time: 'امروز ۱۰:۲۴', color: 'var(--k-primary)' },
    { text: 'ایمیل ارسال شد — پیشنهاد ویلای دوبلکس', time: 'دیروز ۱۶:۰۵', color: 'var(--k-success)' },
    { text: 'بازدید ملک — سعادت‌آباد', time: '۱۲ مرداد', color: 'var(--k-warning, #f59e0b)' },
    { text: 'سرنخ ایجاد شد — از کمپین تابستانی', time: '۱۰ مرداد', color: 'var(--k-text-muted)' },
]
const drawerAction = () => {
    overlay.closeDrawer('lead-detail')
    const toastStore = (window as any).__kToastStore
    // toasts are demoed in the Feedback section; keep it simple here
    console.log('پیگیری ثبت شد')
}
</script>

<style scoped>
.k-demo-inline-row {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    padding: 10px 14px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}

.demo-caption-note {
    font-size: 0.72rem;
    color: var(--k-text-muted);
    margin-top: 8px;
    margin-bottom: 0;
}

.k-demo-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    border-radius: var(--k-radius-sm);
    padding: 8px 16px;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-demo-btn:hover { filter: brightness(1.08); }
.k-demo-btn.is-muted {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}

.k-demo-drawer-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.k-demo-drawer-head {
    display: flex;
    align-items: center;
    gap: 12px;
}

.k-demo-drawer-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    object-fit: cover;
}

.k-demo-drawer-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.k-demo-drawer-sub {
    font-size: 0.72rem;
    color: var(--k-text-muted);
}

.k-demo-drawer-badge {
    margin-inline-start: auto;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--k-error) 14%, transparent);
    color: var(--k-error);
}

.k-demo-drawer-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
}

.k-demo-drawer-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--k-text-primary);
    direction: ltr;
    justify-content: flex-start;
}

.k-demo-drawer-section {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-muted);
    padding-top: 4px;
}

.k-demo-drawer-activity {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.k-demo-drawer-activity-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
}

.k-demo-drawer-activity-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-demo-drawer-activity-text {
    font-size: 0.78rem;
    color: var(--k-text-primary);
}

.k-demo-drawer-activity-time {
    font-size: 0.62rem;
    color: var(--k-text-muted);
}
</style>
