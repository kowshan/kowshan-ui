<!-- pages/appointments.vue — calendar with event drawer -->
<template>
    <div class="apt-page">
        <!-- Header -->
        <div class="apt-header">
            <div>
                <h1>نوبت‌دهی</h1>
                <p>تقویم نوبت‌ها — روی هر رویداد کلیک کنید تا جزئیات باز شود</p>
            </div>
            <div class="apt-header-actions">
                <!-- Calendar theme selector -->
                <div class="apt-theme-select">
                    <span class="apt-theme-label">پوسته تقویم</span>
                    <div class="apt-theme-chips">
                        <button
                            v-for="t in calThemes"
                            :key="t.id"
                            type="button"
                            class="apt-theme-chip"
                            :class="{ 'is-active': calTheme === t.id }"
                            :title="t.label"
                            @click="setCalTheme(t.id)"
                        >
                            {{ t.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar -->
        <div class="apt-calendar-wrap">
            <KCalendar
                :theme="calTheme"
                :events="allEvents"
                @select-event="onEventClick"
                @select-date="onDateClick"
            />
        </div>

        <!-- Event detail drawer -->
        <KDrawer
            v-model:visible="drawerOpen"
            title="جزئیات نوبت"
            size="md"
        >
            <template v-if="selectedEvent">
                <div class="drawer-section">
                    <div class="drawer-event-title">{{ selectedEvent.title }}</div>
                    <span class="drawer-event-badge" :style="{ background: selectedEvent.color }">
                        {{ selectedEvent.categoryTitle || selectedEvent.category }}
                    </span>
                </div>

                <div class="drawer-form">
                    <!-- Patient select -->
                    <div class="drawer-field">
                        <label class="drawer-label">بیمار</label>
                        <KAutocomplete
                            v-model="drawerForm.patientId"
                            :options="patientOptions"
                            placeholder="نام بیمار را جستجو کنید..."
                            clearable
                            @select="onPatientSelect"
                        />
                    </div>

                    <!-- Time -->
                    <div class="drawer-field">
                        <label class="drawer-label">ساعت نوبت</label>
                        <div class="drawer-time-row">
                            <KTextInput
                                v-model="drawerForm.time"
                                placeholder="HH:MM"
                                right-icon="Clock"
                                style="flex: 1"
                            />
                            <KButton
                                text="انتخاب"
                                bg-color="var(--k-surface-hover)"
                                text-color="var(--k-text-secondary)"
                                @click="showTimePicker = true"
                            />
                        </div>
                    </div>

                    <!-- Date display -->
                    <div class="drawer-field">
                        <label class="drawer-label">تاریخ</label>
                        <div class="drawer-date-display">
                            <CalendarCheck :size="16" />
                            <span>{{ selectedEvent.startDate }}</span>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="drawer-field">
                        <label class="drawer-label">یادداشت</label>
                        <textarea
                            v-model="drawerForm.notes"
                            class="drawer-textarea"
                            placeholder="توضیحات اضافی..."
                            rows="3"
                        />
                    </div>
                </div>

                <!-- Actions -->
                <div class="drawer-actions">
                    <KButton
                        text="ذخیره تغییرات"
                        bg-color="#1db954"
                        text-color="#fff"
                        @click="saveDrawer"
                    />
                    <KButton
                        text="حذف نوبت"
                        bg-color="#fee2e2"
                        text-color="#dc2626"
                        @click="deleteEvent"
                    />
                </div>
            </template>
        </KDrawer>

        <!-- Time picker modal -->
        <KTimePickerModal
            v-model:visible="showTimePicker"
            :initial-time="drawerForm.time || '09:00'"
            title="انتخاب ساعت"
            @confirm="onTimeConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CalendarCheck } from 'lucide-vue-next'
import KCalendar from '../ui-kit/calendar/KCalendar.vue'
import type { CalendarEvent } from '../ui-kit/calendar/types/event'
import type { CalendarTheme } from '../ui-kit/calendar/types/theme'
import KDrawer from '../ui-kit/components/KDrawer.vue'
import KAutocomplete from '../ui-kit/components/KAutocomplete.vue'
import KTextInput from '../ui-kit/wrappers/KTextInput.vue'
import KButton from '../ui-kit/components/KButton.vue'
import KTimePickerModal from '../ui-kit/components/KTimePickerModal.vue'
import { getCurrentJalaliDate } from '../ui-kit/calendar/core/calendarEngine'
import { useToast } from '../ui-kit/composables/useToast'

// ── Calendar theme persistence ──
const STORAGE_KEY = 'k-cal-theme'
const calTheme = ref<CalendarTheme>((localStorage.getItem(STORAGE_KEY) as CalendarTheme) || 'light')

const calThemes: { id: CalendarTheme; label: string }[] = [
    { id: 'light', label: 'روشن' },
    { id: 'dark', label: 'تیره' },
    { id: 'emerald', label: 'زمرد' },
    { id: 'ocean', label: 'اقیانوس' },
    { id: 'royal', label: 'سلطنتی' },
    { id: 'midnight', label: 'نیمه‌شب' },
    { id: 'sunset', label: 'غروب' },
    { id: 'modern', label: 'مدرن' },
]

const setCalTheme = (t: CalendarTheme) => {
    calTheme.value = t
    localStorage.setItem(STORAGE_KEY, t)
}

// ── Mock appointment events ──
const today = getCurrentJalaliDate()
const pad = (n: number) => String(n).padStart(2, '0')
const dateStr = (day: number) => `${today.year}-${pad(today.month)}-${pad(day)}`

const appointmentEvents = ref<CalendarEvent[]>([
    {
        id: 'apt-1',
        title: 'ویزیت دوره‌ای — مریم جعفری',
        category: 'appointment',
        categoryTitle: 'نوبت ویزیت',
        color: '#3b82f6',
        startDate: dateStr(today.day),
        startTime: '08:30',
        endTime: '09:00',
        metadata: { patient: 'مریم جعفری', patientId: 'p1' },
    },
    {
        id: 'apt-2',
        title: 'پیگیری جراحی — رضا شریفی',
        category: 'followup',
        categoryTitle: 'پیگیری',
        color: '#8b5cf6',
        startDate: dateStr(today.day),
        startTime: '09:00',
        endTime: '09:30',
        metadata: { patient: 'رضا شریفی', patientId: 'p2' },
    },
    {
        id: 'apt-3',
        title: 'آزمایش خون — سارا کریمی',
        category: 'lab',
        categoryTitle: 'آزمایش',
        color: '#10b981',
        startDate: dateStr(today.day),
        startTime: '09:30',
        endTime: '10:00',
        metadata: { patient: 'سارا کریمی', patientId: 'p3' },
    },
    {
        id: 'apt-4',
        title: 'ویزیت اولیه — علی محمدی',
        category: 'appointment',
        categoryTitle: 'نوبت ویزیت',
        color: '#3b82f6',
        startDate: dateStr(today.day + 1),
        startTime: '10:00',
        endTime: '10:30',
        metadata: { patient: 'علی محمدی', patientId: 'p4' },
    },
    {
        id: 'apt-5',
        title: 'مشاوره تغذیه — الهام مهدوی',
        category: 'consultation',
        categoryTitle: 'مشاوره',
        color: '#f59e0b',
        startDate: dateStr(today.day + 1),
        startTime: '11:00',
        endTime: '11:30',
        metadata: { patient: 'الهام مهدوی', patientId: 'p5' },
    },
    {
        id: 'apt-6',
        title: 'ویزیت فشار خون — حسن عباسی',
        category: 'appointment',
        categoryTitle: 'نوبت ویزیت',
        color: '#3b82f6',
        startDate: dateStr(today.day + 2),
        startTime: '09:00',
        endTime: '09:30',
        metadata: { patient: 'حسن عباسی', patientId: 'p6' },
    },
    {
        id: 'apt-7',
        title: 'نتیجه MRI — امیر کاظمی',
        category: 'followup',
        categoryTitle: 'پیگیری',
        color: '#8b5cf6',
        startDate: dateStr(today.day + 2),
        startTime: '10:30',
        endTime: '11:00',
        metadata: { patient: 'امیر کاظمی', patientId: 'p7' },
    },
    {
        id: 'apt-8',
        title: 'آزمایش ادرار — زهرا نوری',
        category: 'lab',
        categoryTitle: 'آزمایش',
        color: '#10b981',
        startDate: dateStr(today.day + 3),
        startTime: '08:00',
        endTime: '08:30',
        metadata: { patient: 'زهرا نوری', patientId: 'p8' },
    },
    {
        id: 'apt-9',
        title: 'ویزیت اطفال — نیلوفر صادقی',
        category: 'appointment',
        categoryTitle: 'نوبت ویزیت',
        color: '#3b82f6',
        startDate: dateStr(today.day - 1),
        startTime: '14:00',
        endTime: '14:30',
        metadata: { patient: 'نیلوفر صادقی', patientId: 'p9' },
    },
    {
        id: 'apt-10',
        title: 'مشاوره روانشناسی — محمد حسینی',
        category: 'consultation',
        categoryTitle: 'مشاوره',
        color: '#f59e0b',
        startDate: dateStr(today.day - 2),
        startTime: '15:00',
        endTime: '15:45',
        metadata: { patient: 'محمد حسینی', patientId: 'p10' },
    },
])

const allEvents = computed(() => appointmentEvents.value)

// ── Patient options for autocomplete ──
const patientOptions = [
    { value: 'p1', label: 'مریم جعفری', description: '۴۵ سال — فشار خون' },
    { value: 'p2', label: 'رضا شریفی', description: '۳۸ سال — جراحی' },
    { value: 'p3', label: 'سارا کریمی', description: '۲۹ سال — کم‌خونی' },
    { value: 'p4', label: 'علی محمدی', description: '۵۲ سال — ویزیت اولیه' },
    { value: 'p5', label: 'الهام مهدوی', description: '۳۴ سال — تغذیه' },
    { value: 'p6', label: 'حسن عباسی', description: '۴۱ سال — درد کمر' },
    { value: 'p7', label: 'امیر کاظمی', description: '۲۸ سال — ستون فقرات' },
    { value: 'p8', label: 'زهرا نوری', description: '۶۱ سال — آزمایش' },
    { value: 'p9', label: 'نیلوفر صادقی', description: '۳۰ سال — اطفال' },
    { value: 'p10', label: 'محمد حسینی', description: '۵۵ سال — روانشناسی' },
]

// ── Drawer state ──
const drawerOpen = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)
const showTimePicker = ref(false)

const drawerForm = ref({
    patientId: null as string | number | null,
    time: '',
    notes: '',
})

const onEventClick = (event: CalendarEvent) => {
    selectedEvent.value = event
    drawerForm.value = {
        patientId: (event.metadata?.patientId as string) || null,
        time: event.startTime || '',
        notes: '',
    }
    drawerOpen.value = true
}

const onDateClick = (date: { year: number; month: number; day: number; events: CalendarEvent[] }) => {
    if (date.events.length === 1) {
        onEventClick(date.events[0])
    }
}

const onPatientSelect = (option: { value: string | number; label: string }) => {
    drawerForm.value.patientId = option.value
}

const onTimeConfirm = (time: string) => {
    drawerForm.value.time = time
    showTimePicker.value = false
}

const saveDrawer = () => {
    if (!selectedEvent.value) return
    const idx = appointmentEvents.value.findIndex(e => e.id === selectedEvent.value!.id)
    if (idx >= 0) {
        appointmentEvents.value[idx] = {
            ...appointmentEvents.value[idx],
            startTime: drawerForm.value.time,
            metadata: {
                ...appointmentEvents.value[idx].metadata,
                patientId: drawerForm.value.patientId,
            },
        }
    }
    drawerOpen.value = false
    useToast.success('تغییرات نوبت ذخیره شد')
}

const deleteEvent = () => {
    if (!selectedEvent.value) return
    const title = selectedEvent.value.title
    appointmentEvents.value = appointmentEvents.value.filter(e => e.id !== selectedEvent.value!.id)
    drawerOpen.value = false
    useToast.warning(`نوبت «${title}» حذف شد`)
}
</script>

<style scoped>
.apt-page {
    /* max-width handled by layout */
}

.apt-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
}

.apt-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.apt-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

.apt-header-actions {
    flex-shrink: 0;
}

/* ── Calendar theme selector ── */
.apt-theme-select {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
}

.apt-theme-label {
    font-size: 0.66rem;
    font-weight: 700;
    color: var(--k-text-muted);
}

.apt-theme-chips {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.apt-theme-chip {
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #fff);
    font-size: 0.66rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
    font-family: inherit;
}

.apt-theme-chip:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.apt-theme-chip.is-active {
    background: var(--k-primary, #1db954);
    color: #fff;
    border-color: var(--k-primary, #1db954);
}

/* ── Calendar wrapper ── */
.apt-calendar-wrap {
    margin-bottom: 24px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* ── Drawer content ── */
.drawer-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.drawer-event-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-text-primary);
    flex: 1;
}

.drawer-event-badge {
    font-size: 0.62rem;
    font-weight: 700;
    color: #fff;
    padding: 3px 10px;
    border-radius: 6px;
    flex-shrink: 0;
}

.drawer-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.drawer-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.drawer-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-text-secondary);
}

.drawer-time-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
}

.drawer-date-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary);
}

.drawer-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    font-size: 0.78rem;
    font-family: inherit;
    color: var(--k-text-primary);
    background: var(--k-bg, #fff);
    resize: vertical;
    transition: border-color 0.15s ease;
}

.drawer-textarea:focus {
    outline: none;
    border-color: var(--k-primary, #1db954);
}

.drawer-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}
</style>
