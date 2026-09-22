<template>
    <div class="sp">
        <h2 class="sp-title">KIconButton</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-row">
            <KIconButton :icon="Heart" />
            <KIconButton :icon="Trash2" />
            <KIconButton :icon="Settings" />
            <KIconButton :icon="Download" />
        </div>

        <h3 class="sp-sub">رنگ‌ها</h3>
        <div class="sp-row">
            <KIconButton :icon="Heart" bg-color="#ef4444" text-color="#fff" />
            <KIconButton :icon="Check" bg-color="#22c55e" text-color="#fff" />
            <KIconButton :icon="Info" bg-color="#3b82f6" text-color="#fff" />
            <KIconButton :icon="Bell" bg-color="#8B5CF6" text-color="#fff" />
            <KIconButton :icon="Star" bg-color="#f59e0b" text-color="#fff" />
            <KIconButton :icon="Heart" bg-color="transparent" text-color="#ef4444" />
        </div>

        <h3 class="sp-sub">حاشیه</h3>
        <div class="sp-row">
            <KIconButton :icon="Download" border="solid" border-color="var(--k-border)" />
            <KIconButton :icon="Download" border="dashed" border-color="#8B5CF6" text-color="#8B5CF6" />
            <KIconButton :icon="Download" border="none" bg-color="var(--k-surface-hover)" />
        </div>

        <h3 class="sp-sub">سایه</h3>
        <div class="sp-row">
            <KIconButton :icon="Bell" :shadow="true" bg-color="#fff" text-color="#111" />
            <KIconButton :icon="Bell" :shadow="true" shadow-color="rgba(139,92,246,.6)" bg-color="#8B5CF6" text-color="#fff" />
        </div>

        <h3 class="sp-sub">اندازه و شکل</h3>
        <div class="sp-row" style="align-items: center;">
            <KIconButton :icon="Heart" width="32px" height="32px" border-radius="8px" />
            <KIconButton :icon="Heart" width="44px" height="44px" border-radius="12px" />
            <KIconButton :icon="Heart" width="56px" height="56px" border-radius="50%" />
            <KIconButton :icon="Heart" width="72px" height="40px" border-radius="20px" />
        </div>

        <h3 class="sp-sub">حالت‌ها</h3>
        <div class="sp-row">
            <KIconButton :icon="Save" :loading="true" />
            <KIconButton :icon="Save" :disabled="true" />
            <KIconButton :icon="Save" tooltip="ذخیره تغییرات" />
            <span class="sp-vmodel">کلیک‌ها: {{ clicks }}</span>
        </div>

        <h3 class="sp-sub">درون نوار ابزار</h3>
        <div class="sp-card" style="display: inline-flex; gap: 6px; padding: 8px; border-radius: 12px;">
            <KIconButton :icon="Pencil" width="30px" height="30px" border-radius="8px" tooltip="ویرایش" />
            <KIconButton :icon="Copy" width="30px" height="30px" border-radius="8px" tooltip="کپی" />
            <KIconButton :icon="Share2" width="30px" height="30px" border-radius="8px" tooltip="اشتراک" />
            <KIconButton :icon="Trash2" width="30px" height="30px" border-radius="8px" tooltip="حذف" text-color="#ef4444" @click="clicks++" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KIconButton from '../../ui-kit/components/KIconButton.vue'
import {
    Heart, Trash2, Settings, Download, Check, Info, Bell, Star,
    Save, Pencil, Copy, Share2,
} from 'lucide-vue-next'

const clicks = ref(0)
</script>
