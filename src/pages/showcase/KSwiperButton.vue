<template>
    <div class="sp">
        <h2 class="sp-title">KSwiperButton</h2>
        <p class="sp-note">
            دکمه قبلی/بعدی اسلایدر. داخل <code>#controls</code> اسلایدر خودش وصل می‌شود و در ابتدا/انتها
            غیرفعال می‌شود؛ بیرون از اسلایدر فقط کلیک را emit می‌کند تا خودتان وصل کنید.
        </p>

        <h3 class="sp-sub">اتصال خودکار داخل اسلایدر</h3>
        <div class="ks-frame">
            <KSwiper :per-page="2" :gap="10">
                <template #controls="{ index, pages }">
                    <KSwiperButton direction="prev" />
                    <KSwiperButton direction="next" />
                    <span class="sp-note">{{ index + 1 }} / {{ pages }}</span>
                </template>
                <div v-for="i in 6" :key="i" class="ks-slide">{{ i }}</div>
            </KSwiper>
        </div>

        <h3 class="sp-sub">داخل اسلایدر عمودی — آیکن‌ها بالا/پایین می‌شوند</h3>
        <p class="sp-note">
            جهت آیکن از محور اسلایدر گرفته می‌شود (نه از یک پراپ جدا)، پس همان دکمه داخل
            <code>direction="vertical"</code> به‌صورت خودکار ↑ ↓ نشان می‌دهد.
        </p>
        <div class="ks-frame">
            <KSwiper direction="vertical" :height="240" :per-page="1" :gap="10">
                <template #controls="{ index, pages }">
                    <KSwiperButton direction="prev" size="sm" />
                    <KSwiperButton direction="next" size="sm" />
                    <span class="sp-note">{{ index + 1 }} / {{ pages }}</span>
                </template>
                <template #default>
                    <div v-for="i in 4" :key="i" class="ks-vslide">{{ i }}</div>
                </template>
            </KSwiper>
        </div>

        <h3 class="sp-sub">سایزها</h3>
        <div class="ks-row">
            <KSwiperButton direction="prev" size="sm" />
            <KSwiperButton direction="prev" size="md" />
            <KSwiperButton direction="prev" size="lg" />
            <KSwiperButton direction="next" size="sm" />
            <KSwiperButton direction="next" size="md" />
            <KSwiperButton direction="next" size="lg" />
        </div>

        <h3 class="sp-sub">با/بدون border و سطح</h3>
        <div class="ks-row">
            <KSwiperButton direction="prev" />
            <KSwiperButton direction="prev" :bordered="false" />
            <KSwiperButton direction="next" />
            <KSwiperButton direction="next" :bordered="false" />
            <KSwiperButton direction="next" :disabled="true" />
        </div>

        <h3 class="sp-sub">برچسب و آیکن دلخواه</h3>
        <div class="ks-row">
            <KSwiperButton direction="next" label="اسلاید بعدی" />
            <KSwiperButton direction="prev" label="قبلی" />
            <KSwiperButton direction="next" :icon="ArrowUp" label="بالا" />
            <KSwiperButton direction="next" :icon="ArrowDown" label="پایین" />
        </div>

        <h3 class="sp-sub">بیرون از اسلایدر — فقط کلیک emit می‌شود</h3>
        <div class="ks-frame">
            <KSwiper ref="s" :per-page="3" :gap="10">
                <div v-for="i in 9" :key="i" class="ks-slide small">{{ i }}</div>
            </KSwiper>
            <div class="ks-row">
                <KSwiperButton direction="prev" @click="step('prev')" />
                <KSwiperButton direction="next" @click="step('next')" />
                <span class="sp-note">کلیک‌ها: {{ clicks }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import KSwiper from '../../ui-kit/components/KSwiper.vue'
import KSwiperButton from '../../ui-kit/components/KSwiperButton.vue'

const s = ref()
const clicks = ref(0)

const step = (dir: 'prev' | 'next') => {
    clicks.value++
    dir === 'next' ? s.value?.next() : s.value?.prev()
}
</script>

<style scoped>
.ks-frame {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.ks-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.ks-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110px;
    border-radius: var(--k-radius-md);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    border: 1px solid var(--k-primary);
    color: var(--k-primary);
    font-size: 1.2rem;
    font-weight: 800;
}
.ks-slide.small { height: 90px; font-size: 1rem; }
.ks-vslide {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--k-radius-md);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.14));
    border: 1px solid var(--k-primary);
    color: var(--k-primary);
    font-size: 1.2rem;
    font-weight: 800;
}
</style>
