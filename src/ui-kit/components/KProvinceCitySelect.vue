<!-- components/KProvinceCitySelect.vue -->
<!--
    KProvinceCitySelect — cascading Iranian province → city selector.
    Model holds { province, city } (province name + city name):

      <KProvinceCitySelect v-model="location" />

    Province list: all 31 provinces with a practical city subset
    (data/iranProvinces.ts). Choosing a province resets the city.
-->
<template>
    <div class="k-province-city">
        <KSelect
            :model-value="modelValue?.province || ''"
            :options="provinceOptions"
            label="استان"
            placeholder="انتخاب استان…"
            searchable
            @update:model-value="onProvince"
        />

        <KSelect
            :model-value="modelValue?.city || ''"
            :options="cityOptions"
            label="شهر"
            placeholder="اول استان را انتخاب کنید"
            :disabled="!modelValue?.province"
            searchable
            @update:model-value="onCity"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KSelect from '../wrappers/KSelect.vue'
import { IRAN_PROVINCES } from '../data/iranProvinces'

const props = withDefaults(defineProps<{
    modelValue?: { province?: string; city?: string } | null
    disabled?: boolean
}>(), {
    modelValue: null,
    disabled: false
})

const emits = defineEmits<{
    'update:modelValue': [value: { province: string; city: string }]
    'change': [value: { province: string; city: string }]
}>()

const provinceOptions = computed(() =>
    IRAN_PROVINCES.map(p => ({ value: p.name, label: p.name }))
)

const cityOptions = computed(() => {
    const prov = IRAN_PROVINCES.find(p => p.name === props.modelValue?.province)
    return (prov?.cities ?? []).map(c => ({ value: c, label: c }))
})

const onProvince = (name: string) => {
    const value = { province: name, city: '' }
    emits('update:modelValue', value)
    emits('change', value)
}

const onCity = (city: string) => {
    const value = { province: props.modelValue?.province ?? '', city }
    emits('update:modelValue', value)
    emits('change', value)
}
</script>

<style scoped>
.k-province-city {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    max-width: 560px;
}

@media (max-width: 480px) {
    .k-province-city {
        grid-template-columns: 1fr;
    }
}
</style>
