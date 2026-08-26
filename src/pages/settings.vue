<!-- pages/settings.vue — settings page with calendar theme + preferences -->
<template>
    <div class="settings-page">
        <div class="settings-header">
            <h1>تنظیمات</h1>
            <p>پوسته تقویم، اعلان‌ها و تنظیمات عمومی</p>
        </div>

        <!-- Calendar theme -->
        <div class="settings-card">
            <h3 class="settings-card-title">
                <Palette :size="18" />
                پوسته تقویم
            </h3>
            <p class="settings-card-desc">ظاهر تقویم نوبت‌دهی را سفارشی کنید</p>
            <div class="settings-themes">
                <button
                    v-for="t in calendarThemes"
                    :key="t.id"
                    type="button"
                    class="settings-theme-btn"
                    :class="{ 'is-active': calTheme === t.id }"
                    @click="setCalTheme(t.id)"
                >
                    <div class="settings-theme-preview" :class="`preview-${t.id}`" />
                    <span class="settings-theme-name">{{ t.label }}</span>
                </button>
            </div>
        </div>

        <!-- Notification preferences -->
        <div class="settings-card">
            <h3 class="settings-card-title">
                <Bell :size="18" />
                اعلان‌ها
            </h3>
            <p class="settings-card-desc">مدیریت نحوه دریافت اعلان‌ها</p>
            <div class="settings-toggles">
                <div v-for="n in notifications" :key="n.key" class="settings-toggle">
                    <div class="settings-toggle-info">
                        <div class="settings-toggle-title">{{ n.title }}</div>
                        <div class="settings-toggle-desc">{{ n.desc }}</div>
                    </div>
                    <button
                        type="button"
                        class="settings-switch"
                        :class="{ 'is-on': n.enabled }"
                        @click="n.enabled = !n.enabled"
                    >
                        <span class="settings-switch-knob" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Display options -->
        <div class="settings-card">
            <h3 class="settings-card-title">
                <Monitor :size="18" />
                نمایش
            </h3>
            <p class="settings-card-desc">تنظیمات ظاهری داشبورد</p>
            <div class="settings-options">
                <div class="settings-option">
                    <label class="settings-option-label">زبان تاریخ</label>
                    <KSelect
                        v-model="dateLang"
                        :options="dateLangOptions"
                        placeholder="انتخاب زبان"
                        style="max-width: 200px"
                    />
                </div>
                <div class="settings-option">
                    <label class="settings-option-label">قالب ساعت</label>
                    <KSelect
                        v-model="timeFormat"
                        :options="timeFormatOptions"
                        placeholder="انتخاب قالب"
                        style="max-width: 200px"
                    />
                </div>
                <div class="settings-option">
                    <label class="settings-option-label">تعداد ردیف تقویم</label>
                    <KSelect
                        v-model="calRows"
                        :options="calRowOptions"
                        placeholder="انتخاب تعداد"
                        style="max-width: 200px"
                    />
                </div>
            </div>
        </div>

        <!-- Danger zone -->
        <div class="settings-card settings-card-danger">
            <h3 class="settings-card-title">
                <AlertTriangle :size="18" />
                منطقه خطر
            </h3>
            <div class="settings-danger-row">
                <div>
                    <div class="settings-toggle-title">بازنشانی تنظیمات</div>
                    <div class="settings-toggle-desc">بازگشت به تنظیمات پیش‌فرض</div>
                </div>
                <KButton
                    text="بازنشانی"
                    bg-color="#fee2e2"
                    text-color="#dc2626"
                    @click="resetSettings"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from '../ui-kit/composables/useToast'
import { Palette, Bell, Monitor, AlertTriangle } from 'lucide-vue-next'
import KSelect from '../ui-kit/wrappers/KSelect.vue'
import KButton from '../ui-kit/components/KButton.vue'

// ── Calendar theme ──
const STORAGE_KEY = 'k-cal-theme'
const calTheme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

const calendarThemes = [
    { id: 'light', label: 'روشن' },
    { id: 'dark', label: 'تیره' },
    { id: 'emerald', label: 'زمرد' },
    { id: 'ocean', label: 'اقیانوس' },
    { id: 'royal', label: 'سلطنتی' },
    { id: 'midnight', label: 'نیمه‌شب' },
    { id: 'sunset', label: 'غروب' },
    { id: 'modern', label: 'مدرن' },
    { id: 'forest', label: 'جنگل' },
    { id: 'desert', label: 'بیابان' },
]

const setCalTheme = (id: string) => {
    calTheme.value = id
    localStorage.setItem(STORAGE_KEY, id)
}

// ── Notifications ──
const notifications = reactive([
    { key: 'new-apt', title: 'نوبت جدید', desc: 'وقتی بیمار نوبت جدیدی ثبت کند', enabled: true },
    { key: 'lab-result', title: 'نتیجه آزمایش', desc: 'آماده شدن نتایج آزمایش بیماران', enabled: true },
    { key: 'reminder', title: 'یادآوری نوبت', desc: '۱۵ دقیقه قبل از شروع نوبت', enabled: true },
    { key: 'conflict', title: 'تداخل نوبت', desc: 'وقتی دو نوبت همزمان باشند', enabled: true },
    { key: 'system', title: 'اعلان سیستم', desc: 'به‌روزرسانی و نگهداری سیستم', enabled: false },
    { key: 'marketing', title: 'اخبار و تخفیف', desc: 'پیشنهادات ویژه و به‌روزرسانی‌ها', enabled: false },
])

// ── Display options ──
const dateLang = ref('jalali')
const dateLangOptions = [
    { value: 'jalali', label: 'شمسی (جلالی)' },
    { value: 'gregorian', label: 'میلادی (گریگوری)' },
]

const timeFormat = ref('24h')
const timeFormatOptions = [
    { value: '24h', label: '۲۴ ساعته' },
    { value: '12h', label: '۱۲ ساعته (AM/PM)' },
]

const calRows = ref('6')
const calRowOptions = [
    { value: '5', label: '۵ ردیف' },
    { value: '6', label: '۶ ردیف' },
]

const resetSettings = () => {
    calTheme.value = 'light'
    localStorage.setItem(STORAGE_KEY, 'light')
    dateLang.value = 'jalali'
    timeFormat.value = '24h'
    calRows.value = '6'
    notifications.forEach(n => { n.enabled = n.key !== 'system' })
    useToast.success('تنظیمات به حالت پیش‌فرض بازگشت')
}
</script>

<style scoped>
.settings-page {
    /* max-width handled by layout */
}

.settings-header {
    margin-bottom: 24px;
}

.settings-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.settings-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

/* Card */
.settings-card {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 16px;
}

.settings-card-danger {
    border-color: color-mix(in srgb, #ef4444 30%, var(--k-border, #e2e8f0));
}

.settings-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 4px;
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.settings-card-desc {
    font-size: 0.72rem;
    color: var(--k-text-muted);
    margin: 0 0 20px;
}

/* Theme grid */
.settings-themes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
}

.settings-theme-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    border: 2px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    background: var(--k-bg, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
}

.settings-theme-btn:hover {
    border-color: var(--k-primary, #1db954);
}

.settings-theme-btn.is-active {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 6%, transparent));
}

.settings-theme-preview {
    width: 48px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.preview-light { background: linear-gradient(135deg, #f8fafc, #e2e8f0); }
.preview-dark { background: linear-gradient(135deg, #1e293b, #0f172a); }
.preview-emerald { background: linear-gradient(135deg, #059669, #10b981); }
.preview-ocean { background: linear-gradient(135deg, #0369a1, #38bdf8); }
.preview-royal { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
.preview-midnight { background: linear-gradient(135deg, #1e1b4b, #312e81); }
.preview-sunset { background: linear-gradient(135deg, #ea580c, #f59e0b); }
.preview-modern { background: linear-gradient(135deg, #334155, #64748b); }
.preview-forest { background: linear-gradient(135deg, #166534, #4ade80); }
.preview-desert { background: linear-gradient(135deg, #92400e, #d97706); }

.settings-theme-name {
    font-size: 0.66rem;
    font-weight: 700;
    color: var(--k-text-secondary);
}

/* Toggles */
.settings-toggles {
    display: flex;
    flex-direction: column;
}

.settings-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.settings-toggle:last-child {
    border-bottom: none;
}

.settings-toggle-info {
    flex: 1;
    min-width: 0;
}

.settings-toggle-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary);
}

.settings-toggle-desc {
    font-size: 0.68rem;
    color: var(--k-text-muted);
}

/* Switch */
.settings-switch {
    width: 42px;
    height: 24px;
    border-radius: 12px;
    border: none;
    background: var(--k-surface-hover, #e2e8f0);
    cursor: pointer;
    position: relative;
    transition: background 0.2s ease;
    flex-shrink: 0;
}

.settings-switch.is-on {
    background: var(--k-primary, #1db954);
}

.settings-switch-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease;
}

.settings-switch.is-on .settings-switch-knob {
    transform: translateX(18px);
}

/* Options */
.settings-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.settings-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.settings-option-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary);
}

/* Danger zone */
.settings-danger-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
</style>
