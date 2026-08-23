// composables/useFileValidation.ts

export interface FileValidationError {
    file: File | null
    error: string
    type: 'size' | 'type' | 'count' | 'custom'
}

export interface FileValidationOptions {
    maxSize?: number
    minSize?: number
    maxCount?: number
    minCount?: number
    allowedTypes?: string[]
    customValidator?: (file: File, allFiles: File[]) => string | true
}

export interface FileValidationResult {
    isValid: boolean
    files: File[]
    errors: FileValidationError[]
}

export function useFileValidation() {
    
    // Format bytes to readable string
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // Validate single file
    const validateFile = (file: File, allFiles: File[], options: FileValidationOptions): string | null => {
        // Size validation
        if (options.maxSize && file.size > options.maxSize) {
            return `حجم فایل باید کمتر از ${formatBytes(options.maxSize)} باشد`
        }
        if (options.minSize && file.size < options.minSize) {
            return `حجم فایل باید بیشتر از ${formatBytes(options.minSize)} باشد`
        }
        
        // Type validation
        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            return `نوع فایل باید ${options.allowedTypes.join(', ')} باشد`
        }
        
        // Custom validator
        if (options.customValidator) {
            const result = options.customValidator(file, allFiles)
            if (result !== true) return result
        }
        
        return null
    }
    
    // Validate all files
    const validateFiles = (files: File[], options: FileValidationOptions): FileValidationResult => {
        const errors: FileValidationError[] = []
        
        // Count validation
        if (options.maxCount && files.length > options.maxCount) {
            errors.push({
                file: null,
                error: `حداکثر ${options.maxCount} فایل مجاز است`,
                type: 'count'
            })
        }
        if (options.minCount && files.length < options.minCount) {
            errors.push({
                file: null,
                error: `حداقل ${options.minCount} فایل الزامی است`,
                type: 'count'
            })
        }
        
        // Validate each file
        for (const file of files) {
            const error = validateFile(file, files, options)
            if (error) {
                errors.push({
                    file,
                    error,
                    type: error.includes('حجم') ? 'size' : (error.includes('نوع') ? 'type' : 'custom')
                })
            }
        }
        
        return {
            isValid: errors.length === 0,
            files,
            errors
        }
    }
    
    // Get file info
    const getFileInfo = (file: File) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        sizeFormatted: formatBytes(file.size),
        extension: file.name.split('.').pop(),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    })
    
    return {
        formatBytes,
        validateFile,
        validateFiles,
        getFileInfo
    }
}