<template>
    <div class="k-testimonial" :class="[`k-testimonial--${variant}`]">
        <!-- Quote mark -->
        <div class="k-testimonial__quote-mark">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="22"
                height="22"
            >
                <path
                    d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"
                />
            </svg>
        </div>

        <!-- Stars -->
        <div class="k-testimonial__stars">
            <svg
                v-for="i in 5"
                :key="i"
                viewBox="0 0 24 24"
                :width="16"
                :height="16"
                class="k-testimonial__star"
                :class="{ 'is-off': i > (rating || 5) }"
            >
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
            </svg>
        </div>

        <!-- Quote -->
        <blockquote class="k-testimonial__quote">
            <slot>{{ quote }}</slot>
        </blockquote>

        <!-- Author -->
        <div class="k-testimonial__author">
            <KAvatar
                :name="authorName"
                :src="authorImage"
                size="md"
            />
            <div class="k-testimonial__meta">
                <div class="k-testimonial__name">{{ authorName }}</div>
                <div class="k-testimonial__role">{{ authorRole }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KAvatar from './KAvatar.vue'

withDefaults(defineProps<{
    quote?: string
    authorName?: string
    authorRole?: string
    authorImage?: string
    rating?: number
    variant?: 'default' | 'accent'
}>(), {
    quote: '',
    authorName: '',
    authorRole: '',
    authorImage: '',
    rating: 5,
    variant: 'default'
})
</script>

<style scoped>
.k-testimonial {
    position: relative;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-lg, 12px);
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.k-testimonial:hover {
    transform: translateY(-2px);
    border-color: var(--k-primary, #1db954);
    box-shadow: var(--k-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
}

.k-testimonial--accent {
    background: linear-gradient(135deg, var(--k-primary, #1db954), var(--k-primary-hover, #17a34a));
    border-color: transparent;
}

.k-testimonial--accent .k-testimonial__quote,
.k-testimonial--accent .k-testimonial__name,
.k-testimonial--accent .k-testimonial__role {
    color: #fff;
}

.k-testimonial--accent .k-testimonial__quote-mark {
    color: rgba(255, 255, 255, .35);
}

.k-testimonial__quote-mark {
    color: var(--k-primary, #1db954);
    opacity: .5;
}

.k-testimonial__stars {
    display: flex;
    gap: 2px;
}

.k-testimonial__star {
    color: var(--k-warning, #f59e0b);
    fill: var(--k-warning, #f59e0b);
}

.k-testimonial__star.is-off {
    color: var(--k-border, #e2e8f0);
    fill: var(--k-border, #e2e8f0);
}

.k-testimonial__quote {
    margin: 0;
    color: var(--k-text-primary, #1e293b);
    font-size: 14px;
    line-height: 1.8;
}

.k-testimonial__author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-testimonial__name {
    color: var(--k-text-primary, #1e293b);
    font-size: 13px;
    font-weight: 600;
}

.k-testimonial__role {
    color: var(--k-text-secondary, #64748b);
    font-size: 12px;
    margin-top: 2px;
}
</style>
