// composables/useFileHelper.ts

import { ref, onUnmounted } from 'vue'

export interface NormalizedFile {
    id: string
    name: string
    size: number
    type: string
    url?: string
    isNew: boolean
    isExisting: boolean
    file?: File
}

export function useFileHelper() {
    let fileIdCounter = 0
    let objectUrls: string[] = []

    // Helper: Check if value is a File object
    const isFileObject = (value: any): boolean => {
        return value && typeof value === 'object' && 'name' in value && 'size' in value && !('url' in value)
    }

    // Helper: Check if value is a URL
    const isUrlString = (value: any): boolean => {
        return typeof value === 'string' && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:') || value.startsWith('blob:'))
    }

    // Generate unique file ID
    const generateFileId = (file: any): string => {
        if (isFileObject(file)) {
            return `${file.name}-${file.size}-${file.lastModified}`
        }
        if (isUrlString(file)) {
            return `url-${file}`
        }
        return `file-${Date.now()}-${Math.random()}`
    }

    // Get file extension from URL (handles query params and special cases)
    const getExtensionFromUrl = (url: string): string => {
        if (!url) return ''
        
        try {
            // Remove query parameters
            const urlWithoutParams = url.split('?')[0] ?? ""
            // Get the last part after the last slash
            const filename = urlWithoutParams.split('/').pop() || ''
            // Get extension
            const match = filename.match(/\.([^./?#]+)$/i)
            const ext = match ? match?.[1]?.toLowerCase() : ''
            
            // Special handling for GitHub avatars (they don't have extensions but are images)
            if (url.includes('avatars.githubusercontent.com')) {
                return 'jpg'  // GitHub avatars are JPEG
            }
            
            // Handle common image hosting services
            if (url.includes('picsum.photos') || url.includes('unsplash.com')) {
                return 'jpg'
            }
            
            return ext ?? ""
        } catch {
            return ''
        }
    }


    // Get MIME type from extension
    const getMimeTypeFromExtension = (ext: string): string => {
        const mimeTypes: Record<string, string> = {
            // Images
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'jpe': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'bmp': 'image/bmp',
            'ico': 'image/x-icon',
            'heic': 'image/heic',
            'heif': 'image/heif',
            // Documents
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // Media
            'mp4': 'video/mp4',
            'mp3': 'audio/mpeg',
            // Archives
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
            '7z': 'application/x-7z-compressed',
            // Text
            'txt': 'text/plain',
            'json': 'application/json',
            'xml': 'application/xml',
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript'
        }
        return mimeTypes[ext.toLowerCase()] || 'application/octet-stream'
}

    // Normalize single item
    const normalizeItem = (item: any): NormalizedFile | null => {
        if (!item) return null
        if (typeof item === 'object' && 'id' in item) return item as NormalizedFile
        
        // Handle File object
        if (isFileObject(item)) {
            return {
                id: generateFileId(item),
                name: item.name,
                size: item.size,
                type: item.type,
                isNew: true,
                isExisting: false,
                file: item
            }
        }
        
        // Handle URL string
        if (isUrlString(item)) {
            let fileName = item.split('/').pop() || 'file'
            fileName = fileName.split('?')[0]
            fileName = decodeURIComponent(fileName)
            
            const ext = getExtensionFromUrl(item)
            
            // Determine MIME type based on extension or URL patterns
            let mimeType = getMimeTypeFromExtension(ext)
            
            // Special case: if it's a GitHub avatar or known image hosting
            if (item.includes('avatars.githubusercontent.com') || 
                item.includes('picsum.photos') || 
                item.includes('unsplash.com')) {
                mimeType = 'image/jpeg'
            }
            
            // If extension is empty but URL looks like an image, assume it's an image
            if (!ext && (item.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || 
                        item.includes('avatars.githubusercontent.com') ||
                        item.includes('picsum.photos'))) {
                mimeType = 'image/jpeg'
            }
            
            return {
                id: generateFileId(item),
                name: fileName,
                size: 0,
                type: mimeType,
                url: item,
                isNew: false,
                isExisting: true
            }
        }
        
        return null
    }

    // Normalize array
    const normalizeValue = (val: any): NormalizedFile[] => {
        if (!val) return []
        if (Array.isArray(val)) {
            return val.map(v => normalizeItem(v)).filter(Boolean) as NormalizedFile[]
        }
        const normalized = normalizeItem(val)
        return normalized ? [normalized] : []
    }

    // Check if file is duplicate
    const isDuplicate = (file: NormalizedFile, existingFiles: NormalizedFile[]): boolean => {
        return existingFiles.some(f => f.id === file.id)
    }

    // Get file name (handles URLs with query params)
    const getFileName = (file: NormalizedFile): string => {
        if (!file) return ''
        if (file.name && !file.url) return file.name
        
        if (file.url) {
            let name = file.url.split('/').pop() || 'file'
            name = name.split('?')[0] ?? ""
            name = decodeURIComponent(name)
            return name
        }
        
        if (file.file && file.file.name) return file.file.name
        
        return 'file'
    }

    // Get file extension
    const getFileExtension = (file: NormalizedFile): string => {
        const name = getFileName(file)
        const ext = name.split('.').pop()
        return ext ? ext.toUpperCase().slice(0, 4) : 'FILE'
    }

    // Get file size
    const getFileSize = (file: NormalizedFile): number => {
        if (file.size) return file.size
        return 0
    }

    // Format bytes
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Check if file is image
    const isImage = (file: NormalizedFile): boolean => {
        if (!file) return false
        
        // Check by MIME type
        if (file.type && typeof file.type === 'string') {
            if (file.type.startsWith('image/')) {
                return true
            }
        }
        
        // For URLs, check by extension or URL patterns
        if (file.url) {
            const url = file.url.toLowerCase()
            
            // Check common image extensions
            if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(url)) {
                return true
            }
            
            // Check image hosting services
            if (url.includes('avatars.githubusercontent.com') ||
                url.includes('picsum.photos') ||
                url.includes('unsplash.com') ||
                url.includes('cloudinary.com') ||
                url.includes('imgur.com')) {
                return true
            }
        }
        
        // Check by file name if it's a File object
        if (file.file && file.file.name) {
            return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(file.file.name)
        }
        
        return false
    }

    // Get file preview (for images) - returns the full URL
    const getFilePreview = (file: NormalizedFile): string | null => {
        if (!file) return null
        
        // For existing file URLs (images from server)
        if (file.url && isImage(file)) {
            return file.url
        }
        
        // For new File objects that are images
        if (file.file && file.file.type?.startsWith('image/')) {
            try {
                const url = URL.createObjectURL(file.file)
                objectUrls.push(url)
                return url
            } catch {
                return null
            }
        }
        
        return null
    }

    // Get file type
    const getFileType = (file: NormalizedFile): string => {
        if (file.type) return file.type
        
        if (file.url) {
            const ext = getExtensionFromUrl(file.url)
            return getMimeTypeFromExtension(ext)
        }
        
        if (file.file) {
            const ext = getExtensionFromUrl(file.file.name)
            return getMimeTypeFromExtension(ext)
        }
        
        return 'application/octet-stream'
    }

    // Convert NormalizedFile back to original format for emit
    const toOriginalFormat = (file: NormalizedFile): File | string => {
        if (file.isExisting && file.url) return file.url
        if (file.file) return file.file
        // Fallback: return the file object as is (should not happen)
        return file.url || ''
    }


    // Cleanup object URLs
    const cleanupUrls = () => {
        objectUrls.forEach(url => {
            try { URL.revokeObjectURL(url) } catch {}
        })
        objectUrls = []
    }

    // Download file
    const downloadFile = (file: NormalizedFile) => {
        if (!file) return
        
        if (file.isExisting && file.url) {
            window.open(file.url, '_blank')
        } else if (file.file) {
            const url = URL.createObjectURL(file.file)
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            setTimeout(() => URL.revokeObjectURL(url), 100)
        }
    }

    // Get tooltip
    const getFileTooltip = (file: NormalizedFile): string => {
        const size = getFileSize(file)
        const sizeText = size ? `\n${formatBytes(size)}` : ''
        return `${getFileName(file)}${sizeText}`
    }

    return {
        // Normalization
        normalizeValue,
        normalizeItem,
        
        // Validation
        isDuplicate,
        isFileObject,
        isUrlString,
        isImage,
        
        // Getters
        getFileName,
        getFileExtension,
        getFileSize,
        getFileType,
        getFilePreview,
        getFileTooltip,
        
        // Formatting
        formatBytes,
        
        // Conversion
        toOriginalFormat,
        
        // Actions
        downloadFile,
        cleanupUrls,
        
        // Helpers
        getExtensionFromUrl,
        getMimeTypeFromExtension
    }
}