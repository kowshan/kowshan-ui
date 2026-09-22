<!-- components/KMegaMenuBar.vue — header mega menu bar
     A horizontal nav bar whose panel opens as a SINGLE CONNECTED container
     below it (no floating gap) — the asayroom-style header menu.
     • each top item opens a full-width panel (groups → columns, or items → list)
     • inner layers supported: column items with `children` render flyouts
     • `featured: true` renders the #featured slot beside the content
     • hover opens / switches panels; leaving the container closes; click toggles

     The panel is TELEPORTED to #k-teleport-hub and positioned `fixed` to match the
     bar's rect, so an `overflow: hidden` ancestor can never clip it.
-->
<template>
    <nav
        ref="rootRef"
        class="k-mega-bar"
        :class="{ 'is-open': open }"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
    >
        <!-- bar row -->
        <div ref="barEl" class="k-mega-bar-bar">
            <button
                v-for="(item, i) in items"
                :key="i"
                type="button"
                class="k-mega-bar-item"
                :class="{ 'is-active': open && active === i }"
                :aria-expanded="open && active === i"
                @mouseenter="hover(i)"
                @click="clickItem(i)"
            >
                <span v-if="item.icon" class="k-mega-bar-icon">
                    <component :is="item.icon" class="icon" />
                </span>
                <span class="k-mega-bar-label">{{ item.label }}</span>
                <span v-if="item.badge" class="k-mega-bar-badge">{{ item.badge }}</span>
                <ChevronDown
                    v-if="hasPanel(item)"
                    class="k-mega-bar-chevron"
                    :class="{ 'is-open': open && active === i }"
                />
            </button>
        </div>

        <!-- connected panel (teleported, fixed under the bar) -->
        <Teleport to="#k-teleport-hub">
            <Transition name="k-mega-bar">
                <div
                    v-if="open && activeItem"
                    ref="panelEl"
                    class="k-ui k-mega-bar-panel"
                    :data-theme="theme"
                    :style="panelStyle"
                    role="menu"
                    @mouseenter="cancelClose"
                    @mouseleave="scheduleClose"
                >
                    <div
                        class="k-mega-bar-content"
                        :class="{ 'has-featured': activeItem.featured }"
                    >
                        <!-- categorized columns -->
                        <div v-if="activeItem.groups?.length" class="k-mega-bar-groups">
                            <div v-for="(g, gi) in activeItem.groups" :key="gi" class="k-mega-bar-group">
                                <div v-if="g.title" class="k-mega-bar-group-title">{{ g.title }}</div>
                                <template v-for="(item, ii) in g.items" :key="ii">
                                    <div v-if="item === 'divider'" class="k-mega-separator" />
                                    <KMegaMenuItem v-else :item="item" @select="select" />
                                </template>
                            </div>
                        </div>

                        <!-- flat / nested list -->
                        <div v-else-if="activeItem.items?.length" class="k-mega-bar-list">
                            <template v-for="(item, i) in activeItem.items" :key="i">
                                <div v-if="item === 'divider'" class="k-mega-separator" />
                                <KMegaMenuItem v-else :item="item" @select="select" />
                            </template>
                        </div>

                        <!-- featured promo card -->
                        <slot v-if="activeItem.featured" name="featured" :item="activeItem" />
                    </div>

                    <slot name="footer" :item="activeItem" />
                </div>
            </Transition>
        </Teleport>
    </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useClickOutside } from '../composables/useClickOutside'
import { useKitTheme } from '../composables/useKitTheme'
import KMegaMenuItem from './KMegaMenuItem.vue'
import type { KMegaItem, KMegaGroup } from './KMegaMenuItem.vue'

export interface KMegaBarItem {
    label: string
    icon?: any
    badge?: string
    /** plain top-level link (no panel) */
    href?: string
    /** categorized columns shown in the panel */
    groups?: KMegaGroup[]
    /** flat list shown in the panel */
    items?: (KMegaItem | 'divider')[]
    /** renders the #featured slot beside the content */
    featured?: boolean
    value?: any
}

const props = withDefaults(defineProps<{
    items: KMegaBarItem[]
    closeOnSelect?: boolean
}>(), {
    closeOnSelect: true
})

const emits = defineEmits<{
    'select': [item: KMegaItem]
    'open': [index: number]
    'close': []
}>()

const theme = useKitTheme()
const rootRef = ref<HTMLElement | null>(null)
const barEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const active = ref<number | null>(null)
const open = ref(false)

const pos = ref({ top: 0, left: 0, width: 0 })
const ready = ref(false)

let hoverTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

const MARGIN = 12

const hasPanel = (item: KMegaBarItem) =>
    !!item.groups?.length || !!item.items?.length || !!item.featured

const activeItem = computed<KMegaBarItem | null>(() =>
    active.value == null ? null : props.items[active.value] ?? null
)

const panelStyle = computed(() => ({
    top: pos.value.top + 'px',
    left: pos.value.left + 'px',
    width: pos.value.width + 'px',
    visibility: (ready.value ? 'visible' : 'hidden') as 'visible' | 'hidden',
}))

/** match the panel to the bar's rect, clamped to the viewport */
const place = () => {
    const el = barEl.value
    if (!el) return
    const r = el.getBoundingClientRect()
    nextTick(() => {
        const width = Math.max(200, Math.min(r.width, window.innerWidth - MARGIN * 2))
        const left = Math.min(Math.max(MARGIN, r.left), Math.max(MARGIN, window.innerWidth - width - MARGIN))
        pos.value = { top: r.bottom - 1, left, width }
        ready.value = true
    })
}

const cancelClose = () => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}
/** delay the close so the pointer can travel from the bar into the teleported panel */
const scheduleClose = () => {
    cancelClose()
    closeTimer = setTimeout(close, 140)
}

const openAt = (i: number) => {
    if (!hasPanel(props.items[i])) return false
    if (active.value !== i) ready.value = false
    active.value = i
    open.value = true
    emits('open', i)
    place()
    return true
}

const hover = (i: number) => {
    if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
    if (active.value === i && open.value) return
    hoverTimer = setTimeout(() => { openAt(i) }, 60)
}

const clickItem = (i: number) => {
    if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
    const item = props.items[i]
    if (!hasPanel(item)) {
        // plain link — behave like a top-level action
        emits('select', { label: item.label, href: item.href, value: item.value } as KMegaItem)
        return
    }
    if (open.value && active.value === i) {
        close()
    } else {
        openAt(i)
    }
}

const close = () => {
    cancelClose()
    open.value = false
    active.value = null
    emits('close')
}

const select = (item: KMegaItem) => {
    emits('select', item)
    if (props.closeOnSelect) close()
}

const onReposition = () => { if (open.value) place() }

watch(open, v => {
    if (!v) return
    ready.value = false
    place()
})

useClickOutside([rootRef, panelEl], close)

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
}

onMounted(() => {
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
})
onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onReposition)
    window.removeEventListener('scroll', onReposition, true)
    if (hoverTimer) clearTimeout(hoverTimer)
    if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped>
.k-mega-bar {
    position: relative;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    background: var(--k-bg, #ffffff);
    transition: border-radius 0.15s ease;
}

.k-mega-bar.is-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.k-mega-bar-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px;
}

.k-mega-bar-item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: none;
    background: transparent;
    padding: 9px 14px;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.k-mega-bar-item:hover {
    background: var(--k-surface-hover, #f1f5f9);
}

/* active item looks like a tab connected to the panel below */
.k-mega-bar-item.is-active {
    background: var(--k-bg, #ffffff);
    color: var(--k-primary, #1db954);
    border-radius: 10px 10px 0 0;
    box-shadow: inset 0 -2px 0 var(--k-primary, #1db954);
}

.k-mega-bar-icon .icon {
    width: 15px;
    height: 15px;
    color: var(--k-text-secondary, #64748b);
}

.k-mega-bar-item.is-active .k-mega-bar-icon .icon {
    color: var(--k-primary, #1db954);
}

.k-mega-bar-badge {
    font-size: 0.6rem;
    font-weight: 800;
    color: #fff;
    background: var(--k-primary, #1db954);
    border-radius: 999px;
    padding: 1px 8px;
}

.k-mega-bar-chevron {
    width: 13px;
    height: 13px;
    color: var(--k-text-muted, #94a3b8);
    transition: transform 0.15s ease;
}

.k-mega-bar-chevron.is-open {
    transform: rotate(180deg);
    color: var(--k-primary, #1db954);
}

/* panel — teleported, fixed, matched to the bar rect */
.k-mega-bar-panel {
    position: fixed;
    z-index: 21000;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-top: none;
    border-radius: 0 0 14px 14px;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.16);
    padding: 10px 14px 14px;
    font-family: inherit;
    box-sizing: border-box;
    /* NOTE: no max-height/overflow — flyouts extend past the panel and would be clipped */
}

.k-mega-bar-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.k-mega-bar-content.has-featured {
    display: grid;
    grid-template-columns: 1fr minmax(180px, 240px);
    gap: 18px;
    align-items: start;
}

.k-mega-bar-groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 4px 16px;
    min-width: 0;
}

.k-mega-bar-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.k-mega-bar-group-title {
    font-size: 0.66rem;
    font-weight: 800;
    color: var(--k-text-muted, #94a3b8);
    padding: 6px 10px 4px;
}

.k-mega-bar-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 2px;
}

.k-mega-separator {
    height: 1px;
    background: var(--k-border, #e2e8f0);
    margin: 5px 8px;
}

/* Transition */
.k-mega-bar-enter-active,
.k-mega-bar-leave-active {
    transition: opacity 0.16s ease, transform 0.16s ease;
}

.k-mega-bar-enter-from,
.k-mega-bar-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
