<!-- pages/components.vue — full component showcase with sidebar navigation -->
<template>
    <div class="comp-page">
        <!-- ══════════ SIDEBAR ══════════ -->
        <aside class="comp-sidebar">
            <div class="comp-sidebar-head">
                <span class="comp-sidebar-logo">K</span>
                <span class="comp-sidebar-title">کامپوننت‌ها</span>
            </div>

            <nav class="comp-nav">
                <div v-for="group in navGroups" :key="group.title" class="comp-nav-group">
                    <div class="comp-nav-group-title">{{ group.title }}</div>
                    <a
                        v-for="item in group.items"
                        :key="item.id"
                        :href="`#${item.id}`"
                        :class="{ 'is-active': activeSection === item.id }"
                        @click.prevent="onNavClick(item.id)"
                    >
                        <component :is="item.icon" class="comp-nav-icon" />
                        {{ item.label }}
                    </a>
                </div>
            </nav>
        </aside>

        <!-- ══════════ MAIN CONTENT ══════════ -->
        <main class="comp-main">
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
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
    BarChart3, CalendarCheck, CalendarDays, CheckSquare, CreditCard, GraduationCap, Image, Landmark,
    LayoutDashboard, ListOrdered, MessageSquareWarning, Rocket, ShieldCheck, Smartphone, Trello,
    UserRound, Wrench,
} from 'lucide-vue-next'
import LazySection from '../components/LazySection.vue'
import DashboardSection from '../sections/DashboardSection.vue'
import FormsSection from '../sections/FormsSection.vue'
import DataSection from '../sections/DataSection.vue'
import FeedbackSection from '../sections/FeedbackSection.vue'
import NavigationSection from '../sections/NavigationSection.vue'
import CrmSection from '../sections/CrmSection.vue'
import ReservationSection from '../sections/ReservationSection.vue'
import MobileSection from '../sections/MobileSection.vue'
import CoursesSection from '../sections/CoursesSection.vue'
import CardsSection from '../sections/CardsSection.vue'
import VerificationSection from '../sections/VerificationSection.vue'
import AdvancedSection from '../sections/AdvancedSection.vue'
import IranSection from '../sections/IranSection.vue'
import MediaSection from '../sections/MediaSection.vue'
import ToolsSection from '../sections/ToolsSection.vue'
import KanbanSection from '../sections/KanbanSection.vue'
import CalendarSection from '../sections/CalendarSection.vue'

const activeSection = ref('dashboard')

let fromNav = false
let navToken = 0
const onNavClick = (id: string) => {
    fromNav = true
    navToken++
    activeSection.value = id
}

watch(activeSection, (id) => {
    if (!fromNav) return
    const token = navToken
    const scrollTo = (pass = 0) => {
        if (token !== navToken) return
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
            if (!arrived && pass < 4) scrollTo(pass + 1)
            else fromNav = false
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

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (fromNav) return
            let best: HTMLElement | null = null
            let bestRatio = 0
            for (const entry of entries) {
                if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                    bestRatio = entry.intersectionRatio
                    best = entry.target as HTMLElement
                }
            }
            if (best) activeSection.value = best.dataset.section ?? ''
            else if (window.scrollY < (document.getElementById('dashboard')?.offsetTop ?? 0) + 300) {
                activeSection.value = 'dashboard'
            }
        },
        { rootMargin: '-20% 0px -70% 0px' }
    )
    document.querySelectorAll('.k-lazy').forEach(el => observer.observe(el))
})
</script>

<style scoped>
.comp-page {
    display: flex;
    gap: 32px;
    padding: 0 24px;
    max-width: 1300px;
    margin: 0 auto;
}

/* ── Sidebar ── */
.comp-sidebar {
    width: 230px;
    flex-shrink: 0;
    position: sticky;
    top: 100px;
    height: fit-content;
    max-height: calc(100vh - 92px);
    overflow-y: auto;
    padding: 20px 12px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
    background: var(--k-bg, #fff);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
}

.comp-sidebar-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px 14px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.comp-sidebar-logo {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1db954, #2ee06a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 900;
}

.comp-sidebar-title {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.comp-nav-group {
    margin-bottom: 16px;
}

.comp-nav-group:last-child {
    margin-bottom: 0;
}

.comp-nav-group-title {
    font-size: 0.6rem;
    font-weight: 800;
    color: var(--k-text-muted, #94a3b8);
    padding: 0 8px;
    margin-bottom: 6px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.comp-nav a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 0.76rem;
    font-weight: 500;
    color: var(--k-text-secondary, #64748b);
    transition: all 0.12s ease;
    margin-bottom: 2px;
}

.comp-nav a:hover {
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-primary, #1e293b);
}

.comp-nav a.is-active {
    background: var(--k-primary-light, color-mix(in srgb, #1db954 10%, transparent));
    color: var(--k-primary, #1db954);
    font-weight: 700;
    box-shadow: inset 3px 0 0 var(--k-primary, #1db954);
}

.comp-nav-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* ── Main ── */
.comp-main {
    flex: 1 1 0;
    min-width: 0;
    max-width: 1020px;
    padding: 8px 0 60px;
}

@media (max-width: 900px) {
    .comp-page {
        flex-direction: column;
        padding: 0 16px;
    }
    .comp-sidebar {
        width: 100%;
        position: static;
        max-height: none;
    }
}
</style>
