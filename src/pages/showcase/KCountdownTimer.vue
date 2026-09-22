<template>
    <div class="sp">
        <h2 class="sp-title">KCountdownTimer</h2>

        <h3 class="sp-sub">پایه (۳ روز)</h3>
        <KCountdownTimer :target="in3Days" label="زمان باقی‌مانده" />

        <h3 class="sp-sub">بدون روز</h3>
        <KCountdownTimer :target="in3Days" label="فقط ساعت" :show-days="false" />

        <h3 class="sp-sub">پایان یافته</h3>
        <KCountdownTimer :target="past" label="تمام شده" ended-text="پایان یافت" />

        <h3 class="sp-sub">کوتاه (۱ ساعت)</h3>
        <KCountdownTimer :target="in1Hour" label="حراج ویژه" />
    </div>
</template>

<script setup lang="ts">
import KCountdownTimer from '../../ui-kit/components/KCountdownTimer.vue'

const in3Days = Date.now() + 86400000 * 3
const in1Hour = Date.now() + 3600000
const past = Date.now() - 3600000
</script>
