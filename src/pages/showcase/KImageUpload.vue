<template>
    <div class="sp">
        <h2 class="sp-title">KImageUpload</h2>

        <h3 class="sp-sub">پایه — یک تصویر</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KImageUpload v-model="i1" label="تصویر پروفایل" @change="onChange" @remove="onRemove" @error="onError" />
            <div class="sp-vmodel" style="margin-top: 14px;">فایل‌ها: {{ fileText(i1) }}</div>
        </div>

        <h3 class="sp-sub">اندازه تصویر (imageSize)</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 22px;">
            <KImageUpload v-model="i2" label="کوچک (۸۰px)" :image-size="80" />
            <KImageUpload v-model="i2" label="پیش‌فرض (۱۲۰px)" />
            <KImageUpload v-model="i2" label="بزرگ (۱۸۰px)" :image-size="180" />
        </div>

        <h3 class="sp-sub">چند تصویر (multiple)</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 22px;">
            <KImageUpload v-model="i3" label="گالری دوره" multiple />
            <KImageUpload v-model="i4" label="حداکثر ۴ تصویر" multiple :max-count="4" />
        </div>

        <h3 class="sp-sub">محدودیت حجم</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KImageUpload v-model="i5" label="حداکثر ۲۰۰ کیلوبایت" :max-size="200 * 1024" />
            <div v-if="errorText" class="sp-vmodel" style="margin-top: 14px; color: var(--k-error);">{{ errorText }}</div>
        </div>

        <h3 class="sp-sub">حالت بارگذاری (uploading)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KImageUpload v-model="i6" label="در حال آپلود روی سرور…" :uploading="true" />
        </div>

        <h3 class="sp-sub">الزامی و غیرفعال</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 22px;">
            <KImageUpload v-model="i7" label="کاور دوره (الزامی)" required />
            <KImageUpload v-model="i8" label="غیرفعال" disabled />
        </div>

        <h3 class="sp-sub">مقدار متنی (تصاویر قبلی)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KImageUpload v-model="i9" label="تصاویر ذخیره‌شده" multiple />
            <div class="sp-vmodel" style="margin-top: 14px;">{{ fileText(i9) }}</div>
        </div>

        <h3 class="sp-sub">فرم کاربردی — ایجاد دوره</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.title" label="عنوان دوره" />
            <KImageUpload v-model="form.cover" label="کاور (الزامی)" required accept="image/*" :max-size="500 * 1024" />
            <KImageUpload v-model="form.gallery" label="گالری" multiple :max-count="6" />
            <KButton :text="form.title && form.cover ? 'ایجاد دوره' : 'کاور را انتخاب کنید'" :disabled="!form.title || !form.cover" @click="created = true" />
            <div v-if="created" class="sp-vmodel">دوره «{{ form.title }}» با {{ galleryCount }} تصویر گالری ساخته شد.</div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            تغییر: {{ changes }} بار — حذف: {{ removes }} بار
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import KImageUpload from '../../ui-kit/wrappers/KImageUpload.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const i1 = ref<any>(null)
const i2 = ref<any>(null)
const i3 = ref<any>(null)
const i4 = ref<any>(null)
const i5 = ref<any>(null)
const i6 = ref<any>(null)
const i7 = ref<any>(null)
const i8 = ref<any>(null)
const i9 = ref<any>(['cover-1404.png', 'banner-1405.jpg'])

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

const form = reactive({ title: '', cover: null as any, gallery: null as any })
const created = ref(false)
const galleryCount = computed(() => {
    const g = form.gallery
    if (!g) return 0
    return Array.isArray(g) ? g.length : 1
})
</script>
