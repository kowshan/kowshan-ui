<!-- KChatInput.vue — chat input with attach+emoji on left, send on right -->
<template>
    <div class="k-ci" :class="{ 'is-focused': focused }">
        <!-- Reply preview -->
        <div v-if="replyTo" class="k-ci-reply">
            <div class="k-ci-reply-bar" />
            <div class="k-ci-reply-content">
                <span class="k-ci-reply-label">Reply to {{ replyTo.senderName }}</span>
                <span class="k-ci-reply-text">{{ replyTo.content }}</span>
            </div>
            <button class="k-ci-reply-close" @click="$emit('cancel-reply')">
                <X :size="14" />
            </button>
        </div>

        <div class="k-ci-row">
            <!-- Send button — first in DOM = rightmost in RTL -->
            <button
                class="k-ci-send"
                :class="{ 'is-ready': text.trim() }"
                :disabled="!text.trim()"
                title="ارسال"
                @click="send"
            >
                <SendHorizontal :size="16" />
            </button>

            <!-- Input — middle -->
            <textarea
                ref="inputEl"
                v-model="text"
                class="k-ci-input"
                :placeholder="placeholder || 'پیام بنویسید…'"
                rows="1"
                @input="autoResize"
                @keydown="onKeydown"
                @focus="focused = true"
                @blur="onBlur"
            />

            <!-- Emoji + attach — last in DOM = leftmost in RTL -->
            <div class="k-ci-actions">
                <div class="k-ci-emoji-wrap" ref="emojiWrapRef">
                    <button class="k-ci-btn" title="ایموجی" @click.stop="toggleEmoji">
                        <Smile :size="16" />
                    </button>
                    <Teleport to="#k-teleport-hub">
                        <div v-if="showEmoji" class="k-ci-emoji-popup" :style="emojiPopupStyle" @click.stop>
                            <KEmojiPicker @select="onEmojiSelect" />
                        </div>
                    </Teleport>
                </div>
                <button class="k-ci-btn" title="پیوست" @click="$emit('attach')">
                    <Paperclip :size="16" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { Paperclip, Smile, SendHorizontal, X } from 'lucide-vue-next'
import KEmojiPicker from './KEmojiPicker.vue'

withDefaults(defineProps<{
    placeholder?: string
    replyTo?: { senderName: string; content: string } | null
}>(), {
    placeholder: 'Type a message...',
    replyTo: null,
})

const emit = defineEmits<{
    send: [text: string]
    attach: []
    emoji: []
    'cancel-reply': []
    typing: []
}>()

const text = ref('')
const focused = ref(false)
const showEmoji = ref(false)
const inputEl = ref<HTMLTextAreaElement>()
const emojiWrapRef = ref<HTMLElement | null>(null)

const emojiPopupStyle = computed(() => {
    if (!emojiWrapRef.value || !showEmoji.value) return { display: 'none' }
    const rect = emojiWrapRef.value.getBoundingClientRect()
    const popupW = 320
    const popupH = 380
    // Safe positioning: keep within viewport
    let left = rect.left
    if (left + popupW > window.innerWidth) left = window.innerWidth - popupW - 8
    if (left < 8) left = 8
    let bottom = window.innerHeight - rect.top + 4
    if (rect.top - popupH - 8 > 0) {
        // Enough space above — open upward
        return {
            position: 'fixed' as const,
            top: `${rect.top - popupH - 4}px`,
            left: `${left}px`,
            width: `${popupW}px`,
            zIndex: '20000'
        }
    }
    return {
        position: 'fixed' as const,
        bottom: `${bottom}px`,
        left: `${left}px`,
        width: `${popupW}px`,
        zIndex: '20000'
    }
})

const autoResize = () => {
    const el = inputEl.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

const toggleEmoji = () => {
    showEmoji.value = !showEmoji.value
    emit('emoji')
}

const onEmojiSelect = (emoji: string) => {
    text.value += emoji
    // Keep picker open for multiple selections — user clicks outside to close
    nextTick(() => inputEl.value?.focus())
}

const onBlur = () => {
    setTimeout(() => {
        focused.value = false
    }, 200)
}

const send = () => {
    if (!text.value.trim()) return
    emit('send', text.value.trim())
    text.value = ''
    nextTick(() => {
        if (inputEl.value) {
            inputEl.value.style.height = 'auto'
            inputEl.value.focus()
        }
    })
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
    }
    emit('typing')
}

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.k-ci-emoji-wrap') && !target.closest('.k-ci-emoji-popup')) {
        showEmoji.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.k-ci {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 14px;
    background: var(--k-bg, #fff);
    transition: border-color 0.15s, box-shadow 0.15s;
    overflow: visible;
}
.k-ci.is-focused {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 10%, transparent);
}
/* Reply */
.k-ci-reply {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
}
.k-ci-reply-bar {
    width: 3px;
    height: 28px;
    border-radius: 2px;
    background: var(--k-primary, #1db954);
    flex-shrink: 0;
}
.k-ci-reply-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.k-ci-reply-label {
    font-size: 0.64rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
}
.k-ci-reply-text {
    font-size: 0.68rem;
    color: var(--k-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.k-ci-reply-close {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    flex-shrink: 0;
}
.k-ci-reply-close:hover { background: var(--k-surface-hover); }
/* Row */
.k-ci-row {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 8px 10px;
}
.k-ci-actions {
    display: flex;
    gap: 2px;
    padding-bottom: 4px;
}
.k-ci-emoji-wrap { position: relative; }
.k-ci-emoji-popup {
    position: fixed;
    z-index: 20000;
}
.k-ci-btn {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    padding: 5px;
    border-radius: 8px;
    display: flex;
    transition: all 0.12s;
}
.k-ci-btn:hover {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}
.k-ci-input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    font-size: 0.8rem;
    font-family: inherit;
    color: var(--k-text-primary);
    resize: none;
    padding: 4px 0;
    line-height: 1.5;
    min-height: 24px;
    max-height: 120px;
    text-align: start;
}
.k-ci-input::placeholder { color: var(--k-text-muted); font-family: inherit; }
.k-ci-send {
    border: none;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-muted);
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
}
.k-ci-send.is-ready {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-ci-send.is-ready:hover {
    filter: brightness(1.08);
}
.k-ci-send:disabled {
    cursor: default;
}
</style>
