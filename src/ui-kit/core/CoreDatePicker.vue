<!-- core/CoreDatePicker.vue -->
<template>
    <div class="core-datepicker">
        <!-- Input Fields -->
        <div class="input-parts">
            <template v-for="(part, idx) in parsedParts" :key="idx">
                <span v-if="part.type === 'separator'" class="separator-text">
                    {{ part.value }}
                </span>
                
                <div
                    v-else
                    class="input-wrapper"
                    :class="{ 'error': activeError === part.key }"
                >
                    <input
                        :ref="(el) => setInputRef(el, idx)"
                        type="text"
                        inputmode="numeric"
                        :value="getPartValue(part.key!)"
                        :placeholder="getDynamicPlaceholder(part.key!)"
                        :maxlength="part.length"
                        :disabled="disabled"
                        :readonly="readonly"
                        class="core-datepicker-part"
                        @input="(e) => !disabled && !readonly && handleInput(e, part.key!, idx)"
                        @keydown="(e) => !disabled && !readonly && navigation.handleKeydown(e, idx)"
                        @focus="!disabled && !readonly && handleFocus(idx, part.key!)"
                        @blur="!disabled && !readonly && handleBlur(part.key!)"
                    />
                </div>
            </template>
        </div>
        
        <!-- Hint Tooltip -->
        <Transition name="hint-fade">
            <div 
                v-if="activeHintKey" 
                class="core-datepicker-hint"
            >
                <div class="hint-main">
                    <span class="hint-label">{{ getActiveHintLabel() }}</span>
                    <span class="hint-range">{{ getActiveHintRange() }}</span>
                </div>
                <div class="hint-diff" v-if="getTimeDiff()">
                    {{ getTimeDiff() }}
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useDateTimeParser } from '../calendar/composables/useDateTimeParser'
import { useDateTimeValidation } from '../calendar/composables/useDateTimeValidation'
import { useDateTimeNavigation } from '../calendar/composables/useDateTimeNavigation'
import { usePersianNumbers } from '../composables/usePersianNumbers'
import { toGregorian, toJalali } from '../calendar/core/calendarEngine'

const { normalize } = usePersianNumbers()

// Props
const props = defineProps<{
    format?: string
    modelValue?: string
    outputFormat?: 'jalali' | 'gregorian'
    disabled?: boolean
    readonly?: boolean
}>()

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
    'focus': [value: string]
    'blur': [value: string]
}>()

// Parser helpers
const { 
    parsedParts, 
    partConfigs,
    getPrevInputIndex,
    getNextInputIndex,
} = useDateTimeParser(props.format || 'yyyy/mm/dd')

// Validation helpers
const validation = useDateTimeValidation(partConfigs)

// Refs
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const internalValues = ref<Record<string, string>>({})
const activeError = ref<string | null>(null)
const activeHintKey = ref<string | null>(null)
let hintTimeout: any = null
let errorTimeout: any = null

// Navigation helpers
const navigation = useDateTimeNavigation(
    parsedParts,
    inputRefs,
    getPrevInputIndex,
    getNextInputIndex
)

// Parse a date string according to format and return Jalali parts
const parseDateString = (dateStr: string): Record<string, string> => {
    if (!dateStr) return {}
    
    // If output format is Gregorian, the input might be Gregorian
    if (props.outputFormat === 'gregorian') {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
            const jalali = toJalali(date)
            return {
                yyyy: jalali.year.toString().padStart(4, '0'),
                mm: jalali.month.toString().padStart(2, '0'),
                dd: jalali.day.toString().padStart(2, '0'),
                hh: date.getHours().toString().padStart(2, '0'),
                mi: date.getMinutes().toString().padStart(2, '0'),
                ss: date.getSeconds().toString().padStart(2, '0'),
            }
        }
    }
    
    // Try to parse as formatted string
    const parts = dateStr.split(/[-\/:\s]/)
    const result: Record<string, string> = {}
    let partIndex = 0
    
    for (const part of parsedParts.value) {
        if (part.type === 'input' && part.key && parts[partIndex]) {
            result[part.key] = parts[partIndex]?.padStart(part.length, '0') ?? ''
            partIndex++
        }
    }
    
    return result
}

// Build output string from Jalali parts
const buildOutputString = (values: Record<string, string>): string => {
    // If outputFormat is gregorian, convert to ISO
    if (props.outputFormat === 'gregorian' && values['yyyy'] && values['mm'] && values['dd']) {
        const year = parseInt(values['yyyy'])
        const month = parseInt(values['mm'])
        const day = parseInt(values['dd'])
        const hour = parseInt(values['hh'] || '0')
        const minute = parseInt(values['mi'] || '0')
        const second = parseInt(values['ss'] || '0')
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const gregorianDate = toGregorian(year, month, day)
            gregorianDate.setHours(hour, minute, second)
            return gregorianDate.toISOString()
        }
    }
    
    // Otherwise, build string according to format
    let result = props.format || 'yyyy/mm/dd'
    for (const [key, value] of Object.entries(values)) {
        if (value) {
            const padded = value.padStart(partConfigs[key]?.length || 2, '0')
            result = result.replace(key, padded)
        }
    }
    return result
}

// Update internal values from external modelValue
const updateFromExternal = () => {
    if (!props.modelValue) {
        for (const part of parsedParts.value) {
            if (part.type === 'input' && part.key) {
                internalValues.value[part.key] = ''
            }
        }
        return
    }
    
    const parsed = parseDateString(props.modelValue)
    for (const part of parsedParts.value) {
        if (part.type === 'input' && part.key) {
            internalValues.value[part.key] = parsed[part.key] || ''
        }
    }
}

// Update external modelValue from internal values
const updateExternal = () => {
    // Check if all fields are filled
    let hasEmpty = false
    for (const part of parsedParts.value) {
        if (part.type === 'input' && part.key) {
            const val = internalValues.value[part.key]
            if (!val || val.length !== (part as any).length) {
                hasEmpty = true
                break
            }
        }
    }
    
    if (hasEmpty) return
    
    const output = buildOutputString(internalValues.value)
    emits('update:modelValue', output)
    emits('change', output)
}

// Get input part value
const getPartValue = (key: string): string => {
    return internalValues.value[key] || ''
}

// Get placeholder value
const getDynamicPlaceholder = (key: string): string => {
    return validation.getDynamicPlaceholder(key, internalValues.value)
}

// Get current hint label
const getActiveHintLabel = () => {
    if (!activeHintKey.value) return ''
    const config = partConfigs[activeHintKey.value]
    return config?.placeholder || config?.label ||''
}

// Get current hint range
const getActiveHintRange = () => {
    if (!activeHintKey.value) return ''
    const key = activeHintKey.value
    
    if (key === 'dd') {
        const year = internalValues.value['yyyy']
        const month = internalValues.value['mm']
        if (year && month && year.length === 4 && month.length === 2) {
            const maxDay = validation.getMaxDayInMonth(parseInt(year), parseInt(month))
            return `1 - ${maxDay}`
        }
    }
    
    const config = partConfigs[key]
    return config ? `${config.min} - ${config.max}` : ''
}

// Input ref setter
const setInputRef = (el: any, index: number) => {
    if (el) {
        inputRefs.value[index] = el
    }
}

// Error trigger handler
const triggerError = (key: string) => {
    activeError.value = key
    
    if ("vibrate" in navigator) {
        navigator.vibrate(50)
    }
    
    if (errorTimeout) clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => {
        activeError.value = null
    }, 500)
}

// Show hint
const showHint = (key: string) => {
    activeHintKey.value = key
    if (hintTimeout) clearTimeout(hintTimeout)
    hintTimeout = setTimeout(() => {
        activeHintKey.value = null
    }, 2000)
}

// Input handler
const handleInput = (event: Event, key: string, currentIndex: number) => {
    const input = event.target as HTMLInputElement
    // convert Persian/Arabic digits typed by the user to Latin first
    let value = normalize(input.value).replace(/[^\d]/g, '')
    const config = parsedParts.value[currentIndex] as any
    
    if (value.length > config.length) {
        event.preventDefault()
        return
    }
    
    if (value.length === 1) {
        const firstDigit = value[0]
        if (!validation.isValidFirstDigit(key, firstDigit ?? '')) {
            triggerError(key)
            event.preventDefault()
            return
        }
    }
    
    if (value.length === config.length) {
        const isValid = validation.isValidValue(key, value, internalValues.value)
        if (!isValid) {
            triggerError(key)
            event.preventDefault()
            return
        }
    }
    
    internalValues.value[key] = value
    
    const isLastField = getNextInputIndex(currentIndex) === -1
    if (value.length === config.length && isLastField) {
        nextTick(() => {
            input.blur()
        })
    } else if (value.length === config.length) {
        navigation.focusNext(currentIndex)
    }
    
    updateExternal()
}

// Focus handler
const handleFocus = (index: number, key: string) => {
    navigation.onFocus(index)
    activeError.value = null
    showHint(key)
    emits('focus', internalValues.value[key] || '')
}

// Blur handler
const handleBlur = (key: string) => {
    navigation.onBlur()
    activeHintKey.value = null
    
    const value = internalValues.value[key]
    const config = partConfigs[key]
    
    if (!config) {
        emits('blur', value || '')
        return
    }
    
    // Auto-format: add leading zeros if needed
    if (value && value.length > 0 && value.length < config.length) {
        const padded = value.padStart(config.length, '0')
        internalValues.value[key] = padded
        
        const index = findInputIndexByKey(key)
        if (index !== -1 && inputRefs.value[index]) {
            inputRefs.value[index]!.value = padded
        }
    }
    
    // Range validation and correction
    if (value && value.length === config.length) {
        let num = parseInt(value)
        let corrected = false
        
        if (num < config.min) {
            internalValues.value[key] = config.min.toString().padStart(config.length, '0')
            corrected = true
        } else if (num > config.max) {
            internalValues.value[key] = config.max.toString().padStart(config.length, '0')
            corrected = true
        }
        
        if (!corrected && key === 'dd') {
            const year = internalValues.value['yyyy']
            const month = internalValues.value['mm']
            if (year && month && year.length === 4 && month.length === 2) {
                const maxDay = validation.getMaxDayInMonth(parseInt(year), parseInt(month))
                if (num > maxDay) {
                    internalValues.value[key] = maxDay.toString().padStart(config.length, '0')
                    corrected = true
                }
            }
        }
        
        if (corrected) {
            const index = findInputIndexByKey(key)
            if (index !== -1 && inputRefs.value[index]) {
                inputRefs.value[index]!.value = internalValues.value[key] ?? ''
            }
        }
    }
    
    updateExternal()
    emits('blur', buildOutputString(internalValues.value))
}

// Helper to find input index by key
const findInputIndexByKey = (targetKey: string): number => {
    for (let i = 0; i < parsedParts.value.length; i++) {
        const part = parsedParts.value[i]
        if (part.type === 'input' && part.key === targetKey) {
            return i
        }
    }
    return -1
}

// Helper to get time difference
const getTimeDiff = (): string => {
    const now = new Date()
    
    const year = internalValues.value['yyyy']
    const month = internalValues.value['mm']
    const day = internalValues.value['dd']
    
    if (!year || !month || !day) return ''
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) return ''
    
    const targetDate = new Date(
        toGregorian(parseInt(year), parseInt(month), parseInt(day))
    )
    
    if (isNaN(targetDate.getTime())) return ''
    
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'امروز'
    if (diffDays === 1) return 'فردا'
    if (diffDays === -1) return 'دیروز'
    if (diffDays > 0) return `${diffDays} روز دیگر`
    return `${Math.abs(diffDays)} روز پیش`
}

// Watch model value changes
watch(() => props.modelValue, () => {
    updateFromExternal()
})

// Lifecycle hooks
onMounted(() => {
    updateFromExternal()
})

// Expose for wrapper access (focus / blur / clear)
defineExpose({
    focus: () => inputRefs.value[0]?.focus(),
    blur: () => inputRefs.value.forEach(ref => ref?.blur()),
    clear: () => {
        for (const part of parsedParts.value) {
            if (part.type === 'input' && part.key) {
                internalValues.value[part.key] = ''
            }
        }
        updateExternal()
    }
})
</script>

<style scoped>
/* Core DatePicker - Uses K UI variables (--k-*) instead of --cal-* */
.core-datepicker {
    display: block;
    width: 100%;
}

.input-parts {
    display: flex;
    align-items: center;
    gap: 0px;
    direction: ltr;
    background: transparent;
    padding: 0;
}

.input-wrapper {
    position: relative;
    display: inline-block;
}

.core-datepicker-part {
    width: 35px;
    padding: 5px 4px;
    text-align: center;
    font-size: 0.7rem;
    font-family: monospace;
    border: none;
    border-bottom: 2px solid var(--k-border);
    background: transparent;
    color: var(--k-text-primary);
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
}

.core-datepicker-part.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-bottom-color: var(--k-text-muted);
}

.core-datepicker-part.readonly {
    cursor: default;
    border-bottom-style: dashed;
}

.core-datepicker-part.readonly:focus {
    border-bottom-color: var(--k-text-muted);
}

.core-datepicker-part:focus {
    border-bottom-color: var(--k-primary);
}

.core-datepicker-part::placeholder {
    color: var(--k-text-muted);
    opacity: 0.5;
    font-size: 0.65rem;
    text-align: center;
}

.input-wrapper.error .core-datepicker-part {
    animation: shake 0.3s ease-in-out;
    border-bottom-color: var(--k-error);
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
}

.separator-text {
    color: var(--k-text-secondary);
    font-size: 0.85rem;
    font-family: monospace;
    padding: 0 2px;
}

.core-datepicker-hint {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    margin-top: 8px;
    padding: 6px 10px;
    background: var(--k-surface);
    border: 1px solid var(--k-border);
    border-radius: 8px;
    font-size: 0.7rem;
    white-space: nowrap;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    direction: rtl;
}

.hint-main {
    display: flex;
    gap: 8px;
    direction: rtl;
}

.hint-diff {
    font-size: 0.6rem;
    color: var(--k-text-primary);
    border-top: 1px solid var(--k-border);
    padding-top: 4px;
    margin-top: 2px;
    text-align: center;
}

.hint-label {
    color: var(--k-text-primary);
    font-weight: 500;
}

.hint-range {
    color: var(--k-text-secondary);
    font-family: monospace;
}

.core-datepicker-hint::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 10px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent var(--k-border) transparent;
}

.core-datepicker-hint::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 10px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--k-surface) transparent;
    z-index: 1;
}

.hint-fade-enter-active,
.hint-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.hint-fade-enter-from {
    opacity: 0;
    transform: translateY(-5px);
}

.hint-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

@media (max-width: 640px) {
    .core-datepicker-part {
        width: 44px;
        font-size: 0.75rem;
        padding: 6px 2px;
    }
    
    .separator-text {
        font-size: 0.75rem;
    }
    
    .core-datepicker-hint {
        font-size: 0.6rem;
        padding: 4px 8px;
        white-space: normal;
        max-width: 120px;
    }
}
</style>