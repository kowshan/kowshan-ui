<template>
    <div class="sp">
        <h2 class="sp-title">KAssessmentOption</h2>
        <p class="sp-note">
            یک گزینه‌ی پاسخ — چهار نوع: <code>text / image / audio / video</code>. حالت تک‌انتخابی
            (دایره) و چندانتخابی (مربع)، غیرفعال، و حالت فقط‌خواندنی (<code>as="div"</code>) برای کارنامه.
        </p>

        <h3 class="sp-sub">متنی — تکی / چندتایی / با توضیح</h3>
        <div class="sp-card">
            <KAssessmentOption
                v-for="opt in textOptions"
                :key="opt.id"
                :option="opt"
                :selected="selected.includes(String(opt.id))"
                @select="pick"
            />
        </div>

        <h3 class="sp-sub">چندانتخابی (مربع) + غیرفعال</h3>
        <div class="sp-card">
            <KAssessmentOption
                v-for="opt in textOptions"
                :key="opt.id"
                :option="opt"
                multiple
                :selected="multi.includes(String(opt.id))"
                @select="pickMulti"
            />
            <KAssessmentOption :option="{ id: 'x', label: 'گزینه غیرفعال', disabled: true }" as="div" />
        </div>

        <h3 class="sp-sub">تصویری — گرید انتخابی</h3>
        <div class="sp-card grid-3">
            <KAssessmentOption
                v-for="opt in imageOptions"
                :key="opt.id"
                :option="opt"
                layout="grid"
                :selected="imagePick === String(opt.id)"
                @select="imagePick = String($event.id)"
            />
        </div>

        <h3 class="sp-sub">ویدیویی و صوتی</h3>
        <div class="sp-card">
            <KAssessmentOption
                :option="{ id: 'v1', kind: 'video', label: 'کلیپ A', media: videoSrc, poster: 'https://picsum.photos/seed/ao-v/600/340' }"
                :selected="mediaPick === 'v1'"
                @select="mediaPick = String($event.id)"
            />
            <KAssessmentOption
                :option="{ id: 'a1', kind: 'audio', label: 'فایل صوتی B', media: audioSrc }"
                :selected="mediaPick === 'a1'"
                @select="mediaPick = String($event.id)"
            />
        </div>

        <h3 class="sp-sub">فقط‌خواندنی — برای نمایش نتیجه (بدون کلیک)</h3>
        <div class="sp-card">
            <KAssessmentOption :option="{ id: 'r1', label: 'پاسخ شما', tag: '۱' }" :selected="true" as="div" />
            <KAssessmentOption :option="{ id: 'r2', label: 'پاسخ صحیح', tag: '✓' }" :selected="true" as="div" />
            <KAssessmentOption :option="{ id: 'r3', label: 'گزینه‌ی انتخاب‌نشده' }" as="div" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentOption from '../../ui-kit/components/KAssessmentOption.vue'
import type { AssessmentOption } from '../../ui-kit/types/assessment'

const audioSrc = 'https://www.w3schools.com/html/horse.mp3'
const videoSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const textOptions: AssessmentOption[] = [
    { id: 'a', label: 'گزینه اول', tag: 'الف' },
    { id: 'b', label: 'گزینه دوم', description: 'با یک توضیح کوتاه برای این گزینه' },
    { id: 'c', label: 'گزینه سوم' },
]

const imageOptions: AssessmentOption[] = [
    { id: 'i1', kind: 'image', media: 'https://picsum.photos/seed/ao-1/400/300', label: 'شکل ۱' },
    { id: 'i2', kind: 'image', media: 'https://picsum.photos/seed/ao-2/400/300', label: 'شکل ۲' },
    { id: 'i3', kind: 'image', media: 'https://picsum.photos/seed/ao-3/400/300', label: 'شکل ۳' },
]

const selected = ref<string[]>(['a'])
const multi = ref<string[]>(['b'])
const imagePick = ref('')
const mediaPick = ref('')

const pick = (opt: AssessmentOption) => { selected.value = [String(opt.id)] }
const pickMulti = (opt: AssessmentOption) => {
    const id = String(opt.id)
    multi.value = multi.value.includes(id) ? multi.value.filter(v => v !== id) : [...multi.value, id]
}
</script>

<style scoped>
.sp-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-md);
    background: var(--k-surface);
}
.grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
</style>
