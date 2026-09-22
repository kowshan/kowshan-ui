<!-- wrappers/KFileInput.vue -->
<template>
    <div class="k-file-input" :class="{ 'has-error': hasError, 'is-disabled': disabled }">
        <!-- Label -->
        <label v-if="label" class="k-label">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Telegram-style attachments -->
        <div 
            class="k-attachments"
            @dragover.prevent
            @drop.prevent="handleDrop"
        >
            <!-- Add Button -->
            <label 
                v-if="showAddButton"
                class="k-attach add" 
                :class="{ 'disabled': disabled || (maxCount && files.length >= maxCount) }"
            >
                <Plus class="icon" />
                <input
                    ref="fileInputRef"
                    type="file"
                    :multiple="multiple"
                    :accept="accept"
                    :disabled="disabled"
                    style="display: none"
                    @change="handleFileSelect"
                />
            </label>

            <!-- Placeholder (empty state) -->
            <span v-if="!files.length && placeholder" class="k-placeholder">{{ placeholder }}</span>

            <!-- File Cards -->
            <div
                v-for="(file, index) in files"
                :key="file.id"
                class="k-attach"
                :title="getFileTooltip(file)"
            >
                <!-- Preview / Icon -->
                <div class="k-attach-preview" @click="() => downloadFile(file)">
                    <img 
                        v-if="isImage(file) && getFilePreview(file)" 
                        :src="getFilePreview(file) ?? ''" 
                        class="file-thumbnail"
                    />
                    <span v-else class="k-file-ext">
                        {{ getFileExtension(file) }}
                    </span>
                </div>

                <!-- Info -->
                <div class="k-attach-info">
                    <span class="k-attach-name" :title="getFileName(file)">
                        {{ getFileName(file) }}
                    </span>
                    <span class="k-attach-sub">
                        {{ isImage(file) ? 'تصویر' : 'پیوست' }}
                        <span v-if="getFileSize(file)"> • {{ formatBytes(getFileSize(file)) }}</span>
                    </span>
                </div>

                <!-- Remove button -->
                <X class="k-remove" @click.stop="removeFile(index)" />
            </div>
        </div>

        <!-- Hint / Error -->
        <div v-if="hint && !errorMessage" class="k-hint">{{ hint }}</div>
        <div v-if="errorMessage" class="k-error">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { useFileHelper, type NormalizedFile } from '../composables/useFileHelper'

// Props
const props = defineProps<{
    modelValue?: File | File[] | string | string[] | null
    label?: string
    hint?: string
    placeholder?: string
    multiple?: boolean
    accept?: string
    maxSize?: number
    maxCount?: number
    disabled?: boolean
    required?: boolean
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: File | File[] | string | string[] | null]
    'change': [value: File | File[] | string | string[] | null]
    'remove': [index: number]
    'error': [error: string]
}>()

// File helper
const {
    normalizeValue,
    isDuplicate,
    getFileName,
    getFileExtension,
    getFileSize,
    formatBytes,
    isImage,
    getFilePreview,
    toOriginalFormat,
    cleanupUrls,
    downloadFile,
    getFileTooltip,
    isFileObject,
    isUrlString,
    normalizeItem
} = useFileHelper()


// Refs
const fileInputRef = ref<HTMLInputElement | null>(null)
const files = ref<NormalizedFile[]>([])
const error = ref<string | null>(null)

// Show add button condition
const showAddButton = computed(() => {
    if (props.disabled) return false
    if (props.maxCount && files.value.length >= props.maxCount) return false
    if (!props.multiple && files.value.length >= 1) return false
    return true
})

// Computed
const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

// Handle file selection from input
const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement
    const selectedFiles = Array.from(target.files || [])
    if (!selectedFiles.length) return
    
    addFiles(selectedFiles)
    target.value = '' // Reset input
}

// Add files (core logic)
const addFiles = (newFiles: File[]) => {
    // Don't add if disabled or max reached
    if (props.disabled) return
    if (props.maxCount && files.value.length >= props.maxCount) return

    // Size guard (maxSize is in bytes, matches KImageUpload)
    if (props.maxSize) {
        const oversized = newFiles.filter(f => f.size > props.maxSize!)
        if (oversized.length) {
            const limit = props.maxSize >= 1024 * 1024
                ? `${(props.maxSize / 1024 / 1024).toFixed(1)} مگابایت`
                : `${Math.round(props.maxSize / 1024)} کیلوبایت`
            const msg = `حجم فایل باید کمتر از ${limit} باشد`
            error.value = msg
            emits('error', msg)
        }
        newFiles = newFiles.filter(f => f.size <= props.maxSize!)
        if (!newFiles.length) return
    }
    
    // For single mode, replace existing files
    if (!props.multiple) {
        // Cleanup old preview URLs
        files.value.forEach(f => {
            if (!f.isExisting && f.file?.type?.startsWith('image/')) {
                URL.revokeObjectURL(f.url || '')
            }
        })
        
        const newItems = newFiles.slice(0, 1).map(f => ({
            id: `${f.name}-${f.size}-${f.lastModified}`,
            name: f.name,
            size: f.size,
            type: f.type,
            file: f,
            isNew: true,
            isExisting: false
        }))
        
        files.value = newItems
        error.value = null
        emitValue()
        return
    }
    
    // For multiple mode, filter duplicates and append
    const newItems = newFiles.map(f => ({
        id: `${f.name}-${f.size}-${f.lastModified}`,
        name: f.name,
        size: f.size,
        type: f.type,
        file: f,
        isNew: true,
        isExisting: false
    }))
    
    // Filter duplicates
    const uniqueNewItems = newItems.filter(item => !files.value.some(f => f.id === item.id))
    
    if (uniqueNewItems.length === 0) return
    
    // Check max count
    if (props.maxCount && files.value.length + uniqueNewItems.length > props.maxCount) {
        const remainingSlots = props.maxCount - files.value.length
        if (remainingSlots <= 0) {
            error.value = `حداکثر ${props.maxCount} فایل مجاز است`
            return
        }
        uniqueNewItems.length = remainingSlots
    }
    
    files.value = [...files.value, ...uniqueNewItems]
    error.value = null
    emitValue()
}

// Handle drop
const handleDrop = (e: DragEvent) => {
    if (props.disabled) return
    if (props.maxCount && files.value.length >= props.maxCount) return
    
    const droppedFiles = Array.from(e.dataTransfer?.files || [])
    if (droppedFiles.length) {
        addFiles(droppedFiles)
    }
}

// Emit value
const emitValue = () => {
    if (props.multiple) {
        const emitFiles = files.value.map(f => {
            if (f.isExisting && f.url) return f.url
            if (f.file) return f.file
            return ''
        })
        emits('update:modelValue', emitFiles as any)
        emits('change', emitFiles as any)
    } else {
        if (files.value.length > 0) {
            const first = files.value[0]
            const emitVal = first?.isExisting && first?.url ? first.url : (first?.file || null)
            emits('update:modelValue', emitVal)
            emits('change', emitVal)
        } else {
            emits('update:modelValue', null)
            emits('change', null)
        }
    }
}

// Remove file
const removeFile = (index: number) => {
    const file = files.value[index]
    if (file && !file.isExisting && file.file?.type?.startsWith('image/')) {
        try {
            URL.revokeObjectURL(file.url || '')
        } catch {}
    }
    
    files.value.splice(index, 1)
    emitValue()
    emits('remove', index)
    if (error.value) error.value = null
}

// Initialize from props
const initFromProps = () => {
    files.value = normalizeValue(props.modelValue)
}

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    const normalized = normalizeValue(newVal)
    if (JSON.stringify(normalized.map(f => f.id)) !== JSON.stringify(files.value.map(f => f.id))) {
        files.value = normalized
    }
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
    cleanupUrls()
})

initFromProps()

// Expose
defineExpose({
    clear: () => {
        files.value = []
        emitValue()
    },
    getFiles: () => files.value
})
</script>

<style scoped>
/* ... styles remain the same ... */
.k-file-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

.k-attachments {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.k-placeholder {
    font-size: 0.78rem;
    color: var(--k-text-muted);
}

.k-attach {
    position: relative;
    height: 52px;
    min-width: 150px;
    max-width: 180px;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.k-attach:hover {
    background: var(--k-surface-hover);
    border-color: var(--k-primary);
}

.k-attach.add {
    width: 52px;
    min-width: 52px;
    justify-content: center;
    background: var(--k-surface);
    border: 1px dashed var(--k-border);
    color: var(--k-text-secondary);
}

.k-attach.add:hover {
    border-color: var(--k-primary);
    background: var(--k-primary-light);
    color: var(--k-primary);
}

.k-attach.add.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-attach.add .icon {
    width: 20px;
    height: 20px;
}

.k-attach-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--k-primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
}

.file-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.k-file-ext {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--k-primary);
}

.k-attach-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
    flex: 1;
    min-width: 0;
}

.k-attach-name {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-attach-sub {
    font-size: 0.6rem;
    color: var(--k-text-muted);
}

.k-remove {
    width: 0;
    height: 26px;
    overflow: hidden;
    background: transparent;
    color: var(--k-text-muted);
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.k-attach:hover .k-remove {
    width: 26px;
    padding: 5px;
}

.k-remove:hover {
    background: var(--k-error-light);
    color: var(--k-error);
}

.k-hint {
    font-size: 0.7rem;
    color: var(--k-text-muted);
}

.k-error {
    font-size: 0.7rem;
    color: var(--k-error);
}

.k-file-input.is-disabled {
    opacity: 0.6;
}

.k-file-input.is-disabled .k-attach {
    cursor: not-allowed;
}

.k-file-input.has-error .k-attach:not(.add) {
    border-color: var(--k-error);
}

@media (max-width: 640px) {
    .k-attach {
        min-width: 130px;
        max-width: 150px;
        height: 48px;
    }
    
    .k-attach.add {
        width: 48px;
        min-width: 48px;
    }
    
    .k-attach-preview {
        width: 36px;
        height: 36px;
    }
    
    .k-attach-name {
        font-size: 0.7rem;
    }
}
</style>