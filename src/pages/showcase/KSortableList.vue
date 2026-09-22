<template>
    <div class="sp">
        <h2 class="sp-title">KSortableList</h2>

        <h3 class="sp-sub">پایه — کشیدن و رها کردن</h3>
        <p class="sp-note">
            دستگیره (آیکون grip) خودِ کامپوننت است؛ در اسلات فقط محتوای ردیف را بگذارید.
        </p>
        <div class="sp-card" style="max-width: 520px;">
            <KSortableList v-model:items="list1">
                <template #default="{ item, index }">
                    <div class="sl-row">
                        <span class="sl-index">{{ index + 1 }}</span>
                        <span style="flex: 1; font-size: 0.85rem;">{{ item.label }}</span>
                    </div>
                </template>
            </KSortableList>
            <div class="sp-vmodel" style="margin-top: 12px;">ترتیب: {{ list1.map(i => i.label).join(' ← ') }}</div>
        </div>

        <h3 class="sp-sub">قابل حذف (removable)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSortableList v-model:items="list2" removable @remove="onRemove">
                <template #default="{ item }">
                    <div class="sl-row">
                        <span style="flex: 1; font-size: 0.85rem;">{{ item.label }}</span>
                        <span style="font-size: 0.72rem; color: var(--k-text-muted);">{{ item.meta }}</span>
                    </div>
                </template>
            </KSortableList>
            <div class="sp-vmodel" style="margin-top: 12px;">حذف‌شده: {{ removed || '—' }}</div>
        </div>

        <h3 class="sp-sub">با keyProp سفارشی</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSortableList v-model:items="list3" key-prop="code">
                <template #default="{ item }">
                    <div class="sl-row">
                        <code style="font-size: 0.75rem;">{{ item.code }}</code>
                        <span style="flex: 1; font-size: 0.85rem;">{{ item.title }}</span>
                    </div>
                </template>
            </KSortableList>
        </div>

        <h3 class="sp-sub">یک آیتم و فهرست خالی</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KSortableList v-model:items="list4">
                <template #default="{ item }">
                </template>
            </KSortableList>
            <KSortableList v-model:items="list5">
                <template #default="{ item }">
                    <div class="sl-row"><span style="flex: 1; font-size: 0.85rem;">{{ item.label }}</span></div>
                </template>
              </KSortableList>
            <p class="sp-note">فهرست دوم خالی است — هیچ ردیفی رندر نمی‌شود.</p>
        </div>

        <h3 class="sp-sub">محتوا در حال ویرایش (فرم مرتب‌شونده)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KSortableList v-model:items="fields" removable>
                <template #default="{ item }">
                    <div class="sl-row" style="gap: 10px;">
                        <span style="width: 90px; font-size: 0.78rem;">{{ item.label }}</span>
                        <span v-if="item.type" class="sl-tag">{{ item.type }}</span>
                        <span style="flex: 1; font-size: 0.75rem; color: var(--k-text-muted);">{{ item.required ? 'الزامی' : 'اختیاری' }}</span>
                    </div>
                </template>
            </KSortableList>
            <div class="sp-vmodel" style="margin-top: 12px;">ترتیب فیلدها: {{ fields.map(f => f.label).join('، ') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import KSortableList from '../../ui-kit/components/KSortableList.vue'

const list1 = ref([
    { id: 'a', label: 'مقدمه' },
    { id: 'b', label: 'قوانین' },
    { id: 'c', label: 'ارزش‌گذاری' },
    { id: 'd', label: 'فروش' },
])

const list2 = ref([
    { id: '1', label: 'واحد ۱ — سلام و احوال‌پرسی', meta: '۴۰ دقیقه' },
    { id: '2', label: 'واحد ۲ — اعداد', meta: '۳۵ دقیقه' },
    { id: '3', label: 'واحد ۳ — خانواده', meta: '۵۰ دقیقه' },
])

const list3 = ref([
    { code: 'CH-01', title: 'فصل اول — پایه‌ها' },
    { code: 'CH-02', title: 'فصل دوم — زمان‌ها' },
])

const list4 = ref([{ id: 'solo', label: 'تنها آیتم' }])
const list5 = ref<any[]>([])

const fields = ref([
    { id: 'f1', label: 'نام', type: 'text', required: true },
    { id: 'f2', label: 'سن', type: 'number', required: false },
    { id: 'f3', label: 'سطح', type: 'select', required: true },
    { id: 'f4', label: 'توضیح', type: 'textarea', required: false },
])

const removed = ref('')
const onRemove = (item: any) => { removed.value = item.label }
</script>

<style scoped>
.sl-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}
.sl-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--k-primary-light);
    color: var(--k-primary);
    font-size: 0.68rem;
    font-weight: 700;
}
.sl-tag {
    font-size: 0.66rem;
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary);
}
</style>
