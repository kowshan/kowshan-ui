<!-- KCommentThread.vue — nested threaded comments -->
<template>
    <div class="k-thread">
        <div
            v-for="comment in comments"
            :key="comment.id"
            class="k-thread-comment"
            :style="{ '--depth': comment.depth || 0 }"
        >
            <img
                v-if="comment.avatar"
                :src="comment.avatar"
                class="k-thread-avatar"
            />
            <div v-else class="k-thread-avatar k-thread-avatar-text">
                {{ comment.author.charAt(0) }}
            </div>
            <div class="k-thread-body">
                <div class="k-thread-head">
                    <span class="k-thread-author">{{ comment.author }}</span>
                    <span v-if="comment.badge" class="k-thread-badge" :style="{ background: comment.badgeColor }">{{ comment.badge }}</span>
                    <span class="k-thread-time">{{ comment.time }}</span>
                </div>
                <!-- Plain text by default; `allow-html` opts into rich content,
                     which is sanitized before it reaches v-html -->
                <div v-if="richContent(comment)" class="k-thread-content" v-html="richContent(comment)" />
                <div v-else class="k-thread-content">{{ comment.content }}</div>
                <div class="k-thread-actions">
                    <button
                        v-for="action in commentActions"
                        :key="action.label"
                        class="k-thread-action"
                        @click="$emit('action', { action: action.id, comment })"
                    >
                        <component :is="action.icon" :size="12" />
                        <span>{{ action.label }}</span>
                    </button>
                    <span v-if="comment.reactions && Object.keys(comment.reactions).length" class="k-thread-reactions">
                        <button
                            v-for="(count, emoji) in comment.reactions"
                            :key="emoji"
                            class="k-thread-reaction"
                            @click="$emit('reaction', { commentId: comment.id, emoji: emoji as string })"
                        >
                            {{ emoji }} {{ count }}
                        </button>
                    </span>
                </div>
                <!-- Reply box -->
                <div v-if="replyTo === comment.id" class="k-thread-reply-box">
                    <textarea
                        v-model="replyText"
                        class="k-thread-reply-input"
                        placeholder="پاسخ دهید…"
                        rows="2"
                        autofocus
                    />
                    <div class="k-thread-reply-actions">
                        <button class="k-thread-reply-btn k-thread-reply-cancel" @click="replyTo = null">انصراف</button>
                        <button
                            class="k-thread-reply-btn k-thread-reply-submit"
                            :disabled="!replyText.trim()"
                            @click="submitReply(comment.id)"
                        >ارسال</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquare, ThumbsUp, Reply } from 'lucide-vue-next'
import { sanitizeHtml } from '../utils/html'
import { useKHydrated } from '../composables/useKHydrated'

export interface ThreadComment {
    id: string
    author: string
    avatar?: string
    content: string
    time: string
    depth?: number
    badge?: string
    badgeColor?: string
    reactions?: Record<string, number>
}

const props = withDefaults(defineProps<{
    comments: ThreadComment[]
    /** Render `content` as HTML. Off by default: comment bodies are the most
     *  likely place for untrusted text, so plain interpolation is the safe
     *  default. When on, the HTML is sanitized (DOMPurify) first. */
    allowHtml?: boolean
}>(), { allowHtml: false })

// Sanitizing needs a DOM, so it can only happen in the browser — the hydration
// gate keeps the server's text branch and the client's first render identical.
const hydrated = useKHydrated()
const richContent = (comment: ThreadComment): string =>
    props.allowHtml && hydrated.value ? sanitizeHtml(comment.content) : ''

const emit = defineEmits<{
    action: [payload: { action: string; comment: ThreadComment }]
    reaction: [payload: { commentId: string; emoji: string }]
    reply: [payload: { parentId: string; content: string }]
}>()

const replyTo = ref<string | null>(null)
const replyText = ref('')

const commentActions = [
    { id: 'reply', label: 'پاسخ', icon: Reply },
    { id: 'react', label: '-react', icon: ThumbsUp },
]

const submitReply = (parentId: string) => {
    if (!replyText.value.trim()) return
    emit('reply', { parentId, content: replyText.value.trim() })
    replyText.value = ''
    replyTo.value = null
}
</script>

<style scoped>
.k-thread {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.k-thread-comment {
    display: flex;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid var(--k-border, #e2e8f0);
}
.k-thread-comment:last-child { border-bottom: none; }
.k-thread-avatar {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
}
.k-thread-avatar-text {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--k-primary-light);
    color: var(--k-primary);
    font-size: 0.72rem;
    font-weight: 800;
}
.k-thread-body {
    flex: 1;
    min-width: 0;
}
.k-thread-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}
.k-thread-author {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--k-text-primary);
}
.k-thread-badge {
    font-size: 0.54rem;
    font-weight: 700;
    color: #fff;
    padding: 1px 6px;
    border-radius: 4px;
}
.k-thread-time {
    font-size: 0.62rem;
    color: var(--k-text-muted);
}
.k-thread-content {
    font-size: 0.78rem;
    color: var(--k-text-secondary);
    line-height: 1.6;
}
.k-thread-content :deep(code) {
    background: var(--k-surface-hover);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.74em;
}
.k-thread-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    flex-wrap: wrap;
}
.k-thread-action {
    border: none;
    background: none;
    color: var(--k-text-muted);
    cursor: pointer;
    font-size: 0.64rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 6px;
    font-family: inherit;
    transition: all 0.12s;
}
.k-thread-action:hover {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}
.k-thread-reactions {
    display: flex;
    gap: 6px;
    margin-inline-start: auto;
}
.k-thread-reaction {
    border: 1px solid var(--k-border);
    background: var(--k-surface, #f8fafc);
    border-radius: 16px;
    padding: 4px 10px;
    font-size: 0.68rem;
    cursor: pointer;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    line-height: 1;
    transition: all 0.12s;
    color: var(--k-text-secondary, #64748b);
    font-weight: 600;
}
.k-thread-reaction:hover {
    border-color: var(--k-primary);
    background: var(--k-primary-light);
}
.k-thread-reply-box {
    margin-top: 8px;
    padding: 8px;
    border: 1px solid var(--k-border);
    border-radius: 10px;
    background: var(--k-surface, #f8fafc);
}
.k-thread-reply-input {
    width: 100%;
    border: none;
    background: none;
    outline: none;
    font-size: 0.76rem;
    font-family: inherit;
    color: var(--k-text-primary);
    resize: none;
    line-height: 1.5;
}
.k-thread-reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 6px;
}
.k-thread-reply-btn {
    border: none;
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
}
.k-thread-reply-cancel {
    background: var(--k-surface-hover);
    color: var(--k-text-secondary);
}
.k-thread-reply-submit {
    background: var(--k-primary, #1db954);
    color: #fff;
}
.k-thread-reply-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
