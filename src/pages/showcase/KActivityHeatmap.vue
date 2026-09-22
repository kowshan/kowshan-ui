<template>
    <div class="sp">
        <h2 class="sp-title">KActivityHeatmap</h2>

        <h3 class="sp-sub">سایز بزرگ</h3>
        <KActivityHeatmap :data="data" :weeks="52" />

        <h3 class="sp-sub">سایز کوچک</h3>
        <KActivityHeatmap :data="data" :weeks="26" />
    </div>
</template>

<script setup lang="ts">
import KActivityHeatmap from '../../ui-kit/components/KActivityHeatmap.vue'
import { demoHeatmapData } from '../demo-data'

const data = demoHeatmapData
</script>
