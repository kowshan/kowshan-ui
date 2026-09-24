<!-- components/KStepper.vue -->
<template>
    <nav
        ref="navEl"
        class="k-stepper"
        role="tablist"
        aria-label="مراحل"
        :tabindex="clickable ? undefined : 0"
        :style="{ '--k-fade-start': fadeStart + 'px', '--k-fade-end': fadeEnd + 'px' }"
        @keydown="handleKeydown"
        @scroll.passive="updateFades"
    >
        <template v-for="(step, index) in steps" :key="step.id">
            <div
                class="k-step"
                :class="{
                    'is-active': model === step.id,
                    'is-done': isDone(index),
                    'is-disabled': step.disabled,
                    'is-locked': !clickable
                }"
                role="tab"
                :aria-selected="model === step.id"
                :tabindex="clickable && model === step.id ? 0 : -1"
                @click="selectStep(step.id)"
                @keydown.enter.prevent="selectStep(step.id)"
                @keydown.space.prevent="selectStep(step.id)"
            >
                <span class="k-step-circle">
                    <Check
                        v-if="isDone(index)"
                        class="k-step-check"
                    />
                    <span v-else class="k-step-number">{{ index + 1 }}</span>
                </span>
                <span class="k-step-label">{{ step.label }}</span>
            </div>

            <span
                v-if="index < steps.length - 1"
                class="k-step-line"
                :class="{ 'is-done': isDone(index) }"
            />
        </template>
    </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check } from 'lucide-vue-next'

interface StepItem {
    id: string
    label: string
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    steps: StepItem[]
    /** when false the stepper is a progress indicator only (assessments, wizards) */
    clickable?: boolean
}>(), {
    clickable: true,
})

const model = defineModel<string>({ required: true })

const currentIndex = computed(() =>
    Math.max(0, props.steps.findIndex(s => s.id === model.value))
)

const isDone = (index: number) => index < currentIndex.value

const selectStep = (id: string) => {
    if (!props.clickable) return
    const step = props.steps.find(s => s.id === id)
    if (!step || step.disabled) return
    model.value = id
}

/* ── overflow: scroll horizontally, fade whichever edge is cut off ─────
   The fade is a `mask-image` on the scroller itself, so it stays correct on
   any background (cards, glass, dark mode) instead of painting a colour. */
const FADE = 28
const navEl = ref<HTMLElement>()
const fadeStart = ref(0)   // visual left edge
const fadeEnd = ref(0)     // visual right edge
let observer: ResizeObserver | null = null

function updateFades() {
    const el = navEl.value
    if (!el) {
        fadeStart.value = fadeEnd.value = 0
        return
    }
    const max = el.scrollWidth - el.clientWidth
    if (max <= 1) {
        fadeStart.value = fadeEnd.value = 0
        return
    }
    // |scrollLeft| grows towards the inline end in both LTR and RTL
    // (Chrome reports it negative in RTL, Firefox positive — hence abs)
    const pos = Math.abs(el.scrollLeft)
    const cutAtStart = pos > 2
    const cutAtEnd = pos < max - 2
    const rtl = getComputedStyle(el).direction === 'rtl'
    fadeStart.value = (rtl ? cutAtEnd : cutAtStart) ? FADE : 0
    fadeEnd.value = (rtl ? cutAtStart : cutAtEnd) ? FADE : 0
}

onMounted(() => {
    updateFades()
    if (typeof ResizeObserver !== 'undefined' && navEl.value) {
        observer = new ResizeObserver(updateFades)
        observer.observe(navEl.value)
    }
    window.addEventListener('resize', updateFades)
})

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    window.removeEventListener('resize', updateFades)
})

watch(
    [() => props.steps.length, model, () => props.clickable],
    () => nextTick(updateFades)
)

const handleKeydown = (e: KeyboardEvent) => {
    if (!props.clickable) return
    let next: number | null = null

    switch (e.key) {
        case 'ArrowRight':
            next = Math.min(currentIndex.value + 1, props.steps.length - 1)
            break
        case 'ArrowLeft':
            next = Math.max(currentIndex.value - 1, 0)
            break
        case 'Home':
            next = 0
            break
        case 'End':
            next = props.steps.length - 1
            break
    }

    if (next === null) return
    e.preventDefault()
    selectStep(props.steps[next].id)
}

// Persian digits for the step numbers
</script>

<style scoped>
.k-stepper {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    user-select: none;
    /* long step lists scroll instead of squashing — fade the cut-off edge */
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-mask-image: linear-gradient(
        to right,
        transparent 0,
        #000 var(--k-fade-start, 0px),
        #000 calc(100% - var(--k-fade-end, 0px)),
        transparent 100%
    );
    mask-image: linear-gradient(
        to right,
        transparent 0,
        #000 var(--k-fade-start, 0px),
        #000 calc(100% - var(--k-fade-end, 0px)),
        transparent 100%
    );
}

.k-stepper::-webkit-scrollbar { display: none; }

.k-stepper:focus-visible {
    outline: 2px solid var(--k-primary, #1db954);
    outline-offset: 2px;
}

.k-step {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: var(--k-radius-sm);
    transition: background 0.15s ease;
    flex-shrink: 0;
}

.k-step:hover:not(.is-disabled):not(.is-active):not(.is-locked) {
    background: var(--k-surface-hover);
}

/* locked = progress indicator only — no pointer affordance */
.k-step.is-locked { cursor: default; }

.k-step.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-step-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid var(--k-border);
    background: var(--k-bg);
    color: var(--k-text-secondary);
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.k-step.is-active .k-step-circle {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary, #1db954);
    color: #fff;
    box-shadow: 0 0 0 3px var(--k-primary-light, rgba(29, 185, 84, 0.18));
}

.k-step.is-done .k-step-circle {
    border-color: var(--k-success, #10b981);
    background: var(--k-success, #10b981);
    color: #fff;
}

.k-step-check {
    width: 14px;
    height: 14px;
}

.k-step-label {
    font-size: 0.8rem;
    color: var(--k-text-muted);
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.2s ease;
}

.k-step.is-active .k-step-label {
    color: var(--k-text-primary);
    font-weight: 700;
}

.k-step.is-done .k-step-label {
    color: var(--k-text-secondary);
}

/* Connector line */
.k-step-line {
    flex: 1;
    min-width: 24px;
    height: 2px;
    background: var(--k-border);
    margin: 0 6px;
    border-radius: 2px;
    transition: background 0.3s ease;
}

.k-step-line.is-done {
    background: var(--k-success, #10b981);
}

.k-step:focus-visible {
    outline: 2px solid var(--k-primary, #1db954);
    outline-offset: 2px;
}
</style>
