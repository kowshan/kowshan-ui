<template>
    <div class="sp">
        <h2 class="sp-title">KFileExplorer</h2>

        <h3 class="sp-sub">CRUD کامل — راست‌کلیک، دکمه‌های نوار ابزار، دابل‌کلیک برای تغییر نام</h3>
        <KFileExplorer
            :folders="tree"
            @crud="onCrud"
            @open="opn = $event.name"
            @select="sel = $event.name"
        />
        <p class="sp-note">
            انتخاب: {{ sel || '—' }} · باز کردن: {{ opn || '—' }} · آخرین عملیات: {{ lastCrud || '—' }}
        </p>

        <h3 class="sp-sub">حالات دیگر</h3>
        <div class="sp-row">
            <span class="sp-note">تعداد گره‌ها: {{ countNodes(tree) }}</span>
            <KButton text="ریست به حالت اولیه" @click="tree = JSON.parse(JSON.stringify(initialTree))" />
        </div>

        <h3 class="sp-sub">خالی</h3>
        <KFileExplorer :folders="[]" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KFileExplorer, { type FileItem } from '../../ui-kit/components/KFileExplorer.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const sel = ref('')
const opn = ref('')
const lastCrud = ref('')

const initialTree: FileItem[] = [
    {
        id: 'f1', name: 'پروژه‌ها', isFolder: true,
        children: [
            { id: 'file1', name: 'report.pdf', type: 'pdf', size: '۲.۴ MB', modified: '۱۴۰۴/۰۵/۲۰' },
            { id: 'file2', name: 'presentation.pptx', type: 'ppt', size: '۸.۱ MB', modified: '۱۴۰۴/۰۵/۱۸' },
            {
                id: 'f2', name: 'طرح‌ها', isFolder: true,
                children: [
                    { id: 'file3', name: 'homepage.fig', type: 'fig', size: '۱۲ MB', modified: '۱۴۰۴/۰۵/۲۲' },
                ],
            },
        ],
    },
    {
        id: 'f3', name: 'مستندات', isFolder: true,
        children: [
            { id: 'file4', name: 'api.md', type: 'md', size: '۱۸ KB', modified: '۱۴۰۴/۰۵/۱۵' },
            { id: 'file5', name: 'changelog.txt', type: 'txt', size: '۴ KB', modified: '۱۴۰۴/۰۴/۳۰' },
        ],
    },
]

const tree = ref<FileItem[]>(JSON.parse(JSON.stringify(initialTree)))

const labels: Record<string, string> = {
    create: 'ایجاد', rename: 'تغییر نام', delete: 'حذف',
}

const onCrud = (action: string, item: FileItem) => {
    lastCrud.value = `${labels[action]}: ${item.name}`
}

const countNodes = (items: FileItem[]): number =>
    items.reduce((n, i) => n + (i.children ? countNodes(i.children) : 0) + 1, 0)
</script>

<style scoped>
.sp-row { display: flex; align-items: center; gap: 12px; }
</style>
