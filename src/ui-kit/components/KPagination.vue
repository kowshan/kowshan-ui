<!-- components/KPagination.vue -->
<template>
    <div class="k-pagination">
        <!-- Total info -->
        <span v-if="showTotal" class="k-pagination-total">
            {{ total }} مورد
        </span>

        <div class="k-pagination-pages">
            <button
                type="button"
                class="k-pagination-btn"
                :disabled="page <= 1"
                aria-label="صفحه اول"
                @click="goTo(1)"
            >
                <ChevronsRight class="icon" />
            </button>

            <button
                type="button"
                class="k-pagination-btn"
                :disabled="page <= 1"
                aria-label="قبلی"
                @click="goTo(page - 1)"
            >
                <ChevronRight class="icon" />
            </button>

            <template v-for="p in pageItems" :key="p">
                <span v-if="p === '...'" class="k-pagination-ellipsis">…</span>
                <button
                    v-else
                    type="button"
                    class="k-pagination-btn num"
                    :class="{ active: p === page }"
                    :aria-current="p === page ? 'page' : undefined"
                    @click="goTo(p)"
                >
                    {{ p }}
                </button>
            </template>

            <button
                type="button"
                class="k-pagination-btn"
                :disabled="page >= totalPages"
                aria-label="بعدی"
                @click="goTo(page + 1)"
            >
                <ChevronLeft class="icon" />
            </button>

            <button
                type="button"
                class="k-pagination-btn"
                :disabled="page >= totalPages"
                aria-label="صفحه آخر"
                @click="goTo(totalPages)"
            >
                <ChevronsLeft class="icon" />
            </button>
        </div>

        <!-- Page size -->
        <KSelect
            v-if="pageSizes.length"
            :model-value="perPage"
            :options="pageSizes"
            class="k-pagination-size"
            :max-height="'200px'"
            @update:model-value="changeSize"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import KSelect from '../wrappers/KSelect.vue'

const props = withDefaults(defineProps<{
    page: number
    totalPages: number
    total?: number
    perPage?: number
    pageSizes?: number[]
    showTotal?: boolean
}>(), {
    total: 0,
    perPage: 0,
    pageSizes: () => [],
    showTotal: true
})

const emits = defineEmits<{
    'update:page': [value: number]
    'update:per-page': [value: number]
    'change': [page: number]
}>()


const goTo = (p: number) => {
    const target = Math.min(Math.max(1, p), props.totalPages)
    if (target === props.page) return
    emits('update:page', target)
    emits('change', target)
}

const changeSize = (val: any) => {
    const size = Number(val?.id ?? val?.value ?? val)
    if (!size) return
    emits('update:per-page', size)
    emits('update:page', 1)
    emits('change', 1)
}

// Window of page numbers with ellipsis
const pageItems = computed<(number | '...')[]>(() => {
    const total = props.totalPages
    const current = props.page
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const items: (number | '...')[] = [1]
    if (current > 3) items.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) items.push(i)

    if (current < total - 2) items.push('...')
    items.push(total)
    return items
})
</script>

<style scoped>
.k-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
}

.k-pagination-total {
    font-size: 0.78rem;
    color: var(--k-text-secondary);
}

.k-pagination-pages {
    display: flex;
    align-items: center;
    gap: 4px;
}

.k-pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-primary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-pagination-btn:hover:not(:disabled):not(.active) {
    background: var(--k-surface-hover);
    border-color: var(--k-text-secondary);
}

.k-pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.k-pagination-btn.active {
    background: var(--k-primary);
    border-color: var(--k-primary);
    color: #fff;
    font-weight: 600;
}

.k-pagination-btn:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 1px;
}

.k-pagination-ellipsis {
    color: var(--k-text-muted);
    padding: 0 2px;
    font-size: 0.8rem;
}

.icon {
    width: 16px;
    height: 16px;
}

.k-pagination-size {
    width: 90px;
}
</style>
