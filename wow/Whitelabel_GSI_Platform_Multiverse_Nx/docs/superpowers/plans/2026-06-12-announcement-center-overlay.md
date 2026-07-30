# Announcement Center Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a global announcement center overlay that auto-opens when `ALL_CONTENT` announcements exist and respects "do not show again today".

**Architecture:** Keep reusable API, normalization, flow state, and dialog UI in `libs/shared/ui-layer`. Keep r017-specific layout wiring and class/theme overrides in `apps/r017`.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TanStack Query, PrimeVue/shared Base components, local storage, `NUXT_PUBLIC_IMAGE_BASE`.

---

## Files

- Modify: `libs/shared/ui-layer/src/lib/api/apiFunctions/announcement_getAnnouncementList.ts`
- Create: `libs/shared/ui-layer/src/lib/api/hooks/useAnnouncementList.ts`
- Modify: `libs/shared/ui-layer/src/lib/constants/tanstackQueryKeys/reportKeys.ts`
- Create: `libs/shared/ui-layer/src/lib/composables/useAnnouncementCenterFlow.ts`
- Create: `libs/shared/ui-layer/src/lib/components/AnnouncementDialog.vue`
- Create: `apps/r017/src/components/announcement/AnnouncementCenterOverlay.vue`
- Modify: `apps/r017/src/layouts/default.vue`
- Optional test: shared unit tests if the repo has an existing colocated test pattern for composables/API helpers.

## Task 1: API Contract

- [ ] Update `announcement_getAnnouncementList.ts` to accept params:
  - `start_time_from?: string`
  - `start_time_to?: string`
  - `keyword?: string`
  - `offset?: number`
  - `size?: number`
- [ ] Change response type to support both `{ list, pagination }` and legacy `Announcement[]`.
- [ ] Fix `display_options` type to `ANNOUNCEMENT_DISPLAY_TYPE_ENUMS[]`.
- [ ] Add a normalizer helper that returns `{ list, pagination }`.
- [ ] Add announcement query key to `tanstackQueryKeys`.
- [ ] Create `useAnnouncementList.ts` with `enabled: false` by default and `select` normalization.

Validation:

```bash
rtk git --no-pager diff --check -- libs/shared/ui-layer/src/lib/api libs/shared/ui-layer/src/lib/constants
```

## Task 2: Flow Composable

- [ ] Create `useAnnouncementCenterFlow.ts`.
- [ ] Add filter state: type, date range, keyword.
- [ ] Add pagination state: page, page size, total.
- [ ] Filter to `ANNOUNCEMENT_DISPLAY_TYPE_ENUMS.ALL_CONTENT`.
- [ ] Resolve `langDetail` from current i18n locale.
- [ ] Add selected announcement state.
- [ ] Add auto-open logic:
  - API success.
  - At least one `ALL_CONTENT` announcement.
  - `dontShowUntilTs` is absent or expired.
- [ ] Add `dontShowToday` state and local storage persistence.
- [ ] On close, write next local midnight only when `dontShowToday` is checked.
- [ ] Ensure close only changes local overlay state and never navigates.

Validation:

```bash
rtk git --no-pager diff --check -- libs/shared/ui-layer/src/lib/composables/useAnnouncementCenterFlow.ts
```

## Task 3: Shared Dialog UI

- [ ] Create `AnnouncementDialog.vue`.
- [ ] Use existing shared Base components:
  - `BaseDialog`
  - `BaseSelect`
  - `BaseDatePicker`
  - `BaseInput`
  - `BaseBtn`
  - `BasePagination`
  - `BaseCheckBox`
  - `BaseImage`
- [ ] Render title/content as text only.
- [ ] Render image with `BaseImage :src="announcement.langDetail.image_path"`.
- [ ] Implement PC/tablet two-column layout.
- [ ] Implement mobile single-column layout with expandable detail.
- [ ] Add loading, empty, selected, and no-image states.
- [ ] Keep styling themeable through class props and CSS variables; do not create r017-only CSS inside shared.

Validation:

```bash
rtk git --no-pager diff --check -- libs/shared/ui-layer/src/lib/components/AnnouncementDialog.vue
```

## Task 4: r017 Wiring

- [ ] Create `apps/r017/src/components/announcement/AnnouncementCenterOverlay.vue`.
- [ ] Use `useAnnouncementCenterFlow`.
- [ ] Render shared `AnnouncementDialog`.
- [ ] Provide r017 class/theme overrides only where needed.
- [ ] Mount `AnnouncementCenterOverlay` in `apps/r017/src/layouts/default.vue`.
- [ ] Confirm it does not interfere with `LoginDialog`, `RegisterDialog`, or claim gift overlay.

Validation:

```bash
rtk git --no-pager diff --check -- apps/r017/src/components/announcement apps/r017/src/layouts/default.vue
```

## Task 5: Final Checks

- [ ] Run code diff whitespace check for all touched files.
- [ ] Review that `.vscode/settings.json` remains unrelated and is not included.
- [ ] Recommended after user approval:

```bash
rtk nx lint r017
rtk nx build r017
```

- [ ] Recommended manual/browser QA:
  - PC `1440px+`.
  - Tablet `769px-1439px`.
  - Mobile `768px-`.
  - API has announcements: overlay auto-opens.
  - API empty/error: overlay does not open.
  - "Today no longer display" suppresses the overlay until next local midnight.
  - Image paths load through `NUXT_PUBLIC_IMAGE_BASE` via `BaseImage`.
