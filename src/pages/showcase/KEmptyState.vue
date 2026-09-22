<template>
    <div class="sp">
        <h2 class="sp-title">KEmptyState</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="empty-box">
            <KEmptyState
                :icon="Inbox"
                title="چیزی اینجا نیست"
                description="هنوز داده‌ای برای نمایش وجود ندارد."
            />
        </div>

        <h3 class="sp-sub">جستجوی بی‌نتیجه</h3>
        <div class="empty-box">
            <KEmptyState
                :icon="SearchX"
                title="نتیجه‌ای پیدا نشد"
                description="عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید."
            />
        </div>

        <h3 class="sp-sub">خطای شبکه</h3>
        <div class="empty-box">
            <KEmptyState
                :icon="WifiOff"
                title="اتصال برقرار نشد"
                description="اتصال اینترنت را بررسی کرده و دوباره تلاش کنید."
            />
        </div>

        <h3 class="sp-sub">مورد اول (onboarding)</h3>
        <div class="empty-box">
            <KEmptyState
                :icon="FolderPlus"
                title="اولین پروژه‌ات را بساز"
                description="با ساخت اولین پروژه شروع کن؛ بعداً می‌توانی همکاران را دعوت کنی."
            />
        </div>

        <h3 class="sp-sub">فقط آیکون</h3>
        <div class="empty-box">
            <KEmptyState :icon="Ghost" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KEmptyState from '../../ui-kit/components/KEmptyState.vue'
import { Inbox, SearchX, WifiOff, FolderPlus, Ghost } from 'lucide-vue-next'
</script>

<style scoped>
.empty-box {
    border: 1px dashed var(--k-border);
    border-radius: 12px;
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
