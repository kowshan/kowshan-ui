<!-- KJobCard.vue — job listing card -->
<template>
    <div class="k-job">
        <div class="k-job-top">
            <div class="k-job-company-avatar">
                <img v-if="companyAvatar" :src="companyAvatar" />
                <span v-else class="k-job-company-letter">{{ company.charAt(0) }}</span>
            </div>
            <div class="k-job-info">
                <h4 class="k-job-title">{{ title }}</h4>
                <span class="k-job-company">{{ company }}</span>
            </div>
            <span v-if="isNew" class="k-job-new">New</span>
        </div>
        <div class="k-job-details">
            <span class="k-job-detail">
                <MapPin :size="12" /> {{ location }}
            </span>
            <span class="k-job-detail">
                <Clock :size="12" /> {{ type }}
            </span>
            <span v-if="salary" class="k-job-detail k-job-salary">
                <Banknote :size="12" /> {{ salary }}
            </span>
        </div>
        <div v-if="tags.length" class="k-job-tags">
            <span v-for="tag in tags" :key="tag" class="k-job-tag">{{ tag }}</span>
        </div>
        <div class="k-job-foot">
            <span class="k-job-time">{{ time }}</span>
            <button class="k-job-apply" @click.stop="$emit('apply')">
                Apply
                <ArrowLeft :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MapPin, Clock, Banknote, ArrowLeft } from 'lucide-vue-next'

withDefaults(defineProps<{
    title: string
    company: string
    companyAvatar?: string
    location: string
    type: string
    salary?: string
    tags?: string[]
    time?: string
    isNew?: boolean
}>(), {
    tags: () => [],
    time: '',
})

defineEmits<{ apply: [] }>()
</script>

<style scoped>
.k-job {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 16px;
    background: var(--k-bg, #fff);
    transition: all 0.2s ease;
}
.k-job:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    transform: translateY(-1px);
}
.k-job-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}
.k-job-company-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--k-surface, #f1f5f9);
}
.k-job-company-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.k-job-company-letter {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 800;
    color: var(--k-primary);
}
.k-job-info { flex: 1; min-width: 0; }
.k-job-title {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-text-primary);
}
.k-job-company {
    font-size: 0.7rem;
    color: var(--k-text-muted);
}
.k-job-new {
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.56rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
    flex-shrink: 0;
}
.k-job-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 10px;
}
.k-job-detail {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    color: var(--k-text-muted);
}
.k-job-salary {
    font-weight: 700;
    color: var(--k-primary, #1db954);
}
.k-job-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 12px;
}
.k-job-tag {
    padding: 3px 8px;
    border-radius: 6px;
    background: var(--k-surface, #f1f5f9);
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-text-secondary);
}
.k-job-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}
.k-job-time {
    font-size: 0.64rem;
    color: var(--k-text-muted);
}
.k-job-apply {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    border: none;
    border-radius: 8px;
    background: var(--k-primary, #1db954);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
}
.k-job-apply:hover { filter: brightness(1.08); }
</style>
