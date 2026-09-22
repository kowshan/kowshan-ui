<template>
    <div class="sp">
        <h2 class="sp-title">KBackToTop</h2>
        <p class="sp-note">اسکرول کنید تا دکمه ظاهر شود</p>
        <div v-for="i in 20" :key="i" style="padding:16px;margin-bottom:8px;background:var(--k-surface);border-radius:8px">
            <p style="margin:0;color:var(--k-text-secondary);font-size:0.82rem">بخش {{ i }} — محتوای تستی برای اسکرول</p>
        </div>
        <KBackToTop />
    </div>
</template>

<script setup lang="ts">
import KBackToTop from '../../ui-kit/components/KBackToTop.vue'
</script>
