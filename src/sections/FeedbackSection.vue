<template>
    <DemoSection
        id="feedback"
        index="04"
        title="بازخورد و همپوشان"
        description="هشدارها، پیشرفت، حالت‌های بارگذاری و مودال"
    >
        <!-- Alerts -->
        <p class="demo-caption">هشدارها</p>
        <div class="demo-stack">
            <KAlert title="عملیات موفق" description="اطلاعات ملک با موفقیت ذخیره شد." variant="success" closable />
            <KAlert title="توجه" description="بازدید امروز ساعت ۱۵ برنامه‌ریزی شده است." variant="warning" />
            <KAlert title="خطا در ذخیره‌سازی" description="شماره تماس وارد شده معتبر نیست." variant="danger" closable />
            <KAlert title="اطلاعات" description="نسخه جدید کیت منتشر شد." variant="info">
                <template #actions>
                    <KButton text="مشاهده" bg-color="#8b5cf6" text-color="#fff" size="sm" />
                </template>
            </KAlert>
        </div>

        <hr class="demo-divider" />

        <!-- Toasts -->
        <p class="demo-caption">اعلان (Toast) — از استور سراسری: پیام تکی، چندپیامه و دکمه‌دار</p>
        <div class="demo-row">
            <KButton text="موفقیت" :left-icon="CheckCircle2" bg-color="#10b981" text-color="#fff" @click="useToast.success({ message: 'ملک با موفقیت ذخیره شد', description: 'کد پیگیری: PR-1405-118' })" />
            <KButton text="خطای چندپیامه" :left-icon="XCircle" bg-color="#ef4444" text-color="#fff" @click="showValidationErrors" />
            <KButton text="با دکمه و بازگشت" :left-icon="BellRing" bg-color="#3b82f6" text-color="#fff" @click="showActionToast" />
            <KButton text="هشدار" :left-icon="AlertTriangle" bg-color="#f59e0b" text-color="#fff" @click="useToast.warning('اعتبار سند تا ۳ روز دیگر به پایان می‌رسد')" />
        </div>
        <p style="font-size: 0.72rem; color: var(--k-text-muted); margin: 8px 0 0">
            چندپیامه (سبک Laravel): خطاها به‌صورت فهرست زیر عنوان نمایش داده می‌شوند — اگر فقط یک خطا باشد به‌صورت پیام تکی ظاهر می‌شود.
        </p>

        <hr class="demo-divider" />

        <!-- Progress -->
        <p class="demo-caption">نوار پیشرفت</p>
        <div class="demo-grid">
            <KProgress :model-value="65" label="پیشرفت ثبت" show-percent />
            <KProgress :model-value="40" variant="success" striped animated />
            <KProgress :model-value="80" variant="warning" show-percent />
            <KProgress :indeterminate="true" variant="info" label="در حال بارگذاری…" />
        </div>

        <hr class="demo-divider" />

        <!-- Skeleton + Empty -->
        <div class="demo-row is-start">
            <div style="width: 260px">
                <KSkeleton variant="card" />
            </div>
            <div style="width: 220px">
                <KSkeleton variant="lines" :lines="4" />
            </div>
            <div style="width: 300px">
                <KEmptyState
                    title="موردی پیدا نشد"
                    description="با تغییر فیلترها دوباره جستجو کنید"
                    :icon="SearchX"
                />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Tooltip -->
        <p class="demo-caption">راهنما (Tooltip)</p>
        <div class="demo-row">
            <KTooltip content="این یک راهنمای بالایی است" position="top">
                <KButton text="هاور: بالا" bg-color="#e2e8f0" text-color="#1e293b" />
            </KTooltip>
            <KTooltip content="راهنمای پایین" position="bottom" theme="light">
                <KButton text="هاور: پایین" bg-color="#e2e8f0" text-color="#1e293b" />
            </KTooltip>
            <KTooltip content="راهنمای کلیکی" position="right" trigger="click">
                <KButton text="کلیک کن" bg-color="#e2e8f0" text-color="#1e293b" />
            </KTooltip>
        </div>

        <hr class="demo-divider" />

        <!-- Modal -->
        <p class="demo-caption">مودال — با شناسه از استور سراسری (بدون متغیر محلی)</p>
        <div class="demo-row">
            <KButton text="باز کردن مودال (استور)" :left-icon="Maximize2" bg-color="#1db954" text-color="#fff" @click="modal.openModal('demo-delete')" />
            <KButton text="مودال دوم — استک" :left-icon="Layers" bg-color="#6366f1" text-color="#fff" @click="modal.openModal('demo-second')" />
        </div>
        <p style="font-size: 0.72rem; color: var(--k-text-muted); margin: 8px 0 0">
            باز/بستن با <code style="direction: ltr">modalStore.openModal(id)</code> — نیازی به v-model نیست؛
            مودال با همان id در قالب تعریف می‌شود.
        </p>

        <!-- Store-driven modals -->
        <KModal id="demo-delete" title="تأیید عملیات" size="sm">
            <div style="display: flex; gap: 12px; align-items: flex-start">
                <div
                    style="
                        width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
                        background: var(--k-warning-light); color: var(--k-warning);
                        display: flex; align-items: center; justify-content: center;
                    "
                >
                    <AlertTriangle style="width: 20px; height: 20px" />
                </div>
                <p style="margin: 0; font-size: 0.85rem; line-height: 1.9; color: var(--k-text-secondary)">
                    آیا از حذف این ملک مطمئن هستید؟ این عملیات قابل بازگشت نیست و تمامی
                    اطلاعات مرتبط با آن حذف خواهد شد.
                </p>
            </div>

            <template #footer>
                <KButton text="انصراف" bg-color="#f1f5f9" text-color="#475569" @click="modal.closeModal('demo-delete')" />
                <KButton text="حذف" bg-color="#fee2e2" text-color="#b91c1c" @click="confirmDelete" />
            </template>
        </KModal>

        <KModal id="demo-second" title="حذف دسته‌جمعی" size="sm">
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.9; color: var(--k-text-secondary)">
                ۱۲ مورد انتخاب شده‌اند. این عمل روی همه اعمال خواهد شد.
            </p>
            <template #footer>
                <KButton text="انصراف" bg-color="#f1f5f9" text-color="#475569" @click="modal.closeModal('demo-second')" />
                <KButton text="ادامه" bg-color="#6366f1" text-color="#fff" @click="modal.closeModal('demo-second')" />
            </template>
        </KModal>
    </DemoSection>
</template>

<script setup lang="ts">
import { AlertTriangle, BellRing, CheckCircle2, Layers, Maximize2, SearchX, XCircle } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'

import KAlert from '../ui-kit/components/KAlert.vue'
import KProgress from '../ui-kit/components/KProgress.vue'
import KSkeleton from '../ui-kit/components/KSkeleton.vue'
import KEmptyState from '../ui-kit/components/KEmptyState.vue'
import KTooltip from '../ui-kit/components/KTooltip.vue'
import KModal from '../ui-kit/components/KModal.vue'
import KButton from '../ui-kit/components/KButton.vue'
import { useToast } from '../ui-kit/composables/useToast'
import { useModalStore } from '../ui-kit/stores/modalStore'

const modal = useModalStore()
const toast = useToast

/* Laravel-style validation summary — errors come back as { field: string[] } */
const showValidationErrors = () => {
    toast.showErrors({
        phone: ['شماره تماس وارد شده معتبر نیست'],
        postal: ['کد پستی الزامی است'],
        image: ['تصویر ضمیمه نشده است'],
    }, 'ثبت‌نام نامعتبر است')
}

/* Sticky toast with an action button + callback */
const showActionToast = () => {
    toast.info({
        message: 'گزارش فروش مرداد آماده شد',
        description: 'این اعلان تا بسته شدن می‌ماند.',
        duration: 0,
        buttons: [
            {
                label: 'دانلود اکسل',
                onClick: () => toast.success('دانلود شروع شد — گزارش فروش.xlsx'),
            },
        ],
    })
}

const confirmDelete = () => {
    modal.closeModal('demo-delete')
    toast.warning('عملیات حذف لغو شد — این مورد هنوز فعال است')
}
</script>
