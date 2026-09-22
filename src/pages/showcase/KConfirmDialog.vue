<template>
    <div class="sp">
        <h2 class="sp-title">KConfirmDialog</h2>
        <KButton label="نمایش تأییدیه" @click="showConfirm" />
    </div>
</template>

<script setup lang="ts">
import KButton from '../../ui-kit/components/KButton.vue'
import { useModalStore } from '../../ui-kit/stores/modalStore'
const modal = useModalStore()
const showConfirm = async () => {
    const ok = await modal.confirm({ title: 'حذف', message: 'آیا مطمئن هستید؟', confirmText: 'حذف', variant: 'danger' })
    if (ok) alert('تأیید شد')
}
</script>
