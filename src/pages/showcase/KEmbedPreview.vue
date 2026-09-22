<template>
    <div class="sp">
        <h2 class="sp-title">KEmbedPreview</h2>

        <h3 class="sp-sub">پایه — لینک با پیش‌نمایش</h3>
        <div style="max-width:420px">
            <KEmbedPreview
                url="https://vuejs.org/guide/introduction"
                title="راهنمای Vue 3"
                description="مستندات رسمی فریم‌ورک Vue برای ساخت رابط‌های کاربری مدرن."
                site-name="vuejs.org"
                favicon="https://vuejs.org/logo.svg"
            />
        </div>

        <h3 class="sp-sub">با تصویر</h3>
        <div style="max-width:420px">
            <KEmbedPreview
                url="https://developer.mozilla.org"
                title="MDN Web Docs"
                description="مرجع کامل وب استانداردها، HTML، CSS و جاوااسکریپت برای توسعه‌دهندگان."
                site-name="developer.mozilla.org"
                image="https://picsum.photos/seed/kembed/600/300"
            />
        </div>

        <h3 class="sp-sub">حداقلی — فقط عنوان و لینک</h3>
        <div style="max-width:420px">
            <KEmbedPreview
                url="https://github.com"
                title="GitHub"
                site-name="github.com"
            />
        </div>

        <h3 class="sp-sub">داخل متن چت (مثل دیسکورد)</h3>
        <div style="max-width:480px;display:flex;flex-direction:column;gap:10px">
            <KEmbedPreview
                url="https://vitejs.dev"
                title="Vite — ابزار ساخت جدید"
                description="سرور توسعه فوری و بیلد بهینه برای پروژه‌های مدرن."
                site-name="vitejs.dev"
                image="https://picsum.photos/seed/kembed2/600/280"
            />
            <KEmbedPreview
                url="https://pinia.vuejs.org"
                title="Pinia — استور رسمی Vue"
                site-name="pinia.vuejs.org"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import KEmbedPreview from '../../ui-kit/components/KEmbedPreview.vue'
</script>
