<template>
    <div class="sp">
        <h2 class="sp-title">KWheelPicker</h2>
        <p class="sp-note">
            مقدار مدل آرایه‌ای از ایندکس‌هاست (هر ستون یک اندیس). با اسکرول، هایلایت جابه‌جا می‌شود و
            رویداد <code>change</code> بعد از توقف اسکرول می‌آید.
        </p>

        <h3 class="sp-sub">پایه — ساعت و دقیقه</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KWheelPicker v-model="v1" :columns="timeColumns" @change="onChange" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                ساعت {{ pad(v1[0] ?? 0) }}:{{ pad(v1[1] ?? 0) }} — change: {{ changes }} بار
            </div>
        </div>

        <h3 class="sp-sub">سه ستون (ساعت:دقیقه:ثانیه)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KWheelPicker v-model="v2" :columns="threeColumns" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                {{ pad(v2[0] ?? 0) }}:{{ pad(v2[1] ?? 0) }}:{{ pad(v2[2] ?? 0) }}
            </div>
        </div>

        <h3 class="sp-sub">تعداد ردیف‌های نمایان (rows)</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 28px;">
            <KWheelPicker v-model="v3" :columns="timeColumns" :rows="3" />
            <KWheelPicker v-model="v3" :columns="timeColumns" :rows="5" />
            <KWheelPicker v-model="v3" :columns="timeColumns" :rows="7" />
        </div>

        <h3 class="sp-sub">ارتفاع ردیف سفارشی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 28px;">
            <KWheelPicker v-model="v4" :columns="timeColumns" :item-height="28" />
            <KWheelPicker v-model="v4" :columns="timeColumns" :item-height="52" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KWheelPicker v-model="v5" :columns="timeColumns" disabled />
        </div>

        <h3 class="sp-sub">داده متنی (ماه و سال)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KWheelPicker v-model="v6" :columns="monthColumns" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                {{ monthColumns[0].values[v6[0] ?? 0] }} {{ monthColumns[1].values[v6[1] ?? 0] }}
            </div>
        </div>

        <h3 class="sp-sub">یک ستون</h3>
        <div class="sp-card" style="max-width: 260px;">
            <KWheelPicker v-model="v7" :columns="[levels]" />
            <div class="sp-vmodel" style="margin-top: 14px;">سطح: {{ levels.values[v7[0] ?? 0] }}</div>
        </div>

        <h3 class="sp-sub">کاربردی — انتخاب زمان یادآوری</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KWheelPicker v-model="reminder" :columns="reminderColumns" :rows="5" />
            <KButton :text="`یادآوری در ساعت ${pad(reminder[0] ?? 0)}:${pad(reminder[1] ?? 0)}`" @click="saved = true" />
            <div v-if="saved" class="sp-vmodel">یادآوری ذخیره شد ✅</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KWheelPicker from '../../ui-kit/components/KWheelPicker.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { KWheelColumn } from '../../ui-kit/components/KWheelPicker.vue'

const pad = (n: number) => String(n).padStart(2, '0')
const hours = Array.from({ length: 24 }, (_, i) => pad(i))
const minutes = Array.from({ length: 60 }, (_, i) => pad(i))

const timeColumns: KWheelColumn[] = [
    { key: 'hour', values: hours },
    { key: 'minute', values: minutes },
]

const threeColumns: KWheelColumn[] = [
    ...timeColumns,
    { key: 'second', values: minutes },
]

const monthColumns: KWheelColumn[] = [
    { key: 'month', values: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'] },
    { key: 'year', values: ['۱۴۰۳', '۱۴۰۴', '۱۴۰۵', '۱۴۰۶'] },
]

const levels: KWheelColumn = {
    key: 'level',
    values: ['مبتدی', 'متوسط', 'پیشرفته', 'آیلتس'],
}

const reminderColumns: KWheelColumn[] = [
    { key: 'hour', values: hours },
    { key: 'minute', values: minutes.filter(m => m.endsWith('0') || m.endsWith('5')) },
]

const v1 = ref<number[]>([8, 30])
const v2 = ref<number[]>([21, 15, 0])
const v3 = ref<number[]>([13, 45])
const v4 = ref<number[]>([10, 20])
const v5 = ref<number[]>([9, 0])
const v6 = ref<number[]>([4, 1])
const v7 = ref<number[]>([1])
const reminder = ref<number[]>([7, 30])

const changes = ref(0)
const onChange = () => { changes.value++ }

const saved = ref(false)
</script>
