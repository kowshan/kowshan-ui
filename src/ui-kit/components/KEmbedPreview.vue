<!-- KEmbedPreview.vue — rich URL preview card (OG image, title, description) -->
<template>
    <div class="k-embed" :class="{ 'is-clickable': url }" @click="url && openUrl()">
        <div v-if="image" class="k-embed-img">
            <img :src="image" :alt="title" loading="lazy" />
        </div>
        <div class="k-embed-body">
            <div v-if="favicon || siteName" class="k-embed-source">
                <img v-if="favicon" :src="favicon" class="k-embed-favicon" />
                <span v-if="siteName" class="k-embed-site">{{ siteName }}</span>
            </div>
            <h4 v-if="title" class="k-embed-title">{{ title }}</h4>
            <p v-if="description" class="k-embed-desc">{{ description }}</p>
            <div v-if="$slots.footer" class="k-embed-footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    url?: string
    title?: string
    description?: string
    image?: string
    favicon?: string
    siteName?: string
}>(), {})

const openUrl = () => {
    // handled by parent via v-bind
}
</script>

<style scoped>
.k-embed {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
    background: var(--k-bg, #fff);
    transition: box-shadow 0.2s ease;
}
.k-embed.is-clickable {
    cursor: pointer;
}
.k-embed.is-clickable:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.k-embed-img {
    width: 100%;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    background: var(--k-surface, #f1f5f9);
}
.k-embed-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.k-embed-body {
    padding: 12px 14px;
}
.k-embed-source {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}
.k-embed-favicon {
    width: 14px;
    height: 14px;
    border-radius: 3px;
}
.k-embed-site {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-text-muted);
    direction: ltr;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
.k-embed-title {
    margin: 0 0 4px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.k-embed-desc {
    margin: 0;
    font-size: 0.72rem;
    color: var(--k-text-muted);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.k-embed-footer {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}
</style>
