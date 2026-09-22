<template>
    <div class="sp">
        <h2 class="sp-title">KStickyHeader</h2>
        <p class="sp-note">
            هدر داخل جعبه اسکرول زیر می‌چسبد و بعد از ۶۰ پیکسل اسکرول، حالت فشرده می‌گیرد.
            (الیگویی که اسکرول را تشخیص می‌دهد، حالا نزدیک‌ترین ظرف اسکرول‌شونده را پیدا می‌کند، نه فقط پنجره.)
        </p>

        <h3 class="sp-sub">پایه — با حالت فشرده</h3>
        <div class="sp-card">
            <div class="sh-scroll">
                <KStickyHeader>
                    <template #default="{ compact }">
                        <div class="sh-row" :class="{ 'is-compact': compact }">
                            <strong style="font-size: 0.9rem;">مدیریت دوره‌ها</strong>
                            <span style="font-size: 0.75rem; color: var(--k-text-secondary);">
                                {{ compact ? 'فشرده' : 'حالت عادی' }}
                            </span>
                        </div>
                    </template>
                </KStickyHeader>
                <div v-for="i in 14" :key="i" class="sh-line">
                    ردیف محتوا شماره {{ i }}
                </div>
            </div>
        </div>

        <h3 class="sp-sub">آستانه فشرده‌شدن ۱۰ پیکسل</h3>
        <div class="sp-card">
            <div class="sh-scroll">
                <KStickyHeader :compact-threshold="10">
                    <template #default="{ compact }">
                        <div class="sh-row" :class="{ 'is-compact': compact }">
                            <strong style="font-size: 0.9rem;">هدر حساس</strong>
                            <span style="font-size: 0.75rem; color: var(--k-text-secondary);">
                                compact: {{ compact }}
                            </span>
                        </div>
                    </template>
                </KStickyHeader>
                <div v-for="i in 12" :key="i" class="sh-line">ردیف {{ i }}</div>
            </div>
        </div>

        <h3 class="sp-sub">sticky=false — می‌چسبد؟ نه</h3>
        <div class="sp-card">
            <div class="sh-scroll">
                <KStickyHeader :sticky="false">
                    <template #default="{ compact }">
                        <div class="sh-row" :class="{ 'is-compact': compact }">
                            <strong style="font-size: 0.9rem;">هدر غیرچسبان</strong>
                            <span style="font-size: 0.75rem; color: var(--k-text-secondary);">
                                compact: {{ compact }}
                            </span>
                        </div>
                    </template>
                </KStickyHeader>
                <div v-for="i in 12" :key="i" class="sh-line">ردیف {{ i }}</div>
            </div>
            <p class="sp-note">این هدر با اسکرول از دید خارج می‌شود (قبل از اصلاح، با اینکه sticky=false بود، می‌چسبید).</p>
        </div>

        <h3 class="sp-sub">فهرست بلند با هدر چسبان</h3>
        <div class="sp-card">
            <div class="sh-scroll" style="height: 320px;">
                <KStickyHeader :compact-threshold="30">
                    <template #default="{ compact }">
                        <div class="sh-row" :class="{ 'is-compact': compact }">
                            <strong style="font-size: 0.9rem;">دانش‌آموزان (۲۴)</strong>
                            <span class="sh-pill">۲۴ نفر</span>
                        </div>
                    </template>
                </KStickyHeader>
                <div v-for="s in students" :key="s.name" class="sh-line" style="display: flex; justify-content: space-between;">
                    <span>{{ s.name }}</span>
                    <span style="color: var(--k-text-muted); font-size: 0.75rem;">{{ s.course }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KStickyHeader from '../../ui-kit/components/KStickyHeader.vue'

const students = [
    { name: 'سارا محمدی', course: 'مکالمه مقدماتی' },
    { name: 'رضا کریمی', course: 'گرامر پیشرفته' },
    { name: 'مینا رستمی', course: 'آیلتس فشرده' },
    { name: 'امیر تهرانی', course: 'کارگاه تلفظ' },
    { name: 'نگار احمدی', course: 'دوره کودکان' },
    { name: 'حسین نوری', course: 'مکالمه مقدماتی' },
    { name: 'لیلا صادقی', course: 'گرامر پیشرفته' },
    { name: 'پویا رحیمی', course: 'آیلتس فشرده' },
]
</script>

<style scoped>
.sh-scroll {
    height: 240px;
    overflow-y: auto;
    border: 1px solid var(--k-border);
    border-radius: 12px;
    background: var(--k-surface, #fff);
}
.sh-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--k-border);
    transition: all 0.2s ease;
}
.sh-row.is-compact {
    padding-top: 8px;
    padding-bottom: 8px;
    backdrop-filter: blur(10px);
}
.sh-line {
    padding: 12px 16px;
    font-size: 0.8rem;
    border-bottom: 1px solid var(--k-border);
    color: var(--k-text-secondary);
}
.sh-pill {
    font-size: 0.68rem;
    padding: 2px 10px;
    border-radius: 999px;
    background: var(--k-primary-light);
    color: var(--k-primary);
}
</style>
