<template>
    <div class="sp">
        <h2 class="sp-title">KTimePickerModal</h2>
        <p class="sp-note">
            چون یک مودال است، از دکمه باز می‌شود. چرخ‌ها ساعت/دقیقه (و در صورت نیاز ثانیه) را انتخاب می‌کنند.
        </p>

        <h3 class="sp-sub">پایه (HH:mm)</h3>
        <div class="sp-card">
            <KButton text="انتخاب ساعت" @click="open1 = true" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ time1 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با مقدار اولیه (۰۸:۳۰)</h3>
        <div class="sp-card">
            <KButton text="ویرایش ساعت" :bg-color="'transparent'" @click="open2 = true" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ time2 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با ثانیه (HH:mm:ss)</h3>
        <div class="sp-card">
            <KButton text="انتخاب دقیق" @click="open3 = true" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ time3 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">عنوان سفارشی</h3>
        <div class="sp-card">
            <KButton text="ساعت شروع کلاس" :bg-color="'transparent'" @click="open4 = true" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ time4 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">کاربردی — زمان‌بندی کلاس</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 16px;">
            <KTextInput v-model="form.title" label="عنوان کلاس" />
            <div style="display: flex; gap: 10px; align-items: center;">
                <KButton text="انتخاب ساعت شروع" @click="open5 = true" />
                <span style="font-size: 0.85rem;">{{ form.time || 'هنوز انتخاب نشده' }}</span>
            </div>
            <KButton :text="form.title && form.time ? 'زمان‌بندی کن' : 'فیلدها ناقص است'" :disabled="!form.title || !form.time" @click="scheduled = true" />
            <div v-if="scheduled" class="sp-vmodel">
                «{{ form.title }}» برای ساعت {{ form.time }} زمان‌بندی شد.
            </div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            تأیید: {{ confirms }} بار — لغو: {{ cancels }} بار
        </div>

        <KTimePickerModal v-model:visible="open1" v-model="time1" @confirm="onConfirm" @cancel="onCancel" />
        <KTimePickerModal v-model:visible="open2" v-model="time2" @confirm="onConfirm" @cancel="onCancel" />
        <KTimePickerModal v-model:visible="open3" v-model="time3" :show-seconds="true" output-format="HH:mm:ss" title="انتخاب زمان دقیق" @confirm="onConfirm" @cancel="onCancel" />
        <KTimePickerModal v-model:visible="open4" v-model="time4" title="ساعت شروع کلاس" @confirm="onConfirm" @cancel="onCancel" />
        <KTimePickerModal v-model:visible="open5" v-model="form.time" title="ساعت شروع" @confirm="onConfirm" @cancel="onCancel" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KTimePickerModal from '../../ui-kit/components/KTimePickerModal.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'

const open1 = ref(false)
const open2 = ref(false)
const open3 = ref(false)
const open4 = ref(false)
const open5 = ref(false)

const time1 = ref<string | null>(null)
const time2 = ref<string | null>('08:30')
const time3 = ref<string | null>('09:15:00')
const time4 = ref<string | null>(null)

const form = reactive({ title: '', time: null as string | null })
const scheduled = ref(false)

const confirms = ref(0)
const cancels = ref(0)
const onConfirm = () => { confirms.value++ }
const onCancel = () => { cancels.value++ }
</script>
