<template>
    <div class="k-ui demo-root" :data-theme="theme">
        <!-- Global toast/modal layer — mounted once -->
        <KGlobalLayer />

        <!-- ══════════ TOPBAR ══════════ -->
        <header class="demo-topbar">
            <div class="demo-brand">
                <span class="demo-brand-logo">K</span>
                <span>K UI Kit</span>
                <span class="demo-brand-version">v2.0</span>
            </div>

            <div class="demo-topbar-actions">
                <a
                    href="#"
                    class="demo-docs-link"
                    :class="{ 'is-active': page === 'docs' }"
                    @click.prevent="toggleDocs"
                >
                    <FileCode2 class="demo-nav-icon" />
                    مستندات
                </a>
                <div class="demo-themes">
                    <button
                        v-for="t in themes"
                        :key="t"
                        type="button"
                        class="demo-theme-btn"
                        :class="{ 'is-active': theme === t }"
                        @click="theme = t"
                    >
                        {{ themeLabel(t) }}
                    </button>
                </div>
            </div>
        </header>

        <div class="demo-app">
            <!-- ══════════ SIDEBAR ══════════ -->
            <aside class="demo-sidebar">
                <nav class="demo-nav">
                    <div class="demo-nav-group">
                        <div class="demo-nav-group-title">مستندات کامپوننت</div>
                        <div class="docs-search-wrap">
                            <input
                                v-model="docsQuery"
                                class="docs-search"
                                type="text"
                                placeholder="جستجوی کامپوننت…"
                            />
                        </div>
                        <div class="docs-list">
                            <a
                                v-for="c in filteredDocs"
                                :key="c.name"
                                :href="`#/docs/${c.name}`"
                                :class="{ 'is-active': page === 'docs' && docComponent === c.name }"
                            >
                                <span class="docs-item-name">{{ c.name }}</span>
                                <span class="docs-item-cat">{{ c.category }}</span>
                            </a>
                        </div>
                    </div>

                    <div v-for="group in navGroups" :key="group.title" class="demo-nav-group">
                        <div class="demo-nav-group-title">{{ group.title }}</div>
                        <a
                            v-for="item in group.items"
                            :key="item.id"
                            :href="`#${item.id}`"
                            :class="{ 'is-active': activeSection === item.id }"
                            @click.prevent="onNavClick(item.id)"
                        >
                            <component :is="item.icon" class="demo-nav-icon" />
                            {{ item.label }}
                        </a>
                    </div>
                </nav>

                <div class="demo-sidebar-foot">
                    <div class="demo-sidebar-foot-title">K UI Kit</div>
                    <div class="demo-sidebar-foot-sub">کیت رابط کاربری فارسی · v2.0</div>
                    <span class="demo-sidebar-foot-badge">
                        <span class="demo-brand-logo kws-logo">K</span>
                        تیم کوشان
                    </span>
                </div>
            </aside>

            <!-- ══════════ MAIN ══════════ -->
            <main class="demo-main">
                <div v-show="page === 'home'" class="demo-home">
                <div class="demo-hero">
                    <div class="demo-hero-badge">کیت رابط کاربری فارسی · ساختهٔ تیم کوشان</div>
                    <h2>
                        کیت رابط کاربری
                        <span class="demo-hero-accent">K</span>
                    </h2>
                    <p class="demo-hero-desc">
                        مجموعه‌ای جدی و آماده برای پروژه‌های فارسی — فرم، جدول، نمودار،
                        تقویم شمسی، تأیید هویت، رزرو و ابزارهای ERP. یک پوشه
                        <code>ui-kit</code> کافی است: کپی کنید، دو فایل CSS را ایمپورت کنید
                        و تمام. تم را از نوار بالا تغییر دهید.
                    </p>

                    <div class="demo-stats">
                        <div class="demo-stat">
                            <span class="demo-stat-value">{{ faNum(kitCounts.components) }}</span>
                            <span class="demo-stat-label">کامپوننت</span>
                        </div>
                        <div class="demo-stat">
                            <span class="demo-stat-value">{{ faNum(kitCounts.composables) }}</span>
                            <span class="demo-stat-label">کامپوزبل</span>
                        </div>
                        <div class="demo-stat">
                            <span class="demo-stat-value">{{ faNum(kitCounts.sections) }}</span>
                            <span class="demo-stat-label">بخش نمایشی</span>
                        </div>
                        <div class="demo-stat">
                            <span class="demo-stat-value">{{ faNum(kitCounts.calendar) }}</span>
                            <span class="demo-stat-label">نمای تقویم شمسی</span>
                        </div>
                    </div>

                    <div class="demo-hero-cta">
                        <a href="#forms" class="demo-cta-primary" @click.prevent="onNavClick('forms')">مشاهده کامپوننت‌ها</a>
                        <a href="#/docs/KButton" class="demo-cta-ghost" @click.prevent="openDocs('KButton')">مستندات</a>
                        <a href="#calendar" class="demo-cta-ghost" @click.prevent="onNavClick('calendar')">تقویم شمسی</a>
                    </div>
                </div>

                <LazySection id="dashboard" :force="activeSection === 'dashboard'">
                    <DashboardSection />
                </LazySection>
                <LazySection id="forms" :force="activeSection === 'forms'">
                    <FormsSection />
                </LazySection>
                <LazySection id="data" :force="activeSection === 'data'">
                    <DataSection />
                </LazySection>
                <LazySection id="feedback" :force="activeSection === 'feedback'">
                    <FeedbackSection />
                </LazySection>
                <LazySection id="navigation" :force="activeSection === 'navigation'">
                    <NavigationSection />
                </LazySection>
                <LazySection id="crm" :force="activeSection === 'crm'">
                    <CrmSection />
                </LazySection>
                <LazySection id="reservation" :force="activeSection === 'reservation'">
                    <ReservationSection />
                </LazySection>
                <LazySection id="mobile" :force="activeSection === 'mobile'">
                    <MobileSection />
                </LazySection>
                <LazySection id="courses" :force="activeSection === 'courses'">
                    <CoursesSection />
                </LazySection>
                <LazySection id="cards" :force="activeSection === 'cards'">
                    <CardsSection />
                </LazySection>
                <LazySection id="verify" :force="activeSection === 'verify'">
                    <VerificationSection />
                </LazySection>
                <LazySection id="advanced" :force="activeSection === 'advanced'">
                    <AdvancedSection />
                </LazySection>
                <LazySection id="iran" :force="activeSection === 'iran'">
                    <IranSection />
                </LazySection>
                <LazySection id="media" :force="activeSection === 'media'">
                    <MediaSection />
                </LazySection>
                <LazySection id="tools" :force="activeSection === 'tools'">
                    <ToolsSection />
                </LazySection>
                <LazySection id="kanban" :force="activeSection === 'kanban'">
                    <KanbanSection />
                </LazySection>
                <LazySection id="calendar" :force="activeSection === 'calendar'">
                    <CalendarSection />
                </LazySection>
                </div>

                <DocsPage v-if="page === 'docs'" :component-name="docComponent" @home="goHome" />

            </main>
        </div>

        <!-- ══════════ FOOTER ══════════ -->
        <footer class="demo-footer">
            <div class="demo-footer-brand">
                <span class="demo-brand-logo">K</span>
                <div>
                    <div class="demo-footer-title">K UI Kit</div>
                    <div class="demo-footer-sub">کیت رابط کاربری فارسی · نسخه ۲٫۰</div>
                </div>
            </div>
            <div class="demo-footer-links">
                <span>پوشه <code>ui-kit</code> را در هر پروژه کپی کنید</span>
                <span>·</span>
                <span>وابستگی خارجی فقط <code>lucide-vue-next</code></span>
            </div>
            <div class="demo-footer-note">
                ساخته‌شده با <code>Vue 3</code> و <code>TypeScript</code>
                · <strong>تیم کوشان (Kowshean)</strong>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
    BarChart3, CalendarCheck, CalendarDays, CheckSquare, CreditCard, FileCode2, GraduationCap, Image, Landmark, Layers, LayoutDashboard,
    ListOrdered, MessageSquareWarning, Rocket, ShieldCheck, Smartphone, Trello, UserRound, Wrench,
} from 'lucide-vue-next'
import { usePersianNumbers } from './ui-kit/composables/usePersianNumbers'

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

/* real kit inventory — counted from the copied folder at build time.
   `as: 'raw'` inlines file contents as strings, so no module graph is built
   (keeps optional deps like gsap out of the bundle) and the counts are exact. */
const kitComponentFiles = import.meta.glob('./ui-kit/components/*.vue', { query: '?raw', import: 'default', eager: true })
const kitComposableFiles = import.meta.glob('./ui-kit/composables/*.ts', { query: '?raw', import: 'default', eager: true })
const kitCalendarFiles = import.meta.glob('./ui-kit/calendar/components/*.vue', { query: '?raw', import: 'default', eager: true })
const kitCounts = {
    components: Object.keys(kitComponentFiles).length,
    composables: Object.keys(kitComposableFiles).length,
    sections: 17,
    calendar: Object.keys(kitCalendarFiles).length
}

import DashboardSection from './sections/DashboardSection.vue'
import FormsSection from './sections/FormsSection.vue'
import DataSection from './sections/DataSection.vue'
import FeedbackSection from './sections/FeedbackSection.vue'
import NavigationSection from './sections/NavigationSection.vue'
import CrmSection from './sections/CrmSection.vue'
import ReservationSection from './sections/ReservationSection.vue'
import MobileSection from './sections/MobileSection.vue'
import CoursesSection from './sections/CoursesSection.vue'
import CardsSection from './sections/CardsSection.vue'
import VerificationSection from './sections/VerificationSection.vue'
import AdvancedSection from './sections/AdvancedSection.vue'
import IranSection from './sections/IranSection.vue'
import MediaSection from './sections/MediaSection.vue'
import ToolsSection from './sections/ToolsSection.vue'
import KanbanSection from './sections/KanbanSection.vue'
import CalendarSection from './sections/CalendarSection.vue'
import LazySection from './components/LazySection.vue'
import KGlobalLayer from './ui-kit/components/KGlobalLayer.vue'
import DocsPage from './docs/DocsPage.vue'
import { catalog, docByName } from './docs/useComponentDocs'

const themes = ['light', 'dark', 'oled'] as const
const theme = ref<(typeof themes)[number]>('light')
const themeLabel = (t: string) => ({ light: 'روشن', dark: 'تیره', oled: 'OLED' } as Record<string, string>)[t]

const activeSection = ref('dashboard')

/* ── docs routing (hash-based: #/docs/KButton) ── */
const page = ref<'home' | 'docs'>('home')
const docComponent = ref('KButton')
const docsQuery = ref('')

const applyHash = () => {
    const m = location.hash.match(/^#\/docs\/([\w-]+)$/)
    if (m) {
        docComponent.value = docByName(m[1]) ? m[1] : 'KButton'
        page.value = 'docs'
        window.scrollTo(0, 0)
    } else {
        page.value = 'home'
    }
}

const goHome = () => {
    history.replaceState(null, '', location.pathname + location.search)
    page.value = 'home'
}

const openDocs = (name: string) => {
    location.hash = `#/docs/${name}`
}

const toggleDocs = () => {
    if (page.value === 'docs') goHome()
    else openDocs(docComponent.value)
}

const filteredDocs = computed(() => {
    const q = docsQuery.value.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.category.includes(docsQuery.value.trim())
    )
})

/* nav click → jump to a section. Lazy sections mount a tick after being
   activated, so retry until the element exists; the scroll-spy observer
   stays muted (fromNav) until the smooth scroll settles, otherwise it
   would fire mid-jump and cancel the navigation */
let fromNav = false
let navToken = 0
const onNavClick = (id: string) => {
    fromNav = true
    navToken++ // invalidates any still-running jump from a previous click
    if (page.value === 'docs') {
        // leave the docs page first; the home sections become visible next tick
        page.value = 'home'
        history.replaceState(null, '', location.pathname + location.search)
        setTimeout(() => { activeSection.value = id }, 80)
    } else {
        activeSection.value = id
    }
}

watch(activeSection, (id) => {
    if (!fromNav) return
    const token = navToken
    /* converge: the smooth scroll target MOVES while lazy sections between
       here and the destination mount (they push content down), so after the
       first smooth pass we wait for the page to settle, then correct with
       instant jumps (computed at call time — can't be clamped or cancelled
       by competing animations) until we actually arrive */
    const scrollTo = (pass = 0) => {
        if (token !== navToken) return // a newer nav click took over
        const el = document.getElementById(id)
        if (!el) {
            if (pass < 20) setTimeout(() => scrollTo(pass + 1), 60)
            else fromNav = false
            return
        }
        el.scrollIntoView({ behavior: pass === 0 ? 'smooth' : 'instant', block: 'start' })
        setTimeout(() => {
            if (token !== navToken) return
            const top = el.getBoundingClientRect().top
            const arrived = top > -100 && top < window.innerHeight * 0.4
            if (!arrived && pass < 4) {
                scrollTo(pass + 1)
            } else {
                fromNav = false
            }
        }, pass === 0 ? 1200 : 450)
    }
    scrollTo()
})

const navGroups = [
    {
        title: 'شروع',
        items: [
            { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
        ],
    },
    {
        title: 'کامپوننت‌ها',
        items: [
            { id: 'forms', label: 'فرم و ورودی', icon: CheckSquare },
            { id: 'data', label: 'نمایش داده', icon: BarChart3 },
            { id: 'feedback', label: 'بازخورد', icon: MessageSquareWarning },
            { id: 'navigation', label: 'پیمایش', icon: ListOrdered },
            { id: 'crm', label: 'ابزارهای CRM', icon: UserRound },
            { id: 'reservation', label: 'رزرو', icon: CalendarCheck },
            { id: 'mobile', label: 'موبایل و PWA', icon: Smartphone },
            { id: 'courses', label: 'دوره و تخفیف', icon: GraduationCap },
            { id: 'cards', label: 'کارت‌های زیبا', icon: CreditCard },
            { id: 'verify', label: 'تأیید هویت', icon: ShieldCheck },
            { id: 'advanced', label: 'پیشرفته', icon: Rocket },
            { id: 'iran', label: 'ایران', icon: Landmark },
            { id: 'media', label: 'رسانه و نقشه', icon: Image },
            { id: 'tools', label: 'ابزار و دستیارها', icon: Wrench },
            { id: 'kanban', label: 'برد و منوی مگا', icon: Trello },
        ],
    },
    {
        title: 'ماژول‌ها',
        items: [
            { id: 'calendar', label: 'تقویم شمسی', icon: CalendarDays },
        ],
    },
]

// Track active section while scrolling — observe the always-present
// LazySection wrappers (inner sections mount lazily and may not exist yet)
onMounted(() => {
    applyHash()
    window.addEventListener('hashchange', applyHash)
    const observer = new IntersectionObserver(
        (entries) => {
            if (fromNav || page.value === 'docs') return
            // pick the section with the most overlap of the active band
            // (deterministic — not just the last entry the browser delivers)
            let best: HTMLElement | null = null
            let bestRatio = 0
            for (const entry of entries) {
                if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                    bestRatio = entry.intersectionRatio
                    best = entry.target as HTMLElement
                }
            }
            if (best) {
                activeSection.value = best.dataset.section ?? ''
            } else if (window.scrollY < (document.getElementById('dashboard')?.offsetTop ?? 0) + 300) {
                activeSection.value = 'dashboard'
            }
        },
        { rootMargin: '-20% 0px -70% 0px' }
    )
    document.querySelectorAll('.k-lazy').forEach(el => observer.observe(el))
})

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', applyHash)
})
</script>

<style scoped>
/* topbar docs link */
.demo-docs-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    transition: all 0.15s ease;
    cursor: pointer;
}

.demo-docs-link:hover {
    color: var(--k-primary, #1db954);
    border-color: var(--k-primary, #1db954);
}

.demo-docs-link.is-active {
    color: #fff;
    background: var(--k-primary, #1db954);
    border-color: var(--k-primary, #1db954);
}

/* docs component list in the sidebar */
.docs-search-wrap {
    padding: 2px 2px 8px;
}

.docs-search {
    width: 100%;
    box-sizing: border-box;
    padding: 6px 10px;
    font-size: 0.7rem;
    color: var(--k-text-primary, #1e293b);
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 9px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.docs-search:focus {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 15%, transparent);
}

.docs-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-height: 300px;
    overflow-y: auto;
    padding-inline-end: 2px;
}

.docs-list a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 8px;
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
    text-decoration: none;
    transition: background 0.12s ease;
}

.docs-list a:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

.docs-list a.is-active {
    background: var(--k-primary-light, #e3f8ec);
    color: var(--k-primary, #1db954);
    font-weight: 700;
}

.docs-item-name {
    font-family: monospace;
    direction: ltr;
    white-space: nowrap;
}

.docs-item-cat {
    font-size: 0.54rem;
    color: var(--k-text-muted, #94a3b8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
}

/* small K mark inside the sidebar footer badge */
.kws-logo {
    width: 15px;
    height: 15px;
    border-radius: 5px;
    font-size: 0.52rem;
    box-shadow: none;
}
</style>
