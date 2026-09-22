<template>
    <div class="sp">
        <h2 class="sp-title">KMultiSelect</h2>

        <h3 class="sp-sub">پایه (جستجو + انتخاب همه)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KMultiSelect
                v-model="picked"
                :options="cities"
                label="شهرهای تحت پوشش"
                hint="چند شهر را انتخاب کنید"
                :searchable="true"
                :show-select-all="true"
                :clearable="true"
                @change="onChange"
            />
            <div class="sp-vmodel">v-model: {{ picked.join('، ') || '—' }}</div>
            <div class="sp-vmodel">change: {{ lastChange }}</div>
        </div>

        <h3 class="sp-sub">محدودیت تعداد (حداکثر ۲ مورد)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KMultiSelect v-model="limited" :options="skills" label="مهارت‌ها" :max-items="2" :searchable="true" />
            <div class="sp-vmodel">v-model: {{ limited.join('، ') || '—' }}</div>
        </div>

        <h3 class="sp-sub">ایجاد آیتم جدید (creatable)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KMultiSelect v-model="tags" :options="tagsOptions" label="برچسب‌ها" :creatable="true" :searchable="true" placeholder="برچسب بنویسید و Enter بزنید" />
            <div class="sp-vmodel">v-model: {{ tags.join('، ') || '—' }}</div>
        </div>

        <h3 class="sp-sub">آیتم‌های آبجکتی (valueKey / labelKey)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KMultiSelect
                v-model="users"
                :options="userOptions"
                value-key="id"
                label-key="name"
                label="کاربران پروژه"
                :searchable="true"
                :show-select-all="true"
            />
            <div class="sp-vmodel">v-model: {{ users.join('، ') || '—' }}</div>
        </div>

        <h3 class="sp-sub">جستجوی سمت سرور (asyncSearch)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KMultiSelect
                v-model="remote"
                :async-search="fakeSearch"
                label="جستجوی محصول (تأخیر ۵۰۰ms)"
                :search-debounce="500"
                :searchable="true"
                placeholder="نام محصول را بنویسید…"
            />
            <div class="sp-vmodel">v-model: {{ remote.join('، ') || '—' }}</div>
        </div>

        <h3 class="sp-sub">حالت‌ها: غیرفعال، فقط‌خواندنی، بارگذاری، الزامی</h3>
        <div class="sp-card" style="max-width: 420px; display: flex; flex-direction: column; gap: 16px;">
            <KMultiSelect v-model="picked" :options="cities" label="غیرفعال" :disabled="true" />
            <KMultiSelect v-model="picked" :options="cities" label="فقط‌خواندنی" :readonly="true" />
            <KMultiSelect v-model="picked" :options="cities" label="در حال بارگذاری" :loading="true" />
            <KMultiSelect v-model="requiredPick" :options="cities" label="الزامی" :required="true" hint="انتخاب حداقل یک مورد الزامی است" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMultiSelect from '../../ui-kit/wrappers/KMultiSelect.vue'

const cities = ['تهران', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'کرج', 'یزد', 'رشت']
const skills = ['Vue', 'TypeScript', 'Laravel', 'Docker', 'SQL', 'Figma']
const tagsOptions = ['فوری', 'بک‌لاگ', 'بازاریابی']

const userOptions = [
    { id: 1, name: 'مریم احمدی' },
    { id: 2, name: 'علی رضایی' },
    { id: 3, name: 'حسین کریمی' },
    { id: 4, name: 'سارا نوری' },
]

const picked = ref<string[]>(['تهران', 'شیراز'])
const limited = ref<string[]>(['Vue'])
const tags = ref<string[]>(['فوری'])
const users = ref<number[]>([1])
const remote = ref<string[]>([])
const requiredPick = ref<string[]>([])
const lastChange = ref('—')

const onChange = (v: string[]) => { lastChange.value = v.join('، ') }

const allProducts = ['هدفون بی‌سیم', 'کیبورد مکانیکی', 'ماوس گیمینگ', 'پایه لپ‌تاپ', 'وب‌کم Full HD', 'هاب USB-C']

const fakeSearch = (query: string): Promise<string[]> =>
    new Promise(resolve => {
        setTimeout(() => resolve(allProducts.filter(p => p.includes(query))), 500)
    })
</script>
