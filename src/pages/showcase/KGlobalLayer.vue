<template>
    <div class="sp">
        <h2 class="sp-title">KGlobalLayer</h2>
        <p class="sp-note">
            لایه سراسری — یک بار در layout: <code>&lt;KGlobalLayer /&gt;</code>.
            شامل KToastHost + KConfirmDialog است؛ از همه‌جا با استورها کار می‌کند.
        </p>

        <h3 class="sp-sub">Toast — انواع</h3>
        <div class="sp-row">
            <KButton text="موفقیت" bg-color="var(--k-success, #22c55e)" text-color="#fff" @click="success" />
            <KButton text="خطا" bg-color="var(--k-error, #ef4444)" text-color="#fff" @click="error" />
            <KButton text="هشدار" bg-color="var(--k-warning, #f59e0b)" text-color="#fff" @click="warning" />
            <KButton text="اطلاعات" bg-color="var(--k-info, #3b82f6)" text-color="#fff" @click="info" />
        </div>

        <h3 class="sp-sub">Toast — پیشرفته</h3>
        <div class="sp-row">
            <KButton text="با عنوان و مدت" bg-color="var(--k-primary)" text-color="#fff" @click="withTitle" />
            <KButton text="خطاهای لاراول" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="laravelErrors" />
            <KButton text="با دکمه" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="withButtons" />
        </div>

        <h3 class="sp-sub">Confirm</h3>
        <div class="sp-row">
            <KButton text="تأیید حذف" bg-color="var(--k-error, #ef4444)" text-color="#fff" @click="askDelete" />
            <span v-if="result" class="sp-vmodel">نتیجه: {{ result }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { useKToast } from '../../ui-kit/composables/useKToast'
import { useModalStore } from '../../ui-kit/stores/modalStore'

const result = ref('')

const success = () => useKToast.success('عملیات با موفقیت انجام شد')
const error = () => useKToast.error('خطایی رخ داد!')
const warning = () => useKToast.warning('مقدار وارد شده معتبر نیست')
const info = () => useKToast.info('همگام‌سازی انجام شد')

const withTitle = () => useKToast.success({ title: 'آپلود کامل شد', message: 'فایل certification.pdf ذخیره شد', timeout: 5000 })
const laravelErrors = () => useKToast.showErrors({ phone: ['شماره تماس معتبر نیست'], postal: ['کد پستی الزامی است'] }, 'ثبت‌نام نامعتبر')
const withButtons = () => useKToast.warning({ message: 'اعتبار سند رو به اتمام است', timeout: 0, buttons: [{ label: 'تمدید', onClick: () => useKToast.info('تمدید شد') }] })

const askDelete = async () => {
    const ok = await useModalStore().confirm({
        title: 'حذف رکورد',
        message: 'آیا از حذف این رکورد مطمئن هستید؟ این عمل قابل بازگشت نیست.',
        confirmText: 'حذف',
        cancelText: 'انصراف',
        variant: 'danger',
    })
    result.value = ok ? 'تأیید شد ✅' : 'لغو شد ❌'
}
</script>
