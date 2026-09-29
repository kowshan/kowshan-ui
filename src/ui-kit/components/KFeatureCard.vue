<template>
    <div
        class="k-feature"
        :class="{ 'is-hoverable': hoverable }"
        role="button"
        tabindex="0"
        @click="$emit('click')"
        @keydown.enter="$emit('click')"
    >
        <div
            v-if="icon"
            class="k-feature__icon"
            :style="{ background: iconBg, color: iconColor }"
        >
            <component :is="icon" :size="22" />
        </div>

        <div class="k-feature__title">{{ title }}</div>

        <p class="k-feature__desc">
            <slot>{{ description }}</slot>
        </p>

        <div v-if="$slots.footer || linkText" class="k-feature__footer">
            <slot name="footer">
                <span class="k-feature__link">
                    {{ linkText }}
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        style="transform: scaleX(-1)"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    icon?: any
    iconBg?: string
    iconColor?: string
    linkText?: string
    hoverable?: boolean
}>(), {
    title: '',
    description: '',
    icon: null,
    iconBg: 'linear-gradient(135deg, var(--k-primary), var(--k-primary-hover))',
    iconColor: '#ffffff',
    linkText: '',
    hoverable: true
})

defineEmits<{
    (e: 'click'): void
}>()
</script>

<style scoped>
.k-feature {
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-lg, 12px);
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    outline: none;
}

.k-feature.is-hoverable:hover,
.k-feature.is-hoverable:focus-visible {
    transform: translateY(-3px);
    border-color: var(--k-primary, #1db954);
    box-shadow: var(--k-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
}

.k-feature__icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.k-feature__title {
    color: var(--k-text-primary, #1e293b);
    font-size: 15px;
    font-weight: 600;
}

.k-feature__desc {
    color: var(--k-text-secondary, #64748b);
    font-size: 13px;
    line-height: 1.9;
    margin: 0;
    flex: 1;
}

.k-feature__footer {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}

.k-feature__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-primary, #1db954);
    font-size: 13px;
    font-weight: 500;
}
</style>
