<!-- components/KBreadcrumb.vue -->
<template>
    <nav class="k-breadcrumb" :aria-label="ariaLabel">
        <ol class="k-breadcrumb-list">
            <li
                v-for="(item, i) in items"
                :key="i"
                class="k-breadcrumb-item"
                :class="{ 'is-current': i === items.length - 1 }"
            >
                <a
                    v-if="item.href && i < items.length - 1"
                    class="k-breadcrumb-link"
                    :href="item.href"
                >
                    <component :is="item.icon" v-if="item.icon" class="icon" />
                    {{ item.label }}
                </a>
                <button
                    v-else-if="!item.href && i < items.length - 1"
                    type="button"
                    class="k-breadcrumb-link"
                    @click="navigate(item)"
                >
                    <component :is="item.icon" v-if="item.icon" class="icon" />
                    {{ item.label }}
                </button>
                <span v-else class="k-breadcrumb-current" aria-current="page">
                    <component :is="item.icon" v-if="item.icon" class="icon" />
                    {{ item.label }}
                </span>

                <span v-if="i < items.length - 1" class="k-breadcrumb-sep">
                    <ChevronLeft class="sep-icon" />
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

export interface KBreadcrumbItem {
    label: string
    href?: string
    icon?: any
}

const props = withDefaults(defineProps<{
    items: KBreadcrumbItem[]
    ariaLabel?: string
}>(), {
    ariaLabel: 'مسیر'
})

const emits = defineEmits<{
    'select': [item: KBreadcrumbItem]
}>()

const navigate = (item: KBreadcrumbItem) => emits('select', item)
</script>

<style scoped>
.k-breadcrumb {
}

.k-breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.k-breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.k-breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.8rem;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    padding: 3px 6px;
    border-radius: 6px;
    text-decoration: none;
    transition: color 0.12s ease, background 0.12s ease;
}

.k-breadcrumb-link:hover {
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-breadcrumb-link .icon,
.k-breadcrumb-current .icon {
    width: 14px;
    height: 14px;
}

.k-breadcrumb-current {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    padding: 3px 6px;
}

.k-breadcrumb-sep {
    display: flex;
    align-items: center;
    color: var(--k-text-muted, #94a3b8);
}

.sep-icon {
    width: 14px;
    height: 14px;
}
</style>
