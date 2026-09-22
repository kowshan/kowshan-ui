<template>
    <div class="sp">
        <h2 class="sp-title">KFileInput</h2>

        <h3 class="sp-sub">پایه — یک فایل</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f1" label="پیوست" @change="onChange" @remove="onRemove" @error="onError" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                انتخاب‌شده: {{ fileText(f1) }}
            </div>
        </div>

        <h3 class="sp-sub">چند فایل (multiple)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f2" label="مدارک" multiple />
        </div>

        <h3 class="sp-sub">محدود به نوع فایل (accept)</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KFileInput v-model="f3" label="فقط تصویر" accept="image/*" />
            <KFileInput v-model="f4" label="فقط PDF" accept="application/pdf,.pdf" />
            <KFileInput v-model="f5" label="PDF یا Word" accept=".pdf,.doc,.docx" />
        </div>

        <h3 class="sp-sub">سقف حجم و تعداد</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KFileInput v-model="f6" label="حداکثر ۱۰۰ کیلوبایت" :max-size="100 * 1024" placeholder="فایلی کوچک‌تر از ۱۰۰KB انتخاب کنید…" />
            <KFileInput v-model="f7" label="حداکثر ۳ فایل" multiple :max-count="3" placeholder="حتی‌الامکان تصویر یا PDF" />
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f8" label="بارگذاری کارت ملی" required />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f9" label="غیرفعال" disabled />
        </div>

        <h3 class="sp-sub">مقدار متنی (فایل‌های قبلاً آپلود‌شده)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f10" label="فایل‌های ذخیره‌شده" multiple />
            <div class="sp-vmodel" style="margin-top: 14px;">{{ fileText(f10) }}</div>
        </div>

        <h3 class="sp-sub">خطاها (events)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KFileInput v-model="f11" label="تست خطا (فایل بزرگ یا نوع نامعتبر)" accept="image/*" :max-size="50 * 1024" @error="onError" />
            <div v-if="errorText" class="sp-vmodel" style="margin-top: 14px; color: var(--k-error);">{{ errorText }}</div>
        </div>

        <h3 class="sp-sub">فرم کاربردی — ثبت‌نام مدرس</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.name" label="نام مدرس" />
            <KFileInput v-model="form.resume" label="رزومه (PDF)" accept=".pdf" required />
            <KFileInput v-model="form.cert" label="مدارک تحصیلی" multiple :max-count="4" accept="image/*,.pdf" />
            <KButton :text="form.name && form.resume ? 'ارسال درخواست' : 'فیلدهای الزامی را پر کنید'" :disabled="!form.name || !form.resume" @click="sent = true" />
            <div v-if="sent" class="sp-vmodel">درخواست {{ form.name }} ارسال شد.</div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            تغییر: {{ changes }} بار — حذف: {{ removes }} بار
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KFileInput from '../../ui-kit/wrappers/KFileInput.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const f1 = ref<any>(null)
const f2 = ref<any>(null)
const f3 = ref<any>(null)
const f4 = ref<any>(null)
const f5 = ref<any>(null)
const f6 = ref<any>(null)
const f7 = ref<any>(null)
const f8 = ref<any>(null)
const f9 = ref<any>(null)
const f10 = ref<any>(['resume-1405.pdf', 'certificate.jpg'])
const f11 = ref<any>(null)

const changes = ref(0)
const removes = ref(0)
const errorText = ref('')

const onChange = () => { changes.value++ }
const onRemove = () => { removes.value++ }
const onError = (e: string) => { errorText.value = e }

const fileText = (v: any) => {
    if (!v) return '—'
    const list = Array.isArray(v) ? v : [v]
    if (!list.length) return '—'
    return list.map((f: any) => (f instanceof File ? `${f.name} (${Math.round(f.size / 1024)}KB)` : String(f))).join('، ')
}

const form = reactive({ name: '', resume: null as any, cert: null as any })
const sent = ref(false)
</script>
