# Assessment module — integration guide

Everything in this folder path: `ui-kit/` + `ui-kit/docs/assessment.md`.
The module plays **exams, surveys and psychometrics** from one neutral schema, so
any backend (custom API, LMS, exam vendor) plugs in through a small mapper.

- Components: `components/KAssessment*.vue`
- Schema: `types/assessment.ts`
- Engine: `composables/useAssessment.ts`
- Provider mappers: `data/assessmentProviders.ts`

---

## 1. Dependencies

**No new dependencies.** The module reuses what the kit already ships:

| Uses | For |
|---|---|
| `lucide-vue-next` | icons (already required by the kit) |
| `KTextInput`, `KTextarea`, `KNumberInput`, `KSlider`, `KSelect`, `KMultiSelect`, `KDatePicker`, `KTimePicker`, `KFileInput`, `KSortableList` | the input kinds |
| `KProgress`, `KStepper`, `KButton`, `KCheckbox`, `KProgressRing` | wizard chrome and the result screen |
| `data/regexValidations.ts` | the live `format` rules (url, email, phone, nationalId…) |
| CSS: `assets/ui-kit.css` (+ `calendar.css` for `date`) | theming |

So: if the app already renders the kit, there is nothing to install.

---

## 2. Minimal integration

```vue
<script setup lang="ts">
import { ref } from 'vue'
import KAssessmentWizard from '~/components/ui-kit/components/KAssessmentWizard.vue'
import type { Assessment, AssessmentAnswers } from '~/components/ui-kit/types/assessment'

const assessment = ref<Assessment>(/* from your API */)
const answers = ref<AssessmentAnswers>({})

async function onSubmit({ answers, list, result }) {
  // `list` is the ordered, provider-agnostic answer list — see §7
  await $fetch('/api/assessments/' + assessment.value.info.id + '/submit', {
    method: 'POST',
    body: { answers, list, score: result.score },
  })
}
</script>

<template>
  <KAssessmentWizard :assessment="assessment" :per-page="5" v-model="answers" @submit="onSubmit" />
</template>
```

The host needs **no** global layer for this component — it renders in place. (Toasts
and modals still need `KGlobalLayer` / `KTeleportHub` in the layout, as documented in
the kit README.)

### Props

| Prop | Default | Meaning |
|---|---|---|
| `assessment` | — | the `Assessment` object |
| `v-model` | `{}` | answers map `questionId → value` |
| `per-page` | `0` | questions per step — `5` paginates the whole assessment, `0` walks it section by section |
| `result` | `null` | show a server-computed `AssessmentResult` instead of scoring locally |
| `start-at-result` | `false` | open straight on the result step (review mode) |
| `submitting` | `false` | locks inputs + shows the loading state |
| `disabled` | `false` | read-only |
| `show-stepper` | `true` | hide it for long exams and rely on the progress bar |
| `reveal-answers` | `false` | show each question's `explanation` after submit |

### Events

| Event | Payload |
|---|---|
| `update:modelValue` | the answers map (use `v-model`) |
| `submit` | `{ answers, list, result }` |
| `step-change` | `(index, id)` |
| `timeout` | fired once when `info.durationMinutes` runs out (the wizard auto-submits) |
| `close` | `(result)` from the result step's «پایان» button |

### Exposed API (template ref)

`goTo(index)`, `next()`, `prev()`, `submit()`, `restart()`, `validateAll()`,
`answerList`, `activeIds`, `result`, `answers`.

---

## 3. The schema in one screen

```
Assessment
├── info        { title, description, provider, logo, durationMinutes, passScore, meta[] }
├── instructions{ title, items[], agreement? }
├── sections[]  { id, title, description, instructions[], weight }
│   └── questions[]           AssessmentQuestion
│       ├── contents[]        ContentBlock    text · image · audio · video · file · link
│       ├── input             QuestionInput   see below
│       ├── validation[]      ValidationRule  required · range · length · file · format
│       ├── condition / logic Condition / LogicRule
│       ├── scoring[]         ScoreRule
│       └── explanation
└── bands[]     { minPercent, message }
```

`QuestionInput.kind` — the 11 input types:

| kind | renders | answer value |
|---|---|---|
| `text` | `KTextInput` / `KTextarea` (`multiline`) | `string` |
| `number` | `KNumberInput` | `number` |
| `choice` | options (`single` / `multiple`) with `layout: list \| grid \| inline \| pills` | value or value[] |
| `scale` | `KSlider` (Likert) | `number` |
| `matrix` | rows × `matrixColumns` | `{ [rowId]: value }` |
| `ranking` | `KSortableList` | ordered `value[]` |
| `upload` | widget picked from `accept`: `image/*` → `KImageUpload`, `audio/*` → `KVoiceRecorder`, else `KFileInput` (override with `widget: 'image' \| 'record' \| 'file'`; `maxCount`/`maxSize` always apply) | `File` / `File[]` |
| `date` | `KDatePicker` (Jalali) | `string` |
| `time` | `KTimePicker` | `string` |
| `select` | `KSelect` (long lists — 100 countries) | value |
| `multiselect` | `KMultiSelect` | value[] |

Options (`AssessmentOption`) can be `text · image · audio · video`, and can carry
`score`, `correct`, `feedback`, `tag` (e.g. «الف»), `disabled`.

---

## 4. Validation model — live vs submit

Every `ValidationRule` is evaluated by `useAssessment`; the wizard splits them in two tiers on purpose:

**Live (`format`)** — the value is present but wrong, so it is checked on every
keystroke, shown immediately, **and disables the Next button**:

```ts
{ id: 'site', input: { kind: 'text' },
  validation: [{ kind: 'format', format: 'url' }] }        // url|email|phone|mobile|nationalId|postalCode|bankCard|sheba|ip|number|decimal|positiveNumber|username|slug|jalaliDate|gregorianDate|time|hexColor
```

**Submit-time (`required`, `range`, `length`, `file`)** — nothing is revealed while
the user is still answering. When Next is pressed the wizard validates that page,
reveals every problem and **scrolls to the first unanswered question** (rather than
silently blocking the button):

```ts
{ id: 'bio', input: { kind: 'text', multiline: true },
  validation: [{ kind: 'required' }, { kind: 'length', max: 300 }] }
```

Use it headlessly if you build your own layout:

```ts
const { liveErrors, validateMany, validateAll, progress, payload, answerList, result } = useAssessment(a)
```

Pure helpers (`evaluateCondition`, `validateAnswer`, `computeResult`) are exported
too, so the **same rules can run on the server** and produce identical scores.

---

## 5. Logic — conditional questions and scoring

```ts
// show question B only if A was answered "yes"
{ id: 'b', condition: { questionId: 'a', operator: 'equals', value: 'yes' } }

// or a serialisable tree
{ id: 'c', condition: { all: [ { questionId: 'a', operator: 'gte', value: 5 },
                               { not: { questionId: 'b', operator: 'isEmpty' } } ] } }

// richer effects (show/hide/require/unrequire a *target* question)
{ id: 'd', logic: [{ when: { questionId: 'a', operator: 'isNotEmpty' },
                     effect: 'require', target: 'd', message: 'پاسخ لازم است.' }] }

// scoring: flat points, points per selected option, or points when a condition holds
{ id: 'e', scoring: [{ points: 2 }, { when: { questionId: 'a', operator: 'equals', value: 'x' }, points: 1 }] }
{ id: 'f', scoring: [{ points: 1, perOption: true }] }
```

A question is hidden ⇒ its answer stops flowing into `payload`/`answerList`, its
errors are cleared, and it is excluded from progress and scoring.

---

## 6. Layouts

- **Page size:** `per-page="5"` — the wizard pages the whole assessment; a page that
  crosses a section boundary renders the section header inline. `per-page="0"` keeps
  the classic one-section-per-step flow.
- **Choice layouts:** `layout: 'list' | 'grid' | 'inline' | 'pills'` (+ `columns` for
  grids). Pills are for short option sets (1–5), grids for image options or 6+.
- **Matrix** covers ratings tables; **ranking** covers priority ordering.
- Styling is the kit's: to reskin, override `--k-*` tokens (see the kit README) — no
  component edits. A different *structure* means composing the sub-components
  yourself: `KAssessmentQuestion` + your own pager, or `KAssessmentInput` +
  `KAssessmentOption` anywhere.

**Audio answers need no wiring** — an `upload` question with `accept: 'audio/*'`
renders `KVoiceRecorder` and hands you the recording as a `File` (so file rules and
`File`-vs-string logic keep working). Same for `image/*` and the image picker. Forced
choice: `input.widget = 'file' | 'image' | 'record'`.

**Custom widgets without new kinds** — when the built-in widget isn't what you want,
`KAssessmentInput` exposes a slot named after the input kind, forwarded through
`KAssessmentQuestion` and `KAssessmentWizard`:

```vue
<KAssessmentWizard :assessment="a" v-model="answers">
  <template #input-upload="{ update }">
    <KVideoRecorder @record="update($event)" />   <!-- e.g. video answer -->
  </template>
</KAssessmentWizard>
```

**The stepper is read-only** — the wizard passes `:clickable="false"` to `KStepper`,
so an attempt always moves one step at a time (Next/Prev, with validation). The
stepper reports progress; it is not a navigation control.

---

## 7. Submitting, and what you get back

```ts
onSubmit({ answers, list, result }) {
  answers  // { [questionId]: value }            — only visible, answered questions
  list     // [{ questionId, sectionId, value }] — ordered, stable, provider-agnostic
  result   // { score, maxScore, percent, passed, answered, total, sections[] }
}
```

Persist `list` (JSON) — it is enough to rebuild the attempt later. When providers need
their own shape back (a CSV row, a specific API body), write the **reverse** mapper in
the same file as the forward one.

---

## 8. Writing a mapper (the only provider-specific code)

A mapper is a pure function: provider payload → `Assessment`. Keep them dumb.

```ts
// data/assessmentProviders.ts
import type { Assessment } from '../types/assessment'

export function fromMyProvider(raw: MyApiPayload): Assessment {
  return {
    info: { id: raw.exam_id, title: raw.exam_name, durationMinutes: raw.minutes, passScore: raw.pass_mark },
    sections: raw.parts.map(part => ({
      id: String(part.id),
      title: part.name,
      questions: part.items.map(item => ({
        id: String(item.id),
        number: item.order,
        title: item.label,
        contents: item.image ? [{ kind: 'image', src: item.image }] : [],
        input: item.type === 'single'
          ? { kind: 'choice', options: item.answers.map(a => ({ id: a.key, label: a.text, score: a.marks })) }
          : item.type === 'multi'
            ? { kind: 'choice', multiple: true, layout: 'grid', options: item.answers.map(a => ({ id: a.key, label: a.text })) }
            : { kind: 'text' },
        validation: item.mandatory ? [{ kind: 'required' }] : [],
        condition: item.show_if ? { questionId: String(item.show_if.id), operator: 'equals', value: item.show_if.value } : undefined,
      })),
    })),
  }
}
```

Two worked examples ship in `data/assessmentProviders.ts`:
`fromGenericProvider` (normalized JSON) and `fromFormsProvider`
(Google-Forms-style `RADIO` / `CHECKBOX` / `GRID` / `SCALE` / `FILE_UP` items).

Checklist for a new provider:

1. Map its section/question nesting to `sections[].questions[]`.
2. Map its types to the 11 `kind`s above; when in doubt use `choice` or `text`.
3. Map its option media (`image` / `audio` / `video`) → `kind` + `media`.
4. Translate its conditions to `condition` / `logic` and its marks to `scoring`.
5. Keep the provider's own ids as `questionId` — that is what you POST back.

---

## 9. SSR / Nuxt

The whole module is SSR-safe: no `window`/`document` at module or setup scope, no
`<ClientOnly>` needed (not even for `date`/`time`). Persist answers yourself
(`useState`/`useCookie`) if the attempt must survive a reload; the component never
touches storage.

---

## 10. Working examples

`k-kit-project/src/pages/showcase/` — sidebar group **examples**:

| Page | Shows |
|---|---|
| `ExampleAssessment1` | general exam, 20 questions / 10 per page, live url-email-mobile validation, error scroll |
| `ExampleAssessment2` | 10 questions / 1 per page: image prompts, image-option grids, video options, image picker |
| `ExampleAssessment3` | 20 questions / 5 per page: matrix tables, Likert scales, ranking, pills + grid multi-choice |
| `ExampleAssessment4` | 10 questions / 3 per page: audio/video options and **spoken answers** (auto recorder) |
| `ExampleAssessment5` | 30 questions / 10 per page, select/multiselect (60 countries), no stepper, result bands |

The showcase is a plain Vite app and is **not** part of the kit — delete it when you
copy `ui-kit/` into a project.
