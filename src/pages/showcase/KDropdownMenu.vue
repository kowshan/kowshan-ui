<template>
    <div class="sp">
        <h2 class="sp-title">KDropdownMenu</h2>

        <h3 class="sp-sub">پایه (تراز end)</h3>
        <KDropdownMenu :items="items" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="منوی کاربر" @click="toggle" />
            </template>
        </KDropdownMenu>

        <h3 class="sp-sub">تراز start</h3>
        <KDropdownMenu :items="items" align="start" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="تراز شروع" @click="toggle" />
            </template>
        </KDropdownMenu>

        <h3 class="sp-sub">باز شدن به بالا (dir=up)</h3>
        <KDropdownMenu :items="items" dir="up" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="باز شدن به بالا" @click="toggle" />
            </template>
        </KDropdownMenu>

        <h3 class="sp-sub">با آیکون و میان‌بر</h3>
        <KDropdownMenu :items="richItems" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="منوی کامل" @click="toggle" />
            </template>
        </KDropdownMenu>

        <h3 class="sp-sub">بدون بستن پس از انتخاب</h3>
        <KDropdownMenu :items="toggleItems" :close-on-select="false" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="چند انتخابی" @click="toggle" />
            </template>
        </KDropdownMenu>

        <h3 class="sp-sub">عرض ثابت</h3>
        <KDropdownMenu :items="items" width="240px" @select="onSelect">
            <template #trigger="{ toggle }">
                <KButton text="عرض ۲۴۰px" @click="toggle" />
            </template>
        </KDropdownMenu>

        <p class="sp-note">آخرین انتخاب: {{ selected || '—' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDropdownMenu from '../../ui-kit/components/KDropdownMenu.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { User, Settings, LogOut, Copy, Trash2 } from 'lucide-vue-next'

const selected = ref('')

const items = [
    { label: 'پروفایل' },
    { label: 'تنظیمات' },
    'divider' as const,
    { label: 'خروج', danger: true },
]

const richItems = [
    { label: 'پروفایل کاربر', icon: User, shortcut: '⌘P' },
    { label: 'تنظیمات', icon: Settings, shortcut: '⌘,' },
    { label: 'کپی لینک', icon: Copy },
    'divider' as const,
    { label: 'حذف', icon: Trash2, danger: true },
    { label: 'غیرفعال', disabled: true },
]

const toggleItems = [
    { label: 'نمایش ستون‌ها' },
    { label: 'نمایش فیلترها' },
    { label: 'نمایش ردیف‌ها' },
]

const onSelect = (item: { label: string }) => {
    selected.value = item.label
}
</script>
