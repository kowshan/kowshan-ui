# K UI Kit

A serious, ready-to-use Vue 3 + TypeScript component kit for Persian (RTL) products —
CRMs, real-estate platforms, admin panels, dashboards. Everything is `K`-prefixed,
dependency-free (except `lucide-vue-next` for icons), and self-contained: **copy the
folder into any project and import two CSS files**.

> ⚠️ This README is a living document — it will be expanded as the kit grows.
> Component APIs are documented in the code with JSDoc comments.

---

## Table of contents

- [Quick start](#quick-start)
- [SSR & Nuxt](#ssr--nuxt)
- [Raw HTML & sanitizing](#raw-html--sanitizing)
- [Folder structure](#folder-structure)
- [Theming](#theming)
- [Components](#components)
- [Stores & global state](#stores--global-state)
- [Composables](#composables)
- [Assessment module](#assessment-module)
- [Calendar](#calendar)
- [Core vs wrappers](#core-vs-wrappers)
- [Dependencies](#dependencies)
- [Showcase app](#showcase-app)

---

## Quick start

1. **Copy** the whole `ui-kit/` folder into your project (e.g. `components/ui-kit`).
2. **Import the styles** once, in your app entry (or Nuxt `nuxt.config` CSS array):

   ```ts
   import '…/ui-kit/assets/ui-kit.css'     // always required — theme vars + base styles
   import '…/ui-kit/assets/calendar.css'   // only if you use the calendar / date pickers
   ```

3. **Wrap your app** in a root with the `k-ui` class and mount the two global
   layers **once**. That's the whole wiring — everything else is opt-in.

   ```vue
   <!-- app.vue (Nuxt) or App.vue (Vite) -->
   <template>
     <div class="k-ui" :data-theme="theme">
       <KTeleportHub />   <!-- 1. teleport target — must exist before any dropdown mounts -->
       <KGlobalLayer />   <!-- 2. toasts + promise-confirm dialog -->
       <NuxtLayout><NuxtPage /></NuxtLayout>
     </div>
   </template>

   <script setup lang="ts">
   import KTeleportHub from '~/components/ui-kit/components/KTeleportHub.vue'
   import KGlobalLayer from '~/components/ui-kit/components/KGlobalLayer.vue'

   // the theme is YOURS — the kit never touches storage (see Theming)
   const theme = useCookie<'light' | 'dark' | 'oled'>('k-theme', { default: () => 'light' })
   </script>
   ```

   | Layer | Count | Why |
   |---|---|---|
   | `KTeleportHub` | once, inside `.k-ui`, **before** anything that can open a popup | it is the `<Teleport to="#k-teleport-hub">` target for dropdowns / context menus / notification panels that must escape an `overflow: hidden` ancestor. If it isn't mounted yet, Vue warns *“Failed to locate Teleport target with selector #k-teleport-hub”* and the popup breaks. |
   | `KGlobalLayer` | once, same root | hosts `KToastHost` (toast stack) and `KConfirmDialog` (`await useModalStore().confirm()`). Both render in place with `position: fixed` — **never** wrap them in `Teleport` or a lazily-mounted component, that race is exactly what breaks toasts. |

   Overlays need **no layout entry**: `KModal` / `KDrawer` / `KBottomSheet` teleport themselves when opened and are driven by id (`useModalStore().openModal('edit-user')`).

4. **Import components** explicitly (works everywhere — Nuxt, Vite, any bundler):

   ```vue
   <script setup lang="ts">
   import KButton from './ui-kit/components/KButton.vue'
   import KTextInput from './ui-kit/wrappers/KTextInput.vue'
   </script>
   ```

   In Nuxt you can also enable bare auto-import for the `K*` names:

   ```ts
   // nuxt.config.ts
   components: [
     { path: '~/components/ui-kit', pathPrefix: false }, // <KButton>, <KModal>, …
     { path: '~/components', pathPrefix: true },
   ],
   ```

5. That's it — install `lucide-vue-next` and go.

---

## SSR & Nuxt

Nothing in the kit touches `window`/`document` at module or setup scope, so the
kit itself is import-safe on the server. You only need `<ClientOnly>` for
components whose *behaviour* depends on a browser API, because those APIs don't
exist during SSR:

| Needs `<ClientOnly>` | Why |
|---|---|
| `KMap` | map SDK probes the DOM on mount |
| `KSignaturePad` | `<canvas>` + pointer events |
| `KVoiceRecorder` | `getUserMedia` + Web Audio |
| `KScreenRecorder` | `getDisplayMedia` + `MediaRecorder` |
| `KCameraCapture` | `getUserMedia` + `<video>` |
| `KAudioPlayer` / `KAudioWaveform` | HTMLMediaElement + Web Audio analyser |

```vue
<ClientOnly>
  <KSignaturePad v-model="signature" />
  <template #fallback><KSkeleton variant="card" /></template>
</ClientOnly>
```

Everything else (`KCalendar`, `KDataTable`, `KChart`, `KQrCode`, modals, toasts,
selects, date pickers …) renders fine on the server — no wrapper needed. Two
more Nuxt notes:

- **Fonts:** the kit uses `font-family: inherit` everywhere but the teleport hub;
  set `--k-font-family` (or a global `*{}` rule) in your Nuxt app so teleported
  popups match your body font.
- **Auto-imports:** bare `K*` names are safe (see step 4), but if you enable the
  kit's composables for auto-import, keep the `K`-infixed names — they exist
  precisely to avoid colliding with Nuxt/Vue/VueUse built-ins.

---

## Raw HTML & sanitizing

Some components accept HTML and render it with `v-html`. The kit follows three
rules, in this order of preference:

1. **Don't build HTML at all** — interpolate the string. `{{ value }}` escapes
   everything and can never execute.
2. **If you build it yourself, escape the source first** — so the only tags that
   can exist in the output are the ones the component wrote. `KMarkdownRenderer`
   works this way: markdown is a text format, so its input is escaped before the
   transformations run. `[x](javascript:…)` becomes `href="#"` via `safeUrl()`.
3. **If you must render HTML from elsewhere, sanitize it** — `sanitizeHtml()`
   (`utils/html.ts`, DOMPurify under the hood) is what every HTML-accepting
   component uses internally.

### Which components render HTML, and what they do

| Component | Prop | Behaviour |
|---|---|---|
| `KMarkdownRenderer` | `content` | Escapes its input first — raw HTML in markdown is inert. No sanitizer needed. |
| `KCommentThread` | `comment.content` | **Plain text by default.** Set `allow-html` to render rich content; it is sanitized before it reaches the DOM. |
| `KAssessmentContent` | `block.html` | Sanitized (rich provider content). |
| `KCommandLine` | `Line.html` | Sanitized; `Line.text` is always interpolated. |
| `KDataTableExport` | — | Sanitizes the table markup before writing it into the print window. |

### The SSR rule (`useKHydrated`)

DOMPurify needs a real DOM, and **without one it returns its input unchanged** —
emitting that on the server would ship a payload as markup. So `sanitizeHtml()`
**fails closed**: with no DOM it escapes instead. Components that render foreign
HTML therefore gate on `useKHydrated()` and show the plain-text fallback until
the client takes over, which also keeps the server's markup and the client's
first render identical (a hydration gate, same as `useBreakpoint`).

### The contract for you

Anything you pass as HTML is sanitized by the kit, but sanitizing is not
approval: **if the content is not yours, sanitize it at the boundary** (where it
enters your app) as well. Any DOMPurify config that fits your product — allowing
`iframe`, say — belongs in your app, not in the kit.

```ts
import DOMPurify from 'dompurify'
const safe = DOMPurify.sanitize(comment.content, { USE_PROFILES: { html: true } })
```

---

## Folder structure

```
ui-kit/
├── assets/
│   ├── ui-kit.css        # theme variables (light/dark/oled) + base + shared styles
│   └── calendar.css      # calendar/datetime styles
├── components/           # standalone presentational components (K*)
├── wrappers/             # input-style wrappers built on a shared core (K*)
├── core/                 # internal primitive inputs (CoreInput, CoreSelect, …)
├── calendar/             # the Jalali calendar module (KCalendar + views + engine)
├── composables/          # framework-agnostic logic (useKToast, useDataTable, …)
├── stores/               # reactive singletons (toast, modal)
├── data/                 # validation rule sets (regex + function validators)
└── types/                # shared types + shims
```

The **components/** vs **wrappers/** split is intentional: wrappers are thin
presentation layers over a shared **core/** (which holds the logic, accessibility,
and theming). To build a new look for an input, create a new wrapper — the core
stays untouched.

---

## Theming

Everything is driven by CSS custom properties under `.k-ui`, plus one attribute:
`data-theme` on the same element (`light` | `dark` | `oled`). Dark uses neutral
zinc grays (no blue undertone); `oled` is the pure-black variant.

### Three themes, one attribute

```vue
<div class="k-ui" :data-theme="theme">      <!-- 'light' | 'dark' | 'oled' -->
  <NuxtLayout><NuxtPage /></NuxtLayout>
</div>
```

```ts
// the kit does NOT persist the theme — the host owns it (works with SSR)
const theme = useCookie<'light' | 'dark' | 'oled'>('k-theme', { default: () => 'light' })
const toggle = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark')
```

Every component reads its colors from the current theme — including teleported
ones (modals, toasts, lightbox, stories, dropdown panels): they carry `k-ui`
+ `data-theme` on their detached root via `useKitTheme()`, so they can't drift
out of sync.

### Matching your host site's theme

The kit is a *skin*: copy your design tokens into `--k-*` on your root and the
whole kit follows — no component edits, no build step.

```css
/* app/assets/main.css — runs after the kit's ui-kit.css */
.k-ui,
.k-ui[data-theme='light'],
.k-ui[data-theme='dark'],
.k-ui[data-theme='oled'] {
  --k-primary: #1DB954;                       /* brand accent */
  --k-primary-hover: #17a34a;
  --k-primary-light: color-mix(in srgb, #1DB954 14%, transparent);
  --k-radius-sm: 8px;                         /* shape language */
  --k-radius-md: 14px;
  --k-font-family: 'yekan-bakh', sans-serif;
}
```

If your site already has theme classes/attributes, you have two clean options:

1. **Keep both on one element** — `<div class="k-ui my-theme-dark" :data-theme="theme">`
   and let your own tokens win (the kit only uses `--k-*` names).
2. **Mirror the attribute** — if your host toggles `<html data-theme>`, the kit
   picks it up automatically: `useKitTheme()` reads `.k-ui[data-theme]` first and
   falls back to `document.documentElement`.

Add a fourth theme (e.g. a seasonal one) by shipping one more block:
`.k-ui[data-theme='nowruz'] { …same tokens… }` — nothing else to register.

### Core tokens

```css
.k-ui,
.k-ui[data-theme='light'],
.k-ui[data-theme='dark'],
.k-ui[data-theme='oled'] {
  --k-primary: #1DB954;                       /* brand accent (Spotify green) */
  --k-primary-hover: #17a34a;
  --k-primary-light: color-mix(in srgb, #1DB954 14%, transparent);
}
```

| Token | Purpose |
|---|---|
| `--k-primary`, `--k-primary-hover`, `--k-primary-light` | brand accent + tints |
| `--k-bg`, `--k-surface`, `--k-surface-hover` | backgrounds |
| `--k-text-primary`, `--k-text-secondary`, `--k-text-muted`, `--k-placeholder` | text |
| `--k-border`, `--k-border-focus` | borders / focus rings |
| `--k-success`, `--k-warning`, `--k-error`, `--k-info` (+ `-light`) | status colors |
| `--k-radius-sm`, `--k-radius-md`, `--k-shadow-md` | shape & elevation |

> **Teleported layers** (modals, toasts, lightbox, stories) render inside
> `KTeleportHub` / `<body>` and escape the component tree, so they re-apply the
> theme themselves. Two rules follow: (a) keep `KTeleportHub` **inside** `.k-ui`
> so the popup still sees your token overrides, and (b) **do not** put
> page-level rules (backgrounds, `min-height`) on a bare `.k-ui` selector —
> scope them to your own app root class instead.

The optional **yekan-bakh** font can be bundled from the Nuxt app's
`app/assets/fonts/yekan-bakh` and set via `--k-font-family`.

---

## Components

### Actions
| Component | Notes |
|---|---|
| `KButton` | variants, sizes, icons, loading, full-width |
| `KIconButton` | icon-only button with tooltip + color props |

### Forms & inputs (wrappers → core)
| Component | Notes |
|---|---|
| `KTextInput` | label, hint, error, clearable, icons, password toggle |
| `KTextarea` | rows, char counter |
| `KSelect` | searchable, clearable, grouped, async options |
| `KMultiSelect` | multi-value select |
| `KDatePicker` | Jalali date field — `picker="modal"` (default) is a plain clickable field that opens the wheel picker; `picker="segmented"` is the classic `yyyy / mm / dd` part input (parts stretch to fill the field) |
| `KRadioGroup` | 3 variants: default / segmented / cards, vertical & horizontal |
| `KCheckbox` | indeterminate support |
| `KToggle` | switch, sizes, on/off labels |
| `KSlider` | single + range, bounds labels |
| `KNumberInput` | stepper, min/max/step, Persian digits |
| `KCurrency` | currency field with formatting + min/max validation |
| `KPasswordInput` | visibility toggle, strength rules |
| `KFileInput`, `KImageUpload` | file / image pickers |
| `KCaptcha` | wrapper — you supply `src` image (+ optional `audioSrc`), it owns `v-model`, refresh (emits `refresh`), voice button, and an optional countdown (`expires-in`, emits `expired`) |

> **Persian input by default — no opt-out props.** This is a Persian kit, so normalization is built in: every text input (`KTextInput`, `KTextarea`, `KNumberInput`, `KSelect` search, `KDatePicker` parts) converts typed Persian/Arabic digits (`۰۹١٢` → `0912`) and Arabic variant characters (`ك` → `ک`, `ي` → `ی`) to clean Latin/Persian on the fly, so the stored model is always DB-ready. Passwords are the only exception (never touched). The old `persian` boolean prop was removed — it was redundant. `KDatePicker` likewise no longer takes a `format` prop (Jalali `yyyy/mm/dd` is the only date format) and its default `output-format` is `gregorian` (display is always Jalali; what the DB gets is Gregorian/ISO).

### Data display
| Component | Notes |
|---|---|
| `KDataTable` | sorting (client-side), column visibility, row click, slots per column, empty/loading states — pairs with `KPagination` + `useDataTable` |
| `KPagination` | Persian digits, ellipsis window, page-size |
| `KBadge` | variants, outline, dot, sizes |
| `KAvatar` / `KAvatarGroup` | image → initials fallback, status dot, stacked group with `+N` |
| `KRating` | hover preview, half-stars, readonly |
| `KProgress` | variants, striped/animated, indeterminate |
| `KProgressRing` | SVG circular progress — 0–100 or 0–1 (`max=1`), any size |
| `KSkeleton` | line/card/avatar/table presets |
| `KEmptyState` | empty-state block |
| `KTimeline` | activity feed |
| `KTreeView` / `KTreeNode` | recursive org/category tree, expand/collapse, badges, selection |

### Feedback & overlays
| Component | Notes |
|---|---|
| `KToast` (via `KToastHost` + `useKToast`) | see [Stores & global state](#stores--global-state) |
| `KModal` | store-driven by `id` (recommended) **or** legacy `v-model:visible`; 4 sizes, ESC closes only the top modal |
| `KAlert` | info/success/warning/danger, closable, actions slot, theme-adaptive text |
| `KTooltip` | 4 positions, hover/click triggers |
| `KLightbox` | media lightbox |
| `KConfirmDialog` | **promise-based confirm** — `await useModalStore().confirm({…})` → boolean; mounted once inside `KGlobalLayer`, focus-trapped |
| `KResultPage` | status page — success / error / warning / info / 404 / empty with icon circle + actions slot |
| `KNotificationBell` | bell with unread badge + dropdown panel — items with type dots, click-to-read, read-all |
| `KSpinner` | standalone loader — 5 sizes, optional label, absolute overlay / fullscreen modes |
| `KContextMenu` | right-click menu — trigger slot, icons, danger items, dividers, disabled, viewport clamping |

### Navigation
| Component | Notes |
|---|---|
| `KTabs` | underline / pills / boxed |
| `KBreadcrumb` | clickable trail, icons |
| `KDropdownMenu` | items, dividers, shortcuts, danger, align/dir |
| `KAccordion` | multiple-open, animated |
| `KStepper` | step wizard |
| `KCommandPalette` | ⌘K palette — groups, icons, shortcuts, keyboard nav, global `Ctrl+K` |
| `KSidebar` | collapsible app sidebar — grouped items, badges, brand + footer slots, collapses to icon-only |
| `KAppBar` | app top bar — title, search slot, action buttons with badges, avatar slot, sticky/glass variants |
| `KBottomNav` | mobile bottom tab bar — icons, labels, badges/dots, active state, floating variant |

### Overlays (modal / drawer / sheet)
| Component | Notes |
|---|---|
| `KModal` | centered dialog — store-driven by `id` or `v-model:visible`, 4 sizes, ESC closes only the top-most |
| `KDrawer` | side slide-over — `openDrawer(id)`, RTL/LTR sides, ESC/overlay close |
| `KBottomSheet` | mobile sheet from the bottom — **drag handle with snap heights** (40/70/92%), drag-down to step or dismiss, `openSheet(id)`, ESC/overlay close |

### PWA
| Component | Notes |
|---|---|
| `KOfflineBanner` | top banner while offline (driven by `useNetworkStatus`), `show` override for demos |
| `KInstallPrompt` | install banner — appears on `beforeinstallprompt`, native install via `usePwaInstall`, `show` override |
| `KUpdatePrompt` | new-version banner — surfaces a waiting service worker, apply = SKIP_WAITING + reload, `show` override |

### Courses & deals
| Component | Notes |
|---|---|
| `KCourseCard` | course card — thumbnail with category / discount / duration badges, instructor, rating, lessons & hours, price + strikethrough old price, enroll button, optional completion progress |
| `KCountdownTimer` | deal/webinar countdown — Persian digits + labels, optional days column, fires `end` once, `ended-text` state |
| `KCouponInput` | coupon box — validates against a list (`percent` or fixed `amount`) or a custom `validate` fn, applied state with saving, error + remove |
| `KLessonList` | course curriculum — sections, video/quiz/doc icons, duration, done/locked/current states, progress header, emits `select` (locked lessons don't emit) |
| `KCartItem` | cart row — thumbnail, title + meta, unit price (with strikethrough), qty stepper, line total, remove |
| `KOrderSummary` | checkout totals — subtotal / coupon discount / shipping (with **free-above-threshold** hint) / final total, `#coupon` slot, checkout action |

### Iran essentials
| Component | Notes |
|---|---|
| `KNationalIdInput` | کد ملی — 10 digits, live **checksum** validation, Persian/Arabic digit normalization |
| `KBankCardInput` | شماره کارت — auto-grouped 4-4-4-4, **Luhn** validation + **bank detection** from the BIN (20+ Iranian banks, colored chip) |
| `KShibaInput` | شماره شبا — auto `IR` prefix, grouped, **ISO 7064 mod-97** validation + bank detection from the prefix |
| `KPostalCodeInput` | کد پستی — 10-digit format + district sanity check |
| `KProvinceCitySelect` | cascading استان → شهر — all 31 provinces with city subsets (`data/iranProvinces.ts`), city resets when the province changes |

> All four inputs share one visual style (`components/iran-input.css`) and emit `validate` results. The validators are also exported standalone via `useIranianValidators` (pure functions — `isValidNationalId`, `validateCard`, `isValidShiba`, `isValidPostalCode`, `bankFromCard`, `bankFromShiba`).

### Beautiful cards
| Component | Notes |
|---|---|
| `KCard` | upgraded base card — **`gradient` / `glass` / `glow` variants**, cover slot, softer hover lift |
| `KPricingCard` | pricing plan — icon head, price + old price, highlighted features with sparkles, «پیشنهاد ویژه» ribbon, CTA |
| `KProfileCard` | profile/team card — cover photo, overlapping avatar, status dot, stats row, tags, action buttons |
| `KTestimonialCard` | review card — quote mark, star rating, avatar + name/role, `accent` gradient variant |
| `KSpotlightCard` | card with a **mouse-follow spotlight** — radial beam + glowing border track the cursor |
| `KFeatureCard` | feature tile — gradient icon box, title/description, optional footer link, click emit |

### Verification & identity
| Component | Notes |
|---|---|
| `KOTPInput` | verification code input — N boxes (default 6), **auto-advance + Backspace to previous**, paste a full code (Persian/Arabic digits normalized), `idle/loading/success/error` states, emits `complete` once |
| `KVerifyBadge` | status chip — `verified` / `pending` / `unverified` / `rejected` with icons + auto Persian labels |
| `KVerificationCard` | KYC identity panel — steps with done/current states, auto progress bar (or `progress` override), status banner per state, `#actions` slot |
| `useResendTimer` | composable — countdown for «ارسال مجدد» buttons: `remaining`/`persian`/`canResend`, `start()`/`reset()`, auto-clears on unmount |

### Advanced
| Component | Notes |
|---|---|
| `KAutocomplete` | combobox — type-ahead filter, keyboard nav (↑/↓/Enter), paste-free Persian normalization, debounced `search` event |
| `KColorPicker` | color picker — preset palette, native input, hex field (Persian-digit aware) |
| `KPhoneInput` | Iranian mobile input — `+98` prefix, auto-format + strip `+98`/`0098`, live valid state (pairs with `useIranianValidators`) |
| `KSearchInput` | debounced search field — clear button, loading spinner, `search` event |
| `KForm` | rules-driven form wrapper — validates a model against `Record<field, ValidationRules>` on submit, Laravel-style error summary, `#actions` slot, `validate()`/`reset()` exposed |
| `KOrgChart` | organizational tree — recursive collapsible nodes, avatar/role/badge, select event |
| `KImportWizard` | CSV import wizard — paste/upload → preview → **column mapping** → result with imported/skipped counts, quoted-cell parser, `initial-text` prop |
| `KSplitPane` | resizable two-pane split — horizontal/vertical, `v-model:size`, drag gutter |
| `KJsonViewer` | collapsible JSON tree — types colored, expand-depth control |
| `KCopyButton` | copy-to-clipboard with check feedback (uses `useKClipboard`) |

### Permissions & helpers
| Component | Notes |
|---|---|
| `KPermissionTree` | group → sub-permission checkbox tree — recursive, **indeterminate-aware** (clicking an indeterminate group checks everything), per-node `hint` tooltips, disabled leaves, live selected-count chip, optional select-all row |

### Dashboard & CRM
| Component | Notes |
|---|---|
| `KStatCard` | icon tile, big value, trend badge, loading skeleton |
| `KChart` | dependency-free SVG charts: line / area / bar / donut |
| `KCard` | header/body/footer slots, variants, centered footer actions |
| `KContactCard` | lead card — avatar, tags, call/mail/more, selectable |
| `KKanban` | drag-and-drop pipeline, `v-model` columns, move events |
| `KFilterBar` | search + toggle chips + reset |
| `KAvailabilityGrid` | Jalali reservation grid (free/reserved/half/blocked) |
| `KAssessment` | one component, 3 modes: boolean / single / multi |
| `KStories` | Instagram-style stories viewer |
| `KSignaturePad` | canvas e-signature — colors, undo, clear, PNG via `v-model` |
| `KFileUpload` | drag & drop zone, file list, progress, validation |
| `KInlineEdit` | click-to-edit value — text / number / select, Enter saves, ESC cancels, Persian normalization on text |
| `KMagicFill` | **magic wand** — paste free-form Persian text, it extracts phone/email/city/budget/intent/source with confidence badges, all editable before emitting the payload (`v-model`) |
| `KActivityHeatmap` | GitHub-style 12-month activity heatmap with Jalali month labels, 5 intensity levels, theme-aware colors |
| `KDrawer` | side slide-over panel — store-driven (`modalStore.openDrawer(id)`) or `v-model:visible`, ESC/overlay close, teleported + theme-aware |

### Media & map
| Component | Notes |
|---|---|
| `KMediaGallery` | thumbnail grid opening `KLightbox` |
| `KMap` | Google Maps embed wrapper |
| `KQrCode` | **dependency-free QR** — the kit's own byte-mode encoder (EC level L, v1–6, ~130 chars), rendered as SVG; `fg`/`bg`/`quiet-zone`, `error` event when too long |
| `KVideoPlayer` | self-contained HTML5 video — poster, big play, seek + keyboard, volume, fullscreen, auto-hiding controls |
| `KAudioPlayer` | audio player — seek, volume, **playlist** with auto-advance, track events |
| `KSparkline` | mini SVG trend line — fill gradient, dot, custom color |
| `KSwiper` | dependency-free carousel — native scroll + snap (so touch/keyboard work for free), `per-page` number **or** `'auto'`, `breakpoints`, `direction="vertical"` + `height`, autoplay, `loop`, dots, `#controls` slot |
| `KSwiperButton` | prev/next control for `KSwiper` — self-wires inside the swiper, follows the axis (chevrons flip in RTL, point up/down when vertical), auto-disables at the ends |
| `KAssessmentWizard` | provider-agnostic assessment player — info → instructions → sections → result, per-section validation, scoring, countdown, result screen |
| `KAssessmentContent` / `KAssessmentInput` / `KAssessmentOption` / `KAssessmentQuestion` / `KAssessmentResult` | the assessment building blocks (see [Assessment module](#assessment-module)) |
| `KGauge` | radial dial gauge — 270° arc, auto thresholds (danger/warning), label |
| `KVirtualList` | **windowed rendering** for long lists — fixed row height, buffer, only visible rows in the DOM |

### Date & time
| Component | Notes |
|---|---|
| `KDatePickerModal` | **Telegram-style wheel picker** — Jalali display, output as `jalali` / `gregorian` / `iso` |
| `KTimePickerModal` | wheel time picker, optional seconds |
| `KWheelPicker` | the generic 3-column wheel (drag, click zones, live highlight) |

### Reservation
| Component | Notes |
|---|---|
| `KDateRange` | check-in / check-out pair with a nights chip in the middle — two clickable fields, each opening the wheel picker; display always Jalali, value emitted per `output-format` |
| `KGuestPicker` | adults / children / rooms steppers in a popover, Persian summary, min/max per section via `config` |
| `KAvailabilityGrid` | Jalali reservation grid — month navigation, free/booked/partial/blocked states, selectable days; logic lives in `useAvailabilityGrid` so reservation pages can drive it without the component |

---

## Stores & global state

Two reactive singletons (no Pinia required — plain Vue reactivity, works in any app).

### `useToastStore` — toasts

```ts
import { useKToast } from '…/ui-kit/composables/useKToast'
// or the store directly: useToastStore from '…/ui-kit/stores/toastStore'

useKToast.success('Saved')
useKToast.error({ title: 'Invalid form', message: ['Phone is invalid', 'Postal code is required'] })
useKToast.warning({ message: 'Document expiring', timeout: 0, buttons: [{ label: 'Renew', onClick: renew }] })

// Laravel validation summary:
useKToast.showErrors({ phone: ['invalid'], postal: ['required'] }, 'Form is invalid')
```

Toast options: `type`, `message` (string **or array** → multi-message list), `title`,
`description`, `duration`/`timeout` (0 = sticky), `closable`, `buttons` (with
callbacks; clicking dismisses), `icon`, `position` (per-toast corner).

The store API mirrors a Pinia toast store for easy migration:
`showToast` / `addToast` / `removeToast` / `clearToasts` / `hasToasts`.

### `useModalStore` — id-driven modals **and drawers**

```ts
import { useModalStore } from '…/ui-kit/stores/modalStore'
const modal = useModalStore()

modal.openModal('confirm-delete')   // open anywhere, by id
modal.openDrawer('lead-detail')     // side drawer, same pattern
```

```vue
<!-- co-located with your page/layout — no local visible state -->
<KModal id="confirm-delete" title="Delete property?" size="sm">
  …
</KModal>

<KDrawer id="lead-detail" title="جزئیات سرنخ" size="md">
  …
  <template #footer>…</template>
</KDrawer>
```

API: `openModal(id)` / `closeModal(id)` / `toggleModal(id)` / `closeAll()` /
`isOpen(id)` / `topModal()` — plus the drawer equivalents
(`openDrawer` / `closeDrawer` / `toggleDrawer` / `closeAllDrawers` /
`isDrawerOpen` / `topDrawer`) and bottom-sheet equivalents (`openSheet` /
`closeSheet` / `toggleSheet` / `closeAllSheets` / `isSheetOpen` /
`topSheet`). ESC closes only the top-most overlay of its kind.

**Promise-based confirm** — no component code needed:

```ts
const ok = await useModalStore().confirm({
    title: 'حذف سند', message: 'این عمل قابل بازگشت نیست.',
    confirmText: 'حذف', variant: 'danger'   // danger | primary | warning
})
if (ok) deleteRecord(id)
```

Mount `<KConfirmDialog />` once (it is already inside `KGlobalLayer`) and
`confirm()` resolves `true`/`false` from any promise chain.

### `KGlobalLayer`

Mount **once** in your layout — it hosts the toast stack **and the promise
confirm dialog** (`KConfirmDialog`), so both work with zero extra wiring:

```vue
<KGlobalLayer position="bottom-left" />   <!-- bottom-left | bottom-right | top-left | top-right -->
```

Toasts autoclose via a real timeout (timer bar is visual), animate in/out, and
stack by position. Toasts placed at `top`/`bottom` resolve to top-right/bottom-left.

---

## Composables

> **Naming rule:** a kit composable must never shadow a Nuxt/Vue/VueUse
> auto-import — Nuxt logs "Duplicated imports" and can silently resolve the
> wrong symbol. Names that would collide carry a `K` infix (`useKitId`,
> `useKToast`, `useKDebounce`, `useKClipboard`, `useKLocalStorage`,
> `useKFocusTrap`, `useKInfiniteScroll`, `useKContextMenu`).
>
> All composables are SSR-safe: no module/setup-scope `window`/`document`.
> Theme persistence is intentionally *not* included — the host app owns it
> (guard `localStorage`, or use `useCookie`/`useState` in Nuxt).

| Composables | Purpose |
|---|---|
| `useKToast` | toast helpers (see above) |
| `useToastStore`, `useModalStore` | global stores (see above) |
| `useKitTheme` | tracks the active theme for teleported components |
| `useDataTable` | table logic — sorting (numeric + Persian collation), column visibility, pagination |
| `useJalaliDate` | parse / format / convert Jalali ↔ Gregorian (`jalali`, `gregorian`, `iso` output), diff in days, Persian display — the single source for date logic |
| `useDateRange` | check-in / check-out state, nights count, min/max-nights validation, overlap check against booked days, `output-format` conversion |
| `useGuestPicker` | guest/room counters with per-section min/max, summary string, reactive `value` snapshot for `v-model` |
| `useAvailabilityGrid` | Jalali month math + per-day statuses + selection for reservation grids |
| `useMagicFill` | free-text → structured fields with confidence (heuristic extractors, zero deps) |
| `useCart` | singleton cart store — add/remove/qty, per-item line totals, coupon rules (`percent` / `amount`) or custom validator, free-shipping threshold, subtotal/discount/shipping/total computeds; pairs with `KCartItem` + `KOrderSummary` + `KCouponInput` |
| `useNetworkStatus` | reactive `isOnline` — powers `KOfflineBanner` |
| `usePwaInstall` | `beforeinstallprompt` capture — `canInstall`, `install()` |
| `usePwaUpdate` | service-worker update watch — `updateAvailable`, `applyUpdate()` (SKIP_WAITING + reload) |
| `useClickOutside` | outside-click detection for dropdowns/popovers |
| `useKFocusTrap` | keep Tab focus inside a modal — used by `KConfirmDialog` |
| `useKClipboard` | copy text + 2s `copied` state, legacy fallback — powers `KCopyButton` |
| `useCountUp` | animate a number (`start(target)`, easings) |
| `useKInfiniteScroll` | load-more when a sentinel enters the viewport (IntersectionObserver) |
| `useBreakpoint` | reactive `isMobile` / `isDesktop` / `is('md')` via matchMedia |
| `useKLocalStorage` | reactive state persisted to localStorage + cross-tab sync |
| `useKDebounce`, `useKitId` | small utilities (`useKitId` was named `useId` — renamed to dodge Nuxt's built-in) |
| `useValidation`, `useAsyncValidation`, `useInputLogic` | input validation + wiring for the core inputs |
| `useFormatting`, `usePersianNumbers`, `useFileHelper`, `useFileValidation` | formatting / file helpers |
| `useAnimation` | optional gsap-driven animations (falls back to CSS) |
| `useAccessibility` | keyboard/aria helpers |
| `useSeo` | title / description / keywords / canonical / Open Graph / **JSON-LD** — routes through Nuxt `useHead` when available, plain-DOM fallback otherwise; accepts reactive options |
| `useStorageEncryption` | **AES-GCM encrypted localStorage** — PBKDF2 key derivation (100k iterations, random salt), fresh IV per write, hashed keys, `setItem`/`getItem`/`removeItem`/`clear` |
| `useBrowserDb` | promise-based **IndexedDB wrapper** — form drafts, offline queue, caches: `set`/`get`/`remove`/`all`/`count`/`keys`, structured-clone values |
| `useUrlCipher` | **HMAC-signed reversible ID hash** for URLs (password-reset links, share tokens) — `hash(id, { ttl })` → URL-safe token, `unhash` returns the id or `null` on tamper/expiry |

> **No networking here on purpose.** The kit ships no API/fetch layer — every host
> project has its own (auth headers, CSRF, caching, error toasts), so the kit would
> either duplicate it or fight it. Components are presentation + local state only;
> you feed them data and handle the requests.

---

## Assessment module

A full assessment player — exams, surveys, psychometrics — built on a **neutral
schema** (`types/assessment.ts`), so it works with *any* provider: you write one
small mapper per backend and the components never change.

```
ASSESSMENT        KAssessmentWizard   Info → Instructions → Sections → Result
├── CONTENT       KAssessmentContent  text · image · audio · video · file · link
├── INPUT         KAssessmentInput    text · number · choice · scale · matrix · ranking · upload · date · time
├── OPTIONS       KAssessmentOption   text · image · audio · video
├── LOGIC         Condition / LogicRule / ScoreRule  → evaluated by useAssessment
└── VALIDATION    Required / Range / Length / File   → evaluated by useAssessment
```

```vue
<script setup lang="ts">
import KAssessmentWizard from '~/components/ui-kit/components/KAssessmentWizard.vue'
import { fromGenericProvider } from '~/components/ui-kit/data/assessmentProviders'

const assessment = fromGenericProvider(providerPayload)   // ← your mapper
const answers = ref({})
</script>

<template>
  <KAssessmentWizard :assessment="assessment" v-model="answers"
                     @submit="({ answers, result }) => submit(answers)" />
</template>
```

The wizard owns: steps (instructions → one per section → result), progress,
prev/next, per-section validation before advancing, submit, the optional
countdown (`info.durationMinutes`, emits `timeout`), and the result screen. It
scores locally with `useAssessment` — or pass a `result` prop to show a
server-computed one (`start-at-result` for a review view).

`useAssessment(assessment, answers)` is the whole engine and works headlessly:
`visibleQuestions`, `progress`, `validateQuestion/validateAll`, `setAnswer`,
`result`, `payload`, `reset` — plus the exported `evaluateCondition`,
`validateAnswer` and `computeResult` if you want to reuse the rules server-side.

**Extending without new kinds:** `KAssessmentInput` renders a slot per input
kind — `<template #input-upload="{ update }">` with `KVoiceRecorder` turns an
UploadInput into a spoken answer, same for video.

**Mappers ship in `data/assessmentProviders.ts`** (`fromGenericProvider`,
`fromFormsProvider`) as the pattern to copy: provider payload → `Assessment`.

---

## Calendar

The calendar is a full module under `calendar/` — Jalali (Persian) calendar with
Gregorian support, event dots, day/week/month/year/agenda views, and theming.
Built on `calendar/core/calendarEngine.ts` (conversions, month math, Persian
collation). Styles come from `assets/calendar.css`.

```vue
<KCalendar theme="emerald" view="month" :events="events" v-model:year="y" v-model:month="m" />
```

The calendar has its **own** theme axis (`CALENDAR_THEMES` in
`calendar/types/theme.ts` — 100+ named looks: brands, seasons, moods, Persian
heritage), independent of the kit's light/dark/oled. It exposes `year`/`month`/`day`
(v-model), `view`, `events`, `filterCategories`, `loading`, `disabled`,
`showLegends`, `showKeyboardHint`, and emits `select-date`, `select-event`,
`month-change`, `view-change`. Every theme is browsable in the showcase's
**EXTRA → KCalendar** page.

---

## Core vs wrappers

The `core/` folder holds the logic primitives (`CoreInput`, `CoreSelect`,
`CoreCheckbox`, `CoreTextarea`, `CoreDatePicker`, `CoreFile`) — they own the
accessibility, validation, and theming. The `wrappers/` are the public `K*`
presentation components. **To create a new look**: build a new wrapper on the
existing core; the core stays unchanged.

---

## Dependencies

- `lucide-vue-next` — icons (used across the kit)
- `dompurify` — sanitizing HTML that components render with `v-html`
  (`utils/html.ts`). See [Raw HTML & sanitizing](#raw-html--sanitizing).
- `vue` (v3.3+)
- Optional: `leaflet` (only `KMap`), `gsap` (only `useAnimation`'s gsap path)

Everything else is self-contained — no Pinia, no dayjs, no component libraries.

---

## Showcase app

The kit ships with its own visual harness at `k-kit-project/` — a Vite + Vue 3 +
TS app whose only job is to prove every component works. It is **one page per
component**: `src/pages/showcase/K<Name>.vue`, routed straight off the filename,
listed A→Z in the sidebar (plus an **EXTRA** group at the bottom for
non-component pages such as the calendar theme lab).

```bash
cd k-kit-project
npm install
npx vite --port 3100 --host 0.0.0.0   # dev server
npx vite build                        # production build
npx vue-tsc -b --noEmit               # typecheck
```

Showcase pages are **not** part of the kit — they live outside `ui-kit/` and can
be deleted when you copy the folder into a real project.

> Every page must explicitly `import K<Name> from '…/ui-kit/components/K<Name>.vue'`.
> Without it, Vue's implicit filename self-reference resolves `<K<Name>>` to the
> page itself and the mount recurses until the stack blows.
