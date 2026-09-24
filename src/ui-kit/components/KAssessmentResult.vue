<!-- components/KAssessmentResult.vue
     The ASSESSMENT → AssessmentResult node: score ring, pass/fail banner,
     per-section breakdown, and an actions slot.
-->
<template>
    <div class="k-ar" :class="result.passed ? 'is-pass' : 'is-fail'">
        <div class="k-ar-hero">
            <KProgressRing
                :model-value="result.percent"
                :px="ringSize"
                :stroke="10"
                :color="result.passed ? undefined : 'var(--k-error, #ef4444)'"
            />
            <div class="k-ar-hero-body">
                <span class="k-ar-badge">
                    <CircleCheck v-if="result.passed" />
                    <CircleX v-else />
                    {{ result.passed ? 'قبول' : 'نیاز به تلاش بیشتر' }}
                </span>
                <h3 class="k-ar-title">{{ title || assessment?.info.title || 'نتیجه ارزیابی' }}</h3>
                <p class="k-ar-sub">
                    {{ result.score }} از {{ result.maxScore }} امتیاز ·
                    {{ result.answered }} از {{ result.total }} سؤال پاسخ داده شد
                </p>
                <p v-if="result.message" class="k-ar-message">{{ result.message }}</p>
            </div>
        </div>

        <KProgress
            v-if="!compact"
            :percent="result.percent"
            :variant="result.passed ? 'success' : 'danger'"
            :label="`درصد نمره: ${result.percent}٪`"
        />

        <ul v-if="!compact && result.sections.length" class="k-ar-sections">
            <li v-for="s in result.sections" :key="s.sectionId" class="k-ar-section">
                <span class="k-ar-section-title">{{ s.title }}</span>
                <span class="k-ar-section-meta">
                    {{ s.answered }}/{{ s.total }} پاسخ
                </span>
                <span class="k-ar-section-score">
                    {{ s.score }}<span class="k-ar-section-max">/{{ s.maxScore || '—' }}</span>
                </span>
            </li>
        </ul>

        <div v-if="$slots.actions" class="k-ar-actions">
            <slot name="actions" :result="result" />
        </div>
        <slot :result="result" />
    </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleX } from 'lucide-vue-next'
import KProgress from './KProgress.vue'
import KProgressRing from './KProgressRing.vue'
import type { Assessment, AssessmentResult } from '../types/assessment'

const props = withDefaults(defineProps<{
    result: AssessmentResult
    assessment?: Assessment
    title?: string
    /** hero only — hide the breakdown */
    compact?: boolean
    ringSize?: number
}>(), {
    compact: false,
    ringSize: 96,
})
</script>

<style scoped>
.k-ar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-lg, 14px);
    background: var(--k-bg);
}
.k-ar-hero {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
}
.k-ar-hero-body { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 6px; }
.k-ar-badge {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--k-error-light, rgba(239, 68, 68, 0.12));
    color: var(--k-error, #ef4444);
}
.k-ar.is-pass .k-ar-badge {
    background: var(--k-success-light, rgba(34, 197, 94, 0.12));
    color: var(--k-success, #22c55e);
}
.k-ar-badge :deep(svg) { width: 14px; height: 14px; }
.k-ar-title { margin: 0; font-size: 1rem; font-weight: 800; color: var(--k-text-primary); }
.k-ar-sub { margin: 0; font-size: 0.76rem; color: var(--k-text-muted); }
.k-ar-message {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.9;
    color: var(--k-text-secondary);
}
.k-ar-sections {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.k-ar-section {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    font-size: 0.76rem;
}
.k-ar-section-title { flex: 1; min-width: 0; font-weight: 600; color: var(--k-text-primary); }
.k-ar-section-meta { color: var(--k-text-muted); font-size: 0.7rem; }
.k-ar-section-score { font-weight: 800; color: var(--k-text-primary); direction: ltr; }
.k-ar-section-max { font-weight: 500; color: var(--k-text-muted); }
.k-ar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
