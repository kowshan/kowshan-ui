# ui-test — K UI Kit Showcase

A standalone app (Vite + Vue 3 + TypeScript) that demos and tests every component of the
[K UI Kit](https://github.com/your-org/ui-kit) — a copy lives at `src/ui-kit`.

> **Read the real docs first:** `src/ui-kit/README.md` — it explains the theming system,
> every component's API, stores, composables, and the calendar. This README is only about
> running the showcase.

## Run it

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # type-checked production build
npm run preview    # preview the built output
```

## What's inside

The app is a single scrollable page split into sections, one per kit area:

| Section | Demos |
|---|---|
| **Overview** | Hero stats, KProgress, KProgressRing, KBadge, KAvatar, KAvatarGroup |
| **Forms** | KTextInput, KTextarea, KSelect, KRadioGroup, KCheckbox, KSwitch/KToggle, KNumberInput, KDatePickerModal, KTimePickerModal, KFileUpload, KSignaturePad, KCaptcha |
| **Data** | KDataTable (sort/columns/filters/pagination), KFilterBar, KTreeView, KEmptyState |
| **Navigation** | KTabs, KBreadcrumb, KDropdownMenu, KCommandPalette |
| **Feedback** | KAlert, KToast (store-driven), KModal (store-driven), KTooltip, KStories, KSkeleton |
| **Calendar** | KCalendar, KDatePicker, KAvailabilityGrid |
| **CRM** | KKanban, KContactCard, KAssessment |

## Keeping the kit in sync

The kit's source of truth lives in the Nuxt project (`nuxt/app/components/ui-kit`).
To refresh the copy:

```bash
cp -r ../nuxt/app/components/ui-kit src/ui-kit
```

The demo sections import from `src/ui-kit`, so editing the kit copy here works too —
just remember to port changes back.

## Theme switcher

The top bar toggles `light` / `dark` / `oled` by setting `data-theme` on the app root.
Every component (including teleported modals, toasts, and the command palette) follows it.
