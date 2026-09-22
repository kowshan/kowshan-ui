<template>
    <div class="sp">
        <h2 class="sp-title">KToggle</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KToggle v-model="t1" label="فعال‌سازی اعلان‌ها" @change="onChange" />
            <div class="sp-vmodel">وضعیت: {{ t1 ? 'روشن' : 'خاموش' }} — آخرین change: {{ lastChange === null ? '—' : (lastChange ? 'روشن' : 'خاموش') }}</div>
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KToggle v-model="t2" size="sm" label="کوچک" />
            <KToggle v-model="t2" size="md" label="متوسط" />
            <KToggle v-model="t2" size="lg" label="بزرگ" />
        </div>

        <h3 class="sp-sub">با متن روشن/خاموش</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KToggle v-model="t3" label="حالت تعمیر" on-text="فعال" off-text="غیرفعال" />
            <KToggle v-model="t4" label="حالت شبانه" on-text="روشن" off-text="خاموش" />
        </div>

        <h3 class="sp-sub">رنگ سفارشی</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KToggle v-model="t5" label="سبز (پیش‌فرض)" />
            <KToggle v-model="t5" label="بنفش" checked-color="#6366f1" />
            <KToggle v-model="t5" label="نارنجی" checked-color="#f59e0b" />
            <KToggle v-model="t5" label="قرمز" checked-color="#ef4444" />
        </div>

        <h3 class="sp-sub">غیرفعال (روشن و خاموش)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KToggle v-model="t6" label="غیرفعال — روشن" disabled />
            <KToggle v-model="t7" label="غیرفعال — خاموش" disabled />
        </div>

        <h3 class="sp-sub">بدون برچسب و با aria-label</h3>
        <div class="sp-card">
            <KToggle v-model="t8" aria-label="فعال‌سازی حالت فشرده" />
        </div>

        <h3 class="sp-sub">فهرست تنظیمات</h3>
        <div class="sp-card" style="max-width: 560px;">
            <div
                v-for="s in settings"
                :key="s.key"
                style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--k-border);"
            >
                <div>
                    <div style="font-size: 0.85rem;">{{ s.label }}</div>
                    <div style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ s.desc }}</div>
                </div>
                <KToggle v-model="flags[s.key]" :aria-label="s.label" />
            </div>
            <div class="sp-vmodel" style="margin-top: 14px;">
                روشن‌ها: {{ Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('، ') || '—' }}
            </div>
        </div>

        <h3 class="sp-sub">فرم — ذخیره تغییرات</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 18px;">
            <KToggle v-model="form.notify" label="اعلان ایمیلی" />
            <KToggle v-model="form.sms" label="پیامک یادآوری کلاس" />
            <KToggle v-model="form.public" label="پروفایل عمومی" />
            <KButton text="ذخیره تنظیمات" @click="saved = true" />
            <div v-if="saved" class="sp-vmodel">
                ذخیره شد — ایمیل: {{ form.notify ? 'روشن' : 'خاموش' }} / پیامک: {{ form.sms ? 'روشن' : 'خاموش' }} / عمومی: {{ form.public ? 'روشن' : 'خاموش' }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KToggle from '../../ui-kit/wrappers/KToggle.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const t1 = ref(true)
const t2 = ref(true)
const t3 = ref(false)
const t4 = ref(true)
const t5 = ref(true)
const t6 = ref(true)
const t7 = ref(false)
const t8 = ref(false)

const lastChange = ref<boolean | null>(null)
const onChange = (v: boolean) => { lastChange.value = v }

const settings = [
    { key: 'dark', label: 'حالت تیره', desc: 'ظاهر تیره در همه صفحات' },
    { key: 'compact', label: 'نمای فشرده', desc: 'ردیف‌های جدول کوچک‌تر' },
    { key: 'beta', label: 'ویژگی‌های آزمایشی', desc: 'دسترسی زودتر به قابلیت‌های جدید' },
    { key: 'sounds', label: 'صدای اعلان', desc: 'پخش صدا هنگام پیام جدید' },
]

const flags = reactive<Record<string, boolean>>({
    dark: false,
    compact: true,
    beta: false,
    sounds: true,
})

const form = reactive({ notify: true, sms: false, public: false })
const saved = ref(false)
</script>
