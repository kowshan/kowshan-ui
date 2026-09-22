<template>
    <div class="sp">
        <h2 class="sp-title">KTextarea</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextarea v-model="v1" label="توضیحات دوره" />
            <KTextarea v-model="v2" label="با راهنما" hint="حداکثر ۳۰۰ کاراکتر — خلاصه بنویسید" />
            <KTextarea v-model="v3" placeholder="بدون برچسب، فقط placeholder" />
        </div>

        <h3 class="sp-sub">تعداد ردیف و ستون</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextarea v-model="v4" label="۲ ردیف" :rows="2" />
            <KTextarea v-model="v4" label="۶ ردیف" :rows="6" />
            <KTextarea v-model="v4" label="۱۰ ردیف" :rows="10" />
        </div>

        <h3 class="sp-sub">شمارنده کاراکتر (showCounter)</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextarea v-model="v5" label="با شمارنده" :maxlength="120" show-counter />
            <KTextarea v-model="v6" label="بدون شمارنده و با حداکثر طول" :maxlength="120" />
        </div>

        <h3 class="sp-sub">آیکون چپ و راست + قابل پاک‌کردن</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextarea v-model="v7" label="با آیکون راست" :right-icon="MessageSquare" clearable />
            <KTextarea v-model="v8" label="با آیکون چپ" :left-icon="FileText" />
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTextarea v-model="v9" label="در حال ذخیره…" loading />
        </div>

        <h3 class="sp-sub">غیرفعال، فقط‌خواندنی و الزامی</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextarea v-model="v10" label="غیرفعال" disabled />
            <KTextarea v-model="v11" label="فقط‌خواندنی" readonly />
            <KTextarea v-model="v12" label="الزامی" required />
        </div>

        <h3 class="sp-sub">اعتبارسنجی</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTextarea
                v-model="v13"
                label="توضیح کوتاه (حداقل ۲۰ کاراکتر)"
                required
                :rules="rules"
                validate-on="blur"
                show-counter
                :maxlength="200"
            />
        </div>

        <h3 class="sp-sub">متن بلند از پیش پر‌شده</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTextarea v-model="longText" label="سرفصل دوره" :rows="8" show-counter :maxlength="600" />
        </div>

        <h3 class="sp-sub">فرم کاربردی — ایجاد دوره</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.title" label="عنوان دوره" />
            <KTextarea v-model="form.desc" label="توضیحات" :rows="4" show-counter :maxlength="300" required :rules="rules" validate-on="blur" />
            <KButton :text="form.title && form.desc.length >= 20 ? 'ایجاد دوره' : 'فیلدها ناقص است'" :disabled="!form.title || form.desc.length < 20" @click="created = true" />
            <div v-if="created" class="sp-vmodel">دوره «{{ form.title }}» ایجاد شد.</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FileText, MessageSquare } from 'lucide-vue-next'
import KTextarea from '../../ui-kit/wrappers/KTextarea.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import type { ValidationRules } from '../../ui-kit/types'

const rules: ValidationRules = [
    { required: true, message: 'توضیحات الزامی است' },
    { validator: (v: string) => v.length >= 20 || 'حداقل ۲۰ کاراکتر بنویسید' },
]

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('متن نمونه برای آزمودن ارتفاع.')
const v5 = ref('متن کوتاه')
const v6 = ref('')
const v7 = ref('')
const v8 = ref('')
const v9 = ref('در حال ذخیره')
const v10 = ref('مقدار غیرفعال')
const v11 = ref('مقدار فقط‌خواندنی که کاربر نمی‌تواند تغییر دهد.')
const v12 = ref('')
const v13 = ref('')

const longText = ref(
    'این دوره برای زبان‌آموزان سطح A2 تا B1 طراحی شده است. در هر جلسه یک بخش گرامری کوتاه، یک تمرین شنیداری و یک فعالیت گفتاری گروهی انجام می‌شود.\n\nپیش‌نیاز: آشنایی مقدماتی با زمان حال ساده و گذشته ساده.'
)

const form = reactive({ title: '', desc: '' })
const created = ref(false)
</script>
