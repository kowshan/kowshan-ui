<template>
    <div class="sp">
        <h2 class="sp-title">KSplitPane</h2>

        <h3 class="sp-sub">پایه — افقی، ۵۰/۵۰</h3>
        <div class="sp-card">
            <KSplitPane v-model:size="size1" style="height: 240px;" @resize="lastResize = $event">
                <template #first>
                    <div class="pane">پنل اول — {{ size1 }}٪</div>
                </template>
                <template #second>
                    <div class="pane">پنل دوم — {{ 100 - size1 }}٪</div>
                </template>
            </KSplitPane>
            <div class="sp-vmodel" style="margin-top: 12px;">اندازه پنل اول: {{ size1 }}٪</div>
        </div>

        <h3 class="sp-sub">عمودی</h3>
        <div class="sp-card">
            <KSplitPane v-model:size="size2" direction="vertical" style="height: 320px;">
                <template #first>
                    <div class="pane">بالا — {{ size2 }}٪</div>
                </template>
                <template #second>
                    <div class="pane">پایین — {{ 100 - size2 }}٪</div>
                </template>
            </KSplitPane>
        </div>

        <h3 class="sp-sub">محدوده تنگ (min 30 / max 70)</h3>
        <div class="sp-card">
            <KSplitPane v-model:size="size3" :min="30" :max="70" style="height: 200px;">
                <template #first>
                    <div class="pane">۳۰٪ تا ۷۰٪ — فعلی {{ size3 }}٪</div>
                </template>
                <template #second>
                    <div class="pane">پنل دوم</div>
                </template>
            </KSplitPane>
        </div>

        <h3 class="sp-sub">گاتر ضخیم (۲۰px)</h3>
        <div class="sp-card">
            <KSplitPane v-model:size="size4" :gutter-size="20" style="height: 200px;">
                <template #first>
                    <div class="pane">پنل اول</div>
                </template>
                <template #second>
                    <div class="pane">پنل دوم</div>
                </template>
            </KSplitPane>
        </div>

        <h3 class="sp-sub">کاربردی — فهرست دوره‌ها و جزئیات</h3>
        <div class="sp-card">
            <KSplitPane v-model:size="size5" :min="25" :max="60" style="height: 300px;">
                <template #first>
                    <div class="pane" style="align-items: flex-start; gap: 8px; padding: 14px;">
                        <div v-for="c in courses" :key="c" style="font-size: 0.8rem;">{{ c }}</div>
                    </div>
                </template>
                <template #second>
                    <div class="pane" style="align-items: flex-start; gap: 10px; padding: 14px;">
                        <strong style="font-size: 0.85rem;">جزئیات دوره</strong>
                        <p class="sp-note" style="margin: 0;">
                            این پنل قابل تغییر اندازه است؛ دستگیره را بکشید و متن باید جا باز کند.
                        </p>
                    </div>
                </template>
            </KSplitPane>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">مقدار resize: {{ lastResize ?? '—' }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KSplitPane from '../../ui-kit/components/KSplitPane.vue'

const size1 = ref(50)
const size2 = ref(40)
const size3 = ref(50)
const size4 = ref(45)
const size5 = ref(35)

const lastResize = ref<number | null>(null)

const courses = ['مکالمه مقدماتی', 'گرامر پیشرفته', 'آیلتس فشرده', 'کارگاه تلفظ', 'دوره کودکان']
</script>

<style scoped>
.pane {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: 0.82rem;
    color: var(--k-text-secondary);
    background: var(--k-surface-hover, #f8fafc);
    border-radius: 10px;
}
</style>
