<template>
    <div class="sp">
        <h2 class="sp-title">KContextMenu</h2>
        <p class="sp-note">
            منوی کلیک راست روی هر عنصری که در اسلات پیش‌فرض بگذارید. آیتم‌ها
            <code>{'{ id, label, icon, danger?, disabled?, divider? }'}</code> هستند —
            <b>icon یک کامپوننت است، نه رشته</b> (مثل <code>:icon="Pencil"</code>)، وگرنه
            پاس دادن نام به‌صورت رشته چیزی رندر نمی‌کند.
            منو به <code>#k-teleport-hub</code> پورتال می‌شود، پس هیچ‌وقت زیر والدِ
            <code>overflow: hidden</code> گیر نمی‌کند و لبه‌های صفحه هم کلمپ می‌شود.
        </p>

        <h3 class="sp-sub">منوی کامل — آیکن، جداکننده، غیرفعال، خطرناک</h3>
        <KContextMenu :items="fileMenu" @select="onSelect" @open="log = 'open'" @close="log = 'close'">
            <div class="cm-target">
                روی این کارت کلیک راست کنید
                <span class="cm-hint">فایل گزارش-۱۴۰۴.pdf</span>
            </div>
        </KContextMenu>
        <p class="sp-note">آخرین رویداد: <b>{{ log || '—' }}</b> · آخرین انتخاب: <b>{{ picked || '—' }}</b></p>

        <h3 class="sp-sub">بدون آیکن (فقط متن)</h3>
        <KContextMenu :items="textMenu" @select="onSelect">
            <div class="cm-target">
                منوی متنی
                <span class="cm-hint">کلیک راست</span>
            </div>
        </KContextMenu>

        <h3 class="sp-sub">هر آیتم روی هدف خودش — گرید تصاویر</h3>
        <p class="sp-note">
            هر <code>KContextMenu</code> منوی خودش را دارد؛ در لیست‌ها و گریدها همین الگو را
            استفاده کنید تا آیتم درست انتخاب شود.
        </p>
        <div class="cm-grid">
            <KContextMenu v-for="i in 6" :key="i" :items="thumbMenu(i)" @select="onSelect">
                <div class="cm-thumb">{{ i }}</div>
            </KContextMenu>
        </div>

        <h3 class="sp-sub">همه آیتم‌ها غیرفعال</h3>
        <KContextMenu :items="disabledMenu" @select="onSelect">
            <div class="cm-target cm-locked">
                قفل‌شده — هیچ آیتمی قابل کلیک نیست
                <span class="cm-hint">کلیک راست</span>
            </div>
        </KContextMenu>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Download, Eye, Link, Pencil, Share2, Star, Trash2 } from 'lucide-vue-next'
import KContextMenu from '../../ui-kit/components/KContextMenu.vue'

const log = ref('')
const picked = ref('')

const onSelect = (id: string) => { picked.value = id }

const fileMenu = [
    { id: 'open', label: 'باز کردن', icon: Eye },
    { id: 'rename', label: 'تغییر نام', icon: Pencil },
    { id: 'copy', label: 'کپی', icon: Copy },
    { divider: true },
    { id: 'share', label: 'اشتراک‌گذاری', icon: Share2 },
    { id: 'download', label: 'دانلود', icon: Download, disabled: true },
    { divider: true },
    { id: 'star', label: 'افزودن به برگزیده', icon: Star },
    { id: 'delete', label: 'حذف', icon: Trash2, danger: true },
]

const textMenu = [
    { id: 'preview', label: 'پیش‌نمایش' },
    { id: 'duplicate', label: 'تکثیر' },
    { divider: true },
    { id: 'remove', label: 'حذف', danger: true },
]

/** per-item menu — one menu instance per target, so the right row answers */
const thumbMenu = (i: number) => [
    { id: `view-${i}`, label: 'نمایش', icon: Eye },
    { id: `copy-${i}`, label: 'کپی لینک', icon: Link },
    { divider: true },
    { id: `del-${i}`, label: 'حذف', icon: Trash2, danger: true },
]

const disabledMenu = [
    { id: 'a', label: 'نیازمند دسترسی مدیر', disabled: true },
    { id: 'b', label: 'ابتدا وارد شوید', disabled: true },
]
</script>

<style scoped>
.cm-target {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 22px 18px;
    border: 1px dashed var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    color: var(--k-text-primary);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: context-menu;
    user-select: none;
}
.cm-hint {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--k-text-muted);
}
.cm-locked {
    opacity: 0.6;
}
.cm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 10px;
}
.cm-thumb {
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface-hover);
    color: var(--k-text-muted);
    font-size: 1.4rem;
    font-weight: 800;
    cursor: context-menu;
    user-select: none;
}
</style>
