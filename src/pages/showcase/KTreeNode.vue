<template>
    <div class="sp">
        <h2 class="sp-title">KTreeNode</h2>
        <p class="sp-note">
            نود بازگشتی داخلی <code>KTreeView</code> — معمولاً مستقیم استفاده نمی‌شود، ولی برای
            ساختارهای سفارشی یا رندر تکی در دسترس است.
        </p>

        <h3 class="sp-sub">نود برگ — انتخاب‌شده</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="leaf" :depth="0" :expanded-keys="noExpand" :selected-key="'leaf'" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">نود برگ — انتخاب‌نشده</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="leaf" :depth="0" :expanded-keys="noExpand" :selected-key="null" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">گروه — باز و بسته می‌شود</h3>
        <p class="sp-note">
            نود فقط رویداد <code>toggle</code> می‌فرستد؛ نگه‌داشتن حالت باز/بسته کار والد است
            (همین چیزی که KTreeView انجام می‌دهد).
        </p>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="group" :depth="0" :expanded-keys="expanded" :selected-key="null" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">گروه از پیش باز با فرزند انتخاب‌شده</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="group" :depth="0" :expanded-keys="preOpened" :selected-key="'g2'" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">در عمق ۲ (تو رفتگی)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="group" :depth="2" :expanded-keys="preOpened" :selected-key="null" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">گره غیرفعال (کلیک بی‌اثر)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="disabledNode" :depth="0" :expanded-keys="noExpand" :selected-key="null" @toggle="onToggle" @select="onSelect" />
        </div>

        <h3 class="sp-sub">با نشان و آیکون</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KTreeNode :node="badgeNode" :depth="0" :expanded-keys="preOpened" :selected-key="null" @toggle="onToggle" @select="onSelect" />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            toggle: {{ lastToggle ?? '—' }} — select: {{ lastSelect ?? '—' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder, Inbox } from 'lucide-vue-next'
import KTreeNode from '../../ui-kit/components/KTreeNode.vue'
import type { KTreeNodeData } from '../../ui-kit/components/KTreeView.vue'

const leaf: KTreeNodeData = { id: 'leaf', label: 'فایل‌های من', icon: Folder }

const group: KTreeNodeData = {
    id: 'g',
    label: 'دوره‌های فعال',
    children: [
        { id: 'g1', label: 'مکالمه مقدماتی' },
        { id: 'g2', label: 'گرامر پیشرفته' },
        { id: 'g3', label: 'آیلتس فشرده' },
    ],
}

const disabledNode: KTreeNodeData = { id: 'arch', label: 'آرشیو (غیرفعال)', disabled: true }

const badgeNode: KTreeNodeData = {
    id: 'inbox',
    label: 'صندوق پیام',
    icon: Inbox,
    badge: 12,
    children: [
        { id: 'in1', label: 'خوانده‌نشده', badge: 5 },
        { id: 'in2', label: 'خوانده‌شده' },
    ],
}

const noExpand = new Set<string>()
const preOpened = new Set<string>(['g', 'inbox'])

/* the node is controlled: the page owns the open set, the node just reports toggles */
const expanded = ref(new Set<string>())

const lastToggle = ref<string | null>(null)
const lastSelect = ref<string | null>(null)

const onToggle = (id: string) => {
    const next = new Set(expanded.value)
    next.has(id) ? next.delete(id) : next.add(id)
    expanded.value = next
    lastToggle.value = id
}
const onSelect = (n: any) => { lastSelect.value = n.label }
</script>
