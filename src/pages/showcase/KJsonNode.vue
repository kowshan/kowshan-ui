<template>
    <div class="sp">
        <h2 class="sp-title">KJsonNode</h2>
        <p class="sp-note">
            گره بازگشتی نمایشگر جیسون — داخل <code>KJsonViewer</code> استفاده می‌شود، اما مستقیم هم قابل رندر است.
            پروپ‌ها: <code>node</code>, <code>label</code>, <code>depth</code>, <code>collapsed</code>, <code>expandDepth</code>.
        </p>

        <h3 class="sp-sub">گره ریشه — آبجکت</h3>
        <div class="sp-card">
            <KJsonNode :node="obj" label="root" :depth="0" :collapsed="false" :expand-depth="2" />
        </div>

        <h3 class="sp-sub">گره ریشه — آرایه</h3>
        <div class="sp-card">
            <KJsonNode :node="arr" label="items" :depth="0" :collapsed="false" :expand-depth="3" />
        </div>

        <h3 class="sp-sub">بسته (collapsed)</h3>
        <div class="sp-card">
            <KJsonNode :node="obj" label="user" :depth="0" :collapsed="true" :expand-depth="1" />
        </div>

        <h3 class="sp-sub">بدون باز شدن خودکار (expandDepth = 0)</h3>
        <div class="sp-card">
            <KJsonNode :node="obj" label="settings" :depth="0" :collapsed="false" :expand-depth="0" />
        </div>

        <h3 class="sp-sub">مقدار ساده (غیر کانتینر)</h3>
        <div class="sp-card">
            <KJsonNode :node="42" label="answer" :depth="0" :collapsed="false" :expand-depth="2" />
        </div>
        <div class="sp-card" style="margin-top: 8px;">
            <KJsonNode :node="null" label="nullable" :depth="1" :collapsed="false" :expand-depth="2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KJsonNode from '../../ui-kit/components/KJsonNode.vue'

const obj = {
    id: 12,
    name: 'دوره آموزشی',
    published: true,
    chapters: [
        { title: 'مقدمه', minutes: 12 },
        { title: 'نصب و راه‌اندازی', minutes: 25, files: ['setup.md', 'config.json'] },
    ],
    owner: { id: 3, name: 'آکادمی کِی' },
}

const arr = ['اول', { second: true }, [1, 2, 3]]
</script>
