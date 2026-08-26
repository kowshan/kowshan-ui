<!-- components/layout/AppFooter.vue — site-wide footer -->
<template>
    <footer class="site-footer">
        <div class="site-footer-inner">
            <div class="site-footer-brand">
                <div class="site-footer-logo">
                    <span class="site-footer-mark">K</span>
                    <div>
                        <div class="site-footer-title">K UI Kit</div>
                        <div class="site-footer-sub">کیت رابط کاربری فارسی · نسخه ۲٫۰</div>
                    </div>
                </div>
                <p class="site-footer-desc">
                    مجموعه‌ای کامل از کامپوننت‌های Vue 3 آماده برای پروژه‌های فارسی.
                    کپی کنید، ایمپورت کنید، تمام.
                </p>
            </div>

            <div class="site-footer-cols">
                <div class="site-footer-col">
                    <div class="site-footer-col-title">کامپوننت‌ها</div>
                    <a href="#">فرم و ورودی</a>
                    <a href="#">نمایش داده</a>
                    <a href="#">بازخورد</a>
                    <a href="#">پیمایش</a>
                </div>
                <div class="site-footer-col">
                    <div class="site-footer-col-title">ماژول‌ها</div>
                    <a href="#">تقویم شمسی</a>
                    <a href="#">ابزارهای CRM</a>
                    <a href="#">رزرو</a>
                </div>
                <div class="site-footer-col">
                    <div class="site-footer-col-title">لینک‌ها</div>
                    <a href="#">مستندات</a>
                    <a href="#">GitHub</a>
                    <a href="#">نمونه‌ها</a>
                </div>
            </div>
        </div>

        <div class="site-footer-bottom">
            <span>ساخته‌شده با <code>Vue 3</code> و <code>TypeScript</code></span>
            <span>·</span>
            <span>وابستگی خارجی فقط <code>lucide-vue-next</code></span>
            <span>·</span>
            <span><strong>تیم کوشان (Kowshean)</strong></span>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    border-top: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    margin-top: auto;
}

.site-footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 48px;
    padding: 40px 24px 32px;
    flex-wrap: wrap;
}

/* Brand */
.site-footer-brand {
    flex: 1 1 280px;
    min-width: 200px;
}

.site-footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.site-footer-mark {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--k-primary, #1db954), color-mix(in srgb, var(--k-primary, #1db954) 70%, #fff));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 900;
}

.site-footer-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.site-footer-sub {
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
}

.site-footer-desc {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.9;
    color: var(--k-text-secondary, #64748b);
    max-width: 300px;
}

/* Columns */
.site-footer-cols {
    display: flex;
    gap: 36px;
    flex-wrap: wrap;
}

.site-footer-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 120px;
}

.site-footer-col-title {
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
    margin-bottom: 4px;
}

.site-footer-col a {
    font-size: 0.72rem;
    color: var(--k-text-secondary, #64748b);
    text-decoration: none;
    transition: color 0.12s ease;
}

.site-footer-col a:hover {
    color: var(--k-primary, #1db954);
}

/* Bottom bar */
.site-footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 14px 24px;
    border-top: 1px solid var(--k-border, #e2e8f0);
    font-size: 0.66rem;
    color: var(--k-text-muted, #94a3b8);
}

.site-footer-bottom code {
    font-size: 0.64rem;
}

@media (max-width: 700px) {
    .site-footer-inner {
        flex-direction: column;
        gap: 28px;
    }
}
</style>
