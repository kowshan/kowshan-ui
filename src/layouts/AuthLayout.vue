<!-- layouts/AuthLayout.vue — minimal centered auth wrapper -->
<template>
    <div class="auth-shell">
        <!-- Back to home -->
        <router-link to="/" class="auth-back">
            <ArrowRight :size="16" />
            بازگشت به خانه
        </router-link>

        <!-- Logo -->
        <router-link to="/" class="auth-logo">
            <span class="auth-logo-mark">K</span>
        </router-link>

        <!-- Card -->
        <div class="auth-card">
            <router-view />
        </div>

        <!-- Theme switch (subtle, bottom) -->
        <div class="auth-themes">
            <button
                v-for="t in themes"
                :key="t.id"
                type="button"
                class="auth-theme-btn"
                :class="{ 'is-active': theme === t.id }"
                :title="t.label"
                @click="setTheme(t.id)"
            >
                <Sun v-if="t.id === 'light'" />
                <Moon v-else-if="t.id === 'dark'" />
                <CircleDot v-else />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'
import { ArrowRight, Sun, Moon, CircleDot } from 'lucide-vue-next'

const theme = inject<Ref<string>>('theme')!
const setTheme = inject<(t: string) => void>('setTheme')!

const themes = [
    { id: 'light', label: 'روشن' },
    { id: 'dark', label: 'تیره' },
    { id: 'oled', label: 'OLED' },
]
</script>

<style scoped>
.auth-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
}

/* Back link */
.auth-back {
    position: absolute;
    top: 20px;
    right: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 10px;
    transition: all 0.15s ease;
}

.auth-back:hover {
    color: var(--k-text-primary, #1e293b);
    background: var(--k-surface-hover, #f1f5f9);
}

/* Logo */
.auth-logo {
    display: flex;
    text-decoration: none;
    margin-bottom: 24px;
}

.auth-logo-mark {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1db954, #2ee06a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 900;
    box-shadow: 0 8px 24px color-mix(in srgb, #1db954 30%, transparent);
}

/* Card */
.auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

/* Theme switch */
.auth-themes {
    position: absolute;
    bottom: 20px;
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 20px;
}

.auth-theme-btn {
    width: 28px;
    height: 28px;
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

.auth-theme-btn :deep(svg) {
    width: 14px;
    height: 14px;
}

.auth-theme-btn:hover {
    color: var(--k-text-primary);
    background: var(--k-bg, #fff);
}

.auth-theme-btn.is-active {
    color: var(--k-primary, #1db954);
    background: var(--k-bg, #fff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
