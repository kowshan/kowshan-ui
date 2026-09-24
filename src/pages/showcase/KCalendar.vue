<!-- showcase/KCalendar.vue — the full Jalali calendar module + every theme -->
<template>
    <div class="sp">
        <h2 class="sp-title">KCalendar</h2>
        <p class="sp-note">
            ماژول تقویم جلالی از <code>ui-kit/calendar/</code> — موتور تاریخ مستقل، نماهای ماه/هفته/روز/سال/برنامه،
            تم‌های آماده و رویدادها. {{ calThemes.length }} تم تقویم + ۳ تم سایت.
        </p>

        <!-- ── Kit themes (the 3 app themes) ───────────────────── -->
        <h3 class="sp-sub">تم سایت (data-theme روی .k-ui)</h3>
        <div class="kc-row">
            <button
                v-for="t in kitThemes"
                :key="t"
                type="button"
                class="kc-chip"
                :class="{ active: theme === t }"
                @click="setTheme(t)"
            >{{ t }}</button>
            <span class="sp-note">فعلی: {{ theme }}</span>
        </div>

        <!-- ── Calendar themes ─────────────────────────────────── -->
        <h3 class="sp-sub">تم تقویم — فعلی: <code>{{ calTheme }}</code></h3>
        <div class="kc-row">
            <input v-model="themeQuery" class="kc-search" type="text" placeholder="جستجوی تم…" dir="ltr" />
            <button type="button" class="kc-chip" @click="calTheme = 'light'">ریست</button>
            <button type="button" class="kc-chip" @click="randomTheme()">تصادفی</button>
        </div>
        <div class="kc-theme-box">
            <button
                v-for="t in filteredThemes"
                :key="t"
                type="button"
                class="kc-theme"
                :class="{ active: calTheme === t }"
                @click="calTheme = t"
            >{{ t }}</button>
        </div>

        <!-- ── Live calendar ───────────────────────────────────── -->
        <h3 class="sp-sub">تقویم با تم انتخابی</h3>
        <KCalendar
            :theme="calTheme"
            :show-keyboard-hint="false"
            @select-date="onSelectDate"
            @select-event="onSelectEvent"
        />
        <p class="sp-note">
            آخرین انتخاب: {{ selectedDate || '—' }} / رویداد: {{ selectedEvent || '—' }}
        </p>

        <!-- ── Views ───────────────────────────────────────────── -->
        <h3 class="sp-sub">نماها</h3>
        <KCalendar :theme="calTheme" view="week" :show-legends="false" :show-keyboard-hint="false" />
        <KCalendar :theme="calTheme" view="agenda" :show-keyboard-hint="false" />
        <KCalendar :theme="calTheme" view="day" :show-legends="false" :show-keyboard-hint="false" />
        <KCalendar :theme="calTheme" view="year" :show-legends="false" :show-keyboard-hint="false" />

        <!-- ── States ──────────────────────────────────────────── -->
        <h3 class="sp-sub">حالت‌ها: لودینگ / غیرفعال / فیلتر دسته‌بندی</h3>
        <KCalendar :theme="calTheme" :loading="true" />
        <KCalendar :theme="calTheme" :disabled="true" :show-keyboard-hint="false" />
        <KCalendar :theme="calTheme" :filter-categories="['meeting']" :show-keyboard-hint="false" />

        <!-- ── Composable ──────────────────────────────────────── -->
        <h3 class="sp-sub">خروجی موتور تقویم (calendarEngine)</h3>
        <div class="kc-card" dir="ltr">
            <div v-for="(v, k) in engineInfo" :key="k" class="kc-kv">
                <span class="kc-key">{{ k }}</span>
                <span class="kc-val">{{ v }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import KCalendar from '../../ui-kit/calendar/KCalendar.vue'
import { CALENDAR_THEMES, type CalendarTheme } from '../../ui-kit/calendar/types/theme'
import { getCurrentJalaliDate, toGregorian, toJalali, getJalaliMonthDays } from '../../ui-kit/calendar/core/calendarEngine'

const theme = inject<Ref<string>>('theme')!
const setTheme = inject<(t: string) => void>('setTheme')!

const kitThemes = ['light', 'dark', 'oled'] as const
const calThemes = CALENDAR_THEMES
const calTheme = ref<CalendarTheme>('light')
const themeQuery = ref('')

const filteredThemes = computed(() => {
    const q = themeQuery.value.trim().toLowerCase()
    return q ? calThemes.filter(t => t.includes(q)) : calThemes
})

const randomTheme = () => {
    calTheme.value = calThemes[Math.floor(Math.random() * calThemes.length)]
}

const selectedDate = ref('')
const selectedEvent = ref('')

const onSelectDate = (d: { jalali: string }) => { selectedDate.value = d.jalali }
const onSelectEvent = (e: { title: string }) => { selectedEvent.value = e.title }

// Prove the engine is standalone (no external date lib)
const today = getCurrentJalaliDate()
const g = toGregorian(today.year, today.month, today.day)
const back = toJalali(g)
const engineInfo = {
    'today (jalali)': `${today.year}/${today.month}/${today.day}`,
    'today (gregorian)': g.toISOString().slice(0, 10),
    'round-trip': `${back.year}/${back.month}/${back.day}`,
    'days in month': getJalaliMonthDays(today.year, today.month),
}
</script>

<style scoped>
.kc-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
.kc-chip {
    padding: 4px 12px;
    border: 1px solid var(--k-border);
    border-radius: 999px;
    background: var(--k-surface);
    color: var(--k-text-secondary);
    font-family: inherit;
    font-size: 0.72rem;
    cursor: pointer;
}
.kc-chip:hover {
    border-color: var(--k-border-focus);
    color: var(--k-text-primary);
}
.kc-chip.active {
    background: var(--k-primary);
    border-color: var(--k-primary);
    color: #fff;
}
.kc-search {
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-primary);
    font-family: inherit;
    font-size: 0.72rem;
    outline: none;
}
.kc-theme-box {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 150px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.kc-theme {
    padding: 2px 8px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: var(--k-bg);
    color: var(--k-text-muted);
    font-family: ui-monospace, monospace;
    font-size: 0.65rem;
    cursor: pointer;
}
.kc-theme:hover {
    color: var(--k-text-primary);
    border-color: var(--k-border);
}
.kc-theme.active {
    background: var(--k-primary);
    color: #fff;
    border-color: var(--k-primary);
}
.kc-card {
    padding: 10px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    font-size: 0.72rem;
}
.kc-kv {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 2px 0;
}
.kc-key {
    color: var(--k-text-muted);
}
.kc-val {
    color: var(--k-text-primary);
    font-family: ui-monospace, monospace;
}
</style>
