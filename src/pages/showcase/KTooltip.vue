<template>
    <div class="sp">
        <h2 class="sp-title">KTooltip</h2>

        <h3 class="sp-sub">چهار جهت</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; flex-wrap: wrap;">
                <KTooltip v-for="p in positions" :key="p" :content="`موقعیت ${p}`" :position="p">
                    <KButton :text="p" :bg-color="'transparent'" />
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">تم تیره و روشن</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; flex-wrap: wrap;">
                <KTooltip content="توست تیره" theme="dark">
                    <KButton text="dark" :bg-color="'transparent'" />
                </KTooltip>
                <KTooltip content="توست روشن" theme="light">
                    <KButton text="light" :bg-color="'transparent'" />
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; flex-wrap: wrap;">
                <KTooltip v-for="s in sizes" :key="s" :content="`اندازه ${s}`" :size="s">
                    <KButton :text="s" :bg-color="'transparent'" />
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">تریگر کلیکی</h3>
        <div class="sp-card">
            <KTooltip content="با کلیک باز و بسته می‌شود (روی موبایل هم کار می‌کند)" trigger="click" position="bottom">
                <KButton text="کلیک کن" />
            </KTooltip>
        </div>

        <h3 class="sp-sub">تأخیر (delay)</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; flex-wrap: wrap;">
                <KTooltip content="بدون تأخیر" :delay="0">
                    <KButton text="0ms" :bg-color="'transparent'" />
                </KTooltip>
                <KTooltip content="تأخیر پیش‌فرض ۱۵۰ms">
                    <KButton text="150ms" :bg-color="'transparent'" />
                </KTooltip>
                <KTooltip content="تأخیر ۸۰۰ms" :delay="800">
                    <KButton text="800ms" :bg-color="'transparent'" />
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">غیرفعال و بدون محتوا</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 28px; flex-wrap: wrap;">
                <KTooltip content="این هرگز دیده نمی‌شود" :disabled="true">
                    <KButton text="disabled" :bg-color="'transparent'" />
                </KTooltip>
                <KTooltip content="">
                    <KButton text="بدون محتوا" :bg-color="'transparent'" />
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">متن بلند (شکست خط)</h3>
        <div class="sp-card">
            <KTooltip
                content="این یک توضیح بسیار طولانی است که برای آزمودن عرض حداکثر توست نوشته شده و باید در چند خط شکسته شود."
                position="bottom"
            >
                <KButton text="توضیح بلند" :bg-color="'transparent'" />
            </KTooltip>
        </div>

        <h3 class="sp-sub">روی آیکون‌ها و دکمه‌های آیکونی</h3>
        <div class="sp-card">
            <div style="display: flex; gap: 20px; align-items: center;">
                <KTooltip v-for="a in actions" :key="a.label" :content="a.label" position="top">
                    <button
                        type="button"
                        style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--k-border); background: transparent; cursor: pointer; color: var(--k-text-secondary);"
                    >
                        <component :is="a.icon" :size="16" />
                    </button>
                </KTooltip>
            </div>
        </div>

        <h3 class="sp-sub">داخل جدول با اسکرول افقی (تست بریدگی)</h3>
        <div class="sp-card">
          <div style="overflow: auto; max-height: 160px; border: 1px solid var(--k-border); border-radius: 12px;">
            <table style="width: 640px; border-collapse: collapse; font-size: 0.8rem;">
                <tbody>
                    <tr v-for="r in rows" :key="r.name" style="border-bottom: 1px solid var(--k-border);">
                        <td style="padding: 10px 12px;">{{ r.name }}</td>
                        <td style="padding: 10px 12px;">{{ r.course }}</td>
                        <td style="padding: 10px 12px;">
                            <KTooltip :content="`وضعیت پرداخت: ${r.state}`" position="left">
                                <span style="border-bottom: 1px dashed var(--k-text-muted); cursor: help;">{{ r.state }}</span>
                            </KTooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
          <p class="sp-note">
            توجه: توست داخل یک ظرف با <code>overflow: auto</code> بریده می‌شود؛ چون تولتیپ موقعیت مطلق دارد
            و تلمپورت نشده. اگر لازم است، می‌توان آن را مثل KMegaMenu به هاب تلمپورت کرد.
          </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Download, Pencil, Share2, Trash2 } from 'lucide-vue-next'
import KTooltip from '../../ui-kit/components/KTooltip.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const positions = ['top', 'bottom', 'left', 'right'] as const
const sizes = ['sm', 'md', 'lg'] as const

const actions = [
    { label: 'ویرایش', icon: Pencil },
    { label: 'اشتراک‌گذاری', icon: Share2 },
    { label: 'دانلود', icon: Download },
    { label: 'حذف', icon: Trash2 },
]

const rows = [
    { name: 'سارا محمدی', course: 'مکالمه مقدماتی', state: 'پرداخت‌شده' },
    { name: 'رضا کریمی', course: 'گرامر پیشرفته', state: 'در انتظار' },
    { name: 'مینا رستمی', course: 'آیلتس فشرده', state: 'پرداخت‌شده' },
    { name: 'امیر تهرانی', course: 'کارگاه تلفظ', state: 'ناموفق' },
    { name: 'نگار احمدی', course: 'دوره کودکان', state: 'پرداخت‌شده' },
]
</script>
