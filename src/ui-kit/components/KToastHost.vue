<!-- components/KToastHost.vue -->
<template>
    <div v-for="pos in stackPositions" :key="pos" class="k-ui k-toast-host" :data-theme="theme" :class="`pos-${pos}`">
        <TransitionGroup name="k-toast">
            <div
                v-for="t in toastsFor(pos)"
                :key="t.id"
                class="k-toast"
                :class="[`is-${t.type}`, { 'is-paused': pausedIds.has(t.id) }]"
                role="status"
                @mouseenter="pauseClose(t.id)"
                @mouseleave="resumeClose(t.id)"
            >
                <span class="k-toast-icon">
                    <component :is="t.icon || variantIcon(t.type)" class="icon" />
                </span>

                <div class="k-toast-body">
                    <!-- Multi-message: title + list -->
                    <template v-if="t.message.length > 1">
                        <div class="k-toast-title">{{ t.title || 'اطلاعات را بررسی کنید' }}</div>
                        <ul class="k-toast-list">
                            <li v-for="(m, mi) in t.message" :key="mi">{{ m }}</li>
                        </ul>
                    </template>

                    <!-- Single message -->
                    <template v-else>
                        <div v-if="t.title" class="k-toast-title">{{ t.title }}</div>
                        <div v-if="t.message[0]" class="k-toast-message">{{ t.message[0] }}</div>
                        <div v-if="t.description" class="k-toast-desc">{{ t.description }}</div>
                    </template>

                    <!-- Action buttons -->
                    <div v-if="t.buttons.length" class="k-toast-actions">
                        <button
                            v-for="(b, bi) in t.buttons"
                            :key="bi"
                            type="button"
                            class="k-toast-action"
                            :class="`variant-${b.variant || 'primary'}`"
                            @click="runButton(t, b)"
                        >
                            {{ b.label }}
                        </button>
                    </div>
                </div>

                <button
                    v-if="t.closable"
                    type="button"
                    class="k-toast-close"
                    aria-label="بستن"
                    @click="removeToast(t.id)"
                >
                    <X class="icon" />
                </button>

                <span
                    v-if="t.duration > 0"
                    class="k-toast-timer"
                    :class="{ 'is-paused': pausedIds.has(t.id) }"
                    :style="{ animationDuration: (t.duration / 1000) + 's' }"
                    @animationend="removeToast(t.id)"
                />
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { X, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-vue-next'
import { useToastStore } from '../stores/toastStore'
import type { ToastType, ToastButton } from '../stores/toastStore'
import { useKitTheme } from '../composables/useKitTheme'

const props = withDefaults(defineProps<{
    /** default corner for toasts without their own `position` */
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'top'
}>(), {
    position: 'bottom-left'
})

const theme = useKitTheme()
const { state, removeToast } = useToastStore()
/* computed, not `state.toasts` — a captured array reference goes stale the moment
   the store swaps the list (clearToasts), which froze toasts on screen */
const toasts = computed(() => state.toasts)

const icons: Record<ToastType, any> = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle
}

const variantIcon = (t: ToastType) => icons[t]

/* Per-toast stacks: each toast can pick its own corner ('top' defaults to top-right) */
const normalizePos = (p?: string) => {
    if (!p) return props.position
    if (p === 'top' || p === 'bottom') {
        return p === 'top' ? 'top-right' : 'bottom-left'
    }
    return p as 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

const stackPositions = computed(() => {
    const set = new Set<string>([normalizePos(props.position)])
    toasts.value.forEach(t => set.add(normalizePos(t.position)))
    return [...set]
})

const toastsFor = (pos: string) => toasts.value.filter(t => normalizePos(t.position) === pos)

/* Autoclose: real timeout per toast (the timer bar is the visual cue) */
const timers = new Map<number, ReturnType<typeof setTimeout>>()
const deadlines = new Map<number, number>()
const pausedIds = ref(new Set<number>())

const scheduleClose = (id: number, delay: number) => {
    clearTimeout(timers.get(id))
    deadlines.set(id, Date.now() + delay)
    timers.set(id, setTimeout(() => removeToast(id), delay))
}

/* Watch the length, not the computed itself: the list is replaced/spliced in
   place, so watching a computed that returns the same array never fires. */
watch(() => state.toasts.length, () => {
    const list = state.toasts
    pausedIds.value = new Set([...pausedIds.value].filter(id => list.some(t => t.id === id)))
    // schedule close for new sticky-less toasts
    list.forEach(t => {
        if (t.duration > 0 && !timers.has(t.id)) {
            scheduleClose(t.id, t.duration)
        }
    })
    // clear timers for removed toasts
    timers.forEach((timer, id) => {
        if (!list.some(t => t.id === id)) {
            clearTimeout(timer)
            timers.delete(id)
            deadlines.delete(id)
            pausedIds.value.delete(id)
        }
    })
})

/* Pause-on-hover: hold the auto-dismiss (JS timer + CSS bar) while the mouse is over the toast */
const pauseClose = (id: number) => {
    if (!timers.has(id) || pausedIds.value.has(id)) return
    clearTimeout(timers.get(id))
    timers.delete(id)
    pausedIds.value = new Set(pausedIds.value).add(id)
}

const resumeClose = (id: number) => {
    if (!pausedIds.value.has(id)) return
    const next = new Set(pausedIds.value)
    next.delete(id)
    pausedIds.value = next
    const deadline = deadlines.get(id)
    if (!deadline) return
    const remaining = Math.max(0, deadline - Date.now())
    if (remaining > 0) scheduleClose(id, remaining)
    else removeToast(id)
}

onBeforeUnmount(() => {
    timers.forEach(timer => clearTimeout(timer))
    timers.clear()
    deadlines.clear()
})

const runButton = (t: any, b: ToastButton) => {
    b.onClick?.()
    removeToast(t.id)
}
</script>

<style scoped>
.k-toast-host {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10001;
    width: min(380px, calc(100vw - 32px));
    pointer-events: none;
    font-family: var(--k-font-family, 'yekan-bakh', Tahoma, sans-serif);
}

.k-toast-host > * {
    pointer-events: auto;
}

/* Positions */
.k-toast-host.pos-bottom-left { bottom: 16px; left: 16px; }
.k-toast-host.pos-bottom-right { bottom: 16px; right: 16px; }
.k-toast-host.pos-top-left { top: 16px; left: 16px; }
.k-toast-host.pos-top-right { top: 16px; right: 16px; }

.k-toast-host.pos-bottom-left,
.k-toast-host.pos-bottom-right {
    flex-direction: column-reverse;
}

.k-toast-host.pos-top-left,
.k-toast-host.pos-top-right {
    flex-direction: column;
}

.k-toast {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    box-shadow: 0 10px 28px rgba(2, 6, 23, 0.16);
    padding: 12px 14px;
    overflow: hidden;
}

.k-toast-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
}

.k-toast-icon .icon {
    width: 13px;
    height: 13px;
}

.k-toast.is-info .k-toast-icon { background: #e0f2fe; color: #0284c7; }
.k-toast.is-success .k-toast-icon { background: #dcfce7; color: #16a34a; }
.k-toast.is-warning .k-toast-icon { background: #fef3c7; color: #d97706; }
.k-toast.is-error .k-toast-icon { background: #fee2e2; color: #dc2626; }

.k-ui[data-theme="dark"] .k-toast.is-info .k-toast-icon,
.k-ui[data-theme="oled"] .k-toast.is-info .k-toast-icon { background: rgba(2, 132, 199, 0.2); color: #38bdf8; }
.k-ui[data-theme="dark"] .k-toast.is-success .k-toast-icon,
.k-ui[data-theme="oled"] .k-toast.is-success .k-toast-icon { background: rgba(22, 163, 74, 0.2); color: #4ade80; }
.k-ui[data-theme="dark"] .k-toast.is-warning .k-toast-icon,
.k-ui[data-theme="oled"] .k-toast.is-warning .k-toast-icon { background: rgba(217, 119, 6, 0.2); color: #fbbf24; }
.k-ui[data-theme="dark"] .k-toast.is-error .k-toast-icon,
.k-ui[data-theme="oled"] .k-toast.is-error .k-toast-icon { background: rgba(220, 38, 38, 0.2); color: #f87171; }

.k-toast-body {
    flex: 1;
    min-width: 0;
}

.k-toast-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    margin-bottom: 2px;
}

.k-toast-message {
    font-size: 0.83rem;
    color: var(--k-text-primary, #1e293b);
    line-height: 1.6;
}

.k-toast-desc {
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
    margin-top: 2px;
    line-height: 1.6;
}

/* Multi-message list */
.k-toast-list {
    margin: 4px 0 0;
    padding: 0;
    padding-right: 4px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.k-toast-list li {
    position: relative;
    font-size: 0.78rem;
    color: var(--k-text-secondary, #64748b);
    line-height: 1.6;
    padding-right: 14px;
}

.k-toast-list li::before {
    content: '';
    position: absolute;
    right: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--k-error, #dc2626);
}

/* Action buttons */
.k-toast-actions {
    display: flex;
    gap: 6px;
    margin-top: 9px;
}

.k-toast-action {
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: 8px;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-toast-action.variant-primary {
    background: var(--k-primary, #1db954);
    border: 1px solid var(--k-primary, #1db954);
    color: #ffffff;
}

.k-toast-action.variant-primary:hover {
    filter: brightness(1.08);
}

.k-toast-action.variant-ghost {
    background: transparent;
    border: 1px solid var(--k-border, #e2e8f0);
    color: var(--k-text-secondary, #64748b);
}

.k-toast-action.variant-ghost:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-toast-action.variant-danger {
    background: var(--k-error, #dc2626);
    border: 1px solid var(--k-error, #dc2626);
    color: #ffffff;
}

.k-toast-close {
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 2px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-toast-close:hover {
    color: var(--k-text-primary, #1e293b);
    background: var(--k-surface-hover, #f1f5f9);
}

.k-toast-close .icon {
    width: 14px;
    height: 14px;
}

/* Auto-dismiss timer bar */
.k-toast-timer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    background: color-mix(in srgb, var(--k-primary, #1db954) 55%, transparent);
    animation: k-toast-timer linear forwards;
}

.k-toast-timer.is-paused {
    animation-play-state: paused;
}

@keyframes k-toast-timer {
    from { width: 100%; }
    to { width: 0%; }
}

/* Enter / leave */
.k-toast-enter-active {
    transition: all 0.28s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.k-toast-leave-active {
    transition: all 0.22s ease;
}

.k-toast-enter-from {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
}

.k-toast-leave-to {
    opacity: 0;
    transform: translateX(-40px) scale(0.96);
}

@media (max-width: 640px) {
    .k-toast-host {
        width: auto;
        left: 12px;
        right: 12px;
    }

    .k-toast-host.pos-bottom-left,
    .k-toast-host.pos-bottom-right {
        bottom: 12px;
    }

    .k-toast-host.pos-top-left,
    .k-toast-host.pos-top-right {
        top: 12px;
    }
}
</style>
