<template>
    <div class="sp">
        <h2 class="sp-title">KCheckbox</h2>

        <h3 class="sp-sub">پایه</h3>
        <KCheckbox v-model="a" label="قوانین را می‌پذیرم" />

        <h3 class="sp-sub">سایزها</h3>
        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
            <KCheckbox v-model="b" size="sm" label="کوچک" />
            <KCheckbox v-model="b" size="md" label="متوسط" />
            <KCheckbox v-model="b" size="lg" label="بزرگ" />
        </div>

        <h3 class="sp-sub">با hint</h3>
        <KCheckbox v-model="c" label="خبرنامه" hint="هفته‌ای یک ایمیل دریافت می‌کنید" />

        <h3 class="sp-sub">خطا</h3>
        <KCheckbox v-model="d" label="پذیرش قوانین" error="پذیرش قوانین الزامی است" />

        <h3 class="sp-sub">نیمه‌انتخاب (indeterminate)</h3>
        <KCheckbox v-model="e" label="انتخاب همه" :indeterminate="true" />

        <h3 class="sp-sub">غیرفعال / فقط‌خواندنی</h3>
        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
            <KCheckbox model-value label="غیرفعال" disabled />
            <KCheckbox model-value label="فقط‌خواندنی" readonly />
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <KCheckbox v-model="f" label="الزامی" required />

        <p class="sp-note">مقادیر: {{ [a, b, c, d, e, f].join(' / ') }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KCheckbox from '../../ui-kit/wrappers/KCheckbox.vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
const d = ref(false)
const e = ref(false)
const f = ref(false)
</script>
