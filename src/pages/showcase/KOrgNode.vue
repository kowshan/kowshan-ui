<template>
    <div class="sp">
        <h2 class="sp-title">KOrgNode</h2>
        <p class="sp-note">
            گره بازگشتی چارت سازمانی — داخل <code>KOrgChart</code> استفاده می‌شود، اما مستقیم هم قابل رندر است.
            پروپ‌ها: <code>node</code> و <code>depth</code> (پیش‌فرض ۰).
        </p>

        <h3 class="sp-sub">گره ریشه (depth = 0)</h3>
        <div class="sp-card">
            <KOrgNode :node="leafNode" :depth="0" @select="onSelect" />
        </div>

        <h3 class="sp-sub">سطح ۱ و ۲ (تورفتگی بیشتر)</h3>
        <div class="sp-card">
            <KOrgNode :node="leafNode" :depth="1" @select="onSelect" />
        </div>
        <div class="sp-card" style="margin-top: 10px;">
            <KOrgNode :node="leafNode" :depth="2" @select="onSelect" />
        </div>

        <h3 class="sp-sub">با آواتار و بج</h3>
        <div class="sp-card">
            <KOrgNode :node="richNode" :depth="0" @select="onSelect" />
        </div>

        <h3 class="sp-sub">گره دارای فرزند (کل زیردرخت رندر می‌شود)</h3>
        <div class="sp-card">
            <KOrgNode :node="parentNode" :depth="0" @select="onSelect" />
        </div>

        <h3 class="sp-sub">کنار هم — مقایسه عمق‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 12px;">
            <KOrgNode v-for="d in [0, 1, 2, 3]" :key="d" :node="{ id: d, name: `نود سطح ${d}`, role: 'کارشناس' }" :depth="d" @select="onSelect" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">select: {{ selected }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KOrgNode from '../../ui-kit/components/KOrgNode.vue'
import type { KOrgNodeData } from '../../ui-kit/components/KOrgChart.vue'

const selected = ref('—')
const onSelect = (n: KOrgNodeData) => { selected.value = n.name }

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='48' height='48' rx='24' fill='url(%23g)'/><text x='24' y='31' font-size='20' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const leafNode: KOrgNodeData = { id: 'l1', name: 'علی رضایی', role: 'مدیر فنی' }

const richNode: KOrgNodeData = {
    id: 'r1',
    name: 'مریم احمدی',
    role: 'مدیر محصول',
    avatar: avatar('8B5CF6', 'ec4899', 'م'),
    badge: 'مدیر',
    badgeColor: '#8B5CF6',
}

const parentNode: KOrgNodeData = {
    id: 'p1',
    name: 'واحد فنی',
    role: '۴ نفر',
    badge: 'فعال',
    badgeColor: '#22c55e',
    children: [
        { id: 'p2', name: 'توسعه‌دهنده فرانت‌اند', role: 'تمام‌وقت' },
        { id: 'p3', name: 'توسعه‌دهنده بک‌اند', role: 'تمام‌وقت' },
        { id: 'p4', name: 'مهندس DevOps', role: 'پیمانکاری', badge: 'جدید', badgeColor: '#3b82f6' },
    ],
}
</script>
