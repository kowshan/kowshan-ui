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
- [Folder structure](#folder-structure)
- [Theming](#theming)
- [Components](#components)
- [Stores & global state](#stores--global-state)
- [Composables](#composables)
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

3. **Wrap your app** in a root with the `k-ui` class so theme variables are in scope:

   ```vue
   <template>
     <div class="k-ui" :data-theme="theme">
       <!-- your app -->
       <KGlobalLayer />   <!-- once: toast stack (see Stores & global state) -->
     </div>
   </template>
   ```

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

Everything is driven by CSS custom properties under `.k-ui`. Override the accent
(or any token) on your root:

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

Three themes ship by default — switch with the `data-theme` attribute
(`light` | `dark` | `oled`). The dark theme uses neutral zinc grays (no blue
undertone). Core tokens:

| Token | Purpose |
|---|---|
| `--k-primary`, `--k-primary-hover`, `--k-primary-light` | brand accent + tints |
| `--k-bg`, `--k-surface`, `--k-surface-hover` | backgrounds |
| `--k-text-primary`, `--k-text-secondary`, `--k-text-muted`, `--k-placeholder` | text |
| `--k-border`, `--k-border-focus` | borders / focus rings |
| `--k-success`, `--k-warning`, `--k-error`, `--k-info` (+ `-light`) | status colors |
| `--k-radius-sm`, `--k-radius-md`, `--k-shadow-md` | shape & elevation |

> **Teleported layers** (modals, toasts, lightbox, stories) render in `<body>`
> and escape `.k-ui`. They re-apply the theme automatically via `useKitTheme()`
> (each teleported root carries `k-ui` + `data-theme`), so they always match —
> but **do not** put page-level rules (backgrounds, `min-height`) on a bare
> `.k-ui` selector; scope them to your own app root class instead.

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
| `useKDebounce`, `useId` | small utilities |
| `useValidation`, `useAsyncValidation`, `useInputLogic` | input validation + wiring for the core inputs |
| `useFormatting`, `usePersianNumbers`, `useFileHelper`, `useFileValidation` | formatting / file helpers |
| `useAnimation` | optional gsap-driven animations (falls back to CSS) |
| `useAccessibility` | keyboard/aria helpers |
| `useApiFetch` | fetch wrapper for Laravel backends — base URL, Bearer token, query params, **Laravel-style error normalization** (`{ message, errors, status }`), `loading` ref, `abortAll()` |
| `useSeo` | title / description / keywords / canonical / Open Graph / **JSON-LD** — routes through Nuxt `useHead` when available, plain-DOM fallback otherwise; accepts reactive options |
| `useStorageEncryption` | **AES-GCM encrypted localStorage** — PBKDF2 key derivation (100k iterations, random salt), fresh IV per write, hashed keys, `setItem`/`getItem`/`removeItem`/`clear` |
| `useBrowserDb` | promise-based **IndexedDB wrapper** — form drafts, offline queue, caches: `set`/`get`/`remove`/`all`/`count`/`keys`, structured-clone values |
| `useUrlCipher` | **HMAC-signed reversible ID hash** for URLs (password-reset links, share tokens) — `hash(id, { ttl })` → URL-safe token, `unhash` returns the id or `null` on tamper/expiry |

---

## Calendar

The calendar is a full module under `calendar/` — Jalali (Persian) calendar with
Gregorian support, event dots, day/week/month/year/agenda views, and theming.
Built on `calendar/core/calendarEngine.ts` (conversions, month math, Persian
collation). Styles come from `assets/calendar.css`.

---

## Core vs wrappers

The `core/` folder holds the logic primitives (`CoreInput`, `CoreSelect`,
`CoreCheckbox`, `CoreTextarea`, `CoreDatePicker`, `CoreFile`) — they own the
accessibility, validation, and theming. The `wrappers/` are the public `K*`
presentation components. **To create a new look**: build a new wrapper on the
existing core; the core stays unchanged.

---

## Dependencies

- `lucide-vue-next` — icons (the only external dependency, used across the kit)
- `vue` (v3.3+)
- Optional: `gsap` (only if you want `useAnimation`'s gsap path)

Everything else is self-contained — no Pinia, no dayjs, no component libraries.

---

## Showcase app

A standalone Vite + Vue 3 + TS app lives at `../ui-test` with a live demo of
every component, a theme switcher, and mock data (dashboard, forms, tables, CRM,
calendar). It imports the same `ui-kit` folder — the kit's source of truth is
`nuxt/app/components/ui-kit`, and `ui-test/src/ui-kit` is a synced copy.

Sections mount lazily (`LazySection` + `content-visibility: auto`): only the
first section builds on load and the rest mount as they approach the viewport,
so the initial page stays fast (≈1s DCL) and nav jumps converge with smooth
scroll + instant corrections. Components measure sizes via `ResizeObserver`
(e.g. `KVirtualList`) to avoid mount-time forced reflows.

```bash
cd ui-test
npm install
npm run dev     # http://localhost:3100
npm run build   # vue-tsc + vite build
```
