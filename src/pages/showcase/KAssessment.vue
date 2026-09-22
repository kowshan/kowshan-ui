<template>
    <div class="sp">
        <h2 class="sp-title">KAssessment</h2>

        <h3 class="sp-sub">تعاملی</h3>
        <KAssessment
            v-model="selected"
            :question="question"
            :options="options"
            :correct-index="1"
        />

        <p class="sp-note" v-if="selected !== null">
            انتخاب شده: <strong>{{ selected !== null ? options[selected] : 'هیچ‌کدام' }}</strong>
            — {{ selected === 1 ? '✅ درست' : '❌ غلط' }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KAssessment from '../../ui-kit/components/KAssessment.vue'

const selected = ref<number | null>(null)
const question = 'بهترین روش مدیریت state در Vue 3 کدام است؟'
const options = ['Redux', 'Pinia', 'Vuex', 'MobX']
</script>
