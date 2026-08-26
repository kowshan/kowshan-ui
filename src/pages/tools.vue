<!-- pages/tools.vue — CRM tools: signature, import, color picker, countdown -->
<template>
    <div class="tools-page">
        <div class="tools-header">
            <div>
                <h1>ابزارهای CRM</h1>
                <p>امضای دیجیتال، ورود داده، انتخاب رگه و شمارش معکوس</p>
            </div>
        </div>

        <!-- Signature + Color picker row -->
        <div class="tools-grid">
            <div class="tools-card">
                <h3 class="tools-card-title">
                    <PenTool :size="16" />
                    امضای دیجیتال
                </h3>
                <p class="tools-card-desc">برای نسخه‌ها و فرم‌های رضایت‌نامه</p>
                <KSignaturePad
                    v-model="signature"
                    :height="160"
                    placeholder="امضای خود را اینجا بکشید..."
                />
            </div>

            <div class="tools-card">
                <h3 class="tools-card-title">
                    <Palette :size="16" />
                    انتخاب رنگ پوسته
                </h3>
                <p class="tools-card-desc">سفارشی‌سازی رنگ اصلی داشبورد</p>
                <div class="tools-color-row">
                    <KColorPicker v-model="themeColor" />
                    <div class="tools-color-preview" :style="{ background: themeColor }" />
                </div>
                <div class="tools-color-hex">کد رنگ: {{ themeColor }}</div>
            </div>
        </div>

        <!-- Import wizard -->
        <div class="tools-card" style="margin-bottom: 22px">
            <h3 class="tools-card-title">
                <Upload :size="16" />
                ورود داده بیماران
            </h3>
            <p class="tools-card-desc">وارد کردن اطلاعات بیماران از فایل CSV</p>
            <KImportWizard
                :fields="importFields"
                :initial-text="sampleCsv"
                @imported="onImported"
                @skipped="onSkipped"
            />
        </div>

        <!-- Countdown -->
        <div class="tools-grid">
            <div class="tools-card">
                <h3 class="tools-card-title">
                    <Timer :size="16" />
                    شمارش معکوس
                </h3>
                <p class="tools-card-desc">زمان باقی‌مانده تا پایان تخفیف دوره‌ها</p>
                <div class="tools-countdown-wrap">
                    <KCountdownTimer
                        :target="countdownTarget"
                        label="پایان تخفیف:"
                        :show-days="true"
                        ended-text="تخفیف تمام شد!"
                    />
                </div>
            </div>

            <div class="tools-card">
                <h3 class="tools-card-title">
                    <ClipboardList :size="16" />
                    نتیجه ورود داده
                </h3>
                <p class="tools-card-desc">آخرین عملیات ورود اطلاعات</p>
                <div v-if="importResult" class="tools-import-result">
                    <div class="tools-result-row">
                        <span class="tools-result-label">ردیف وارد شده:</span>
                        <span class="tools-result-value is-success">{{ faNum(importResult.count) }}</span>
                    </div>
                    <div class="tools-result-row">
                        <span class="tools-result-label">ردیف نادیده شده:</span>
                        <span class="tools-result-value is-warning">{{ faNum(importResult.skipped) }}</span>
                    </div>
                    <div class="tools-result-row">
                        <span class="tools-result-label">زمان:</span>
                        <span class="tools-result-value">{{ importResult.time }}</span>
                    </div>
                </div>
                <div v-else class="tools-empty">
                    <Clock :size="32" />
                    <span>هنوز عملیاتی انجام نشده</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PenTool, Palette, Upload, Timer, ClipboardList, Clock } from 'lucide-vue-next'
import KSignaturePad from '../ui-kit/components/KSignaturePad.vue'
import KColorPicker from '../ui-kit/components/KColorPicker.vue'
import KImportWizard from '../ui-kit/components/KImportWizard.vue'
import type { KImportField } from '../ui-kit/components/KImportWizard.vue'
import KCountdownTimer from '../ui-kit/components/KCountdownTimer.vue'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

const signature = ref<string | null>(null)
const themeColor = ref('#1db954')

// Countdown target: 7 days from now
const countdownTarget = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

const importFields: KImportField[] = [
    { key: 'name', label: 'نام بیمار' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'city', label: 'شهر' },
    { key: 'age', label: 'سن' },
]

const sampleCsv = `نام بیمار,شماره تماس,شهر,سن
علی رضایی,09121234567,تهران,45
سارا کریمی,09131234567,اصفهان,29
محمد حسینی,09141234567,شیراز,52
زهرا نوری,09151234567,تبریز,61`

const importResult = ref<{ count: number; skipped: number; time: string } | null>(null)

const onImported = (rows: Record<string, any>[]) => {
    importResult.value = {
        count: rows.length,
        skipped: 0,
        time: new Date().toLocaleTimeString('fa-IR'),
    }
}

const onSkipped = (count: number) => {
    if (importResult.value) {
        importResult.value.skipped = count
    }
}
</script>

<style scoped>
.tools-page {
    /* max-width handled by layout */
}

.tools-header {
    margin-bottom: 24px;
}

.tools-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.tools-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

.tools-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 22px;
}

.tools-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px;
}

.tools-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.tools-card-desc {
    font-size: 0.7rem;
    color: var(--k-text-muted);
    margin: 0 0 16px;
}

/* Color picker */
.tools-color-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
}

.tools-color-preview {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}

.tools-color-hex {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--k-text-secondary);
    font-family: monospace;
    direction: ltr;
}

/* Countdown */
.tools-countdown-wrap {
    display: flex;
    justify-content: center;
    padding: 16px 0;
}

/* Import result */
.tools-import-result {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tools-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.tools-result-row:last-child {
    border-bottom: none;
}

.tools-result-label {
    font-size: 0.78rem;
    color: var(--k-text-secondary);
}

.tools-result-value {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.tools-result-value.is-success {
    color: #10b981;
}

.tools-result-value.is-warning {
    color: #f59e0b;
}

.tools-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    color: var(--k-text-muted);
    font-size: 0.76rem;
}

@media (max-width: 768px) {
    .tools-grid {
        grid-template-columns: 1fr;
    }
}
</style>
