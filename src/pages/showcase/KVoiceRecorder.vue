<template>
    <div class="sp">
        <h2 class="sp-title">KVoiceRecorder</h2>
        <p class="sp-note">
            برای آزمودن، مرورگر اجازه دسترسی به میکروفون می‌خواهد. روند: شروع ضبط → موج زنده → توقف →
            پخش/ارسال/حذف.
        </p>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KVoiceRecorder @record="onRecord" @send="onSend" />
            <div class="sp-vmodel" style="margin-top: 14px;">
                آخرین ضبط: {{ lastSize }} — ارسال: {{ sends }} بار
            </div>
        </div>

        <h3 class="sp-sub">در کادر جعبه پیام (ترکیب با چت)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <div style="border: 1px solid var(--k-border); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 12px; background: var(--k-surface-hover);">
                <div v-for="m in messages" :key="m.text" style="font-size: 0.8rem;">{{ m.text }}</div>
                <KVoiceRecorder @send="pushVoice" />
            </div>
        </div>

        <h3 class="sp-sub">رویدادها</h3>
        <div class="sp-card" style="max-width: 520px;">
            <div class="sp-vmodel">
                تعداد ضبط‌ها: {{ records }}<br />
                آخرین حجم: {{ lastSize }}<br />
                ارسال‌شده‌ها: {{ sends }} بار
            </div>
        </div>

        <h3 class="sp-sub">نکته دسترسی</h3>
        <div class="sp-card" style="max-width: 620px;">
            <ul style="margin: 0; padding-inline-start: 18px; font-size: 0.82rem; line-height: 2;">
                <li>اگر مرورگر اجازه ندهد، چیزی ضبط نمی‌شود (در Console خطا ثبت می‌شود).</li>
                <li>مقدار ارسالی یک dataUrl صوتی است؛ در پروژه واقعی به سرور آپلود کنید.</li>
                <li>روی HTTPS یا localhost کار می‌کند؛ روی دامنه http ساده مسدود است.</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KVoiceRecorder from '../../ui-kit/components/KVoiceRecorder.vue'

const records = ref(0)
const sends = ref(0)
const lastSize = ref('—')
const messages = ref<{ text: string }[]>([
    { text: 'سلام، فایل صوتی تمرین تلفظ را می‌فرستم.' },
])

const onRecord = (blob: Blob) => {
    records.value++
    lastSize.value = `${(blob.size / 1024).toFixed(1)} کیلوبایت`
}

const onSend = () => {
    sends.value++
    messages.value.push({ text: `🎙 پیام صوتی شماره ${sends.value} ارسال شد` })
}

const pushVoice = () => {
    sends.value++
    messages.value.push({ text: `🎙 پیام صوتی شماره ${sends.value} ارسال شد` })
}
</script>
