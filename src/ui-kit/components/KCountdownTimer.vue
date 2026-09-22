<!-- components/KCountdownTimer.vue -->
<!--
    KCountdownTimer — countdown to a target moment (deal expiry, webinar,
    release). Persian digits + labels, fires `end` once.

      <KCountdownTimer target="2026-09-01T00:00:00" ended-text="پایان تخفیف" />

    Props: `target` (ISO string or ms timestamp), optional `show-days` to
    collapse days into hours, `label` prefix, `ended-text`.
-->
<template>
    <div dir="ltr" class="k-countdown" :class="{ 'is-ended': ended }">
        <span v-if="label" class="k-countdown-label">{{ label }}</span>

        <div v-if="!ended" class="k-countdown-units">
            <div v-if="showDays" class="k-countdown-unit">
                <span class="k-countdown-num">{{ days }}</span>
                <span class="k-countdown-unit-label">روز</span>
            </div>
            <div class="k-countdown-unit">
                <span class="k-countdown-num">{{ hours }}</span>
                <span class="k-countdown-unit-label">ساعت</span>
            </div>
            <span class="k-countdown-colon">:</span>
            <div class="k-countdown-unit">
                <span class="k-countdown-num">{{ minutes }}</span>
                <span class="k-countdown-unit-label">دقیقه</span>
            </div>
            <span class="k-countdown-colon">:</span>
            <div class="k-countdown-unit">
                <span class="k-countdown-num">{{ seconds }}</span>
                <span class="k-countdown-unit-label">ثانیه</span>
            </div>
        </div>

        <div v-else class="k-countdown-ended">{{ endedText }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const props = withDefaults(defineProps<{
    /** ISO string or ms timestamp to count down to */
    target: string | number
    label?: string
    showDays?: boolean
    endedText?: string
    /** tick every second; set 0 for a static render */
    intervalMs?: number
}>(), {
    label: '',
    showDays: true,
    endedText: 'پایان یافت',
    intervalMs: 1000
})

const emits = defineEmits<{
    (e: 'end'): void
    (e: 'tick', remainingMs: number): void
}>()

const { toPersianDigits } = usePersianNumbers()

const now = ref(Date.now())
const ended = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let endedEmitted = false

const targetMs = computed(() => {
    const t = props.target
    return typeof t === 'number' ? t : new Date(t).getTime()
})

const diff = computed(() => Math.max(0, targetMs.value - now.value))

const days = computed(() => Math.floor(diff.value / 86_400_000))
const hours = computed(() => Math.floor((diff.value % 86_400_000) / 3_600_000))
const minutes = computed(() => Math.floor((diff.value % 3_600_000) / 60_000))
const seconds = computed(() => Math.floor((diff.value % 60_000) / 1000))

const tick = () => {
    now.value = Date.now()
    const remaining = targetMs.value - now.value
    if (remaining <= 0) {
        ended.value = true
        if (timer) clearInterval(timer)
        if (!endedEmitted) {
            endedEmitted = true
            emits('end')
        }
        return
    }
    emits('tick', remaining)
}

onMounted(() => {
    tick()
    if (props.intervalMs > 0) {
        timer = setInterval(tick, props.intervalMs)
    }
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>

<style scoped>
.k-countdown {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.k-countdown-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
}

.k-countdown-units {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    direction: ltr;
}

.k-countdown-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

.k-countdown-num {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border-radius: 8px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    font-size: 0.85rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: var(--k-text-primary, #1e293b);
}

.k-countdown-unit-label {
    font-size: 0.52rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
    line-height: 1.2;
    margin-top: 2px;
}

.k-countdown-colon {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
    margin-bottom: 14px;
}

.k-countdown-ended {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--k-error, #ef4444) 12%, transparent);
    color: var(--k-error, #ef4444);
    font-size: 0.8rem;
    font-weight: 800;
}
</style>
