<!-- KTagInput — chip-style tag entry with suggestions autocomplete -->
<template>
    <div class="k-tag-input" :class="{ 'has-error': errorMessage, 'is-disabled': disabled, 'is-focused': isFocused }">
        <label v-if="label" class="k-label">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <div class="k-tag-container" :style="{ minHeight: containerHeight + 'px' }" @click="focusInput">
            <!-- Selected Tags -->
            <span
                v-for="(tag, i) in modelTags"
                :key="i"
                class="k-tag"
                :class="tagColor"
            >
                <slot name="tag" :tag="tag" :index="i">
                    {{ getTagLabel(tag) }}
                </slot>
                <button
                    v-if="!disabled && !readonly"
                    type="button"
                    class="k-tag-remove"
                    @click.stop="removeTag(i)"
                    :aria-label="'حذف ' + getTagLabel(tag)"
                >
                    <X :size="12" />
                </button>
            </span>

            <!-- Input -->
            <div v-if="!disabled && !readonly" class="k-tag-input-wrap">
                <input
                    ref="inputRef"
                    v-model="query"
                    type="text"
                    :placeholder="modelTags.length ? '' : placeholder"
                    :disabled="disabled"
                    @focus="isFocused = true; emit('focus')"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                    @input="handleInput"
                />
            </div>
        </div>

        <!-- Suggestions Dropdown -->
        <Teleport to="#k-teleport-hub">
            <div
                v-if="showSuggestions && filteredSuggestions.length"
                ref="suggestionsRef"
                class="k-tag-suggestions"
                :style="suggestionsStyle"
                @mousedown.prevent
            >
                <div
                    v-for="(s, i) in filteredSuggestions"
                    :key="getOptionValue(s)"
                    class="k-tag-suggestion"
                    :class="{ 'is-active': i === activeIndex }"
                    @mouseenter="activeIndex = i"
                    @click="selectSuggestion(s)"
                >
                    <slot name="suggestion" :suggestion="s" :index="i">
                        {{ getOptionLabel(s) }}
                    </slot>
                </div>
            </div>
        </Teleport>

        <!-- Hint / Error -->
        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle :size="12" /> {{ errorMessage }}
            </div>
            <div v-else-if="hint" class="k-hint-message">
                {{ hint }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X, AlertCircle } from 'lucide-vue-next'
import { useKitId } from '../composables/useKitId'

const props = withDefaults(defineProps<{
    modelValue?: any[]
    options?: any[]
    valueKey?: string
    labelKey?: string
    label?: string
    hint?: string
    placeholder?: string
    maxTags?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    tagColor?: 'green' | 'blue' | 'purple' | 'gray'
    allowCustom?: boolean
    delimiter?: string
}>(), {
    modelValue: () => [],
    options: () => [],
    placeholder: 'تگ را تایپ کنید...',
    tagColor: 'green',
    allowCustom: true,
    delimiter: ','
})

const emit = defineEmits<{
    'update:modelValue': [value: any[]]
    'tag-add': [tag: any]
    'tag-remove': [tag: any, index: number]
    'focus': []
    'blur': []
}>()

const { id } = useKitId('tag-input')

const inputRef = ref<HTMLInputElement | null>(null)
const suggestionsRef = ref<HTMLElement | null>(null)
const query = ref('')
const isFocused = ref(false)
const errorMessage = ref('')
const activeIndex = ref(-1)
const showSuggestions = ref(false)
const containerHeight = ref(40)

const modelTags = computed({
    get: () => props.modelValue || [],
    set: (v) => emit('update:modelValue', v)
})

const getOptionValue = (opt: any) => {
    if (!opt) return null
    return typeof opt === 'object' ? opt[props.valueKey || 'value'] || opt[props.labelKey || 'label'] : opt
}

const getOptionLabel = (opt: any) => {
    if (!opt) return ''
    return typeof opt === 'object' ? opt[props.labelKey || 'label'] || opt[props.valueKey || 'value'] || String(opt) : String(opt)
}

const getTagLabel = (tag: any) => {
    if (!tag) return ''
    if (typeof tag === 'object') return tag[props.labelKey || 'label'] || tag[props.valueKey || 'value'] || JSON.stringify(tag)
    return String(tag)
}

const isDuplicate = (val: any) => modelTags.value.some(t => getOptionValue(t) === val)

const filteredSuggestions = computed(() => {
    if (!query.value) return []
    const q = query.value.toLowerCase()
    return (props.options || []).filter(opt => {
        const label = getOptionLabel(opt).toLowerCase()
        return label.includes(q) && !isDuplicate(getOptionValue(opt))
    })
})

const suggestionsStyle = computed(() => {
    if (!inputRef.value) return {}
    const rect = inputRef.value.getBoundingClientRect()
    return {
        position: 'fixed' as const,
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 20000
    }
})

const handleInput = () => {
    showSuggestions.value = true
    activeIndex.value = -1
}

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        if (activeIndex.value >= 0 && filteredSuggestions.value[activeIndex.value]) {
            selectSuggestion(filteredSuggestions.value[activeIndex.value])
        } else if (query.value.trim()) {
            addCustomTag(query.value.trim())
        }
    } else if (e.key === 'Backspace' && !query.value && modelTags.value.length) {
        removeTag(modelTags.value.length - 1)
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        activeIndex.value = Math.min(activeIndex.value + 1, filteredSuggestions.value.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        activeIndex.value = Math.max(activeIndex.value - 1, -1)
    } else if (e.key === 'Escape') {
        showSuggestions.value = false
    }
}

const selectSuggestion = (opt: any) => {
    const val = getOptionValue(opt)
    if (!isDuplicate(val)) {
        const newTags = [...modelTags.value, opt]
        modelTags.value = newTags
        emit('tag-add', opt)
    }
    query.value = ''
    showSuggestions.value = false
    activeIndex.value = -1
    focusInput()
}

const addCustomTag = (text: string) => {
    if (!props.allowCustom) return
    if (props.maxTags && modelTags.value.length >= props.maxTags) return
    const tag = text
    if (!isDuplicate(tag)) {
        const newTags = [...modelTags.value, tag]
        modelTags.value = newTags
        emit('tag-add', tag)
    }
    query.value = ''
    showSuggestions.value = false
}

const removeTag = (index: number) => {
    const tag = modelTags.value[index]
    const newTags = [...modelTags.value]
    newTags.splice(index, 1)
    modelTags.value = newTags
    emit('tag-remove', tag, index)
    focusInput()
}

const focusInput = () => inputRef.value?.focus()

const handleBlur = () => {
    setTimeout(() => {
        isFocused.value = false
        showSuggestions.value = false
        emit('blur')
    }, 150)
}

const handleClickOutside = (e: MouseEvent) => {
    if (suggestionsRef.value && !suggestionsRef.value.contains(e.target as Node)) {
        showSuggestions.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

defineExpose({ focus: focusInput, clear: () => { modelTags.value = [] } })
</script>

<style scoped>
.k-tag-input { display: flex; flex-direction: column; gap: 4px; width: 100%; }

.k-label { font-size: 0.75rem; font-weight: 500; color: var(--k-text-secondary); }
.k-tag-input.is-focused .k-label { color: var(--k-text-primary); }
.k-tag-input.has-error .k-label { color: var(--k-error); }
.k-required { color: var(--k-error); margin-inline-end: 2px; }

.k-tag-container {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
    background: var(--k-bg); border: 1px solid var(--k-border); border-radius: var(--k-radius-sm);
    padding: 6px 10px; min-height: 36px; cursor: text;
    transition: border-color 0.15s ease;
}
.k-tag-input.is-focused .k-tag-container { border-color: var(--k-primary); }
.k-tag-input.has-error .k-tag-container { border-color: var(--k-error); }
.k-tag-input.is-disabled .k-tag-container { opacity: 0.6; cursor: not-allowed; background: var(--k-surface); }

.k-tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 500;
    white-space: nowrap; transition: all 0.15s ease;
}
.k-tag.green { background: #bbf7d0; color: #166534; }
.k-tag.blue { background: #bfdbfe; color: #1e40af; }
.k-tag.purple { background: #e9d5ff; color: #6b21a8; }
.k-tag.gray { background: #e2e8f0; color: #334155; }

[data-theme="dark"] .k-tag.green { background: rgba(34,197,94,0.2); color: #4ade80; }
[data-theme="dark"] .k-tag.blue { background: rgba(59,130,246,0.2); color: #60a5fa; }
[data-theme="dark"] .k-tag.purple { background: rgba(139,92,246,0.2); color: #c4b5fd; }
[data-theme="dark"] .k-tag.gray { background: rgba(100,116,139,0.25); color: #cbd5e1; }

.k-tag-remove {
    display: flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; border: none; border-radius: 50%;
    background: rgba(0,0,0,0.08); color: currentColor; cursor: pointer;
    transition: all 0.15s ease;
}
.k-tag-remove:hover { background: rgba(0,0,0,0.15); }
[data-theme="dark"] .k-tag-remove { background: rgba(255,255,255,0.12); }
[data-theme="dark"] .k-tag-remove:hover { background: rgba(255,255,255,0.2); }

.k-tag-input-wrap { flex: 1; min-width: 80px; }
.k-tag-input-wrap input {
    width: 100%; border: none; outline: none; background: transparent;
    font-size: 0.85rem; color: var(--k-text-primary); font-family: inherit;
}
.k-tag-input-wrap input::placeholder { color: var(--k-text-muted); }

.k-tag-suggestions {
    position: fixed; background: var(--k-bg); border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm); box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    max-height: 200px; overflow-y: auto; z-index: 20000; min-width: 200px;
    font-family: inherit;
}
.k-tag-suggestion {
    padding: 8px 12px; cursor: pointer; font-size: 0.85rem;
    color: var(--k-text-primary); transition: background 0.1s;
}
.k-tag-suggestion:hover, .k-tag-suggestion.is-active { background: var(--k-primary-light); }

.k-message-area { font-size: 0.7rem; }
.k-error-message { display: flex; align-items: center; gap: 4px; color: var(--k-error); }
.k-hint-message { color: var(--k-text-muted); }
</style>
