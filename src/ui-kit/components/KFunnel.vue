<!-- KFunnel.vue — funnel visualization for pipelines -->
<template>
    <div class="k-funnel">
        <div
            v-for="(stage, i) in stages"
            :key="i"
            class="k-funnel-row"
        >
            <div class="k-funnel-bar-wrap">
                <div
                    class="k-funnel-bar"
                    :style="{
                        width: barWidth(stage.value) + '%',
                        background: stage.color || colors[i % colors.length],
                        transitionDelay: (i * 60) + 'ms',
                    }"
                >
                    <span v-if="barWidth(stage.value) > 15" class="k-funnel-bar-val">{{ stage.value }}</span>
                </div>
            </div>
            <div class="k-funnel-meta">
                <span class="k-funnel-label">{{ stage.label }}</span>
                <span class="k-funnel-pct">{{ pct(stage.value) }}%</span>
            </div>
            <div v-if="i < stages.length - 1" class="k-funnel-drop">
                ↓ {{ Math.round((1 - stage.value / stages[i + 1].value * 100)) }}٪ کاهش
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    stages: { label: string; value: number; color?: string }[]
}>(), {})


const colors = ['var(--k-primary)', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

const maxVal = computed(() => Math.max(...props.stages.map(s => s.value)))
const barWidth = (val: number) => (val / maxVal.value) * 100
const pct = (val: number) => Math.round((val / maxVal.value) * 100)
</script>

<style scoped>
.k-funnel { display: flex; flex-direction: column; gap: 4px; }
.k-funnel-row { text-align: center; }
.k-funnel-bar-wrap {
    display: flex; justify-content: center; padding: 0 8px;
}
.k-funnel-bar {
    height: 36px; border-radius: 6px; display: flex;
    align-items: center; justify-content: center;
    color: #fff; font-size: 0.72rem; font-weight: 700;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.k-funnel-bar-val { direction: ltr; }
.k-funnel-meta {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 4px 0 2px; font-size: 0.7rem;
}
.k-funnel-label { font-weight: 600; color: var(--k-text-secondary); }
.k-funnel-pct { font-weight: 800; color: var(--k-text-primary); direction: ltr; }
.k-funnel-drop {
    font-size: 0.6rem; color: var(--k-text-muted);
    padding-bottom: 4px; direction: ltr;
}
</style>
