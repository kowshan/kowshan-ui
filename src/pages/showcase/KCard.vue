<template>
    <div class="sp">
        <h2 class="sp-title">KCard</h2>

        <h3 class="sp-sub">پایه</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
            <KCard title="کارت ساده" subtitle="زیرعنوان" />
            <KCard title="با هاور" subtitle="روی آن هاور کنید" :hoverable="true" />
            <KCard title="تعاملی" subtitle="قابل کلیک" :interactive="true" />
            <KCard title="بدون border" subtitle="border ندارد" :bordered="false" />
        </div>

        <h3 class="sp-sub">variant ها</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
            <KCard v-for="v in cardVariants" :key="v" :variant="v" :title="v" subtitle="نمونه variant" />
        </div>

        <h3 class="sp-sub">padding</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
            <KCard v-for="p in paddings" :key="p" :padding="p" :title="'padding ' + p" subtitle="نمونه" />
        </div>

        <h3 class="sp-sub">با cover</h3>
        <div style="max-width:280px">
            <KCard title="کارت با تصویر" subtitle="cover بالا" cover="https://picsum.photos/seed/kcard/400/200" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KCard from '../../ui-kit/components/KCard.vue'

const cardVariants = ['default', 'glass', 'outlined', 'filled', 'gradient', 'glow'] as const
const paddings = ['none', 'sm', 'md', 'lg'] as const
</script>
