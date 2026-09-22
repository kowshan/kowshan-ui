<template>
    <div class="sp">
        <h2 class="sp-title">KFileUpload</h2>

        <h3 class="sp-sub">پایه — چند فایل با شبیه‌سازی پیشرفت</h3>
        <KFileUpload
            v-model="files1"
            :simulate-progress="true"
            @change="changed1 = true"
        />
        <p class="sp-note">
            {{ files1.length }} فایل انتخاب شده{{ changed1 ? ' · تغییر کرد' : '' }}
        </p>

        <h3 class="sp-sub">فقط تصویر (accept)</h3>
        <KFileUpload
            v-model="files2"
            label="تصاویر را رها کنید"
            hint="PNG / JPG — حداکثر ۲ مگابایت"
            accept="image/*"
            :max-size-m-b="2"
            :simulate-progress="true"
        />

        <h3 class="sp-sub">تک فایل</h3>
        <KFileUpload
            v-model="files3"
            label="فایل تعرفه را انتخاب کنید"
            hint="CSV — یک فایل"
            accept=".csv"
            :multiple="false"
        />

        <h3 class="sp-sub">غیرفعال</h3>
        <KFileUpload
            :model-value="files1"
            :disabled="true"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KFileUpload, { type KUploadFile } from '../../ui-kit/components/KFileUpload.vue'

const files1 = ref<KUploadFile[]>([])
const files2 = ref<KUploadFile[]>([])
const files3 = ref<KUploadFile[]>([])
const changed1 = ref(false)
</script>
