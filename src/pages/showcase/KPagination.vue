<template>
    <div class="sp">
        <h2 class="sp-title">KPagination</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KPagination v-model:page="page1" :total-pages="12" :total="248" @change="lastChange = $event" />
            <div class="sp-vmodel" style="margin-top: 12px;">صفحه فعلی: {{ page1 }}</div>
        </div>

        <h3 class="sp-sub">با انتخاب تعداد در صفحه</h3>
        <div class="sp-card">
            <KPagination
                v-model:page="page2"
                v-model:per-page="perPage"
                :total-pages="Math.ceil(248 / perPage)"
                :total="248"
                :page-sizes="[10, 25, 50, 100]"
                @change="lastChange = $event"
            />
            <div class="sp-vmodel" style="margin-top: 12px;">
                صفحه {{ page2 }} — {{ perPage }} ردیف در صفحه
            </div>
        </div>

        <h3 class="sp-sub">صفحات زیاد (با «…»)</h3>
        <div class="sp-card">
            <KPagination v-model:page="page3" :total-pages="40" :total="3980" @change="lastChange = $event" />
        </div>

        <h3 class="sp-sub">بدون اطلاعات مجموع</h3>
        <div class="sp-card">
            <KPagination v-model:page="page4" :total-pages="6" :show-total="false" @change="lastChange = $event" />
        </div>

        <h3 class="sp-sub">تک‌صفحه‌ای و دو صفحه‌ای</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 14px;">
            <KPagination v-model:page="single" :total-pages="1" :show-total="false" />
            <KPagination v-model:page="two" :total-pages="2" :show-total="false" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">رویداد change: {{ lastChange ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPagination from '../../ui-kit/components/KPagination.vue'

const page1 = ref(1)
const page2 = ref(3)
const perPage = ref(25)
const page3 = ref(11)
const page4 = ref(2)
const single = ref(1)
const two = ref(1)
const lastChange = ref<number | null>(null)
</script>
