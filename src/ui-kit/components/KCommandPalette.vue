<!-- components/KCommandPalette.vue -->
<template>
    <Teleport to="#k-teleport-hub">
        <Transition name="k-cmd-fade">
            <div
                v-if="visible"
                class="k-ui k-cmd-backdrop"
                :data-theme="theme"
                @click.self="close"
            >
                <div class="k-cmd" role="dialog" aria-modal="true" aria-label="جستجوی سریع">
                    <!-- Search input -->
                    <div class="k-cmd-search">
                        <Search class="icon" />
                        <input
                            ref="inputRef"
                            v-model="query"
                            type="text"
                            :placeholder="placeholder"
                            @keydown.down.prevent="move(1)"
                            @keydown.up.prevent="move(-1)"
                            @keydown.enter.prevent="selectCurrent"
                            @keydown.esc.prevent="close"
                        />
                        <kbd class="k-cmd-esc">ESC</kbd>
                    </div>

                    <!-- Results -->
                    <div class="k-cmd-body">
                        <div v-if="!filtered.length" class="k-cmd-empty">
                            <SearchX class="empty-icon" />
                            <span>نتیجه‌ای یافت نشد</span>
                        </div>

                        <template v-for="(group, gi) in filteredGroups" :key="group.id">
                            <div class="k-cmd-group-title">{{ group.title }}</div>
                            <button
                                v-for="(item, ii) in group.items"
                                :key="item.id"
                                type="button"
                                class="k-cmd-item"
                                :class="{ 'is-active': activeIndex === flatIndex(gi, ii) }"
                                @mouseenter="activeIndex = flatIndex(gi, ii)"
                                @click="select(item)"
                            >
                                <span v-if="item.icon" class="k-cmd-item-icon">
                                    <component :is="item.icon" class="icon" />
                                </span>
                                <span class="k-cmd-item-label">{{ item.label }}</span>
                                <span v-if="item.shortcut" class="k-cmd-item-shortcut">
                                    <kbd v-for="(k, ki) in item.shortcut.split('+')" :key="ki">{{ k }}</kbd>
                                </span>
                            </button>
                        </template>
                    </div>

                    <!-- Footer hints -->
                    <div class="k-cmd-footer">
                        <span><kbd>↑</kbd><kbd>↓</kbd> حرکت</span>
                        <span><kbd>Enter</kbd> انتخاب</span>
                        <span><kbd>Esc</kbd> بستن</span>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Search, SearchX } from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'

export interface KCommandItem {
    id: string
    label: string
    description?: string
    icon?: any
    shortcut?: string
    keywords?: string[]
    disabled?: boolean
}

export interface KCommandGroup {
    id: string
    title: string
    items: KCommandItem[]
}

const props = withDefaults(defineProps<{
    visible: boolean
    groups: KCommandGroup[]
    placeholder?: string
    /** listen for Ctrl/Cmd+K globally to open */
    bindShortcut?: boolean
    shortcut?: string
}>(), {
    placeholder: 'جستجو کنید… (Ctrl+K)',
    bindShortcut: true,
    shortcut: 'mod+k'
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'select': [item: KCommandItem]
}>()

const theme = useKitTheme()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

const q = computed(() => query.value.trim().toLowerCase())

const filtered = computed(() => {
    if (!q.value) return props.groups
    return props.groups
        .map(g => ({
            ...g,
            items: g.items.filter(it =>
                it.label.toLowerCase().includes(q.value)
                || it.description?.toLowerCase().includes(q.value)
                || it.keywords?.some(k => k.toLowerCase().includes(q.value))
            )
        }))
        .filter(g => g.items.length > 0)
})

const filteredGroups = computed(() => filtered.value)

const total = computed(() => filtered.value.reduce((n, g) => n + g.items.length, 0))

const flatIndex = (gi: number, ii: number) => {
    let idx = 0
    for (let g = 0; g < gi; g++) idx += filtered.value[g].items.length
    return idx + ii
}

const itemAt = (index: number): KCommandItem | null => {
    let i = 0
    for (const g of filtered.value) {
        for (const it of g.items) {
            if (i === index) return it
            i++
        }
    }
    return null
}

const move = (dir: number) => {
    if (!total.value) return
    activeIndex.value = (activeIndex.value + dir + total.value) % total.value
}

const selectCurrent = () => {
    const item = itemAt(activeIndex.value)
    if (item) select(item)
}

const select = (item: KCommandItem) => {
    emits('select', item)
    emits('update:visible', false)
}

const close = () => emits('update:visible', false)

/* Reset + focus when opened */
watch(() => props.visible, (v) => {
    if (v) {
        query.value = ''
        activeIndex.value = 0
        nextTick(() => inputRef.value?.focus())
    }
})

/* Global shortcut */
const onKey = (e: KeyboardEvent) => {
    if (!props.bindShortcut) return
    const mod = e.metaKey || e.ctrlKey
    const key = e.key.toLowerCase()
    const parts = props.shortcut.split('+')
    const wantsMod = parts.includes('mod') || parts.includes('ctrl')
    const wantsKey = parts.filter(p => p !== 'mod' && p !== 'ctrl')[0] || ''
    if (wantsMod && mod && key === wantsKey.toLowerCase()) {
        e.preventDefault()
        emits('update:visible', !props.visible)
    }
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.k-cmd-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10050;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 12vh;
}

.k-cmd {
    width: min(560px, calc(100vw - 32px));
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    box-shadow: 0 24px 64px rgba(2, 6, 23, 0.35);
    overflow: hidden;
}

.k-cmd-search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}

.k-cmd-search .icon {
    width: 18px;
    height: 18px;
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-cmd-search input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--k-text-primary, #1e293b);
}

.k-cmd-search input::placeholder {
    color: var(--k-text-muted, #94a3b8);
}

.k-cmd-esc {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 5px;
    padding: 2px 6px;
    flex-shrink: 0;
}

.k-cmd-body {
    max-height: 320px;
    overflow-y: auto;
    padding: 8px;
}

.k-cmd-group-title {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-muted, #94a3b8);
    padding: 8px 10px 4px;
}

.k-cmd-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    border: none;
    background: transparent;
    border-radius: 9px;
    padding: 9px 10px;
    cursor: pointer;
    font-family: inherit;
    text-align: start;
    transition: background 0.1s ease;
}

.k-cmd-item.is-active {
    background: var(--k-primary-light, #e3f8ec);
}

.k-cmd-item-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.k-cmd-item.is-active .k-cmd-item-icon {
    background: var(--k-primary, #1db954);
    border-color: var(--k-primary, #1db954);
    color: #ffffff;
}

.k-cmd-item-icon .icon {
    width: 15px;
    height: 15px;
}

.k-cmd-item-label {
    flex: 1;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--k-text-primary, #1e293b);
}

.k-cmd-item-shortcut {
    display: flex;
    gap: 3px;
}

.k-cmd-item-shortcut kbd,
.k-cmd-footer kbd {
    font-family: inherit;
    font-size: 0.62rem;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 5px;
    padding: 2px 5px;
    min-width: 18px;
    text-align: center;
}

.k-cmd-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 0;
    color: var(--k-text-muted, #94a3b8);
    font-size: 0.82rem;
}

.k-cmd-empty .empty-icon {
    width: 26px;
    height: 26px;
}

.k-cmd-footer {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 16px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-cmd-footer span {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Transitions */
.k-cmd-fade-enter-active,
.k-cmd-fade-leave-active {
    transition: opacity 0.16s ease;
}

.k-cmd-fade-enter-active .k-cmd,
.k-cmd-fade-leave-active .k-cmd {
    transition: transform 0.18s ease, opacity 0.18s ease;
}

.k-cmd-fade-enter-from,
.k-cmd-fade-leave-to {
    opacity: 0;
}

.k-cmd-fade-enter-from .k-cmd,
.k-cmd-fade-leave-to .k-cmd {
    transform: translateY(-10px) scale(0.98);
}
</style>
