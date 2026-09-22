<template>
    <div class="sp">
        <h2 class="sp-title">KOfflineBanner</h2>
        <p class="sp-note">
            به‌صورت پیش‌فرض فقط وقتی مرورگر «آفلاین» را گزارش کند نمایش داده می‌شود — با
            <code>show</code> برای تست اجباری کنید.
        </p>

        <h3 class="sp-sub">کنترل نمایش</h3>
        <div class="sp-row">
            <KButton
                :text="visible ? 'بستن بنر' : 'نمایش بنر'"
                bg-color="var(--k-primary)"
                text-color="#fff"
                @click="visible = !visible"
            />
            <KButton
                :text="closable ? 'بدون دکمه بستن' : 'با دکمه بستن'"
                bg-color="var(--k-surface-hover)"
                text-color="var(--k-text-primary)"
                @click="closable = !closable"
            />
            <span class="sp-vmodel">show: {{ visible }} · closable: {{ closable }}</span>
        </div>

        <h3 class="sp-sub">وضعیت شبکه</h3>
        <div class="sp-card" style="max-width: 480px;">
            <div class="ob-row">
                <strong>navigator.onLine</strong>
                <span :class="online ? 'ob-ok' : 'ob-bad'">{{ online ? 'آنلاین' : 'آفلاین' }}</span>
            </div>
            <div class="ob-row">
                <strong>رخدادها</strong>
                <span class="sp-vmodel">online: {{ onlineCount }} · offline: {{ offlineCount }}</span>
            </div>
            <p class="sp-vmodel" style="margin-top: 8px;">
                برای دیدن رفتار واقعی، در DevTools گزینه Network → Offline را فعال کنید.
            </p>
        </div>

        <!-- single instance — the banner positions itself, stacking demos would overlap -->
        <KOfflineBanner :show="visible" :closable="closable" @close="onClose" />

        <div class="sp-vmodel" style="margin-top: 16px;">close event: {{ closed }} بار</div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import KOfflineBanner from '../../ui-kit/components/KOfflineBanner.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const visible = ref(true)
const closable = ref(true)
const closed = ref(0)
const online = ref(true)
const onlineCount = ref(0)
const offlineCount = ref(0)

const onClose = () => { closed.value++; visible.value = false }

const sync = () => { online.value = navigator.onLine }
const onOnline = () => { onlineCount.value++; sync() }
const onOffline = () => { offlineCount.value++; sync() }

onMounted(() => {
    sync()
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
})
onBeforeUnmount(() => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
})
</script>

<style scoped>
.ob-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--k-border); font-size: 0.8rem;
}
.ob-row:last-of-type { border-bottom: none; }
.ob-ok { color: var(--k-success, #22c55e); font-weight: 700; }
.ob-bad { color: var(--k-error, #ef4444); font-weight: 700; }
</style>
