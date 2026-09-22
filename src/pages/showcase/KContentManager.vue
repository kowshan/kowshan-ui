<template>
    <div class="sp">
        <h2 class="sp-title">KContentManager</h2>

        <h3 class="sp-sub">سازنده دوره — فصل / زیرفصل / درس (تا ۳ سطح)</h3>
        <KContentManager
            :chapters="course"
            chapters-label="فصل"
            :max-depth="3"
            @crud="onCrud"
            @select="sel = $event.name"
        />
        <p class="sp-note">
            انتخاب: {{ sel || '—' }} · آخرین عملیات: {{ lastCrud || '—' }}
        </p>
        <p class="sp-note">
            راهنما: «+» فصل جدید می‌سازد · آیکون کنارش زیرفصل داخل فصل انتخابی ·
            در نوار محتوا، پوشه/فایل داخل فصل باز ساخته می‌شود · راست‌کلیک روی هر آیتم
        </p>

        <h3 class="sp-sub">خالی</h3>
        <KContentManager :chapters="[]" chapters-label="بخش" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KContentManager, { type ContentItem } from '../../ui-kit/components/KContentManager.vue'

const sel = ref('')
const lastCrud = ref('')

const labels: Record<string, string> = {
    create: 'ایجاد', rename: 'تغییر نام', delete: 'حذف',
}

const onCrud = (action: string, item: ContentItem) => {
    lastCrud.value = `${labels[action]}: ${item.name}`
}

const course: ContentItem[] = [
    {
        id: 'ch1', name: 'مقدمات Vue 3', isFolder: true,
        children: [
            { id: 'l1', name: 'نصب و راه‌اندازی.mp4', duration: '۱۲:۳۰' },
            { id: 'l2', name: 'ساختار پروژه.mp4', duration: '۰۸:۴۵' },
            {
                id: 'ch1-1', name: 'تمرین‌ها', isFolder: true,
                children: [
                    { id: 'l3', name: 'تمرین ۱ — کامپوننت.pdf', duration: '۰۵:۰۰' },
                ],
            },
        ],
    },
    {
        id: 'ch2', name: 'Composition API', isFolder: true,
        children: [
            { id: 'l4', name: 'ref و reactive.mp4', duration: '۱۵:۲۰' },
            { id: 'l5', name: 'کوئیز فصل ۲.pdf' },
        ],
    },
]
</script>
