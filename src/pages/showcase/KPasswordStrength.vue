<template>
    <div class="sp">
        <h2 class="sp-title">KPasswordStrength</h2>

        <h3 class="sp-sub">پایه — با سنجش قدرت</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength v-model="pass1" label="رمز عبور" @strength-change="onStrength" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                قدرت: {{ level1 || '—' }}/5 ({{ label1 || '—' }})
            </div>
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength v-model="pass2" label="رمز عبور جدید" required />
        </div>

        <h3 class="sp-sub">بدون فهرست معیارها</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength v-model="pass3" label="رمز عبور" :show-criteria="false" />
        </div>

        <h3 class="sp-sub">حداقل طول ۱۲ کاراکتر</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength v-model="pass4" label="رمز عبور سازمانی" :min-length="12" />
        </div>

        <h3 class="sp-sub">قواعد سفارشی (فقط فارسی و عدد)</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength
                v-model="pass5"
                label="رمز عبور پرسنلی"
                :rules="customRules"
                placeholder="مثال: ab12cd34"
            />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 420px;">
            <KPasswordStrength v-model="pass6" label="رمز عبور" disabled />
            <div class="sp-vmodel" style="margin-top: 10px;">مقدار قفل‌شده: {{ pass6 }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPasswordStrength from '../../ui-kit/components/KPasswordStrength.vue'

const pass1 = ref('')
const pass2 = ref('')
const pass3 = ref('Abc123!@#')
const pass4 = ref('')
const pass5 = ref('')
const pass6 = ref('locked-value')

const level1 = ref(0)
const label1 = ref('')

const onStrength = (level: number, label: string) => {
    level1.value = level
    label1.value = label
}

const customRules = [
    { key: 'len', label: 'حداقل ۶ کاراکتر', test: (v: string) => v.length >= 6 },
    { key: 'num', label: 'شامل عدد', test: (v: string) => /[0-9]/.test(v) },
    { key: 'letter', label: 'شامل حرف انگلیسی', test: (v: string) => /[A-Za-z]/.test(v) },
]
</script>
