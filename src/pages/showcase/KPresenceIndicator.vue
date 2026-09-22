<template>
    <div class="sp">
        <h2 class="sp-title">KPresenceIndicator</h2>

        <h3 class="sp-sub">وضعیت‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 32px; align-items: center;">
                <div v-for="s in statuses" :key="s" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <KAvatar :name="s" size="md" />
                    <KPresenceIndicator :status="s" />
                    <span style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ s }}</span>
                </div>
            </div>
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; align-items: center;">
                <div v-for="sz in sizes" :key="sz" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <KPresenceIndicator status="online" :size="sz" />
                    <span style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ sz }}</span>
                </div>
            </div>
        </div>

        <h3 class="sp-sub">اندازه‌ها بدون انیمیشن</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; align-items: center;">
                <div v-for="sz in sizes" :key="sz" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <KPresenceIndicator status="busy" :size="sz" :animate="false" />
                    <span style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ sz }}</span>
                </div>
            </div>
        </div>

        <h3 class="sp-sub">روی آواتار (گوشه)</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <div v-for="s in statuses" :key="s" style="position: relative; display: inline-flex;">
                    <KAvatar :name="s" size="lg" />
                    <span style="position: absolute; bottom: -2px; inset-inline-end: -2px;">
                        <KPresenceIndicator :status="s" size="lg" />
                    </span>
                </div>
            </div>
        </div>

        <h3 class="sp-sub">در فهرست کاربران</h3>
        <div class="sp-card" style="max-width: 420px;">
            <div
                v-for="u in users"
                :key="u.name"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--k-border);"
            >
                <KAvatar :name="u.name" size="sm" />
                <div style="flex: 1;">
                    <div style="font-size: 0.85rem;">{{ u.name }}</div>
                    <div style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ u.role }}</div>
                </div>
                <KPresenceIndicator :status="u.status" size="sm" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KPresenceIndicator from '../../ui-kit/components/KPresenceIndicator.vue'
import KAvatar from '../../ui-kit/components/KAvatar.vue'

const statuses = ['online', 'away', 'busy', 'offline'] as const
const sizes = ['sm', 'md', 'lg'] as const

const users = [
    { name: 'سارا محمدی', role: 'مدرس زبان', status: 'online' as const },
    { name: 'رضا کریمی', role: 'پشتیبانی', status: 'busy' as const },
    { name: 'مینا رستمی', role: 'مدیر محتوا', status: 'away' as const },
    { name: 'امیر تهرانی', role: 'حسابداری', status: 'offline' as const },
]
</script>
