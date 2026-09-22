<!-- KTypingIndicator.vue — animated "user is typing..." indicator -->
<template>
    <div class="k-typing" :class="[`side-${side}`, { 'is-compact': compact }]">
        <div class="k-typing-bubble">
            <span class="k-typing-dot" />
            <span class="k-typing-dot" />
            <span class="k-typing-dot" />
        </div>
        <span v-if="name" class="k-typing-name">{{ name }} در حال تایپ</span>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    name?: string
    compact?: boolean
    /** which side the bubble hangs on — 'left' = the other person, 'right' = you */
    side?: 'left' | 'right'
}>(), {
    compact: false,
    side: 'left',
})
</script>

<style scoped>
.k-typing {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}
.k-typing-bubble {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 8px 12px;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 14px;
    border-bottom-left-radius: 4px;
}
.k-typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--k-text-muted, #94a3b8);
    animation: k-typing-bounce 1.4s ease-in-out infinite;
}
.k-typing-dot:nth-child(2) { animation-delay: 0.15s; }
.k-typing-dot:nth-child(3) { animation-delay: 0.3s; }
.k-typing-name {
    font-size: 0.66rem;
    color: var(--k-text-muted);
    font-style: italic;
}
/* the tail corner follows the side, same convention as KChat bubbles
   (own = right, others = left, physical, so it reads the same in RTL and LTR) */
.k-typing.side-right {
    flex-direction: row-reverse;
    width: 100%;
}
.k-typing.side-right .k-typing-bubble {
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 4px;
}
.k-typing.is-compact .k-typing-bubble {
    padding: 5px 10px;
}
.k-typing.is-compact .k-typing-dot {
    width: 4px;
    height: 4px;
}

@keyframes k-typing-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-4px); opacity: 1; }
}
</style>
