<template>
    <div class="sp">
        <h2 class="sp-title">KUpdatePrompt</h2>
        <p class="sp-note">
            این بنر به‌صورت عادی با
            <code>usePwaUpdate</code>
            کار می‌کند و فقط وقتی نسخه جدید سرویس‌ورکر آماده باشد دیده می‌شود.
            با پراپ
            <code>show</code>
            می‌توان آن را برای تست اجبار کرد (همین کاری که پایین انجام شده).
        </p>

        <h3 class="sp-sub">وضعیت واقعی (از سرویس‌ورکر)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                <tbody>
                    <tr style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">سرویس‌ورکر ثبت شده؟</td>
                        <td style="padding: 10px 0; font-weight: 700;">{{ swRegistered ? 'بله' : 'خیر' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">نسخه جدید آماده است؟</td>
                        <td style="padding: 10px 0; font-weight: 700;">{{ updateAvailable ? 'بله' : 'خیر' }}</td>
                    </tr>
                </tbody>
            </table>
            <p class="sp-note" style="margin-top: 12px;">
                در محیط dev معمولاً «خیر» است، چون سرویس‌ورکر ثبت نمی‌شود.
            </p>
        </div>

        <h3 class="sp-sub">نمایش اجباری (دمو)</h3>
        <div class="sp-card" style="max-width: 560px; display: flex; flex-direction: column; gap: 16px;">
            <KButton :text="show ? 'جمع‌کردن بنر' : 'نمایش بنر بروزرسانی'" @click="show = !show" />
            <p class="sp-note">
                هشدار: دکمه «بروزرسانی» در حالت دمو صفحه را reload می‌کند (همان رفتاری که در محصول واقعی
                برای فعال‌سازی نسخه جدید لازم است).
            </p>
        </div>

        <h3 class="sp-sub">نمونه ثابت — بدون سرویس‌ورکر</h3>
        <div class="sp-card" style="max-width: 560px;">
          <div
            style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border: 1px solid var(--k-border); border-radius: 12px; background: var(--k-surface);"
          >
            <span style="font-size: 0.82rem;">نسخه جدید آماده است — برای اعمال، صفحه را بروزرسانی کنید.</span>
            <span style="display: flex; gap: 8px;">
                <KButton text="بروزرسانی" />
                <KButton text="بعداً" :bg-color="'transparent'" />
            </span>
          </div>
          <p class="sp-note" style="margin-top: 12px;">
            این یک بازسازی بصری از بنر است تا شکل و چیدمان آن را ببینید؛ خودِ کامپوننت پایین صفحه
            به‌صورت fixed رندر می‌شود.
          </p>
        </div>

        <KUpdatePrompt :show="show" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KUpdatePrompt from '../../ui-kit/components/KUpdatePrompt.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { usePwaUpdate } from '../../ui-kit/composables/usePwaUpdate'

const show = ref(false)

const update = usePwaUpdate()
const updateAvailable = computed(() => update.updateAvailable.value)
const swRegistered = ref(typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller)
</script>
