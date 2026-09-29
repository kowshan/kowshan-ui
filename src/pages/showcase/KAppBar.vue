<template>
    <div class="sp">
        <h2 class="sp-title">KAppBar</h2>

        <h3 class="sp-sub">ساده</h3>
        <KAppBar title="نوار ابزار" />

        <h3 class="sp-sub">با اکشن‌ها و بج</h3>
        <KAppBar title="اعلان‌ها" :actions="actions" @action="onAction" />

        <h3 class="sp-sub">اکشن خطرناک — variant: 'danger'</h3>
        <KAppBar title="مدیریت کاربران" :actions="dangerActions" @action="onAction" />

        <h3 class="sp-sub">با اسلات جستجو</h3>
        <KAppBar title="جستجوی پیشرفته">
            <template #search>
                <KSearchInput placeholder="جستجو..." />
            </template>
        </KAppBar>

        <h3 class="sp-sub">با آواتار</h3>
        <KAppBar title="پروفایل" :actions="actions" @action="onAction">
            <template #avatar>
                <KAvatar name="سارا محمدی" size="sm" />
            </template>
        </KAppBar>
    </div>
</template>

<script setup lang="ts">
import { Bell, Github, Home, LogOut } from 'lucide-vue-next'
import KAppBar from '../../ui-kit/components/KAppBar.vue'
import KAvatar from '../../ui-kit/components/KAvatar.vue'
import KSearchInput from '../../ui-kit/components/KSearchInput.vue'
import { useKToast } from '../../ui-kit/composables/useKToast'

const actions = [
    { id: 'home', icon: Home, label: 'صفحهٔ اصلی' },
    { id: 'github', icon: Github, label: 'مخزن' },
    { id: 'bell', icon: Bell, label: 'اعلان‌ها', badge: 4 },
]

/* `variant` colours a single action — for anything destructive sitting next to
   ordinary ones (log out, delete, revoke). */
const dangerActions = [
    { id: 'bell', icon: Bell, label: 'اعلان‌ها', badge: true },
    { id: 'logout', icon: LogOut, label: 'خروج', variant: 'danger' as const },
]

const onAction = (id: string) => useKToast.info(`اکشن: ${id}`)
</script>
