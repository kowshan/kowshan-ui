<!-- components/KInstallPrompt.vue -->
<!--
    KInstallPrompt — installable-PWA banner. Uses usePwaInstall so it only
    appears when the browser fires `beforeinstallprompt` (Chromium, PWA
    criteria met). `show` forces it for demos/previews.

      <KInstallPrompt title="نصب اپلیکیشن" description="دسترسی سریعتر از هوم‌اسکرین" />
      <KInstallPrompt :show="true" />     <!-- forced (demo/testing) -->
-->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="k-install-up">
            <div
                v-if="visible"
                class="k-ui k-install-prompt"
                :data-theme="theme"
                role="dialog"
                aria-label="نصب اپلیکیشن"
            >
                <span class="k-install-logo"><slot name="logo"><Smartphone :size="18" /></slot></span>
                <div class="k-install-copy">
                    <div class="k-install-title">{{ title }}</div>
                    <div class="k-install-desc">{{ description }}</div>
                </div>
                <div class="k-install-actions">
                    <button type="button" class="k-install-later" @click="dismiss">بعداً</button>
                    <button type="button" class="k-install-now" @click="doInstall">
                        <Download :size="14" /> نصب
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, Smartphone } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { usePwaInstall } from '../composables/usePwaInstall'

const props = withDefaults(defineProps<{
    title?: string
    description?: string
    /** force-show regardless of installability (for demos/previews) */
    show?: boolean
}>(), {
    title: 'نصب اپلیکیشن',
    description: 'با نصب، دسترسی سریع‌تر و آفلاین به امکانات داشته باشید.'
})

const theme = useKitTheme()
const pwa = usePwaInstall()
const dismissed = ref(false)

const visible = computed(() =>
    props.show ? !dismissed.value : pwa.canInstall.value && !dismissed.value
)

const doInstall = async () => {
    if (props.show) {
        // forced demo mode — pretend the native dialog ran
        dismissed.value = true
        return
    }
    const ok = await pwa.install()
    if (ok) dismissed.value = true
}

const dismiss = () => { dismissed.value = true }
</script>

<style scoped>
.k-install-prompt {
    position: fixed;
    bottom: 16px;
    inset-inline-end: 16px;
    z-index: 99998;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 360px;
    padding: 12px 14px;
    background: var(--k-surface, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    box-shadow: var(--k-shadow-lg, 0 12px 34px rgba(15, 23, 42, 0.16));
    direction: rtl;
}

.k-install-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: var(--k-primary-light, color-mix(in srgb, #1db954 14%, transparent));
    color: var(--k-primary, #1db954);
    flex-shrink: 0;
}

.k-install-copy {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-install-title {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-install-desc {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
    line-height: 1.5;
}

.k-install-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.k-install-later {
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 8px;
    font-family: inherit;
}

.k-install-later:hover {
    color: var(--k-text-secondary, #64748b);
}

.k-install-now {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: none;
    border-radius: 9px;
    padding: 7px 14px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: filter 0.15s ease;
}

.k-install-now:hover {
    filter: brightness(1.08);
}

.k-install-up-enter-active,
.k-install-up-leave-active {
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.k-install-up-enter-from,
.k-install-up-leave-to {
    transform: translateY(14px);
    opacity: 0;
}
</style>
