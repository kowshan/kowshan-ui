<template>
    <div class="sp">
        <h2 class="sp-sub-title"></h2>
        <h2 class="sp-title">KFilterBar</h2>

        <h3 class="sp-sub">پایه — چیپ‌ها + جستجو</h3>
        <KFilterBar
            v-model="query1"
            :chips="chips1"
            @toggle-chip="lastChip = $event.label"
            @reset="lastChip = 'ریست'"
        />
        <p class="sp-note">جستجو: {{ query1 || '—' }} · آخرین چیپ: {{ lastChip || '—' }}</p>

        <h3 class="sp-sub">با تعداد (count) و غیرفعال</h3>
        <KFilterBar
            v-model="query2"
            :chips="chips2"
            search-placeholder="جستجوی سفارش…"
        />

        <h3 class="sp-sub">غیرفعال کامل</h3>
        <KFilterBar
            v-model="query2"
            :chips="chips1"
            :disabled="true"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KFilterBar, { type KFilterChip } from '../../ui-kit/components/KFilterBar.vue'
import { Package, Truck, Clock, CheckCircle2, XCircle } from 'lucide-vue-next'

const query1 = ref('')
const query2 = ref('')
const lastChip = ref('')

const chips1: KFilterChip[] = [
    { id: 'new', label: 'جدید', icon: Package, active: true },
    { id: 'shipping', label: 'در ارسال', icon: Truck },
    { id: 'pending', label: 'در انتظار', icon: Clock },
]

const chips2: KFilterChip[] = [
    { id: 'done', label: 'تحویل شده', icon: CheckCircle2, count: 24 },
    { id: 'canceled', label: 'لغو شده', icon: XCircle, count: 3 },
    { id: 'gift', label: 'هدیه', icon: Package, count: 8 },
    { id: 'archived', label: 'بایگانی', icon: Clock, disabled: true },
]
</script>
