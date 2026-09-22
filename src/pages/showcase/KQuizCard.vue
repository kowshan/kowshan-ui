<template>
    <div class="sp">
        <h2 class="sp-title">KQuizCard</h2>

        <h3 class="sp-sub">سوال ۱ از ۵ — وسط آزمون</h3>
        <div class="sp-row" style="max-width: 620px;">
            <KQuizCard
                question="کدام گزینه مترادف «rapid» است؟"
                description="سطح: متوسط"
                :options="options1"
                :correct-index="2"
                :current="0"
                :total="5"
                :score="12"
                explanation="«Swift» به معنای سریع و چابک است."
                @answer="onAnswer"
                @next="next"
            />
        </div>

        <h3 class="sp-sub">آخرین سوال (پیشرفت کامل)</h3>
        <div class="sp-row" style="max-width: 620px;">
            <KQuizCard
                :question="'پاسخ درست «کتاب» کدام است؟'"
                :options="options2"
                :correct-index="0"
                :current="4"
                :total="5"
                :score="48"
                @answer="onAnswer"
            />
        </div>

        <h3 class="sp-sub">با تایمر ۱۰ ثانیه‌ای</h3>
        <div class="sp-row" style="max-width: 620px;">
            <KQuizCard
                question="معنی «diligent» چیست؟"
                :options="options3"
                :correct-index="1"
                :current="1"
                :total="5"
                :show-timer="true"
                :timer-seconds="10"
                explanation="اگر زمان تمام شود، پاسخ به‌صورت خودکار نمایش داده می‌شود."
                @timeout="onTimeout"
                @answer="onAnswer"
            />
        </div>

        <h3 class="sp-sub">تک‌گزینه‌ای (بدون تایمر و امتیاز)</h3>
        <div class="sp-row" style="max-width: 620px;">
            <KQuizCard
                question="فعل گذشته «go» کدام است؟"
                :options="['goed', 'went', 'gone', 'going']"
                :correct-index="1"
                :current="2"
                :total="5"
                @answer="onAnswer"
            />
        </div>

        <h3 class="sp-sub">دوزبانه — گزینه‌های طولانی</h3>
        <div class="sp-row" style="max-width: 620px;">
            <KQuizCard
                question="در جمله «She has been working here since 2019» زمان فعل چیست؟"
                :options="options4"
                :correct-index="1"
                :current="3"
                :total="8"
                :score="27"
                explanation="«has been working» ساختار حال کامل استمراری است."
                @answer="onAnswer"
            />
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            آخرین پاسخ: {{ lastAnswer === null ? '—' : `${lastAnswer.index} — ${lastAnswer.correct ? 'درست' : 'نادرست'}` }}<br />
            تایمر تمام شد: {{ timeouts }} بار — رفتن به سوال بعد: {{ nextCount }} بار
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KQuizCard from '../../ui-kit/components/KQuizCard.vue'

const options1 = ['Slow', 'Quiet', 'Swift', 'Heavy']
const options2 = ['Book', 'Pencil', 'Desk', 'Chair']
const options3 = ['تنبل', 'کوشا', 'بی‌دقت', 'سریع']
const options4 = [
    'گذشته ساده',
    'حال کامل استمراری',
    'آینده ساده',
    'گذشته کامل',
]

const lastAnswer = ref<{ index: number; correct: boolean } | null>(null)
const timeouts = ref(0)
const nextCount = ref(0)

const onAnswer = (index: number, correct: boolean) => { lastAnswer.value = { index, correct } }
const onTimeout = () => { timeouts.value++ }
const next = () => { nextCount.value++ }
</script>
