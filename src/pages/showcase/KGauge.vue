<template>
    <div class="sp">
        <h2 class="sp-title">KGauge</h2>

        <h3 class="sp-sub">آستانه‌های خودکار (danger 40 / warning 70)</h3>
        <div class="sp-row">
            <div class="sp-card">
                <KGauge :value="25" label="کم" />
                <div class="sp-vmodel">value: {{ live.value }}</div>
            </div>
            <div class="sp-card">
                <KGauge :value="55" label="متوسط" />
            </div>
            <div class="sp-card">
                <KGauge :value="85" label="بالا" />
            </div>
            <div class="sp-card">
                <KGauge :value="100" label="پر" />
            </div>
        </div>

        <h3 class="sp-sub">رنگ ثابت و ضخامت</h3>
        <div class="sp-row">
            <div class="sp-card">
                <KGauge :value="60" color="#1db954" label="سبز" />
            </div>
            <div class="sp-card">
                <KGauge :value="60" color="#8B5CF6" :thickness="16" label="ضخیم" />
            </div>
            <div class="sp-card">
                <KGauge :value="60" :size="180" label="بزرگ" />
            </div>
            <div class="sp-card">
                <KGauge :value="60" :size="90" :thickness="7" label="کوچک" />
            </div>
        </div>

        <h3 class="sp-sub">زنده با اسلایدر</h3>
        <div class="sp-card" style="display: flex; align-items: center; gap: 24px; justify-content: center;">
            <KGauge :value="live.value" :label="String(live.value) + '%'" />
            <div style="display: flex; flex-direction: column; gap: 8px; width: 220px;">
                <label class="sp-label">مقدار: {{ live.value }}</label>
                <KSlider v-model="live.value" :min="0" :max="100" />
                <div class="sp-vmodel">v-model: {{ live.value }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import KGauge from '../../ui-kit/components/KGauge.vue'
import KSlider from '../../ui-kit/wrappers/KSlider.vue'

const live = reactive({ value: 65 })
</script>
