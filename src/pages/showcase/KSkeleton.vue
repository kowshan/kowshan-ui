<template>
    <div class="sp">
        <h2 class="sp-title">KSkeleton</h2>

        <h3 class="sp-sub">خطوط (پیش‌فرض ۳ خط)</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSkeleton />
        </div>

        <h3 class="sp-sub">تعداد خطوط و عرض دلخواه</h3>
        <div class="sp-card" style="max-width: 480px; display: flex; flex-direction: column; gap: 20px;">
            <KSkeleton :lines="1" />
            <KSkeleton :lines="6" />
            <KSkeleton :lines="4" :line-widths="['100%', '80%', '95%', '60%']" />
        </div>

        <h3 class="sp-sub">آواتار و اندازه دایره</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 24px; align-items: center;">
                <KSkeleton variant="avatar" />
                <KSkeleton variant="avatar" :circle="'64px'" />
                <KSkeleton variant="avatar" :circle="'96px'" />
            </div>
        </div>

        <h3 class="sp-sub">کارت (avatar + تصویر + خطوط)</h3>
        <div class="sp-card">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
                <KSkeleton variant="card" />
                <KSkeleton variant="card" :image-height="'220px'" />
                <KSkeleton variant="card" :image-height="'100px'" :lines="2" />
            </div>
        </div>

        <h3 class="sp-sub">جدول (تعداد ردیف)</h3>
        <div class="sp-card">
            <KSkeleton variant="table" :rows="3" />
            <div style="height: 20px;"></div>
            <KSkeleton variant="table" :rows="8" />
        </div>

        <h3 class="sp-sub">حالت loading=false روی محتوای واقعی</h3>
        <div class="sp-card" style="max-width: 480px;">
            <KSkeleton variant="lines" :loading="loading">
                <p style="margin: 0; font-size: 0.85rem;">
                    این متن واقعی است، نه اسکلت. با کلید زیر حالت را جابه‌جا کنید.
                </p>
            </KSkeleton>
            <div style="margin-top: 14px;">
                <KButton :text="loading ? 'نمایش محتوا' : 'نمایش اسکلت'" @click="loading = !loading" />
            </div>
        </div>

        <h3 class="sp-sub">اسلات سفارشی</h3>
        <div class="sp-card">
            <KSkeleton variant="card">
                <div style="padding: 16px; font-size: 0.85rem;">محتوای دلخواه شما</div>
            </KSkeleton>
        </div>

        <h3 class="sp-sub">عملی — کارت آمار در حال بارگذاری</h3>
        <div class="sp-card">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
                <KSkeleton variant="card" :image-height="'0px'" :lines="2" />
                <KSkeleton variant="card" :image-height="'0px'" :lines="2" />
                <KSkeleton variant="card" :image-height="'0px'" :lines="2" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KSkeleton from '../../ui-kit/components/KSkeleton.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const loading = ref(true)
</script>
