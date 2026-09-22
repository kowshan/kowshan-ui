<template>
    <div class="sp">
        <h2 class="sp-title">KDiffView</h2>

        <h3 class="sp-sub">نمای کنار به کنار</h3>
        <KDiffView
            :left="before"
            :right="after"
            left-label="قبل"
            right-label="بعد"
        />

        <h3 class="sp-sub">نمای یکپارچه</h3>
        <KDiffView
            :left="before"
            :right="after"
            :unified="true"
        />

        <h3 class="sp-sub">با متادیتا (نام فایل / نسخه)</h3>
        <KDiffView
            :left="before"
            :right="after"
            left-label="main.ts"
            right-label="main.ts"
            left-meta="v1.2.0"
            right-meta="v1.3.0"
        />

        <h3 class="sp-sub">بدون تغییر</h3>
        <KDiffView
            :left="'const a = 1\nconst b = 2'"
            :right="'const a = 1\nconst b = 2'"
        />
    </div>
</template>

<script setup lang="ts">
import KDiffView from '../../ui-kit/components/KDiffView.vue'

const before = `import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
console.log('version', '1.2.0')`

const after = `import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
console.log('version', '1.3.0')`
</script>
