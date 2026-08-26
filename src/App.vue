<template>
    <div class="k-ui app-root" :data-theme="theme">
        <KGlobalLayer />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, watchEffect } from 'vue'
import KGlobalLayer from './ui-kit/components/KGlobalLayer.vue'

const theme = ref(localStorage.getItem('k-theme') || 'light')
const setTheme = (t: string) => { theme.value = t }

watchEffect(() => localStorage.setItem('k-theme', theme.value))

provide('theme', theme)
provide('setTheme', setTheme)
</script>
