<template>
    <div class="sp">
        <h2 class="sp-title">KFeatureCard</h2>

        <h3 class="sp-sub">شبکه ویژگی‌ها (landing)</h3>
        <div class="feat-grid">
            <KFeatureCard
                v-for="f in features"
                :key="f.title"
                :icon="f.icon"
                :title="f.title"
                :description="f.description"
                :link-text="f.link"
                @click="clicked = f.title"
            />
        </div>

        <h3 class="sp-sub">آیکون با رنگ سفارشی</h3>
        <div class="feat-grid">
            <KFeatureCard
                :icon="Shield"
                title="امنیت"
                description="رمزنگاری سرتاسری و احراز هویت دومرحله‌ای."
                icon-bg="#ef4444"
                icon-color="#fff"
                link-text="بیشتر بدانید"
            />
            <KFeatureCard
                :icon="Zap"
                title="سرعت"
                description="بارگذاری آنی با لود کردن تنبل کامپوننت‌ها."
                icon-bg="#f59e0b"
                icon-color="#1a1a1a"
                link-text="بنچمارک‌ها"
            />
            <KFeatureCard
                :icon="Palette"
                title="شخصی‌سازی"
                description="تم روشن، تاریک و OLED با متغیرهای CSS."
                icon-bg="#8b5cf6"
                icon-color="#fff"
                link-text="تنظیمات ظاهری"
            />
        </div>

        <h3 class="sp-sub">بدون لینک</h3>
        <div style="max-width:280px">
            <KFeatureCard
                :icon="Code"
                title="تجربه توسعه‌دهنده"
                description="TypeScript کامل، auto-import و درخت لرزان."
            />
        </div>

        <p class="sp-note">آخرین کلیک: {{ clicked || '—' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KFeatureCard from '../../ui-kit/components/KFeatureCard.vue'
import { Rocket, Layers, Shield, Zap, Palette, Code } from 'lucide-vue-next'

const clicked = ref('')

const features = [
    { icon: Rocket, title: 'آسان شروع کنید', description: 'با چند خط کد اولین کامپوننت را رندر کنید.', link: 'شروع سریع' },
    { icon: Layers, title: 'ماژولار', description: 'هر کامپوننت مستقل و tree-shakeable است.', link: 'معماری' },
]
</script>

<style scoped>
.feat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 14px;
}
</style>
