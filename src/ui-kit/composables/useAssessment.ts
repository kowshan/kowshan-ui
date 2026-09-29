/**
 * composables/useAssessment.ts — the assessment engine.
 *
 * Pure, provider-agnostic logic over `types/assessment.ts`: conditions (LOGIC),
 * validation (RequiredRule / RangeRule / LengthRule / FileRule), scoring, and
 * progress. The KAssessment* components are dumb views on top of this, so an app
 * can drive an assessment without any UI — or write its own views.
 */
import { computed, reactive, watch, type Ref } from 'vue'
import { regexValidations } from '../data/regexValidations'
import type {
    Assessment,
    AssessmentAnswers,
    AssessmentQuestion,
    AssessmentResult,
    Condition,
    LogicOperator,
    SectionResult,
    ValidationRule,
    ValidationFormat,
} from '../types/assessment'

/* ── helpers ──────────────────────────────────────────────── */

export const isBlank = (v: any): boolean =>
    v == null || v === '' || (Array.isArray(v) && v.length === 0)

const num = (v: any): number => (typeof v === 'number' ? v : parseFloat(String(v ?? '')))

function compare(left: any, op: LogicOperator, right: any): boolean {
    switch (op) {
        case 'equals': return String(left) === String(right)
        case 'notEquals': return String(left) !== String(right)
        case 'contains': return String(left ?? '').includes(String(right))
        case 'notContains': return !String(left ?? '').includes(String(right))
        case 'includes':
            return Array.isArray(left)
                ? left.map(String).includes(String(right))
                : String(left ?? '').includes(String(right))
        case 'isEmpty': return isBlank(left)
        case 'isNotEmpty': return !isBlank(left)
        case 'gt': return num(left) > num(right)
        case 'gte': return num(left) >= num(right)
        case 'lt': return num(left) < num(right)
        case 'lte': return num(left) <= num(right)
        case 'in':
            return Array.isArray(right)
                ? right.map(String).includes(String(left))
                : String(right ?? '').includes(String(left))
        default: return false
    }
}

/** ConditionBuilder — evaluate a serialisable boolean tree over the answers */
export function evaluateCondition(cond: Condition | undefined, answers: AssessmentAnswers): boolean {
    if (!cond) return true
    if (cond.all?.length && !cond.all.every(c => evaluateCondition(c, answers))) return false
    if (cond.any?.length && !cond.any.some(c => evaluateCondition(c, answers))) return false
    if (cond.not && evaluateCondition(cond.not, answers)) return false
    if (cond.questionId) {
        return compare(answers[cond.questionId], cond.operator || 'equals', cond.value)
    }
    return true
}

/** flatten sections → questions (adds `sectionId` + the section weight) */
export function flattenQuestions(assessment: Assessment) {
    const seen = new Set<string>()
    const out: { question: AssessmentQuestion; sectionId: string; weight: number }[] = []
    for (const section of assessment.sections || []) {
        for (const question of section.questions || []) {
            // a provider can reuse a question id across sections — don't duplicate answers
            const q: AssessmentQuestion = { ...question, sectionId: section.id }
            if (seen.has(q.id)) continue
            seen.add(q.id)
            out.push({ question: q, sectionId: section.id, weight: section.weight ?? 1 })
        }
    }
    return out
}

/* ── validation (RequiredRule / RangeRule / LengthRule / FileRule) ── */

export function validateFormat(format: ValidationFormat, value: any): string | null {
    if (isBlank(value)) return null
    const re = regexValidations[format as keyof typeof regexValidations]
    if (!re) return null
    const raw = String(value).trim()
    if (re.test(raw)) return null
    const labels: Partial<Record<ValidationFormat, string>> = {
        url: 'نشانی وب معتبر نیست (مثال: https://example.com).',
        email: 'ایمیل معتبر نیست.',
        phone: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.',
        mobile: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.',
        nationalId: 'کد ملی باید ۱۰ رقم باشد.',
        postalCode: 'کد پستی باید ۱۰ رقم باشد.',
        bankCard: 'شماره کارت باید ۱۶ رقم باشد.',
        sheba: 'شماره شبا باید با IR و ۲۴ رقم باشد.',
        ip: 'نشانی IP معتبر نیست.',
        number: 'فقط رقم مجاز است.',
        decimal: 'عدد اعشاری معتبر نیست.',
        positiveNumber: 'عدد باید بزرگ‌تر از صفر باشد.',
        username: 'نام کاربری باید ۳ تا ۲۰ نویسهٔ انگلیسی/عدد باشد.',
        slug: 'قالب نامک (slug) درست نیست.',
        time: 'ساعت معتبر نیست (مثال: 14:30).',
        jalaliDate: 'تاریخ جلالی معتبر نیست (مثال: 1403/05/12).',
        gregorianDate: 'تاریخ میلادی معتبر نیست (مثال: 2024-08-02).',
        hexColor: 'کد رنگ معتبر نیست (مثال: #1db954).',
    }
    return labels[format] || 'قالب مقدار درست نیست.'
}

/**
 * @param mode 'live'   → only `format` rules (value present but malformed) — safe to run on every keystroke
 *             'submit' → every rule (required / range / length / file / format)
 */
export function validateAnswer(
    question: AssessmentQuestion,
    value: any,
    rules: ValidationRule[] = question.validation || [],
    mode: 'live' | 'submit' = 'submit'
): string | null {
    const input = question.input

    for (const rule of rules) {
        if (mode === 'live' && rule.kind !== 'format') continue
        switch (rule.kind) {
            case 'format': {
                const message = validateFormat(rule.format, value)
                if (message) return rule.message || message
                break
            }
            case 'required': {
                const ok = input.kind === 'matrix'
                    ? value && typeof value === 'object'
                        && (input.matrixRows || []).every(r => !isBlank(value[r.id]))
                    : !isBlank(value)
                if (!ok) return rule.message || 'پاسخ این سؤال الزامی است.'
                break
            }
            case 'length': {
                const len = typeof value === 'string' ? value.length : Array.isArray(value) ? value.length : 0
                if (rule.min != null && len < rule.min) {
                    return rule.message || `حداقل ${rule.min} نویسه لازم است.`
                }
                if (rule.max != null && len > rule.max) {
                    return rule.message || `حداکثر ${rule.max} نویسه مجاز است.`
                }
                break
            }
            case 'range': {
                if (isBlank(value)) break
                const n = num(value)
                if (rule.min != null && n < rule.min) return rule.message || `مقدار باید ≥ ${rule.min} باشد.`
                if (rule.max != null && n > rule.max) return rule.message || `مقدار باید ≤ ${rule.max} باشد.`
                break
            }
            case 'file': {
                if (isBlank(value)) break
                const files = Array.isArray(value) ? value : [value]
                if (rule.maxCount != null && files.length > rule.maxCount) {
                    return rule.message || `حداکثر ${rule.maxCount} فایل مجاز است.`
                }
                if (rule.maxSize != null) {
                    const over = files.some((f: any) => f?.size > rule.maxSize!)
                    if (over) {
                        // scale-aware: a 2 MB limit printed as «0.0 مگابایت» is the
                        // signature of bytes fed in where kilobytes were meant, and
                        // a sub-megabyte limit reads better in kilobytes either way
                        const size = rule.maxSize >= 1024 * 1024
                            ? `${(rule.maxSize / (1024 * 1024)).toFixed(1)} مگابایت`
                            : `${Math.round(rule.maxSize / 1024)} کیلوبایت`
                        return rule.message || `حجم هر فایل باید کمتر از ${size} باشد.`
                    }
                }
                if (rule.accept) {
                    const ok = files.every((f: any) => !f?.type || rule.accept!.includes(f.type))
                    if (!ok) return rule.message || 'نوع فایل مجاز نیست.'
                }
                break
            }
        }
    }
    return null
}

/* ── scoring ──────────────────────────────────────────────── */

function scoreQuestion(question: AssessmentQuestion, value: any, answers: AssessmentAnswers): number {
    const rules = question.scoring || []
    if (!rules.length) return 0
    let total = 0
    const chosen = Array.isArray(value) ? value.map(String) : isBlank(value) ? [] : [String(value)]

    for (const rule of rules) {
        if (rule.when && !evaluateCondition(rule.when, answers)) continue
        if (rule.perOption) {
            const opts = question.input.options || []
            total += chosen.filter(c => opts.some(o => String(o.value ?? o.id) === c)).length * rule.points
        } else {
            total += rule.points
        }
    }

    // option-level scores are additive on top of the rules
    const opts = question.input.options || []
    for (const opt of opts) {
        if (opt.score == null) continue
        if (chosen.includes(String(opt.value ?? opt.id))) total += opt.score
    }
    return total
}

export function computeResult(
    assessment: Assessment,
    answers: AssessmentAnswers,
    visibleIds?: Set<string>
): AssessmentResult {
    const flat = flattenQuestions(assessment).filter(f => !visibleIds || visibleIds.has(f.question.id))
    const perSection = new Map<string, SectionResult>()
    let score = 0
    let maxScore = 0
    let answered = 0

    for (const { question, sectionId, weight } of flat) {
        const value = answers[question.id]
        if (!isBlank(value)) answered++
        const qScore = scoreQuestion(question, value, answers) * weight
        const qMax = (question.scoring || []).reduce((sum, r) => {
            const opts = question.input.options || []
            const best = opts.length
                ? Math.max(0, ...opts.map(o => (o.score ?? 0)))
                : Math.abs(r.points)
            return sum + (r.perOption ? best : Math.abs(r.points))
        }, 0) * weight

        score += qScore
        maxScore += qMax

        const section = assessment.sections.find(s => s.id === sectionId)
        const entry = perSection.get(sectionId) || {
            sectionId,
            title: section?.title || sectionId,
            score: 0,
            maxScore: 0,
            answered: 0,
            total: 0,
        }
        entry.score += qScore
        entry.maxScore += qMax
        entry.total += 1
        if (!isBlank(value)) entry.answered += 1
        perSection.set(sectionId, entry)
    }

    const max = assessment.info.maxScore ?? maxScore
    const percent = max > 0 ? Math.round((score / max) * 100) : 0
    const passed = assessment.info.passScore != null
        ? score >= assessment.info.passScore
        : percent >= 50
    const band = [...(assessment.bands || [])]
        .sort((a, b) => b.minPercent - a.minPercent)
        .find(b => percent >= b.minPercent)

    return {
        score: Math.round(score * 100) / 100,
        maxScore: max,
        percent,
        passed,
        answered,
        total: flat.length,
        sections: [...perSection.values()],
        message: band?.message,
    }
}

/* ── the composable ───────────────────────────────────────── */

export function useAssessment(assessment: Assessment, model?: Ref<AssessmentAnswers>) {
    const store = model || (reactive<AssessmentAnswers>({}) as unknown as Ref<AssessmentAnswers>)
    const answers = (model ? model.value : store) as AssessmentAnswers

    /** manual overrides from LogicRule effects (show / hide / require) */
    const overrides = reactive<Record<string, 'show' | 'hide' | 'require' | 'unrequire'>>({})

    const flat = computed(() => flattenQuestions(assessment))

    /** which LogicRules currently fire, per question */
    const fired = computed(() => {
        const map: Record<string, { visible?: boolean; required?: boolean; message?: string }> = {}
        for (const { question } of flat.value) {
            for (const rule of question.logic || []) {
                if (!evaluateCondition(rule.when, answers)) continue
                const target = rule.target || question.id
                const entry = (map[target] ||= {})
                if (rule.effect === 'show') entry.visible = true
                if (rule.effect === 'hide') entry.visible = false
                if (rule.effect === 'require') entry.required = true
                if (rule.effect === 'unrequire') entry.required = false
                if (rule.message) entry.message = rule.message
            }
        }
        return map
    })

    const isVisible = (id: string) => {
        const override = overrides[id]
        if (override === 'hide') return false
        if (override === 'show') return true
        const question = flat.value.find(f => f.question.id === id)?.question
        if (!question) return true
        const rule = fired.value[id]
        if (rule?.visible !== undefined) return rule.visible
        return evaluateCondition(question.condition, answers)
    }

    const isRequired = (id: string) => {
        const question = flat.value.find(f => f.question.id === id)?.question
        const rule = fired.value[id]
        if (rule?.required !== undefined) return rule.required
        return (question?.validation || []).some(r => r.kind === 'required')
    }

    const visibleQuestions = computed(() =>
        flat.value.filter(f => isVisible(f.question.id)).map(f => f.question)
    )

    const visibleIds = computed(() => new Set(visibleQuestions.value.map(q => q.id)))

    const answeredCount = computed(() =>
        visibleQuestions.value.filter(q => !isBlank(answers[q.id])).length
    )

    const progress = computed(() =>
        visibleQuestions.value.length
            ? Math.round((answeredCount.value / visibleQuestions.value.length) * 100)
            : 0
    )

    /** validation message per question, filled as the user touches things */
    const errors = reactive<Record<string, string | null>>({})

    /** live, non-blocking-until-typed errors — safe on every keystroke */
    const liveErrors = computed<Record<string, string | null>>(() => {
        const map: Record<string, string | null> = {}
        for (const question of visibleQuestions.value) {
            map[question.id] = validateAnswer(question, answers[question.id], undefined, 'live')
        }
        return map
    })

    /** format errors for a set of questions (used to gate the Next button) */
    function liveErrorsIn(ids: string[]): Record<string, string | null> {
        const map: Record<string, string | null> = {}
        for (const id of ids) if (liveErrors.value[id]) map[id] = liveErrors.value[id]
        return map
    }

    /** submit-time validation for one question (required / range / length / file / format) */
    function validateQuestion(id: string): string | null {
        const question = flat.value.find(f => f.question.id === id)?.question
        if (!question || !isVisible(id)) {
            errors[id] = null
            return null
        }
        let message = validateAnswer(question, answers[id])
        if (!message && isRequired(id) && isBlank(answers[id])) {
            message = 'پاسخ این سؤال الزامی است.'
        }
        errors[id] = message
        return message
    }

    /** validate several questions at once (a page / a section) */
    function validateMany(ids: string[]): { ok: boolean; firstInvalid: string | null } {
        let firstInvalid: string | null = null
        for (const id of ids) {
            const message = validateQuestion(id)
            if (message && !firstInvalid) firstInvalid = id
        }
        return { ok: !firstInvalid, firstInvalid }
    }

    function validateAll(): { ok: boolean; firstInvalid: string | null; errors: Record<string, string | null> } {
        const { firstInvalid } = validateMany(visibleQuestions.value.map(q => q.id))
        return { ok: !firstInvalid, firstInvalid, errors }
    }

    function setAnswer(id: string, value: any) {
        answers[id] = value
        // clear a pending error as soon as the user answers
        if (!isBlank(value)) errors[id] = null
    }

    const result = computed<AssessmentResult>(() =>
        computeResult(assessment, answers, visibleIds.value)
    )

    function reset() {
        for (const key of Object.keys(answers)) delete answers[key]
        for (const key of Object.keys(errors)) delete errors[key]
        for (const key of Object.keys(overrides)) delete overrides[key]
    }

    /** answers shaped for a submittable payload (only visible questions) */
    const payload = computed(() =>
        visibleQuestions.value.reduce<AssessmentAnswers>((acc, q) => {
            if (!isBlank(answers[q.id])) acc[q.id] = answers[q.id]
            return acc
        }, {})
    )

    /**
     * The final answer list, in question order — what you POST to your backend and
     * what your provider mapper will turn back into the vendor's payload.
     */
    const answerList = computed(() =>
        flat.value.map(({ question, sectionId }) => ({
            questionId: question.id,
            sectionId,
            kind: question.input.kind,
            number: question.number ?? null,
            title: question.title ?? '',
            value: answers[question.id] ?? null,
            answered: !isBlank(answers[question.id]),
            visible: isVisible(question.id),
        }))
    )

    // recalculate errors when visibility changes so hidden required questions
    // never block the next step
    watch(visibleIds, (ids) => {
        for (const key of Object.keys(errors)) if (!ids.has(key)) errors[key] = null
    })

    return {
        answers,
        errors,
        liveErrors,
        flat,
        visibleQuestions,
        visibleIds,
        answeredCount,
        progress,
        result,
        payload,
        answerList,
        overrides,
        isVisible,
        isRequired,
        liveErrorsIn,
        validateQuestion,
        validateMany,
        validateAll,
        setAnswer,
        reset,
    }
}
