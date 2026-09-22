<!-- wrappers/KImageUpload.vue -->
<template>
    <div 
        class="k-image-upload" 
        :class="{
            'has-error': hasError,
            'is-disabled': disabled,
            'is-single': !multiple,
            'is-multiple': multiple
        }"
    >
        <!-- Label -->
        <label v-if="label" class="k-label">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Main Image Area -->
        <div class="image-main-area" @click="triggerFileSelect">
            <!-- Existing Image Preview -->
            <div v-if="mainImage" class="main-image-wrapper">
                <img :src="mainImage.url" class="main-image" />
                
                <!-- Remove button -->
                <button class="image-remove-btn" @click.stop="removeMainImage" title="حذف">
                    <X class="icon" />
                </button>
                
                <!-- Edit overlay -->
                <div class="image-overlay">
                    <Camera class="overlay-icon" />
                    <span>تغییر تصویر</span>
                </div>
            </div>
            
            <!-- Empty State (Upload Icon) -->
            <div v-else class="upload-area">
                <div class="upload-icon">
                    <ImagePlus class="icon" />
                </div>
                <span class="upload-text">{{ placeholder || 'آپلود تصویر' }}</span>
                <span v-if="hint && !hasError" class="upload-hint">{{ hint }}</span>
            </div>
            
            <!-- Loading Overlay -->
            <div v-if="uploading" class="loading-overlay">
                <Loader2 class="spin icon" />
                <span>در حال آپلود...</span>
            </div>
        </div>

        <!-- Error Message for Main Image -->
        <div v-if="errorMessage && !multiple" class="k-error">
            <AlertCircle class="error-icon" />
            {{ errorMessage }}
        </div>

        <!-- Thumbnail Strip (for multiple images) -->
        <div v-if="multiple && (thumbnailImages.length > 0 || canAddMore)" class="thumbnail-strip-wrapper">
            <div class="thumbnail-strip" :class="{ 'has-scroll': thumbnailImages.length > 3 }">
                <!-- Add More Button (sticky left) -->
                <div 
                    v-if="canAddMore"
                    class="thumbnail-item add-more"
                    @click="triggerFileSelect"
                >
                    <ImagePlus class="icon" />
                    <span class="add-more-text">{{ thumbnailImages.length === 0 ? 'افزودن' : '+' }}</span>
                </div>
                
                <!-- Thumbnails -->
                <div 
                    v-for="(img, index) in thumbnailImages" 
                    :key="img.id"
                    class="thumbnail-item"
                    :class="{ active: mainImage?.id === img.id, 'has-error': imageErrors[img.id] }"
                    @click="setMainImage(img)"
                >
                    <img :src="img.url" class="thumbnail-img" />
                    
                    <!-- Error indicator on thumbnail -->
                    <div v-if="imageErrors[img.id]" class="thumbnail-error" :title="imageErrors[img.id]">
                        <AlertCircle class="icon-small" />
                    </div>
                    
                    <!-- Remove button -->
                    <button class="thumbnail-remove" @click.stop="removeImage(index + 1)">
                        <X class="icon-small" />
                    </button>
                </div>
            </div>
            
            <!-- Error Message for Multiple (summary) -->
            <div v-if="errorMessage && multiple" class="k-error">
                <AlertCircle class="error-icon" />
                {{ errorMessage }}
            </div>
        </div>

        <!-- Hidden File Input -->
        <CoreFile
            ref="coreFileRef"
            v-model="internalFiles"
            :multiple="multiple"
            :accept="accept || 'image/*'"
            :max-size="maxSize"
            :max-count="maxCount"
            :disabled="disabled"
            :required="required"
            @change="handleFileChange"
            @validate="handleValidation"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { ImagePlus, X, Camera, Loader2, AlertCircle } from 'lucide-vue-next'
import CoreFile from '../core/CoreFile.vue'

// Props
const props = defineProps<{
    modelValue?: File | File[] | string | string[] | null
    label?: string
    hint?: string
    placeholder?: string
    multiple?: boolean
    accept?: string
    maxSize?: number          // in bytes
    maxCount?: number
    disabled?: boolean
    required?: boolean
    uploading?: boolean
    imageSize?: number         // Width/height in px for main image (default: 120)
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: File | File[] | string | string[] | null]
    'change': [value: File | File[] | string | string[] | null]
    'remove': [index: number]
    'error': [error: string]
}>()

// Refs
const coreFileRef = ref<InstanceType<typeof CoreFile> | null>(null)
const internalFiles = ref<any[]>([])
const images = ref<any[]>([])
const error = ref<string | null>(null)
const imageErrors = ref<Record<string, string>>({})
let objectUrls: string[] = []

// Image interface
interface ImageItem {
    id: string
    url: string
    file?: File
    isExisting: boolean
    size?: number
    type?: string
}

// Main image (first image)
const mainImage = computed(() => images.value[0] || null)

// Thumbnail images (all images except first)
const thumbnailImages = computed(() => images.value.slice(1))

// Can add more images
const canAddMore = computed(() => {
    if (!props.multiple) return false
    return !props.maxCount || images.value.length < props.maxCount
})

// Computed
const hasError = computed(() => !!error.value || Object.keys(imageErrors.value).length > 0)
const errorMessage = computed(() => error.value)

// Image size style
const imageSizeStyle = computed(() => {
    const size = props.imageSize || 120
    return {
        width: `${size}px`,
        height: `${size}px`
    }
})

// Helper functions
const isFileObject = (value: any): boolean => {
    return value && typeof value === 'object' && 'name' in value && 'size' in value
}

const isUrlString = (value: any): boolean => {
    return typeof value === 'string' && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:') || value.startsWith('blob:'))
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Validate single image
const validateImage = (item: ImageItem): string | null => {
    if (props.maxSize && item.size && item.size > props.maxSize) {
        return `حجم تصویر باید کمتر از ${(props.maxSize / 1024 / 1024).toFixed(1)} مگابایت باشد`
    }
    if (props.accept && item.type && !props.accept.includes(item.type)) {
        return `فرمت تصویر مجاز نیست. فرمت‌های مجاز: ${props.accept}`
    }
    return null
}

// Normalize item to ImageItem
const normalizeToImageItem = (item: any): ImageItem | null => {
    if (!item) return null
    if (item.url && item.id) return item as ImageItem
    
    if (isFileObject(item) && item.type?.startsWith('image/')) {
        const url = URL.createObjectURL(item)
        objectUrls.push(url)
        const imageItem = {
            id: generateId(),
            url,
            file: item,
            isExisting: false,
            size: item.size,
            type: item.type
        }
        // Validate image
        const validationError = validateImage(imageItem)
        if (validationError) {
            imageErrors.value[imageItem.id] = validationError
        } else {
            delete imageErrors.value[imageItem.id]
        }
        return imageItem
    }
    
    if (isUrlString(item)) {
        const imageItem = {
            id: generateId(),
            url: item,
            isExisting: true
        }
        return imageItem
    }
    
    return null
}

// Normalize array
const normalizeImages = (val: any): ImageItem[] => {
    if (!val) return []
    if (Array.isArray(val)) {
        return val.map(v => normalizeToImageItem(v)).filter(Boolean) as ImageItem[]
    }
    const normalized = normalizeToImageItem(val)
    return normalized ? [normalized] : []
}

// Clear error for specific image
const clearImageError = (imageId: string) => {
    delete imageErrors.value[imageId]
}

// Handle file change from CoreFile
const handleFileChange = (val: File | File[] | null) => {
    if (!val) return
    
    let newFiles: File[] = []
    if (Array.isArray(val)) {
        newFiles = val
    } else {
        newFiles = [val]
    }
    
    // Filter only images
    const imageFiles = newFiles.filter(f => f.type?.startsWith('image/'))
    
    if (imageFiles.length === 0 && newFiles.length > 0) {
        error.value = 'لطفاً فقط فایل‌های تصویری انتخاب کنید'
        return
    }
    
    // Convert to ImageItems with validation
    const newImages: ImageItem[] = []
    for (const f of imageFiles) {
        const url = URL.createObjectURL(f)
        objectUrls.push(url)
        const imageItem = {
            id: generateId(),
            url,
            file: f,
            isExisting: false,
            size: f.size,
            type: f.type
        }
        const validationError = validateImage(imageItem)
        if (validationError) {
            imageErrors.value[imageItem.id] = validationError
            emits('error', validationError)
        }
        newImages.push(imageItem)
    }
    
    if (!props.multiple) {
        // Single mode: replace
        images.value = newImages.slice(0, 1)
    } else {
        // Multiple mode: append
        const currentIds = images.value.map(i => i.id)
        const uniqueNew = newImages.filter(img => !currentIds.includes(img.id))
        
        if (props.maxCount && images.value.length + uniqueNew.length > props.maxCount) {
            const remaining = props.maxCount - images.value.length
            if (remaining <= 0) {
                error.value = `حداکثر ${props.maxCount} تصویر مجاز است`
                return
            }
            uniqueNew.length = remaining
        }
        
        images.value = [...images.value, ...uniqueNew]
    }
    
    // Clear main error if any
    error.value = null
    emitValue()
}

// Handle validation from CoreFile
const handleValidation = (result: any) => {
    if (!result.isValid && result.errors?.length > 0) {
        error.value = result.errors[0].error
        emits('error', result.errors[0].error)
    }
}

// Set main image (for multiple mode)
const setMainImage = (img: ImageItem) => {
    if (!props.multiple) return
    const currentIndex = images.value.findIndex(i => i.id === img.id)
    if (currentIndex !== -1 && currentIndex !== 0) {
        const newImages = [img, ...images.value.filter(i => i.id !== img.id)]
        images.value = newImages
        emitValue()
    }
}

// Remove image
const removeImage = (index: number) => {
    const removed = images.value[index]
    if (removed && !removed.isExisting && removed.url) {
        try { URL.revokeObjectURL(removed.url) } catch {}
    }
    clearImageError(removed.id)
    
    images.value.splice(index, 1)
    emitValue()
    emits('remove', index)
}

// Remove main image
const removeMainImage = () => {
    if (images.value.length > 0) {
        removeImage(0)
    }
}

// Emit value
const emitValue = () => {
    if (props.multiple) {
        const emitFiles = images.value.map(img => img.isExisting ? img.url : img.file)
        emits('update:modelValue', emitFiles)
        emits('change', emitFiles)
    } else {
        if (images.value.length > 0) {
            const first = images.value[0]
            const emitVal = first.isExisting ? first.url : first.file
            emits('update:modelValue', emitVal)
            emits('change', emitVal)
        } else {
            emits('update:modelValue', null)
            emits('change', null)
        }
    }
}

// Trigger file select
const triggerFileSelect = () => {
    if (!props.disabled && (!props.maxCount || images.value.length < props.maxCount)) {
        coreFileRef.value?.openDialog()
    }
}

// Initialize from props
const initFromProps = () => {
    images.value = normalizeImages(props.modelValue)
}

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    const normalized = normalizeImages(newVal)
    if (JSON.stringify(normalized.map(i => i.id)) !== JSON.stringify(images.value.map(i => i.id))) {
        images.value = normalized
    }
}, { deep: true })

// Cleanup object URLs
onUnmounted(() => {
    objectUrls.forEach(url => {
        try { URL.revokeObjectURL(url) } catch {}
    })
    objectUrls = []
})

// Initialize
initFromProps()

// Expose
defineExpose({
    clear: () => {
        images.value = []
        coreFileRef.value?.clear()
        emitValue()
    },
    getImages: () => images.value
})
</script>

<style scoped>
.k-image-upload {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

/* Label */
.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

/* Main Image Area */
.image-main-area {
    position: relative;
    width: 120px;
    height: 120px;
    background: var(--k-surface);
    border: 2px solid var(--k-border);
    border-radius: var(--k-radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
}

.k-image-upload.has-error .image-main-area {
    border-color: var(--k-error);
}

.image-main-area:hover {
    border-color: var(--k-primary);
}

.main-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: white;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.main-image-wrapper:hover .image-overlay {
    opacity: 1;
}

.overlay-icon {
    width: 20px;
    height: 20px;
}

.image-remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.2s;
    z-index: 1;
}

.image-remove-btn:hover {
    background: var(--k-error);
    transform: scale(1.05);
}

/* Upload Area */
.upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 8px;
    color: var(--k-text-muted);
}

.upload-icon {
    width: 48px;
    height: 48px;
    border: 2px dashed var(--k-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-icon .icon {
    width: 24px;
    height: 24px;
}

.upload-text {
    font-size: 0.75rem;
    font-weight: 500;
}

.upload-hint {
    font-size: 0.65rem;
    opacity: 0.7;
}

/* Loading Overlay */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: white;
    font-size: 0.7rem;
}

.spin {
    animation: spin 0.8s linear infinite;
}

/* Thumbnail Strip Wrapper */
.thumbnail-strip-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* Thumbnail Strip - Horizontal scroll */
.thumbnail-strip {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
}

.thumbnail-strip.has-scroll {
    overflow-x: auto;
}

/* Custom scrollbar */
.thumbnail-strip::-webkit-scrollbar {
    height: 4px;
}

.thumbnail-strip::-webkit-scrollbar-track {
    background: var(--k-border);
    border-radius: 2px;
}

.thumbnail-strip::-webkit-scrollbar-thumb {
    background: var(--k-text-muted);
    border-radius: 2px;
}

/* Thumbnail Item */
.thumbnail-item {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: var(--k-radius-sm);
    border: 2px solid transparent;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.thumbnail-item.active {
    border-color: var(--k-primary);
}

.thumbnail-item.has-error {
    border-color: var(--k-error);
}

.thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Thumbnail Error Indicator */
.thumbnail-error {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: var(--k-error);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.thumbnail-error .icon-small {
    width: 10px;
    height: 10px;
}

/* Thumbnail Remove Button */
.thumbnail-remove {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 18px;
    height: 18px;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
}

.thumbnail-item:hover .thumbnail-remove {
    opacity: 1;
}

.thumbnail-remove:hover {
    background: var(--k-error);
    transform: scale(1.05);
}

.icon-small {
    width: 10px;
    height: 10px;
}

/* Add More Button (sticky left) */
.thumbnail-item.add-more {
    border: 2px dashed var(--k-border);
    background: var(--k-surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 0.6rem;
    color: var(--k-text-muted);
    position: sticky;
    left: 0;
    z-index: 1;
    flex-shrink: 0;
}

.thumbnail-item.add-more .icon {
    width: 20px;
    height: 20px;
}

.add-more-text {
    font-size: 0.65rem;
}

/* Error Message */
.k-error {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    color: var(--k-error);
}

.error-icon {
    width: 12px;
    height: 12px;
}

/* Single mode specific */
.k-image-upload.is-single .image-main-area {
    width: 150px;
    height: 150px;
}

/* Animations */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
    .image-main-area {
        width: 100px;
        height: 100px;
    }
    
    .k-image-upload.is-single .image-main-area {
        width: 120px;
        height: 120px;
    }
    
    .thumbnail-item {
        width: 50px;
        height: 50px;
    }
    
    .upload-text {
        font-size: 0.7rem;
    }
}
</style>