<template>
    <div class="sp">
        <h2 class="sp-title">KDatePickerModal</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-row">
            <KButton text="باز کردن انتخاب تاریخ" @click="open1 = true" />
            <span class="sp-note">مقدار: {{ value1 || '—' }}</span>
        </div>
        <KDatePickerModal v-model:visible="open1" v-model="value1" />

        <h3 class="sp-sub">با عنوان و محدوده سال</h3>
        <div class="sp-row">
            <KButton text="باز کردن (محدوده ۱۳۹۵–۱۴۱۰)" @click="open2 = true" />
            <span class="sp-note">مقدار: {{ value2 || '—' }}</span>
        </div>
        <KDatePickerModal
            v-model:visible="open2"
            v-model="value2"
            title="تاریخ استخدام"
            :year-range="[1395, 1410]"
        />

        <h3 class="sp-sub">خروجی ISO</h3>
        <div class="sp-row">
            <KButton text="باز کردن (ISO)" @click="open3 = true" />
            <span class="sp-note">مقدار: {{ value3 || '—' }}</span>
        </div>
        <KDatePickerModal
            v-model:visible="open3"
            v-model="value3"
            title="تاریخ و ساعت"
            output-format="iso"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDatePickerModal from '../../ui-kit/components/KDatePickerModal.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const open1 = ref(false)
const open2 = ref(false)
const open3 = ref(false)
const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>

<style scoped>
.sp-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
