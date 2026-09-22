<template>
    <div class="sp">
        <h2 class="sp-title">KVirtualList</h2>
        <p class="sp-note">
            فقط ردیف‌های داخل دید + بافر رندر می‌شوند؛ اسکرول کنید و ببینید فهرست ۲۰۰۰ ردیفی بدون کندی کار می‌کند.
        </p>

        <h3 class="sp-sub">پایه — ۲۰۰۰ ردیف</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVirtualList :items="big" :item-height="40" :height="280">
                <template #default="{ item, index }">
                    <div class="vl-row">
                        <span class="vl-idx">{{ index + 1 }}</span>
                        <span style="flex: 1;">{{ item.name }}</span>
                        <span class="vl-meta">{{ item.city }}</span>
                    </div>
                </template>
            </KVirtualList>
        </div>

        <h3 class="sp-sub">ارتفاع ردیف بزرگ‌تر (۷۲px)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVirtualList :items="big.slice(0, 500)" :item-height="72" :height="320">
                <template #default="{ item }">
                    <div class="vl-row" style="align-items: flex-start; padding: 10px 12px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <strong style="font-size: 0.85rem;">{{ item.name }}</strong>
                            <span style="font-size: 0.72rem; color: var(--k-text-muted);">{{ item.city }} — {{ item.level }}</span>
                        </div>
                    </div>
                </template>
            </KVirtualList>
        </div>

        <h3 class="sp-sub">ارتفاع کم (200px) با بافر ۰</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVirtualList :items="big.slice(0, 300)" :item-height="36" :height="200" :buffer="0">
                <template #default="{ item, index }">
                    <div class="vl-row"><span class="vl-idx">{{ index }}</span><span style="flex: 1;">{{ item.name }}</span></div>
                </template>
            </KVirtualList>
        </div>

        <h3 class="sp-sub">maxHeight به‌جای ارتفاع ثابت</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVirtualList :items="big.slice(0, 200)" :item-height="44" max-height="180px">
                <template #default="{ item }">
                    <div class="vl-row"><span style="flex: 1;">{{ item.name }}</span></div>
                </template>
            </KVirtualList>
        </div>

        <h3 class="sp-sub">itemKey سفارشی (کاهش jitter در اسکرول)</h3>
        <div class="sp-card" style="max-width: 560px;">
            <KVirtualList :items="big.slice(0, 1000)" :item-height="40" :height="240" :item-key="(item: any) => item.id">
                <template #default="{ item, index }">
                    <div class="vl-row">
                        <span class="vl-idx">{{ index + 1 }}</span>
                        <span style="flex: 1;">{{ item.name }} (#{{ item.id }})</span>
                    </div>
                </template>
            </KVirtualList>
        </div>

        <h3 class="sp-sub">مرزی</h3>
        <div class="sp-card" style="max-width: 560px; display: flex; flex-direction: column; gap: 24px;">
            <div>
                <span class="sp-note">۵ ردیف (کمتر از ظرفیت دید):</span>
                <KVirtualList :items="big.slice(0, 5)" :item-height="40" :height="200" style="margin-top: 8px;">
                    <template #default="{ item }">
                        <div class="vl-row"><span style="flex: 1;">{{ item.name }}</span></div>
                    </template>
                </KVirtualList>
            </div>
            <div>
                <span class="sp-note">یک ردیف:</span>
                <KVirtualList :items="big.slice(0, 1)" :item-height="40" :height="160" style="margin-top: 8px;">
                    <template #default="{ item }">
                        <div class="vl-row"><span style="flex: 1;">{{ item.name }}</span></div>
                    </template>
                </KVirtualList>
            </div>
            <div>
                <span class="sp-note">فهرست خالی:</span>
                <KVirtualList :items="[]" :height="120" style="margin-top: 8px;" />
            </div>
        </div>

        <h3 class="sp-sub">کاربردی — لاگ رخدادها</h3>
        <div class="sp-card" style="max-width: 620px;">
            <KVirtualList :items="logs" :item-height="34" :height="300">
                <template #default="{ item, index }">
                    <div class="vl-row" style="gap: 10px; font-family: monospace; font-size: 0.74rem;">
                        <span class="vl-idx">{{ index + 1 }}</span>
                        <span :style="{ color: item.level === 'error' ? 'var(--k-error, #ef4444)' : 'var(--k-text-secondary)' }">
                            {{ item.level.toUpperCase() }}
                        </span>
                        <span style="flex: 1;">{{ item.text }}</span>
                        <span class="vl-meta">{{ item.at }}</span>
                    </div>
                </template>
            </KVirtualList>
        </div>
    </div>
</template>

<script setup lang="ts">
import KVirtualList from '../../ui-kit/components/KVirtualList.vue'

const names = ['سارا محمدی', 'رضا کریمی', 'مینا رستمی', 'امیر تهرانی', 'نگار احمدی', 'حسین نوری', 'لیلا صادقی', 'پویا رحیمی', 'سعید مرادی', 'زهرا کاظمی']
const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'رشت', 'یزد']
const levels = ['مبتدی', 'متوسط', 'پیشرفته']

const big = Array.from({ length: 2000 }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    city: cities[i % cities.length],
    level: levels[i % levels.length],
}))

const logs = Array.from({ length: 800 }, (_, i) => ({
    level: i % 17 === 0 ? 'error' : i % 5 === 0 ? 'warn' : 'info',
    text: i % 17 === 0 ? `درخواست ناموفق برای /api/courses/${i}` : `GET /api/courses/${i} → 200`,
    at: `۱۰:${String(i % 60).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}))
</script>

<style scoped>
.vl-row {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 12px;
    border-bottom: 1px solid var(--k-border);
    font-size: 0.8rem;
}
.vl-idx {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 20px;
    border-radius: 6px;
    background: var(--k-primary-light);
    color: var(--k-primary);
    font-size: 0.66rem;
    font-weight: 700;
}
.vl-meta {
    font-size: 0.72rem;
    color: var(--k-text-muted);
}
</style>
