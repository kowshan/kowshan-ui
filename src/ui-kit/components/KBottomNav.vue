<!-- components/KBottomNav.vue -->
<!--
    KBottomNav — mobile-style bottom tab bar (like iOS / Telegram):

      <KBottomNav v-model="tab" :items="[
        { id: 'home', label: 'خانه', icon: Home },
        { id: 'deals', label: 'معاملات', icon: Briefcase, badge: '3' },
        { id: 'menu', label: 'بیشتر', icon: MoreHorizontal },
      ]" />
-->
<template>
    <nav class="k-bottomnav" :class="{ 'is-floating': floating }" aria-label="ناوبری پایین">
        <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="k-bottomnav-item"
            :class="{ 'is-active': modelValue === item.id }"
            :aria-current="modelValue === item.id ? 'page' : undefined"
            @click="select(item)"
        >
            <span class="k-bottomnav-icon">
                <component :is="item.icon" :size="item.iconSize || 20" />
                <span v-if="item.badge" class="k-bottomnav-badge" :class="{ 'is-dot': item.badge === true }">
                    {{ item.badge === true ? '' : item.badge }}
                </span>
            </span>
            <span class="k-bottomnav-label">{{ item.label }}</span>
        </button>
    </nav>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: string
    items: { id: string; label: string; icon: any; badge?: string | number | boolean; iconSize?: number }[]
    /** rounded floating bar with shadow (nice over content) */
    floating?: boolean
}>(), {
    modelValue: '',
    floating: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
}>()

const select = (item: { id: string }) => {
    if (item.id !== props.modelValue) {
        emits('update:modelValue', item.id)
        emits('change', item.id)
    }
}
</script>

<style scoped>
.k-bottomnav {
    display: flex;
    align-items: stretch;
    width: 100%;
    background: var(--k-surface, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    padding: 4px;
    gap: 2px;
}

.k-bottomnav.is-floating {
    border-radius: 999px;
    box-shadow: var(--k-shadow-lg, 0 10px 30px rgba(15, 23, 42, 0.12));
}

.k-bottomnav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 4px 6px;
    border: none;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    color: var(--k-text-muted, #94a3b8);
    transition: all 0.18s ease;
}

/* pill bar → the active pill must be fully rounded to match the container */
.k-bottomnav.is-floating .k-bottomnav-item {
    border-radius: 999px;
}

.k-bottomnav-item.is-active {
    background: var(--k-primary-light, color-mix(in srgb, #1db954 12%, transparent));
    color: var(--k-primary, #1db954);
    box-shadow: 0 1px 6px color-mix(in srgb, var(--k-primary, #1db954) 22%, transparent);
}

.k-bottomnav-item:hover {
    color: var(--k-text-secondary, #64748b);
}

.k-bottomnav-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-bottomnav-badge {
    position: absolute;
    top: -6px;
    inset-inline-end: -10px;
    min-width: 14px;
    height: 14px;
    padding: 0 3px;
    border-radius: 999px;
    background: var(--k-error, #ef4444);
    color: #fff;
    font-size: 0.5rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    border: 1.5px solid var(--k-surface, #fff);
}

.k-bottomnav-badge.is-dot {
    min-width: 7px;
    width: 7px;
    height: 7px;
    padding: 0;
}

.k-bottomnav-label {
    font-size: 0.62rem;
    font-weight: 600;
}
</style>
