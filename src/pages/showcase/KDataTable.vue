<template>
    <div class="sp">
        <h2 class="sp-title">KDataTable</h2>

        <h3 class="sp-sub">پایه با هدر و ابزار</h3>
        <KDataTable
            title="کاربران"
            :icon="Users"
            :data="rows"
            :columns="cols"
            row-key="id"
            @row-click="clicked = $event.name"
        />
        <p class="sp-note">آخرین ردیف کلیک‌شده: {{ clicked || '—' }}</p>

        <h3 class="sp-sub">بدون هدر</h3>
        <KDataTable
            :data="rows"
            :columns="cols"
            :no-header="true"
        />

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <KDataTable
            title="در حال دریافت"
            :icon="Users"
            :data="rows"
            :columns="cols"
            :loading="true"
        />

        <h3 class="sp-sub">با صفحه‌بندی (meta)</h3>
        <KDataTable
            title="صفحه‌بندی‌شده"
            :icon="Users"
            :data="rows"
            :columns="cols"
            :meta="meta"
        />

        <h3 class="sp-sub">ستون سفارشی</h3>
        <KDataTable
            :data="rows"
            :columns="statusCols"
        >
            <template #col-status="{ row }">
                <KBadge :text="row.status" :variant="row.status === 'فعال' ? 'success' : 'danger'" />
            </template>
        </KDataTable>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDataTable from '../../ui-kit/wrappers/KDataTable.vue'
import KBadge from '../../ui-kit/components/KBadge.vue'
import { Users } from 'lucide-vue-next'

const clicked = ref('')

const rows = [
    { id: 1, name: 'علی رضایی', email: 'ali@mail.com', status: 'فعال' },
    { id: 2, name: 'سارا محمدی', email: 'sara@mail.com', status: 'غیرفعال' },
    { id: 3, name: 'محمد کریمی', email: 'm@mail.com', status: 'فعال' },
]

const cols = [
    { key: 'name', label: 'نام', sortable: true },
    { key: 'email', label: 'ایمیل' },
]

const statusCols = [
    { key: '__rowNumber', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'status', label: 'وضعیت', slot: true },
]

const meta = { current_page: 1, per_page: 10, total: 3 }
</script>
