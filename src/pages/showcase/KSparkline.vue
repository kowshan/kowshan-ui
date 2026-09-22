<template>
    <div class="sp">
        <h2 class="sp-title">KSparkline</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KSparkline :data="up" />
        </div>

        <h3 class="sp-sub">رنگ‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KSparkline :data="up" :color="'#1db954'" :width="140" />
                <KSparkline :data="down" :color="'#ef4444'" :width="140" />
                <KSparkline :data="flat" :color="'#f59e0b'" :width="140" />
                <KSparkline :data="up" :color="'#6366f1'" :width="140" />
            </div>
        </div>

        <h3 class="sp-sub">بدون پُر‌کردن و بدون نقطه</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KSparkline :data="up" :fill="false" :show-dot="false" :width="140" />
                <KSparkline :data="up" :fill="true" :show-dot="false" :width="140" />
                <KSparkline :data="up" :fill="false" :show-dot="true" :width="140" />
            </div>
        </div>

        <h3 class="sp-sub">ضخامت خط و اندازه</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KSparkline :data="up" :stroke-width="1" :height="28" :width="100" />
                <KSparkline :data="up" :stroke-width="3" :height="44" :width="160" />
                <KSparkline :data="up" :stroke-width="5" :height="60" :width="200" />
            </div>
        </div>

        <h3 class="sp-sub">مقادیر مرزی</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 18px;">
            <div style="display: flex; gap: 20px; align-items: center;">
                <span style="font-size: 0.75rem; width: 130px; color: var(--k-text-secondary);">خالی (بدون داده)</span>
                <KSparkline :data="[]" />
            </div>
            <div style="display: flex; gap: 20px; align-items: center;">
                <span style="font-size: 0.75rem; width: 130px; color: var(--k-text-secondary);">یک نقطه</span>
                <KSparkline :data="[5]" />
            </div>
            <div style="display: flex; gap: 20px; align-items: center;">
                <span style="font-size: 0.75rem; width: 130px; color: var(--k-text-secondary);">ثابت (همه یکسان)</span>
                <KSparkline :data="[4, 4, 4, 4, 4]" />
            </div>
            <div style="display: flex; gap: 20px; align-items: center;">
                <span style="font-size: 0.75rem; width: 130px; color: var(--k-text-secondary);">مقادیر منفی</span>
                <KSparkline :data="[-5, -2, -8, 1, -3]" />
            </div>
        </div>

        <h3 class="sp-sub">۶۰ نقطه (سیگنال شلوغ)</h3>
        <div class="sp-card">
            <KSparkline :data="signal" :width="360" :height="64" :stroke-width="1.2" :show-dot="false" />
        </div>

        <h3 class="sp-sub">در کارت آمار</h3>
        <div class="sp-card">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div
                    v-for="s in stats"
                    :key="s.title"
                    style="border: 1px solid var(--k-border); border-radius: 12px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;"
                >
                    <div>
                        <div style="font-size: 0.72rem; color: var(--k-text-secondary);">{{ s.title }}</div>
                        <div style="font-size: 1.1rem; font-weight: 800;">{{ s.value }}</div>
                    </div>
                    <KSparkline :data="s.data" :color="s.color" :width="90" :height="30" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KSparkline from '../../ui-kit/components/KSparkline.vue'

const up = [3, 5, 4, 7, 6, 9, 11, 10, 13, 15]
const down = [15, 13, 14, 11, 12, 9, 8, 7, 6, 4]
const flat = [8, 8, 7, 8, 8, 9, 8, 8, 8, 8]

const signal = Array.from({ length: 60 }, (_, i) => Math.sin(i / 3) * 10 + Math.random() * 4)

const stats = [
    { title: 'ثبت‌نام هفته', value: '۸۴', color: '#1db954', data: up },
    { title: 'لغو شده', value: '۹', color: '#ef4444', data: down },
    { title: 'میانگین حضور', value: '۹۲٪', color: '#6366f1', data: flat },
]
</script>
