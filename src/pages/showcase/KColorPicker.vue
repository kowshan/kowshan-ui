<template>
    <div class="sp">
        <h2 class="sp-title">KColorPicker</h2>
        <KColorPicker v-model="color" />
        <p class="sp-note">رنگ انتخابی: {{ color }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KColorPicker from '../../ui-kit/components/KColorPicker.vue'
const color = ref('#1db954')
</script>
