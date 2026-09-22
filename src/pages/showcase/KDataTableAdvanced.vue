<template>
    <div class="sp">
        <h2 class="sp-title">KDataTableAdvanced</h2>

        <h3 class="sp-sub">پایه — مرتب‌سازی روی همه ستون‌ها</h3>
        <KDataTableAdvanced
            title="کارمندان"
            :data="people"
            :columns="cols"
            row-key="id"
            @row-click="clicked = $event.name"
        />

        <h3 class="sp-sub">با ارتفاع محدود</h3>
        <KDataTableAdvanced
            title="لیست بلند"
            :data="many"
            :columns="cols"
            row-key="id"
            max-height="220px"
        />

        <h3 class="sp-sub">ستون سفارشی (slot)</h3>
        <KDataTableAdvanced
            :data="people"
            :columns="statusCols"
            row-key="id"
        >
            <template #col-status="{ row }">
                <KBadge :text="row.status" :variant="row.status === 'فعال' ? 'success' : 'danger'" />
            </template>
        </KDataTableAdvanced>

        <h3 class="sp-sub">قابل باز شدن (expandable)</h3>
        <KDataTableAdvanced
            :data="people"
            :columns="cols"
            row-key="id"
            :expandable="true"
        >
            <template #expanded="{ row }">
                <div style="display:flex;flex-direction:column;gap:4px">
                    <strong>{{ row.name }}</strong>
                    <span>{{ row.city }} · {{ row.age }} سال · {{ row.status }}</span>
                </div>
            </template>
        </KDataTableAdvanced>

        <p class="sp-note">آخرین کلیک: {{ clicked || '—' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDataTableAdvanced from '../../ui-kit/components/KDataTableAdvanced.vue'
import KBadge from '../../ui-kit/components/KBadge.vue'

const clicked = ref('')

const people = [
    { id: 1, name: 'علی رضایی', age: 28, city: 'تهران', status: 'فعال' },
    { id: 2, name: 'سارا محمدی', age: 32, city: 'اصفهان', status: 'غیرفعال' },
    { id: 3, name: 'محمد کریمی', age: 25, city: 'شیراز', status: 'فعال' },
    { id: 4, name: 'زهرا احمدی', age: 41, city: 'مشهد', status: 'فعال' },
]

const many = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `کاربر ${i + 1}`,
    age: 20 + (i % 30),
    city: ['تهران', 'اصفهان', 'شیراز'][i % 3],
    status: i % 4 === 0 ? 'غیرفعال' : 'فعال',
}))

const cols = [
    { key: 'name', label: 'نام', sortable: true },
    { key: 'age', label: 'سن', sortable: true, width: '90px' },
    { key: 'city', label: 'شهر' },
]

const statusCols = [
    { key: 'name', label: 'نام' },
    { key: 'status', label: 'وضعیت', slot: true },
]
</script>
