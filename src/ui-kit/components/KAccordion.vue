<!-- components/KAccordion.vue -->
<template>
    <div class="k-accordion" :class="{ 'is-bordered': bordered }">
        <div
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="k-accordion-item"
            :class="{ 'is-open': isOpen(index) }"
        >
            <button
                type="button"
                class="k-accordion-header"
                :aria-expanded="isOpen(index)"
                :aria-controls="`k-acc-${uid}-${index}`"
                :disabled="item.disabled"
                @click="toggle(index)"
            >
                <span class="k-accordion-title">
                    <component :is="item.icon" v-if="item.icon" class="k-accordion-icon" />
                    {{ item.title }}
                </span>

                <ChevronDown class="k-accordion-chevron" aria-hidden="true" />
            </button>

            <!-- Animated body: grid-rows trick keeps height smooth -->
            <div
                :id="`k-acc-${uid}-${index}`"
                class="k-accordion-body"
                :class="{ 'is-collapsed': !isOpen(index) }"
            >
                <div class="k-accordion-content">
                    <slot :name="`item-${index}`" :item="item" :index="index">
                        <slot name="content" :item="item" :index="index">
                            <p v-if="item.content" class="k-accordion-text">{{ item.content }}</p>
                        </slot>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useKitId } from '../composables/useKitId'
import { ChevronDown } from 'lucide-vue-next'

export interface KAccordionItem {
    id?: string | number
    title: string
    content?: string
    icon?: any
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    items: KAccordionItem[]
    /** index(es) open by default */
    open?: number | number[]
    /** allow more than one open panel at once */
    multiple?: boolean
    bordered?: boolean
}>(), {
    multiple: false,
    bordered: true
})

const emits = defineEmits<{
    (e: 'toggle', index: number, open: boolean): void
}>()

const { id: uid } = useKitId('k-acc')

const openIndexes = ref<number[]>(
    Array.isArray(props.open)
        ? [...props.open]
        : props.open != null ? [props.open] : []
)

const isOpen = (index: number) => openIndexes.value.includes(index)

const toggle = (index: number) => {
    const item = props.items[index]
    if (item?.disabled) return

    const currentlyOpen = isOpen(index)

    if (props.multiple) {
        openIndexes.value = currentlyOpen
            ? openIndexes.value.filter(i => i !== index)
            : [...openIndexes.value, index]
    } else {
        openIndexes.value = currentlyOpen ? [] : [index]
    }

    emits('toggle', index, !currentlyOpen)
}
</script>

<style scoped>
.k-accordion {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
}

.k-accordion.is-bordered {
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg);
}

.k-accordion-item {
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-accordion-item:last-child {
    border-bottom: none;
}

.k-accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 16px;
    background: var(--k-surface);
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 800;
    font-family: inherit;
    color: var(--k-text-primary);
    transition: background 0.15s ease;
    text-align: start;
}

.k-accordion-header:hover:not(:disabled) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-accordion-header:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-accordion-header:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: -2px;
}

.k-accordion-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.k-accordion-icon {
    width: 16px;
    height: 16px;
    color: var(--k-primary);
}

.k-accordion-chevron {
    width: 16px;
    height: 16px;
    color: var(--k-text-secondary);
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.k-accordion-item.is-open .k-accordion-chevron {
    transform: rotate(180deg);
}

/* Animated collapse via grid-template-rows */
.k-accordion-body {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.25s ease;
    background: var(--k-bg);
}

.k-accordion-body.is-collapsed {
    grid-template-rows: 0fr;
}

.k-accordion-content {
    overflow: hidden;
    min-height: 0;
}

.k-accordion-text {
    padding: 14px 16px;
    font-size: 0.83rem;
    color: var(--k-text-secondary);
    line-height: 1.8;
    margin: 0;
}
</style>
