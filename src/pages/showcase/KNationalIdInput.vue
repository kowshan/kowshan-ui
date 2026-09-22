<template>
    <div class="sp">
        <h2 class="sp-title">KNationalIdInput</h2>
        <p class="sp-note">
            کد ملی ۱۰ رقمی — رقم‌ها نرمال‌سازی می‌شوند، سمت فیلد عددی چپ‌چین می‌ماند و
            اعتبارسنجی با الگوریتم رقم کنترلی انجام می‌شود.
        </p>

        <h3 class="sp-sub">پایه (با رویداد validate)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="basic" label="کد ملی" @validate="onValidate" />
            <div class="sp-vmodel">v-model: {{ basic || '—' }}</div>
            <div class="sp-vmodel">validate: {{ validation }}</div>
        </div>

        <h3 class="sp-sub">کد معتبر (رقم کنترلی درست)</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="valid" label="کد ملی معتبر" />
            <div class="sp-vmodel">v-model: {{ valid }}</div>
        </div>

        <h3 class="sp-sub">کد نامعتبر</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="invalid" label="کد ملی نامعتبر" @validate="onValidate" />
            <div class="sp-vmodel">v-model: {{ invalid }} · validate: {{ validation }}</div>
        </div>

        <h3 class="sp-sub">الزامی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="required" label="کد ملی" :required="true" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="valid" label="غیرفعال" :disabled="true" />
        </div>

        <h3 class="sp-sub">فقط‌خواندنی</h3>
        <div class="sp-card" style="max-width: 380px;">
            <KNationalIdInput v-model="valid" label="فقط‌خواندنی" :readonly="true" />
        </div>

        <h3 class="sp-sub">درون یک فرم</h3>
        <div class="sp-card" style="max-width: 380px; display: flex; flex-direction: column; gap: 14px;">
            <KTextInput v-model="form.name" label="نام و نام خانوادگی" />
            <KNationalIdInput v-model="form.nid" label="کد ملی" :required="true" @validate="v => form.nidValid = v.valid" />
            <KButton
                text="ثبت"
                bg-color="var(--k-primary)"
                text-color="#fff"
                :disabled="!form.nidValid"
                @click="submitted = true"
            />
            <span class="sp-vmodel">{{ submitted ? 'ارسال شد ✅' : form.nidValid ? 'آماده ارسال' : 'کد ملی معتبر لازم است' }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KNationalIdInput from '../../ui-kit/components/KNationalIdInput.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const basic = ref('')
const valid = ref('0012345678')
const invalid = ref('0012345679')
const required = ref('')
const validation = ref('—')

const onValidate = (r: { valid: boolean }) => { validation.value = r.valid ? 'معتبر ✅' : 'نامعتبر ❌' }

const submitted = ref(false)
const form = reactive({ name: '', nid: '', nidValid: false })
</script>
