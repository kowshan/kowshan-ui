<!-- wrappers/KSelect.vue -->
<template>
    <div 
        class="k-select" 
        :class="[
            customClass,
            {
                'has-error': hasError,
                'has-value': hasValue,
                'is-focused': isFocused,
                'is-disabled': disabled,
                'is-open': isOpen,
                'has-left-icon': leftIcon,
                'has-right-icon': rightIcon
            }
        ]"
        :style="{ '--k-icon-size': `${iconSize || 16}px` }"
    >
        <!-- Label -->
        <label v-if="label" class="k-label" :for="selectId">
            {{ label }}
            <span v-if="required" class="k-required">*</span>
        </label>

        <!-- Select Container -->
        <div class="k-select-container">
            <!-- Left Icon -->
            <div v-if="leftIcon" class="k-icon left" @click="focusTrigger">
                <component :is="leftIcon" class="icon" />
            </div>

            <!-- Right Icon -->
            <div v-if="rightIcon" class="k-icon right">
                <component :is="rightIcon" class="icon" />
            </div>

            <!-- Select Trigger -->
            <div 
                ref="triggerRef"
                class="k-select-trigger"
                :class="{ 'has-placeholder': !hasValue }"
                @click="toggleDropdown"
                @keydown="handleKeydown"
                tabindex="0"
            >
                <span class="k-select-value">
                    {{ displayValue || placeholder || 'انتخاب کنید...' }}
                </span>
                <div class="trigger-icons">
                    <X 
                        v-if="clearable && hasValue && !disabled && !readonly" 
                        class="clear-icon" 
                        @click.stop="clearSelection"
                    />
                    <ChevronDown class="chevron-icon" />
                </div>
            </div>

        </div>

            <!-- Dropdown Menu (teleported so it overlays modals / scroll containers) -->
            <Transition name="dropdown-fade">
                <Teleport to="#k-teleport-hub">
                    <div v-if="isOpen" class="k-select-dropdown" ref="dropdownRef" :style="dropdownStyle"  @mousedown.stop>
                        <!-- Search Input -->
                        <div v-if="searchable" class="k-select-search">
                            <Search class="search-icon" />
                            <input
                                ref="searchInputRef"
                                v-model="searchQuery"
                                type="text"
                                :placeholder="searchPlaceholder || 'جستجو...'"
                                @click.stop
                                @input="handleSearch"
                            />
                            <Loader2 v-if="searchLoading" class="search-loading spin" />
                        </div>

                        <!-- Options List -->
                        <div class="k-select-options" :style="{ maxHeight: maxHeight }" >
                            <!-- Grouped Options -->
                            <template v-if="groupBy">
                                <div 
                                    v-for="(group, groupName) in groupedOptions"
                                    :key="groupName"
                                >
                                    <div class="k-select-group-header">{{ groupName }}</div>
                                    <div
                                        v-for="option in group"
                                        :key="getOptionValue(option)"
                                        class="k-select-option"
                                        :class="{
                                            'is-selected': isSelected(option),
                                            'is-disabled': isOptionDisabled(option)
                                        }"
                                        @click="selectOption(option)"
                                    >
                                        <component 
                                            v-if="option.icon" 
                                            :is="option.icon" 
                                            class="option-icon" 
                                        />
                                        <span class="option-label">{{ getOptionLabel(option) }}</span>
                                        <Check v-if="isSelected(option)" class="check-icon" />
                                    </div>
                                </div>
                            </template>
                            
                            <!-- Flat Options -->
                            <template v-else>
                                <div
                                    v-for="option in displayOptions"
                                    :key="getOptionValue(option)"
                                    class="k-select-option"
                                    :class="{
                                        'is-selected': isSelected(option),
                                        'is-disabled': isOptionDisabled(option)
                                    }"
                                    @click="selectOption(option)"
                                >
                                    <component 
                                        v-if="option.icon" 
                                        :is="option.icon" 
                                        class="option-icon" 
                                    />
                                    <span class="option-label">{{ getOptionLabel(option) }}</span>
                                    <Check v-if="isSelected(option)" class="check-icon" />
                                </div>
                            </template>
                            
                            <!-- Loading More -->
                            <div v-if="loadingMore" class="k-select-loading">
                                <Loader2 class="spin" /> در حال بارگذاری...
                            </div>
                            
                            <!-- No Results -->
                            <div v-if="!displayOptions.length && !searchLoading" class="k-select-empty">
                                موردی یافت نشد
                            </div>
                        </div>
                    </div>
                </Teleport>
            </Transition>

        <!-- Message Area -->
        <div class="k-message-area">
            <div v-if="errorMessage" class="k-error-message">
                <AlertCircle class="message-icon" />
                {{ errorMessage }}
            </div>
            <div v-else-if="hint" class="k-hint-message">
                <Info class="message-icon" />
                {{ hint }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Search, Check, AlertCircle, Info, X, Loader2 } from 'lucide-vue-next'
import { useKitId } from '../composables/useKitId'
import { usePersianNumbers } from '../composables/usePersianNumbers'

const { normalize } = usePersianNumbers()

// Props
const props = defineProps<{
    // Core
    modelValue?: any
    options?: any[]
    valueKey?: string
    labelKey?: string
    
    // UI
    label?: string
    hint?: string
    placeholder?: string
    searchPlaceholder?: string
    leftIcon?: any
    rightIcon?: any
    clearable?: boolean
    searchable?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    loading?: boolean
    
    // Validation
    rules?: any[]
    validateOn?: 'input' | 'blur' | 'both'
    
    // Async Search
    asyncSearch?: (query: string) => Promise<any[]>
    searchDebounce?: number
    
    // Grouping
    groupBy?: string
    
    // Styling
    customClass?: string
    iconSize?: number
    maxHeight?: string
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: any]
    'change': [value: any]
    'focus': [value: any]
    'blur': [value: any]
    'clear': []
}>()

// IDs
const { id: selectId } = useKitId('select')

// Refs
const triggerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const isFocused = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const searchLoading = ref(false)
const loadingMore = ref(false)
const internalValue = ref(props.modelValue)
const asyncOptions = ref<any[]>([])

// Dropdown position — fixed to the trigger rect so it overlays modals and scroll containers
const positionTick = ref(0)
const dropdownStyle = computed(() => {
    void positionTick.value
    if (!isOpen.value || !triggerRef.value) return {}

    const rect = triggerRef.value.getBoundingClientRect()
    const estHeight = 264 // dropdown max-height + search box + borders
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const openUp = spaceBelow < estHeight && rect.top > estHeight

    return {
        position: 'fixed' as const,
        top: openUp ? undefined : `${rect.bottom + 4}px`,
        bottom: openUp ? `${window.innerHeight - rect.top + 4}px` : undefined,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: '20000'
    }
})

// Reposition while open (modal body scroll / window resize)
const repositionDropdown = () => {
    if (isOpen.value) positionTick.value++
}

// Computed
const hasValue = computed(() => {
    return internalValue.value !== undefined && 
           internalValue.value !== null && 
           (Array.isArray(internalValue.value) ? internalValue.value.length > 0 : true)
})

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

// Get display text for selected value
const displayValue = computed(() => {
    if (!internalValue.value) return ''
    
    if (typeof internalValue.value === 'object') {
        const labelKey = props.labelKey || 'label'
        return internalValue.value[labelKey] || ''
    }
    
    const option = allOptions.value.find(opt => getOptionValue(opt) === internalValue.value)
        || (props.options || []).find(opt => getOptionValue(opt) === internalValue.value)
    return option ? getOptionLabel(option) : internalValue.value
})

// All options (static + async)
const allOptions = computed(() => {
    if (props.asyncSearch) {
        return asyncOptions.value
    }
    return props.options || []
})

// Display options (filtered by search)
const displayOptions = computed(() => {
    let opts = allOptions.value
    
    if (searchQuery.value && !props.asyncSearch) {
        const query = searchQuery.value.toLowerCase()
        opts = opts.filter(opt => {
            const label = getOptionLabel(opt).toLowerCase()
            return label.includes(query)
        })
    }
    
    return opts
})

// Grouped options
const groupedOptions = computed(() => {
    if (!props.groupBy) return {}
    
    const groups: Record<string, any[]> = {}
    displayOptions.value.forEach(option => {
        const groupValue = option[props.groupBy!] || 'سایر'
        if (!groups[groupValue]) groups[groupValue] = []
        groups[groupValue].push(option)
    })
    return groups
})

// Helper methods
const getOptionValue = (option: any) => {
    if (!option) return null
    if (typeof option === 'object') {
        return option[props.valueKey || 'value'] || option[props.labelKey || 'label'] || option
    }
    return option
}

const getOptionLabel = (option: any) => {
    if (!option) return ''
    if (typeof option === 'object') {
        return option[props.labelKey || 'label'] || option[props.valueKey || 'value'] || String(option)
    }
    return String(option)
}

const isSelected = (option: any) => {
    const optionValue = getOptionValue(option)
    const currentValue = internalValue.value
    
    if (currentValue === null || currentValue === undefined) return false
    
    if (typeof currentValue === 'object') {
        return getOptionValue(currentValue) === optionValue
    }
    return currentValue === optionValue
}

const isOptionDisabled = (option: any) => {
    return option.disabled === true
}

// Toggle dropdown
const toggleDropdown = () => {
    if (props.disabled || props.readonly) return
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        emits('focus', internalValue.value)
        nextTick(() => {
            if (props.searchable && searchInputRef.value) {
                searchInputRef.value.focus()
            }
        })
    }
}

// Select option
const selectOption = (option: any) => {
    if (isOptionDisabled(option)) return

    // emit the option's VALUE (per valueKey), not the raw option object —
    // consistent with getOptionValue/isSelected and native select behavior
    const value = getOptionValue(option)
    internalValue.value = value
    emits('update:modelValue', value)
    emits('change', value)
    runValidation()
    isOpen.value = false
    searchQuery.value = ''
}

// Clear selection
const clearSelection = () => {
    internalValue.value = null
    emits('update:modelValue', null)
    emits('clear')
    runValidation()
    if (triggerRef.value) triggerRef.value.focus()
}

// Search debounce
let searchTimeout: any = null
const handleSearch = () => {
    // normalize Persian/Arabic digits typed into the search box so
    // Latin-digit options still match (e.g. searching '۰۹۱۲' finds '0912')
    if (searchQuery.value) searchQuery.value = normalize(searchQuery.value)
    if (props.asyncSearch) {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(async () => {
            if (props.asyncSearch) {
                searchLoading.value = true
                try {
                    const results = await props.asyncSearch(searchQuery.value)
                    asyncOptions.value = results
                } finally {
                    searchLoading.value = false
                }
            }
        }, props.searchDebounce || 300)
    }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleDropdown()
    } else if (e.key === 'Escape') {
        isOpen.value = false
    } else if (e.key === 'Tab') {
        isOpen.value = false
    }
}

// Click outside
const handleClickOutside = (e: MouseEvent) => {
    if (triggerRef.value && !triggerRef.value.contains(e.target as Node) &&
        dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

// Focus trigger
const focusTrigger = () => {
    triggerRef.value?.focus()
}

// Validation handler
const runValidation = (phase: 'input' | 'blur' = 'input') => {
    const mode = props.validateOn ?? 'both'
    if (mode !== 'both' && mode !== phase) return true
    if (!props.rules?.length) {
        error.value = null
        return true
    }
    
    // Simple validation (can be enhanced with useValidation)
    for (const rule of props.rules) {
        if ('required' in rule && rule.required && !hasValue.value) {
            error.value = rule.message || 'این فیلد الزامی است'
            return false
        }
    }
    error.value = null
    return true
}

// Focus/blur handlers
const handleFocus = () => {
    isFocused.value = true
}

const handleBlur = () => {
    isFocused.value = false
    runValidation('blur')
    emits('blur', internalValue.value)
}

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal
        runValidation()
    }
})

// Watch open state to trigger initial load
watch(isOpen, (open) => {
    if (open && !displayOptions.value.length && props.asyncSearch && !searchQuery.value) {
        handleSearch()
    }
})

// Lifecycle
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', repositionDropdown, true)
    window.addEventListener('resize', repositionDropdown)
    if (triggerRef.value) {
        triggerRef.value.addEventListener('focus', handleFocus)
        triggerRef.value.addEventListener('blur', handleBlur)
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', repositionDropdown, true)
    window.removeEventListener('resize', repositionDropdown)
    if (triggerRef.value) {
        triggerRef.value.removeEventListener('focus', handleFocus)
        triggerRef.value.removeEventListener('blur', handleBlur)
    }
    if (searchTimeout) clearTimeout(searchTimeout)
})

// Expose
defineExpose({
    focus: focusTrigger,
    blur: () => triggerRef.value?.blur(),
    clear: clearSelection,
    validate: runValidation,
    isOpen: () => isOpen.value,
    close: () => { isOpen.value = false }
})
</script>

<style scoped>
.k-select {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
}

/* Label */
.k-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--k-text-secondary);
}

.k-select.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-select.has-error .k-label {
    color: var(--k-error);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

/* Select Container */
.k-select-container {
    position: relative;
}

/* Select Trigger */
.k-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    padding: 8px 12px;
    min-height: 36px;
    cursor: pointer;
    transition: border-color 0.15s ease;
}

.k-select-trigger.has-placeholder .k-select-value {
    color: var(--k-text-muted);
}

.k-select:not(.is-disabled) .k-select-trigger:hover {
    border-color: var(--k-text-secondary);
}

.k-select.is-focused .k-select-trigger {
    border-color: var(--k-primary);
}

.k-select.has-error .k-select-trigger {
    border-color: var(--k-error);
}

.k-select.is-disabled .k-select-trigger {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

/* Select Value */
.k-select-value {
    flex: 1;
    font-size: 0.85rem;
    color: var(--k-text-primary);
}

/* Icons */
.trigger-icons {
    display: flex;
    align-items: center;
    gap: 4px;
}

.clear-icon {
    width: 14px;
    height: 14px;
    color: var(--k-text-muted);
    cursor: pointer;
    transition: color 0.15s;
}

.clear-icon:hover {
    color: var(--k-error);
}

.chevron-icon {
    width: 16px;
    height: 16px;
    color: var(--k-text-muted);
    transition: transform 0.2s ease;
}

.k-select.is-open .chevron-icon {
    transform: rotate(180deg);
}

/* Left Icon */
.k-icon.left {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: var(--k-text-muted);
}

.k-icon.left ~ .k-select-trigger {
    padding-left: 36px;
}

/* Right Icon */
.k-icon.right {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: var(--k-text-muted);
    pointer-events: none;
}

.icon {
    width: var(--k-icon-size, 16px);
    height: var(--k-icon-size, 16px);
}

/* Dropdown Menu — position/size set inline via dropdownStyle (teleported to body) */
.k-select-dropdown {
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: var(--k-font-family, 'yekan-bakh', 'B Nazanin', Tahoma, sans-serif);
    color: var(--k-text-primary);
    direction: rtl;
}

/* Search Input */
.k-select-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--k-border);
}

.search-icon {
    width: 14px;
    height: 14px;
    color: var(--k-text-muted);
}

.search-loading {
    width: 14px;
    height: 14px;
    color: var(--k-primary);
}

.k-select-search input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.8rem;
    color: var(--k-text-primary);
    font-family: inherit;
}

.k-select-search input::placeholder {
    color: var(--k-text-muted);
}

/* Options List */
.k-select-options {
    overflow-y: auto;
    max-height: 250px;
}

/* Option */
.k-select-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    min-height: 40px;
    cursor: pointer;
    transition: background 0.1s ease;
    font-size: 0.85rem;
    color: var(--k-text-primary);
}

.k-select-option:hover {
    background: var(--k-surface-hover);
    font-family: inherit;
}

.k-select-option.is-selected {
    background: var(--k-primary-light);
    color: var(--k-primary);
    font-weight: 500;
}

.k-select-option.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.option-icon {
    width: var(--k-icon-size, 16px);
    height: var(--k-icon-size, 16px);
}

.option-label {
    flex: 1;
}

.check-icon {
    width: var(--k-icon-size, 16px);
    height: var(--k-icon-size, 16px);
    color: var(--k-primary);
}

/* Group Header */
.k-select-group-header {
    padding: 8px 12px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--k-text-muted);
    background: var(--k-surface);
    border-bottom: 1px solid var(--k-border);
    position: sticky;
    top: 0;
    z-index: 1;
}

/* Loading State */
.k-select-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    font-size: 0.75rem;
    color: var(--k-text-muted);
}

/* Empty State */
.k-select-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    text-align: center;
    font-size: 0.75rem;
    color: var(--k-text-muted);
}

.k-select-empty::before {
    content: '🔍';
    font-size: 24px;
    opacity: 0.5;
}

/* Message Area */
.k-message-area {
    font-size: 0.7rem;
}

.k-hint-message {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--k-text-muted);
}

.k-error-message {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--k-error);
}

.message-icon {
    width: 12px;
    height: 12px;
}

/* Scrollbar */
.k-select-options::-webkit-scrollbar {
    width: 6px;
}

.k-select-options::-webkit-scrollbar-track {
    background: var(--k-border);
    border-radius: 3px;
}

.k-select-options::-webkit-scrollbar-thumb {
    background: var(--k-text-muted);
    border-radius: 3px;
}

.k-select-options::-webkit-scrollbar-thumb:hover {
    background: var(--k-text-secondary);
}

/* Focus Ring */
.k-select-trigger:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}
</style>

<style>
/* Global — teleported dropdown needs unscoped transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: all 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>