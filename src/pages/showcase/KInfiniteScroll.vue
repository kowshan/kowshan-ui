<template>
    <div class="sp">
        <h2 class="sp-title">KInfiniteScroll</h2>

        <h3 class="sp-sub">زنده — اسکرول کنید تا بیشتر بارگذاری شود</h3>
        <div class="sp-box" style="height: 300px; overflow-y: auto; border: 1px solid var(--k-border); border-radius: 12px;">
            <KInfiniteScroll :loading="loading" :finished="finished" :threshold="80" @load="loadMore">
                <div v-for="item in items" :key="item.id" class="inf-row">
                    <span class="inf-id">#{{ item.id }}</span>
                    <span>{{ item.title }}</span>
                </div>
            </KInfiniteScroll>
        </div>
        <div class="sp-vmodel" style="margin-top: 10px;">
            {{ items.length }} مورد بارگذاری شد · loading: {{ loading }} · finished: {{ finished }}
        </div>
        <KButton text="ریست" bg-color="var(--k-surface-hover)" text-color="var(--k-text-primary)" @click="reset" />

        <h3 class="sp-sub">حالت بارگذاری</h3>
        <div class="sp-box" style="height: 140px; border: 1px dashed var(--k-border); border-radius: 12px; padding: 12px;">
            <KInfiniteScroll :loading="true" />
        </div>

        <h3 class="sp-sub">حالت پایان (finished)</h3>
        <div class="sp-box" style="height: 140px; border: 1px dashed var(--k-border); border-radius: 12px; padding: 12px;">
            <KInfiniteScroll :finished="true" />
        </div>

        <h3 class="sp-sub">متن سفارشی</h3>
        <div class="sp-box" style="height: 140px; border: 1px dashed var(--k-border); border-radius: 12px; padding: 12px;">
            <KInfiniteScroll
                :finished="true"
                loading-text="دریافت محصولات…"
                finished-text="همه محصولات نمایش داده شد"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KInfiniteScroll from '../../ui-kit/components/KInfiniteScroll.vue'
import KButton from '../../ui-kit/components/KButton.vue'

let seq = 0
const make = (n: number) => ({ id: ++seq, title: `آیتم شماره ${n}` })

const items = ref(Array.from({ length: 8 }, (_, i) => make(i + 1)))
const loading = ref(false)
const finished = ref(false)

const loadMore = () => {
    if (loading.value || finished.value) return
    loading.value = true
    setTimeout(() => {
        items.value.push(...Array.from({ length: 6 }, (_, i) => make(items.value.length + i + 1)))
        loading.value = false
        if (items.value.length >= 32) finished.value = true
    }, 700)
}

const reset = () => {
    seq = 0
    items.value = Array.from({ length: 8 }, (_, i) => make(i + 1))
    finished.value = false
    loading.value = false
}
</script>

<style scoped>
.inf-row {
    display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-bottom: 1px solid var(--k-border); font-size: 0.82rem; color: var(--k-text-primary);
}
.inf-id { font-size: 0.72rem; color: var(--k-text-muted); direction: ltr; }
</style>
