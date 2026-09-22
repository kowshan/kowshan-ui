<template>
    <div class="sp">
        <h2 class="sp-title">KCopyButton</h2>

        <h3 class="sp-sub">پایه</h3>
        <KCopyButton text="این متن کپی می‌شود" />

        <h3 class="sp-sub">با label</h3>
        <KCopyButton text="۰۹۱۲۱۲۳۴۵۶۷" label="کپی شماره" />

        <h3 class="sp-sub">متن طولانی</h3>
        <KCopyButton
            text="https://example.com/very/long/path/that/should/be/copyable"
            label="کپی لینک"
        />

        <h3 class="sp-sub">درون یک فیلد</h3>
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--k-border);border-radius:8px;max-width:360px">
            <code style="flex:1;font-size:0.78rem;color:var(--k-text-secondary)">npm install k-kit</code>
            <KCopyButton text="npm install k-kit" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KCopyButton from '../../ui-kit/components/KCopyButton.vue'
</script>
