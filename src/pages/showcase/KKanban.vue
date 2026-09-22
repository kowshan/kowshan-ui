<template>
    <div class="sp">
        <h2 class="sp-title">KKanban</h2>

        <h3 class="sp-sub">بورد کامل (جابه‌جایی با کشیدن، افزودن کارت)</h3>
        <KKanban
            v-model="board"
            @move="onMove"
            @add="onAdd"
            @card-click="onCardClick"
            @card-menu="onCardMenu"
        />
        <div class="sp-vmodel" style="margin-top: 12px;">
            move: {{ lastMove }} · add: {{ lastAdd }} · cardClick: {{ lastClick }} · cardMenu: {{ lastMenu }}
        </div>

        <h3 class="sp-sub">بدون افزودن (addable = false)</h3>
        <KKanban v-model="simple" :addable="false" @card-click="onCardClick" />

        <h3 class="sp-sub">بورد پرسیاه‌و‌سفید (بدون رنگ ستون‌ها)</h3>
        <KKanban v-model="plain" :addable="false" />

        <h3 class="sp-sub">وضعیت برد (برای دیباگ)</h3>
        <div class="sp-card">
            <div v-for="col in board" :key="col.id" class="kb-row">
                <strong>{{ col.title }}</strong>
                <span class="sp-vmodel">{{ col.items.length }} کارت</span>
                <span class="sp-vmodel">— {{ col.items.map(i => i.title).join('، ') || 'خالی' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KKanban, { type KKanbanColumn } from '../../ui-kit/components/KKanban.vue'

const lastMove = ref('—')
const lastAdd = ref('—')
const lastClick = ref('—')
const lastMenu = ref('—')

const board = ref<KKanbanColumn[]>([
    {
        id: 'todo',
        title: 'برای انجام',
        color: '#3b82f6',
        items: [
            { id: 't1', title: 'طراحی صفحه دوره‌ها', subtitle: 'آکادمی کِی', label: 'طراحی', labelColor: '#8B5CF6', assignee: 'مریم احمدی', amount: '۱۲ ساعت', due: '1405/07/02' },
            { id: 't2', title: 'نوشتن مستندات API', label: 'مستندات', labelColor: '#0ea5e9', assignee: 'علی رضایی', due: '1405/07/05' },
        ],
    },
    {
        id: 'doing',
        title: 'در حال انجام',
        color: '#f59e0b',
        items: [
            { id: 'd1', title: 'پیاده‌سازی پرداخت', subtitle: 'فروشگاه', label: 'بک‌اند', labelColor: '#22c55e', assignee: 'حسین کریمی', amount: '۴۸ میلیون', due: '1405/06/29', late: true },
        ],
    },
    {
        id: 'review',
        title: 'بازبینی',
        color: '#8B5CF6',
        items: [
            { id: 'r1', title: 'تست ریسپانسیو داشبورد', label: 'تست', labelColor: '#ef4444', assignee: 'سارا نوری' },
        ],
    },
    { id: 'done', title: 'انجام‌شده', color: '#22c55e', items: [] },
])

const simple = ref<KKanbanColumn[]>([
    { id: 'a', title: 'بک‌لاگ', items: [{ id: 'a1', title: 'افزودن حالت آفلاین' }, { id: 'a2', title: 'بهبود سرعت بارگذاری' }] },
    { id: 'b', title: 'انجام‌شده', items: [{ id: 'b1', title: 'راه‌اندازی CI' }] },
])

const plain = ref<KKanbanColumn[]>([
    { id: 'p1', title: 'صندوق ورودی', items: [{ id: 'p1a', title: 'پیام از پشتیبانی' }] },
    { id: 'p2', title: 'آرشیو', items: [] },
])

const onMove = (p: { item: { title: string }; from: string; to: string; index: number }) => {
    lastMove.value = `${p.item.title} → ${p.to} (جایگاه ${p.index + 1})`
}
const onAdd = (col: KKanbanColumn) => { lastAdd.value = `«${col.title}»` }
const onCardClick = (item: { title: string }) => { lastClick.value = item.title }
const onCardMenu = (item: { title: string }) => { lastMenu.value = item.title }
</script>

<style scoped>
.kb-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 8px 0; border-bottom: 1px solid var(--k-border); font-size: 0.8rem;
}
.kb-row:last-child { border-bottom: none; }
</style>
