<template>
    <div class="sp">
        <h2 class="sp-title">KModal</h2>
        <p class="sp-note">
            دو حالت استفاده دارد: محلی (<code>v-model:visible</code>) یا از طریق استور
            (<code>modalStore.openModal(id)</code>) که برای مدیریت متمرکز باز/بسته مناسب‌تر است.
        </p>

        <h3 class="sp-sub">محلی — با سرصفحه و پاورقی</h3>
        <div class="sp-row">
            <KButton text="باز کردن" bg-color="var(--k-primary)" text-color="#fff" @click="basic = true" />
        </div>
        <KModal v-model:visible="basic" title="ویرایش پروفایل" @open="log('open')" @close="log('close')">
            <div class="md-body">
                <p>محتوای فرم اینجا قرار می‌گیرد.</p>
                <KTextInput v-model="form.name" label="نام" hint="نام نمایشی شما" />
                <KTextInput v-model="form.email" label="ایمیل" placeholder="you@example.com" />
            </div>
            <template #footer>
                <KButton text="انصراف" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="basic = false" />
                <KButton text="ذخیره" bg-color="var(--k-primary)" text-color="#fff" @click="basic = false" />
            </template>
        </KModal>

        <h3 class="sp-sub">اندازه‌ها</h3>
        <div class="sp-row">
            <KButton v-for="s in sizes" :key="s" :text="s" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openSize(s)" />
        </div>
        <KModal v-model:visible="sizeOpen" :size="currentSize" :title="`اندازه ${currentSize}`">
            <p>پهنا بر اساس اندازه <strong>{{ currentSize }}</strong> تنظیم می‌شود.</p>
        </KModal>

        <h3 class="sp-sub">جایگاه (placement)</h3>
        <div class="sp-row">
            <KButton text="چپ" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openPlacement('left')" />
            <KButton text="وسط" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openPlacement('center')" />
            <KButton text="راست" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="openPlacement('right')" />
        </div>
        <KModal v-model:visible="placementOpen" :placement="currentPlacement" title="جایگاه سفارشی" width="360px">
            <p>این مودال روی لبه <strong>{{ currentPlacement }}</strong> صفحه قرار گرفته است.</p>
        </KModal>

        <h3 class="sp-sub">پرچم‌ها</h3>
        <div class="sp-row">
            <KButton text="بدون دکمه بستن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="noClose = true" />
            <KButton text="کلیک روی پس‌زمینه نمی‌بندد" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="noOverlayClose = true" />
            <KButton text="قفل اسکرول خاموش" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="noLock = true" />
        </div>
        <KModal v-model:visible="noClose" title="بدون دکمه بستن" :closable="false">
            <p>برای بستن باید از پاورقی یا کد استفاده کنید.</p>
            <template #footer>
                <KButton text="بستن" bg-color="var(--k-primary)" text-color="#fff" @click="noClose = false" />
            </template>
        </KModal>
        <KModal v-model:visible="noOverlayClose" title="کلیک پس‌زمینه غیرفعال" :close-on-overlay="false">
            <p>کلیک بیرون مودال آن را نمی‌بندد.</p>
        </KModal>
        <KModal v-model:visible="noLock" title="اسکرول صفحه آزاد است" :lock-scroll="false">
            <p>صفحه پشت مودال اسکرول می‌شود (مناسب مودال‌های کوچک اطلاعاتی).</p>
        </KModal>

        <h3 class="sp-sub">استور-محور (بدون ref محلی)</h3>
        <div class="sp-row">
            <KButton text="openModal('demo-modal')" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="modal.openModal('demo-modal')" />
            <span class="sp-vmodel">isOpen: {{ modal.isOpen('demo-modal') }}</span>
        </div>
        <KModal id="demo-modal" title="مودال استور-محور" size="sm">
            <p>این مودال با شناسه از استور باز و بسته می‌شود — بدون نگه‌داشتن ref در هر صفحه.</p>
            <template #footer>
                <KButton text="بستن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="modal.closeModal('demo-modal')" />
            </template>
        </KModal>

        <h3 class="sp-sub">سرصفحه سفارشی</h3>
        <div class="sp-row">
            <KButton text="باز کردن" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="customHeader = true" />
        </div>
        <KModal v-model:visible="customHeader">
            <template #header>
                <span class="md-custom-head">⚠️ توجه لازم است</span>
            </template>
            <p>سرصفحه کاملاً سفارشی است و به‌جای عنوان پیش‌فرض نمایش داده می‌شود.</p>
        </KModal>

        <div class="sp-vmodel" style="margin-top: 16px;">آخرین رویداد: {{ lastEvent }}</div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KModal from '../../ui-kit/components/KModal.vue'
import KButton from '../../ui-kit/components/KButton.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import { useModalStore } from '../../ui-kit/stores/modalStore'

const modal = useModalStore()
const lastEvent = ref('—')
const log = (e: string) => { lastEvent.value = e }

const form = reactive({ name: 'مریم احمدی', email: '' })

const basic = ref(false)

type Size = 'sm' | 'md' | 'lg' | 'xl'
const sizes: Size[] = ['sm', 'md', 'lg', 'xl']
const sizeOpen = ref(false)
const currentSize = ref<Size>('md')
const openSize = (s: Size) => { currentSize.value = s; sizeOpen.value = true }

type Placement = 'left' | 'center' | 'right'
const placementOpen = ref(false)
const currentPlacement = ref<Placement>('center')
const openPlacement = (p: Placement) => { currentPlacement.value = p; placementOpen.value = true }

const noClose = ref(false)
const noOverlayClose = ref(false)
const noLock = ref(false)
const customHeader = ref(false)
</script>

<style scoped>
.md-body { display: flex; flex-direction: column; gap: 12px; }
.md-custom-head { font-size: 0.95rem; font-weight: 800; color: var(--k-warning, #f59e0b); }
</style>
