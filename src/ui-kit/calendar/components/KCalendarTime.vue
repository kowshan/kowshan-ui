<template>
    <div class="time-container" :key="currentTime">
        {{ currentTime }}
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

const currentTime = ref<string>('')
let intervalId: ReturnType<typeof setInterval> | null = null

function updateTime() {
    const now = new Date()
    currentTime.value = new Intl.DateTimeFormat("fa-IR", {
        calendar: "persian",
        timeZone: "Asia/Tehran",
        timeStyle: "full",
        dateStyle: "full"
    }).format(now)
}

updateTime()
intervalId = setInterval(updateTime, 1000)

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.time-container {
    position: relative;
}
</style>
