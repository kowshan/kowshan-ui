<template>
    <div class="sp">
        <h2 class="sp-title">KPermissionTreeNode</h2>
        <p class="sp-note">
            نود بازگشتی داخلی <code>KPermissionTree</code> — معمولاً مستقیم استفاده نمی‌شود، ولی برای
            ساختارهای سفارشی قابل استفاده است.
        </p>

        <h3 class="sp-sub">نود برگ (بدون فرزند) — انتخاب‌نشده</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="leafNode"
                :depth="0"
                :checked-ids="[]"
                @toggle="onToggle"
            />
        </div>

        <h3 class="sp-sub">نود برگ — انتخاب‌شده</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="leafNode"
                :depth="0"
                :checked-ids="['users.view']"
                @toggle="onToggle"
            />
        </div>

        <h3 class="sp-sub">گروه باز — همه فرزندها انتخاب‌شده</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="groupNode"
                :depth="0"
                :checked-ids="['users', 'users.view', 'users.edit', 'users.ban']"
                @toggle="onToggle"
            />
        </div>

        <h3 class="sp-sub">گروه — حالت میانه (indeterminate)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="groupNode"
                :depth="0"
                :checked-ids="['users.view']"
                @toggle="onToggle"
            />
        </div>

        <h3 class="sp-sub">گروه غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="disabledNode"
                :depth="0"
                :checked-ids="['system.edit']"
                @toggle="onToggle"
            />
        </div>

        <h3 class="sp-sub">در عمق ۱ (تو رفتگی)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPermissionTreeNode
                :node="groupNode"
                :depth="1"
                :checked-ids="['users.view']"
                @toggle="onToggle"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            آخرین toggle: {{ lastToggle ? `${lastToggle.id} → ${lastToggle.checked ? 'فعال' : 'غیرفعال'} (${lastToggle.affect.length} مورد)` : '—' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPermissionTreeNode from '../../ui-kit/components/KPermissionTreeNode.vue'
import type { KPermissionNode } from '../../ui-kit/components/KPermissionTree.vue'

const leafNode: KPermissionNode = {
    id: 'users.view',
    label: 'مشاهده کاربران',
    hint: 'read'
}

const groupNode: KPermissionNode = {
    id: 'users',
    label: 'کاربران',
    children: [
        { id: 'users.view', label: 'مشاهده', hint: 'read' },
        { id: 'users.edit', label: 'ویرایش', hint: 'write' },
        { id: 'users.ban', label: 'مسدود کردن', hint: 'danger' },
    ]
}

const disabledNode: KPermissionNode = {
    id: 'system',
    label: 'تنظیمات سیستم',
    hint: 'فقط مالک',
    disabled: true,
    children: [
        { id: 'system.view', label: 'مشاهده' },
        { id: 'system.edit', label: 'ویرایش' },
    ]
}

const lastToggle = ref<{ id: string; checked: boolean; affect: string[] } | null>(null)

const onToggle = (payload: { id: string; checked: boolean; affect: string[] }) => {
    lastToggle.value = payload
}
</script>
