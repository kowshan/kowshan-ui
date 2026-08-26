<!-- layouts/DashboardLayout.vue — fixed header, white content area, transparent sidebar -->
<template>
    <div class="dash-shell">
        <!-- Sidebar (transparent, no background) -->
        <aside class="dash-sidebar">
            <div class="dash-sidebar-head">
                <router-link to="/" class="dash-logo">
                    <span class="dash-logo-mark">K</span>
                </router-link>
                <span class="dash-logo-text">کلینیک سلامت</span>
            </div>

            <nav class="dash-nav">
                <div v-for="group in navGroups" :key="group.title" class="dash-nav-group">
                    <div class="dash-nav-group-title">{{ group.title }}</div>
                    <router-link
                        v-for="item in group.items"
                        :key="item.to"
                        :to="item.to"
                        class="dash-nav-link"
                        :class="isActive(item) ? 'is-active' : ''"
                    >
                        <component :is="item.icon" class="dash-nav-icon" />
                        <span>{{ item.label }}</span>
                    </router-link>
                </div>
            </nav>

            <div class="dash-sidebar-foot">
                <KAvatar name="دکتر احمدی" size="sm" />
                <div class="dash-sidebar-user">
                    <div class="dash-sidebar-user-name">دکتر احمدی</div>
                    <div class="dash-sidebar-user-role">متخصص داخلی</div>
                </div>
            </div>
        </aside>

        <!-- Main area -->
        <div class="dash-main">
            <!-- Header bar (fixed at top, transparent) -->
            <header class="dash-header">
                <div class="dash-header-right">
                    <KSearchInput placeholder="جستجوی بیمار..." style="max-width: 280px" />
                </div>
                <div class="dash-header-left">
                    <KNotificationBell :items="notifications" @read="onReadNotification" @read-all="onReadAll" />
                    <div class="dash-header-divider" />
                    <div class="dash-theme-switch">
                        <button
                            v-for="t in themes"
                            :key="t.id"
                            type="button"
                            class="dash-theme-btn"
                            :class="{ 'is-active': theme === t.id }"
                            :title="t.label"
                            @click="setTheme(t.id)"
                        >
                            <component :is="t.icon" :size="14" />
                        </button>
                    </div>
                    <div class="dash-header-divider" />
                    <router-link to="/" class="dash-header-icon" title="خانه">
                        <Home :size="16" />
                    </router-link>
                </div>
            </header>

            <!-- Command palette -->
            <KCommandPalette
                v-model:visible="cmdOpen"
                :groups="cmdGroups"
                @select="onCmdSelect"
            />

            <!-- Page content (white card) -->
            <main class="dash-content">
                <div class="dash-content-inner">
                    <router-view />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    LayoutDashboard, Users, Settings,
    CalendarCheck, GraduationCap,
    BarChart3, MessageSquare, Wrench,
    Home, Sun, Moon, Circle,
} from 'lucide-vue-next'
import type { KNotification } from '../ui-kit/components/KNotificationBell.vue'
import KAvatar from '../ui-kit/components/KAvatar.vue'
import KSearchInput from '../ui-kit/components/KSearchInput.vue'
import KNotificationBell from '../ui-kit/components/KNotificationBell.vue'
import KCommandPalette from '../ui-kit/components/KCommandPalette.vue'
import type { KCommandGroup, KCommandItem } from '../ui-kit/components/KCommandPalette.vue'

const router = useRouter()
const theme = inject<Ref<string>>('theme')!
const setTheme = inject<(t: string) => void>('setTheme')!

const themes = [
    { id: 'light', label: 'روشن', icon: Sun },
    { id: 'dark', label: 'تیره', icon: Moon },
    { id: 'oled', label: 'OLED', icon: Circle },
]

const notifications: KNotification[] = [
    { id: 1, title: 'نوبت جدید ثبت شد', message: 'علی محمدی — ساعت ۱۰:۳۰', time: '۵ دقیقه پیش', type: 'info', read: false },
    { id: 2, title: 'نتیجه آزمایش آماده است', message: 'سارا کریمی — آزمایش خون کامل', time: '۱۵ دقیقه پیش', type: 'success', read: false },
    { id: 3, title: 'هشدار: نوبت تداخلی', message: 'دو نوبت همزمان در ساعت ۱۱:۰۰', time: '۳۰ دقیقه پیش', type: 'warning', read: true },
]

const onReadNotification = (n: KNotification) => { n.read = true }
const onReadAll = () => { notifications.forEach(n => (n.read = true)) }

/* ── Command Palette ── */
const cmdOpen = ref(false)
const cmdGroups: KCommandGroup[] = [
    {
        id: 'nav',
        title: 'ناوبری',
        items: [
            { id: 'dash', label: 'نمای کلی', icon: LayoutDashboard, shortcut: 'G+D' },
            { id: 'apt', label: 'تقویم و نوبت‌ها', icon: CalendarCheck, shortcut: 'G+A' },
            { id: 'msg', label: 'پیام‌ها', icon: MessageSquare, shortcut: 'G+M' },
            { id: 'users', label: 'کاربران', icon: Users, shortcut: 'G+U' },
            { id: 'reports', label: 'گزارش‌ها', icon: BarChart3, shortcut: 'G+R' },
            { id: 'tools', label: 'ابزارها', icon: Wrench, shortcut: 'G+T' },
            { id: 'courses', label: 'دوره‌ها', icon: GraduationCap },
            { id: 'settings', label: 'تنظیمات', icon: Settings },
        ],
    },
    {
        id: 'actions',
        title: 'عملیات',
        items: [
            { id: 'home', label: 'بازگشت به سایت اصلی', icon: Home },
        ],
    },
]

const onCmdSelect = (item: KCommandItem) => {
    const routeMap: Record<string, string> = {
        dash: '/dash', apt: '/dash/appointments', msg: '/dash/messages',
        users: '/dash/users', reports: '/dash/reports', tools: '/dash/tools',
        courses: '/dash/courses', settings: '/dash/settings', home: '/',
    }
    const target = routeMap[item.id]
    if (target) router.push(target)
}

const route = useRoute()

const isActive = (item: { to: string; exact?: boolean }) => {
    if (item.exact) return route.path === item.to
    return route.path.startsWith(item.to)
}

const navGroups = [
    {
        title: 'اصلی',
        items: [
            { to: '/dash', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
            { to: '/dash/appointments', label: 'تقویم و نوبت‌ها', icon: CalendarCheck },
            { to: '/dash/messages', label: 'پیام‌ها', icon: MessageSquare },
        ],
    },
    {
        title: 'مدیریت',
        items: [
            { to: '/dash/users', label: 'کاربران', icon: Users },
            { to: '/dash/courses', label: 'دوره‌ها', icon: GraduationCap },
            { to: '/dash/reports', label: 'گزارش‌ها', icon: BarChart3 },
            { to: '/dash/tools', label: 'ابزارها', icon: Wrench },
        ],
    },
    {
        title: 'سیستم',
        items: [
            { to: '/dash/settings', label: 'تنظیمات', icon: Settings },
        ],
    },
]
</script>

<style scoped>
/* ── Shell: 3-zone layout, page never scrolls ── */
.dash-shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    height: 100vh;
    overflow: hidden;
    background: var(--k-surface, #f8fafc);
}

/* ── Sidebar (spans both rows, transparent) ── */
.dash-sidebar {
    grid-row: 1 / -1;
    grid-column: 1;
    display: flex;
    flex-direction: column;
    background: transparent;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 20;
    padding: 12px 12px 12px 0;
    /* hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.dash-sidebar::-webkit-scrollbar {
    display: none;
}

.dash-sidebar-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 14px;
}

.dash-logo {
    text-decoration: none;
    flex-shrink: 0;
}

.dash-logo-mark {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1db954, #2ee06a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 900;
}

.dash-logo-text {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary);
    flex: 1;
}

/* Nav */
.dash-nav {
    flex: 1;
    padding: 8px 8px;
    overflow-y: auto;
    scrollbar-width: none;
}

.dash-nav::-webkit-scrollbar {
    display: none;
}

.dash-nav-group {
    margin-bottom: 14px;
}

.dash-nav-group:last-child {
    margin-bottom: 0;
}

.dash-nav-group-title {
    font-size: 0.58rem;
    font-weight: 800;
    color: var(--k-text-muted);
    padding: 0 10px;
    margin-bottom: 6px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.dash-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--k-text-secondary, #64748b);
    transition: all 0.12s ease;
    margin-bottom: 2px;
}

.dash-nav-link:hover {
    background: color-mix(in srgb, var(--k-primary, #1db954) 6%, transparent);
    color: var(--k-text-primary);
}

.dash-nav-link.is-active {
    background: var(--k-primary-light, color-mix(in srgb, #1db954 10%, transparent));
    color: var(--k-primary, #1db954);
    font-weight: 700;
}

.dash-nav-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

/* Sidebar foot */
.dash-sidebar-foot {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 12px;
    margin-top: auto;
}

.dash-sidebar-user-name {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-text-primary);
}

.dash-sidebar-user-role {
    font-size: 0.6rem;
    color: var(--k-text-muted);
}

/* ── Main area ── */
.dash-main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    min-width: 0;
}

/* ── Header (static, sits at top of flex column) ── */
.dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 28px 12px 28px;
    flex-shrink: 0;
}

.dash-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dash-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dash-header-divider {
    width: 1px;
    height: 24px;
    background: var(--k-border, #e2e8f0);
}

.dash-header-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-secondary, #64748b);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 8px;
    transition: all 0.15s ease;
}

.dash-header-link:hover,
.dash-header-icon:hover {
    background: color-mix(in srgb, var(--k-primary, #1db954) 8%, transparent);
    color: var(--k-primary, #1db954);
}

.dash-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: var(--k-text-secondary, #64748b);
    text-decoration: none;
    transition: all 0.15s ease;
}

/* ── Theme switch ── */
.dash-theme-switch {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 16px;
}

.dash-theme-btn {
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-text-muted, #94a3b8);
    transition: all 0.15s ease;
}

.dash-theme-btn:hover {
    color: var(--k-text-primary);
    background: var(--k-bg, #fff);
}

.dash-theme-btn.is-active {
    color: var(--k-primary, #1db954);
    background: var(--k-bg, #fff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* ── Content (white card, the only scrollable area) ── */
.dash-content {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    background: var(--k-bg, #fff);
    border-radius: 16px;
    margin: 12px 12px 12px 12px;
    padding: 24px 28px 32px 28px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    /* soft hidden scrollbar */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
}

.dash-content::-webkit-scrollbar {
    width: 4px;
}

.dash-content::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
}

.dash-content:hover::-webkit-scrollbar-thumb {
    background: var(--k-border, #e2e8f0);
}

.dash-content-inner {
    max-width: 1100px;
    margin: 0 auto;
}
</style>
