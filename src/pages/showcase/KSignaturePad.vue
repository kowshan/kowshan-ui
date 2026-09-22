<template>
    <div class="sp">
        <h2 class="sp-title">KSignaturePad</h2>

        <h3 class="sp-sub">پایه — با پالت رنگ</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSignaturePad v-model="sig1" @change="onChange" @clear="clears++" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                وضعیت: {{ sig1 ? 'امضا ثبت شده' : 'خالی' }} — تغییر: {{ changes }} بار — پاک‌کردن: {{ clears }} بار
            </div>
        </div>

        <h3 class="sp-sub">ارتفاع بیشتر و قلم ضخیم‌تر</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSignaturePad v-model="sig2" :height="240" :pen-width="4" :pen-color="'#2563eb'" />
        </div>

        <h3 class="sp-sub">بدون پالت رنگ</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSignaturePad v-model="sig3" :color-options="[]" />
        </div>

        <h3 class="sp-sub">متن سفارشی</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSignaturePad
                v-model="sig4"
                placeholder="امضای مدیرعامل را اینجا بکشید"
                filled-text="امضا تأیید شد"
            />
        </div>

        <h3 class="sp-sub">امضای موجود (modelValue از قبل پر)</h3>
        <div class="sp-card" style="max-width: 520px;">
            <KSignaturePad v-model="sig5" :height="150" />
          <p class="sp-note">اگر مقدار از قبل وجود داشته باشد، متن «امضا ثبت شد» نشان داده می‌شود.</p>
        </div>

        <h3 class="sp-sub">فرم قرارداد</h3>
        <div class="sp-card" style="max-width: 520px; display: flex; flex-direction: column; gap: 16px;">
            <KTextInput v-model="fullName" label="نام و نام خانوادگی" />
            <KSignaturePad v-model="contractSig" :height="170" placeholder="امضای خود را بکشید" />
            <KButton :text="contractSig ? 'ثبت نهایی قرارداد' : 'ابتدا امضا کنید'" :disabled="!contractSig || !fullName" @click="submit" />
            <div v-if="submitted" class="sp-vmodel">
                قرارداد {{ fullName }} ثبت شد — طول داده امضا: {{ contractSig?.length ?? 0 }} کاراکتر
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KSignaturePad from '../../ui-kit/components/KSignaturePad.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const sig1 = ref<string | null>(null)
const sig2 = ref<string | null>(null)
const sig3 = ref<string | null>(null)
const sig4 = ref<string | null>(null)
const sig5 = ref<string | null>(null)

const changes = ref(0)
const clears = ref(0)
const onChange = () => { changes.value++ }

const fullName = ref('')
const contractSig = ref<string | null>(null)
const submitted = ref(false)
const submit = () => { submitted.value = true }
</script>
