# Promotion Page Design

Date: 2026-06-17

## Goal

Build the promotion listing and promotion detail flow for `apps/r017`, using the real promotion API and the shared-first layering strategy.

Routes:

- `/promotion`: promotion listing page.
- `/promotion/:id`: promotion detail page, where `id` is `PromotionDetail.promotion_id`.

The CMS controls whether promotion entry points appear in menus, banners, or sections. Direct URL access to `/promotion` and `/promotion/:id` remains available and does not add a new auth-required route.

## Inputs

API reference:

- `/Users/aiden.chen/jStar/Whitelabel_GSI_Platform_Multiverse/promotion-api-structure.md`

Design references:

- `/Users/aiden.chen/Downloads/優惠活動.png`
- `/Users/aiden.chen/Downloads/優惠活動 (1).png`
- `/Users/aiden.chen/Downloads/優惠活動 (2).png`
- `/Users/aiden.chen/Downloads/優惠活動 (3).png`
- `/Users/aiden.chen/Downloads/優惠活動／詳細內頁.png`
- `/Users/aiden.chen/Downloads/優惠活動／詳細內頁 (1).png`
- `/Users/aiden.chen/Downloads/優惠活動／詳細內頁 (2).png`
- `/Users/aiden.chen/Downloads/優惠活動／詳細內頁 (3).png`
- `/Users/aiden.chen/Downloads/優惠活動／詳細內頁 (4).png`

Existing shared resources:

- `libs/shared/ui-layer/src/lib/api/apiFunctions/promotion_getPromotionList.ts`
- `libs/shared/ui-layer/src/lib/api/commonTypes/promotionTypes.ts`
- `libs/shared/ui-layer/src/lib/constants/promotionType.ts`
- `libs/shared/ui-layer/src/lib/constants/routePath.ts`

## Architecture

Use shared feature components with thin r017 route wrappers.

Shared layer additions:

- `libs/shared/ui-layer/src/lib/components/promotion/PromotionPage.vue`
- `libs/shared/ui-layer/src/lib/components/promotion/PromotionDetailPage.vue`
- `libs/shared/ui-layer/src/lib/components/promotion/PromotionCard.vue`
- `libs/shared/ui-layer/src/lib/components/promotion/PromotionCategoryTabs.vue`, if the tabs become large enough to justify a split.
- `libs/shared/ui-layer/src/lib/composables/usePromotionFlow.ts`
- `libs/shared/ui-layer/src/lib/composables/promotionFlowHelpers.ts`, if pure helper functions need focused tests.
- `libs/shared/ui-layer/src/lib/api/hooks/usePromotionListQuery.ts`
- `libs/shared/ui-layer/src/lib/constants/tanstackQueryKeys/promotionKeys.ts`

r017 additions or updates:

- `apps/r017/src/pages/promotion.vue`
- `apps/r017/src/pages/promotion/[id].vue`

The r017 files are route wrappers. They provide route-level layout and r017-specific classes, especially background and hero classes. Shared promotion components must not hard-code r017 public image paths such as `/images/bg-img-pc.png`.

## Data Flow

The listing and detail pages both use:

```txt
GET /v1/player/promotions/list
```

The existing raw API function is `getPromotionList`.

Add `usePromotionListQuery` to wrap the raw API function through TanStack Query. The hook should return a clean `PromotionResponseList`, defaulting to `[]` when the API returns no data. API failures should surface through query state while the UI can render an empty state.

Promotion detail matching follows the API document:

- Listing cards navigate with `detail.promotion_id`.
- Detail page finds the promotion whose `details` contains that `promotion_id`.
- Detail page renders the matching `PromotionDetail`.

## Locale Handling

Each promotion can contain multiple localized `details`.

For listing:

- Find `promotion.details.find((detail) => detail.lang === currentLocale)`.
- If no matching detail exists, exclude that promotion from the displayed list.
- Do not fallback to another language in this task.

For detail:

- First find by `promotion_id`.
- Render the detail matching the route id.
- If the detail is missing or the route id cannot be matched, render the detail empty state.

## Category Filter

Use `PROMOTION_TYPE_ENUMS`:

- `ALL = 0`
- `DEPOSIT_BONUS = 1`
- `REGISTER_BONUS = 2`
- `BET_BONUS = 3`
- `CUSTOMIZE_BONUS = 4`

Filtering rule:

```txt
activeType === ALL || promotion.type === activeType
```

Use `PROMOTION_TYPE_I18N_KEYS` for tab labels when available. If remote locale data does not include a required label, the UI should still render a readable fallback label rather than a raw missing key.

Desktop shows pill-style horizontal tabs. Mobile follows the design with a compact selected-category bar or dropdown-like control.

## Image and Content Handling

Promotion cards and detail hero image use `detail.image`, not the root `promotion.image`.

Image URL rules:

- Absolute `https://`, `http://`, `//`, and `data:image/...` sources are used as-is.
- Relative paths are resolved through runtime resource configuration.
- When `promotion.updated_time` is present, append a `v` query parameter for cache busting.
- If a URL already has `v`, replace the old value.
- If a URL already has `updateTime`, do not append `v`.

Detail content uses `detail.content` and is rendered as HTML. Before rendering, replace API-domain resource references with the configured static resource domain, following the API document. This transformation should happen in a helper or composable, not inline in the Vue template.

## UI States

Listing page:

- Loading: show a centered spinner in the content area.
- Empty: show the category control and an empty-state message or empty area matching the existing design language.
- Error: render the empty state and preserve the page shell.

Detail page:

- Loading: show a centered spinner in the content area.
- Empty or unmatched id: show a simple empty state in the detail content area. Do not automatically redirect.
- Error: render the empty state and preserve the page shell.

## Visual Direction

The shared components should match the provided promotion design:

- Page background uses the r017 gradient/background wrapper, not hard-coded shared assets.
- Listing desktop uses a three-column card grid.
- Listing mobile uses one column.
- Cards contain image and title. Date range is rendered only if a future API response provides a reliable date source; the current API contract does not include one.
- Detail page centers the content column, renders title, image, detail title, and HTML content.
- Footer and global layout remain owned by the existing r017 layout.

Use existing CSS variables and semantic tokens first. Do not hard-code new design hex values inside shared components unless no token exists and the implementation plan explicitly records the exception.

## CMS Behavior

CMS controls only entry visibility:

- If CMS returns a promotion menu or entrance, it resolves to `/promotion`.
- If CMS does not return the entrance, the route still exists and can be opened directly.

No new CMS guard, middleware, or auth route-group behavior is added in this task.

## Testing Strategy

Focused unit coverage should target pure logic:

- Locale detail filtering.
- Category filtering.
- Detail lookup by `PromotionDetail.promotion_id`.
- Promotion image URL building.
- Detail content domain replacement.

Suggested files:

- `libs/shared/ui-layer/src/lib/composables/usePromotionFlow.test.ts`
- or `libs/shared/ui-layer/src/lib/composables/promotionFlowHelpers.test.ts`

Manual or browser validation should cover:

- `/promotion` desktop and mobile.
- `/promotion/:id` desktop and mobile.
- Loading, empty, and unmatched detail id states.
- CMS menu entry still resolves `promotion` did to `/promotion`.

## Verification Scope

Allowed focused checks after implementation:

- Relevant unit tests.
- `git diff --check`.

Do not run Nuxt prepare, build, full lint, full typecheck, dev server, browser smoke test, or environment-changing commands without RD confirmation.

## Out of Scope

- Adding a separate promotion detail API.
- Changing CMS menu fetch behavior.
- Adding auth requirements to promotion routes.
- Reworking global layout, footer, header, or side menu visuals.
- Introducing tenant-specific assets into shared components.
- Adding fallback locale behavior beyond the current API document.
