<!-- components/KMegaMenu.vue — big dropdown / mega menu
     Supports four shapes with one API:
       • single-level rich list  (items with icons + descriptions)
       • 2-depth                 (items with children → flyout)
       • 3-depth                 (nested children → nested flyouts)
       • categorized mega panel  (groups → column layout)

     The panel is TELEPORTED to #k-teleport-hub and positioned `fixed`, so it
     escapes any `overflow: hidden` ancestor and is clamped to the viewport.
-->
<template>
    <div ref="rootRef" class="k-mega">
        <!-- Trigger -->
        <div ref="triggerEl" class="k-mega-trigger">
            <slot name="trigger" :open="open" :toggle="toggle">
                <button
                    type="button"
                    class="k-mega-trigger-btn"
                    :class="{ 'is-open': open }"
                    :aria-expanded="open"
                    @click="toggle"
                >
                    <span>{{ label || 'منو' }}</span>
                    <ChevronDown class="k-mega-trigger-chevron" :class="{ 'is-open': open }" />
                </button>
            </slot>
        </div>

        <!-- Panel (teleported so no ancestor can clip it) -->
        <Teleport to="#k-teleport-hub">
            <Transition name="k-mega">
                <div
                    v-if="open"
                    ref="panelEl"
                    class="k-ui k-mega-panel"
                    :data-theme="theme"
                    :style="panelStyle"
                    role="menu"
                >
                    <!-- Categorized mode — column grid -->
                    <div v-if="groups.length" class="k-mega-groups">
                        <div v-for="(g, gi) in groups" :key="gi" class="k-mega-group">
                            <div v-if="g.title" class="k-mega-group-title">{{ g.title }}</div>
                            <template v-for="(item, ii) in g.items" :key="ii">
                                <div v-if="item === 'divider'" class="k-mega-separator" />
                                <KMegaMenuItem v-else :item="item" @select="onSelect" />
                            </template>
                        </div>
                    </div>

                    <!-- List mode — flat or nested flyouts -->
                    <template v-else>
                        <template v-for="(item, i) in items" :key="i">
                            <div v-if="item === 'divider'" class="k-mega-separator" />
                            <KMegaMenuItem v-else :item="item" @select="onSelect" />
                        </template>
                        <slot />
                    </template>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useClickOutside } from '../composables/useClickOutside'
import { useKitTheme } from '../composables/useKitTheme'
import KMegaMenuItem from './KMegaMenuItem.vue'
import type { KMegaItem, KMegaGroup } from './KMegaMenuItem.vue'

export type { KMegaItem, KMegaGroup } from './KMegaMenuItem.vue'

const props = withDefaults(defineProps<{
    /** trigger label (default trigger button); pass the `trigger` slot to fully customize */
    label?: string
    /** list-mode items — nested `children` render flyouts (2nd/3rd depth) */
    items?: (KMegaItem | 'divider')[]
    /** categorized mode — renders a wide column-grid panel */
    groups?: KMegaGroup[]
    /** which trigger edge the panel is anchored to; 'start' = inline-start (right in RTL) */
    align?: 'start' | 'end'
    /** 'down' (below trigger) | 'up' (above) */
    dir?: 'down' | 'up'
    /** explicit panel width; auto-sizes to mode when omitted */
    width?: string
    closeOnSelect?: boolean
}>(), {
    label: '',
    items: () => [],
    groups: () => [],
    align: 'start',
    dir: 'down',
    closeOnSelect: true
})

const emits = defineEmits<{
    'select': [item: KMegaItem]
    'toggle': [open: boolean]
}>()

const theme = useKitTheme()
const rootRef = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const open = ref(false)

/** viewport-fixed position of the teleported panel */
const pos = ref({ top: 0, left: 0 })
const ready = ref(false)

const GAP = 6
const MARGIN = 12

const toggle = () => {
    open.value = !open.value
    emits('toggle', open.value)
}

const onSelect = (item: KMegaItem) => {
    emits('select', item)
    if (props.closeOnSelect) open.value = false
}

const panelStyle = computed(() => {
    const size = props.width
        ? { width: props.width }
        : props.groups.length
            ? { width: 'min(660px, calc(100vw - 24px))' }
            : { width: 'min(300px, calc(100vw - 24px))' }
    return {
        ...size,
        top: pos.value.top + 'px',
        left: pos.value.left + 'px',
        visibility: (ready.value ? 'visible' : 'hidden') as 'visible' | 'hidden',
    }
})

/** measure the panel and place it, clamped inside the viewport */
const place = () => {
    const t = triggerEl.value
    if (!t) return
    const r = t.getBoundingClientRect()
    const rtl = getComputedStyle(t).direction === 'rtl'

    nextTick(() => {
        const pw = panelEl.value?.offsetWidth || 300
        const ph = panelEl.value?.offsetHeight || 240

        // 'start' anchors to the inline-start edge (right in RTL)
        const anchorRight = rtl ? props.align === 'start' : props.align === 'end'
        let left = anchorRight ? r.right - pw : r.left
        left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, window.innerWidth - pw - MARGIN))

        let top = props.dir === 'up' ? r.top - ph - GAP : r.bottom + GAP
        top = Math.min(Math.max(MARGIN, top), Math.max(MARGIN, window.innerHeight - ph - MARGIN))

        pos.value = { top, left }
        ready.value = true
    })
}

watch(open, v => {
    if (!v) return
    ready.value = false
    place()
})

const onReposition = () => { if (open.value) place() }

onMounted(() => {
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', onReposition)
    window.removeEventListener('scroll', onReposition, true)
    document.removeEventListener('keydown', onKey)
})

// the panel is teleported outside rootRef — include it or every click inside closes the menu
useClickOutside([rootRef, panelEl], () => { open.value = false })

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false
}

document.addEventListener('keydown', onKey)
</script>

<style scoped>
.k-mega {
    position: relative;
    display: inline-flex;
}

.k-mega-trigger {
    display: inline-flex;
}

.k-mega-trigger-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-bg, #ffffff);
    color: var(--k-text-primary, #1e293b);
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.k-mega-trigger-btn:hover,
.k-mega-trigger-btn.is-open {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-mega-trigger-chevron {
    width: 14px;
    height: 14px;
    transition: transform 0.15s ease;
}

.k-mega-trigger-chevron.is-open {
    transform: rotate(180deg);
}

/* Panel — fixed (teleported to the hub) */
.k-mega-panel {
    position: fixed;
    z-index: 21000;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 14px);
    box-shadow: 0 18px 48px rgba(2, 6, 23, 0.18);
    padding: 8px;
    display: flex;
    flex-direction: column;
    font-family: inherit;
    /* NOTE: no max-height/overflow here — nested flyouts extend past the panel
       and any non-visible overflow on this box would clip them */
}

/* Categorized grid */
.k-mega-groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 4px;
}

.k-mega-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.k-mega-group-title {
    font-size: 0.66rem;
    font-weight: 800;
    color: var(--k-text-muted, #94a3b8);
    padding: 6px 10px 4px;
}

.k-mega-separator {
    height: 1px;
    background: var(--k-border, #e2e8f0);
    margin: 5px 8px;
}

/* Transition */
.k-mega-enter-active,
.k-mega-leave-active {
    transition: opacity 0.14s ease, transform 0.14s ease;
}

.k-mega-enter-from,
.k-mega-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
