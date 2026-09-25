<!-- KFab.vue — floating action button with expandable menu -->
<template>
    <div class="k-fab-wrap">
        <!-- Backdrop -->
        <Transition name="k-fab-bg">
            <div v-if="isOpen" class="k-fab-backdrop" @click="isOpen = false" />
        </Transition>

        <!-- Action menu -->
        <Transition name="k-fab-menu">
            <div v-if="isOpen" class="k-fab-menu">
                <button
                    v-for="(action, i) in actions"
                    :key="action.id"
                    class="k-fab-menu-item"
                    :style="{ transitionDelay: (actions.length - 1 - i) * 40 + 'ms' }"
                    @click="onAction(action)"
                >
                    <!-- `dir="auto"` — the label keeps its own language direction while the row
                         stays LTR, so the icon is always the last thing, sitting on the FAB edge -->
                    <span class="k-fab-menu-label" dir="auto">{{ action.label }}</span>
                    <span class="k-fab-menu-btn" :style="{ background: action.color || 'var(--k-surface-hover)' }">
                        <component :is="action.icon" :size="16" :style="{ color: action.iconColor || 'var(--k-text-secondary)' }" />
                    </span>
                </button>
            </div>
        </Transition>

        <!-- Main FAB -->
        <button
            class="k-fab"
            :class="{ 'is-open': isOpen }"
            :style="{ background: mainColor }"
            @click="isOpen = !isOpen"
        >
            <Transition name="k-fab-icon" mode="out-in">
                <X v-if="isOpen" :size="20" :style="{ color: iconColor }" />
                <component v-else :is="icon" :size="20" :style="{ color: iconColor }" />
            </Transition>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

withDefaults(defineProps<{
    icon?: any
    actions?: { id: string; label: string; icon: any; color?: string; iconColor?: string }[]
    mainColor?: string
    iconColor?: string
}>(), {
    icon: () => X,
    actions: () => [],
    mainColor: 'var(--k-primary, #1db954)',
    iconColor: '#fff',
})

const emit = defineEmits<{ action: [id: string] }>()
const isOpen = ref(false)

const onAction = (action: { id: string }) => {
    emit('action', action.id)
    isOpen.value = false
}
</script>

<style scoped>
.k-fab-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 200;
}
.k-fab-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: -1;
}
.k-fab {
    width: 52px;
    height: 52px;
    border: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    transition: all 0.2s ease;
}
.k-fab:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    transform: scale(1.05);
}
.k-fab.is-open {
    border-radius: 50%;
    background: var(--k-text-secondary, #64748b) !important;
}
.k-fab-menu {
    position: absolute;
    bottom: 64px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* the box is anchored to the inline-end edge (same edge as the FAB), so pin the axis
       too — otherwise `align-items: flex-end` resolves to the opposite side on an RTL page
       while the box itself stays anchored right, and the rows drift away from the FAB */
    direction: ltr;
    align-items: flex-end;
    /* the FAB is 52px and the action buttons 40px, so a 6px inset on the end edge puts the
       buttons dead-centre under it — start padding here would only grow the box outwards */
    padding-inline-end: 6px;
}
.k-fab-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    /* the wrap is anchored to the inline-end edge, so the action button must ALWAYS sit
       on that edge — force the row LTR instead of following the page direction */
    direction: ltr;
}
.k-fab-menu-label {
    background: var(--k-bg, #fff);
    padding: 6px 11px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--k-text-primary);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    white-space: nowrap;
}
.k-fab-menu-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    flex-shrink: 0;
    transition: transform 0.15s ease;
}
.k-fab-menu-btn:hover { transform: scale(1.1); }
/* Transitions */
.k-fab-bg-enter-active, .k-fab-bg-leave-active { transition: opacity 0.2s ease; }
.k-fab-bg-enter-from, .k-fab-bg-leave-to { opacity: 0; }
.k-fab-menu-enter-active { transition: all 0.25s ease; }
.k-fab-menu-leave-active { transition: all 0.15s ease; }
.k-fab-menu-enter-from { opacity: 0; transform: translateY(10px) scale(0.9); }
.k-fab-menu-leave-to { opacity: 0; transform: translateY(5px) scale(0.95); }
.k-fab-icon-enter-active, .k-fab-icon-leave-active { transition: all 0.15s ease; }
.k-fab-icon-enter-from { opacity: 0; transform: rotate(-90deg) scale(0.5); }
.k-fab-icon-leave-to { opacity: 0; transform: rotate(90deg) scale(0.5); }
</style>
