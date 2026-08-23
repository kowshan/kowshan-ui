<template>
    <DemoSection
        id="data"
        index="03"
        title="نمایش داده"
        description="جدول داده با مرتب‌سازی، صفحه‌بندی، نشان و آواتار"
    >
        <!-- Filter bar (wired to the table) -->
        <KFilterBar
            v-model="tableSearch"
            :chips="statusChips"
            :search-placeholder="'جستجو در نام ملک…'"
            @toggle-chip="toggleChip"
            @reset="resetFilters"
            style="margin-bottom: 12px"
        />

        <!-- Table -->
        <KDataTable
            title="لیست املاک"
            :icon="Building2"
            :data="filteredRows"
            :columns="tableColumns"
            :meta="tableMeta"
            max-height="340px"
            @row-click="(r: any) => (selectedRow = r)"
        >
            <template #col-status="{ row }">
                <KBadge :text="row.status" :variant="statusVariant(row.status)" />
            </template>
            <template #col-price="{ row }">
                <span style="font-weight: 700">{{ faNum(row.price.toLocaleString('en-US')) }}</span>
            </template>
            <template #col-area="{ row }">
                <span>{{ faNum(row.area) }} متر</span>
            </template>
            <template #footer>
                <KPagination
                    v-model:page="tableMeta.current_page"
                    :total-pages="tableMeta.last_page"
                    :total="tableMeta.total"
                    :per-page="tableMeta.per_page"
                />
            </template>
        </KDataTable>

        <p v-if="selectedRow" style="font-size: 0.8rem; color: var(--k-success); margin-top: 12px">
            ردیف انتخاب شد: {{ selectedRow.name }}
        </p>

        <hr class="demo-divider" />

        <!-- Badges + Avatars -->
        <div class="demo-row">
            <span class="demo-caption" style="margin: 0; min-width: 70px">نشان‌ها</span>
            <KBadge text="جدید" variant="success" />
            <KBadge text="در انتظار" variant="warning" dot />
            <KBadge text="خطا" variant="danger" />
            <KBadge text="اطلاعات" variant="info" outline />
            <KBadge text="پیش‌فرض" variant="neutral" />
            <KBadge text="ویژه" variant="primary" size="lg" />
        </div>

        <hr class="demo-divider" />

        <div class="demo-row">
            <span class="demo-caption" style="margin: 0; min-width: 70px">آواتار</span>
            <KAvatar name="علی رضایی" size="lg" status="online" />
            <KAvatar src="https://i.pravatar.cc/80?img=12" name="سارا محمدی" size="md" />
            <KAvatar name="محمد احمدی" size="sm" shape="rounded" status="away" />
            <KAvatar name="ناشناس" size="md" :icon="User" />
            <KAvatar src="https://i.pravatar.cc/80?img=5" name="مینا کریمی" size="xl" status="busy" bordered />
        </div>

        <div class="demo-row is-start">
            <span class="demo-caption" style="margin: 0; min-width: 70px">گروه آواتار</span>
            <KAvatarGroup :items="avatarGroup" :max="5" size="md" />
            <KAvatarGroup :items="avatarGroup" :max="3" size="sm" style="margin-right: 24px" />
        </div>

        <hr class="demo-divider" />

        <div class="demo-row is-start">
            <div style="width: 300px">
                <KRating v-model="rating" label="امتیاز" show-value />
            </div>
            <div style="width: 300px">
                <KRating v-model="ratingReadonly" :max="10" readonly show-value />
            </div>
            <div class="demo-stack" style="margin-right: 24px">
                <span class="demo-caption" style="margin: 0">حلقه پیشرفت</span>
                <div class="demo-row" style="margin: 0">
                    <KProgressRing :model-value="72" size="lg" label="تکمیل پروفایل" />
                    <KProgressRing :model-value="0.45" :max="1" size="md" color="#10b981" label="سهم بازار" style="margin-right: 40px" />
                    <KProgressRing :model-value="88" size="sm" color="#8b5cf6" label="رضایت" style="margin-right: 40px" />
                </div>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Tree -->
        <p class="demo-caption">درخت سازمان / دسته‌بندی — انتخاب: {{ selectedTreeNode?.label || '—' }}</p>
        <div style="max-width: 420px; border: 1px solid var(--k-border); border-radius: 12px; padding: 12px">
            <KTreeView v-model="treeSelected" :nodes="treeNodes" :default-expanded="['branches', 'north']" />
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Building2, Building, FolderOpen, User, Users } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'

import KDataTable from '../ui-kit/wrappers/KDataTable.vue'
import KPagination from '../ui-kit/components/KPagination.vue'
import KBadge from '../ui-kit/components/KBadge.vue'
import KAvatar from '../ui-kit/components/KAvatar.vue'
import KRating from '../ui-kit/components/KRating.vue'
import KAvatarGroup from '../ui-kit/components/KAvatarGroup.vue'
import KTreeView from '../ui-kit/components/KTreeView.vue'
import KFilterBar from '../ui-kit/components/KFilterBar.vue'
import KProgressRing from '../ui-kit/components/KProgressRing.vue'

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const faNum = (n: string | number) => String(n).replace(/\d/g, d => faDigits[Number(d)])

const tableRows = ref([
    { name: 'ویلا دوبلکس لوکس', price: 25000000000, status: 'فروش', area: 320 },
    { name: 'آپارتمان ۹۵ متری', price: 8500000000, status: 'رهن', area: 95 },
    { name: 'مغازه تجاری', price: 120000000000, status: 'اجاره', area: 60 },
    { name: 'سوئیت استودیو', price: 4200000000, status: 'فروش', area: 42 },
    { name: 'پنت‌هاوس', price: 68000000000, status: 'فروش', area: 210 },
    { name: 'انبار صنعتی', price: 45000000000, status: 'اجاره', area: 500 },
])

/* Filter bar state + filtering */
const tableSearch = ref('')
const statusChips = ref([
    { id: 'فروش', label: 'فروش', active: false, count: 3 },
    { id: 'رهن', label: 'رهن', active: false, count: 1 },
    { id: 'اجاره', label: 'اجاره', active: false, count: 2 },
])

const toggleChip = (chip: any) => {
    chip.active = !chip.active
    tableMeta.value.current_page = 1
}

const resetFilters = () => {
    tableSearch.value = ''
    statusChips.value.forEach(c => (c.active = false))
    tableMeta.value.current_page = 1
}

const filteredRows = computed(() => {
    const q = tableSearch.value.trim()
    const active = statusChips.value.filter(c => c.active).map(c => c.id)
    return tableRows.value.filter(r => {
        const matchQ = !q || r.name.includes(q)
        const matchChip = !active.length || active.includes(r.status)
        return matchQ && matchChip
    })
})

const tableColumns = [
    { key: '__rowNumber', label: 'ردیف' },
    { key: 'name', label: 'نام ملک' },
    { key: 'price', label: 'قیمت (تومان)', slot: true },
    { key: 'area', label: 'متراژ', slot: true },
    { key: 'status', label: 'وضعیت', slot: true },
]

const tableMeta = ref({ current_page: 1, per_page: 5, total: 6, last_page: 2 })
const selectedRow = ref<any>(null)

/* Avatar group */
const avatarGroup = [
    { name: 'علی رضایی', src: 'https://i.pravatar.cc/80?img=12', status: 'online' as const },
    { name: 'سارا محمدی', src: 'https://i.pravatar.cc/80?img=47', status: 'busy' as const },
    { name: 'مریم کریمی', src: 'https://i.pravatar.cc/80?img=5' },
    { name: 'محمد احمدی', src: 'https://i.pravatar.cc/80?img=33' },
    { name: 'نگار حسینی', src: 'https://i.pravatar.cc/80?img=44' },
    { name: 'رضا قاسمی', src: 'https://i.pravatar.cc/80?img=15' },
    { name: 'الهام نوری', src: 'https://i.pravatar.cc/80?img=32' },
]

/* Tree */
const treeNodes = [
    {
        id: 'branches',
        label: 'شعب و نمایندگی‌ها',
        icon: Building,
        badge: 4,
        children: [
            {
                id: 'north',
                label: 'شعبه شمال',
                icon: FolderOpen,
                badge: 2,
                children: [
                    { id: 'n1', label: 'واحد فروش', icon: Users },
                    { id: 'n2', label: 'واحد اجاره', icon: Users },
                ],
            },
            {
                id: 'south',
                label: 'شعبه جنوب',
                icon: FolderOpen,
                children: [
                    { id: 's1', label: 'واحد فروش', icon: Users },
                ],
            },
        ],
    },
    { id: 'archive', label: 'آرشیو قراردادها', icon: FolderOpen, badge: 127 },
]

const treeSelected = ref<string | null>(null)
const selectedTreeNode = computed(() => {
    const walk = (nodes: any[]): any => {
        for (const n of nodes) {
            if (n.id === treeSelected.value) return n
            if (n.children) {
                const hit = walk(n.children)
                if (hit) return hit
            }
        }
        return null
    }
    return walk(treeNodes)
})

const statusVariant = (s: string) => ({ فروش: 'success', رهن: 'warning', اجاره: 'info' } as Record<string, any>)[s] || 'neutral'

const rating = ref(4)
const ratingReadonly = ref(8)
</script>
