<template>
    <div class="sp">
        <h2 class="sp-title">KShibaInput</h2>

        <h3 class="sp-sub">پایه — با تشخیص بانک</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KShibaInput v-model="sh1" label="شماره شبا" @validate="onValidate" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                اعتبار: {{ valid === null ? 'در انتظار' : (valid ? 'معتبر' : 'نامعتبر') }}
                — بانک: {{ bank ?? '—' }}
            </div>
        </div>

        <h3 class="sp-sub">شبای معتبر از پیش پر‌شده</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KShibaInput v-model="sh2" label="شماره شبا" />
        </div>

        <h3 class="sp-sub">ناقص — کمتر از ۲۶ کاراکتر</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KShibaInput v-model="sh3" label="شماره شبا" />
        </div>

        <h3 class="sp-sub">شبا با ارقام فارسی (نرمال‌سازی خودکار)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KShibaInput v-model="sh4" label="شماره شبا" />
            <div class="sp-vmodel" style="margin-top: 12px;">ذخیره‌شده: {{ sh4 || '—' }}</div>
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KShibaInput v-model="sh5" label="شماره شبا (الزامی)" required />
        </div>

        <h3 class="sp-sub">فقط‌خواندنی و غیرفعال</h3>
        <div class="sp-card" style="max-width: 460px; display: flex; flex-direction: column; gap: 16px;">
            <KShibaInput v-model="sh6" label="شماره ثبت‌شده" readonly />
            <KShibaInput v-model="sh7" label="غیرفعال" disabled />
        </div>

        <h3 class="sp-sub">فرم تسویه با مدرس</h3>
        <div class="sp-card" style="max-width: 460px; display: flex; flex-direction: column; gap: 16px;">
            <KTextInput v-model="holder" label="نام صاحب حساب" />
            <KShibaInput v-model="payout" label="شماره شبا برای تسویه" />
            <KButton :text="payout.length >= 26 ? 'ثبت درخواست تسویه' : 'شبا را کامل کنید'" :disabled="!holder || payout.length < 26" @click="submit" />
            <div v-if="submitted" class="sp-vmodel">درخواست تسویه برای {{ holder }} ثبت شد</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KShibaInput from '../../ui-kit/components/KShibaInput.vue'
import { useIranianValidators } from '../../ui-kit/composables/useIranianValidators'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const sh1 = ref('')
const sh2 = ref('IR820540102680020817909002')
const sh3 = ref('IR82054010')
const sh4 = ref('')
const sh5 = ref('')
const sh6 = ref('IR820540102680020817909002')
const sh7 = ref('IR820540102680020817909002')

const valid = ref<boolean | null>(null)
const onValidate = (r: { valid: boolean }) => { valid.value = r.valid }

const { bankFromShiba } = useIranianValidators()
const bank = computed(() => (sh1.value ? bankFromShiba(sh1.value) : null))

const holder = ref('')
const payout = ref('')
const submitted = ref(false)
const submit = () => { submitted.value = true }
</script>
