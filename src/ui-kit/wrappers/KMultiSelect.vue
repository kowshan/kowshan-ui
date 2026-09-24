<!-- wrappers/KMultiSelect.vue -->
<template>
    <div 
        class="k-multiselect" 
        :class="[
            customClass,
            {
                'has-error': hasError,
                'has-value': hasValue,
                'is-focused': isFocused,
                'is-disabled': disabled,
                'is-open': isOpen
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
        <div class="k-multiselect-container">
            <!-- Left Icon -->
            <div v-if="leftIcon" class="k-icon left" @click="focusTrigger">
                <component :is="leftIcon" class="icon" />
            </div>

            <!-- Select Trigger -->
            <div 
                ref="triggerRef"
                class="k-multiselect-trigger"
                @click="toggleDropdown"
                @keydown="handleKeydown"
                tabindex="0"
            >
                <!-- Selected Tags -->
                <div class="k-multiselect-tags">
                    <div 
                        v-for="item in selectedItems.slice(0, 3)" 
                        :key="getOptionValue(item)"
                        class="k-multiselect-tag"
                    >
                        <span class="tag-label">{{ getOptionLabel(item) }}</span>
                        <X 
                            class="tag-remove" 
                            @click.stop="removeItem(item)"
                        />
                    </div>
                    <div v-if="selectedItems.length > 3">
                        + {{ selectedItems.length - 3 }} مورد
                    </div>
                    
                    <!-- Placeholder -->
                    <span v-if="!selectedItems.length" class="k-multiselect-placeholder">
                        {{ placeholder || 'انتخاب کنید...' }}
                    </span>
                </div>

                <div class="trigger-icons">
                    <X 
                        v-if="clearable && hasValue && !disabled && !readonly" 
                        class="clear-icon" 
                        @click.stop="clearAll"
                    />
                    <ChevronDown class="chevron-icon" />
                </div>
            </div>

            <!-- Dropdown Menu -->
            <Transition name="dropdown-fade">
                <Teleport to="#k-teleport-hub">
                <div v-if="isOpen" class="k-multiselect-dropdown" ref="dropdownRef" :style="dropdownStyle" @mousedown.stop>
                    <!-- Search Input -->
                    <div v-if="searchable" class="k-multiselect-search">
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
                    <div class="k-multiselect-options">
                        <!-- Select All Option -->
                        <div 
                            v-if="showSelectAll && allOptions.length > 0"
                            class="k-multiselect-option select-all"
                            @click="toggleAll"
                        >
                            <KCheckbox
                                :model-value="allSelected"
                                :indeterminate="someSelected && !allSelected"
                                size="sm"
                            />
                            <span class="option-label">انتخاب همه</span>
                            <span class="option-count">
                                ({{ selectedItems.length }}/{{ allOptions.length }})
                            </span>

                            
                        </div>

                        <!-- Regular Options -->
                        <div
                            v-for="option in displayOptions"
                            :key="getOptionValue(option)"
                            class="k-multiselect-option"
                            :class="{
                                'is-selected': isSelected(option),
                                'is-disabled': isOptionDisabled(option)
                            }"
                            @click="toggleOption(option)"
                        >
                            <KCheckbox 
                                :model-value="isSelected(option)"
                                size="sm"
                                @click.prevent
                            />
                            <component 
                                v-if="option.icon" 
                                :is="option.icon" 
                                class="option-icon" 
                            />
                            <span class="option-label">{{ getOptionLabel(option) }}</span>
                        </div>
                        
                        <!-- Creatable Option -->
                        <div 
                            v-if="creatable && searchQuery && !isOptionExisting(searchQuery)"
                            class="k-multiselect-option creatable"
                            @click="createOption"
                        >
                            <div class="plus-icon-wrapper">
                                <Plus class="plus-icon" />
                            </div>
                            <span class="option-label">افزودن "{{ searchQuery }}"</span>
                        </div>
                        
                        <!-- No Results -->
                        <div v-if="!displayOptions.length && !searchLoading" class="k-multiselect-empty">
                            موردی یافت نشد
                        </div>
                    </div>
                </div>
                </Teleport>
            </Transition>
        </div>

        <!-- Message Area -->
        <div v-if="errorMessage || hint" class="k-message-area">
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
import { ChevronDown, Search, Check, AlertCircle, Info, X, Loader2, Plus } from 'lucide-vue-next'
import { useKitId } from '../composables/useKitId'
import KCheckbox from './KCheckbox.vue';

// Props
const props = defineProps<{
    modelValue?: any[]
    options?: any[]
    valueKey?: string
    labelKey?: string
    
    // UI
    label?: string
    hint?: string
    placeholder?: string
    searchPlaceholder?: string
    leftIcon?: any
    clearable?: boolean
    searchable?: boolean
    creatable?: boolean
    showSelectAll?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    loading?: boolean
    
    // Limits
    maxItems?: number
    minItems?: number
    
    // Validation
    rules?: any[]
    
    // Async Search
    asyncSearch?: (query: string) => Promise<any[]>
    searchDebounce?: number
    
    // Styling
    customClass?: string
    iconSize?: number
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: any[]]
    'change': [value: any[]]
    'focus': [value: any[]]
    'blur': [value: any[]]
    'clear': []
}>()

// IDs
const { id: selectId } = useKitId('multiselect')

// Refs
const triggerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const isFocused = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const searchLoading = ref(false)
const internalValue = ref<any[]>(props.modelValue || [])
const asyncOptions = ref<any[]>([])

// Dropdown position — fixed to the trigger rect
const positionTick = ref(0)
const dropdownStyle = computed(() => {
    void positionTick.value
    if (!isOpen.value || !triggerRef.value) return {}
    const rect = triggerRef.value.getBoundingClientRect()
    const estHeight = 264
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
const repositionDropdown = () => {
    if (isOpen.value) positionTick.value++
}

// Computed
const hasValue = computed(() => internalValue.value.length > 0)
const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value)

// Selected items
const selectedItems = computed(() => internalValue.value || [])

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

// Select all state
const allSelected = computed(() => {
    if (allOptions.value.length === 0) return false
    return allOptions.value.every(opt => isSelected(opt))
})

const someSelected = computed(() => {
    if (allOptions.value.length === 0) return false
    const selectedCount = allOptions.value.filter(opt => isSelected(opt)).length
    return selectedCount > 0 && selectedCount < allOptions.value.length
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
    return internalValue.value.some(item => getOptionValue(item) === optionValue)
}

const isOptionDisabled = (option: any) => {
    return option.disabled === true
}

const isOptionExisting = (query: string) => {
    return allOptions.value.some(opt => 
        getOptionLabel(opt).toLowerCase() === query.toLowerCase()
    )
}

// Toggle individual option
const toggleOption = (option: any) => {
    if (isOptionDisabled(option) || props.disabled || props.readonly) return
    
    const optionValue = getOptionValue(option)
    const isAlreadySelected = isSelected(option)
    
    if (isAlreadySelected) {
        internalValue.value = internalValue.value.filter(item => getOptionValue(item) !== optionValue)
    } else {
        if (props.maxItems && internalValue.value.length >= props.maxItems) {
            error.value = `حداکثر ${props.maxItems} مورد قابل انتخاب است`
            return
        }
        internalValue.value = [...internalValue.value, option]
    }
    
    emits('update:modelValue', internalValue.value)
    emits('change', internalValue.value)
    runValidation()
}

// Remove single item
const removeItem = (item: any) => {
    internalValue.value = internalValue.value.filter(i => getOptionValue(i) !== getOptionValue(item))
    emits('update:modelValue', internalValue.value)
    emits('change', internalValue.value)
    runValidation()
}

// Clear all
const clearAll = () => {
    internalValue.value = []
    emits('update:modelValue', [])
    emits('clear')
    runValidation()
}

// Fix 1: Debug toggleAll
const toggleAll = () => {
    const selectableOptions = allOptions.value.filter(opt => !isOptionDisabled(opt))
    
    if (selectableOptions.length === 0) return
    
    const allSelectableSelected = selectableOptions.every(opt => isSelected(opt))
    
    if (allSelectableSelected) {
        // Deselect all
        const selectableValues = selectableOptions.map(opt => getOptionValue(opt))
        internalValue.value = internalValue.value.filter(item => 
            !selectableValues.includes(getOptionValue(item))
        )
    } else {
        // Select up to maxItems limit
        let itemsToAdd = selectableOptions.filter(opt => !isSelected(opt))
        
        if (props.maxItems) {
            const remainingSlots = props.maxItems - internalValue.value.length
            if (remainingSlots <= 0) {
                error.value = `حداکثر ${props.maxItems} مورد قابل انتخاب است`
                return
            }
            itemsToAdd = itemsToAdd.slice(0, remainingSlots)
        }
        
        internalValue.value = [...internalValue.value, ...itemsToAdd]
        
        if (itemsToAdd.length < selectableOptions.filter(opt => !isSelected(opt)).length) {
            error.value = `تنها ${itemsToAdd.length} مورد از ${selectableOptions.length} مورد انتخاب شد (حداکثر ${props.maxItems})`
        }
    }
    
    emits('update:modelValue', internalValue.value)
    emits('change', internalValue.value)
    runValidation()
}

// Create new option
const createOption = () => {
    if (!searchQuery.value) return
    
    const newOption = {
        [props.valueKey || 'value']: searchQuery.value,
        [props.labelKey || 'label']: searchQuery.value,
        isCustom: true
    }
    
    // Add to options if async or static
    if (props.asyncSearch) {
        asyncOptions.value = [...asyncOptions.value, newOption]
    } else if (props.options && !isOptionExisting(searchQuery.value)) {
        // For static options, we need to add to parent, but for now just select it
        // The parent component should handle adding to options
    }
    
    // Select the new option
    toggleOption(newOption)
    searchQuery.value = ''
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

// Search handler
let searchTimeout: any = null
const handleSearch = () => {
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

// Validation
const runValidation = () => {
    if (!props.rules?.length && !props.minItems) {
        error.value = null
        return true
    }
    
    // Min items validation
    if (props.minItems && internalValue.value.length < props.minItems) {
        error.value = `حداقل ${props.minItems} مورد باید انتخاب شود`
        return false
    }
    
    // Custom rules
    for (const rule of props.rules || []) {
        if ('required' in rule && rule.required && !hasValue.value) {
            error.value = rule.message || 'این فیلد الزامی است'
            return false
        }
        if ('minItems' in rule && internalValue.value.length < rule.minItems) {
            error.value = rule.message || `حداقل ${rule.minItems} مورد باید انتخاب شود`
            return false
        }
        if ('maxItems' in rule && internalValue.value.length > rule.maxItems) {
            error.value = rule.message || `حداکثر ${rule.maxItems} مورد قابل انتخاب است`
            return false
        }
    }
    
    error.value = null
    return true
}

// Focus/blur handlers
const handleFocus = () => {
    isFocused.value = true
    runValidation()
}

const handleBlur = () => {
    isFocused.value = false
    runValidation()
    emits('blur', internalValue.value)
}

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(internalValue.value)) {
        internalValue.value = newVal || []
        runValidation()
    }
})

// Watch open state
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
    clear: clearAll,
    validate: runValidation,
    selectedItems: () => selectedItems.value
})
</script>

<style scoped>
.k-multiselect {
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

.k-multiselect.is-focused .k-label {
    color: var(--k-text-primary);
}

.k-multiselect.has-error .k-label {
    color: var(--k-error);
}

.k-required {
    color: var(--k-error);
    margin-inline-start: 4px;
}

/* Container */
.k-multiselect-container {
    position: relative;
}

/* Trigger */
.k-multiselect-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    padding: 6px 12px;
    min-height: 36px;
    cursor: pointer;
    transition: border-color 0.15s ease;
    flex-wrap: wrap;
    gap: 6px;
}

.k-multiselect:not(.is-disabled) .k-multiselect-trigger:hover {
    border-color: var(--k-text-secondary);
}

.k-multiselect.is-focused .k-multiselect-trigger {
    border-color: var(--k-primary);
}

.k-multiselect.has-error .k-multiselect-trigger {
    border-color: var(--k-error);
}

.k-multiselect.is-disabled .k-multiselect-trigger {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--k-surface);
}

/* Tags */
.k-multiselect-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
}

.k-multiselect-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--k-primary-light);
    color: var(--k-primary);
    border-radius: var(--k-radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
}

.tag-remove {
    width: 12px;
    height: 12px;
    cursor: pointer;
    transition: color 0.15s;
}

.tag-remove:hover {
    color: var(--k-error);
}

/* Placeholder */
.k-multiselect-placeholder {
    color: var(--k-text-muted);
    font-size: 0.85rem;
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

.k-multiselect.is-open .chevron-icon {
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

.k-icon.left ~ .k-multiselect-trigger {
    padding-left: 36px;
}

.icon {
    width: var(--k-icon-size, 16px);
    height: var(--k-icon-size, 16px);
}

/* Dropdown */
.k-multiselect-dropdown {
    background: var(--k-bg);
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: var(--k-font-family, 'yekan-bakh', 'B Nazanin', Tahoma, sans-serif);
    color: var(--k-text-primary);
    direction: rtl;
}

/* Search */
.k-multiselect-search {
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

/* Add plus icon styles */
.plus-icon-wrapper {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.plus-icon {
    width: 16px;
    height: 16px;
    color: var(--k-primary);
}

/* Creatable option styling */
.k-multiselect-option.creatable {
    color: var(--k-primary);
    border-top: 1px solid var(--k-border);
    background: var(--k-primary-light);
}

.k-multiselect-option.creatable:hover {
    background: var(--k-primary-light);
    opacity: 0.8;
}

.k-multiselect-search input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.8rem;
    color: var(--k-text-primary);
}

/* Options */
.k-multiselect-options {
    overflow-y: auto;
    max-height: 250px;
}

/* Option */
.k-multiselect-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    min-height: 40px;
    cursor: pointer;
    transition: background 0.1s ease;
    font-size: 0.85rem;
    color: var(--k-text-primary);
}

.k-multiselect-option:hover {
    background: var(--k-surface-hover);
}

.k-multiselect-option.is-selected {
    background: var(--k-primary-light);
}

.k-multiselect-option.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Select All */
.k-multiselect-option.select-all {
    border-bottom: 1px solid var(--k-border);
    position: sticky;
    top: 0;
    background: var(--k-bg);
    z-index: 1;
}

.option-count {
    font-size: 0.7rem;
    color: var(--k-text-muted);
}

/* Creatable */
.k-multiselect-option.creatable {
    color: var(--k-primary);
    border-top: 1px solid var(--k-border);
    background: var(--k-primary-light);
}

.k-multiselect-option.creatable:hover {
    background: var(--k-primary-light);
}

/* Simple Checkbox */
.simple-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid var(--k-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    background: var(--k-bg);
    flex-shrink: 0;
}

.simple-checkbox.checked {
    background: var(--k-primary);
    border-color: var(--k-primary);
}

.simple-checkbox.indeterminate {
    background: var(--k-primary);
    border-color: var(--k-primary);
}

.check-mark {
    color: white;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
}

.simple-checkbox:not(.checked) .check-mark {
    display: none;
}

.simple-checkbox.indeterminate .check-mark {
    display: block;
    font-size: 14px;
}

.option-icon {
    width: var(--k-icon-size, 16px);
    height: var(--k-icon-size, 16px);
    flex-shrink: 0;
}

.option-label {
    flex: 1;
}

/* Empty */
.k-multiselect-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    text-align: center;
    font-size: 0.75rem;
    color: var(--k-text-muted);
}

/* Animation */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: all 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
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
.k-multiselect-options::-webkit-scrollbar {
    width: 6px;
}

.k-multiselect-options::-webkit-scrollbar-track {
    background: var(--k-border);
    border-radius: 3px;
}

.k-multiselect-options::-webkit-scrollbar-thumb {
    background: var(--k-text-muted);
    border-radius: 3px;
}

/* Focus Ring */
.k-multiselect-trigger:focus-visible {
    outline: 2px solid var(--k-primary);
    outline-offset: 2px;
}
</style>