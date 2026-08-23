<template>
    <DemoSection
        id="reservation"
        index="09"
        title="رزرو"
        description="فیلدهای رزرو — بازه تاریخ، مسافران و شبکه‌ی ظرفیت، همگی مبتنی بر composable برای کد تمیزتر"
    >
        <!-- Date range + guests -->
        <p class="demo-caption">بازه‌ی اقامت و مسافران</p>
        <div class="demo-grid">
            <KDateRange
                v-model="reservation.range"
                label="تاریخ ورود و خروج"
                :output-format="'gregorian'"
                :min-nights="2"
                :max-nights="14"
            />
            <KGuestPicker
                v-model="reservation.guests"
                label="مسافران و اتاق‌ها"
            />
        </div>

        <!-- Summary strip — composed purely from the composables -->
        <div class="k-res-summary" :class="{ 'is-invalid': !!rangeError }">
            <div class="k-res-summary-main">
                <span class="k-res-summary-label">خلاصه‌ی رزرو</span>
                <template v-if="reservation.range.checkIn">
                    <span class="k-res-summary-item">{{ range.rangeLabel.value }}</span>
                    <span class="k-res-summary-item is-strong">
                        {{ range.nightsFa.value }} شب
                    </span>
                    <span class="k-res-summary-item">{{ guest.summary.value }}</span>
                </template>
                <span v-else class="k-res-summary-empty">بازه‌ی تاریخ را انتخاب کنید</span>
            </div>
            <div class="k-res-summary-side">
                <span v-if="rangeError" class="k-res-summary-error">
                    <AlertCircle :size="13" /> {{ rangeError }}
                </span>
                <span v-else-if="overlap" class="k-res-summary-error">
                    <AlertCircle :size="13" /> برخی روزها در بازه رزرو شده‌اند
                </span>
                <span v-else class="k-res-summary-ok">
                    <CheckCircle2 :size="13" /> ظرفیت آزاد است
                </span>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Availability -->
        <p class="demo-caption">شبکه‌ی ظرفیت ماه</p>
        <div style="max-width: 460px">
            <KAvailabilityGrid :statuses="mockStatuses" @select="onDaySelect" />
        </div>
        <p v-if="pickedDay" style="font-size: 0.72rem; color: var(--k-text-muted); margin-top: 8px">
            روز انتخاب‌شده: {{ pickedDay }}
        </p>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'

import KDateRange from '../ui-kit/components/KDateRange.vue'
import KGuestPicker from '../ui-kit/components/KGuestPicker.vue'
import KAvailabilityGrid from '../ui-kit/components/KAvailabilityGrid.vue'

import { useDateRange } from '../ui-kit/composables/useDateRange'
import { useGuestPicker } from '../ui-kit/composables/useGuestPicker'
import { useAvailabilityGrid } from '../ui-kit/composables/useAvailabilityGrid'
import { getCurrentJalaliDate } from '../ui-kit/calendar/core/calendarEngine'

/* ---- composable-driven demo state ---- */
const range = useDateRange({ minNights: 2, maxNights: 14, outputFormat: 'gregorian' })
const guest = useGuestPicker()

const reservation = ref({
    range: { checkIn: null as string | null, checkOut: null as string | null, nights: 0 },
    guests: { adults: 1, children: 0, rooms: 1, total: 1 },
})

const rangeError = computed(() => range.error.value)

/* busy days overlap check against the range */
const mockStatuses = buildMockStatuses()

function buildMockStatuses() {
    const today = getCurrentJalaliDate()
    // deterministic-ish busy days in the current month
    const busy: Record<number, 'free' | 'booked' | 'partial' | 'blocked'> = {}
    busy[today.day] = 'blocked'
    busy[today.day + 3] = 'booked'
    busy[today.day + 4] = 'booked'
    busy[today.day + 7] = 'partial'
    busy[today.day + 10] = 'booked'
    busy[today.day + 11] = 'booked'
    busy[today.day + 15] = 'partial'
    busy[today.day + 18] = 'blocked'
    return busy
}

const overlap = computed(() => {
    if (!range.inDate.value || !range.outDate.value) return false
    // convert busy days (day-of-month) to full dates for the visible month
    const list = Object.entries(mockStatuses).map(([d]) => {
        const { year, month } = grid
        return { year: year.value, month: month.value, day: Number(d) }
    })
    return range.overlaps(list)
})

/* availability grid — reuse the composable to share month state with the demo */
const grid = useAvailabilityGrid({
    year: undefined,
    month: undefined,
    statuses: mockStatuses,
    selectable: true
})

const pickedDay = ref<string | null>(null)
const onDaySelect = (day: number) => {
    pickedDay.value = grid.faNum(day)
}
</script>

<style scoped>
.k-res-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
    padding: 12px 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}

.k-res-summary.is-invalid {
    border-color: color-mix(in srgb, var(--k-error) 40%, var(--k-border));
}

.k-res-summary-main {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.k-res-summary-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-muted);
}

.k-res-summary-item {
    font-size: 0.8rem;
    color: var(--k-text-primary);
}

.k-res-summary-item.is-strong {
    font-weight: 800;
    color: var(--k-primary);
}

.k-res-summary-empty {
    font-size: 0.75rem;
    color: var(--k-text-muted);
}

.k-res-summary-side {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 700;
}

.k-res-summary-error {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--k-error);
}

.k-res-summary-ok {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--k-success);
}
</style>
