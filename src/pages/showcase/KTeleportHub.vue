<template>
    <div class="sp">
        <h2 class="sp-title">KTeleportHub</h2>

        <p class="sp-note">
            این کامپوننت یک
            <strong>عنصر زیرساختی</strong>
            است، نه یک المان قابل تست بصری.
            یک بار در layout رندر می‌شود و مقصد همه
            <code>&lt;Teleport to="#k-teleport-hub"&gt;</code>
            هاست.
        </p>

        <h3 class="sp-sub">وضعیت در همین صفحه</h3>
        <div class="sp-card" style="max-width: 560px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                <tbody>
                    <tr style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">عنصر موجود است؟</td>
                        <td style="padding: 10px 0; font-weight: 700;">
                            {{ hubExists ? 'بله' : 'خیر' }}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">داخل .k-ui (برای متغیرهای تم)؟</td>
                        <td style="padding: 10px 0; font-weight: 700;">{{ insideKitUi ? 'بله' : 'خیر' }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">position</td>
                        <td style="padding: 10px 0; font-family: monospace;">{{ hubStyle.position || '—' }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">pointer-events</td>
                        <td style="padding: 10px 0; font-family: monospace;">{{ hubStyle.pointerEvents || '—' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: var(--k-text-secondary);">z-index</td>
                        <td style="padding: 10px 0; font-family: monospace;">{{ hubStyle.zIndex || '—' }}</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 14px;">
                <KButton text="به‌روزرسانی وضعیت" :bg-color="'transparent'" @click="inspect" />
            </div>
        </div>

        <h3 class="sp-sub">پایین‌تر در همین صفحه: هل دادن محتوا به هاب</h3>
        <div class="sp-card">
            <KButton :text="pushed ? 'جمع‌کردن کارت شناور' : 'افزودن کارت شناور به هاب'" @click="pushed = !pushed" />
            <Teleport to="#k-teleport-hub">
                <div
                    v-if="pushed"
                    style="position: fixed; bottom: 24px; inset-inline-start: 24px; background: var(--k-surface); border: 1px solid var(--k-border); border-radius: 14px; padding: 14px 16px; box-shadow: 0 18px 40px rgba(15,23,42,.18); font-size: 0.82rem;"
                >
                    این کارت با
                    <code>Teleport</code>
                    داخل هاب رندر شده — نه داخل کارت بالای صفحه.
                    <div style="color: var(--k-text-secondary); margin-top: 6px;">
                        تم فعلی: {{ theme }} — پس رنگ‌ها از متغیرهای هاب می‌آیند.
                    </div>
                </div>
            </Teleport>
        </div>

        <h3 class="sp-sub">چرا لازم است؟</h3>
        <div class="sp-card" style="max-width: 620px;">
            <ul style="margin: 0; padding-inline-start: 18px; font-size: 0.82rem; line-height: 2;">
                <li>dropdown یا تولتیپ داخل مودال با <code>overflow: hidden</code> بریده می‌شود.</li>
                <li>تلمپورت محتوا را از درخت کامپوننت بیرون می‌برد، پس دیگر بریده نمی‌شود.</li>
                <li>هاب داخل <code>.k-ui</code> است تا متغیرهای <code>--k-*</code> و <code>data-theme</code> به محتوای تلمپورت‌شده برسد.</li>
                <li>کامپوننت‌های سراسری (KToastHost، KConfirmDialog) عمداً تلمپورت نمی‌شوند — قبل از ساخته‌شدن هاب mount می‌شوند.</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { useKitTheme } from '../../ui-kit/composables/useKitTheme'

const theme = useKitTheme()

const hubExists = ref(false)
const insideKitUi = ref(false)
const hubStyle = ref<CSSStyleDeclaration | Partial<Record<string, string>>>({})
const pushed = ref(false)

const inspect = () => {
    const el = document.querySelector('#k-teleport-hub') as HTMLElement | null
    hubExists.value = !!el
    insideKitUi.value = !!el?.closest('.k-ui')
    hubStyle.value = el ? getComputedStyle(el) : {}
}

onMounted(inspect)
</script>
