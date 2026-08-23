<!-- components/KGuestPicker.vue -->
<!--
    KGuestPicker — adults / children / rooms stepper for reservations.
    A clickable summary field opens a popover with +/- steppers.
    Model: { adults, children, rooms } — logic lives in useGuestPicker.
-->
<template>
    <div class="k-guests" ref="rootRef">
        <div v-if="label" class="k-guests-label">
            {{ label }}
            <span v-if="required" class="k-guests-required">*</span>
        </div>

        <button
            type="button"
            class="k-guests-trigger"
            :class="{ 'is-open': open, 'is-disabled': disabled }"
            :disabled="disabled"
            @click="open = !open"
        >
            <Users class="k-guests-icon" :size="16" />
            <span class="k-guests-summary" :class="{ 'is-empty': !guest.summary.value }">
                {{ guest.summary.value || 'انتخاب مسافران' }}
            </span>
            <ChevronDown class="k-guests-chevron" :size="15" :class="{ 'is-rotated': open }" />
        </button>

        <Transition name="k-guests-pop">
            <div v-if="open" class="k-guests-panel" role="dialog" aria-label="انتخاب مسافران">
                <div
                    v-for="s in guest.sections.value"
                    :key="s.key"
                    class="k-guests-row"
                >
                    <div class="k-guests-info">
                        <span class="k-guests-name">{{ s.label }}</span>
                        <span v-if="s.sub" class="k-guests-sub">{{ s.sub }}</span>
                    </div>
                    <div class="k-guests-stepper">
                        <button
                            type="button"
                            class="k-guests-btn"
                            :disabled="!guest.canDec(s.key)"
                            aria-label="کم کردن"
                            @click="guest.decrement(s.key)"
                        >
                            <Minus :size="14" />
                        </button>
                        <span class="k-guests-count">{{ faNum(s.count) }}</span>
                        <button
                            type="button"
                            class="k-guests-btn is-plus"
                            :disabled="!guest.canInc(s.key)"
                            aria-label="زیاد کردن"
                            @click="guest.increment(s.key)"
                        >
                            <Plus :size="14" />
                        </button>
                    </div>
                </div>

                <div class="k-guests-footer">
                    <button type="button" class="k-guests-clear" @click="guest.reset()">پاک کردن</button>
                    <button type="button" class="k-guests-done" @click="open = false">تأیید</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Users, ChevronDown, Plus, Minus } from 'lucide-vue-next'
import { useClickOutside } from '../composables/useClickOutside'
import { useGuestPicker, type GuestConfig } from '../composables/useGuestPicker'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    modelValue?: { adults?: number; children?: number; rooms?: number } | null
    label?: string
    required?: boolean
    disabled?: boolean
    config?: GuestConfig
}>(), {
    modelValue: null,
    disabled: false
})

const emits = defineEmits<{
    'update:modelValue': [value: { adults: number; children: number; rooms: number }]
    'change': [value: { adults: number; children: number; rooms: number }]
}>()

const { toPersianDigits } = usePersianNumbers()
const faNum = (n: number) => toPersianDigits(String(n))

const guest = useGuestPicker(props.config)

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

useClickOutside(rootRef, () => { open.value = false })

// sync initial model
if (props.modelValue) {
    guest.set('adults', props.modelValue.adults ?? 1)
    guest.set('children', props.modelValue.children ?? 0)
    guest.set('rooms', props.modelValue.rooms ?? 1)
}

const emitChange = () => {
    const payload = guest.value.value
    emits('update:modelValue', payload)
    emits('change', payload)
}

// keep the parent model in sync
watch(guest.value, emitChange, { deep: true })
watch(() => props.modelValue, (v) => {
    if (v && (v.adults !== guest.counts.value.adults || v.children !== guest.counts.value.children || v.rooms !== guest.counts.value.rooms)) {
        guest.set('adults', v.adults ?? 1)
        guest.set('children', v.children ?? 0)
        guest.set('rooms', v.rooms ?? 1)
        emitChange()
    }
})

defineExpose({ reset: guest.reset })
</script>

<style scoped>
.k-guests {
    position: relative;
    width: 100%;
    font-family: inherit;
}

.k-guests-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
    margin-bottom: 4px;
}

.k-guests-required {
    color: var(--k-error);
    margin-right: 2px;
}

.k-guests-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 36px;
    padding: 0 10px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s ease, background 0.15s ease;
    text-align: right;
}

.k-guests-trigger:hover {
    border-color: var(--k-text-secondary);
}

.k-guests-trigger.is-open {
    border-color: var(--k-primary);
    background: var(--k-primary-light);
}

.k-guests-trigger.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.k-guests-icon {
    color: var(--k-text-muted);
    flex-shrink: 0;
}

.k-guests-summary {
    flex: 1;
    font-size: 0.82rem;
    color: var(--k-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-guests-summary.is-empty {
    color: var(--k-placeholder, var(--k-text-muted));
}

.k-guests-chevron {
    color: var(--k-text-muted);
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.k-guests-chevron.is-rotated {
    transform: rotate(180deg);
}

.k-guests-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    left: 0;
    z-index: 60;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    box-shadow: var(--k-shadow-md);
    padding: 6px 10px;
}

.k-guests-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 2px;
    border-bottom: 1px dashed var(--k-border);
}

.k-guests-row:last-of-type {
    border-bottom: none;
}

.k-guests-info {
    display: flex;
    flex-direction: column;
}

.k-guests-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--k-text-primary);
}

.k-guests-sub {
    font-size: 0.65rem;
    color: var(--k-text-muted);
}

.k-guests-stepper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.k-guests-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    border: 1px solid var(--k-border);
    background: var(--k-bg);
    color: var(--k-text-primary);
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-guests-btn.is-plus {
    border-color: var(--k-primary);
    color: var(--k-primary);
    background: var(--k-primary-light);
}

.k-guests-btn:hover:not(:disabled) {
    border-color: var(--k-primary);
    color: var(--k-primary);
}

.k-guests-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.k-guests-count {
    min-width: 22px;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--k-text-primary);
}

.k-guests-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
}

.k-guests-clear {
    border: none;
    background: transparent;
    color: var(--k-error);
    font-size: 0.72rem;
    cursor: pointer;
    font-family: inherit;
}

.k-guests-done {
    border: none;
    background: var(--k-primary);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: var(--k-radius-sm);
    padding: 5px 18px;
    cursor: pointer;
    font-family: inherit;
}

.k-guests-pop-enter-active,
.k-guests-pop-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.k-guests-pop-enter-from,
.k-guests-pop-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
