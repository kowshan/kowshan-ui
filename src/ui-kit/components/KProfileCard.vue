<!-- components/KProfileCard.vue -->
<!--
    KProfileCard — beautiful profile / team card:

      <KProfileCard
        name="علی رضایی"
        role="مدیر فروش"
        avatar="…"
        cover="…"
        :stats="[{ label: 'معاملات', value: 128 }, { label: 'مشتری', value: 340 }, { label: 'امتیاز', value: '4.9' }]"
        @action="onAction"
      />
-->
<template>
    <article class="k-profile">
        <!-- Cover -->
        <div class="k-profile-cover">
            <img v-if="cover" :src="cover" :alt="name" loading="lazy" />
            <div v-else class="k-profile-cover-fallback"></div>
            <span v-if="status" class="k-profile-status" :class="`is-${status}`"></span>
        </div>

        <!-- Avatar -->
        <div class="k-profile-avatar-wrap">
            <img :src="avatar" :alt="name" class="k-profile-avatar" loading="lazy" />
        </div>

        <!-- Identity -->
        <div class="k-profile-info">
            <h3 class="k-profile-name">{{ name }}</h3>
            <span class="k-profile-role">{{ role }}</span>
            <span v-if="company" class="k-profile-company">{{ company }}</span>
        </div>

        <!-- Stats -->
        <div v-if="stats.length" class="k-profile-stats">
            <div v-for="s in stats" :key="s.label" class="k-profile-stat">
                <span class="k-profile-stat-value">{{ faNum(s.value) }}</span>
                <span class="k-profile-stat-label">{{ s.label }}</span>
            </div>
        </div>

        <!-- Tags -->
        <div v-if="tags.length" class="k-profile-tags">
            <span v-for="t in tags" :key="t" class="k-profile-tag">{{ t }}</span>
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions || actions.length" class="k-profile-actions">
            <slot name="actions">
                <button
                    v-for="a in actions"
                    :key="a.id"
                    type="button"
                    class="k-profile-action"
                    :class="{ 'is-primary': a.primary }"
                    @click="emits('action', a.id)"
                >
                    <component :is="a.icon" :size="15" />
                    {{ a.label }}
                </button>
            </slot>
        </div>
    </article>
</template>

<script setup lang="ts">
import { usePersianNumbers } from '../composables/usePersianNumbers'

withDefaults(defineProps<{
    name: string
    role?: string
    company?: string
    avatar: string
    cover?: string
    status?: 'online' | 'away' | 'offline' | 'busy'
    stats?: { label: string; value: string | number }[]
    tags?: string[]
    actions?: { id: string; label: string; icon: any; primary?: boolean }[]
}>(), {
    role: '',
    company: '',
    cover: '',
    status: 'online',
    stats: () => [],
    tags: () => [],
    actions: () => []
})

const emits = defineEmits<{
    (e: 'action', id: string): void
}>()

const { toPersianDigits } = usePersianNumbers()
const faNum = (v: string | number) => toPersianDigits(String(v))
</script>

<style scoped>
.k-profile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 290px;
    padding-bottom: 18px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
}

.k-profile:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
}

.k-profile-cover {
    position: relative;
    width: 100%;
    height: 96px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--k-primary, #1db954) 55%, #7c3aed), var(--k-primary, #1db954));
    overflow: hidden;
}

.k-profile-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.k-profile-cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.35), transparent);
}

.k-profile-status {
    position: absolute;
    bottom: 8px;
    inset-inline-end: 12px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--k-bg, #fff);
    z-index: 2;
}

.k-profile-status.is-online { background: var(--k-success); }
.k-profile-status.is-away { background: #f59e0b; }
.k-profile-status.is-busy { background: #ef4444; }
.k-profile-status.is-offline { background: #94a3b8; }

.k-profile-avatar-wrap {
    margin-top: -34px;
    z-index: 2;
}

.k-profile-avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--k-bg, #ffffff);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.18);
}

.k-profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 14px 0;
    text-align: center;
}

.k-profile-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-profile-role {
    font-size: 0.72rem;
    color: var(--k-primary, #1db954);
    font-weight: 600;
}

.k-profile-company {
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-profile-stats {
    display: flex;
    width: 100%;
    margin-top: 14px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-profile-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 4px;
}

.k-profile-stat + .k-profile-stat {
    border-inline-start: 1px solid var(--k-border, #e2e8f0);
}

.k-profile-stat-value {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-profile-stat-label {
    font-size: 0.6rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-profile-tags {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 14px 0;
}

.k-profile-tag {
    font-size: 0.6rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
}

.k-profile-actions {
    display: flex;
    gap: 8px;
    width: 100%;
    padding: 14px 14px 0;
}

.k-profile-action {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    color: var(--k-text-secondary, #64748b);
    font-size: 0.7rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-profile-action:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-profile-action.is-primary {
    background: linear-gradient(135deg, var(--k-primary, #1db954), color-mix(in srgb, var(--k-primary, #1db954) 75%, #000));
    border-color: transparent;
    color: #fff;
}

.k-profile-action.is-primary:hover {
    filter: brightness(1.07);
}
</style>
