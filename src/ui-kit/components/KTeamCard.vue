<!-- KTeamCard.vue — team member card -->
<template>
    <div class="k-team">
        <div class="k-team-avatar-wrap">
            <img v-if="avatar" :src="avatar" class="k-team-avatar" />
            <div v-else class="k-team-avatar k-team-avatar-text">{{ name.charAt(0) }}</div>
            <KPresenceIndicator :status="status" class="k-team-presence" />
        </div>
        <h4 class="k-team-name">{{ name }}</h4>
        <p class="k-team-role">{{ role }}</p>
        <p v-if="bio" class="k-team-bio">{{ bio }}</p>
        <div v-if="socials && socials.length" class="k-team-socials">
            <a
                v-for="s in socials"
                :key="s.label"
                :href="s.url"
                :title="s.label"
                class="k-team-social"
                target="_blank"
                rel="noopener"
            >
                <component :is="s.icon" :size="14" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import KPresenceIndicator from './KPresenceIndicator.vue'

defineProps<{
    name: string
    role: string
    avatar?: string
    bio?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
    socials?: { icon: any; url: string; label: string }[]
}>()
</script>

<style scoped>
.k-team {
    text-align: center;
    padding: 20px 16px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    background: var(--k-bg, #fff);
    transition: all 0.2s ease;
}
.k-team:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    transform: translateY(-2px);
}
.k-team-avatar-wrap {
    position: relative;
    width: 72px;
    height: 72px;
    margin: 0 auto 12px;
}
.k-team-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
}
.k-team-avatar-text {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--k-primary-light);
    color: var(--k-primary);
    font-size: 1.4rem;
    font-weight: 800;
}
.k-team-presence {
    position: absolute;
    bottom: 2px;
    right: 2px;
}
.k-team-name {
    margin: 0 0 2px;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--k-text-primary);
}
.k-team-role {
    margin: 0 0 8px;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--k-primary, #1db954);
}
.k-team-bio {
    margin: 0 0 12px;
    font-size: 0.7rem;
    color: var(--k-text-muted);
    line-height: 1.5;
}
.k-team-socials {
    display: flex;
    justify-content: center;
    gap: 6px;
}
.k-team-social {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-text-muted);
    text-decoration: none;
    transition: all 0.12s;
}
.k-team-social:hover {
    border-color: var(--k-primary);
    color: var(--k-primary);
    background: var(--k-primary-light);
}
</style>
