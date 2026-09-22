<template>
    <div class="sp">
        <h2 class="sp-title">KInstallPrompt</h2>
        <p class="sp-note">
            بنر نصب PWA — به‌صورت پیش‌فرض فقط وقتی مرورگر نصب‌پذیری را اعلام کند نمایش داده می‌شود.
            برای تست، با <code>show</code> اجباری کنید.
        </p>

        <h3 class="sp-sub">کنترل نمایش</h3>
        <div class="sp-row">
            <KButton
                :text="visible ? 'بستن بنر' : 'نمایش بنر'"
                bg-color="var(--k-primary)"
                text-color="#fff"
                @click="visible = !visible"
            />
            <KButton
                :text="custom ? 'متن پیش‌فرض' : 'متن سفارشی'"
                bg-color="var(--k-surface-hover)"
                text-color="var(--k-text-primary)"
                @click="custom = !custom"
            />
            <span class="sp-vmodel">visible: {{ visible }} · custom: {{ custom }}</span>
        </div>

        <h3 class="sp-sub">پیش‌نمایش</h3>
        <div class="sp-box" style="height: 160px; border: 1px dashed var(--k-border); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <span class="sp-vmodel">بنر به‌صورت fixed در پایین/بالای صفحه نمایش داده می‌شود — وضعیت: {{ visible ? 'نمایش' : 'مخفی' }}</span>
        </div>

        <!-- one instance (it positions itself fixed, so stacking demos would overlap) -->
        <KInstallPrompt
            :show="visible"
            :title="custom ? 'نصب اپلیکیشن آموزشگاه' : 'نصب اپلیکیشن'"
            :description="custom ? 'دسترسی آفلاین به درس‌ها، اعلان تمرین‌ها و باز شدن سریع‌تر.' : 'با نصب، دسترسی سریع‌تر و آفلاین به امکانات داشته باشید.'"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KInstallPrompt from '../../ui-kit/components/KInstallPrompt.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const visible = ref(true)
const custom = ref(false)
</script>
