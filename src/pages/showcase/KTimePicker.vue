<template>
    <div class="sp">
        <h2 class="sp-title">KTimePicker</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t1" label="ساعت شروع" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ t1 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با مقدار اولیه</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTimePicker v-model="t2" label="۰۸:۳۰" />
            <KTimePicker v-model="t3" label="۲۱:۱۵" />
        </div>

        <h3 class="sp-sub">با ثانیه</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t4" label="زمان دقیق" :show-seconds="true" output-format="HH:mm:ss" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ t4 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">قابل پاک‌کردن</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t5" label="قابل پاک‌کردن" clearable />
        </div>

        <h3 class="sp-sub">placeholder سفارشی</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t6" label="ساعت پایان" placeholder="ساعت پایان کلاس را انتخاب کنید" />
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t7" label="ساعت شروع (الزامی)" required />
        </div>

        <h3 class="sp-sub">غیرفعال و فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTimePicker v-model="t8" label="غیرفعال" disabled />
            <KTimePicker v-model="t9" label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">pickerEnabled=false (فقط نمایش، بدون مودال)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KTimePicker v-model="t10" label="بدون باز‌شدن انتخاب‌گر" :picker-enabled="false" />
            <p class="sp-note">برای حالتی که سرور اجازه تغییر نمی‌دهد ولی می‌خواهید مقدار دیده شود.</p>
        </div>

        <h3 class="sp-sub">فرم کاربردی — زمان‌بندی کلاس</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.title" label="عنوان کلاس" />
            <KTimePicker v-model="form.start" label="ساعت شروع" required />
            <KTimePicker v-model="form.end" label="ساعت پایان" clearable />
            <KButton :text="form.title && form.start ? 'زمان‌بندی' : 'فیلدهای الزامی را پر کنید'" :disabled="!form.title || !form.start" @click="scheduled = true" />
            <div v-if="scheduled" class="sp-vmodel">
                «{{ form.title }}» از {{ form.start }} تا {{ form.end || '—' }} زمان‌بندی شد.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KTimePicker from '../../ui-kit/wrappers/KTimePicker.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const t1 = ref<string | null>(null)
const t2 = ref<string | null>('08:30')
const t3 = ref<string | null>('21:15')
const t4 = ref<string | null>('09:15:30')
const t5 = ref<string | null>('12:00')
const t6 = ref<string | null>(null)
const t7 = ref<string | null>(null)
const t8 = ref<string | null>('10:00')
const t9 = ref<string | null>('14:45')
const t10 = ref<string | null>('16:00')

const form = reactive({ title: '', start: null as string | null, end: null as string | null })
const scheduled = ref(false)
</script>
