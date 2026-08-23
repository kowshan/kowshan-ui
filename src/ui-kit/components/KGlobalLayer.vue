<!-- components/KGlobalLayer.vue -->
<template>
    <!-- Global UI layer: mount once in the app layout. -->
    <KToastHost :position="position" />
    <KConfirmDialog />
</template>

<script setup lang="ts">
import KToastHost from './KToastHost.vue'
import KConfirmDialog from './KConfirmDialog.vue'

withDefaults(defineProps<{
    /** toast stack corner: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' */
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}>(), {
    position: 'bottom-left'
})
</script>
