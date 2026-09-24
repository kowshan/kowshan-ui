<!-- components/KFileUpload.vue -->
<template>
    <div class="k-upload" :class="{ 'is-disabled': disabled }">
        <!-- Drop zone -->
        <div
            class="k-upload-zone"
            :class="{ 'is-dragging': dragging, 'has-files': files.length > 0 }"
            role="button"
            tabindex="0"
            :aria-label="label"
            @click="pick"
            @keydown.enter.prevent="pick"
            @keydown.space.prevent="pick"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
        >
            <span class="k-upload-icon">
                <UploadCloud class="icon" />
            </span>
            <div class="k-upload-text">
                <strong>{{ label }}</strong>
                <span class="k-upload-hint">{{ hint }}</span>
            </div>
            <span v-if="accept" class="k-upload-accept">{{ accept }}</span>
        </div>

        <input
            ref="inputRef"
            type="file"
            class="k-upload-input"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            @change="onPick"
        />

        <!-- File list -->
        <TransitionGroup v-if="files.length" name="k-upload" tag="ul" class="k-upload-list">
            <li v-for="f in files" :key="f.id" class="k-upload-item">
                <span class="k-upload-file-icon" :class="`ext-${extClass(f.name)}`">
                    <component :is="fileIcon(f.name)" class="icon" />
                </span>
                <div class="k-upload-file">
                    <span class="k-upload-file-name">{{ f.name }}</span>
                    <span class="k-upload-file-meta">
                        {{ f.size > 0 ? formatSize(f.size) : '' }}
                        <template v-if="f.error"><span class="is-error">{{ f.error }}</span></template>
                    </span>
                    <span
                        v-if="!f.error && f.progress < 100"
                        class="k-upload-progress"
                    >
                        <span class="k-upload-progress-bar" :style="{ width: f.progress + '%' }" />
                    </span>
                </div>
                <button
                    type="button"
                    class="k-upload-remove"
                    aria-label="حذف"
                    @click="removeFile(f.id)"
                >
                    <X class="icon" />
                </button>
            </li>
        </TransitionGroup>

        <!-- Add more -->
        <button
            v-if="multiple && files.length"
            type="button"
            class="k-upload-add"
            @click="pick"
        >
            <Plus class="icon" />
            افزودن فایل دیگر
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { File, FileImage, FileText, FileSpreadsheet, UploadCloud, X, Plus } from 'lucide-vue-next'

export interface KUploadFile {
    id: number
    name: string
    size: number
    progress: number
    error?: string
    file?: File
}

const props = withDefaults(defineProps<{
    modelValue?: KUploadFile[]
    label?: string
    hint?: string
    accept?: string
    multiple?: boolean
    disabled?: boolean
    /** max file size in MB; 0 = unlimited */
    maxSizeMB?: number
    /** simulate progress (demos) */
    simulateProgress?: boolean
}>(), {
    modelValue: () => [],
    label: 'فایل را اینجا رها کنید یا کلیک کنید',
    hint: 'حداکثر ۱۰ مگابایت برای هر فایل',
    multiple: true,
    disabled: false,
    maxSizeMB: 0,
    simulateProgress: false
})

const emits = defineEmits<{
    'update:modelValue': [value: KUploadFile[]]
    'change': [value: KUploadFile[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const files = ref<KUploadFile[]>([...props.modelValue])
let nextId = 1

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const extClass = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || ''
    return /png|jpe?g|gif|webp|svg/.test(ext) ? 'image' : /pdf/.test(ext) ? 'pdf' : /xls|xlsx|csv/.test(ext) ? 'sheet' : 'doc'
}

const fileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || ''
    if (/png|jpe?g|gif|webp|svg/.test(ext)) return FileImage
    if (/xls|xlsx|csv/.test(ext)) return FileSpreadsheet
    if (/txt|md|docx?|rtf/.test(ext)) return FileText
    return File
}

const validate = (raw: File): string | undefined => {
    if (props.maxSizeMB > 0 && raw.size > props.maxSizeMB * 1024 * 1024) {
        return `حجم بیش از ${props.maxSizeMB}MB`
    }
    return undefined
}

const addFiles = (rawList: FileList | File[]) => {
    const rawFiles = Array.from(rawList)
    for (const raw of rawFiles) {
        const item: KUploadFile = {
            id: nextId++,
            name: raw.name,
            size: raw.size,
            progress: props.simulateProgress ? 0 : 100,
            error: validate(raw),
            file: raw
        }
        files.value.push(item)
        if (props.simulateProgress && !item.error) {
            simulate(item)
        }
    }
    emits('update:modelValue', [...files.value])
    emits('change', [...files.value])
}

const simulate = (item: KUploadFile) => {
    const timer = setInterval(() => {
        if (item.progress >= 100) { clearInterval(timer); return }
        item.progress = Math.min(100, item.progress + 10 + Math.random() * 20)
        if (item.progress >= 100) clearInterval(timer)
    }, 160)
}

const onDrop = (e: DragEvent) => {
    dragging.value = false
    if (props.disabled) return
    if (e.dataTransfer?.files.length) addFiles(e.dataTransfer.files)
}

const pick = () => {
    if (props.disabled) return
    inputRef.value?.click()
}

const onPick = (e: Event) => {
    const el = e.target as HTMLInputElement
    if (el.files?.length) addFiles(el.files)
    el.value = ''
}

const removeFile = (id: number) => {
    files.value = files.value.filter(f => f.id !== id)
    emits('update:modelValue', [...files.value])
    emits('change', [...files.value])
}
</script>

<style scoped>
.k-upload {
    width: 100%;
}

.k-upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 26px 16px;
    border: 2px dashed var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    background: var(--k-surface, #f8fafc);
    cursor: pointer;
    text-align: center;
    transition: all 0.15s ease;
}

.k-upload-zone:hover,
.k-upload-zone.is-dragging {
    border-color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-upload-zone.is-dragging {
    transform: scale(1.01);
}

.k-upload-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-primary, #1db954);
}

.k-upload-icon .icon {
    width: 19px;
    height: 19px;
}

.k-upload-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.k-upload-text strong {
    font-size: 0.85rem;
    color: var(--k-text-primary, #1e293b);
}

.k-upload-hint {
    font-size: 0.72rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-upload-accept {
    font-size: 0.66rem;
    font-family: ui-monospace, monospace;
    color: var(--k-text-secondary, #64748b);
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 999px;
    padding: 2px 10px;
    direction: ltr;
}

.k-upload-input {
    display: none;
}

/* File list */
.k-upload-list {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.k-upload-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
}

.k-upload-file-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #eef2ff;
    color: #6366f1;
}

.k-upload-file-icon.ext-image { background: var(--k-success-light); color: var(--k-success); }
.k-upload-file-icon.ext-pdf { background: #fee2e2; color: #dc2626; }
.k-upload-file-icon.ext-sheet { background: var(--k-success-light); color: var(--k-success); }
.k-upload-file-icon.ext-doc { background: #eff6ff; color: #3b82f6; }

.k-upload-file-icon .icon {
    width: 16px;
    height: 16px;
}

.k-upload-file {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-upload-file-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-upload-file-meta {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-upload-file-meta .is-error {
    color: var(--k-error, #dc2626);
    font-weight: 600;
}

.k-upload-progress {
    height: 4px;
    background: var(--k-border, #e2e8f0);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 3px;
}

.k-upload-progress-bar {
    display: block;
    height: 100%;
    background: var(--k-primary, #1db954);
    border-radius: 999px;
    transition: width 0.2s ease;
}

.k-upload-remove {
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.k-upload-remove:hover {
    color: var(--k-error, #dc2626);
    background: color-mix(in srgb, var(--k-error, #dc2626) 10%, transparent);
}

.k-upload-remove .icon {
    width: 14px;
    height: 14px;
}

.k-upload-add {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px dashed var(--k-border, #e2e8f0);
    background: transparent;
    border-radius: 8px;
    padding: 6px 12px;
    font-family: inherit;
    font-size: 0.75rem;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-upload-add:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
}

.k-upload-add .icon {
    width: 14px;
    height: 14px;
}

/* Transition */
.k-upload-enter-active,
.k-upload-leave-active {
    transition: all 0.2s ease;
}

.k-upload-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}

.k-upload-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
