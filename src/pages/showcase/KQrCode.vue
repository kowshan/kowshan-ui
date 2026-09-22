<template>
    <div class="sp">
        <h2 class="sp-title">KQrCode</h2>

        <h3 class="sp-sub">پایه (اندازه پیش‌فرض ۱۶۰)</h3>
        <div class="sp-row">
            <KQrCode value="https://zaban-sara.ir" title="وب‌سایت آکادمی" />
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-row">
            <KQrCode v-for="s in [96, 128, 160, 200, 260]" :key="s" :value="`https://zaban-sara.ir?size=${s}`" :size="s" :title="`کد ${s}`" />
        </div>

        <h3 class="sp-sub">رنگ‌ها</h3>
        <div class="sp-row">
            <KQrCode value="https://zaban-sara.ir" :fg="'#1db954'" title="سبز" />
            <KQrCode value="https://zaban-sara.ir" :fg="'#6366f1'" :bg="'#eef2ff'" title="بنفش" />
            <KQrCode value="https://zaban-sara.ir" :fg="'#ef4444'" :bg="'#fef2f2'" title="قرمز" />
            <KQrCode value="https://zaban-sara.ir" :fg="'#0f172a'" :bg="'#f8fafc'" title="تیره" />
        </div>

        <h3 class="sp-sub">ناحیه سکوت (quietZone)</h3>
        <div class="sp-row">
            <KQrCode value="https://zaban-sara.ir" :quiet-zone="0" :bg="'#e2e8f0'" title="بدون حاشیه" />
            <KQrCode value="https://zaban-sara.ir" :quiet-zone="2" title="حاشیه ۲" />
            <KQrCode value="https://zaban-sara.ir" :quiet-zone="6" title="حاشیه ۶" />
        </div>

        <h3 class="sp-sub">محتوای متفاوت</h3>
        <div class="sp-row">
            <KQrCode value="tel:+982112345678" :size="128" title="تماس" />
            <KQrCode value="mailto:info@zaban-sara.ir" :size="128" title="ایمیل" />
            <KQrCode :value="vcard" :size="140" title="کارت ویزیت" />
            <KQrCode :value="wifi" :size="140" title="وای‌فای" />
        </div>

        <h3 class="sp-sub">محتوای طولانی‌تر (متن میانی)</h3>
        <div class="sp-row">
            <KQrCode :value="longText" :size="200" title="متن فارسی طولانی" />
        </div>

        <h3 class="sp-sub">خطا — متن بسیار طولانی</h3>
        <div class="sp-row">
            <KQrCode :value="tooLong" :size="160" :title="'بیش از ظرفیت'" @error="onError" />
        </div>

        <h3 class="sp-sub">ورودی زنده</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
            <KTextInput v-model="live" label="متن کد" placeholder="چیزی بنویسید…" />
            <KQrCode v-if="live" :value="live" :size="180" title="کد زنده" />
            <span v-else class="sp-note">متن را وارد کنید تا کد ساخته شود</span>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">رویداد error: {{ errorCount }} بار</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KQrCode from '../../ui-kit/components/KQrCode.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'

const vcard = 'BEGIN:VCARD\nVERSION:3.0\nN:محمدی;سارا\nTEL:+982112345678\nEMAIL:sara@zaban-sara.ir\nEND:VCARD'
const wifi = 'WIFI:T:WPA;S:ZabanSara-Guest;P:welcome1405;;'
const longText =
    'این یک متن فارسی نسبتاً طولانی است که برای آزمودن ظرفیت کد کیو آر نوشته شده و شامل چند جمله کامل می‌شود تا ببینیم رمزگذار تا کجا دوام می‌آورد.'
const tooLong = 'x'.repeat(3000)

const live = ref('https://zaban-sara.ir/courses/english')
const errorCount = ref(0)
const onError = () => { errorCount.value++ }
</script>
