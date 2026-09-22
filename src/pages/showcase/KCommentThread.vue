<template>
    <div class="sp">
        <h2 class="sp-title">KCommentThread</h2>
        <KCommentThread :comments="comments" />
    </div>
</template>

<script setup lang="ts">
import KCommentThread from '../../ui-kit/components/KCommentThread.vue'
const comments: { id: string; author: string; content: string; time: string; reactions?: Record<string, number> }[] = [
    { id: 'c1', author: 'علی', content: 'خیلی عالی بود، ممنون', time: '۲ ساعت پیش', reactions: { '👍': 3, '❤️': 1 } },
    { id: 'c2', author: 'سارا', content: 'موافقم، دوره فوق‌العاده‌ای بود', time: '۱ ساعت پیش', reactions: { '👍': 2 } },
    { id: 'c3', author: 'محمد', content: 'آیا نسخه فارسی هم دارد؟', time: '۳۰ دقیقه پیش' },
]
</script>
