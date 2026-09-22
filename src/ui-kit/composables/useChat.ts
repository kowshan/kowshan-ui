// composables/useChat.ts
// WebSocket-ready chat composable with mock data fallback.
// Replace the mock transport with a real WebSocket/Socket.IO transport in production.

import { ref, reactive, computed, onUnmounted, watch, type Ref } from 'vue'

/* ══════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════ */

export interface ChatMessage {
    id: string
    channelId: string
    senderId: string
    senderName: string
    senderAvatar?: string
    content: string
    timestamp: number
    type: 'text' | 'image' | 'file' | 'system'
    replyTo?: string
    reactions?: Record<string, string[]>  // emoji → userId[]
    readBy?: string[]
    pending?: boolean
    failed?: boolean
}

export interface ChatChannel {
    id: string
    name: string
    type: 'direct' | 'group'
    avatar?: string
    lastMessage?: string
    lastMessageTime?: number
    unreadCount: number
    members: string[]
    pinned?: boolean
}

export interface ChatUser {
    id: string
    name: string
    avatar?: string
    status: 'online' | 'offline' | 'away' | 'busy'
    lastSeen?: number
}

export interface TypingUser {
    userId: string
    name: string
    channelId: string
    timeout?: ReturnType<typeof setTimeout>
}

export interface ChatOptions {
    /** Current user ID */
    userId: string
    /** WebSocket URL (if null, uses mock transport) */
    wsUrl?: string
    /** Reconnect delay in ms */
    reconnectDelay?: number
    /** Max reconnect attempts */
    maxReconnects?: number
}

export interface ChatTransport {
    connect: () => void
    disconnect: () => void
    send: (type: string, payload: any) => void
    on: (type: string, handler: (payload: any) => void) => void
    off: (type: string, handler: (payload: any) => void) => void
}

/* ══════════════════════════════════════════════════════
   Mock Transport (for demo/development)
   ══════════════════════════════════════════════════════ */

function createMockTransport(): ChatTransport {
    const handlers: Record<string, ((payload: any) => void)[]> = {}

    const emit = (type: string, payload: any) => {
        (handlers[type] || []).forEach(h => h(payload))
    }

    // Simulate incoming messages periodically
    let interval: ReturnType<typeof setInterval> | null = null

    const mockMessages = [
        { sender: 'user-2', name: 'سارا کریمی', content: 'سلام! نتیجه آزمایش آماده شد' },
        { sender: 'user-3', name: 'محمد حسینی', content: 'جلسه فردا ساعت ۱۰ برگزار می‌شود' },
        { sender: 'user-4', name: 'زهرا نوری', content: 'فایل گزارش ماهانه رو آپلود کردم' },
        { sender: 'user-2', name: 'سارا کریمی', content: 'کد پیگیری سند: PR-1405-۲۱۸' },
        { sender: 'user-5', name: 'امیر کاظمی', content: 'ددلاین پروژه تمدید شد — تا ۱۵ شهریور' },
    ]
    let msgIndex = 0

    return {
        connect: () => {
            emit('connected', { userId: 'user-1' })
            // Simulate periodic typing + messages
            interval = setInterval(() => {
                if (Math.random() > 0.6) {
                    const mock = mockMessages[msgIndex % mockMessages.length]
                    emit('typing', { userId: mock.sender, name: mock.name, channelId: 'ch-1' })
                    setTimeout(() => {
                        emit('message', {
                            id: `msg-${Date.now()}`,
                            channelId: 'ch-1',
                            senderId: mock.sender,
                            senderName: mock.name,
                            content: mock.content,
                            timestamp: Date.now(),
                            type: 'text',
                            readBy: [mock.sender],
                        })
                        emit('typing-stop', { userId: mock.sender, channelId: 'ch-1' })
                        msgIndex++
                    }, 1500 + Math.random() * 2000)
                }
            }, 8000 + Math.random() * 5000)
        },
        disconnect: () => {
            if (interval) clearInterval(interval)
            emit('disconnected', {})
        },
        send: (type: string, payload: any) => {
            // Echo back for mock
            setTimeout(() => {
                if (type === 'message') {
                    emit('message-sent', { ...payload, id: `sent-${Date.now()}` })
                } else if (type === 'typing') {
                    // No-op for mock
                }
            }, 100)
        },
        on: (type: string, handler: (payload: any) => void) => {
            if (!handlers[type]) handlers[type] = []
            handlers[type].push(handler)
        },
        off: (type: string, handler: (payload: any) => void) => {
            handlers[type] = (handlers[type] || []).filter(h => h !== handler)
        },
    }
}

/* ══════════════════════════════════════════════════════
   WebSocket Transport (for production)
   ══════════════════════════════════════════════════════ */

function createWSTransport(url: string): ChatTransport {
    let ws: WebSocket | null = null
    const handlers: Record<string, ((payload: any) => void)[]> = {}
    let reconnects = 0
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const emit = (type: string, payload: any) => {
        (handlers[type] || []).forEach(h => h(payload))
    }

    const connect = () => {
        ws = new WebSocket(url)
        ws.onopen = () => { reconnects = 0; emit('connected', {}) }
        ws.onclose = () => {
            emit('disconnected', {})
            if (reconnects < 10) {
                reconnectTimer = setTimeout(() => { reconnects++; connect() }, 2000 * Math.min(reconnects + 1, 5))
            }
        }
        ws.onerror = () => ws?.close()
        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data)
                emit(data.type, data.payload)
            } catch { /* ignore */ }
        }
    }

    const disconnect = () => {
        if (reconnectTimer) clearTimeout(reconnectTimer)
        ws?.close()
        ws = null
    }

    const send = (type: string, payload: any) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, payload }))
        }
    }

    return { connect, disconnect, send, on: (t, h) => { if (!handlers[t]) handlers[t] = []; handlers[t].push(h) }, off: (t, h) => { handlers[t] = (handlers[t] || []).filter(x => x !== h) } }
}

/* ══════════════════════════════════════════════════════
   Composable
   ══════════════════════════════════════════════════════ */

export function useChat(options: ChatOptions) {
    const { userId, wsUrl } = options

    // ── State ──
    const connected = ref(false)
    const channels = ref<ChatChannel[]>(mockChannels)
    const users = ref<ChatUser[]>(mockUsers)
    const activeChannelId = ref('ch-1')
    const messages = reactive<Record<string, ChatMessage[]>>({})
    const typingUsers = ref<TypingUser[]>([])
    const transport = ref<ChatTransport | null>(null)

    // ── Computed ──
    const activeChannel = computed(() => channels.value.find(c => c.id === activeChannelId.value))
    const activeMessages = computed(() => messages[activeChannelId.value] || [])
    const onlineUsers = computed(() => users.value.filter(u => u.status === 'online'))

    // ── Init messages for channels ──
    mockChannels.forEach(ch => {
        messages[ch.id] = mockMessages[ch.id] || []
    })

    // ── Transport setup ──
    const connect = () => {
        transport.value = wsUrl ? createWSTransport(wsUrl) : createMockTransport()

        transport.value.on('connected', () => { connected.value = true })
        transport.value.on('disconnected', () => { connected.value = false })

        transport.value.on('message', (msg: ChatMessage) => {
            if (!messages[msg.channelId]) messages[msg.channelId] = []
            messages[msg.channelId].push(msg)
            // Update channel last message
            const ch = channels.value.find(c => c.id === msg.channelId)
            if (ch) {
                ch.lastMessage = msg.content
                ch.lastMessageTime = msg.timestamp
                if (msg.channelId !== activeChannelId.value) ch.unreadCount++
            }
        })

        transport.value.on('message-sent', (msg: ChatMessage) => {
            // Replace pending message with confirmed
            const chMsgs = messages[msg.channelId]
            if (chMsgs) {
                const idx = chMsgs.findIndex(m => m.pending && m.content === msg.content)
                if (idx >= 0) {
                    chMsgs[idx] = { ...msg, pending: false }
                }
            }
        })

        transport.value.on('typing', (data: { userId: string; name: string; channelId: string }) => {
            if (data.userId === userId) return
            // Remove existing then add
            typingUsers.value = typingUsers.value.filter(t => !(t.userId === data.userId && t.channelId === data.channelId))
            const tu: TypingUser = { userId: data.userId, name: data.name, channelId: data.channelId }
            // Auto-remove after 4s
            tu.timeout = setTimeout(() => {
                typingUsers.value = typingUsers.value.filter(t => t !== tu)
            }, 4000)
            typingUsers.value.push(tu)
        })

        transport.value.on('typing-stop', (data: { userId: string; channelId: string }) => {
            const tu = typingUsers.value.find(t => t.userId === data.userId && t.channelId === data.channelId)
            if (tu?.timeout) clearTimeout(tu.timeout)
            typingUsers.value = typingUsers.value.filter(t => !(t.userId === data.userId && t.channelId === data.channelId))
        })

        transport.value.connect()
    }

    // ── Actions ──
    const sendMessage = (content: string, replyTo?: string) => {
        if (!content.trim() || !transport.value) return
        const msg: ChatMessage = {
            id: `temp-${Date.now()}`,
            channelId: activeChannelId.value,
            senderId: userId,
            senderName: 'شما',
            content: content.trim(),
            timestamp: Date.now(),
            type: 'text',
            replyTo,
            pending: true,
        }
        if (!messages[activeChannelId.value]) messages[activeChannelId.value] = []
        messages[activeChannelId.value].push(msg)
        transport.value.send('message', msg)
    }

    const sendTyping = () => {
        transport.value?.send('typing', { channelId: activeChannelId.value })
    }

    const switchChannel = (channelId: string) => {
        activeChannelId.value = channelId
        const ch = channels.value.find(c => c.id === channelId)
        if (ch) ch.unreadCount = 0
    }

    const addReaction = (messageId: string, emoji: string) => {
        const chMsgs = messages[activeChannelId.value]
        if (!chMsgs) return
        const msg = chMsgs.find(m => m.id === messageId)
        if (!msg) return
        if (!msg.reactions) msg.reactions = {}
        if (!msg.reactions[emoji]) msg.reactions[emoji] = []
        const idx = msg.reactions[emoji].indexOf(userId)
        if (idx >= 0) {
            msg.reactions[emoji].splice(idx, 1)
            if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji]
        } else {
            msg.reactions[emoji].push(userId)
        }
    }

    const disconnect = () => {
        typingUsers.value.forEach(t => { if (t.timeout) clearTimeout(t.timeout) })
        transport.value?.disconnect()
    }

    // ── Auto connect ──
    connect()

    return {
        // State
        connected,
        channels,
        users,
        activeChannelId,
        activeChannel,
        messages,
        activeMessages,
        typingUsers,
        onlineUsers,
        // Actions
        sendMessage,
        sendTyping,
        switchChannel,
        addReaction,
        connect,
        disconnect,
    }
}

/* ══════════════════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════════════════ */

const mockUsers: ChatUser[] = [
    { id: 'user-1', name: 'دکتر احمدی', status: 'online' },
    { id: 'user-2', name: 'سارا کریمی', avatar: 'https://i.pravatar.cc/80?img=5', status: 'online' },
    { id: 'user-3', name: 'محمد حسینی', avatar: 'https://i.pravatar.cc/80?img=8', status: 'away' },
    { id: 'user-4', name: 'زهرا نوری', avatar: 'https://i.pravatar.cc/80?img=9', status: 'online' },
    { id: 'user-5', name: 'امیر کاظمی', avatar: 'https://i.pravatar.cc/80?img=11', status: 'offline', lastSeen: Date.now() - 3600000 },
    { id: 'user-6', name: 'نیلوفر صادقی', avatar: 'https://i.pravatar.cc/80?img=16', status: 'busy' },
    { id: 'user-7', name: 'رضا شریفی', avatar: 'https://i.pravatar.cc/80?img=12', status: 'online' },
]

const mockChannels: ChatChannel[] = [
    { id: 'ch-1', name: 'سارا کریمی', type: 'direct', avatar: 'https://i.pravatar.cc/80?img=5', lastMessage: 'نتیجه آزمایش آماده شد', lastMessageTime: Date.now() - 60000, unreadCount: 2, members: ['user-1', 'user-2'] },
    { id: 'ch-2', name: 'تیم درمان', type: 'group', lastMessage: 'جلسه فردا ساعت ۱۰', lastMessageTime: Date.now() - 300000, unreadCount: 0, members: ['user-1', 'user-2', 'user-3', 'user-4'] },
    { id: 'ch-3', name: 'محمد حسینی', type: 'direct', avatar: 'https://i.pravatar.cc/80?img=8', lastMessage: 'کد پیگیری: PR-1405', lastMessageTime: Date.now() - 600000, unreadCount: 0, members: ['user-1', 'user-3'] },
    { id: 'ch-4', name: 'زهرا نوری', type: 'direct', avatar: 'https://i.pravatar.cc/80?img=9', lastMessage: 'فایل گزارش آپلود شد', lastMessageTime: Date.now() - 900000, unreadCount: 1, members: ['user-1', 'user-4'] },
    { id: 'ch-5', name: 'مدیریت کلینیک', type: 'group', lastMessage: 'برنامه هفتگی اعلام شد', lastMessageTime: Date.now() - 3600000, unreadCount: 0, members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'], pinned: true },
]

const mockMessages: Record<string, ChatMessage[]> = {
    'ch-1': [
        { id: 'm1', channelId: 'ch-1', senderId: 'user-2', senderName: 'سارا کریمی', senderAvatar: 'https://i.pravatar.cc/80?img=5', content: 'سلام دکتر، نتیجه آزمایش خون مریم جعفری آماده شد', timestamp: Date.now() - 3600000, type: 'text', readBy: ['user-1', 'user-2'] },
        { id: 'm2', channelId: 'ch-1', senderId: 'user-1', senderName: 'شما', content: 'ممنون سارا، لطفاً فایل رو بفرست', timestamp: Date.now() - 3500000, type: 'text', readBy: ['user-1', 'user-2'] },
        { id: 'm3', channelId: 'ch-1', senderId: 'user-2', senderName: 'سارا کریمی', senderAvatar: 'https://i.pravatar.cc/80?img=5', content: ' uploads/blood-test-maryam.pdf', timestamp: Date.now() - 3400000, type: 'file', readBy: ['user-2'] },
        { id: 'm4', channelId: 'ch-1', senderId: 'user-2', senderName: 'سارا کریمی', senderAvatar: 'https://i.pravatar.cc/80?img=5', content: 'همون‌طور که دیدید هموگلوبین پایین‌تر از حد نرماله — احتمالاً کم‌خونی فقر آهن', timestamp: Date.now() - 3300000, type: 'text', readBy: ['user-2'] },
        { id: 'm5', channelId: 'ch-1', senderId: 'user-1', senderName: 'شما', content: 'بله متوجه شدم. دوز مکمل رو افزایش بدم؟', timestamp: Date.now() - 3200000, type: 'text', readBy: ['user-1', 'user-2'] },
        { id: 'm6', channelId: 'ch-1', senderId: 'user-2', senderName: 'سارا کریمی', senderAvatar: 'https://i.pravatar.cc/80?img=5', content: 'بله، پیشنهاد می‌کنم آهن خوراکی ۳۲۵mg روزی ۲ بشد', timestamp: Date.now() - 60000, type: 'text', readBy: ['user-2'] },
    ],
    'ch-2': [
        { id: 'g1', channelId: 'ch-2', senderId: 'user-3', senderName: 'محمد حسینی', content: 'جلسه بررسی پرونده‌ها فردا ساعت ۱۰ صبح', timestamp: Date.now() - 7200000, type: 'text', readBy: ['user-3'] },
        { id: 'g2', channelId: 'ch-2', senderId: 'user-4', senderName: 'زهرا نوری', content: 'من هم حاضرم. گزارش ماهانه رو آماده کردم', timestamp: Date.now() - 7000000, type: 'text', readBy: ['user-4'] },
        { id: 'g3', channelId: 'ch-2', senderId: 'user-2', senderName: 'سارا کریمی', content: 'نتایج آزمایشات ۳ بیمار جدید هم آماده است', timestamp: Date.now() - 300000, type: 'text', readBy: ['user-2'] },
    ],
    'ch-3': [
        { id: 'p1', channelId: 'ch-3', senderId: 'user-3', senderName: 'محمد حسینی', content: 'کد پیگیری سند شما: PR-1405-۲۱۸', timestamp: Date.now() - 600000, type: 'text', readBy: ['user-3'] },
        { id: 'p2', channelId: 'ch-3', senderId: 'user-1', senderName: 'شما', content: 'ممنون، ثبت شد', timestamp: Date.now() - 500000, type: 'text', readBy: ['user-1', 'user-3'] },
    ],
    'ch-4': [
        { id: 'r1', channelId: 'ch-4', senderId: 'user-4', senderName: 'زهرا نوری', content: 'گزارش ماهانه فروردین آپلود شد — لطفاً بررسی کنید', timestamp: Date.now() - 900000, type: 'text', readBy: ['user-4'] },
    ],
    'ch-5': [
        { id: 't1', channelId: 'ch-5', senderId: 'user-6', senderName: 'نیلوفر صادقی', content: 'برنامه شیفت هفتگی اعلام شد', timestamp: Date.now() - 7200000, type: 'text', readBy: ['user-6'] },
        { id: 't2', channelId: 'ch-5', senderId: 'user-7', senderName: 'رضا شریفی', content: 'ممنون نیلوفر 👍', timestamp: Date.now() - 3600000, type: 'text', readBy: ['user-7'], reactions: { '👍': ['user-7', 'user-6'] } },
    ],
}
