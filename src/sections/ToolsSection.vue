<template>
    <DemoSection
        id="tools"
        index="16"
        title="ابزار و دستیارها"
        description="درخت دسترسی، درخواست API، سئو، رمزنگاری حافظه، دیتابیس مرورگر و هش کردن لینک — همه به‌صورت کامپوزبل"
    >
        <!-- ─────────── Permission tree ─────────── -->
        <p class="demo-caption">مدیر دسترسی — گروه‌ها، زیردسترسی‌ها و راهنما؛ انتخاب گروه، همهٔ زیرمجموعه‌ها را انتخاب می‌کند</p>
        <div class="tools-grid tools-grid-perm">
            <div class="tools-card">
                <KPermissionTree v-model="permissions" :nodes="permissionGroups" />
            </div>

            <div class="tools-card">
                <p class="tools-card-title">دسترسی‌های انتخاب‌شده</p>
                <div v-if="permissions.length" class="tools-chips">
                    <span v-for="id in permissions" :key="id" class="tools-chip">
                        {{ permLabel(id) }}
                    </span>
                </div>
                <p v-else class="tools-empty">هیچ دسترسی‌ای انتخاب نشده است</p>
                <button class="k-demo-btn" type="button" @click="permissions = []">
                    پاک کردن همه
                </button>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- ─────────── Helper composables ─────────── -->
        <p class="demo-caption">کامپوزبل‌های کمکی — هر کارت یک ابزار مستقل است</p>

        <div class="tools-grid">
            <!-- API fetch -->
            <div class="tools-card">
                <p class="tools-card-title">useApiFetch</p>
                <p class="tools-card-desc">
                    درخواست به <code>/mock-data.json</code> با توکن و خطای لاراولی
                </p>
                <div class="tools-card-actions">
                    <button class="k-demo-btn" type="button" :disabled="api.loading.value" @click="loadApi">
                        {{ api.loading.value ? 'در حال دریافت…' : 'دریافت از سرور' }}
                    </button>
                </div>
                <div v-if="apiError" class="tools-note is-error">{{ apiError }}</div>
                <ul v-if="apiRows.length" class="tools-list">
                    <li v-for="row in apiRows" :key="row.id">
                        <span>{{ row.name }}</span>
                        <span class="tools-list-meta">{{ row.plan }} · {{ faNum(row.balance) }} تومان</span>
                    </li>
                </ul>
            </div>

            <!-- SEO -->
            <div class="tools-card">
                <p class="tools-card-title">useSeo</p>
                <p class="tools-card-desc">عنوان، توضیح، Open Graph و JSON-LD را روی صفحه اعمال می‌کند</p>
                <div class="tools-card-actions">
                    <button class="k-demo-btn" type="button" @click="applySeo">
                        اعمال سئوی نمونه
                    </button>
                </div>
                <p class="tools-note">
                    عنوان فعلی صفحه:
                    <code class="tools-code">{{ documentTitle }}</code>
                </p>
            </div>

            <!-- Storage encryption -->
            <div class="tools-card">
                <p class="tools-card-title">useStorageEncryption</p>
                <p class="tools-card-desc">AES-GCM + PBKDF2 — رمزنگاری واقعی در localStorage</p>
                <div class="tools-stack">
                    <input
                        v-model="vaultNote"
                        class="tools-input"
                        placeholder="متن محرمانه…"
                        @keyup.enter="saveVault"
                    />
                    <div class="tools-card-actions">
                        <button class="k-demo-btn" type="button" :disabled="vaultBusy" @click="saveVault">
                            ذخیرهٔ رمزنگاری‌شده
                        </button>
                        <button class="k-demo-btn is-ghost" type="button" :disabled="vaultBusy" @click="readVault">
                            خواندن
                        </button>
                    </div>
                </div>
                <p v-if="vaultResult" class="tools-note" :class="vaultResult.ok ? 'is-ok' : 'is-error'">
                    {{ vaultResult.text }}
                </p>
            </div>

            <!-- Browser DB -->
            <div class="tools-card">
                <p class="tools-card-title">useBrowserDb</p>
                <p class="tools-card-desc">پیش‌نویس فرم در IndexedDB — تا بسته شدن مرورگر می‌ماند</p>
                <div class="tools-stack">
                    <input
                        v-model="draftTitle"
                        class="tools-input"
                        placeholder="عنوان پیش‌نویس…"
                    />
                    <div class="tools-card-actions">
                        <button class="k-demo-btn" type="button" @click="saveDraft">
                            ذخیرهٔ پیش‌نویس
                        </button>
                        <button class="k-demo-btn is-ghost" type="button" @click="listDrafts">
                            فهرست
                        </button>
                    </div>
                </div>
                <ul v-if="drafts.length" class="tools-list">
                    <li v-for="d in drafts" :key="String(d.key)">
                        <span>{{ String(d.value) }}</span>
                        <button
                            class="tools-chip-btn"
                            type="button"
                            @click="removeDraft(String(d.key))"
                        >
                            حذف
                        </button>
                    </li>
                </ul>
                <p v-else class="tools-empty">هنوز پیش‌نویسی ذخیره نشده</p>
            </div>

            <!-- URL cipher -->
            <div class="tools-card">
                <p class="tools-card-title">useUrlCipher</p>
                <p class="tools-card-desc">آیدی را به توکن امضاشده برای لینک‌ها تبدیل می‌کند (مثلاً بازنشانی رمز)</p>
                <div class="tools-stack">
                    <input
                        v-model="urlId"
                        class="tools-input"
                        placeholder="آیدی (مثلاً 128)"
                        inputmode="numeric"
                    />
                    <div class="tools-card-actions">
                        <button class="k-demo-btn" type="button" @click="hashUrl">
                            هش کردن
                        </button>
                        <button class="k-demo-btn is-ghost" type="button" @click="unhashUrl">
                            بازگردانی
                        </button>
                    </div>
                </div>
                <p v-if="urlToken" class="tools-note">
                    <code class="tools-code is-break">{{ urlToken }}</code>
                </p>
                <p v-if="urlBack" class="tools-note is-ok">بازگردانی شد: {{ urlBack }}</p>
            </div>
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import KPermissionTree from '../ui-kit/components/KPermissionTree.vue'
import type { KPermissionNode } from '../ui-kit/components/KPermissionTree.vue'
import { useApiFetch } from '../ui-kit/composables/useApiFetch'
import { useSeo } from '../ui-kit/composables/useSeo'
import { useStorageEncryption } from '../ui-kit/composables/useStorageEncryption'
import { useBrowserDb } from '../ui-kit/composables/useBrowserDb'
import { useUrlCipher } from '../ui-kit/composables/useUrlCipher'
import { usePersianNumbers } from '../ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number | string) => toPersianDigits(String(n))

/* ── permission tree ─────────────────────────────── */
const permissionGroups: KPermissionNode[] = [
    {
        id: 'users',
        label: 'مدیریت کاربران',
        hint: 'دسترسی کامل به بخش کاربران',
        children: [
            { id: 'users.create', label: 'ایجاد کاربر', hint: 'ثبت کاربر جدید' },
            { id: 'users.edit', label: 'ویرایش کاربر', hint: 'تغییر اطلاعات و نقش' },
            { id: 'users.delete', label: 'حذف کاربر', hint: 'حذف دائمی — قابل بازگشت نیست', disabled: true },
            { id: 'users.roles', label: 'مدیریت نقش‌ها', hint: 'اختصاص نقش به کاربر' },
        ],
    },
    {
        id: 'content',
        label: 'مدیریت محتوا',
        hint: 'پست‌ها، دسته‌ها و دیدگاه‌ها',
        children: [
            { id: 'content.posts', label: 'پست‌ها', hint: 'انتشار و مدیریت پست‌ها' },
            { id: 'content.categories', label: 'دسته‌بندی‌ها' },
            { id: 'content.comments', label: 'دیدگاه‌ها', hint: 'تأیید و پاسخ به دیدگاه‌ها' },
        ],
    },
    {
        id: 'finance',
        label: 'مدیریت مالی',
        hint: 'فاکتور، تخفیف و گزارش',
        children: [
            { id: 'finance.invoices', label: 'فاکتورها' },
            { id: 'finance.discounts', label: 'کد تخفیف' },
            { id: 'finance.reports', label: 'گزارش‌ها', hint: 'فقط برای مدیران مالی' },
        ],
    },
]

const allPermLabels: Record<string, string> = {}
const flatten = (nodes: KPermissionNode[]) => {
    nodes.forEach(n => {
        allPermLabels[n.id] = n.label
        if (n.children?.length) flatten(n.children)
    })
}
flatten(permissionGroups)

/* seed a consistent state: «content» group fully checked, «users» partially (indeterminate) */
const permissions = ref<string[]>([
    'content', 'content.posts', 'content.categories', 'content.comments',
    'users.create', 'users.edit',
])
const permLabel = (id: string) => allPermLabels[id] ?? id

/* ── useApiFetch ─────────────────────────────────── */
const api = useApiFetch({ baseUrl: '' })
const apiRows = ref<any[]>([])
const apiError = ref('')

const loadApi = async () => {
    apiError.value = ''
    apiRows.value = []
    try {
        const res = await api.get<{ data: { customers: any[] } }>('/mock-data.json')
        apiRows.value = res.data.customers
    } catch (e: any) {
        apiError.value = e?.message ?? 'خطا در دریافت'
    }
}

/* ── useSeo ──────────────────────────────────────── */
const seo = useSeo({})
const documentTitle = ref(document.title)

const applySeo = () => {
    seo.apply({
        title: 'کیت رابط کاربری K — صفحهٔ دمو',
        description: 'مجموعه کامپوننت‌های فارسی برای پروژه‌های جدی — فرم، جدول، تقویم شمسی و ابزارهای ERP.',
        keywords: ['ui kit', 'فارسی', 'vue', 'تقویم شمسی'],
        canonical: 'https://example.com/kit',
        ogType: 'website',
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'K UI Kit',
            applicationCategory: 'DeveloperApplication',
        },
    })
    documentTitle.value = document.title
}

/* ── useStorageEncryption ────────────────────────── */
const vault = useStorageEncryption({ passphrase: 'demo-passphrase' })
const vaultNote = ref('')
const vaultBusy = ref(false)
const vaultResult = ref<{ ok: boolean; text: string } | null>(null)

const saveVault = async () => {
    if (!vaultNote.value) return
    vaultBusy.value = true
    try {
        await vault.setItem('demo-note', vaultNote.value)
        vaultResult.value = {
            ok: true,
            text: `ذخیره شد (${faNum(localStorage.length)} کلید در حافظه)`,
        }
    } catch (e: any) {
        vaultResult.value = { ok: false, text: e?.message ?? 'خطا' }
    }
    vaultBusy.value = false
}

const readVault = async () => {
    vaultBusy.value = true
    const val = await vault.getItem<string>('demo-note')
    vaultResult.value = val
        ? { ok: true, text: `بازخوانی شد: «${val}»` }
        : { ok: false, text: 'چیزی ذخیره نشده یا رمز عبور اشتباه است' }
    vaultBusy.value = false
}

/* ── useBrowserDb ────────────────────────────────── */
const db = useBrowserDb('k-demo-db')
const draftTitle = ref('')
const drafts = ref<{ key: string; value: unknown }[]>([])

const saveDraft = async () => {
    if (!draftTitle.value) return
    await db.set(`draft-${Date.now()}`, draftTitle.value)
    draftTitle.value = ''
    await listDrafts()
}

const listDrafts = async () => {
    const rows = await db.all<string>()
    drafts.value = rows.map(d => ({ key: String(d.key), value: d.value }))
}

const removeDraft = async (key: string) => {
    await db.remove(key)
    await listDrafts()
}

/* ── useUrlCipher ────────────────────────────────── */
const cipher = useUrlCipher('demo-secret')
const urlId = ref('128')
const urlToken = ref('')
const urlBack = ref('')

const hashUrl = async () => {
    if (!urlId.value) return
    urlToken.value = await cipher.hash(urlId.value, { ttl: 3600 })
    urlBack.value = ''
}

const unhashUrl = async () => {
    if (!urlToken.value) return
    urlBack.value = String(await cipher.unhash(urlToken.value))
}

</script>

<style scoped>
.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
}

.tools-grid-perm {
    grid-template-columns: 1.4fr 1fr;
}

.tools-card {
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.tools-card-title {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    font-family: monospace;
    direction: ltr;
    text-align: left;
}

.tools-card-desc {
    margin: 0;
    font-size: 0.68rem;
    line-height: 1.7;
    color: var(--k-text-muted, #94a3b8);
}

.tools-card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tools-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tools-input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    font-size: 0.76rem;
    color: var(--k-text-primary, #1e293b);
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.tools-input:focus {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 15%, transparent);
}

.tools-note {
    margin: 0;
    font-size: 0.68rem;
    line-height: 1.7;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-surface, #f8fafc);
    border-radius: 8px;
    padding: 8px 10px;
    word-break: break-word;
}

.tools-note.is-ok {
    color: var(--k-success, #16a34a);
    background: color-mix(in srgb, var(--k-success, #16a34a) 10%, transparent);
}

.tools-note.is-error {
    color: var(--k-danger, #dc2626);
    background: color-mix(in srgb, var(--k-danger, #dc2626) 10%, transparent);
}

.tools-code {
    font-size: 0.66rem;
    direction: ltr;
    unicode-bidi: embed;
}

.tools-code.is-break {
    word-break: break-all;
}

.tools-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.72rem;
    color: var(--k-text-primary, #1e293b);
}

.tools-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 8px;
    padding: 6px 10px;
}

.tools-list-meta {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
    white-space: nowrap;
}

.tools-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tools-chip {
    font-size: 0.64rem;
    font-weight: 600;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 25%, transparent);
    padding: 3px 10px;
    border-radius: 999px;
}

.tools-chip-btn {
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-danger, #dc2626);
    background: color-mix(in srgb, var(--k-danger, #dc2626) 10%, transparent);
    border: none;
    border-radius: 6px;
    padding: 3px 8px;
    cursor: pointer;
}

.tools-empty {
    margin: 0;
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

@media (max-width: 1024px) {
    .tools-grid-perm {
        grid-template-columns: 1fr;
    }
}
</style>
