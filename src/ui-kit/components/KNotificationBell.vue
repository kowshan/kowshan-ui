<!-- components/KNotificationBell.vue -->
<!--
    KNotificationBell — bell + dropdown notification panel:

      <KNotificationBell :items="notifications" @read="onRead" @read-all="onReadAll" />

    item: { id, title, message?, time?, read?, type?: 'info'|'success'|'warning'|'error' }
-->
<template>
    <div ref="rootRef" class="k-nb">
        <button
            type="button"
            class="k-nb-bell"
            :class="{ 'is-open': open }"
            :aria-label="`اعلان‌ها (${unread} خوانده‌نشده)`"
            @click="open = !open"
        >
            <Bell :size="18" />
            <span v-if="unread > 0" class="k-nb-badge">{{ Math.min(unread, 99) }}</span>
        </button>

        <!-- teleported so an `overflow: hidden` ancestor can't clip it, and clamped to the viewport -->
        <Teleport to="#k-teleport-hub">
            <Transition name="k-slide-down">
            <div
                v-if="open"
                ref="panelEl"
                class="k-ui k-nb-panel"
                :data-theme="theme"
                :style="panelStyle"
            >
                <div class="k-nb-header">
                    <span class="k-nb-title">اعلان‌ها</span>
                    <button
                        v-if="unread > 0"
                        type="button"
                        class="k-nb-readall"
                        @click="$emit('read-all'); open = false"
                    >
                        خواندن همه
                    </button>
                </div>

                <div v-if="!items.length" class="k-nb-empty">
                    <BellOff :size="20" />
                    <span>اعلانی وجود ندارد</span>
                </div>

                <ul v-else class="k-nb-list">
                    <li
                        v-for="n in items"
                        :key="n.id"
                        class="k-nb-item"
                        :class="{ 'is-unread': !n.read }"
                        @click="onClick(n)"
                    >
                        <span class="k-nb-dot" :class="`is-${n.type || 'info'}`" />
                        <div class="k-nb-body">
                            <div class="k-nb-item-title">{{ n.title }}</div>
                            <div v-if="n.message" class="k-nb-item-msg">{{ n.message }}</div>
                            <div v-if="n.time" class="k-nb-item-time">{{ n.time }}</div>
                        </div>
                    </li>
                </ul>
            </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Bell, BellOff } from 'lucide-vue-next'
import { useClickOutside } from '../composables/useClickOutside'
import { useKitTheme } from '../composables/useKitTheme'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export interface KNotification {
    id: string | number
    title: string
    message?: string
    time?: string
    read?: boolean
    type?: 'info' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<{
    items?: KNotification[]
}>(), {
    items: () => []
})

const emit = defineEmits<{
    (e: 'read', item: KNotification): void
    (e: 'read-all'): void
}>()

const { toPersianDigits } = usePersianNumbers()

const rootRef = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const open = ref(false)

const theme = useKitTheme()
const pos = ref({ top: 0, left: 0 })
const ready = ref(false)

const MARGIN = 12

/** place the teleported panel under the bell, clamped inside the viewport */
const place = () => {
    const t = rootRef.value
    if (!t) return
    const r = t.getBoundingClientRect()
    const rtl = getComputedStyle(t).direction === 'rtl'
    nextTick(() => {
        const pw = panelEl.value?.offsetWidth || 300
        const ph = panelEl.value?.offsetHeight || 320
        // panel is anchored to the bell's inline-end edge (left in RTL)
        let left = rtl ? r.left : r.right - pw
        left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, window.innerWidth - pw - MARGIN))
        const top = Math.min(r.bottom + 8, Math.max(MARGIN, window.innerHeight - ph - MARGIN))
        pos.value = { top, left }
        ready.value = true
    })
}

const panelStyle = computed(() => ({
    top: pos.value.top + 'px',
    left: pos.value.left + 'px',
    visibility: (ready.value ? 'visible' : 'hidden') as 'visible' | 'hidden',
}))

const onReposition = () => { if (open.value) place() }

watch(open, v => {
    if (!v) return
    ready.value = false
    place()
})

onMounted(() => {
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', onReposition)
    window.removeEventListener('scroll', onReposition, true)
})

const unread = computed(() => props.items.filter(n => !n.read).length)

const onClick = (n: KNotification) => {
    emit('read', n)
    if (n.read === false) n.read = true // let parent re-bind; optimistic visual
}

// the panel is teleported outside rootRef — without it, every click inside closes the panel
useClickOutside([rootRef, panelEl], () => { open.value = false })
</script>

<style scoped>
.k-nb {
    position: relative;
    display: inline-flex;
}

.k-nb-bell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
    background: var(--k-bg, #fff);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-nb-bell:hover,
.k-nb-bell.is-open {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-nb-badge {
    position: absolute;
    top: -5px;
    inset-inline-end: -5px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--k-error, #ef4444);
    color: #fff;
    font-size: 0.58rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--k-bg, #fff);
}

.k-nb-panel {
    position: fixed;
    z-index: 21000;
    width: 300px;
    max-height: 380px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    box-shadow: var(--k-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: inherit;
}

.k-nb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}

.k-nb-title {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-nb-readall {
    border: none;
    background: none;
    color: var(--k-primary, #1db954);
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
}

.k-nb-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 28px 14px;
    color: var(--k-text-muted, #94a3b8);
    font-size: 0.72rem;
}

.k-nb-list {
    list-style: none;
    margin: 0;
    padding: 4px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.k-nb-item {
    display: flex;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.12s ease;
}

.k-nb-item:hover { background: var(--k-surface-hover, #f1f5f9); }
.k-nb-item.is-unread { background: var(--k-primary-light, #e3f8ec); }

.k-nb-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
}

.k-nb-dot.is-info { background: var(--k-info, #8b5cf6); }
.k-nb-dot.is-success { background: var(--k-success, #10b981); }
.k-nb-dot.is-warning { background: var(--k-warning, #f59e0b); }
.k-nb-dot.is-error { background: var(--k-error, #ef4444); }

.k-nb-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-nb-item-title {
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-nb-item.is-unread .k-nb-item-title { color: var(--k-primary, #1db954); }

.k-nb-item-msg {
    font-size: 0.68rem;
    color: var(--k-text-secondary, #64748b);
    line-height: 1.6;
}

.k-nb-item-time {
    font-size: 0.6rem;
    color: var(--k-text-muted, #94a3b8);
    margin-top: 2px;
}

@media (max-width: 480px) {
    .k-nb-panel {
        position: fixed;
        top: 52px;
        inset-inline: 10px;
        width: auto;
    }
}
</style>
