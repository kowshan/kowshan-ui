<!-- components/KAssessmentContent.vue
     Renders the CONTENT half of a question: text / image / audio / video / file / link.
     Provider-agnostic — you map your payload to ContentBlock[] and this draws it.
-->
<template>
    <div class="k-ac" :class="`dir-${direction}`">
        <component
            :is="rowTag(block)"
            v-for="(block, i) in blocks"
            :key="i"
            class="k-ac-block"
            :class="`is-${block.kind}`"
        >
            <!-- TEXT -->
            <!-- `block.html` is provider-supplied rich content, so it is run
                 through DOMPurify. Sanitizing needs a DOM, so it only happens
                 in the browser — until then (server render + the client's first
                 render) the block falls back to its plain text, which keeps the
                 hydration markup identical. -->
            <template v-if="block.kind === 'text'">
                <p v-if="hydrated && block.html" class="k-ac-text" v-html="sanitizeHtml(block.html)" />
                <p v-else class="k-ac-text">{{ block.text || (block.html ? stripTags(block.html) : '') }}</p>
            </template>

            <!-- IMAGE -->
            <template v-else-if="block.kind === 'image'">
                <img class="k-ac-img" :src="block.src" :alt="block.alt || block.caption || ''" loading="lazy" />
                <figcaption v-if="block.caption || block.text" class="k-ac-caption">
                    {{ block.caption || block.text }}
                </figcaption>
            </template>

            <!-- AUDIO -->
            <template v-else-if="block.kind === 'audio'">
                <div class="k-ac-media-head">
                    <AudioLines class="k-ac-media-icon" />
                    <span class="k-ac-media-title">{{ block.title || block.name || 'فایل صوتی' }}</span>
                </div>
                <audio class="k-ac-audio" :src="block.src" controls preload="metadata" :autoplay="!!block.autoplay" />
                <p v-if="block.caption || block.text" class="k-ac-caption">{{ block.caption || block.text }}</p>
            </template>

            <!-- VIDEO -->
            <template v-else-if="block.kind === 'video'">
                <video
                    class="k-ac-video"
                    :src="block.src"
                    :poster="block.poster"
                    controls
                    playsinline
                    preload="metadata"
                    :autoplay="!!block.autoplay"
                    :loop="!!block.loop"
                    :muted="!!block.autoplay"
                />
                <p v-if="block.caption || block.text" class="k-ac-caption">{{ block.caption || block.text }}</p>
            </template>

            <!-- FILE -->
            <template v-else-if="block.kind === 'file'">
                <a class="k-ac-file" :href="block.url || block.src" download>
                    <FileText class="k-ac-file-icon" />
                    <span class="k-ac-file-body">
                        <span class="k-ac-file-name">{{ block.name || block.title || 'دانلود فایل' }}</span>
                        <span v-if="meta(block)" class="k-ac-file-meta">{{ meta(block) }}</span>
                    </span>
                    <Download class="k-ac-file-action" />
                </a>
            </template>

            <!-- LINK -->
            <template v-else-if="block.kind === 'link'">
                <a class="k-ac-link" :href="block.url" target="_blank" rel="noopener noreferrer">
                    <Link2 class="k-ac-link-icon" />
                    <span class="k-ac-link-text">{{ block.title || block.text || block.url }}</span>
                    <ExternalLink class="k-ac-link-action" />
                </a>
            </template>
        </component>
    </div>
</template>

<script setup lang="ts">
import { AudioLines, Download, ExternalLink, FileText, Link2 } from 'lucide-vue-next'
import type { ContentBlock } from '../types/assessment'
import { sanitizeHtml, stripTags } from '../utils/html'
import { useKHydrated } from '../composables/useKHydrated'

const hydrated = useKHydrated()

withDefaults(defineProps<{
    blocks?: ContentBlock[]
    /** 'auto' inherits page direction; text-heavy blocks can force one */
    direction?: 'auto' | 'rtl' | 'ltr'
}>(), {
    blocks: () => [],
    direction: 'auto',
})

/** blocks that are semantic figures vs plain divs */
const rowTag = (block: ContentBlock) => block.kind === 'image' ? 'figure' : 'div'

const meta = (block: ContentBlock) => {
    const parts: string[] = []
    if (block.size) parts.push(block.size > 1024 * 1024
        ? `${(block.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(block.size / 1024))} KB`)
    if (block.mime) parts.push(block.mime.replace('application/', '').replace('audio/', '').replace('video/', ''))
    return parts.join(' · ')
}
</script>

<style scoped>
.k-ac {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.k-ac.dir-rtl { direction: rtl; }
.k-ac.dir-ltr { direction: ltr; }
.k-ac-block { margin: 0; }
.k-ac-text {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.9;
    color: var(--k-text-primary);
    white-space: pre-wrap;
}
.k-ac-text :deep(img) { max-width: 100%; border-radius: var(--k-radius-sm); }
.k-ac-img {
    display: block;
    width: 100%;
    max-height: 340px;
    object-fit: contain;
    border-radius: var(--k-radius-md);
    border: 1px solid var(--k-border);
    background: var(--k-surface);
}
.k-ac-caption {
    margin: 6px 0 0;
    font-size: 0.72rem;
    color: var(--k-text-muted);
}
.k-ac-media-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: var(--k-text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
}
.k-ac-media-icon { width: 15px; height: 15px; }
.k-ac-audio,
.k-ac-video {
    width: 100%;
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.k-ac-video { max-height: 340px; }
.k-ac-file,
.k-ac-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    color: var(--k-text-primary);
    text-decoration: none;
    transition: border-color 0.15s ease, background 0.15s ease;
}
.k-ac-file:hover,
.k-ac-link:hover {
    border-color: var(--k-border-focus, var(--k-primary));
    background: var(--k-surface-hover);
}
.k-ac-file-icon,
.k-ac-link-icon { width: 18px; height: 18px; color: var(--k-primary); flex-shrink: 0; }
.k-ac-file-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.k-ac-file-name,
.k-ac-link-text {
    font-size: 0.8rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.k-ac-file-meta { font-size: 0.68rem; color: var(--k-text-muted); direction: ltr; text-align: start; }
.k-ac-file-action,
.k-ac-link-action { width: 16px; height: 16px; color: var(--k-text-muted); margin-inline-start: auto; flex-shrink: 0; }
</style>
