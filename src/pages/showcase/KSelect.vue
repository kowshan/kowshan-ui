<template>
    <div class="sp">
        <h2 class="sp-title">KSelect</h2>

        <h3 class="sp-sub">پایه — آرایه رشته‌ای</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect v-model="v1" :options="levels" label="سطح دوره" placeholder="یک سطح انتخاب کنید" @change="onChange" />
            <div class="sp-vmodel" style="margin-top: 14px;">انتخاب: {{ v1 ?? '—' }} — آخرین change: {{ lastChange ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با برچسب و راهنما</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect v-model="v2" :options="levels" label="سطح" hint="سطح پیشنهادی آزمون تعیین سطح" />
        </div>

        <h3 class="sp-sub">آرایه آیتم‌های شیئی (object)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect
                v-model="v3"
                :options="courses"
                value-key="id"
                label-key="title"
                label="دوره"
                clearable
            />
            <div class="sp-vmodel" style="margin-top: 14px;">شناسه: {{ v3 ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">قابل جستجو</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect
                v-model="v4"
                :options="cities"
                label="شهر"
                searchable
                search-placeholder="نام شهر…"
                placeholder="جستجو کنید"
            />
        </div>

        <h3 class="sp-sub">قابل پاک‌کردن (clearable)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect v-model="v5" :options="levels" label="سطح" clearable />
            <div class="sp-vmodel" style="margin-top: 14px;">مقدار: {{ v5 ?? 'خالی' }}</div>
        </div>

        <h3 class="sp-sub">گروه‌بندی‌شده (groupBy)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect
                v-model="v6"
                :options="grouped"
                value-key="id"
                label-key="title"
                group-by="category"
                label="دوره"
                searchable
            />
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect v-model="v7" :options="levels" label="در حال دریافت…" :loading="true" />
        </div>

        <h3 class="sp-sub">غیرفعال و فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 20px;">
            <KSelect v-model="v8" :options="levels" label="غیرفعال" disabled />
            <KSelect v-model="v9" :options="levels" label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">الزامی + اعتبارسنجی (validate-on)</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 20px;">
            <KSelect
                v-model="v10"
                :options="cities"
                label="blur — فقط وقتی از فیلد خارج شوی"
                placeholder="انتخاب کنید"
                required
                :rules="[{ required: true, message: 'انتخاب شهر الزامی است' }]"
                validate-on="blur"
            />
            <KSelect
                v-model="v10b"
                :options="cities"
                label="input — همان لحظه انتخاب"
                placeholder="انتخاب کنید"
                required
                :rules="[{ required: true, message: 'انتخاب شهر الزامی است' }]"
                validate-on="input"
            />
            <KSelect
                v-model="v10c"
                :options="cities"
                label="both — پیش‌فرض"
                placeholder="انتخاب کنید"
                required
                :rules="[{ required: true, message: 'انتخاب شهر الزامی است' }]"
            />
            <div class="sp-vmodel">مقادیر: {{ v10 ?? '—' }} / {{ v10b ?? '—' }} / {{ v10c ?? '—' }}</div>
        </div>

        <h3 class="sp-sub">با آیکون چپ و راست</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 20px;">
            <KSelect v-model="v11" :options="levels" label="با آیکون" :left-icon="GraduationCap" />
            <KSelect v-model="v12" :options="levels" label="با آیکون راست" :right-icon="Star" />
        </div>

        <h3 class="sp-sub">جستجوی ناهمگام (asyncSearch)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect
                v-model="v13"
                :options="[]"
                :async-search="fakeSearch"
                :search-debounce="400"
                label="دانش‌آموز"
                searchable
                placeholder="نام را بنویسید…"
            />
            <div class="sp-vmodel" style="margin-top: 14px;">
                انتخاب: {{ v13 ?? '—' }} — {{ searchCalls }} درخواست
            </div>
        </div>

        <h3 class="sp-sub">ارتفاع فهرست سفارشی و فهرست خالی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 20px;">
            <KSelect v-model="v14" :options="cities" label="فهرست بلند (۱۲۰px)" max-height="120px" searchable />
            <KSelect v-model="v15" :options="[]" label="بدون گزینه" placeholder="گزینه‌ای وجود ندارد" />
        </div>

        <h3 class="sp-sub">ارقام فارسی — نرمال‌سازی جستجو</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSelect v-model="v16" :options="numbered" label="گروه" searchable search-placeholder="مثلاً ۱۲ را بنویسید" />
        </div>

        <h3 class="sp-sub">فرم کاربردی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.name" label="نام و نام خانوادگی" />
            <KSelect v-model="form.level" :options="levels" label="سطح زبان" required :rules="[{ required: true, message: 'سطح را انتخاب کنید' }]" validate-on="blur" />
            <KSelect v-model="form.course" :options="courses" value-key="id" label-key="title" label="دوره" searchable clearable />
            <KButton text="ثبت‌نام" @click="submit" />
            <div v-if="result" class="sp-vmodel">{{ result }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { GraduationCap, Star } from 'lucide-vue-next'
import KSelect from '../../ui-kit/wrappers/KSelect.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const levels = ['مبتدی', 'متوسط', 'پیشرفته', 'آیلتس']

const courses = [
    { id: 'c1', title: 'مکالمه مقدماتی' },
    { id: 'c2', title: 'گرامر پیشرفته' },
    { id: 'c3', title: 'آیلتس فشرده' },
    { id: 'c4', title: 'کارگاه تلفظ' },
]

const cities = [
    'تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'قم', 'اهواز', 'رشت', 'یزد',
]

const grouped = [
    { id: 'g1', title: 'مکالمه مقدماتی', category: 'زبان عمومی' },
    { id: 'g2', title: 'گرامر پیشرفته', category: 'زبان عمومی' },
    { id: 'g3', title: 'آیلتس فشرده', category: 'آزمون‌ها' },
    { id: 'g4', title: 'تولفل فشرده', category: 'آزمون‌ها' },
    { id: 'g5', title: 'دوره کودکان', category: 'کودکان' },
]

const numbered = ['گروه ۱۲', 'گروه ۲۴', 'گروه ۳۶', 'گروه ۴۸']

const v1 = ref<string | null>(null)
const v2 = ref<string | null>('متوسط')
const v3 = ref<string | null>('c2')
const v4 = ref<string | null>('تهران')
const v5 = ref<string | null>('پیشرفته')
const v6 = ref<string | null>('g3')
const v7 = ref<string | null>(null)
const v8 = ref<string | null>('مبتدی')
const v9 = ref<string | null>('آیلتس')
const v10 = ref<string | null>(null)
const v10b = ref<string | null>(null)
const v10c = ref<string | null>(null)
const v11 = ref<string | null>('متوسط')
const v12 = ref<string | null>('پیشرفته')
const v13 = ref<string | null>(null)
const v14 = ref<string | null>(null)
const v15 = ref<string | null>(null)
const v16 = ref<string | null>(null)

const lastChange = ref<string | null>(null)
const onChange = (v: any) => { lastChange.value = String(v) }

const students = ['سارا محمدی', 'رضا کریمی', 'مینا رستمی', 'امیر تهرانی', 'نگار احمدی', 'حسین نوری']
const searchCalls = ref(0)
const fakeSearch = async (q: string) => {
    searchCalls.value++
    await new Promise(r => setTimeout(r, 300))
    return students.filter(s => s.includes(q)).map(s => ({ id: s, title: s }))
}

const form = reactive({ name: '', level: null as string | null, course: null as string | null })
const result = ref('')
const submit = () => {
    result.value = form.name && form.level && form.course
        ? `${form.name} — ${form.level} — دوره ${form.course}`
        : 'همه فیلدها را کامل کنید'
}
</script>
