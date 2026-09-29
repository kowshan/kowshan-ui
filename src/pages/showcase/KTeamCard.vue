<template>
    <div class="sp">
        <h2 class="sp-title">KTeamCard</h2>

        <h3 class="sp-sub">پایه (نام + سمت)</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KTeamCard name="سارا محمدی" role="مدرس ارشد" />
        </div>

        <h3 class="sp-sub">با آواتار و بیوگرافی</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KTeamCard
                name="رضا کریمی"
                role="مدیر محصول"
                :avatar="avatar('#f59e0b', '#ef4444', 'ر')"
                bio="بیش از ۱۰ سال تجربه در طراحی محصولات آموزشی و مدیریت تیم‌های چابک."
            />
            <KTeamCard
                name="مینا رستمی"
                role="سرپرست پشتیبانی"
                :avatar="avatar('#22c55e', '#0d9488', 'م')"
                bio="مسئول تیم پشتیبانی و پاسخ‌گویی به تیکت‌های زبان‌آموزان."
            />
        </div>

        <h3 class="sp-sub">وضعیت حضور</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KTeamCard v-for="s in statuses" :key="s.name" :name="s.name" :role="s.role" :avatar="avatar(s.from, s.to, s.letter)" :status="s.status" />
        </div>

        <h3 class="sp-sub">با شبکه‌های اجتماعی</h3>
        <div class="sp-card" style="display: flex; flex-wrap: wrap; gap: 16px;">
            <KTeamCard
                name="امیر تهرانی"
                role="مهندس نرم‌افزار"
                :avatar="avatar('#6366f1', '#4338ca', 'ا')"
                bio="توسعه‌دهنده فرانت‌اند، عاشق طراحی سیستم‌های ساده."
                status="online"
                :socials="socials"
            />
        </div>

        <!-- The card owns the spacing, the consumer owns the buttons. A listing
             card still has destinations — they belong *inside* the surface. -->
        <h3 class="sp-sub">اسلات <code>#actions</code> — دکمه‌ها داخل سطح کارت</h3>
        <p class="sp-note">
            کارت فقط فاصله را می‌سازد؛ خودِ دکمه‌ها مال مصرف‌کننده است. بدون این اسلات، کارت
            جعبه‌اش را دست‌نخورده نگه می‌دارد — پس یک لیستِ تیمی می‌تواند نظرها، پروفایل و
            دوره‌های هر نفر را <b>داخل</b> کارت داشته باشد، نه شناور زیرش.
        </p>
        <div class="sp-card">
            <div class="team-grid">
                <KTeamCard
                    v-for="m in team"
                    :key="'act-' + m.name"
                    :name="m.name"
                    :role="m.role"
                    :avatar="m.avatar"
                    :status="m.status"
                >
                    <template #actions>
                        <div class="card-actions">
                            <button v-for="a in cardActions" :key="a.label" type="button" class="card-action">
                                <component :is="a.icon" :size="14" />
                                <span>{{ a.label }}</span>
                                <span v-if="a.count" class="card-action-count">{{ a.count }}</span>
                            </button>
                        </div>
                    </template>
                </KTeamCard>
            </div>
        </div>

        <h3 class="sp-sub">تیم کامل</h3>
        <div class="sp-card">
            <div class="team-grid">
                <KTeamCard
                    v-for="m in team"
                    :key="m.name"
                    :name="m.name"
                    :role="m.role"
                    :avatar="m.avatar"
                    :bio="m.bio"
                    :status="m.status"
                    :socials="socials"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BookOpen, Github, Linkedin, Mail, MessageCircle, Twitter, User } from 'lucide-vue-next'
import KTeamCard from '../../ui-kit/components/KTeamCard.vue'

const avatar = (from: string, to: string, letter: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23${from}'/><stop offset='1' stop-color='%23${to}'/></linearGradient></defs><rect width='96' height='96' fill='url(%23a)'/><text x='48' y='64' font-size='42' text-anchor='middle' fill='%23fff'>${letter}</text></svg>`

const socials = [
    { icon: Mail, url: '#', label: 'ایمیل' },
    { icon: Linkedin, url: '#', label: 'لینکدین' },
    { icon: Github, url: '#', label: 'گیت‌هاب' },
    { icon: Twitter, url: '#', label: 'توییتر' },
]

const statuses = [
    { name: 'سارا محمدی', role: 'مدرس ارشد', status: 'online' as const, from: '#8b5cf6', to: '#6366f1', letter: 'س' },
    { name: 'رضا کریمی', role: 'مدیر محصول', status: 'busy' as const, from: '#f59e0b', to: '#ef4444', letter: 'ر' },
    { name: 'مینا رستمی', role: 'پشتیبانی', status: 'away' as const, from: '#0ea5e9', to: '#0284c7', letter: 'م' },
    { name: 'امیر تهرانی', role: 'مهندس نرم‌افزار', status: 'offline' as const, from: '#94a3b8', to: '#475569', letter: 'ا' },
]

/* the row the `#actions` slot renders — icons with counts, like a listing card */
const cardActions = [
    { icon: MessageCircle, label: 'نظرها', count: '۲۴' },
    { icon: User, label: 'پروفایل', count: '' },
    { icon: BookOpen, label: 'دوره‌ها', count: '۳' },
]

const team = [
    { name: 'نگار احمدی', role: 'مدرس زبان', status: 'online' as const, bio: 'متخصص تدریس مکالمه برای بزرگسالان.', avatar: avatar('#ec4899', '#be185d', 'ن') },
    { name: 'حسین نوری', role: 'طراح گرافیک', status: 'away' as const, bio: 'طراحی هویت بصری و محتوای تصویری دوره‌ها.', avatar: avatar('#14b8a6', '#0f766e', 'ح') },
    { name: 'لیلا صادقی', role: 'مدیر آموزش', status: 'busy' as const, bio: 'برنامه‌ریزی مسیر یادگیری و زمان‌بندی کلاس‌ها.', avatar: avatar('#a855f7', '#7e22ce', 'ل') },
    { name: 'پویا رحیمی', role: 'تحلیل‌گر داده', status: 'online' as const, bio: 'تحلیل رفتار زبان‌آموزان و گزارش‌های پیشرفت.', avatar: avatar('#0ea5e9', '#1d4ed8', 'پ') },
]
</script>

<style scoped>
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 16px;
}
.card-actions {
    display: flex;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
}
.card-action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid var(--k-border);
    border-radius: 8px;
    background: transparent;
    color: var(--k-text-muted);
    font-family: inherit;
    font-size: 0.68rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
}
.card-action:hover {
    border-color: var(--k-primary);
    color: var(--k-primary);
    background: var(--k-primary-light);
}
.card-action-count {
    font-weight: 800;
    color: var(--k-text-secondary);
}
</style>
