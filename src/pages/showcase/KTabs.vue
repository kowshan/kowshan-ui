<template>
    <div class="sp">
        <h2 class="sp-title">KTabs</h2>

        <h3 class="sp-sub">پایه — underline</h3>
        <div class="sp-card">
            <KTabs v-model="t1" :tabs="basic" @change="onChange">
                <p class="sp-note" style="margin: 0;">محتوای تب فعال: {{ t1 }}</p>
            </KTabs>
            <div class="sp-vmodel" style="margin-top: 14px;">آخرین change: {{ lastChange ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">pills</h3>
        <div class="sp-card">
            <KTabs v-model="t2" :tabs="basic" variant="pills">
                <p class="sp-note" style="margin: 0;">{{ t2 }}</p>
            </KTabs>
        </div>

        <h3 class="sp-sub">boxed</h3>
        <div class="sp-card">
            <KTabs v-model="t3" :tabs="basic" variant="boxed">
                <p class="sp-note" style="margin: 0;">{{ t3 }}</p>
            </KTabs>
        </div>

        <h3 class="sp-sub">اندازه‌ها (sm / md / lg)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 24px;">
            <KTabs v-model="t4" :tabs="basic" size="sm" />
            <KTabs v-model="t4" :tabs="basic" size="md" variant="pills" />
            <KTabs v-model="t4" :tabs="basic" size="lg" variant="boxed" />
        </div>

        <h3 class="sp-sub">با آیکون</h3>
        <div class="sp-card">
            <KTabs v-model="t5" :tabs="iconTabs" />
        </div>

        <h3 class="sp-sub">با شمارنده</h3>
        <div class="sp-card">
            <KTabs v-model="t6" :tabs="countTabs" variant="pills" />
        </div>

        <h3 class="sp-sub">تب غیرفعال و شمارنده صفر</h3>
        <div class="sp-card">
            <KTabs v-model="t7" :tabs="disabledTabs" variant="boxed" />
        </div>

        <h3 class="sp-sub">بدون محتوا (فقط نوار تب)</h3>
        <div class="sp-card">
            <KTabs v-model="t8" :tabs="basic" />
        </div>

        <h3 class="sp-sub">۵ تب + محتوای واقعی</h3>
        <div class="sp-card">
            <KTabs v-model="t9" :tabs="courseTabs" variant="pills">
                <div style="padding-top: 6px;">
                    <p v-if="t9 === 'desc'" style="margin: 0; font-size: 0.85rem;">
                        این دوره برای زبان‌آموزان سطح A2 مناسب است و روی مکالمه تمرکز دارد.
                    </p>
                    <p v-else-if="t9 === 'syllabus'" style="margin: 0; font-size: 0.85rem;">
                        ۱۲ جلسه — هر جلسه ۹۰ دقیقه، شامل تمرین شنیداری و کار گروهی.
                    </p>
                    <p v-else-if="t9 === 'teacher'" style="margin: 0; font-size: 0.85rem;">
                        مدرس: سارا محمدی — ۸ سال سابقه تدریس، دارای مدرک CELTA.
                    </p>
                    <p v-else-if="t9 === 'reviews'" style="margin: 0; font-size: 0.85rem;">
                        میانگین امتیاز ۴.۷ از ۵ بر پایه ۲۱۴ نظر.
                    </p>
                    <p v-else style="margin: 0; font-size: 0.85rem;">
                        شهریه ۱٬۲۹۰٬۰۰۰ تومان — قابل پرداخت در ۳ قسط.
                    </p>
                </div>
            </KTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, BookOpen, MessageSquare, Star, Users, Wallet } from 'lucide-vue-next'
import KTabs from '../../ui-kit/components/KTabs.vue'
import type { KTabItem } from '../../ui-kit/components/KTabs.vue'

const basic: KTabItem[] = [
    { id: 'all', label: 'همه' },
    { id: 'active', label: 'فعال' },
    { id: 'archived', label: 'بایگانی' },
]

const iconTabs: KTabItem[] = [
    { id: 'overview', label: 'نمای کل', icon: BarChart3 },
    { id: 'courses', label: 'دوره‌ها', icon: BookOpen },
    { id: 'students', label: 'دانش‌آموزان', icon: Users },
    { id: 'finance', label: 'مالی', icon: Wallet },
]

const countTabs: KTabItem[] = [
    { id: 'pending', label: 'در انتظار', count: 12 },
    { id: 'paid', label: 'پرداخت‌شده', count: 148 },
    { id: 'failed', label: 'ناموفق', count: 3 },
]

const disabledTabs: KTabItem[] = [
    { id: 'comments', label: 'نظرات', icon: MessageSquare, count: 24 },
    { id: 'reviews', label: 'امتیازها', icon: Star, count: 0 },
    { id: 'archive', label: 'آرشیو', count: 8, disabled: true },
]

const courseTabs: KTabItem[] = [
    { id: 'desc', label: 'توضیحات' },
    { id: 'syllabus', label: 'سرفصل‌ها' },
    { id: 'teacher', label: 'مدرس' },
    { id: 'reviews', label: 'نظرات', count: 214 },
    { id: 'price', label: 'شهریه' },
]

const t1 = ref('all')
const t2 = ref('active')
const t3 = ref('archived')
const t4 = ref('all')
const t5 = ref('courses')
const t6 = ref('paid')
const t7 = ref('comments')
const t8 = ref('all')
const t9 = ref('desc')

const lastChange = ref<string | null>(null)
const onChange = (v: string) => { lastChange.value = v }
</script>
