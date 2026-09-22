<template>
    <div class="sp">
        <h2 class="sp-title">KTypingIndicator</h2>

        <h3 class="sp-sub">پایه</h3>
        <div class="sp-card">
            <KTypingIndicator />
        </div>

        <h3 class="sp-sub">با نام کاربر</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KTypingIndicator name="سارا محمدی" />
            <KTypingIndicator name="رضا کریمی" />
            <KTypingIndicator name="پشتیبانی زبان‌سرا" />
        </div>

        <h3 class="sp-sub">سمت حباب — side="left" (طرف مقابل)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KTypingIndicator name="سارا محمدی" side="left" />
            <KTypingIndicator side="left" />
        </div>

        <h3 class="sp-sub">سمت حباب — side="right" (خودم)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 16px;">
            <KTypingIndicator name="سارا محمدی" side="right" />
            <KTypingIndicator side="right" />
        </div>
        <p class="sp-note">
            گوشه دنباله حباب با سمت عوض می‌شود (هم‌قاعده با KChat: پیام خودی راست، دیگران چپ).
        </p>

        <h3 class="sp-sub">حالت فشرده (compact)</h3>
        <div class="sp-card" style="display: flex; flex-direction: column; gap: 20px;">
            <KTypingIndicator compact />
            <KTypingIndicator name="مینا رستمی" compact />
        </div>

        <h3 class="sp-sub">در گفتگو — بالای جعبه پیام</h3>
        <div class="sp-card" style="max-width: 520px;">
            <div style="border: 1px solid var(--k-border); border-radius: 14px; overflow: hidden;">
                <div style="padding: 14px; display: flex; flex-direction: column; gap: 12px; background: var(--k-surface-hover);">
                    <div style="align-self: flex-end; max-width: 75%;">
                        <div style="background: var(--k-primary); color: #fff; padding: 8px 12px; border-radius: 12px; font-size: 0.8rem;">
                            سلام، تمرین جلسه ۵ رو فرستادم.
                        </div>
                    </div>
                    <div style="align-self: flex-start; max-width: 75%;">
                        <div style="background: var(--k-surface); border: 1px solid var(--k-border); padding: 8px 12px; border-radius: 12px; font-size: 0.8rem;">
                            عالیه، دارم بررسی می‌کنم.
                        </div>
                    </div>
                    <div style="align-self: flex-start;">
                        <KTypingIndicator name="سارا محمدی" compact side="left" />
                    </div>
                    <div style="align-self: flex-end;">
                        <KTypingIndicator name="شما" compact side="right" />
                    </div>
                </div>
                <div style="display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--k-border);">
                    <input
                        style="flex: 1; border: none; outline: none; background: transparent; font-family: inherit; font-size: 0.8rem;"
                        placeholder="پیام شما…"
                    />
                </div>
            </div>
        </div>

        <h3 class="sp-sub">زنده — با کلید</h3>
        <div class="sp-card">
            <KTypingIndicator v-if="typing" name="در حال نوشتن…" />
            <span v-else class="sp-note">کاربر در حال نوشتن نیست.</span>
            <div style="margin-top: 14px;">
                <KButton :text="typing ? 'توقف نوشتن' : 'شروع نوشتن'" @click="typing = !typing" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KTypingIndicator from '../../ui-kit/components/KTypingIndicator.vue'
import KButton from '../../ui-kit/components/KButton.vue'

const typing = ref(true)
</script>
