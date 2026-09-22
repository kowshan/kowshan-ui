<template>
    <div class="sp">
        <h2 class="sp-title">KAvailabilityGrid</h2>
        <KAvailabilityGrid v-model:month="month" v-model:year="year" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAvailabilityGrid from '../../ui-kit/components/KAvailabilityGrid.vue'

const month = ref(6)
const year = ref(1404)
</script>
