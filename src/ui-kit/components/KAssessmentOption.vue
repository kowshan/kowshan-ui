<!-- components/KAssessmentOption.vue
     One answer choice: text / image / audio / video. Used by ChoiceInput,
     MatrixInput and RankingInput, and usable standalone.
-->
<template>
    <component
        :is="tag"
        class="k-ao"
        :class="[`kind-${kind}`, `layout-${layout}`, { 'is-selected': selected, 'is-disabled': disabled }]"
        :type="tag === 'button' ? 'button' : undefined"
        :role="tag === 'button' ? (multiple ? 'checkbox' : 'radio') : undefined"
        :aria-checked="tag === 'button' ? !!selected : undefined"
        :aria-disabled="disabled || undefined"
        :disabled="tag === 'button' ? disabled : undefined"
        @click="pick"
    >
        <!-- image option: thumbnail with a check overlay -->
        <span v-if="kind === 'image'" class="k-ao-media">
            <img :src="option.media" :alt="option.label || `گزینه ${index + 1}`" loading="lazy" />
            <span v-if="tag !== 'button'" class="k-ao-media-mark" :class="{ on: selected }">
                <Check v-if="selected" />
            </span>
        </span>

        <!-- video option: poster + play badge, plays inline once opened -->
        <span v-else-if="kind === 'video'" class="k-ao-media">
            <video :src="option.media" :poster="option.poster" controls preload="metadata" class="k-ao-video" />
            <span v-if="tag !== 'button'" class="k-ao-media-mark" :class="{ on: selected }">
                <Check v-if="selected" />
            </span>
        </span>

        <!-- audio option: label + native player -->
        <span v-else-if="kind === 'audio'" class="k-ao-audio">
            <AudioLines class="k-ao-audio-icon" />
            <audio :src="option.media" controls preload="metadata" class="k-ao-player" />
        </span>

        <!-- text option -->
        <span v-else class="k-ao-body">
            <span class="k-ao-label">{{ option.label }}</span>
            <span v-if="option.description" class="k-ao-desc">{{ option.description }}</span>
        </span>

        <!-- text/media caption under a media tile -->
        <span v-if="kind === 'image' && (option.label || option.description)" class="k-ao-body">
            <span class="k-ao-label">{{ option.label }}</span>
            <span v-if="option.description" class="k-ao-desc">{{ option.description }}</span>
        </span>

        <span v-if="kind === 'audio' || kind === 'video'" class="k-ao-body k-ao-body-inline">
            <span class="k-ao-label">{{ option.label }}</span>
            <span v-if="option.description" class="k-ao-desc">{{ option.description }}</span>
        </span>

        <!-- marker (button form only — media tiles carry their own overlay) -->
        <span
            v-if="tag === 'button' && kind !== 'image' && kind !== 'video'"
            class="k-ao-mark"
            :class="multiple ? 'is-box' : 'is-circle'"
        >
            <span v-if="selected" class="k-ao-mark-inner">
                <Check v-if="multiple" />
            </span>
        </span>

        <!-- tag: inline chip at the end of the row, corner badge on media tiles -->
        <span v-if="option.tag" class="k-ao-tag" :class="{ 'is-overlay': isMediaTile }">{{ option.tag }}</span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AudioLines, Check } from 'lucide-vue-next'
import type { AssessmentOption } from '../types/assessment'

const props = withDefaults(defineProps<{
    option: AssessmentOption
    selected?: boolean
    /** multi-select marker / semantics */
    multiple?: boolean
    disabled?: boolean
    /** 'button' = interactive choice, 'div' = read-only review (e.g. in results) */
    as?: 'button' | 'div'
    index?: number
    layout?: 'list' | 'grid' | 'inline' | 'pills'
}>(), {
    selected: false,
    multiple: false,
    disabled: false,
    as: 'button',
    index: 0,
    layout: 'list',
})

const emit = defineEmits<{ select: [option: AssessmentOption] }>()

const kind = computed(() => props.option.kind || 'text')
const tag = computed(() => props.as)
/** image/video render edge-to-edge, so their tag/mark must overlay instead of take a slot */
const isMediaTile = computed(() => kind.value === 'image' || kind.value === 'video')
const selectable = computed(() => tag.value === 'button')

function pick() {
    if (!selectable.value || props.disabled || props.option.disabled) return
    emit('select', props.option)
}
</script>

<style scoped>
.k-ao {
    position: relative;
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
    color: var(--k-text-primary);
    font-family: inherit;
    text-align: start;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
button.k-ao { cursor: pointer; }
button.k-ao:hover:not(.is-disabled) {
    border-color: var(--k-border-focus, var(--k-primary));
    background: var(--k-surface-hover);
}
.k-ao:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}
.k-ao.is-selected {
    border-color: var(--k-primary);
    background: var(--k-primary-light, rgba(29, 185, 84, 0.1));
    box-shadow: inset 0 0 0 1px var(--k-primary);
}
.k-ao.is-disabled { opacity: 0.55; cursor: not-allowed; }
.k-ao.kind-image,
.k-ao.kind-video { flex-direction: column; padding: 0; overflow: hidden; }
.k-ao.kind-image .k-ao-body,
.k-ao.kind-video .k-ao-body { padding: 0 10px 6px; }
/* media tiles stack, so the marker needs its own inset (audio rows already pad) */
.k-ao.kind-image .k-ao-mark,
.k-ao.kind-video .k-ao-mark { margin: 0 10px 10px; align-self: flex-start; }
.k-ao.kind-image .k-ao-media,
.k-ao.kind-video .k-ao-media {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    background: var(--k-surface-hover);
}
.k-ao.kind-image img,
.k-ao-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.k-ao-video { object-fit: contain; background: #000; }
.k-ao-media-mark {
    position: absolute;
    top: 8px;
    inset-inline-end: 8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.k-ao-media-mark.on { background: var(--k-primary); border-color: #fff; }
.k-ao-media-mark :deep(svg) { width: 14px; height: 14px; }
.k-ao.kind-audio { flex-direction: column; gap: 8px; padding: 10px 12px; }
.k-ao-audio { display: flex; align-items: center; gap: 8px; }
.k-ao-audio-icon { width: 16px; height: 16px; color: var(--k-primary); flex-shrink: 0; }
.k-ao-player { flex: 1; min-width: 0; height: 32px; }
.k-ao-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.k-ao-body-inline { padding: 0 2px 10px; }
.k-ao-label {
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.7;
}
.k-ao-desc { font-size: 0.72rem; color: var(--k-text-muted); line-height: 1.7; }
.k-ao-mark {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    border: 2px solid var(--k-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
}
.k-ao-mark.is-circle { border-radius: 50%; }
.k-ao-mark.is-box { border-radius: 4px; }
.k-ao.is-selected .k-ao-mark { border-color: var(--k-primary); }
.k-ao-mark-inner {
    width: 10px;
    height: 10px;
    border-radius: inherit;
    background: var(--k-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}
.k-ao-mark.is-box .k-ao-mark-inner { width: 100%; height: 100%; border-radius: 2px; }
.k-ao-mark.is-box .k-ao-mark-inner :deep(svg) { width: 12px; height: 12px; }
/* inline chip — sits at the end of the row so it can never cover the label */
.k-ao-tag {
    flex-shrink: 0;
    align-self: center;
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    color: var(--k-text-muted);
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.6;
}
/* …and a corner badge on media tiles (they have no text row of their own) */
.k-ao-tag.is-overlay {
    position: absolute;
    align-self: auto;
    top: 8px;
    inset-inline-start: 8px;
}
.k-ao.layout-pills {
    width: auto;
    padding: 6px 14px;
    border-radius: 999px;
    align-items: center;
}
.k-ao.layout-pills .k-ao-body { flex: 0 1 auto; }
.k-ao.layout-pills .k-ao-label { font-size: 0.78rem; line-height: 1.4; }
.k-ao.layout-pills .k-ao-mark { display: none; }
.k-ao.layout-inline { padding: 8px 14px; }
.k-ao.layout-inline .k-ao-mark { margin-top: 0; }
.k-ao.is-selected .k-ao-tag { border-color: var(--k-primary); color: var(--k-primary); }
</style>
