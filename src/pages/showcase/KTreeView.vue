<template>
    <div class="sp">
        <h2 class="sp-title">KTreeView</h2>

        <h3 class="sp-sub">پایه — همه بسته</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel1" :nodes="courses" @select="onSelect" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                انتخاب: {{ sel1 ?? '—' }} — آخرین select: {{ lastSelected ?? '—' }}
            </div>
        </div>

        <h3 class="sp-sub">با گره‌های باز‌شده از ابتدا</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel2" :nodes="courses" :default-expanded="['front', 'back']" />
        </div>

        <h3 class="sp-sub">با آیکون</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel3" :nodes="files" :default-expanded="['src']" />
        </div>

        <h3 class="sp-sub">با نشان (badge)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel4" :nodes="withBadges" :default-expanded="['inbox']" />
        </div>

        <h3 class="sp-sub">گره غیرفعال</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel5" :nodes="withDisabled" :default-expanded="['system']" />
        </div>

        <h3 class="sp-sub">سه سطح تودرتو</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeView v-model="sel6" :nodes="deep" :default-expanded="['l1', 'l2']" />
        </div>

        <h3 class="sp-sub">مرزی — یک گره و فهرست خالی</h3>
        <div class="sp-card" style="max-width: 460px; display: flex; flex-direction: column; gap: 24px;">
            <KTreeView v-model="sel7" :nodes="[{ id: 'solo', label: 'تنها گره' }]" />
            <KTreeView v-model="sel8" :nodes="[]" />
            <p class="sp-note">فهرست دوم خالی است.</p>
        </div>

        <h3 class="sp-sub">کاربردی — انتخاب درس در پنل مدرس</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTreeView v-model="lesson" :nodes="panels" :default-expanded="['panel1']" @select="onLesson" />
            <div v-if="activeLesson" class="sp-vmodel" style="margin-top: 14px;">
                درس فعال: {{ activeLesson }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, File, Folder, GraduationCap, Inbox, Layers, MessageSquare, Settings, Users } from 'lucide-vue-next'
import KTreeView from '../../ui-kit/components/KTreeView.vue'
import type { KTreeNodeData } from '../../ui-kit/components/KTreeView.vue'

const courses: KTreeNodeData[] = [
    {
        id: 'front',
        label: 'فرانت‌اند',
        children: [
            { id: 'vue', label: 'Vue 3' },
            { id: 'react', label: 'React' },
        ],
    },
    {
        id: 'back',
        label: 'بک‌اند',
        children: [
            { id: 'laravel', label: 'Laravel' },
            { id: 'node', label: 'Node.js' },
        ],
    },
    { id: 'design', label: 'طراحی رابط کاربری' },
]

const files: KTreeNodeData[] = [
    {
        id: 'src',
        label: 'src',
        icon: Folder,
        children: [
            {
                id: 'components',
                label: 'components',
                icon: Folder,
                children: [
                    { id: 'button', label: 'KButton.vue', icon: File },
                    { id: 'modal', label: 'KModal.vue', icon: File },
                ],
            },
            { id: 'main', label: 'main.ts', icon: File },
        ],
    },
    { id: 'readme', label: 'README.md', icon: File },
]

const withBadges: KTreeNodeData[] = [
    {
        id: 'inbox',
        label: 'صندوق پیام',
        icon: Inbox,
        children: [
            { id: 'unread', label: 'خوانده‌نشده', icon: MessageSquare, badge: 12 },
            { id: 'read', label: 'خوانده‌شده', icon: MessageSquare, badge: 148 },
        ],
    },
    { id: 'users', label: 'کاربران', icon: Users, badge: 240 },
]

const withDisabled: KTreeNodeData[] = [
    {
        id: 'system',
        label: 'تنظیمات سیستم',
        icon: Settings,
        children: [
            { id: 'general', label: 'عمومی' },
            { id: 'payment', label: 'درگاه پرداخت' },
            { id: 'billing', label: 'صورتحساب (فقط مالک)', disabled: true },
        ],
    },
    { id: 'archived', label: 'آرشیو (غیرفعال)', disabled: true },
]

const deep: KTreeNodeData[] = [
    {
        id: 'l1',
        label: 'سطح ۱',
        icon: Layers,
        children: [
            {
                id: 'l2',
                label: 'سطح ۲',
                children: [
                    { id: 'l3a', label: 'سطح ۳ — الف' },
                    { id: 'l3b', label: 'سطح ۳ — ب' },
                ],
            },
            { id: 'l2b', label: 'سطح ۲ — بدون فرزند' },
        ],
    },
]

const panels: KTreeNodeData[] = [
    {
        id: 'panel1',
        label: 'پنل ۱ — پایه‌ها',
        icon: BookOpen,
        children: [
            { id: 'p1l1', label: 'درس ۱ — الفبا' },
            { id: 'p1l2', label: 'درس ۲ — اعداد' },
            { id: 'p1l3', label: 'درس ۳ — سلام و احوال‌پرسی' },
        ],
    },
    {
        id: 'panel2',
        label: 'پنل ۲ — زمان‌ها',
        icon: GraduationCap,
        children: [
            { id: 'p2l1', label: 'درس ۱ — حال ساده' },
            { id: 'p2l2', label: 'درس ۲ — گذشته ساده' },
        ],
    },
]

const sel1 = ref<string | null>(null)
const sel2 = ref<string | null>('vue')
const sel3 = ref<string | null>(null)
const sel4 = ref<string | null>('unread')
const sel5 = ref<string | null>(null)
const sel6 = ref<string | null>(null)
const sel7 = ref<string | null>(null)
const sel8 = ref<string | null>(null)
const lesson = ref<string | null>(null)

const lastSelected = ref<string | null>(null)
const onSelect = (n: any) => { lastSelected.value = n.label }

const activeLesson = ref('')
const onLesson = (n: any) => { activeLesson.value = n.label }
</script>
