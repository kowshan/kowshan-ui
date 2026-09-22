<template>
    <div class="sp">
        <h2 class="sp-title">KMarkdownRenderer</h2>

        <h3 class="sp-sub">کامل (تیتر، لیست، جدول، کد، نقل‌قول، لینک)</h3>
        <div class="sp-card">
            <KMarkdownRenderer :content="rich" />
        </div>

        <h3 class="sp-sub">حالت فشرده (compact)</h3>
        <div class="sp-card">
            <KMarkdownRenderer :content="rich" compact />
        </div>

        <h3 class="sp-sub">با بیشینه ارتفاع (اسکرول داخلی)</h3>
        <div class="sp-card">
            <KMarkdownRenderer :content="long" max-height="220px" />
        </div>

        <h3 class="sp-sub">متن ساده</h3>
        <div class="sp-card">
            <KMarkdownRenderer content="فقط یک پاراگراف ساده با **متن پررنگ** و *مورب* و `inline code`." />
        </div>

        <h3 class="sp-sub">محتوای دوره (نمونه واقعی)</h3>
        <div class="sp-card">
            <KMarkdownRenderer :content="courseDoc" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KMarkdownRenderer from '../../ui-kit/components/KMarkdownRenderer.vue'

const rich = `# عنوان اصلی
## زیرعنوان سطح دو

این یک پاراگراف است با **متن پررنگ**، *متن مورب* و \`کد درون‌خطی\`.

- مورد اول
- مورد دوم
  - مورد تودرتو

1. گام اول
2. گام دوم

> این یک نقل‌قول است.

| ویژگی | مقدار |
|-------|-------|
| سرعت | بالا |
| حجم | کم |

\`\`\`js
const kit = 'K-Kit'
console.log(kit)
\`\`\`

[مستندات](https://example.com)`

const long = `${rich}

---

### بخش تکمیلی
${Array.from({ length: 6 }, (_, i) => `پاراگراف شماره ${i + 1} برای بررسی اسکرول داخلی بیشینه ارتفاع.`).join('\n\n')}`

const courseDoc = `## اهداف این درس

در پایان این جلسه می‌توانید:

- یک **کامپوننت** مستقل بسازید
- پراپ‌ها و رویدادها را به‌درستی تعریف کنید
- از **composables** برای اشتراک منطق استفاده کنید

> نکته: همیشه دسترس‌پذیری (a11y) را در نظر بگیرید — \`aria-label\` و \`alt\` را فراموش نکنید.

\`\`\`bash
npm install k-kit
\`\`\``
</script>
