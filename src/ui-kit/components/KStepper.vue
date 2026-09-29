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
                :data-step-id="step.id"
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
                <span
                    class="k-step-mark"
                    :class="{ 'has-sub': subStepsOf(step).length > 1 }"
                    :style="markStyle(subStepsOf(step).length)"
                >
                    <span class="k-step-circle">
                        <Check
                            v-if="isDone(index)"
                            class="k-step-check"
                        />
                        <span v-else class="k-step-number">{{ index + 1 }}</span>
                    </span>

                    <!-- inner steps: a dot per sub-step, orbiting the circle -->
                    <template v-if="subStepsOf(step).length > 1">
                        <span
                            v-for="(sub, si) in subStepsOf(step)"
                            :key="sub.id ?? si"
                            class="k-step-orbit-dot"
                            :class="{
                                'is-sub-done': isSubDone(step, index, si),
                                'is-sub-active': isSubActive(step, si),
                            }"
                            :style="{ '--k-dot-i': si }"
                            :title="sub.label"
                            aria-hidden="true"
                        />
                    </template>
                </span>
                <span class="k-step-text">
                    <span class="k-step-label">{{ step.label }}</span>
                    <!-- the inner step the bar cannot show as a circle -->
                    <span v-if="activeSubLabel(step)" class="k-step-sub">{{ activeSubLabel(step) }}</span>
                </span>
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

interface SubStepItem {
    id?: string
    label?: string
}

interface StepItem {
    id: string
    label: string
    disabled?: boolean
    /**
     * Inner steps — drawn as small dots orbiting the circle instead of as extra
     * circles, so a step with 30 pages still occupies one slot in the bar.
     * Strings are accepted as labels.
     */
    subSteps?: (SubStepItem | string)[]
}

const props = withDefaults(defineProps<{
    steps: StepItem[]
    /** when false the stepper is a progress indicator only (assessments, wizards) */
    clickable?: boolean
    /**
     * Which inner step of the *current* step is active (0-based). Only the
     * current step's orbit highlights — the others stay neutral.
     */
    subStep?: number
}>(), {
    clickable: true,
    subStep: undefined,
})

const model = defineModel<string>({ required: true })

const currentIndex = computed(() =>
    Math.max(0, props.steps.findIndex(s => s.id === model.value))
)

const isDone = (index: number) => index < currentIndex.value

/* ── inner steps ───────────────────────────────────────────── */

const subStepsOf = (step: StepItem): SubStepItem[] =>
    (step.subSteps || []).map((sub, i) =>
        typeof sub === 'string' ? { id: String(i), label: sub } : sub
    )

const isCurrent = (step: StepItem) => model.value === step.id

const isSubActive = (step: StepItem, si: number) =>
    isCurrent(step) && props.subStep === si

/**
 * A dot is done when the whole step is behind us (its orbit reads as finished)
 * or when we have already passed it inside the current step.
 */
const isSubDone = (step: StepItem, index: number, si: number) =>
    index < currentIndex.value
    || (isCurrent(step) && props.subStep != null && si < props.subStep)

/** the label of the inner step we are on — rendered as a small sub-title */
const activeSubLabel = (step: StepItem) => {
    if (!isCurrent(step) || props.subStep == null) return null
    return subStepsOf(step)[props.subStep]?.label || null
}

/**
 * Orbit geometry, computed here rather than in CSS: `calc(360deg / var(--n))`
 * depends on division-by-var support, and this keeps the radius in one place.
 * `ORBIT_R` leaves ~3px between the circle's edge and the dots, so the ring
 * reads as a separate ring rather than as a bumpy circle.
 */
const ORBIT_R = 20

const markStyle = (count: number) => count > 1
    ? { '--k-orbit-r': `${ORBIT_R}px`, '--k-orbit-arc': `${360 / count}deg` }
    : undefined

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

/* ── keep the active step visible ────────────────────────────────────
   A stepper with more steps than fit is a scroller, so reaching a later
   step must bring it into view — otherwise the current step is simply
   off-screen and the bar reads as "nothing is active". `inline: 'nearest'`
   is what makes this a no-op when the step is already visible. */
function scrollActiveIntoView() {
    const el = navEl.value?.querySelector<HTMLElement>(`[data-step-id="${model.value}"]`)
    if (!el) return
    const reduce = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' })
}

onMounted(() => {
    updateFades()
    scrollActiveIntoView()
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
    () => nextTick(() => {
        updateFades()
        scrollActiveIntoView()
    })
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

/* ── inner steps: the orbit ────────────────────────────────────────────
   `has-sub` reserves the space the dots orbit through — without it the
   stepper's own `overflow-x: auto` (which computes `overflow-y` to `auto` too)
   would clip them. */
.k-step-mark {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* must fit `ORBIT_R` + the dot's own radius on both sides (20 + 2.5) */
.k-step-mark.has-sub {
    width: 46px;
    height: 46px;
}

/* physical `left`/`top`, not logical: the orbit is symmetric, and the
   -50% translate below is physical anyway */
.k-step-orbit-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--k-border);
    transform:
        translate(-50%, -50%)
        rotate(calc(var(--k-dot-i, 0) * var(--k-orbit-arc, 0deg)))
        translateY(calc(-1 * var(--k-orbit-r, 15px)));
    transition: background 0.2s ease, box-shadow 0.2s ease;
}

.k-step-orbit-dot.is-sub-done {
    background: var(--k-success, #10b981);
}

.k-step-orbit-dot.is-sub-active {
    background: var(--k-primary, #1db954);
    box-shadow: 0 0 0 2px var(--k-primary-light, rgba(29, 185, 84, 0.18));
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

.k-step-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.k-step-label {
    font-size: 0.8rem;
    color: var(--k-text-muted);
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.2s ease;
}

.k-step-sub {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    white-space: nowrap;
    transition: color 0.2s ease;
}

.k-step.is-active .k-step-sub {
    color: var(--k-text-secondary);
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
