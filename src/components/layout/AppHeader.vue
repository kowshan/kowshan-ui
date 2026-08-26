<!-- components/layout/AppHeader.vue — floating pill header -->
<template>
    <header class="site-header" :class="{ 'is-home': isHome }">
        <div class="site-header-pill">
            <!-- Logo -->
            <router-link to="/" class="header-logo">
                <span class="header-logo-mark">K</span>
            </router-link>

            <!-- Nav -->
            <router-link to="/" class="header-link" :class="{ 'is-active': isHome }">
                خانه
            </router-link>
            <router-link to="/components" class="header-link" :class="{ 'is-active': isComponents }">
                کامپوننت‌ها
            </router-link>
            <router-link to="/market" class="header-link" :class="{ 'is-active': isMarket }">
                مارکت
            </router-link>

            <!-- Divider -->
            <span class="header-divider" />

            <!-- Dashboard -->
            <router-link to="/dash" class="header-link header-dash">
                <LayoutDashboard class="header-login-icon" />
                داشبورد
            </router-link>

            <!-- Login -->
            <router-link to="/auth/login" class="header-link header-login">
                <LogIn class="header-login-icon" />
                ورود
            </router-link>

            <!-- Theme switch -->
            <div class="header-themes">
                <button
                    v-for="t in themes"
                    :key="t.id"
                    type="button"
                    class="header-theme-btn"
                    :class="{ 'is-active': theme === t.id }"
                    :title="t.label"
                    @click="setTheme(t.id)"
                >
                    <Sun v-if="t.id === 'light'" class="theme-icon" />
                    <Moon v-else-if="t.id === 'dark'" class="theme-icon" />
                    <Circle v-else class="theme-icon" />
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { LogIn, LayoutDashboard, Sun, Moon, Circle } from 'lucide-vue-next'

const route = useRoute()
const isHome = computed(() => route.name === 'home')
const isComponents = computed(() => route.name === 'components')
const isMarket = computed(() => route.name === 'market')

const theme = inject<Ref<string>>('theme')!
const setTheme = inject<(t: string) => void>('setTheme')!

const themes = [
    { id: 'light', label: 'روشن' },
    { id: 'dark', label: 'تیره' },
    { id: 'oled', label: 'OLED' },
]
</script>

<style scoped>
.site-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    padding: 12px 24px 0;
}

.site-header:not(.is-home) {
    position: sticky;
    background: color-mix(in srgb, var(--k-bg, #fff) 85%, transparent);
    backdrop-filter: blur(16px) saturate(1.4);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    padding-bottom: 12px;
}

.site-header:not(.is-home) .site-header-pill {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

/* ── Pill ── */
.site-header-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px 6px 10px;
    background: color-mix(in srgb, var(--k-bg, #fff) 92%, transparent);
    backdrop-filter: blur(16px) saturate(1.4);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 30px;
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.06),
        0 8px 24px rgba(0, 0, 0, 0.04);
}

/* ── Logo ── */
.header-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin-inline-end: 4px;
}

.header-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1db954, #2ee06a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.82rem;
    font-weight: 900;
    transition: transform 0.2s ease;
}

.header-logo:hover .header-logo-mark {
    transform: scale(1.06);
}

/* ── Nav links ── */
.header-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border-radius: 16px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-secondary, #475569);
    text-decoration: none;
    transition: all 0.15s ease;
}

.header-link:hover {
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.08));
}

.header-link.is-active {
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.1));
}

.header-login-icon {
    width: 14px;
    height: 14px;
}

/* ── Divider ── */
.header-divider {
    width: 1px;
    height: 20px;
    background: var(--k-border, #e2e8f0);
    margin: 0 4px;
    flex-shrink: 0;
}

/* ── Theme buttons ── */
.header-themes {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    margin-inline-start: 4px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 20px;
}

.header-theme-btn {
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    color: var(--k-text-muted, #94a3b8);
}

.header-theme-btn:hover {
    color: var(--k-text-primary, #1e293b);
    background: var(--k-bg, #fff);
}

.header-theme-btn.is-active {
    color: var(--k-primary, #1db954);
    background: var(--k-bg, #fff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.theme-icon {
    width: 13px;
    height: 13px;
}

@media (max-width: 640px) {
    .header-link:not(.header-login) {
        display: none;
    }
}
</style>
