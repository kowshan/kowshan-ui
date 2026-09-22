<template>
    <div class="sp">
        <h2 class="sp-title">KJsonViewer</h2>

        <h3 class="sp-sub">پایه (تودرتو + آرایه)</h3>
        <div class="sp-card">
            <KJsonViewer :data="user" />
        </div>

        <h3 class="sp-sub">برچسب ریشه سفارشی</h3>
        <div class="sp-card">
            <KJsonViewer :data="user" root-label="response.data" />
        </div>

        <h3 class="sp-sub">همه بسته (collapsed)</h3>
        <div class="sp-card">
            <KJsonViewer :data="user" :collapsed="true" />
        </div>

        <h3 class="sp-sub">عمق باز شدن ۱ (فقط سطح اول)</h3>
        <div class="sp-card">
            <KJsonViewer :data="user" :expand-depth="1" />
        </div>

        <h3 class="sp-sub">پاسخ API</h3>
        <div class="sp-card">
            <KJsonViewer :data="apiResponse" root-label="GET /api/courses" />
        </div>

        <h3 class="sp-sub">آرایه در ریشه</h3>
        <div class="sp-card">
            <KJsonViewer :data="[1, 2, { three: [3, 3, 3] }, null, true]" />
        </div>

        <h3 class="sp-sub">مقادیر خاص (خالی، منفی، بلند)</h3>
        <div class="sp-card">
            <KJsonViewer :data="edgeCases" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KJsonViewer from '../../ui-kit/components/KJsonViewer.vue'

const user = {
    id: 1024,
    name: 'مریم احمدی',
    active: true,
    score: null,
    profile: {
        city: 'شیراز',
        age: 28,
        skills: ['Vue', 'TypeScript', 'SQL'],
    },
    orders: [
        { id: 1, total: 250000, paid: true },
        { id: 2, total: 890000, paid: false },
    ],
}

const apiResponse = {
    status: 'ok',
    total: 2,
    data: [
        { id: 7, title: 'دوره Vue پیشرفته', lessons: 24, price: 1200000, tags: ['front'] },
        { id: 8, title: 'دوره Laravel', lessons: 31, price: 1500000, tags: ['back', 'api'] },
    ],
    meta: { page: 1, perPage: 15, hasNext: false },
}

const edgeCases = {
    empty: '',
    zero: 0,
    negative: -42.5,
    emptyArray: [],
    emptyObject: {},
    nested: { a: { b: { c: { d: [1] } } } },
    longText: 'این یک متن نسبتاً طولانی است که برای بررسی شکستن خط در نمایشگر جیسون استفاده می‌شود.',
    date: '1405/06/31',
}
</script>
