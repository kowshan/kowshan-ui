<template>
    <DemoSection
        id="advanced"
        index="15"
        title="پیشرفته"
        description="اتوکامپلیت، رنگ، تلفن، فرم اعتبارسنجی‌شده، منوی راست‌کلیک، تأیید، اعلان، درخت سازمانی و واردکننده CSV"
    >
        <!-- Tier A: inputs -->
        <p class="demo-caption">ورودی‌های پیشرفته — اتوکامپلیت، رنگ، تلفن و جستجو</p>
        <div class="demo-grid-2">
            <div class="demo-stack">
                <KAutocomplete
                    v-model="city"
                    :options="cities"
                    placeholder="جستجوی شهر…"
                    label=""
                    @select="onCity"
                />
                <p class="demo-caption-note">شهر انتخاب‌شده: {{ city || '—' }} · رویداد search در کنسول</p>
            </div>

            <div class="demo-stack">
                <div class="demo-inline">
                    <KColorPicker v-model="brandColor" />
                    <KCopyButton :text="brandColor" label="کپی" />
                </div>
                <p class="demo-caption-note">رنگ برند: <code>{{ brandColor }}</code></p>
            </div>

            <div class="demo-stack">
                <KPhoneInput v-model="phone" label="شماره موبایل" hint="با +98 یا ارقام فارسی هم وارد کنید" />
                <p class="demo-caption-note">مقدار ذخیره‌شده: <code>{{ phone || '—' }}</code></p>
            </div>

            <div class="demo-stack">
                <KSearchInput v-model="searchQ" placeholder="جستجوی مشتری…" @search="onSearch" />
                <p class="demo-caption-note">آخرین جستجو (با تأخیر): {{ lastSearch || '—' }}</p>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Tier A: KForm -->
        <p class="demo-caption">فرم اعتبارسنجی‌شده — نام اجباری + موبایل معتبر (پس از submit)</p>
        <div class="demo-center">
            <KForm
                :model="formModel"
                :rules="formRules"
                class="demo-form"
                @submit="onFormSubmit"
                @invalid="onFormInvalid"
            >
                <KTextInput v-model="formModel.name" label="نام و نام خانوادگی" placeholder="مثلاً علی رضایی" />
                <KPhoneInput v-model="formModel.phone" label="شماره موبایل" />
                <template #actions>
                    <button type="submit" class="k-demo-btn">
                        <Send :size="14" /> ثبت اطلاعات
                    </button>
                </template>
            </KForm>
        </div>

        <hr class="demo-divider" />

        <!-- Tier B: overlays & feedback -->
        <p class="demo-caption">بازخورد و پوشش‌ها — اسپینر، تأیید، اعلان، منوی راست‌کلیک</p>
        <div class="demo-grid-3">
            <div class="demo-stack">
                <div class="demo-inline">
                    <KSpinner size="sm" />
                    <KSpinner size="md" />
                    <KSpinner size="lg" />
                </div>
                <p class="demo-caption-note">اسپینر در سه اندازه</p>
            </div>

            <div class="demo-stack">
                <button type="button" class="k-demo-btn" @click="onConfirm">
                    <Trash2 :size="14" /> حذف سند (confirm)
                </button>
                <p class="demo-caption-note">دکمه → await confirm → پیام نتیجه</p>
            </div>

            <div class="demo-stack">
                <div class="demo-center">
                    <KNotificationBell :items="notifications" @read="onRead" @read-all="onReadAll" />
                </div>
                <p class="demo-caption-note">۴ اعلان — کلیک روی مورد، آن را خوانده می‌کند</p>
            </div>
        </div>

        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">منوی راست‌کلیک — روی کارت کلیک راست کنید</p>
                <KContextMenu :items="menuItems" @select="onMenuSelect">
                    <div class="demo-cm-target">کلیک راست کنید</div>
                </KContextMenu>
            </div>
            <div class="demo-stack">
                <p class="demo-caption">صفحه وضعیت</p>
                <KResultPage
                    status="success"
                    title="پرداخت با موفقیت انجام شد"
                    description="کد رهگیری ۱۴۵۲-۸۸۱۲۱ — رسید برای شما پیامک شد."
                />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Tier D: ERP -->
        <p class="demo-caption">درخت سازمانی — کلیک روی رئیس، شعبه‌ها را باز/بسته می‌کند</p>
        <div class="demo-center">
            <KOrgChart :nodes="orgNodes" @select="onOrgSelect" />
        </div>

        <hr class="demo-divider" />

        <p class="demo-caption">واردکننده CSV — متن آماده شده، «ادامه» را بزنید و نگاشت را بررسی کنید</p>
        <div class="demo-center">
            <KImportWizard
                :fields="importFields"
                :initial-text="sampleCsv"
                @imported="onImported"
            />
        </div>

        <hr class="demo-divider" />

        <div class="demo-grid-2">
            <div class="demo-stack">
                <p class="demo-caption">پنل قابل تغییر اندازه (SplitPane) — دستگیره را بکشید</p>
                <KSplitPane v-model:size="splitPct" :min="20" :max="80" class="demo-split">
                    <template #first>
                        <div class="demo-split-pane is-a">پنل اول — {{ faNum(splitPct) }}٪</div>
                    </template>
                    <template #second>
                        <div class="demo-split-pane is-b">پنل دوم — {{ faNum(100 - splitPct) }}٪</div>
                    </template>
                </KSplitPane>
            </div>

            <div class="demo-stack">
                <p class="demo-caption">نمایشگر JSON — روی گره‌ها کلیک کنید</p>
                <KJsonViewer :data="jsonSample" root-label="response" />
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, Pencil, Send, Trash2 } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KAutocomplete from '../ui-kit/components/KAutocomplete.vue'
import KColorPicker from '../ui-kit/components/KColorPicker.vue'
import KPhoneInput from '../ui-kit/components/KPhoneInput.vue'
import KSearchInput from '../ui-kit/components/KSearchInput.vue'
import KForm from '../ui-kit/components/KForm.vue'
import KSpinner from '../ui-kit/components/KSpinner.vue'
import KNotificationBell, { type KNotification } from '../ui-kit/components/KNotificationBell.vue'
import KContextMenu, { type KContextMenuItem } from '../ui-kit/components/KContextMenu.vue'
import KResultPage from '../ui-kit/components/KResultPage.vue'
import KOrgChart, { type KOrgNodeData } from '../ui-kit/components/KOrgChart.vue'
import KImportWizard, { type KImportField } from '../ui-kit/components/KImportWizard.vue'
import KSplitPane from '../ui-kit/components/KSplitPane.vue'
import KJsonViewer from '../ui-kit/components/KJsonViewer.vue'
import KCopyButton from '../ui-kit/components/KCopyButton.vue'
import KTextInput from '../ui-kit/wrappers/KTextInput.vue'
import type { ValidationRules } from '../ui-kit/types'
import { useModalStore } from '../ui-kit/stores/modalStore'
import { useToast } from '../ui-kit/composables/useToast'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

/* ---- autocomplete ---- */
const cities = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'اهواز', 'رشت', 'کرمانشاه', 'ارومیه', 'زاهدان']
const city = ref('')
const onCity = (o: any) => { useToast.info(`شهر ${o.label} انتخاب شد`) }

/* ---- color ---- */
const brandColor = ref('#1db954')

/* ---- phone ---- */
const phone = ref('')

/* ---- search ---- */
const searchQ = ref('')
const lastSearch = ref('')
const onSearch = (q: string) => { lastSearch.value = q }

/* ---- form ---- */
const formModel = ref<Record<string, any>>({ name: '', phone: '' })
const formRules: Record<string, ValidationRules> = {
    name: [{ required: true, message: 'نام الزامی است' }],
    phone: [{ pattern: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست' }]
}
const onFormSubmit = () => {
    useToast.success(`اطلاعات «${formModel.value.name}» ثبت شد`)
    formModel.value = { name: '', phone: '' }
}
const onFormInvalid = () => {
    useToast.error('فرم را بررسی کنید — خطاها نمایش داده شده‌اند')
}

/* ---- confirm ---- */
const onConfirm = async () => {
    const ok = await useModalStore().confirm({
        title: 'حذف سند',
        message: 'این سند برای همیشه حذف می‌شود و قابل بازگشت نیست.',
        confirmText: 'حذف',
        cancelText: 'انصراف',
        variant: 'danger'
    })
    useToast[ok ? 'success' : 'info'](ok ? 'سند حذف شد' : 'عملیات لغو شد')
}

/* ---- notifications ---- */
const notifications = ref<KNotification[]>([
    { id: 1, title: 'قرارداد جدید ثبت شد', message: 'سند «آپارتمان زعفرانیه» توسط مریم ثبت شد', time: '۵ دقیقه پیش' },
    { id: 2, title: 'پرداخت موفق', message: 'واریز ۲۵۰٬۰۰۰٬۰۰۰ تومان از ملت', time: '۱ ساعت پیش', type: 'success' },
    { id: 3, title: 'تمدید اعتبار سند', message: 'اعتبار سند شماره ۱۴۲ تا ۳ روز دیگر', time: 'دیروز', type: 'warning' },
    { id: 4, title: 'خطای پرداخت', message: 'تراکنش ۸۹۱۲ ناموفق بود', time: 'دیروز', type: 'error', read: true },
])
const onRead = (n: KNotification) => { n.read = true }
const onReadAll = () => { notifications.value.forEach(n => { n.read = true }) }

/* ---- context menu ---- */
const menuItems: KContextMenuItem[] = [
    { id: 'view', label: 'مشاهده', icon: Eye },
    { id: 'edit', label: 'ویرایش', icon: Pencil },
    { id: 'div1', divider: true },
    { id: 'delete', label: 'حذف', icon: Trash2, danger: true },
]
const onMenuSelect = (id: string) => {
    useToast[id === 'delete' ? 'warning' : 'info'](id === 'delete' ? 'حذف از منوی راست‌کلیک' : `عملیات ${id}`)
}

/* ---- org chart ---- */
const orgNodes: KOrgNodeData[] = [
    {
        id: 'ceo', name: 'مهدی احمدی', role: 'مدیرعامل', badge: 'مدیر',
        children: [
            {
                id: 'sales', name: 'علی رضایی', role: 'مدیر فروش', badge: '۶ نفر',
                children: [
                    { id: 's1', name: 'سارا محمدی', role: 'کارشناس فروش' },
                    { id: 's2', name: 'مریم کریمی', role: 'کارشناس فروش' },
                ]
            },
            {
                id: 'ops', name: 'حسین نادری', role: 'مدیر عملیات', badge: '۴ نفر',
                children: [
                    { id: 'o1', name: 'رضا قاسمی', role: 'کارشناس قراردادها' },
                    { id: 'o2', name: 'نگار موسوی', role: 'مسئول پذیرش' },
                ]
            },
            { id: 'fin', name: 'زهرا حسینی', role: 'مدیر مالی', badge: '۲ نفر' },
        ]
    }
]
const onOrgSelect = (node: KOrgNodeData) => { console.log('org select', node.name) }

/* ---- import wizard ---- */
const importFields: KImportField[] = [
    { key: 'name', label: 'نام' },
    { key: 'phone', label: 'موبایل' },
    { key: 'city', label: 'شهر' },
]

const sampleCsv = `نام,موبایل,شهر\nعلی رضایی,09121234567,تهران\nسارا محمدی,09129876543,اصفهان\nمریم کریمی,09135556677,شیراز`
const onImported = (rows: Record<string, any>[]) => {
    useToast.success(`${rows.length} مشتری وارد شد — نمونه: ${rows[0]?.name || ''}`)
}

/* ---- split pane ---- */
const splitPct = ref(45)

/* ---- json viewer ---- */
const jsonSample = {
    status: 'success',
    data: {
        lead: { id: 128, name: 'علی رضایی', score: 84, tags: ['خریدار', 'تهران'] },
        meta: { source: 'سایت', created_at: '1404/05/18' },
        n: 128000,
        ok: true,
        nothing: null,
    }
}
</script>

<style scoped>
.demo-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
}

.demo-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-center {
    display: flex;
    justify-content: center;
}

.demo-inline {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.demo-form {
    max-width: 340px;
}

.k-demo-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 10px;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s ease;
}

.k-demo-btn:hover { filter: brightness(1.08); }

.demo-cm-target {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90px;
    border: 1.5px dashed var(--k-border);
    border-radius: 12px;
    color: var(--k-text-secondary);
    font-size: 0.78rem;
    cursor: context-menu;
    background: var(--k-surface);
}

.demo-split {
    height: 220px;
}

.demo-split-pane {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 0.78rem;
    font-weight: 700;
}

.demo-split-pane.is-a {
    background: var(--k-primary-light);
    color: var(--k-primary);
}

.demo-split-pane.is-b {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}
</style>
