<template>
    <div class="sp">
        <h2 class="sp-title">KScreenRecorder</h2>
        <p class="sp-note">
            این کامپوننت از <code>getDisplayMedia</code> مرورگر استفاده می‌کند. برای آزمودن، روی «شروع ضبط»
            بزنید و یک تب یا کل صفحه را انتخاب کنید؛ پایان اشتراک‌گذاری، ضبط را خودکار متوقف می‌کند.
        </p>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KScreenRecorder @start="onStart" @stop="onStop" @download="onDownload" />
        </div>

        <h3 class="sp-sub">عنوان سفارشی</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KScreenRecorder title="ضبط جلسه آموزشی" />
        </div>

        <h3 class="sp-sub">فرمت MP4 (در مرورگرهای پشتیبان)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KScreenRecorder title="ضبط با فرمت mp4" mime-type="video/mp4" />
            <p class="sp-note">
                اگر مرورگر از mp4 پشتیبانی نکند، ضبط شروع نمی‌شود؛ پیش‌فرض webm امن‌ترین انتخاب است.
            </p>
        </div>

        <h3 class="sp-sub">رویدادها</h3>
        <div class="sp-card" style="max-width: 520px;">
            <div class="sp-vmodel">
                شروع: {{ starts }} بار<br />
                توقف: {{ stops }} بار — آخرین حجم: {{ lastSize }}<br />
                دانلود: {{ downloads }} بار
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KScreenRecorder from '../../ui-kit/components/KScreenRecorder.vue'

const starts = ref(0)
const stops = ref(0)
const downloads = ref(0)
const lastSize = ref('—')

const onStart = () => { starts.value++ }
const onStop = (blob: Blob) => {
    stops.value++
    lastSize.value = `${(blob.size / 1024).toFixed(1)} کیلوبایت`
}
const onDownload = () => { downloads.value++ }
</script>
