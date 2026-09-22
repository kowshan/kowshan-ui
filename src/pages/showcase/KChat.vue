<template>
    <div class="sp">
        <h2 class="sp-title">KChat</h2>
        <div style="height:400px">
            <KChat :channels="channels" active-channel-id="ch1" :messages="messages" user-id="u1" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KChat from '../../ui-kit/components/KChat.vue'
const channels = [
    { id: 'ch1', name: 'گروه عمومی', type: 'group' as const, unreadCount: 0, members: ['u1', 'u2', 'u3'] },
]
const messages = [
    { id: '1', channelId: 'ch1', senderId: 'u1', senderName: 'علی', content: 'سلام، حالت چطوره؟', type: 'text' as const, timestamp: Date.now() - 300000 },
    { id: '2', channelId: 'ch1', senderId: 'u2', senderName: 'سارا', content: 'ممنون، خوبم! تو چطوری؟', type: 'text' as const, timestamp: Date.now() - 240000 },
    { id: '3', channelId: 'ch1', senderId: 'u1', senderName: 'علی', content: 'خوبم مرسی 🎉', type: 'text' as const, timestamp: Date.now() - 180000 },
]
</script>
