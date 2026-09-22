<template>
    <div class="sp">
        <h2 class="sp-title">KDatePicker</h2>

        <h3 class="sp-sub">پایه (حالت modal)</h3>
        <div class="sp-row">
            <KDatePicker v-model="date1" label="تاریخ تولد" />
            <span class="sp-note">مقدار خروجی: {{ date1 || '—' }}</span>
        </div>

        <h3 class="sp-sub">حالت segmented</h3>
        <KDatePicker v-model="date2" label="تاریخ مرخصی" picker="segmented" />

        <h3 class="sp-sub">با خروجی jalali</h3>
        <KDatePicker v-model="date3" label="تاریخ (شمسی)" output-format="jalali" />

        <h3 class="sp-sub">وردی (readonly) + غیرفعال</h3>
        <div class="sp-row">
            <KDatePicker v-model="date1" label="فقط خواندنی" :readonly="true" />
            <KDatePicker v-model="date1" label="غیرفعال" :disabled="true" />
        </div>

        <h3 class="sp-sub">اجباری</h3>
        <KDatePicker v-model="date4" label="تاریخ اجباری" :required="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDatePicker from '../../ui-kit/wrappers/KDatePicker.vue'

const date1 = ref('')
const date2 = ref('')
const date3 = ref('')
const date4 = ref('')
</script>

<style scoped>
.sp-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
