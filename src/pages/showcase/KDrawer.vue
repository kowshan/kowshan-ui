<template>
    <div class="sp">
        <h2 class="sp-title">KDrawer</h2>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-row">
            <KButton text="کوچک (sm)" @click="open('sm')" />
            <KButton text="متوسط (md)" @click="open('md')" />
            <KButton text="بزرگ (lg)" @click="open('lg')" />
        </div>

        <h3 class="sp-sub">سمت باز شدن</h3>
        <div class="sp-row">
            <KButton text="از راست (rtl)" @click="openSide('rtl')" />
            <KButton text="از چپ (ltr)" @click="openSide('ltr')" />
        </div>

        <h3 class="sp-sub">بدون دکمه بستن / بدون بستن با کلیک بیرون</h3>
        <div class="sp-row">
            <KButton text="بدون بستن" @click="openLocked()" />
        </div>

        <KDrawer
            v-model:visible="visible"
            :title="title"
            :size="size"
            :direction="direction"
            :closable="closable"
            :close-on-overlay="closeOnOverlay"
            @open="lastEvent = 'باز شد'"
            @close="lastEvent = 'بسته شد'"
        >
            <div class="drawer-body">
                <p>این محتوای کشویی است. کامپوننت‌های داخل آن به theme و فونت خودکار دسترسی دارند.</p>
                <KTextInput v-model="name" label="یک ورودی داخل کشویی" />
                <KButton text="بستن" @click="visible = false" />
            </div>
        </KDrawer>

        <p class="sp-note">آخرین رویداد: {{ lastEvent || '—' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KDrawer from '../../ui-kit/components/KDrawer.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'

const visible = ref(false)
const size = ref<'sm' | 'md' | 'lg'>('md')
const direction = ref<'rtl' | 'ltr'>('rtl')
const closable = ref(true)
const closeOnOverlay = ref(true)
const title = ref('کشویی')
const name = ref('')
const lastEvent = ref('')

const open = (s: 'sm' | 'md' | 'lg') => {
    size.value = s
    direction.value = 'rtl'
    closable.value = true
    closeOnOverlay.value = true
    title.value = `کشویی ${s}`
    visible.value = true
}

const openSide = (d: 'rtl' | 'ltr') => {
    direction.value = d
    size.value = 'md'
    closable.value = true
    closeOnOverlay.value = true
    title.value = d === 'rtl' ? 'از راست' : 'از چپ'
    visible.value = true
}

const openLocked = () => {
    closable.value = false
    closeOnOverlay.value = false
    size.value = 'md'
    title.value = 'بدون بستن'
    visible.value = true
}
</script>

<style scoped>
.sp-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.drawer-body { display: flex; flex-direction: column; gap: 14px; }
</style>
