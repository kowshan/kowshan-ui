<template>
    <div class="sp">
        <h2 class="sp-title">KAvatar</h2>

        <h3 class="sp-sub">با نام (initials)</h3>
        <div style="display:flex;gap:12px;align-items:center">
            <KAvatar name="علی رضایی" size="sm" />
            <KAvatar name="سارا احمدی" size="md" />
            <KAvatar name="محمد محمدی" size="lg" />
        </div>

        <h3 class="sp-sub">با رنگ سفارشی</h3>
        <div style="display:flex;gap:12px;align-items:center">
            <KAvatar name="A" fallback-color="#ef4444" />
            <KAvatar name="B" fallback-color="#3b82f6" />
            <KAvatar name="C" fallback-color="#10b981" />
            <KAvatar name="D" fallback-color="#f59e0b" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KAvatar from '../../ui-kit/components/KAvatar.vue'
</script>
