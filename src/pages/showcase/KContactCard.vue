<template>
    <div class="sp">
        <h2 class="sp-title">KContactCard</h2>

        <h3 class="sp-sub">پایه</h3>
        <div style="max-width:360px">
            <KContactCard :contact="c1" />
        </div>

        <h3 class="sp-sub">قابل انتخاب</h3>
        <div style="max-width:360px">
            <KContactCard :contact="c2" :selectable="true" v-model:selected="sel" />
        </div>

        <p class="sp-note">انتخاب شده: {{ sel ? 'بله' : 'خیر' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KContactCard from '../../ui-kit/components/KContactCard.vue'

const sel = ref(false)
const c1 = { name: 'علی رضایی', phone: '۰۹۱۲۱۲۳۴۵۶۷', email: 'ali@example.com', role: 'توسعه‌دهنده', avatar: '' }
const c2 = { name: 'سارا احمدی', phone: '۰۹۱۲۹۸۷۶۵۴۳', email: 'sara@example.com', role: 'طراح', avatar: '' }
</script>
