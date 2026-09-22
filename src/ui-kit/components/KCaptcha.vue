<!-- components/KCaptcha.vue -->
<template>
    <div class="k-captcha" :class="{ 'is-disabled': disabled }">
        <!-- Image (fully visible — no overlay) -->
        <div class="k-captcha-box" :class="{ 'is-clickable': clickable }">
            <img
                v-if="src"
                class="k-captcha-img"
                :src="src"
                :alt="imgAlt"
                :style="{ height: height + 'px' }"
                loading="lazy"
                draggable="false"
                @click="onImgClick"
            />
            <div v-else class="k-captcha-empty" :style="{ height: height + 'px' }">
                <ImageIcon class="icon" />
            </div>
        </div>

        <!-- Actions row (under the image): voice / refresh / countdown -->
        <div v-if="showTools" class="k-captcha-tools">
            <button
                v-if="audioSrc"
                type="button"
                class="k-captcha-tool"
                aria-label="پخش صدا"
                title="پخش صدا"
                :disabled="disabled"
                @click="playAudio"
            >
                <Volume2 class="icon" />
                <span>شنیدن کد</span>
            </button>

            <button
                type="button"
                class="k-captcha-tool"
                aria-label="کد جدید"
                title="کد جدید"
                :disabled="disabled"
                @click="refresh"
            >
                <RefreshCw class="icon" />
                <span>کد جدید</span>
            </button>

            <span
                v-if="expiresIn && expiresIn > 0"
                class="k-captcha-timer"
                :class="{ 'is-expiring': remaining <= 10 }"
                :title="'انقضای کد'"
            >
                <Clock class="icon" />
                {{ remaining }} ثانیه
            </span>
        </div>

        <audio ref="audioRef" :src="audioSrc" preload="none" />

        <!-- Input -->
        <div class="k-captcha-field" :class="{ 'has-error': error }">
            <input
                v-model="value"
                type="text"
                class="k-captcha-input"
                :placeholder="placeholder"
                :disabled="disabled"
                :dir="inputDir"
                autocomplete="off"
                spellcheck="false"
                @keydown.enter="$emit('submit', value)"
            />
            <button
                v-if="value && !disabled"
                type="button"
                class="k-captcha-clear"
                aria-label="پاک کردن"
                @click="value = ''"
            >
                <X class="icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Clock, Image as ImageIcon, RefreshCw, Volume2, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    /** captcha image url (parent supplies on refresh) */
    src?: string
    /** optional audio url for the "شنیدن کد" button */
    audioSrc?: string
    modelValue?: string
    placeholder?: string
    height?: number
    disabled?: boolean
    error?: boolean
    /** ltr captcha input (digits/letters) */
    inputDir?: 'ltr' | 'rtl'
    imgAlt?: string
    /** when true, clicking the image refreshes too */
    clickable?: boolean
    /** hide the actions row entirely */
    noTools?: boolean
    /** seconds until the code expires; countdown shown while > 0, emits 'expired' at 0 */
    expiresIn?: number
}>(), {
    modelValue: '',
    placeholder: 'کد امنیتی را وارد کنید',
    height: 56,
    disabled: false,
    error: false,
    inputDir: 'ltr',
    imgAlt: 'کد امنیتی',
    clickable: false,
    noTools: false
})

const emits = defineEmits<{
    'update:modelValue': [value: string]
    /** parent should provide a new :src (and optionally audioSrc) */
    'refresh': []
    /** enter pressed in the input */
    'submit': [value: string]
    /** image clicked (when clickable) */
    'imgClick': []
    /** countdown reached zero */
    'expired': []
}>()

const value = computed({
    get: () => props.modelValue,
    set: (v: string) => emits('update:modelValue', v)
})

const audioRef = ref<HTMLAudioElement | null>(null)
const showTools = computed(() => !props.noTools)

/* Countdown */
const remaining = ref(props.expiresIn ?? 0)
let timer: ReturnType<typeof setInterval> | null = null

watch(() => props.expiresIn, (v) => {
    remaining.value = v ?? 0
    restartTimer()
})

const restartTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
    if (remaining.value > 0) {
        timer = setInterval(() => {
            remaining.value -= 1
            if (remaining.value <= 0) {
                if (timer) clearInterval(timer)
                timer = null
                emits('expired')
                // cyclic: the code renews, so the countdown starts over
                if (props.expiresIn && props.expiresIn > 0) {
                    remaining.value = props.expiresIn
                    restartTimer()
                }
            }
        }, 1000)
    }
}

if (props.expiresIn && props.expiresIn > 0) restartTimer()

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
})

const playAudio = () => {
    const el = audioRef.value
    if (!el) return
    el.currentTime = 0
    el.play().catch(() => { /* user gesture / no audio */ })
}

const refresh = () => emits('refresh')

const onImgClick = () => {
    if (props.clickable) emits('refresh')
    emits('imgClick')
}

</script>

<style scoped>
.k-captcha {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.k-captcha-box {
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 10px);
    overflow: hidden;
    background: var(--k-surface, #f8fafc);
}

.k-captcha-box.is-clickable {
    cursor: pointer;
}

.k-captcha-img {
    width: 100%;
    display: block;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
}

.k-captcha-empty {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--k-text-muted, #94a3b8);
}

.k-captcha-empty .icon {
    width: 24px;
    height: 24px;
}

/* Actions row under the image */
.k-captcha-tools {
    display: flex;
    align-items: center;
    gap: 6px;
}

.k-captcha-tool {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    color: var(--k-text-secondary, #64748b);
    border-radius: 8px;
    padding: 6px 11px;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-captcha-tool:hover:not(:disabled) {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-captcha-tool:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.k-captcha-tool .icon {
    width: 14px;
    height: 14px;
}

.k-captcha-timer {
    margin-inline-end: auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
}

.k-captcha-timer .icon {
    width: 13px;
    height: 13px;
}

.k-captcha-timer.is-expiring {
    color: var(--k-error, #dc2626);
    font-weight: 700;
}

.k-captcha-field {
    position: relative;
    display: flex;
    align-items: center;
}

.k-captcha-input {
    width: 100%;
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-sm, 10px);
    background: var(--k-bg, #ffffff);
    padding: 9px 12px;
    font-family: inherit;
    font-size: 0.85rem;
    letter-spacing: 3px;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-captcha-input:focus {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 15%, transparent);
}

.k-captcha-input::placeholder {
    letter-spacing: 0;
    font-weight: 400;
    color: var(--k-placeholder, #cbd5e1);
}

.k-captcha-field.has-error .k-captcha-input {
    border-color: var(--k-error, #dc2626);
}

.k-captcha-clear {
    position: absolute;
    left: 8px;
    border: none;
    background: transparent;
    color: var(--k-text-muted, #94a3b8);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.k-captcha-clear:hover {
    color: var(--k-text-primary, #1e293b);
}

.k-captcha-clear .icon {
    width: 14px;
    height: 14px;
}

.k-captcha.is-disabled {
    opacity: 0.6;
}
</style>
