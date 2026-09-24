<!-- components/KForm.vue -->
<!--
    KForm — rules-driven form wrapper (Laravel-style validation summary):

      <KForm :model="form" :rules="rules" @submit="onSubmit">
        <KTextInput v-model="form.name" label="نام" />
        <KTextInput v-model="form.phone" label="موبایل" />
        <template #actions="{ errors }">
          <KButton type="submit" text="ثبت" bg-color="var(--k-primary)" text-color="#fff" />
        </template>
      </KForm>

      const rules = {
        name:  [{ required: true, message: 'نام الزامی است' }],
        phone: [{ pattern: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست' }],
      }

    Emits `submit(model, errors)` when every rule passes, `invalid(errors)` otherwise.
-->
<template>
    <form class="k-form" novalidate @submit.prevent="onSubmit">
        <slot :errors="errors" :validate="validate" />

        <!-- Validation summary (like Laravel's error block) -->
        <div
            v-if="showSummary && summaryErrors.length"
            class="k-form-summary"
            role="alert"
        >
            <div class="k-form-summary-title">
                <AlertCircle :size="15" />
                <span>اطلاعات را بررسی کنید</span>
            </div>
            <ul class="k-form-summary-list">
                <li v-for="(err, i) in summaryErrors" :key="i">{{ err }}</li>
            </ul>
        </div>

        <slot name="actions" :errors="errors" :valid="valid" :validate="validate" />
    </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { useValidation } from '../composables/useValidation'
import type { ValidationRules } from '../types'

const props = withDefaults(defineProps<{
    /** the live form model — read for validation, never mutated by KForm */
    model: Record<string, any>
    /** field name → rules (same shape as the core inputs' `rules`) */
    rules?: Record<string, ValidationRules>
    /** show the error summary block after a failed submit */
    showSummary?: boolean
}>(), {
    rules: () => ({}),
    showSummary: true
})

const emit = defineEmits<{
    (e: 'submit', model: Record<string, any>, errors: Record<string, string>): void
    (e: 'invalid', errors: Record<string, string>): void
}>()

const { validate: validateValue } = useValidation()
const errors = reactive<Record<string, string>>({})

const valid = computed(() => Object.keys(errors).length === 0)

const summaryErrors = computed(() => Object.values(errors))

function validate(): boolean {
    for (const key of Object.keys(errors)) delete errors[key]
    for (const [field, fieldRules] of Object.entries(props.rules)) {
        const result = validateValue(props.model[field], fieldRules, props.model)
        if (!result.isValid && result.error) {
            errors[field] = result.error
        }
    }
    return valid.value
}

function reset() {
    for (const key of Object.keys(errors)) delete errors[key]
}

function onSubmit() {
    const ok = validate()
    if (!ok) {
        emit('invalid', { ...errors })
        return
    }
    emit('submit', props.model, { ...errors })
}

defineExpose({ validate, reset, errors })
</script>

<style scoped>
.k-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
}

.k-form-summary {
    background: var(--k-error-light, #fee2e2);
    border: 1px solid color-mix(in srgb, var(--k-error, #ef4444) 30%, transparent);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.k-form-summary-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--k-error, #ef4444);
    font-size: 0.74rem;
    font-weight: 700;
}

.k-form-summary-list {
    margin: 0;
    padding-inline-start: 18px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: var(--k-text-primary, #1e293b);
    font-size: 0.7rem;
}
</style>
