<template>
    <div class="sp">
        <h2 class="sp-title">KDateRange</h2>

        <h3 class="sp-sub">پایه — رزرو اقامت</h3>
        <KDateRange v-model="range1" label="تاریخ اقامت" />
        <p class="sp-note">
            ورود: {{ range1?.checkIn || '—' }} · خروج: {{ range1?.checkOut || '—' }}
        </p>

        <h3 class="sp-sub">حداقل ۲ شب</h3>
        <KDateRange v-model="range2" label="رزرو (حداقل ۲ شب)" :min-nights="2" />

        <h3 class="sp-sub">حداکثر ۷ شب</h3>
        <KDateRange v-model="range3" label="اقامت کوتاه" :max-nights="7" />

        <h3 class="sp-sub">خروجی jalali</h3>
        <KDateRange v-model="range4" label="بازه (شمسی)" output-format="jalali" />

        <h3 class="sp-sub">اجباری</h3>
        <KDateRange v-model="range5" label="بازه اجباری" :required="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDateRange from '../../ui-kit/components/KDateRange.vue'

const range1 = ref<{ checkIn: string | null; checkOut: string | null } | null>(null)
const range2 = ref<{ checkIn: string | null; checkOut: string | null } | null>(null)
const range3 = ref<{ checkIn: string | null; checkOut: string | null } | null>(null)
const range4 = ref<{ checkIn: string | null; checkOut: string | null } | null>(null)
const range5 = ref<{ checkIn: string | null; checkOut: string | null } | null>(null)
</script>
