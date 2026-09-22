<template>
    <div class="sp">
        <h2 class="sp-title">KPivotTable</h2>

        <h3 class="sp-sub">مجموع فروش بر اساس دسته و ماه</h3>
        <div class="sp-card">
            <KPivotTable
                title="فروش دوره‌ها"
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                aggregator="sum"
            />
        </div>

        <h3 class="sp-sub">میانگین (avg)</h3>
        <div class="sp-card">
            <KPivotTable
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                aggregator="avg"
                :format="money"
            />
        </div>

        <h3 class="sp-sub">تعداد (count)</h3>
        <div class="sp-card">
            <KPivotTable
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                aggregator="count"
                :format="plain"
            />
        </div>

        <h3 class="sp-sub">کمینه و بیشینه (min / max)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KPivotTable
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                aggregator="min"
                :format="money"
            />
            <KPivotTable
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                aggregator="max"
                :format="money"
            />
        </div>

        <h3 class="sp-sub">دو سطح سرسطر (شهر + دسته)</h3>
        <div class="sp-card">
            <KPivotTable
                title="فروش شعبه‌ها"
                :rows="branches"
                :row-headers="['city', 'category']"
                column-field="quarter"
                value-field="amount"
                aggregator="sum"
                :format="money"
            />
        </div>

        <h3 class="sp-sub">بدون عنوان + قالب سفارشی</h3>
        <div class="sp-card">
            <KPivotTable
                :rows="sales"
                :row-headers="['category']"
                column-field="month"
                value-field="amount"
                :format="(v: number) => `${v.toLocaleString('fa-IR')} تومان`"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import KPivotTable from '../../ui-kit/components/KPivotTable.vue'

const sales = [
    { category: 'برنامه‌نویسی', month: 'فروردین', amount: 12000000 },
    { category: 'برنامه‌نویسی', month: 'اردیبهشت', amount: 15500000 },
    { category: 'برنامه‌نویسی', month: 'خرداد', amount: 9800000 },
    { category: 'زبان انگلیسی', month: 'فروردین', amount: 7400000 },
    { category: 'زبان انگلیسی', month: 'اردیبهشت', amount: 8100000 },
    { category: 'زبان انگلیسی', month: 'خرداد', amount: 11200000 },
    { category: 'طراحی', month: 'فروردین', amount: 4300000 },
    { category: 'طراحی', month: 'اردیبهشت', amount: 3600000 },
    { category: 'طراحی', month: 'خرداد', amount: 5200000 },
]

const branches = [
    { city: 'تهران', category: 'برنامه‌نویسی', quarter: 'Q1', amount: 32000000 },
    { city: 'تهران', category: 'زبان', quarter: 'Q2', amount: 27000000 },
    { city: 'اصفهان', category: 'برنامه‌نویسی', quarter: 'Q1', amount: 14500000 },
    { city: 'اصفهان', category: 'زبان', quarter: 'Q2', amount: 16800000 },
    { city: 'شیراز', category: 'طراحی', quarter: 'Q1', amount: 9200000 },
    { city: 'شیراز', category: 'طراحی', quarter: 'Q2', amount: 11300000 },
]

const money = (v: number) => v.toLocaleString('fa-IR')
const plain = (v: number) => String(v)
</script>
