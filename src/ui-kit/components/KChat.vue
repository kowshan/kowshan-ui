<!-- KChat.vue — chat with reversed positions: others=left, own=right -->
<template>
    <div class="k-chat">
        <!-- ═══ Channel sidebar ═══ -->
        <div class="k-chat-sidebar" :class="{ 'is-open': sidebarOpen }">
            <div class="k-chat-sidebar-head">
                <h3 class="k-chat-sidebar-title">پیام‌ها</h3>
                <span class="k-chat-sidebar-count">{{ onlineCount }} آنلاین</span>
            </div>
            <div class="k-chat-channels">
                <button
                    v-for="ch in channels"
                    :key="ch.id"
                    class="k-chat-channel"
                    :class="{ 'is-active': ch.id === activeChannelId, 'is-unread': ch.unreadCount > 0 }"
                    @click="selectChannel(ch.id)"
                >
                    <div class="k-chat-channel-avatar">
                        <img v-if="ch.avatar" :src="ch.avatar" />
                        <span v-else class="k-chat-channel-icon">
                            <Users :size="16" />
                        </span>
                        <KPresenceIndicator
                            v-if="ch.type === 'direct'"
                            :status="getUserStatus(ch)"
                            class="k-chat-channel-presence"
                        />
                    </div>
                    <div class="k-chat-channel-info">
                        <div class="k-chat-channel-top">
                            <span class="k-chat-channel-name">{{ ch.name }}</span>
                            <span v-if="ch.lastMessageTime" class="k-chat-channel-time">{{ formatTime(ch.lastMessageTime) }}</span>
                        </div>
                        <div class="k-chat-channel-bottom">
                            <span class="k-chat-channel-preview">{{ ch.lastMessage || 'شروع مکالمه' }}</span>
                            <span v-if="ch.unreadCount" class="k-chat-channel-badge">{{ ch.unreadCount }}</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- ═══ Backdrop ═══ -->
        <div v-if="sidebarOpen" class="k-chat-backdrop" @click="sidebarOpen = false" />

        <!-- ═══ Chat area ═══ -->
        <div class="k-chat-main">
            <!-- Header -->
            <div class="k-chat-header">
                <button class="k-chat-menu-btn" @click="sidebarOpen = !sidebarOpen">
                    <Menu :size="18" />
                </button>
                <div class="k-chat-header-info">
                    <h4 class="k-chat-header-name">{{ activeChannel?.name || '' }}</h4>
                    <span v-if="activeChannel?.type === 'group'" class="k-chat-header-sub">
                        {{ activeChannel.members.length }} عضو
                    </span>
                    <span v-else class="k-chat-header-sub" :class="`is-${getUserStatus(activeChannel)}`">
                        {{ statusLabel(getUserStatus(activeChannel)) }}
                    </span>
                </div>
                <div class="k-chat-header-actions">
                    <button class="k-chat-header-btn" title="Search">
                        <Search :size="16" />
                    </button>
                    <button class="k-chat-header-btn" title="Call">
                        <Phone :size="16" />
                    </button>
                    <button class="k-chat-header-btn" title="More">
                        <MoreVertical :size="16" />
                    </button>
                </div>
            </div>

            <!-- Messages -->
            <div ref="messagesEl" class="k-chat-messages">
                <div v-if="!messages.length" class="k-chat-empty">
                    <MessageSquare :size="40" />
                    <p>No messages yet</p>
                    <span>Send the first message</span>
                </div>
                <template v-for="(msg, i) in messages" :key="msg.id">
                    <!-- Date separator -->
                    <div v-if="showDateSep(msg, i)" class="k-chat-date">
                        <span>{{ formatDate(msg.timestamp) }}</span>
                    </div>
                    <!-- Message: others=LEFT, own=RIGHT -->
                    <div
                        class="k-chat-msg"
                        :class="{ 'is-own': msg.senderId === userId, 'is-pending': msg.pending }"
                    >
                        <img
                            v-if="msg.senderAvatar && msg.senderId !== userId"
                            :src="msg.senderAvatar"
                            class="k-chat-msg-avatar"
                        />
                        <div class="k-chat-msg-body">
                            <span v-if="msg.senderId !== userId && showSender(msg, i)" class="k-chat-msg-sender">
                                {{ msg.senderName }}
                            </span>
                            <div class="k-chat-msg-bubble">
                                <p class="k-chat-msg-text">{{ msg.content }}</p>
                                <span class="k-chat-msg-time">{{ formatMsgTime(msg.timestamp) }}</span>
                                <!-- Reactions inside bubble (Telegram style) -->
                                <div v-if="msg.reactions && Object.keys(msg.reactions).length" class="k-chat-msg-reactions">
                                    <button
                                        v-for="(users, emoji) in msg.reactions"
                                        :key="emoji"
                                        class="k-chat-reaction"
                                        :class="{ 'is-mine': users.includes(userId) }"
                                        @click="$emit('reaction', { messageId: msg.id, emoji: emoji as string })"
                                    >
                                        <span class="k-chat-reaction-emoji">{{ emoji }}</span>
                                        <span class="k-chat-reaction-count">{{ users.length }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Typing -->
                <KTypingIndicator
                    v-if="typingInChannel.length"
                    :name="typingNames"
                    class="k-chat-typing"
                />
            </div>

            <!-- Input -->
            <div class="k-chat-input-wrap">
                <KChatInput
                    placeholder="Type a message..."
                    @send="onSend"
                    @typing="onTyping"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { Users, Menu, Search, Phone, MoreVertical, MessageSquare } from 'lucide-vue-next'
import KPresenceIndicator from './KPresenceIndicator.vue'
import KTypingIndicator from './KTypingIndicator.vue'
import KChatInput from './KChatInput.vue'
import type { ChatChannel, ChatMessage, TypingUser, ChatUser } from '../composables/useChat'

const props = withDefaults(defineProps<{
    userId?: string
    channels: ChatChannel[]
    activeChannelId: string
    messages: ChatMessage[]
    typingUsers?: TypingUser[]
    users?: ChatUser[]
}>(), {
    userId: 'user-1',
    typingUsers: () => [],
    users: () => [],
})

const emit = defineEmits<{
    'select-channel': [id: string]
    'send': [text: string]
    'typing': []
    'reaction': [payload: { messageId: string; emoji: string }]
}>()

const messagesEl = ref<HTMLElement>()
const sidebarOpen = ref(false)

const activeChannel = computed(() => props.channels.find(c => c.id === props.activeChannelId))
const onlineCount = computed(() => props.users.filter(u => u.status === 'online').length)

const typingInChannel = computed(() =>
    props.typingUsers.filter(t => t.channelId === props.activeChannelId)
)
const typingNames = computed(() => {
    const names = typingInChannel.value.map(t => t.name)
    if (names.length === 1) return names[0]
    if (names.length === 2) return `${names[0]} and ${names[1]}`
    return `${names[0]} and ${names.length - 1} others`
})

const selectChannel = (id: string) => {
    emit('select-channel', id)
    sidebarOpen.value = false
}

const onSend = (text: string) => emit('send', text)
const onTyping = () => emit('typing')

const getUserStatus = (ch: ChatChannel | undefined): ChatUser['status'] => {
    if (!ch || ch.type === 'group') return 'offline'
    const otherId = ch.members.find(m => m !== props.userId)
    const user = props.users.find(u => u.id === otherId)
    return user?.status || 'offline'
}

const statusLabel = (s: string) => {
    const labels: Record<string, string> = { online: 'آنلاین', offline: 'آفلاین', away: 'غایب', busy: 'مشغول' }
    return labels[s] || s
}

const showSender = (msg: ChatMessage, i: number) => {
    if (i === 0) return true
    const prev = props.messages[i - 1]
    return prev.senderId !== msg.senderId || (msg.timestamp - prev.timestamp > 300000)
}

const showDateSep = (msg: ChatMessage, i: number) => {
    if (i === 0) return true
    const prev = props.messages[i - 1]
    return new Date(msg.timestamp).toDateString() !== new Date(prev.timestamp).toDateString()
}

const formatTime = (ts: number) => {
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

const formatMsgTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' })
}

// Auto-scroll to bottom
watch(() => props.messages.length, () => {
    nextTick(() => {
        if (messagesEl.value) {
            messagesEl.value.scrollTop = messagesEl.value.scrollHeight
        }
    })
})
</script>

<style scoped>
.k-chat {
    display: flex;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 16px;
    overflow: hidden;
    background: var(--k-bg, #fff);
    height: 500px;
}

/* ═══ Sidebar ═══ */
.k-chat-sidebar {
    width: 280px;
    border-inline-end: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: var(--k-surface, #f8fafc);
}
.k-chat-sidebar-head {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}
.k-chat-sidebar-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--k-text-primary);
}
.k-chat-sidebar-count {
    font-size: 0.62rem;
    font-weight: 600;
    color: #22c55e;
    background: color-mix(in srgb, #22c55e 10%, transparent);
    padding: 2px 8px;
    border-radius: 10px;
}
.k-chat-channels {
    flex: 1;
    overflow-y: auto;
    padding: 6px;
}
.k-chat-channel {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: none;
    background: none;
    width: 100%;
    border-radius: 12px;
    cursor: pointer;
    text-align: start;
    transition: background 0.12s;
    font-family: inherit;
}
.k-chat-channel:hover { background: var(--k-bg, #fff); }
.k-chat-channel.is-active {
    background: var(--k-bg, #fff);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.k-chat-channel-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    overflow: visible;
    flex-shrink: 0;
}
.k-chat-channel-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
}
.k-chat-channel-icon {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: var(--k-primary-light);
    color: var(--k-primary);
    display: flex;
    align-items: center;
    justify-content: center;
}
.k-chat-channel-presence {
    position: absolute;
    bottom: -1px;
    right: -1px;
}
.k-chat-channel-info { flex: 1; min-width: 0; }
.k-chat-channel-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
}
.k-chat-channel-name {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.k-chat-channel-time {
    font-size: 0.58rem;
    color: var(--k-text-muted);
    flex-shrink: 0;
    direction: ltr;
}
.k-chat-channel-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
}
.k-chat-channel-preview {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}
.k-chat-channel-badge {
    font-size: 0.56rem;
    font-weight: 800;
    background: var(--k-primary, #1db954);
    color: #fff;
    padding: 1px 6px;
    border-radius: 8px;
    flex-shrink: 0;
    direction: ltr;
}

/* ═══ Main ═══ */
.k-chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.k-chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    flex-shrink: 0;
}
.k-chat-menu-btn {
    display: none;
    border: none;
    background: none;
    color: var(--k-text-secondary);
    cursor: pointer;
    padding: 4px;
}
.k-chat-header-info { flex: 1; min-width: 0; }
.k-chat-header-name {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--k-text-primary);
}
.k-chat-header-sub {
    font-size: 0.64rem;
    color: var(--k-text-muted);
}
.k-chat-header-sub.is-online { color: #22c55e; }
.k-chat-header-actions { display: flex; gap: 4px; }
.k-chat-header-btn {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    transition: all 0.12s;
}
.k-chat-header-btn:hover { background: var(--k-surface-hover); color: var(--k-text-secondary); }

/* ═══ Messages ═══ */
.k-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.k-chat-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--k-text-muted);
}
.k-chat-empty p { margin: 0; font-size: 0.85rem; font-weight: 600; }
.k-chat-empty span { font-size: 0.72rem; }
.k-chat-date {
    text-align: center;
    padding: 12px 0;
}
.k-chat-date span {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-text-muted);
    background: var(--k-surface, #f8fafc);
    padding: 3px 10px;
    border-radius: 10px;
}

/* ── Messages layout: others=LEFT, own=RIGHT (RTL) ── */
.k-chat-msg {
    display: flex;
    gap: 8px;
    max-width: 75%;
    align-items: flex-end;
}
/* Own: RIGHT side */
.k-chat-msg.is-own {
    flex-direction: row-reverse;
    margin-left: auto;
}
/* Others: LEFT side */
.k-chat-msg:not(.is-own) {
    margin-right: auto;
}
.k-chat-msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}
.k-chat-msg-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.k-chat-msg-sender {
    font-size: 0.62rem;
    font-weight: 700;
    color: var(--k-text-secondary);
    padding-inline-start: 4px;
}

/* ── Bubbles ── */
.k-chat-msg-bubble {
    padding: 8px 12px;
    border-radius: 14px;
    background: var(--k-surface, #f1f5f9);
    position: relative;
}
/* Own (RIGHT side): tail bottom-right */
.k-chat-msg.is-own .k-chat-msg-bubble {
    background: var(--k-primary, #1db954);
    color: #fff;
    border-bottom-right-radius: 4px;
}
/* Others (LEFT side): tail bottom-left */
.k-chat-msg:not(.is-own) .k-chat-msg-bubble {
    border-bottom-left-radius: 4px;
}
.k-chat-msg-text {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.5;
    word-break: break-word;
}
.k-chat-msg-time {
    font-size: 0.56rem;
    opacity: 0.6;
    display: block;
    margin-top: 2px;
    text-align: end;
}
.k-chat-msg.is-pending { opacity: 0.6; }

/* ── Reactions: inside bubble, Telegram style ── */
.k-chat-msg-reactions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
    justify-content: flex-start;
}
/* Own (right side) */
.k-chat-msg.is-own .k-chat-msg-reactions {
    justify-content: flex-end;
}
/* Others (left side) */
.k-chat-msg:not(.is-own) .k-chat-msg-reactions {
    justify-content: flex-start;
}
.k-chat-reaction {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 12px;
    padding: 4px 10px;
    font-size: 0.68rem;
    cursor: pointer;
    transition: all 0.12s ease;
    line-height: 1;
}
.k-chat-reaction:hover {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light);
}
.k-chat-reaction.is-mine {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light);
}
.k-chat-reaction-emoji {
    font-size: 0.78rem;
    line-height: 1;
}
.k-chat-reaction-count {
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--k-text-primary);
    direction: ltr;
    padding-inline-start: 2px;
}
.k-chat-reaction.is-mine .k-chat-reaction-count {
    color: var(--k-primary, #1db954);
}
.k-chat-typing {
    padding: 0 4px;
}

/* ═══ Input ═══ */
.k-chat-input-wrap {
    padding: 12px 16px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
    .k-chat-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        width: 280px;
        background: var(--k-bg, #fff);
    }
    .k-chat-sidebar.is-open { transform: translateX(0); }
    .k-chat-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.3);
        z-index: 90;
    }
    .k-chat-menu-btn { display: flex; }
}
</style>
