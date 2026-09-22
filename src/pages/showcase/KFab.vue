<template>
    <div class="sp">
        <h2 class="sp-title">KFab</h2>

        <h3 class="sp-sub">کنترل رنگ و آیکون اصلی</h3>
        <div class="sp-row">
            <KButton text="سبز" @click="color = 'var(--k-primary, #1db954)'" />
            <KButton text="آبی" @click="color = '#3b82f6'" />
            <KButton text="بنفش" @click="color = '#8b5cf6'" />
        </div>

        <h3 class="sp-sub">با منوی اکشن یا بدون آن</h3>
        <div class="sp-row">
            <KButton :text="withActions ? 'بدون منو' : 'با منو'" @click="withActions = !withActions" />
            <span class="sp-note">آخرین اکشن: {{ act || '—' }}</span>
        </div>

        <p class="sp-note">
            FAB نسبت به صفحه (fixed) در گوشه پایین چسبیده است — همان‌طور که در اپ واقعی استفاده می‌شود.
        </p>

        <KFab
            :icon="Plus"
            :actions="withActions ? composeActions : []"
            :main-color="color"
            @action="onAction"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KFab from '../../ui-kit/components/KFab.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import { Plus, Camera, File, Mic, Image } from 'lucide-vue-next'

const act = ref('')
const color = ref('var(--k-primary, #1db954)')
const withActions = ref(true)

const composeActions = [
    { id: 'camera', label: 'دوربین', icon: Camera },
    { id: 'file', label: 'فایل', icon: File },
    { id: 'mic', label: 'صدا', icon: Mic },
    { id: 'image', label: 'تصویر', icon: Image },
]

const onAction = (id: string) => { act.value = id }
</script>

<style scoped>
.sp-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
</style>
