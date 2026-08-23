<!-- components/KCopyButton.vue -->
<!--
    KCopyButton — copy-to-clipboard with feedback:

      <KCopyButton :text="invoiceId" />
-->
<template>
    <button
        type="button"
        class="k-copy"
        :class="{ 'is-copied': copied }"
        :title="copied ? 'کپی شد' : 'کپی'"
        :aria-label="copied ? 'کپی شد' : 'کپی'"
        @click="copy(text)"
    >
        <Check v-if="copied" :size="14" />
        <Copy v-else :size="14" />
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '../composables/useClipboard'

const props = withDefaults(defineProps<{
    text?: string
    /** show a tooltip-style label next to the icon */
    label?: string
}>(), {
    text: '',
    label: ''
})

const { copy, copied } = useClipboard({ resetAfter: 1600 })
</script>

<style scoped>
.k-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    height: 30px;
    padding: 0 9px;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 8px;
    background: var(--k-bg, #fff);
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    font-size: 0.68rem;
    font-weight: 700;
    font-family: inherit;
    transition: all 0.15s ease;
}

.k-copy:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-copy.is-copied {
    background: var(--k-success, #10b981);
    border-color: var(--k-success, #10b981);
    color: #fff;
}
</style>
