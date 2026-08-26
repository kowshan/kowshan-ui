<!-- pages/messages.vue — messages & notifications with alerts and badges -->
<template>
    <div class="msg-page">
        <div class="msg-header">
            <div>
                <h1>پیام‌ها</h1>
                <p>مدیریت اعلان‌ها و پیام‌های سیستم</p>
            </div>
        </div>

        <!-- Alerts section -->
        <div class="msg-section">
            <h2 class="msg-section-title">اعلان‌های فعال</h2>
            <div class="msg-alerts">
                <KAlert
                    v-for="alert in alerts"
                    :key="alert.id"
                    :variant="alert.variant"
                    :title="alert.title"
                    :description="alert.description"
                    :closable="true"
                />
            </div>
        </div>

        <!-- Messages with badges -->
        <div class="msg-section">
            <h2 class="msg-section-title">آخرین پیام‌ها</h2>
            <div class="msg-list">
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    class="msg-item"
                    :class="{ 'is-unread': !msg.read }"
                    @click="msg.read = true"
                >
                    <KAvatar :name="msg.sender" size="md" />
                    <div class="msg-item-body">
                        <div class="msg-item-top">
                            <span class="msg-item-sender">{{ msg.sender }}</span>
                            <span class="msg-item-time">{{ msg.time }}</span>
                        </div>
                        <div class="msg-item-subject">{{ msg.subject }}</div>
                        <div class="msg-item-preview">{{ msg.preview }}</div>
                    </div>
                    <div class="msg-item-meta">
                        <KBadge
                            v-if="!msg.read"
                            variant="primary"
                            size="sm"
                        >جدید</KBadge>
                        <KBadge
                            :variant="msg.priorityVariant"
                            size="sm"
                        >{{ msg.priorityLabel }}</KBadge>
                    </div>
                </div>
            </div>
        </div>

        <!-- Activity log -->
        <div class="msg-section">
            <h2 class="msg-section-title">گزارش فعالیت</h2>
            <div class="msg-card">
                <KTimeline :items="activityLog" />
            </div>
        </div>

        <!-- Empty state example -->
        <div class="msg-section">
            <h2 class="msg-section-title">پیام‌های آرشیو شده</h2>
            <div class="msg-card">
                <KEmptyState
                    title="پیامی وجود ندارد"
                    description="پیام‌های آرشیو شده اینجا نمایش داده می‌شوند"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import KAlert from '../ui-kit/components/KAlert.vue'
import KAvatar from '../ui-kit/components/KAvatar.vue'
import KBadge from '../ui-kit/components/KBadge.vue'
import KTimeline from '../ui-kit/components/KTimeline.vue'
import KEmptyState from '../ui-kit/components/KEmptyState.vue'

const alerts = reactive([
    { id: 1, variant: 'info' as const, title: 'نسخه جدید منتشر شد', description: 'کیت رابط کاربری نسخه ۲.۵ با قابلیت‌های جدید منتشر شد' },
    { id: 2, variant: 'warning' as const, title: 'نوبت تداخلی', description: 'دو نوبت همزمان در ساعت ۱۱:۰۰ ثبت شده — لطفاً بررسی کنید' },
    { id: 3, variant: 'success' as const, title: 'پشتیبان‌گیری انجام شد', description: 'نسخه پشتیبان پایگاه داده با موفقیت ذخیره شد' },
])

const messages = reactive([
    { id: 1, sender: 'علی رضایی', subject: 'نتیجه آزمایش سارا کریمی', preview: 'فایل PDF آزمایش خون کامل آماده است...', time: '۱۰ دقیقه پیش', read: false, priorityVariant: 'danger' as const, priorityLabel: 'فوری' },
    { id: 2, sender: 'سارا کریمی', subject: 'درخواست ویزیت مجدد', preview: 'خواستار ویزیت مجدد برای بررسی دارو هستم...', time: '۳۰ دقیقه پیش', read: false, priorityVariant: 'warning' as const, priorityLabel: 'مهم' },
    { id: 3, sender: 'محمد حسینی', subject: 'سوال درباره نسخه', preview: 'آیا می‌توانم دوز دارو را کاهش دهم؟', time: '۱ ساعت پیش', read: true, priorityVariant: 'neutral' as const, priorityLabel: 'عادی' },
    { id: 4, sender: 'زهرا نوری', subject: 'پیگیری آزمایش', preview: 'نتیجه آزمایش ادرار من آماده شده؟', time: '۲ ساعت پیش', read: true, priorityVariant: 'neutral' as const, priorityLabel: 'عادی' },
    { id: 5, sender: 'امیر کاظمی', subject: 'گزارش MRI', preview: 'فایل تصویری MRI ستون فقرات بارگذاری شد...', time: 'دیروز', read: true, priorityVariant: 'info' as const, priorityLabel: 'اطلاعاتی' },
])

const activityLog = [
    { time: '۱۰:۱۵', title: 'پیام جدید دریافت شد', description: 'از طرف علی رضایی — نتیجه آزمایش', color: 'info' },
    { time: '۰۹:۴۲', title: 'اعلان سیستم', description: 'نسخه پشتیبان جدید ذخیره شد', color: 'success' },
    { time: '۰۹:۱۰', title: 'پیام خوانده شد', description: 'پیام «سوال درباره نسخه» توسط دکتر احمدی خوانده شد', color: 'info' },
    { time: '۰۸:۳۰', title: 'هشدار امنیتی', description: 'تلاش ناموفق ورود با نام کاربری admin', color: 'danger' },
]
</script>

<style scoped>
.msg-page {
    /* max-width handled by layout */
}

.msg-header {
    margin-bottom: 24px;
}

.msg-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.msg-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

.msg-section {
    margin-bottom: 28px;
}

.msg-section-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--k-text-primary);
    margin: 0 0 14px;
}

/* Alerts */
.msg-alerts {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Message list */
.msg-list {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    overflow: hidden;
}

.msg-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    cursor: pointer;
    transition: background 0.12s ease;
}

.msg-item:last-child {
    border-bottom: none;
}

.msg-item:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

.msg-item.is-unread {
    background: color-mix(in srgb, var(--k-primary, #1db954) 3%, transparent);
}

.msg-item-body {
    flex: 1;
    min-width: 0;
}

.msg-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
}

.msg-item-sender {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary);
}

.msg-item-time {
    font-size: 0.66rem;
    color: var(--k-text-muted);
    flex-shrink: 0;
}

.msg-item-subject {
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--k-text-primary);
    margin-bottom: 2px;
}

.msg-item-preview {
    font-size: 0.7rem;
    color: var(--k-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.msg-item-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
    flex-shrink: 0;
}

/* Card */
.msg-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 20px;
}
</style>
