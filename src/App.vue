<template>
    <div class="k-ui app-root" :data-theme="theme" :style="accentStyle">
        <KTeleportHub />
        <KGlobalLayer />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watchEffect } from 'vue'
import KGlobalLayer from './ui-kit/components/KGlobalLayer.vue'
import KTeleportHub from './ui-kit/components/KTeleportHub.vue'

const theme = ref(localStorage.getItem('k-theme') || 'light')
const setTheme = (t: string) => { theme.value = t }

watchEffect(() => localStorage.setItem('k-theme', theme.value))

// Brand swatches in the header write `--k-primary` here, on the theme root — every other
// brand token (hover, light tint, focus ring, info, focus shadow) is derived from it in CSS,
// so one inline variable re-themes the whole showcase, teleported layers included.
const accent = ref('')
const accentStyle = computed(() => (accent.value ? { '--k-primary': accent.value } : undefined))
const setAccent = (c: string) => { accent.value = c }

provide('theme', theme)
provide('setTheme', setTheme)
provide('accent', accent)
provide('setAccent', setAccent)
</script>
