<template>
    <div class="sp">
        <h2 class="sp-title">KProvinceCitySelect</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KProvinceCitySelect v-model="addr1" @change="onChange" />
            <div class="sp-vmodel" style="margin-top: 12px;">
                استان: {{ addr1?.province || '—' }} — شهر: {{ addr1?.city || '—' }}
            </div>
        </div>

        <h3 class="sp-sub">از پیش پر‌شده (تهران / تهران)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KProvinceCitySelect v-model="addr2" />
        </div>

        <h3 class="sp-sub">از پیش پر‌شده (اصفهان / کاشان)</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KProvinceCitySelect v-model="addr3" />
        </div>

        <h3 class="sp-sub">غیرفعال</h3>
        <div class="sp-card" style="max-width: 460px;">
            <KProvinceCitySelect v-model="addr4" disabled />
        </div>

        <h3 class="sp-sub">فرم آدرس کامل</h3>
        <div class="sp-card" style="max-width: 460px; display: flex; flex-direction: column; gap: 16px;">
            <KProvinceCitySelect v-model="addr5" />
            <KTextInput v-model="street" label="نشانی دقیق" placeholder="خیابان، کوچه، پلاک" />
            <KPostalCodeInput v-model="postal" label="کد پستی" />
            <KButton text="ثبت آدرس" @click="submit" />
            <div v-if="submitted" class="sp-vmodel">
                ثبت شد: {{ addr5?.province }} / {{ addr5?.city }} — {{ street }} — {{ postal || 'بدون کد پستی' }}
            </div>
        </div>

        <div class="sp-vmodel" style="margin-top: 16px;">
            آخرین change: {{ lastChange ? `${lastChange.province} / ${lastChange.city || '—'}` : '—' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KProvinceCitySelect from '../../ui-kit/components/KProvinceCitySelect.vue'
import KTextInput from '../../ui-kit/wrappers/KTextInput.vue'
import KPostalCodeInput from '../../ui-kit/components/KPostalCodeInput.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const addr1 = ref<{ province: string; city: string } | null>(null)
const addr2 = ref<{ province: string; city: string } | null>({ province: 'تهران', city: 'تهران' })
const addr3 = ref<{ province: string; city: string } | null>({ province: 'اصفهان', city: 'کاشان' })
const addr4 = ref<{ province: string; city: string } | null>({ province: 'فارس', city: 'شیراز' })
const addr5 = ref<{ province: string; city: string } | null>(null)

const street = ref('')
const postal = ref('')
const submitted = ref(false)

const lastChange = ref<{ province: string; city: string } | null>(null)
const onChange = (v: { province: string; city: string }) => { lastChange.value = v }

const submit = () => { submitted.value = !!addr5.value?.city }
</script>
