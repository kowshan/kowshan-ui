<template>
    <div class="sp">
        <h2 class="sp-title">KCaptcha</h2>

        <h3 class="sp-sub">پایه</h3>
        <KCaptcha v-model="a" />
        <p class="sp-note">مقدار: {{ a || '—' }}</p>

        <h3 class="sp-sub">با خطا</h3>
        <KCaptcha v-model="b" :error="true" />

        <h3 class="sp-sub">ارتفاع سفارشی</h3>
        <KCaptcha v-model="c" :height="70" />

        <h3 class="sp-sub">غیرفعال</h3>
        <KCaptcha v-model="d" :disabled="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KCaptcha from '../../ui-kit/components/KCaptcha.vue'

const a = ref('')
const b = ref('')
const c = ref('')
const d = ref('')
</script>
