<template>
    <DemoSection
        id="mobile"
        index="10"
        title="موبایل و PWA"
        description="نوار کناری، اپ‌بار، ناوبری پایین، برگه‌ی پایینی و ابزارهای اپلیکیشن نصب‌پذیر (PWA)"
    >
        <!-- Sidebar + AppBar -->
        <p class="demo-caption">نوار کناری — جمع‌شونده (روی دکمه‌ی بالا کلیک کنید)</p>
        <div style="display: flex; gap: 14px; align-items: stretch; min-height: 240px">
            <KSidebar
                v-model="sideActive"
                brand="املاک من"
                :groups="sidebarGroups"
            >
                <template #footer>
                    <div style="display: flex; align-items: center; justify-content: center; padding: 0 4px">
                        <img src="https://i.pravatar.cc/32?img=12" alt="" style="width: 30px; height: 30px; border-radius: 50%" />
                    </div>
                </template>
            </KSidebar>

            <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0">
                <KAppBar
                    title="سامانه املاک"
                    menuable
                    :actions="[
                        { id: 'bell', icon: Bell, badge: '4' },
                        { id: 'search', icon: Search },
                        { id: 'settings', icon: Settings },
                    ]"
                    @action="onAppBarAction"
                    @menu="onAppBarAction('menu')"
                >
                    <template #avatar>
                        <img src="https://i.pravatar.cc/36?img=47" alt="پروفایل" />
                    </template>
                </KAppBar>

                <div class="k-mobile-card">
                    <p style="margin: 0 0 8px; font-size: 0.75rem; font-weight: 700; color: var(--k-text-primary)">
                        محتوای صفحه
                    </p>
                    <p style="margin: 0; font-size: 0.72rem; color: var(--k-text-muted); line-height: 1.8">
                        بخش فعال سایدبار: <strong style="color: var(--k-primary)">{{ sideActive }}</strong>
                        <br />
                        آخرین اکشن اپ‌بار: <strong>{{ lastAction || '—' }}</strong>
                    </p>
                </div>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Bottom nav + bottom sheet -->
        <div class="demo-grid-2">
            <div>
                <p class="demo-caption">ناوبری پایین — تب فعال: {{ activeTab }}</p>
                <KBottomNav v-model="activeTab" :items="bottomItems" floating />
            </div>

            <div>
                <p class="demo-caption">برگه‌ی پایینی (Bottom Sheet) — با استور سراسری</p>
                <button type="button" class="k-demo-btn" @click="overlay.openSheet('filter-sheet')">
                    <Sheet :size="15" /> باز کردن برگه فیلترها (openSheet)
                </button>
                <p class="demo-caption-note">
                    بکشید پایین یا روی پس‌زمینه کلیک کنید تا بسته شود.
                </p>
            </div>
        </div>

        <KBottomSheet id="filter-sheet" title="فیلترهای جستجو">
            <div style="display: flex; flex-direction: column; gap: 12px">
                <div v-for="(label, i) in sheetRows" :key="i" class="k-mobile-sheet-row">
                    <span>{{ label }}</span>
                    <span class="k-mobile-sheet-value">همه</span>
                </div>
                <div class="k-mobile-sheet-actions">
                    <button type="button" class="k-demo-btn is-muted" @click="overlay.closeSheet('filter-sheet')">انصراف</button>
                    <button type="button" class="k-demo-btn" @click="overlay.closeSheet('filter-sheet')">اعمال فیلتر</button>
                </div>
            </div>
        </KBottomSheet>

        <hr class="demo-divider" />

        <!-- PWA -->
        <p class="demo-caption">ابزارهای PWA — نصب، آفلاین و به‌روزرسانی</p>
        <div class="demo-grid-2">
            <div class="k-pwa-demo">
                <div class="k-pwa-demo-row">
                    <span class="k-pwa-demo-label">آفلاین</span>
                    <span class="k-pwa-demo-value" :style="{ color: offlineDemo ? 'var(--k-warning, #d97706)' : 'var(--k-success)' }">
                        {{ offlineDemo ? 'شبیه‌سازی آفلاین فعال' : 'متصل' }}
                    </span>
                    <button type="button" class="k-demo-btn is-muted" @click="offlineDemo = !offlineDemo">
                        {{ offlineDemo ? 'اتصال' : 'شبیه‌سازی آفلاین' }}
                    </button>
                </div>
                <div class="k-pwa-demo-row">
                    <span class="k-pwa-demo-label">نصب اپ</span>
                    <span class="k-pwa-demo-value">پیشنهاد نصب (پایین-راست)</span>
                    <button type="button" class="k-demo-btn is-muted" @click="installDemo = !installDemo">
                        {{ installDemo ? 'پنهان' : 'نمایش بنر نصب' }}
                    </button>
                </div>
                <div class="k-pwa-demo-row">
                    <span class="k-pwa-demo-label">نسخه جدید</span>
                    <span class="k-pwa-demo-value">پیشنهاد به‌روزرسانی (پایین-چپ)</span>
                    <button type="button" class="k-demo-btn is-muted" @click="updateDemo = !updateDemo">
                        {{ updateDemo ? 'پنهان' : 'شبیه‌سازی نسخه جدید' }}
                    </button>
                </div>
            </div>

            <div class="k-mobile-card">
                <p style="margin: 0 0 8px; font-size: 0.75rem; font-weight: 700; color: var(--k-text-primary)">
                    نصب واقعی
                </p>
                <p style="margin: 0; font-size: 0.72rem; color: var(--k-text-muted); line-height: 1.8">
                    در مرورگر واقعی، بنر نصب فقط وقتی ظاهر می‌شود که
                    <code>beforeinstallprompt</code> شلیک شود (معیارهای PWA برقرار باشند).
                    کامپوننت‌ها با همین پروتکل کار می‌کنند؛ حالت شبیه‌سازی فقط برای نمایش است.
                </p>
            </div>
        </div>

        <!-- Forced PWA banners (demo) -->
        <KOfflineBanner :show="offlineDemo" />
        <KInstallPrompt :show="installDemo" />
        <KUpdatePrompt :show="updateDemo" />
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Briefcase, Home, LayoutDashboard, Search, Settings, Sheet, UserRound, Wrench, Building2, FileText } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'
import KSidebar from '../ui-kit/components/KSidebar.vue'
import KAppBar from '../ui-kit/components/KAppBar.vue'
import KBottomNav from '../ui-kit/components/KBottomNav.vue'
import KBottomSheet from '../ui-kit/components/KBottomSheet.vue'
import KOfflineBanner from '../ui-kit/components/KOfflineBanner.vue'
import KInstallPrompt from '../ui-kit/components/KInstallPrompt.vue'
import KUpdatePrompt from '../ui-kit/components/KUpdatePrompt.vue'
import { useModalStore } from '../ui-kit/stores/modalStore'

const overlay = useModalStore()

const sidebarGroups = [
    {
        title: 'اصلی',
        items: [
            { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
            { id: 'deals', label: 'معاملات', icon: Briefcase, badge: '12' },
            { id: 'clients', label: 'مشتریان', icon: UserRound, badge: '3' },
        ],
    },
    {
        title: 'مدیریت',
        items: [
            { id: 'properties', label: 'املاک', icon: Building2 },
            { id: 'contracts', label: 'قراردادها', icon: FileText },
            { id: 'tools', label: 'ابزارها', icon: Wrench },
        ],
    },
]

const sideActive = ref('deals')
const lastAction = ref('')
const onAppBarAction = (id: string) => {
    lastAction.value = id
    if (id === 'bell') overlay.openSheet('filter-sheet')
}

const bottomItems = [
    { id: 'home', label: 'خانه', icon: Home },
    { id: 'deals', label: 'معاملات', icon: Briefcase, badge: '3' },
    { id: 'clients', label: 'مشتریان', icon: UserRound },
    { id: 'more', label: 'بیشتر', icon: Wrench },
]
const activeTab = ref('home')

const sheetRows = ['نوع ملک', 'محدوده قیمت', 'متراژ', 'منطقه']

const offlineDemo = ref(false)
const installDemo = ref(false)
const updateDemo = ref(false)
</script>

<style scoped>
.k-mobile-card {
    flex: 1;
    padding: 14px 16px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-bg);
}

.k-mobile-sheet-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 2px;
    border-bottom: 1px dashed var(--k-border);
    font-size: 0.8rem;
    color: var(--k-text-primary);
}

.k-mobile-sheet-value {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-primary);
}

.k-mobile-sheet-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
}

.k-pwa-demo {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.k-pwa-demo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 10px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}

.k-pwa-demo-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-text-primary);
    min-width: 60px;
}

.k-pwa-demo-value {
    flex: 1;
    font-size: 0.68rem;
    color: var(--k-text-muted);
}
</style>
