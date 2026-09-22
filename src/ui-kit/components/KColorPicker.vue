<!-- components/KColorPicker.vue -->
<!--
    KColorPicker — palette + native picker + hex input:

      <KColorPicker v-model="color" />
      <KColorPicker v-model="color" :presets="['#10b981','#3b82f6','#ef4444']" />
-->
<template>
    <div dir="ltr" ref="rootRef" class="k-cp">
        <!-- Trigger -->
        <button
            type="button"
            class="k-cp-trigger"
            :class="{ 'is-open': open }"
            @click="open = !open"
        >
            <span class="k-cp-swatch" :style="{ background: modelValue || '#cccccc' }" />
            <span class="k-cp-value">{{ displayValue }}</span>
            <ChevronDown :size="14" class="k-cp-chevron" />
        </button>

        <!-- Panel -->
        <Transition name="k-slide-down">
            <div v-if="open" ref="panelEl" class="k-cp-panel" :style="panelStyle">
                <!-- Presets -->
                <div class="k-cp-presets">
                    <button
                        v-for="c in presets"
                        :key="c"
                        type="button"
                        class="k-cp-dot"
                        :class="{ 'is-active': c.toLowerCase() === (modelValue || '').toLowerCase() }"
                        :style="{ background: c }"
                        :title="c"
                        @click="select(c)"
                    />
                </div>

                <!-- Native + hex -->
                <div class="k-cp-row">
                    <label class="k-cp-native" :style="{ background: modelValue || '#ccc' }">
                        <input
                            type="color"
                            :value="modelValue || '#000000'"
                            @input="select(($event.target as HTMLInputElement).value)"
                        />
                        <Palette :size="14" />
                    </label>
                    <div class="k-cp-hex">
                        <span class="k-cp-hash">#</span>
                        <input
                            :value="hexDraft"
                            class="k-cp-hex-input"
                            spellcheck="false"
                            @input="onHexInput"
                            @blur="commitHex"
                            @keydown.enter="commitHex"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronDown, Palette } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { useClickOutside } from '../composables/useClickOutside'

const props = withDefaults(defineProps<{
    modelValue?: string
    presets?: string[]
}>(), {
    modelValue: '#1db954',
    presets: () => ['#1db954', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899', '#64748b', '#000000', '#ffffff']
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
}>()

const { normalize } = usePersianNumbers()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const hexDraft = ref('')

const displayValue = computed(() => props.modelValue ? props.modelValue.toUpperCase() : 'انتخاب رنگ')

const select = (c: string) => {
    emit('update:modelValue', c)
    emit('change', c)
}

const onHexInput = (e: Event) => {
    hexDraft.value = normalize((e.target as HTMLInputElement).value).replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
}

const commitHex = () => {
    if (/^[0-9a-fA-F]{6}$/.test(hexDraft.value)) {
        select('#' + hexDraft.value.toLowerCase())
    }
    open.value = false
}

useClickOutside([rootRef], () => { open.value = false })

/* Keep the panel inside the viewport when the trigger sits near an edge */
const panelEl = ref<HTMLElement | null>(null)
const panelOffset = ref(0)
const panelStyle = computed(() => panelOffset.value ? { transform: `translateX(${panelOffset.value}px)` } : {})

const clampPanel = () => {
    nextTick(() => {
        if (!panelEl.value) return
        const margin = 12
        const rect = panelEl.value.getBoundingClientRect()
        let offset = 0
        if (rect.right > window.innerWidth - margin) offset = (window.innerWidth - margin) - rect.right
        if (rect.left + offset < margin) offset = margin - rect.left
        panelOffset.value = offset
    })
}

watch(open, (v) => {
    if (!v) { panelOffset.value = 0; return }
    clampPanel()
})
</script>

<style scoped>
.k-cp {
    position: relative;
    width: fit-content;
}

.k-cp-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 10px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 8px);
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s ease;
    width: 100%;
    box-sizing: border-box;
}

.k-cp-trigger.is-open,
.k-cp-trigger:hover {
    border-color: var(--k-primary, #1db954);
}

.k-cp-swatch {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 1px solid rgb(0 0 0 / 0.12);
}

.k-cp-value {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    font-family: monospace;
    direction: ltr;
}

.k-cp-chevron {
    color: var(--k-text-muted, #94a3b8);
}

.k-cp-panel {
    position: absolute;
    top: calc(100% + 6px);
    inset-inline-start: 0;
    z-index: 100;
    width: 100%;
    min-width: 190px;
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 8px);
    box-shadow: var(--k-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: var(--k-font-family, 'yekan-bakh', Tahoma, sans-serif);
}

.k-cp-presets {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
}

.k-cp-dot {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    transition: transform 0.12s ease;
}

.k-cp-dot:hover { transform: scale(1.15); }

.k-cp-dot.is-active {
    border-color: var(--k-text-primary, #1e293b);
    box-shadow: 0 0 0 2px var(--k-bg, #fff);
}

.k-cp-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.k-cp-native {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    color: #fff;
    overflow: hidden;
    flex-shrink: 0;
}

.k-cp-native input[type="color"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.k-cp-hex {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 34px;
    padding: 0 10px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 9px;
    overflow: hidden;
}

.k-cp-hash {
    color: var(--k-text-muted, #94a3b8);
    font-size: 0.8rem;
    font-weight: 700;
}

.k-cp-hex-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--k-text-primary, #1e293b);
    font-family: monospace;
    font-size: 0.78rem;
    direction: ltr;
    text-align: start;
}
</style>
