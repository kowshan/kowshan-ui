<template>
    <div class="sp">
        <h2 class="sp-title">KBadge</h2>

        <h3 class="sp-sub">انواع variant</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
            <KBadge v-for="v in variants" :key="v" :variant="v" :text="v" />
        </div>

        <h3 class="sp-sub">سایزها</h3>
        <div style="display:flex;gap:8px;align-items:center">
            <KBadge size="sm" text="کوچک" />
            <KBadge size="md" text="متوسط" />
            <KBadge size="lg" text="بزرگ" />
        </div>

        <h3 class="sp-sub">دات (نقطه)</h3>
        <div style="display:flex;gap:12px;align-items:center">
            <KBadge dot dot-color="var(--k-success)" />
            <KBadge dot dot-color="var(--k-warning)" />
            <KBadge dot dot-color="var(--k-error)" />
        </div>

        <h3 class="sp-sub">outline</h3>
        <div style="display:flex;gap:8px">
            <KBadge variant="primary" text="outline" :outline="true" />
            <KBadge variant="success" text="outline" :outline="true" />
        </div>

        <h3 class="sp-sub">با آیکون</h3>
        <KBadge variant="success" text="تأیید شده">
            <template #icon>✓</template>
        </KBadge>
    </div>
</template>

<script setup lang="ts">
import KBadge from '../../ui-kit/components/KBadge.vue'
const variants = ['primary', 'success', 'warning', 'danger', 'info'] as const
</script>
