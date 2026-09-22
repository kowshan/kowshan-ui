<!-- components/KTimePickerModal.vue -->
<template>
    <KModal
        :visible="visible"
        :title="title"
        size="sm"
        @update:visible="onOverlay"
    >
        <!-- Live preview + now -->
        <div dir="ltr" class="k-tpm-preview">
            <span class="k-tpm-time">{{ displayPreview }}</span>
            <button type="button" class="k-tpm-now" @click="goNow">
                اکنون
            </button>
        </div>

        <!-- Wheel -->
        <KWheelPicker
            :columns="columns"
            :model-value="[hour, minute, second]"
            :rows="5"
            :item-height="42"
            @update:model-value="onWheelChange"
        />

        <!-- Footer -->
        <template #footer>
            <KButton
                text="انصراف"
                bg-color="#f1f5f9"
                text-color="#475569"
                @click="cancel"
            />
            <KButton
                text="تأیید"
                bg-color="#1db954"
                text-color="#ffffff"
                @click="confirm"
            />
        </template>
    </KModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KModal from './KModal.vue'
import KButton from './KButton.vue'
import KWheelPicker, { type KWheelColumn } from './KWheelPicker.vue'

const props = withDefaults(defineProps<{
    visible: boolean
    /** time value "HH:mm" or "HH:mm:ss" (24h) */
    modelValue?: string | null
    title?: string
    /** include the seconds column and output */
    showSeconds?: boolean
    /** output format of the emitted value */
    outputFormat?: 'HH:mm' | 'HH:mm:ss'
}>(), {
    modelValue: null,
    title: 'انتخاب ساعت',
    showSeconds: false,
    outputFormat: 'HH:mm'
})

const emits = defineEmits<{
    'update:visible': [value: boolean]
    'update:modelValue': [value: string]
    'confirm': [value: string]
    'cancel': []
}>()

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const seconds = Array.from({ length: 60 }, (_, i) => i)

const now = new Date()
const hour = ref(now.getHours())
const minute = ref(now.getMinutes())
const second = ref(now.getSeconds())

const columns = computed<KWheelColumn[]>(() => {
    const cols: KWheelColumn[] = [
        { key: 'hour', values: hours.map(h => faPad(h)) },
        { key: 'minute', values: minutes.map(m => faPad(m)) },
    ]
    if (props.showSeconds) {
        cols.push({ key: 'second', values: seconds.map(s => faPad(s)) })
    }
    return cols
})

const pad = (n: number) => String(n).padStart(2, '0')
const faPad = (n: number) => pad(n)

const displayPreview = computed(() => {
    const h = faPad(hour.value)
    const m = faPad(minute.value)
    return props.showSeconds ? `${h}:${m}:${faPad(second.value)}` : `${h}:${m}`
})

const onWheelChange = (indices: number[]) => {
    hour.value = indices[0] ?? 0
    minute.value = indices[1] ?? 0
    second.value = indices[2] ?? 0
}

const goNow = () => {
    const d = new Date()
    hour.value = d.getHours()
    minute.value = d.getMinutes()
    second.value = d.getSeconds()
}

/* Init from modelValue on open */
watch(() => props.visible, (v) => {
    if (!v) return
    let h = now.getHours()
    let m = now.getMinutes()
    let s = now.getSeconds()
    if (props.modelValue) {
        const parts = props.modelValue.split(':').map(Number)
        if (parts.length >= 2 && parts.every(n => !isNaN(n))) {
            h = parts[0]; m = parts[1]
            if (parts[2] != null) s = parts[2]
        }
    }
    hour.value = Math.min(23, Math.max(0, h))
    minute.value = Math.min(59, Math.max(0, m))
    second.value = Math.min(59, Math.max(0, s))
})

const onOverlay = (v: boolean) => {
    if (!v) emits('cancel')
    emits('update:visible', v)
}

const confirm = () => {
    const base = `${pad(hour.value)}:${pad(minute.value)}`
    const value = props.showSeconds || props.outputFormat === 'HH:mm:ss'
        ? `${base}:${pad(second.value)}`
        : base
    emits('update:modelValue', value)
    emits('confirm', value)
    emits('update:visible', false)
}

const cancel = () => {
    emits('cancel')
    emits('update:visible', false)
}
</script>

<style scoped>
.k-tpm-preview {
    text-align: center;
    padding: 6px 0 14px 0;
    border-bottom: 1px dashed var(--k-border, #e2e8f0);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.k-tpm-time {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--k-primary, #1db954);
    direction: ltr;
    letter-spacing: 1px;
}

.k-tpm-now {
    margin-right: auto;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    border: 1px solid color-mix(in srgb, var(--k-primary, #1db954) 30%, transparent);
    border-radius: 999px;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.k-tpm-now:hover {
    background: color-mix(in srgb, var(--k-primary, #1db954) 20%, transparent);
}
</style>
