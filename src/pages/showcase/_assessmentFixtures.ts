/**
 * showcase/_assessmentFixtures.ts — data shared by the assessment examples.
 *
 * Not a page: the viewer only globs `K*.vue` / `Example*.vue`, so this file is
 * never routed. It exists so each demo step can realistically hold ten
 * questions without copy-pasting sixty country names five times.
 */
import type { AssessmentQuestion } from '../../ui-kit/types/assessment'

/* exactly the case the 4-option layouts can't handle: a 60-item list */
export const countries = [
    'ایران', 'افغانستان', 'ترکیه', 'عراق', 'پاکستان', 'هند', 'چین', 'ژاپن', 'کره جنوبی', 'اندونزی',
    'مالزی', 'عربستان', 'امارات', 'قطر', 'عمان', 'کویت', 'بحرین', 'آذربایجان', 'ارمنستان', 'گرجستان',
    'روسیه', 'اوکراین', 'آلمان', 'فرانسه', 'ایتالیا', 'اسپانیا', 'پرتغال', 'انگلستان', 'هلند', 'بلژیک',
    'سوئد', 'نروژ', 'دانمارک', 'فنلاند', 'سوئیس', 'اتریش', 'یونان', 'لهستان', 'چک', 'مجارستان',
    'کانادا', 'آمریکا', 'مکزیک', 'برزیل', 'آرژانتین', 'شیلی', 'کلمبیا', 'پرو', 'استرالیا', 'نیوزیلند',
    'مصر', 'آفریقای جنوبی', 'نیجریه', 'کنیا', 'مراکش', 'تونس', 'الجزایر', 'لیبی', 'لبنان', 'اردن',
].map((label, i) => ({ id: `c${i + 1}`, value: `c${i + 1}`, label }))

export const interests = [
    'ریاضی', 'فیزیک', 'شیمی', 'زیست', 'ادبیات', 'تاریخ', 'جغرافیا', 'زبان انگلیسی',
    'برنامه‌نویسی', 'طراحی', 'موزیک', 'ورزش', 'عکاسی', 'هنر',
].map((label, i) => ({ id: `i${i + 1}`, value: `i${i + 1}`, label }))

/**
 * N plain multiple-choice questions — the long-form padding a real attempt has.
 * `startAt` keeps the numbering continuous with the hand-written questions.
 */
export function choiceFillers(prefix: string, count: number, startAt = 1): AssessmentQuestion[] {
    return Array.from({ length: count }, (_, i) => {
        const n = startAt + i
        return {
            id: `${prefix}-${n}`,
            number: String(n),
            title: `سؤال شماره ${n}: کدام گزینه درست است؟`,
            input: {
                kind: 'choice',
                options: [
                    { id: 'a', label: 'گزینهٔ اول' },
                    { id: 'b', label: 'گزینهٔ دوم' },
                    { id: 'c', label: 'گزینهٔ سوم' },
                ],
            },
            validation: [{ kind: 'required' }],
            scoring: [{ points: 1 }],
        } as AssessmentQuestion
    })
}

/** N Likert-scale statements (1–5) */
export function scaleFillers(prefix: string, count: number, startAt = 1): AssessmentQuestion[] {
    return Array.from({ length: count }, (_, i) => {
        const n = startAt + i
        return {
            id: `${prefix}-s${n}`,
            number: String(n),
            title: `جملهٔ ${n}: با این گزاره موافقم.`,
            input: { kind: 'scale', min: 1, max: 5, minLabel: 'کاملاً مخالفم', maxLabel: 'کاملاً موافقم' },
            validation: [{ kind: 'required' }],
            scoring: [{ points: 1 }],
        } as AssessmentQuestion
    })
}
