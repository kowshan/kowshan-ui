<template>
    <DemoSection
        id="forms"
        index="02"
        title="فرم و ورودی"
        description="فیلدها، انتخاب‌گرها و تاریخ‌شمار — از جمله پیکر چرخشی به سبک تلگرام"
    >
        <!-- Inputs -->
        <p class="demo-caption">فیلدهای متنی</p>
        <div class="demo-grid">
            <KTextInput v-model="form.name" label="نام و نام خانوادگی" placeholder="مثلاً علی رضایی" hint="نام کامل وارد کنید" />
            <KTextInput v-model="form.phone" label="شماره تماس" placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" clearable :left-icon="Phone" />
            <KTextInput v-model="form.mail" label="ایمیل" placeholder="you@example.com" required />
            <KTextarea v-model="form.desc" label="توضیحات" placeholder="توضیحات تکمیلی…" :rows="3" show-counter />
        </div>

        <hr class="demo-divider" />

        <!-- Select / date -->
        <p class="demo-caption">انتخاب و تاریخ</p>
        <div class="demo-grid">
            <KSelect
                v-model="form.city"
                label="شهر"
                placeholder="انتخاب شهر…"
                :options="cities"
                searchable
                clearable
            />
            <KDatePicker
                v-model="form.date"
                label="تاریخ (فیلد عادی → پیکر چرخشی)"
                placeholder="برای انتخاب کلیک کنید"
                :output-format="dateFormat"
                clearable
            />

            <div class="demo-stack">
                <label class="demo-caption" style="margin: 0">قالب خروجی فیلد بالا (نمایش همیشه شمسی):</label>
                <KRadioGroup v-model="dateFormat" variant="segmented" direction="horizontal" :options="dateFormats" />
                <div v-if="form.date" style="font-size: 0.72rem; color: var(--k-text-muted); direction: ltr">
                    مقدار ذخیره‌شده: <code style="font-weight: 700; color: var(--k-primary)">{{ form.date }}</code>
                </div>
            </div>

            <KDatePicker
                v-model="form.dateSeg"
                label="تاریخ (ورودی قطعه‌ای)"
                picker="segmented"
                clearable
            />

            <div class="demo-stack">
                <label class="demo-caption" style="margin: 0">ساعت (پیکر چرخشی)</label>
                <div class="demo-row" style="margin: 0">
                    <KButton
                        text="انتخاب ساعت"
                        :right-icon="Clock3"
                        bg-color="#1db954"
                        text-color="#fff"
                        @click="timeOpen = true"
                    />
                    <span v-if="timeValue" style="font-size: 0.85rem; font-weight: 700; color: var(--k-primary); direction: ltr">
                        {{ timeValue }}
                    </span>
                    <span v-else style="font-size: 0.8rem; color: var(--k-text-muted)">ساعتی انتخاب نشده</span>
                </div>
                <KToggle v-model="timeSeconds" label="با ثانیه" />
                <KTimePickerModal v-model:visible="timeOpen" v-model="timeValue" :show-seconds="timeSeconds" />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Choice -->
        <p class="demo-caption">انتخاب‌گرها</p>
        <div class="demo-row is-start">
            <div style="width: 300px">
                <KCheckbox v-model="opts.remember" label="مرا به خاطر بسپار" />
                <KCheckbox v-model="opts.news" label="خبرنامه ایمیلی" style="margin-top: 6px" />
                <KCheckbox v-model="opts.partial" :indeterminate="true" label="برخی انتخاب شده‌اند" style="margin-top: 6px" />
            </div>
            <div style="width: 220px">
                <KToggle v-model="opts.active" label="فعال" />
                <KToggle v-model="opts.notify" on-text="اعلان روشن" off-text="اعلان خاموش" style="margin-top: 10px" />
                <KToggle v-model="opts.big" label="حالت بزرگ" size="lg" checked-color="#8b5cf6" style="margin-top: 10px" />
            </div>
        </div>

        <div class="demo-row is-start">
            <div style="width: 360px">
                <KRadioGroup v-model="opts.type" label="نوع ملک" variant="cards" :options="propertyTypes" />
            </div>
            <div style="width: 260px">
                <KRadioGroup v-model="opts.seg" variant="segmented" direction="vertical" :options="segOptions" />
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Number input + upload + signature -->
        <p class="demo-caption">ورودی عددی، آپلود فایل و امضا</p>
        <div class="demo-grid">
            <div class="demo-stack">
                <label class="demo-caption" style="margin: 0">شمارنده</label>
                <div class="demo-row" style="margin: 0">
                    <KNumberInput v-model="quantity" :min="1" :max="99" />
                    <span style="font-size: 0.78rem; color: var(--k-text-secondary)">تعداد: {{ quantity }}</span>
                </div>
                <KNumberInput v-model="discount" :min="0" :max="100" :step="5" label="تخفیف (٪)" style="margin-top: 6px" />
            </div>

            <div>
                <KFileUpload v-model="uploads" :max-size-m-b="10" simulate-progress />
            </div>

            <div>
                <KSignaturePad v-model="signature" />
                <div v-if="signature" style="margin-top: 8px; font-size: 0.72rem; color: var(--k-success)">
                    امضا ثبت شد — خروجی PNG آماده ارسال است
                </div>
            </div>

            <div class="demo-stack">
                <label class="demo-caption" style="margin: 0">کپچا (تصویر + صدا)</label>
                <KCaptcha
                    v-model="captchaInput"
                    :src="captchaSrc"
                    :audio-src="captchaAudio"
                    :expires-in="60"
                    @refresh="refreshCaptcha"
                    @expired="refreshCaptcha"
                />
                <p style="font-size: 0.72rem; color: var(--k-text-muted); margin: 0">
                    {{
                        captchaInput
                            ? (captchaInput.toUpperCase() === captchaCode
                                ? '✅ کد صحیح است'
                                : 'کد وارد شده صحیح نیست — دوباره تلاش کنید')
                            : 'تصویر و صدا از بیرون داده می‌شود؛ کامپوننت فقط قالب است'
                    }}
                </p>
            </div>
        </div>

        <hr class="demo-divider" />

        <!-- Sliders -->
        <p class="demo-caption">اسلایدر</p>
        <div class="demo-grid">
            <KSlider v-model="opts.price" label="قیمت (میلیون تومان)" :min="100" :max="5000" :step="50" show-bounds />
            <KSlider v-model="opts.areaRange" label="متراژ (محدوده)" range :min="40" :max="500" :step="5" show-bounds />
        </div>
    </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Clock3, Phone } from 'lucide-vue-next'
import DemoSection from '../components/DemoSection.vue'

import KTextInput from '../ui-kit/wrappers/KTextInput.vue'
import KTextarea from '../ui-kit/wrappers/KTextarea.vue'
import KSelect from '../ui-kit/wrappers/KSelect.vue'
import KDatePicker from '../ui-kit/wrappers/KDatePicker.vue'
import KCheckbox from '../ui-kit/wrappers/KCheckbox.vue'
import KRadioGroup from '../ui-kit/wrappers/KRadioGroup.vue'
import KToggle from '../ui-kit/wrappers/KToggle.vue'
import KSlider from '../ui-kit/wrappers/KSlider.vue'
import KButton from '../ui-kit/components/KButton.vue'
import KTimePickerModal from '../ui-kit/components/KTimePickerModal.vue'
import KNumberInput from '../ui-kit/components/KNumberInput.vue'
import KFileUpload from '../ui-kit/components/KFileUpload.vue'
import KSignaturePad from '../ui-kit/components/KSignaturePad.vue'
import KCaptcha from '../ui-kit/components/KCaptcha.vue'

const form = ref({
    name: '',
    phone: '',
    mail: '',
    desc: '',
    city: null as any,
    date: '',
    dateSeg: '',
})

const cities = [
    { value: 'tehran', label: 'تهران' },
    { value: 'mashhad', label: 'مشهد' },
    { value: 'isfahan', label: 'اصفهان' },
    { value: 'shiraz', label: 'شیراز' },
    { value: 'tabriz', label: 'تبریز' },
    { value: 'karaj', label: 'کرج' },
]

const opts = ref({
    remember: true,
    news: false,
    partial: true,
    active: true,
    notify: false,
    big: true,
    type: 'apartment',
    seg: 'a',
    price: 1250,
    areaRange: [80, 220] as [number, number],
})

const quantity = ref(3)
const discount = ref(10)
const uploads = ref([])
const signature = ref<string | null>(null)

/* Captcha — mock provider: the parent generates the image/audio */
const captchaChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const captchaCode = ref(genCode())
const captchaInput = ref('')

function genCode() {
    let t = ''
    for (let i = 0; i < 5; i++) t += captchaChars[Math.floor(Math.random() * captchaChars.length)]
    return t
}

const captchaSrc = ref(genCaptchaSvg(captchaCode.value))
const captchaAudio = ref('')

function genCaptchaSvg(code: string) {
    const letters = code.split('').map((ch, i) => {
        const rot = (Math.random() * 30 - 15).toFixed(1)
        const y = 34 + Math.random() * 10
        const x = 30 + i * 44 + Math.random() * 10
        return `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-family="monospace" font-size="26" font-weight="bold" fill="#334155" transform="rotate(${rot} ${x} ${y})">${ch}</text>`
    }).join('')
    const lines = Array.from({ length: 4 }, () => {
        const x1 = Math.random() * 220, y1 = Math.random() * 56, x2 = Math.random() * 220, y2 = Math.random() * 56
        return `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="#1db954" stroke-opacity="0.35" stroke-width="1"/>`
    }).join('')
    const dots = Array.from({ length: 18 }, () => {
        const x = Math.random() * 250, y = Math.random() * 50
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.2" fill="#94a3b8" fill-opacity="0.5"/>`
    }).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="56" viewBox="0 0 260 56"><rect width="260" height="56" rx="8" fill="#f1f5f9"/>${dots}${lines}${letters}</svg>`
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

function refreshCaptcha() {
    captchaCode.value = genCode()
    captchaSrc.value = genCaptchaSvg(captchaCode.value)
    captchaInput.value = ''
    // demo audio: a silent wav would be pointless — emit a tiny beep via WebAudio is out of scope,
    // so audio stays empty; the button simply reflects the wrapper's audio capability.
    captchaAudio.value = ''
}

const propertyTypes = [
    { id: 'apartment', label: 'آپارتمان', description: 'مسکونی — واحدهای ساختمانی' },
    { id: 'villa', label: 'ویلا', description: 'باغ و ویلا — حیاط دار' },
    { id: 'commercial', label: 'تجاری', description: 'مغازه، دفتر و اداری' },
]

const segOptions = ['فروش', 'رهن', 'اجاره']

// Wheel date picker — Jalali display, selectable output format
const dateFormats = ['jalali', 'gregorian', 'iso']
const dateFormat = ref<'jalali' | 'gregorian' | 'iso'>('gregorian')

// Wheel time picker
const timeOpen = ref(false)
const timeValue = ref<string | null>(null)
const timeSeconds = ref(true)
</script>
