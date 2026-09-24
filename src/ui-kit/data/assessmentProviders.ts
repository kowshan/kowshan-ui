/**
 * data/assessmentProviders.ts — one tiny mapper per provider.
 *
 * The kit owns a neutral schema (`types/assessment.ts`); each backend gets a
 * ~30-line mapper that turns its payload into that schema. Providers change,
 * components never do. Add a mapper per provider — keep them dumb.
 *
 * Already covered here:
 *   • `fromGenericProvider`  — the "normalized JSON" shape most APIs hand back
 *   • `fromFormsProvider`    — a Google-Forms-ish item list (RADIO/CHECKBOX/GRID/…)
 */
import type {
    Assessment,
    AssessmentOption,
    AssessmentQuestion,
    ContentBlock,
    InputKind,
    QuestionInput,
} from '../types/assessment'

/* ── 1. generic / normalized provider ─────────────────────── */

export interface GenericQuestion {
    id: string | number
    /** the provider's own type vocabulary */
    type:
        | 'short_text' | 'long_text' | 'number' | 'single_choice' | 'multi_choice'
        | 'scale' | 'matrix' | 'ranking' | 'file' | 'date' | 'time'
    prompt: string
    hint?: string
    /** any of these render through KAssessmentContent */
    text?: string
    image?: string
    audio?: string
    video?: string
    file?: { url: string; name?: string; size?: number; mime?: string }
    link?: { url: string; title?: string }
    choices?: { id: string | number; label?: string; image?: string; audio?: string; video?: string; score?: number }[]
    rows?: { id: string | number; label: string }[]
    columns?: { id: string | number; label: string }[]
    min?: number
    max?: number
    step?: number
    required?: boolean
    points?: number
    show_if?: { question_id: string | number; equals: any }
}

const inputFromType = (q: GenericQuestion): QuestionInput => {
    const map: Record<GenericQuestion['type'], InputKind> = {
        short_text: 'text',
        long_text: 'text',
        number: 'number',
        single_choice: 'choice',
        multi_choice: 'choice',
        scale: 'scale',
        matrix: 'matrix',
        ranking: 'ranking',
        file: 'upload',
        date: 'date',
        time: 'time',
    }
    const options: AssessmentOption[] = (q.choices || []).map(c => ({
        id: c.id,
        kind: c.video ? 'video' : c.audio ? 'audio' : c.image ? 'image' : 'text',
        label: c.label,
        media: c.video || c.audio || c.image,
        score: c.score,
    }))

    return {
        kind: map[q.type],
        multiline: q.type === 'long_text',
        multiple: q.type === 'multi_choice',
        options: options.length ? options : undefined,
        matrixRows: q.rows,
        matrixColumns: q.columns,
        min: q.min,
        max: q.max,
        step: q.step,
        layout: q.type === 'single_choice' && options.some(o => o.kind === 'image') ? 'grid' : 'list',
    }
}

const contentsFromQuestion = (q: GenericQuestion): ContentBlock[] => {
    const blocks: ContentBlock[] = []
    if (q.text) blocks.push({ kind: 'text', text: q.text })
    if (q.image) blocks.push({ kind: 'image', src: q.image, alt: q.prompt })
    if (q.audio) blocks.push({ kind: 'audio', src: q.audio })
    if (q.video) blocks.push({ kind: 'video', src: q.video })
    if (q.file) blocks.push({ kind: 'file', ...q.file })
    if (q.link) blocks.push({ kind: 'link', url: q.link.url, title: q.link.title })
    return blocks
}

/** `{ title, questions: [...] }` → Assessment */
export function fromGenericProvider(raw: {
    id?: string
    title: string
    description?: string
    duration_minutes?: number
    pass_score?: number
    questions: GenericQuestion[]
}): Assessment {
    const questions: AssessmentQuestion[] = raw.questions.map(q => ({
        id: String(q.id),
        title: q.prompt,
        hint: q.hint,
        contents: contentsFromQuestion(q),
        input: inputFromType(q),
        validation: q.required ? [{ kind: 'required' }] : [],
        condition: q.show_if
            ? { questionId: String(q.show_if.question_id), operator: 'equals', value: q.show_if.equals }
            : undefined,
        scoring: q.points != null ? [{ points: q.points }] : undefined,
    }))

    return {
        info: {
            id: raw.id,
            title: raw.title,
            description: raw.description,
            provider: 'generic',
            durationMinutes: raw.duration_minutes,
            passScore: raw.pass_score,
        },
        sections: [{ id: 'main', title: 'سؤالات', questions }],
    }
}

/* ── 2. forms-style provider (RADIO / CHECKBOX / GRID / …) ── */

export interface FormItem {
    itemId: string
    title: string
    description?: string
    /** provider enum */
    type: 'TEXT' | 'PARAGRAPH' | 'NUMBER' | 'RADIO' | 'CHECKBOX' | 'SCALE' | 'GRID' | 'FILE_UP' | 'DATE' | 'TIME'
    required?: boolean
    points?: number
    image?: string
    video?: string
    options?: { value: string; text?: string; image?: string; video?: string; points?: number }[]
    /** GRID only: left-hand rows, columns come from `scale` */
    rows?: string[]
    scale?: { low: number; high: number; lowLabel?: string; highLabel?: string }
}

export function fromFormsProvider(raw: {
    formId: string
    title: string
    description?: string
    sections?: { sectionId: string; title: string; items: FormItem[] }[]
    items?: FormItem[]
}): Assessment {
    const toQuestion = (item: FormItem): AssessmentQuestion => {
        const base: QuestionInput = { kind: 'text' }
        if (item.type === 'PARAGRAPH') Object.assign(base, { multiline: true, rows: 4 })
        if (item.type === 'NUMBER') base.kind = 'number'
        if (item.type === 'DATE') base.kind = 'date'
        if (item.type === 'TIME') base.kind = 'time'
        if (item.type === 'FILE_UP') base.kind = 'upload'
        if (item.type === 'RADIO' || item.type === 'CHECKBOX') {
            Object.assign(base, {
                kind: 'choice',
                multiple: item.type === 'CHECKBOX',
                layout: item.options?.some(o => o.image || o.video) ? 'grid' : 'list',
                options: (item.options || []).map<AssessmentOption>(o => ({
                    id: o.value,
                    value: o.value,
                    label: o.text,
                    kind: o.video ? 'video' : o.image ? 'image' : 'text',
                    media: o.video || o.image,
                    score: o.points,
                })),
            })
        }
        if (item.type === 'SCALE') {
            Object.assign(base, {
                kind: 'scale',
                min: item.scale?.low ?? 1,
                max: item.scale?.high ?? 5,
                minLabel: item.scale?.lowLabel,
                maxLabel: item.scale?.highLabel,
            })
        }
        if (item.type === 'GRID') {
            Object.assign(base, {
                kind: 'matrix',
                matrixRows: (item.rows || []).map((label, i) => ({ id: `r${i}`, label })),
                matrixColumns: Array.from(
                    { length: (item.scale?.high ?? 5) - (item.scale?.low ?? 1) + 1 },
                    (_, i) => {
                        const value = (item.scale?.low ?? 1) + i
                        return { id: value, value, label: String(value) }
                    }
                ),
            })
        }

        const contents: ContentBlock[] = []
        if (item.description) contents.push({ kind: 'text', text: item.description })
        if (item.image) contents.push({ kind: 'image', src: item.image, alt: item.title })
        if (item.video) contents.push({ kind: 'video', src: item.video })

        return {
            id: item.itemId,
            title: item.title,
            contents,
            input: base,
            validation: item.required ? [{ kind: 'required' }] : [],
            scoring: item.points != null ? [{ points: item.points }] : undefined,
        }
    }

    return {
        info: { id: raw.formId, title: raw.title, description: raw.description, provider: 'forms' },
        sections: raw.sections?.length
            ? raw.sections.map((s, i) => ({
                id: s.sectionId,
                title: s.title || `بخش ${i + 1}`,
                questions: s.items.map(toQuestion),
            }))
            : [{ id: 'main', title: raw.title, questions: (raw.items || []).map(toQuestion) }],
    }
}
