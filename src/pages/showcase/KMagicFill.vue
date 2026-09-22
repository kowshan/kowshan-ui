<template>
    <div class="sp">
        <h2 class="sp-title">KMagicFill</h2>
        <p class="sp-note">
            از یک متن آزاد (پیام، توضیحات تماس، ایمیل) فیلدهای ساختاریافته استخراج می‌کند —
            پیش‌فرض روی فیلدهای سرنخ CRM تنظیم شده است.
        </p>

        <h3 class="sp-sub">پیش‌فرض (استخراج با دکمه)</h3>
        <div class="sp-card">
            <KMagicFill v-model="parsed" @fill="onFill" @clear="onClear" />
            <div class="sp-vmodel">v-model: {{ JSON.stringify(parsed) }}</div>
            <div class="sp-vmodel">fill event: {{ lastFill }}</div>
        </div>

        <h3 class="sp-sub">حالت زنده (با تایپ کردن)</h3>
        <div class="sp-card">
            <KMagicFill live placeholder="هر متنی بنویسید… مثلاً: مریم احمدی ۰۹۳۵۱۱۱۲۲۳۳ شیراز برای مشاوره" />
        </div>

        <h3 class="sp-sub">فیلدهای سفارشی (کد پیگیری + مبلغ)</h3>
        <div class="sp-card">
            <KMagicFill :fields="customFields" placeholder="مثلاً: کد پیگیری AB-12345 و مبلغ ۲۵۰۰۰۰ تومان پرداخت شد" />
        </div>

        <h3 class="sp-sub">متن آماده با چند فیلد</h3>
        <div class="sp-card">
            <KMagicFill
                placeholder="-"
                :live="true"
                :model-value="{ text: 'حسین کریمی — ۰۹۱۹۸۸۷۷۶۶ — اصفهان، خیابان چهارباغ — علاقه‌مند به خرید ویلا ۲۰۰ متری' }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KMagicFill from '../../ui-kit/components/KMagicFill.vue'
import type { MagicFieldDef } from '../../ui-kit/composables/useMagicFill'

const parsed = ref<Record<string, string> | null>(null)
const lastFill = ref('—')

const onFill = (value: Record<string, string>) => { lastFill.value = JSON.stringify(value) }
const onClear = () => { lastFill.value = 'پاک شد' }

const toAscii = (t: string) =>
    t.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

const customFields: MagicFieldDef[] = [
    {
        key: 'trackingCode',
        label: 'کد پیگیری',
        extract: (text: string) => {
            const m = toAscii(text).match(/[A-Z]{2}-\d{4,}/i)
            return m ? { value: m[0], confidence: 'high' as const, source: 'کد پیگیری' } : null
        },
    },
    {
        key: 'amount',
        label: 'مبلغ',
        extract: (text: string) => {
            const m = toAscii(text).match(/(\d[\d,]{3,})/)
            return m ? { value: m[1], confidence: 'medium' as const, source: 'مبلغ' } : null
        },
    },
]
</script>
