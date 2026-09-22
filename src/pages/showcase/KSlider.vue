<template>
    <div class="sp">
        <h2 class="sp-title">KSlider</h2>
        <p class="sp-note">
            اسلایدر با جهت صفحه هم‌راستا است: در حالت راست‌به‌چپ کمینه سمت راست و پرشدگی از راست شروع می‌شود.
        </p>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider v-model="v1" label="میزان پیشرفت" @change="onChange" />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ v1 }} — آخرین change: {{ lastChange ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با برچسب و پنهان‌کردن مقدار</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 22px;">
            <KSlider v-model="v2" label="بدون نمایش مقدار" :show-value="false" />
            <KSlider v-model="v2" label="با نمایش مقدار" />
        </div>

        <h3 class="sp-sub">نمایش کرانه‌ها (showBounds)</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider v-model="v3" label="حجم کلاس" :min="5" :max="40" :show-bounds="true" suffix="نفر" />
        </div>

        <h3 class="sp-sub">پسوند (suffix)</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 22px;">
            <KSlider v-model="v4" label="درصد تخفیف" :max="70" suffix="٪" />
            <KSlider v-model="v5" label="مدت دوره" :min="1" :max="12" suffix="ماه" />
        </div>

        <h3 class="sp-sub">گام (step) و دقت اعشار</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 22px;">
            <KSlider v-model="v6" label="گام ۵" :step="5" />
            <KSlider v-model="v7" label="اعشار یک رقم" :min="0" :max="5" :step="0.5" :precision="1" suffix="ساعت" />
            <KSlider v-model="v8" label="گام بزرگ (۵۰ هزار)" :min="0" :max="2000000" :step="50000" />
        </div>

        <h3 class="sp-sub">بازه دو دستگیره (range)</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider v-model="v9" label="محدوده قیمت" range :min="0" :max="5000000" :step="50000" suffix="تومان" @change="onRangeChange" />
            <div class="sp-vmodel" style="margin-top: 14px;">از {{ rangeText }} تومان</div>
        </div>

        <h3 class="sp-sub">بازه با کرانه‌ها</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider v-model="v10" label="بازه سنی" range :min="12" :max="70" :step="1" :show-bounds="true" suffix="سال" />
        </div>

        <h3 class="sp-sub">غیرفعال و الزامی</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 22px;">
            <KSlider v-model="v11" label="غیرفعال" disabled />
            <KSlider v-model="v12" label="الزامی" required />
        </div>

        <h3 class="sp-sub">راهنمای زیر اسلایدر</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider
                v-model="v13"
                label="سطح دشواری"
                hint="این مقدار در پیشنهاد مسیر یادگیری استفاده می‌شود."
                :step="10"
            />
        </div>

        <h3 class="sp-sub">مقادیر مرزی</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 22px;">
            <KSlider v-model="v14" label="کمینه" :min="0" :max="100" :show-bounds="true" />
            <KSlider v-model="v15" label="بیشینه" :min="0" :max="100" :show-bounds="true" />
            <KSlider v-model="v16" label="بازه معکوس داده‌شده (خودکار مرتب می‌شود)" range :min="0" :max="100" />
        </div>

        <h3 class="sp-sub">کاربردی — فیلتر فروشگاه</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 24px;">
            <KSlider v-model="fPrice" label="حداکثر قیمت" :min="0" :max="3000000" :step="100000" suffix="تومان" />
            <KSlider v-model="fDuration" label="حداقل مدت دوره" :min="1" :max="40" suffix="ساعت" />
            <KSlider v-model="fLevel" label="سطح" :min="1" :max="5" :show-bounds="true" />
            <div class="sp-vmodel">
                فیلترها: تا {{ (fPrice / 1000).toFixed(0) }} هزار تومان — از {{ fDuration }} ساعت — سطح {{ fLevel }}
            </div>
        </div>

        <h3 class="sp-sub">زنده — با دکمه‌ها</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSlider v-model="live" label="مقدار زنده" />
            <div style="display: flex; gap: 8px; margin-top: 14px;">
                <KButton text="+۱۰" @click="live = Math.min(100, live + 10)" />
                <KButton text="−۱۰" @click="live = Math.max(0, live - 10)" />
                <KButton text="بازنشانی" :bg-color="'transparent'" @click="live = 50" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KSlider from '../../ui-kit/wrappers/KSlider.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const v1 = ref(35)
const v2 = ref(70)
const v3 = ref(20)
const v4 = ref(25)
const v5 = ref(6)
const v6 = ref(45)
const v7 = ref(2.5)
const v8 = ref(750000)
const v9 = ref<[number, number]>([800000, 3200000])
const v10 = ref<[number, number]>([22, 45])
const v11 = ref(60)
const v12 = ref(30)
const v13 = ref(40)
const v14 = ref(0)
const v15 = ref(100)
const v16 = ref<[number, number]>([80, 20])

const fPrice = ref(1800000)
const fDuration = ref(12)
const fLevel = ref(3)
const live = ref(50)

const lastChange = ref<number | null>(null)
const onCount = ref(0)

const onChange = (v: number | [number, number]) => {
    lastChange.value = Array.isArray(v) ? v[0] : v
}

const onRangeChange = () => { onCount.value++ }

const rangeText = computed(() => {
    const [lo, hi] = v9.value
    return `${lo.toLocaleString('fa-IR')} تا ${hi.toLocaleString('fa-IR')}`
})
</script>
