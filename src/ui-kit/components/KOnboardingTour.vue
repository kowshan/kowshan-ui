<!-- KOnboardingTour.vue — step-by-step product tour with highlighted elements -->
<template>
    <!-- Overlay -->
    <Transition name="k-tour">
        <div v-if="active" class="k-tour-overlay" @click="next" />
    </Transition>

    <!-- Tooltip -->
    <Transition name="k-tour-tip">
        <div
            v-if="active && currentStep"
            class="k-tour-tip"
            :style="tooltipStyle"
        >
            <div class="k-tour-tip-head">
                <span class="k-tour-step-num">{{ currentIndex + 1 }} / {{ steps.length }}</span>
                <button class="k-tour-close" @click="skip">
                    <X :size="14" />
                </button>
            </div>
            <h4 class="k-tour-title">{{ currentStep.title }}</h4>
            <p class="k-tour-desc">{{ currentStep.description }}</p>
            <div class="k-tour-actions">
                <button v-if="currentIndex > 0" class="k-tour-btn k-tour-btn-ghost" @click="prev">
                    قبلی
                </button>
                <div v-else />
                <div class="k-tour-dots">
                    <span
                        v-for="(_, i) in steps"
                        :key="i"
                        class="k-tour-dot"
                        :class="{ 'is-active': i === currentIndex }"
                    />
                </div>
                <button class="k-tour-btn k-tour-btn-primary" @click="next">
                    {{ currentIndex === steps.length - 1 ? 'پایان' : 'بعدی' }}
                </button>
            </div>
        </div>
    </Transition>

    <!-- Highlight cutout -->
    <div v-if="active && highlightEl" class="k-tour-highlight" :style="highlightStyle" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
    steps: { target: string; title: string; description: string; position?: 'top' | 'bottom' | 'left' | 'right' }[]
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
    complete: []
}>()

const currentIndex = ref(0)
const highlightEl = ref<HTMLElement | null>(null)

const active = computed({
    get: () => props.modelValue,
    set: (v: boolean) => emit('update:modelValue', v),
})

const currentStep = computed(() => props.steps[currentIndex.value])

const highlightStyle = computed(() => {
    if (!highlightEl.value) return {}
    const rect = highlightEl.value.getBoundingClientRect()
    const pad = 8
    return {
        top: (rect.top - pad + window.scrollY) + 'px',
        left: (rect.left - pad + window.scrollX) + 'px',
        width: (rect.width + pad * 2) + 'px',
        height: (rect.height + pad * 2) + 'px',
    }
})

const tooltipStyle = computed(() => {
    if (!highlightEl.value) return {}
    const rect = highlightEl.value.getBoundingClientRect()
    const pos = currentStep.value?.position || 'bottom'
    const gap = 16
    if (pos === 'bottom') return { top: (rect.bottom + gap) + 'px', left: rect.left + 'px' }
    if (pos === 'top') return { bottom: (window.innerHeight - rect.top + gap) + 'px', left: rect.left + 'px' }
    if (pos === 'left') return { top: rect.top + 'px', right: (window.innerWidth - rect.left + gap) + 'px' }
    return { top: rect.top + 'px', left: (rect.right + gap) + 'px' }
})

const updateTarget = () => {
    highlightEl.value = currentStep.value ? document.querySelector(currentStep.value.target) : null
}

const next = () => {
    if (currentIndex.value < props.steps.length - 1) {
        currentIndex.value++
        nextTick(updateTarget)
    } else {
        active.value = false
        emit('complete')
    }
}

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
        nextTick(updateTarget)
    }
}

const skip = () => {
    active.value = false
    emit('complete')
}

watch(() => props.modelValue, (v) => {
    if (v) {
        currentIndex.value = 0
        nextTick(updateTarget)
    }
})

onMounted(() => { if (active.value) nextTick(updateTarget) })
</script>

<style scoped>
.k-tour-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 9998;
}
.k-tour-highlight {
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 0 0 4000px rgba(0,0,0,0.45);
    z-index: 9999;
    pointer-events: none;
    transition: all 0.3s ease;
}
.k-tour-tip {
    position: absolute;
    z-index: 10000;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    padding: 16px;
    width: 280px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.k-tour-tip-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
.k-tour-step-num {
    font-size: 0.62rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
    direction: ltr;
}
.k-tour-close {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    display: flex;
}
.k-tour-close:hover { color: var(--k-text-primary); }
.k-tour-title {
    margin: 0 0 4px;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--k-text-primary);
}
.k-tour-desc {
    margin: 0 0 12px;
    font-size: 0.72rem;
    color: var(--k-text-muted);
    line-height: 1.6;
}
.k-tour-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}
.k-tour-dots {
    display: flex;
    gap: 4px;
    flex: 1;
    justify-content: center;
}
.k-tour-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--k-border, #e2e8f0);
    transition: all 0.2s ease;
}
.k-tour-dot.is-active {
    background: var(--k-primary, #1db954);
    width: 16px;
    border-radius: 3px;
}
.k-tour-btn {
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
}
.k-tour-btn-ghost {
    background: none;
    color: var(--k-text-secondary);
}
.k-tour-btn-ghost:hover { background: var(--k-surface-hover); }
.k-tour-btn-primary {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-tour-btn-primary:hover { filter: brightness(1.08); }
/* Transitions */
.k-tour-enter-active, .k-tour-leave-active { transition: opacity 0.3s ease; }
.k-tour-enter-from, .k-tour-leave-to { opacity: 0; }
.k-tour-tip-enter-active { transition: all 0.3s ease; }
.k-tour-tip-leave-active { transition: all 0.15s ease; }
.k-tour-tip-enter-from { opacity: 0; transform: translateY(6px); }
.k-tour-tip-leave-to { opacity: 0; transform: translateY(3px); }
</style>
