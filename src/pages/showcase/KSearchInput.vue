<template>
    <div class="sp">
        <h2 class="sp-title">KSearchInput</h2>

        <h3 class="sp-sub">پایه — با debounce پیش‌فرض (۲۵۰ms)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q1" @search="onSearch" @clear="clears++" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                مقدار: {{ q1 || '—' }} — آخرین search: {{ lastSearch || '—' }} ({{ searchCount }} بار)
            </div>
        </div>

        <h3 class="sp-sub">debounce صفر (هر کلید)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q2" :debounce="0" placeholder="بدون تأخیر…" />
        </div>

        <h3 class="sp-sub">debounce زیاد (۱ ثانیه)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q3" :debounce="1000" placeholder="با تأخیر طولانی…" />
        </div>

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q4" :loading="true" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q5" :disabled="true" />
        </div>

        <h3 class="sp-sub">ارقام فارسی — نرمال‌سازی خودکار</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KSearchInput v-model="q6" placeholder="مثلاً ۱۲۳ را تایپ کنید" />
            <div class="sp-vmodel" style="margin-top: 12px;">ذخیره‌شده: {{ q6 || '—' }}</div>
        </div>

        <h3 class="sp-sub">جستجوی زنده روی فهرست</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSearchInput v-model="query" :loading="searching" placeholder="نام دوره را بنویسید…" />
            <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
                <div v-if="searching" style="font-size: 0.8rem; color: var(--k-text-muted);">در حال جستجو…</div>
                <div
                    v-for="c in results"
                    :key="c"
                    style="padding: 8px 12px; border: 1px solid var(--k-border); border-radius: 10px; font-size: 0.82rem;"
                >
                    {{ c }}
                </div>
                <div v-if="!searching && !results.length" style="font-size: 0.8rem; color: var(--k-text-muted);">
                    نتیجه‌ای پیدا نشد
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import KSearchInput from '../../ui-kit/components/KSearchInput.vue'

const q1 = ref('')
const q2 = ref('')
const q3 = ref('')
const q4 = ref('سفارش‌ها')
const q5 = ref('غیرفعال')
const q6 = ref('')

const lastSearch = ref('')
const searchCount = ref(0)
const clears = ref(0)

const onSearch = (v: string) => {
    lastSearch.value = v
    searchCount.value++
}

const courses = [
    'مکالمه مقدماتی انگلیسی',
    'گرامر پیشرفته',
    'آیلتس فشرده — اسپیکینگ',
    'کارگاه تلفظ',
    'دوره کودکان',
]

const query = ref('')
const results = ref<string[]>([])
const searching = ref(false)
let t: ReturnType<typeof setTimeout> | null = null

watch(query, (v) => {
    searching.value = true
    if (t) clearTimeout(t)
    t = setTimeout(() => {
        results.value = courses.filter(c => c.includes(v))
        searching.value = false
    }, 500)
})

onUnmounted(() => { if (t) clearTimeout(t) })
</script>
