<!-- pages/users.vue — users list with KDataTable + KPagination -->
<template>
    <div class="users-page">
        <div class="users-header">
            <h1>کاربران</h1>
            <p>KDataTable و KPagination</p>
        </div>

        <div class="users-table-wrap">
            <KDataTable
                :data="pagedUsers"
                :columns="columns"
                :meta="tableMeta"
                title="لیست کاربران"
                :icon="UsersIcon"
                row-key="id"
                @row-click="onRowClick"
            >
                <template #col-status="{ row }">
                    <KVerifyBadge :status="row.status" size="sm" />
                </template>
                <template #col-role="{ row }">
                    <span class="users-role-badge" :class="`role-${row.roleKey}`">{{ row.role }}</span>
                </template>
                <template #footer>
                    <KPagination
                        v-model:page="currentPage"
                        :total-pages="totalPages"
                        :total="users.length"
                        :per-page="perPage"
                        :page-sizes="[5, 10, 20]"
                        show-total
                        @update:per-page="perPage = $event"
                    />
                </template>
            </KDataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users as UsersIcon } from 'lucide-vue-next'
import KDataTable from '../ui-kit/wrappers/KDataTable.vue'
import type { Column } from '../ui-kit/composables/useDataTable'
import KVerifyBadge from '../ui-kit/components/KVerifyBadge.vue'
import KPagination from '../ui-kit/components/KPagination.vue'
import { useToast } from '../ui-kit/composables/useToast'

const columns: Column[] = [
    { key: '__rowNumber', label: '#', width: '48px', sortable: false },
    { key: 'name', label: 'نام', width: '160px' },
    { key: 'email', label: 'ایمیل', width: '200px' },
    { key: 'phone', label: 'تلفن', width: '130px' },
    { key: 'role', label: 'نقش', slot: true, width: '110px' },
    { key: 'status', label: 'وضعیت', slot: true, width: '110px' },
    { key: 'lastActive', label: 'آخرین فعالیت', width: '130px' },
]

const users = ref([
    { id: 1, name: 'علی رضایی', email: 'ali@example.com', phone: '۰۹۱۲۱۲۳۴۵۶۷', role: 'مدیر', roleKey: 'admin', status: 'verified' as const, lastActive: '۵ دقیقه پیش' },
    { id: 2, name: 'سارا کریمی', email: 'sara@example.com', phone: '۰۹۱۳۱۲۳۴۵۶۷', role: 'کارمند', roleKey: 'staff', status: 'verified' as const, lastActive: '۱ ساعت پیش' },
    { id: 3, name: 'محمد حسینی', email: 'mohammad@example.com', phone: '۰۹۱۴۱۲۳۴۵۶۷', role: 'کاربر', roleKey: 'user', status: 'pending' as const, lastActive: '۳ ساعت پیش' },
    { id: 4, name: 'زهرا نوری', email: 'zahra@example.com', phone: '۰۹۱۵۱۲۳۴۵۶۷', role: 'کارمند', roleKey: 'staff', status: 'verified' as const, lastActive: 'دیروز' },
    { id: 5, name: 'امیر کاظمی', email: 'amir@example.com', phone: '۰۹۱۶۱۲۳۴۵۶۷', role: 'کاربر', roleKey: 'user', status: 'unverified' as const, lastActive: '۳ روز پیش' },
    { id: 6, name: 'نیلوفر صادقی', email: 'niloufer@example.com', phone: '۰۹۱۷۱۲۳۴۵۶۷', role: 'مدیر', roleKey: 'admin', status: 'verified' as const, lastActive: '۱۰ دقیقه پیش' },
    { id: 7, name: 'رضا شریفی', email: 'reza@example.com', phone: '۰۹۱۸۱۲۳۴۵۶۷', role: 'کارمند', roleKey: 'staff', status: 'verified' as const, lastActive: '۲ ساعت پیش' },
    { id: 8, name: 'مریم جعفری', email: 'maryam@example.com', phone: '۰۹۱۹۱۲۳۴۵۶۷', role: 'کاربر', roleKey: 'user', status: 'rejected' as const, lastActive: '۱ هفته پیش' },
    { id: 9, name: 'حسن عباسی', email: 'hassan@example.com', phone: '۰۹۲۰۱۲۳۴۵۶۷', role: 'کارمند', roleKey: 'staff', status: 'verified' as const, lastActive: '۴ ساعت پیش' },
    { id: 10, name: 'فاطمه رضایی', email: 'fateme@example.com', phone: '۰۹۲۱۱۲۳۴۵۶۷', role: 'کاربر', roleKey: 'user', status: 'pending' as const, lastActive: '۲ روز پیش' },
    { id: 11, name: 'الهام مهدوی', email: 'elham@example.com', phone: '۰۹۲۲۱۲۳۴۵۶۷', role: 'مدیر', roleKey: 'admin', status: 'verified' as const, lastActive: '۱۵ دقیقه پیش' },
    { id: 12, name: 'امید صالحی', email: 'omid@example.com', phone: '۰۹۲۳۱۲۳۴۵۶۷', role: 'کارمند', roleKey: 'staff', status: 'verified' as const, lastActive: '۳۰ دقیقه پیش' },
])

const currentPage = ref(1)
const perPage = ref(10)

const totalPages = computed(() => Math.ceil(users.value.length / perPage.value))

const pagedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return users.value.slice(start, start + perPage.value)
})

const tableMeta = computed(() => ({
    current_page: currentPage.value,
    per_page: perPage.value,
}))

const onRowClick = (row: any) => {
    useToast.success(`انتخاب شد: ${row.name}`)
}
</script>

<style scoped>
.users-page {
    /* max-width handled by layout */
}

.users-header {
    margin-bottom: 24px;
}

.users-header h1 {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--k-text-primary);
    margin: 0 0 4px;
}

.users-header p {
    font-size: 0.78rem;
    color: var(--k-text-muted);
    margin: 0;
}

.users-table-wrap {
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    overflow: hidden;
}

.users-role-badge {
    font-size: 0.62rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
}

.role-admin {
    background: color-mix(in srgb, #8b5cf6 12%, transparent);
    color: #8b5cf6;
}

.role-staff {
    background: color-mix(in srgb, #3b82f6 12%, transparent);
    color: #3b82f6;
}

.role-user {
    background: color-mix(in srgb, #64748b 12%, transparent);
    color: #64748b;
}
</style>
