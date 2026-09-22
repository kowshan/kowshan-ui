<template>
    <div class="sp">
        <h2 class="sp-title">KTagInput</h2>

        <h3 class="sp-sub">پایه — تگ آزاد</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput v-model="t1" label="برچسب‌ها" hint="با Enter یا کاما اضافه کنید" @tag-add="onAdd" @tag-remove="onRemove" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                tags: {{ t1.join('، ') || '—' }} — افزودن: {{ added ?? '—' }} — حذف: {{ removed ?? '—' }}
            </div>
        </div>

        <h3 class="sp-sub">با پیشنهادها (options)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput v-model="t2" :options="skills" label="مهارت‌ها" placeholder="تایپ کنید تا پیشنهاد ببینید…" />
        </div>

        <h3 class="sp-sub">بدون تگ آزاد (فقط از پیشنهادها)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput v-model="t3" :options="languages" :allow-custom="false" label="زبان‌های تدریس" />
        </div>

        <h3 class="sp-sub">آیتم‌های شیئی (valueKey / labelKey)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput
                v-model="t4"
                :options="teachers"
                value-key="id"
                label-key="name"
                label="مدرس‌های دوره"
            />
            <div class="sp-vmodel" style="margin-top: 14px;">شناسه‌ها: {{ t4.join('، ') || '—' }}</div>
        </div>

        <h3 class="sp-sub">سقف تعداد تگ (maxTags = 3)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput v-model="t5" :max-tags="3" label="حداکثر ۳ تگ" :options="skills" />
        </div>

        <h3 class="sp-sub">رنگ‌های تگ</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KTagInput v-model="t6" tag-color="green" label="سبز" :options="skills" />
            <KTagInput v-model="t6" tag-color="blue" label="آبی" :options="skills" />
            <KTagInput v-model="t6" tag-color="purple" label="بنفش" :options="skills" />
            <KTagInput v-model="t6" tag-color="gray" label="خاکستری" :options="skills" />
        </div>

        <h3 class="sp-sub">جداکننده سفارشی (;) و پیش‌فرض (,)</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KTagInput v-model="t7" delimiter="," label="با کاما" />
            <KTagInput v-model="t8" delimiter=";" label="با نقطه‌ویرگول" />
        </div>

        <h3 class="sp-sub">الزامی، غیرفعال و فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 20px;">
            <KTagInput v-model="t9" label="الزامی" required />
            <KTagInput v-model="t10" label="غیرفعال" disabled />
            <KTagInput v-model="t11" label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">اسلات سفارشی تگ</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KTagInput v-model="t12" :options="skills" label="تگ‌های سفارشی">
                <template #tag="{ tag }">
                    <span
                        style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 999px; background: var(--k-primary-light); color: var(--k-primary); font-size: 0.72rem;"
                    >
                        ★ {{ tag }}
                    </span>
                </template>
            </KTagInput>
        </div>

        <h3 class="sp-sub">فرم کاربردی — پروفایل مدرس</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KTextInput v-model="form.name" label="نام مدرس" />
            <KTagInput v-model="form.skills" :options="skills" label="مهارت‌ها" :max-tags="5" />
            <KTagInput v-model="form.langs" :options="languages" :allow-custom="false" label="زبان‌ها" />
            <KButton :text="form.skills.length && form.langs.length ? 'ذخیره پروفایل' : 'تگ‌ها را کامل کنید'" :disabled="!form.skills.length || !form.langs.length" @click="save" />
            <div v-if="saved" class="sp-vmodel">{{ saved }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KTagInput from '../../ui-kit/components/KTagInput.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const skills = ['گرامر', 'مکالمه', 'آیلتس', 'تلفظ', 'تولفل', 'نوشتار', 'شنیداری']
const languages = ['انگلیسی', 'آلمانی', 'فرانسوی', 'اسپانیایی', 'ترکی']
const teachers = [
    { id: 't1', name: 'سارا محمدی' },
    { id: 't2', name: 'رضا کریمی' },
    { id: 't3', name: 'مینا رستمی' },
    { id: 't4', name: 'امیر تهرانی' },
]

const t1 = ref<string[]>([])
const t2 = ref<string[]>(['گرامر'])
const t3 = ref<string[]>(['انگلیسی'])
const t4 = ref<string[]>(['t2'])
const t5 = ref<string[]>(['گرامر', 'مکالمه'])
const t6 = ref<string[]>(['گرامر', 'آیلتس'])
const t7 = ref<string[]>([])
const t8 = ref<string[]>([])
const t9 = ref<string[]>([])
const t10 = ref<string[]>(['گرامر', 'مکالمه'])
const t11 = ref<string[]>(['آیلتس'])
const t12 = ref<string[]>(['گرامر', 'تلفظ'])

const added = ref<string | null>(null)
const removed = ref<string | null>(null)
const onAdd = (tag: any) => { added.value = String(tag) }
const onRemove = (tag: any) => { removed.value = String(tag) }

const form = reactive({ name: '', skills: [] as string[], langs: [] as string[] })
const saved = ref('')
const save = () => {
    saved.value = `${form.name || 'بدون نام'} — ${form.skills.length} مهارت — ${form.langs.join('، ')}`
}
</script>
