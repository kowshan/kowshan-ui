<template>
    <div class="sp">
        <h2 class="sp-title">KEmojiPicker</h2>

        <h3 class="sp-sub">پایه — تک انتخاب</h3>
        <div class="sp-row">
            <div class="picker-box">
                <KEmojiPicker @select="onSelect" @done="onDone" />
            </div>
            <div class="picked">
                <span class="sp-note">انتخاب‌شده:</span>
                <span class="emoji-big">{{ single || '—' }}</span>
            </div>
        </div>

        <h3 class="sp-sub">حالت چندتایی (multiple)</h3>
        <div class="sp-row">
            <div class="picker-box">
                <KEmojiPicker :multiple="true" @select="onSelect" @done="onDone" />
            </div>
            <div class="picked">
                <span class="sp-note">کلیک کن و «تمام» را بزن:</span>
                <span class="emoji-big">{{ multi.join(' ') || '—' }}</span>
                <KButton text="پاک کردن" @click="multi = []" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KEmojiPicker from '../../ui-kit/components/KEmojiPicker.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const single = ref('')
const multi = ref<string[]>([])

const onSelect = (emoji: string) => {
    single.value = emoji
}
const onDone = (emojis: string[]) => {
    multi.value = emojis
}
</script>

<style scoped>
.sp-row { display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
.picker-box {
    width: 340px;
    border: 1px solid var(--k-border);
    border-radius: 12px;
    overflow: hidden;
}
.picked { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.emoji-big { font-size: 1.6rem; line-height: 1.2; }
</style>
