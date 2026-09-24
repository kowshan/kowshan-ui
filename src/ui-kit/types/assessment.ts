/**
 * types/assessment.ts — the kit's provider-agnostic assessment schema.
 *
 * Nothing here is tied to a vendor. Any exam/LMS/psychometric backend maps its
 * own payload onto this shape once (see `data/assessmentProviders.ts`), and the
 * kit components render it:
 *
 *   ASSESSMENT      → KAssessmentWizard
 *   ├── Info        → AssessmentInfo
 *   ├── Section     → AssessmentSection
 *   ├── Instructions→ AssessmentInstructions
 *   └── Result      → KAssessmentResult
 *
 *   CONTENT  (prompt material)  → KAssessmentContent   (6 kinds)
 *   INPUT    (the answer widget)→ KAssessmentInput     (9 kinds)
 *   OPTIONS  (answer choices)   → KAssessmentOption    (4 kinds)
 *   LOGIC                       → evaluated in useAssessment (Condition / LogicRule / ScoreRule)
 *   VALIDATION                  → evaluated in useAssessment (required / range / length / file)
 */

/* ── CONTENT ──────────────────────────────────────────────── */

export type ContentKind = 'text' | 'image' | 'audio' | 'video' | 'file' | 'link'

export interface ContentBlock {
    kind: ContentKind
    /** text: the body (plain or `html`). image/audio/video/file: caption. link: label */
    text?: string
    html?: string
    /** image/audio/video/file source */
    src?: string
    poster?: string
    /** file/link metadata */
    name?: string
    size?: number
    mime?: string
    url?: string
    title?: string
    alt?: string
    caption?: string
    /** media behaviour */
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
}

/* ── OPTIONS ──────────────────────────────────────────────── */

export type OptionKind = 'text' | 'image' | 'audio' | 'video'

export interface AssessmentOption {
    id: string | number
    /** defaults to 'text' */
    kind?: OptionKind
    label?: string
    description?: string
    /** media for image/audio/video options */
    media?: string
    poster?: string
    /** value written to the answer model — defaults to `id` */
    value?: string | number
    /** points awarded when this option is selected */
    score?: number
    /** marks the keyed answer (only used when you render results/corrections) */
    correct?: boolean
    feedback?: string
    /** small chip, e.g. «الف» or a tag */
    tag?: string
    disabled?: boolean
}

/* ── INPUT ────────────────────────────────────────────────── */

export type InputKind =
    | 'text'         // TextInput   (set `multiline` for long answers)
    | 'number'       // NumberInput
    | 'choice'       // ChoiceInput (single or multiple, options[])
    | 'scale'        // ScaleInput  (numeric slider / Likert)
    | 'matrix'       // MatrixInput (rows × columns grid)
    | 'ranking'      // RankingInput(orderable list)
    | 'upload'       // UploadInput (file/image)
    | 'date'         // DateInput   (Jalali)
    | 'time'         // TimeInput
    | 'select'       // Select      (one from a long list — 100 countries…)
    | 'multiselect'  // MultiSelect (several from a long list)

export interface MatrixRow {
    id: string | number
    label: string
    description?: string
}

export interface QuestionInput {
    kind: InputKind

    /* text */
    placeholder?: string
    multiline?: boolean
    rows?: number
    /** input-level length limits (mirrors the LengthRule) */
    length?: { min?: number; max?: number }

    /* number + scale */
    min?: number
    max?: number
    step?: number
    precision?: number
    prefix?: string
    suffix?: string

    /* choice */
    options?: AssessmentOption[]
    multiple?: boolean
    /** list | grid | inline | pills */
    layout?: 'list' | 'grid' | 'inline' | 'pills'
    /** grid columns for the choice layout */
    columns?: number

    /* scale */
    minLabel?: string
    maxLabel?: string

    /* matrix */
    /** row headers (matrix only — the text variant uses `rows`) */
    matrixRows?: MatrixRow[]
    /** matrix columns — pass options (each becomes a radio per row) */
    matrixColumns?: AssessmentOption[]

    /* upload */
    accept?: string
    maxSize?: number
    maxCount?: number
    /**
     * upload widget — inferred from `accept` when omitted
     * (`image/*` → image picker, `audio/*` → voice recorder, else file picker)
     */
    widget?: 'image' | 'record' | 'file'

    /* date / time */
    withSeconds?: boolean
}

/* ── LOGIC ────────────────────────────────────────────────── */

export type LogicOperator =
    | 'equals' | 'notEquals' | 'contains' | 'notContains' | 'includes'
    | 'isEmpty' | 'isNotEmpty'
    | 'gt' | 'gte' | 'lt' | 'lte'
    | 'in'

/** ConditionBuilder — a serialisable boolean tree over other answers */
export interface Condition {
    /** leaf: compare another question's answer … */
    questionId?: string
    operator?: LogicOperator
    value?: any
    /** branches: every / any child must hold, or negate */
    all?: Condition[]
    any?: Condition[]
    not?: Condition
}

/** RuleBuilder — when <condition>, do something to a target question */
export interface LogicRule {
    when: Condition
    effect: 'show' | 'hide' | 'require' | 'unrequire'
    /** defaults to the question that owns the rule */
    target?: string
    message?: string
}

/** ScoreRuleBuilder — points when a condition holds, or per selected option */
export interface ScoreRule {
    when?: Condition
    points: number
    label?: string
    /** award `points` per selected option instead of once */
    perOption?: boolean
}

/* ── VALIDATION ───────────────────────────────────────────── */

export type ValidationRule =
    | { kind: 'required'; message?: string }
    | { kind: 'range'; min?: number; max?: number; message?: string }
    | { kind: 'length'; min?: number; max?: number; message?: string }
    | { kind: 'file'; accept?: string; maxSize?: number; maxCount?: number; message?: string }
    /**
     * LIVE rule: checked as the user types (a URL that isn't a URL, an e-mail
     * that isn't one…). Unlike the other rules it can block the Next button,
     * because the value is present but wrong — see `useAssessment.liveError`.
     */
    | { kind: 'format'; format: ValidationFormat; message?: string }

/** mirrors `data/regexValidations` keys (url, email, phone, nationalId, ip, decimal…) */
export type ValidationFormat =
    | 'url' | 'email' | 'phone' | 'mobile' | 'nationalId' | 'postalCode' | 'bankCard'
    | 'sheba' | 'ip' | 'number' | 'decimal' | 'positiveNumber' | 'username' | 'slug'
    | 'jalaliDate' | 'gregorianDate' | 'time' | 'hexColor'

/* ── QUESTION / SECTION / ASSESSMENT ──────────────────────── */

export interface AssessmentQuestion {
    id: string
    /** display number — string keeps provider numbering («۲-۱») intact */
    number?: string | number
    title?: string
    hint?: string
    /** prompt material rendered above the input */
    contents?: ContentBlock[]
    input: QuestionInput
    validation?: ValidationRule[]
    /** simple visibility condition (LogicRule also works, this is the shorthand) */
    condition?: Condition
    logic?: LogicRule[]
    scoring?: ScoreRule[]
    /** shown after submit (or immediately, if `reveal` is on) */
    explanation?: string
    /** section binding is filled in by the wizard — never hand-write it */
    sectionId?: string
    meta?: Record<string, any>
}

export interface AssessmentSection {
    id: string
    title: string
    description?: string
    instructions?: string[]
    questions: AssessmentQuestion[]
    /** multiplies this section's points in the result breakdown */
    weight?: number
}

export interface AssessmentInstructions {
    title?: string
    /** strings render as text blocks, ContentBlock[] as rich material */
    items?: (string | ContentBlock)[]
    /** «قوانین را می‌پذیرم» gate before the first question */
    agreement?: { label: string; required?: boolean }
}

export interface AssessmentInfo {
    id?: string
    title: string
    description?: string
    provider?: string
    logo?: string
    durationMinutes?: number
    questionCount?: number
    passScore?: number
    maxScore?: number
    meta?: { label: string; value: string }[]
}

export interface SectionResult {
    sectionId: string
    title: string
    score: number
    maxScore: number
    answered: number
    total: number
}

export interface AssessmentResult {
    score: number
    maxScore: number
    percent: number
    passed: boolean
    answered: number
    total: number
    sections: SectionResult[]
    message?: string
}

export interface Assessment {
    info: AssessmentInfo
    instructions?: AssessmentInstructions
    sections: AssessmentSection[]
    /** optional pass/fail copy per band */
    bands?: { minPercent: number; message: string }[]
}

/** answers model: questionId → value */
export type AssessmentAnswers = Record<string, any>
