<template>
    <section :id="id" class="demo-section">
        <div class="demo-section-head">
            <div class="demo-section-title">
                <span class="demo-section-index">{{ index }}</span>
                <h3>{{ title }}</h3>
            </div>
            <p v-if="description">{{ description }}</p>
        </div>
        <div class="demo-section-card">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    id: string
    index: string
    title: string
    description?: string
}>()
</script>
