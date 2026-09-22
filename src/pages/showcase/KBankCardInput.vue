<template>
    <div class="sp">
        <h2 class="sp-title">KBankCardInput</h2>

        <h3 class="sp-sub">ساده</h3>
        <KBankCardInput v-model="card" label="شماره کارت" />

        <p class="sp-note">مقدار: {{ card || '—' }}</p>

        <h3 class="sp-sub">غیرفعال</h3>
        <KBankCardInput model-value="6104337890123456" label="کارت غیرفعال" :disabled="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KBankCardInput from '../../ui-kit/components/KBankCardInput.vue'
const card = ref('')
</script>
