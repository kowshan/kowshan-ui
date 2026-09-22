<template>
    <div class="sp">
        <h2 class="sp-title">KBottomSheet</h2>
        <KButton label="باز کردن" @click="show = true" />
        <KBottomSheet v-model:visible="show" title="برگزیده‌ها">
            <p style="padding:16px">محتوای شیت پایینی اینجاست</p>
        </KBottomSheet>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KBottomSheet from '../../ui-kit/components/KBottomSheet.vue'
import KButton from '../../ui-kit/components/KButton.vue'
const show = ref(false)
</script>
