<template>
    <div class="sp">
        <h2 class="sp-title">KPermissionTree</h2>

        <h3 class="sp-sub">پنل مدیر — انتخاب همه</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KPermissionTree v-model="perms1" :nodes="panelNodes" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                {{ perms1.length }} دسترسی انتخاب شده
            </div>
        </div>

        <h3 class="sp-sub">بدون «انتخاب همه» و با برچسب سفارشی</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KPermissionTree
                v-model="perms2"
                :nodes="panelNodes"
                :select-all="false"
            />
        </div>

        <h3 class="sp-sub">خوشه‌های غیرفعال (نقش پایه)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KPermissionTree v-model="perms3" :nodes="lockedNodes" select-all-label="همه دسترسی‌ها" />
        </div>

        <h3 class="sp-sub">فهرست خالی</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KPermissionTree v-model="perms4" :nodes="[]" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">perms1: {{ perms1.join(', ') || '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPermissionTree from '../../ui-kit/components/KPermissionTree.vue'
import type { KPermissionNode } from '../../ui-kit/components/KPermissionTree.vue'

const panelNodes: KPermissionNode[] = [
    {
        id: 'courses',
        label: 'دوره‌ها',
        hint: 'مدیریت محتوا',
        children: [
            { id: 'courses.view', label: 'مشاهده دوره‌ها' },
            { id: 'courses.create', label: 'ایجاد دوره' },
            { id: 'courses.edit', label: 'ویرایش دوره' },
            { id: 'courses.delete', label: 'حذف دوره' },
        ],
    },
    {
        id: 'users',
        label: 'کاربران',
        children: [
            { id: 'users.view', label: 'مشاهده کاربران' },
            { id: 'users.ban', label: 'مسدود کردن' },
        ],
    },
    {
        id: 'finance',
        label: 'مالی',
        children: [
            { id: 'finance.view', label: 'گزارش‌های مالی' },
            { id: 'finance.refund', label: 'بازگشت وجه' },
        ],
    },
]

const lockedNodes: KPermissionNode[] = [
    {
        id: 'profile',
        label: 'پروفایل شخصی',
        disabled: true,
        children: [
            { id: 'profile.edit', label: 'ویرایش پروفایل' },
            { id: 'profile.password', label: 'تغییر رمز عبور' },
        ],
    },
    {
        id: 'support',
        label: 'پشتیبانی',
        children: [
            { id: 'support.ticket', label: 'تیکت‌ها' },
            { id: 'support.chat', label: 'گفتگوی زنده', disabled: true },
        ],
    },
]

const perms1 = ref<string[]>(['courses.view', 'users.view'])
const perms2 = ref<string[]>([])
const perms3 = ref<string[]>(['profile.edit', 'profile.password', 'profile', 'support.ticket'])
const perms4 = ref<string[]>([])
</script>
