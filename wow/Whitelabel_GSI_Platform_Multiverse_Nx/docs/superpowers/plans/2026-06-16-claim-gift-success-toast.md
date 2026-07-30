# Claim Gift Success Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Do not run git commit/add/push unless RD explicitly authorizes git state changes.

**Goal:** Show a top-right green success toast after `ClaimGift` is claimed successfully.

**Architecture:** Keep the behavior in shared `useClaimGiftFlow` because both real API and mock claim success are centralized there. Reuse existing r017 `$appToast` / PrimeVue Toast bridge through Nuxt app injection, so no new UI module is created.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, PrimeVue Toast, shared i18n, existing `TOAST_SEVERITY_ENUMS`.

---

## Files

- Modify: `libs/shared/ui-layer/src/lib/composables/useClaimGiftFlow.ts`
- Modify: `libs/shared/ui-layer/src/lib/components/ClaimGiftFloatingEntry.test.ts`

## Task 1: Add Success Toast Hook

- [ ] Import `useNuxtApp` and `TOAST_SEVERITY_ENUMS` in `useClaimGiftFlow.ts`.

Expected import shape:

```ts
import { useI18n, useNuxtApp, useRoute, useRuntimeConfig } from "#imports"
import { TOAST_SEVERITY_ENUMS } from "../constants/toast"
```

- [ ] Create a local `notifyClaimSuccess` helper inside `useClaimGiftFlow`.

Expected implementation:

```ts
const nuxtApp = useNuxtApp()

const notifyClaimSuccess = () => {
  ;(nuxtApp as any).$appToast?.(t("common.alarm.successfullyClaimed"), {
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    life: 2200
  })
}
```

- [ ] Call `notifyClaimSuccess()` after successful mock claim and after successful API claim.

Expected placement:

```ts
if (shouldUseMockData.value && options.mockAdapter) {
  await options.mockAdapter.claimGift(payload)
  notifyClaimSuccess()
  finishClaim()
  return true
}

const response = await claim(payload)
if (!response.status) return false

await refreshAfterClaim()
notifyClaimSuccess()
finishClaim()
return true
```

## Task 2: Extend Source-Based i18n Test

- [ ] Update `ClaimGiftFloatingEntry.test.ts` to assert the success toast key is used in the shared flow.

Expected assertion:

```ts
expect(source).toContain('t("common.alarm.successfullyClaimed")')
```

- [ ] Assert no hardcoded success detail is added.

Expected assertion:

```ts
expect(source).not.toContain('"領取成功"')
expect(source).not.toContain('"Claim Successful"')
```

## Task 3: Verification

- [ ] Run whitespace diff check:

```bash
git diff --check -- libs/shared/ui-layer/src/lib/composables/useClaimGiftFlow.ts libs/shared/ui-layer/src/lib/components/ClaimGiftFloatingEntry.test.ts
```

Expected: no output.

- [ ] Run targeted source scan:

```bash
rg -n '領取成功|Claim Successful|common\.alarm\.successfullyClaimed|\$appToast|TOAST_SEVERITY_ENUMS\.SUCCESS' libs/shared/ui-layer/src/lib/composables/useClaimGiftFlow.ts libs/shared/ui-layer/src/lib/components/ClaimGiftFloatingEntry.test.ts
```

Expected: key and success toast usage are present; hardcoded visible text is absent.

- [ ] Recommended unit test after RD approval:

```bash
rtk npm test -- ClaimGiftFloatingEntry
```

Expected: related tests pass.
