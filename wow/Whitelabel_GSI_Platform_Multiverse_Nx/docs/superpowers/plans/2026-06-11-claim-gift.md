# Claim Gift Floating Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 R017 實作登入後有禮金才顯示的可拖曳禮金浮動入口，支援多筆禮金、多幣別領取、mock 測試與成功後刷新錢包。

**Architecture:** `libs/shared/ui-layer` 只新增通用 draggable floating button 與 claim gift API/mutation；`apps/r017` 負責禮金業務組裝、彈窗、mock 與資產。共用層不包含 R017 文案、圖片或禮金 UI。

**Tech Stack:** Nuxt 3 SPA、Vue 3 Composition API、Pinia、TanStack Vue Query、PrimeVue、Tailwind/SCSS.

---

## 治理與限制

- 本計畫依已確認 spec：`docs/superpowers/specs/2026-06-11-claim-gift-design.md`。
- 專案治理規則高於本 skill：未經 RD 明確授權，不執行 `git add`、`git commit`、branch changes、install、service startup、full build、browser validation。
- 本計畫不安排 commit step；若 RD 後續授權，再由執行者另行 staging/commit。
- 本計畫不主動新增測試，因全域治理要求只有 RD 明確要求才新增/執行測試。計畫保留可授權的 focused validation 指令。

## File Structure

- Create `libs/shared/ui-layer/src/lib/components/BaseFloatingAction.vue`：共用 draggable floating action 基底。
- Modify `libs/shared/ui-layer/src/lib/api/apiFunctions/gift_claimGift.ts`：補強既有 claim gift POST wrapper 型別。
- Create `libs/shared/ui-layer/src/lib/api/hooks/useClaimGift.ts`：claim gift mutation hook。
- Create `apps/r017/src/composables/useClaimGift/mockData.ts`：R017 禮金 mock dataset 與 mock store。
- Create `apps/r017/src/composables/useClaimGift/index.ts`：R017 禮金 normalize、currency selection、claim orchestration。
- Create `apps/r017/src/components/claimGift/ClaimGiftDialog.vue`：非清單式領取彈窗。
- Create `apps/r017/src/components/claimGift/ClaimGiftFloatingEntry.vue`：R017 浮動入口組裝。
- Create `apps/r017/src/public/images/claim-gift/floating-gift.png`：使用 RD 指定的乾淨禮金 PNG。
- Modify `apps/r017/src/layouts/default.vue`：全站掛載 `ClaimGiftFloatingEntry`。

## Task 1: 補齊 claim gift API wrapper 與 mutation

**Files:**
- Modify: `libs/shared/ui-layer/src/lib/api/apiFunctions/gift_claimGift.ts`
- Create: `libs/shared/ui-layer/src/lib/api/hooks/useClaimGift.ts`

- [ ] **Step 1: 補強 claim gift API function**

Update `libs/shared/ui-layer/src/lib/api/apiFunctions/gift_claimGift.ts`:

```ts
import { requestFn } from "../axiosInterceptors"
import { EmptyType } from "../commonTypes"
import { ENDPOINT_PATHS } from "../endpointPaths"

export interface ClaimGiftParamsType {
  gift_id: number
  amount: number
  currency: number
}

export type ClaimGiftRequestType = ClaimGiftParamsType
export type ClaimGiftResponseType = EmptyType
export type ClaimGiftDataParamsType = ClaimGiftParamsType
export type ClaimGiftDataRequestType = ClaimGiftRequestType

export const claimGift = (params: ClaimGiftParamsType) => {
  return requestFn<ClaimGiftRequestType, ClaimGiftResponseType>(ENDPOINT_PATHS.GIFT.CLAIM, params, {
    name: "claimGift",
    method: "post",
    needToken: true
  })
}
```

- [ ] **Step 2: 建立 mutation hook**

Create `libs/shared/ui-layer/src/lib/api/hooks/useClaimGift.ts`:

```ts
import type { ApiResponse } from "../types"
import { claimGift, type ClaimGiftParamsType, type ClaimGiftResponseType } from "../apiFunctions/gift_claimGift"
import { useApiMutation } from "../useApiMutation"

export interface UseClaimGiftOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useClaimGift(options: UseClaimGiftOptions = {}) {
  const mutation = useApiMutation(claimGift, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const claim = async (params: ClaimGiftParamsType) => {
    return (await mutation.mutateAsync(params)) as ApiResponse<ClaimGiftResponseType>
  }

  return {
    claim,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
```

## Task 2: 新增 shared draggable floating action 基底

**Files:**
- Create: `libs/shared/ui-layer/src/lib/components/BaseFloatingAction.vue`

- [ ] **Step 1: 建立 component props 與拖曳狀態**

Create `libs/shared/ui-layer/src/lib/components/BaseFloatingAction.vue`:

```vue
<script setup lang="ts">
interface FloatingPosition {
  x: number
  y: number
}

interface Props {
  storageKey: string
  badge?: string | number
  size?: number
  initialRight?: number
  initialBottom?: number
  mobileBottomOffset?: number
  dragThreshold?: number
  zIndexClass?: string
  classObj?: {
    root?: string
    button?: string
    badge?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  size: 72,
  initialRight: 24,
  initialBottom: 120,
  mobileBottomOffset: 84,
  dragThreshold: 6,
  zIndexClass: "z-40",
  classObj: () => ({})
})

const emit = defineEmits<{
  click: []
}>()

const position = reactive<FloatingPosition>({ x: 0, y: 0 })
const dragStart = reactive({ x: 0, y: 0, pointerX: 0, pointerY: 0 })
const isReady = ref(false)
const isDragging = ref(false)
const hasMoved = ref(false)

const isBrowser = typeof window !== "undefined"
```

- [ ] **Step 2: 加入位置初始化、邊界限制與保存邏輯**

Append in the same `<script setup>`:

```ts
const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight
})

const getDefaultPosition = (): FloatingPosition => {
  const viewport = getViewport()
  const bottomOffset = viewport.width <= 768 ? props.mobileBottomOffset : props.initialBottom

  return {
    x: viewport.width - props.size - props.initialRight,
    y: viewport.height - props.size - bottomOffset
  }
}

const clampPosition = (next: FloatingPosition): FloatingPosition => {
  const viewport = getViewport()
  const margin = 8

  return {
    x: Math.min(Math.max(next.x, margin), viewport.width - props.size - margin),
    y: Math.min(Math.max(next.y, margin), viewport.height - props.size - margin)
  }
}

const savePosition = () => {
  if (!isBrowser) return
  window.localStorage.setItem(props.storageKey, JSON.stringify({ x: position.x, y: position.y }))
}

const loadPosition = () => {
  if (!isBrowser) return

  const fallback = getDefaultPosition()
  const raw = window.localStorage.getItem(props.storageKey)

  if (!raw) {
    Object.assign(position, clampPosition(fallback))
    return
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FloatingPosition>
    Object.assign(
      position,
      clampPosition({
        x: Number(parsed.x ?? fallback.x),
        y: Number(parsed.y ?? fallback.y)
      })
    )
  } catch {
    Object.assign(position, clampPosition(fallback))
  }
}

const snapToNearestEdge = () => {
  const viewport = getViewport()
  const nextX = position.x + props.size / 2 < viewport.width / 2 ? 8 : viewport.width - props.size - 8
  Object.assign(position, clampPosition({ x: nextX, y: position.y }))
  savePosition()
}
```

- [ ] **Step 3: 加入 pointer event handlers**

Append in the same `<script setup>`:

```ts
const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return

  const deltaX = event.clientX - dragStart.pointerX
  const deltaY = event.clientY - dragStart.pointerY
  const distance = Math.hypot(deltaX, deltaY)

  if (distance >= props.dragThreshold) {
    hasMoved.value = true
  }

  Object.assign(
    position,
    clampPosition({
      x: dragStart.x + deltaX,
      y: dragStart.y + deltaY
    })
  )
}

const cleanupPointerListeners = () => {
  window.removeEventListener("pointermove", onPointerMove)
  window.removeEventListener("pointerup", onPointerUp)
  window.removeEventListener("pointercancel", onPointerUp)
}

function onPointerUp() {
  if (!isDragging.value) return

  isDragging.value = false
  cleanupPointerListeners()

  if (hasMoved.value) {
    snapToNearestEdge()
    return
  }

  emit("click")
}

const onPointerDown = (event: PointerEvent) => {
  if (!isBrowser) return

  isDragging.value = true
  hasMoved.value = false
  dragStart.x = position.x
  dragStart.y = position.y
  dragStart.pointerX = event.clientX
  dragStart.pointerY = event.clientY

  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)
}

const handleResize = () => {
  Object.assign(position, clampPosition(position))
  savePosition()
}

onMounted(() => {
  loadPosition()
  isReady.value = true
  window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
  cleanupPointerListeners()
  window.removeEventListener("resize", handleResize)
})
```

- [ ] **Step 4: 加入 template 與樣式**

Append template and style:

```vue
<template>
  <div
    v-if="isReady"
    :class="cx('fixed select-none touch-none', props.zIndexClass, props.classObj?.root)"
    :style="{
      width: `${props.size}px`,
      height: `${props.size}px`,
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`
    }"
    @pointerdown.prevent="onPointerDown"
  >
    <button
      type="button"
      :class="
        cx(
          'relative grid h-full w-full place-items-center rounded-full border-0 bg-transparent p-0',
          'cursor-pointer touch-none outline-none transition-transform duration-200',
          !isDragging && 'hover:scale-105 active:scale-95',
          props.classObj?.button
        )
      "
      aria-label="Open floating action"
    >
      <slot />

      <span
        v-if="badge !== undefined && badge !== null && String(badge).length"
        :class="
          cx(
            'absolute -right-1 -top-1 min-w-6 rounded-full bg-[#EF4444] px-1.5 py-0.5',
            'text-center text-xs font-bold leading-5 text-white shadow-lg',
            props.classObj?.badge
          )
        "
      >
        {{ badge }}
      </span>
    </button>
  </div>
</template>
```

## Task 3: 建立 R017 mock gift data 與 composable

**Files:**
- Create: `apps/r017/src/composables/useClaimGift/mockData.ts`
- Create: `apps/r017/src/composables/useClaimGift/index.ts`

- [ ] **Step 1: 建立 mock data store**

Create `apps/r017/src/composables/useClaimGift/mockData.ts`:

```ts
import { CLAIM_GIFT_TYPE_ENUMS } from "@shared-src/lib/constants/claimGiftType"
import { PENDING_STATUS_ENUMS } from "@shared-src/lib/constants/pendingStatus"
import { WALLET_TYPE_ENUMS } from "@shared-src/lib/constants/walletType"
import type { GiftList } from "@shared-src/lib/api/apiFunctions/gift_getGiftList"

export const createClaimGiftMockList = (): GiftList => {
  const manyGifts: GiftList = Array.from({ length: 95 }, (_, index) => ({
    id: 9000 + index,
    type: index % 2 === 0 ? CLAIM_GIFT_TYPE_ENUMS.LEVEL_UP : CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY,
    wallet_type: WALLET_TYPE_ENUMS.CASH,
    status: PENDING_STATUS_ENUMS.PENDING,
    options: [
      {
        amount: String(50 + index),
        currency_id: 1,
        currency_code: "USD"
      }
    ]
  }))

  return [
    {
      id: 8801,
      type: CLAIM_GIFT_TYPE_ENUMS.LEVEL_UP,
      wallet_type: WALLET_TYPE_ENUMS.CASH,
      status: PENDING_STATUS_ENUMS.PENDING,
      options: [
        { amount: "100.00", currency_id: 1, currency_code: "USD" },
        { amount: "700.00", currency_id: 2, currency_code: "CNY" },
        { amount: "3200.00", currency_id: 3, currency_code: "THB" }
      ]
    },
    {
      id: 8802,
      type: CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY,
      wallet_type: WALLET_TYPE_ENUMS.REWARD,
      status: PENDING_STATUS_ENUMS.PENDING,
      options: [{ amount: "88.00", currency_id: 1, currency_code: "USD" }]
    },
    ...manyGifts
  ]
}

export const claimGiftMockStore = reactive({
  initialized: false,
  gifts: [] as GiftList
})

export const ensureClaimGiftMockInitialized = () => {
  if (claimGiftMockStore.initialized) return
  claimGiftMockStore.gifts = createClaimGiftMockList()
  claimGiftMockStore.initialized = true
}

export const removeClaimGiftMockGift = (giftId: number) => {
  claimGiftMockStore.gifts = claimGiftMockStore.gifts.filter((gift) => Number(gift.id) !== Number(giftId))
}
```

- [ ] **Step 2: 建立 normalize 與 selector helpers**

Create `apps/r017/src/composables/useClaimGift/index.ts`:

```ts
import { AUTH_ROUTE_GROUPS } from "@shared-src/lib/constants/routePath"
import { CLAIM_GIFT_TYPE_ENUMS } from "@shared-src/lib/constants/claimGiftType"
import { WALLET_TYPE_ENUMS } from "@shared-src/lib/constants/walletType"
import type { Gift, GiftList, GiftOptions } from "@shared-src/lib/api/apiFunctions/gift_getGiftList"
import type { ClaimGiftParamsType } from "@shared-src/lib/api/apiFunctions/gift_claimGift"
import { useClaimGift as useClaimGiftMutation } from "@shared-src/lib/api/hooks/useClaimGift"
import { claimGiftMockStore, ensureClaimGiftMockInitialized, removeClaimGiftMockGift } from "./mockData"

const FLOATING_GIFT_STORAGE_KEY = "r017.claimGift.floatingPosition"
const SUCCESS_VISIBLE_MS = 900

const parseEnvBoolean = (value: unknown) => String(value).toLowerCase() === "true"

const normalizeGiftList = (list: GiftList = []): GiftList => {
  return list
    .map((gift) => ({
      ...gift,
      options: gift.options.filter((option) => Number(option.amount) > 0)
    }))
    .filter((gift) => gift.options.length > 0)
}

const getFirstOptionForCurrency = (gift: Gift | undefined, currencyCode: string): GiftOptions | undefined => {
  if (!gift) return undefined
  return gift.options.find((option) => option.currency_code === currencyCode)
}

const getGiftTypeLabel = (type: CLAIM_GIFT_TYPE_ENUMS) => {
  if (Number(type) === CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY) return "生日禮金"
  return "晉級禮金"
}

const getWalletTypeLabel = (type: WALLET_TYPE_ENUMS) => {
  if (Number(type) === WALLET_TYPE_ENUMS.BONUS) return "撲滿錢包"
  if (Number(type) === WALLET_TYPE_ENUMS.REWARD) return "贈金錢包"
  return "現金錢包"
}
```

- [ ] **Step 3: 建立 composable 主流程**

Append in `apps/r017/src/composables/useClaimGift/index.ts`:

```ts
export const useClaimGift = () => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const auth = useAuth()
  const { giftList, isLoading, refetch: refetchGiftList } = useGiftList({
    options: {
      enabled: computed(() => Boolean(auth.access_token))
    }
  })
  const { refetch: refetchWalletList } = useUserWalletList({
    options: {
      enabled: computed(() => Boolean(auth.access_token))
    }
  })
  const { claim, isPending: isClaiming } = useClaimGiftMutation()

  const isDialogVisible = ref(false)
  const selectedCurrency = ref("")
  const isSuccessVisible = ref(false)

  const shouldUseMockData = computed(() => parseEnvBoolean(runtimeConfig.public.SHOW_MOCK_DATA))
  const isLoggedIn = computed(() => Boolean(auth.access_token))
  const isGuestOnlyRoute = computed(() =>
    AUTH_ROUTE_GROUPS.GUEST_ONLY_ROUTES.some((path) => route.path === path || route.path.startsWith(`${path}/`))
  )

  const sourceGiftList = computed<GiftList>(() => {
    if (shouldUseMockData.value) {
      ensureClaimGiftMockInitialized()
      return claimGiftMockStore.gifts
    }

    return giftList.value ?? []
  })

  const normalizedGiftList = computed(() => normalizeGiftList(sourceGiftList.value))
  const currentGift = computed(() => normalizedGiftList.value[0])
  const badgeCount = computed(() => normalizedGiftList.value.length)
  const shouldShowFloatingEntry = computed(() => isLoggedIn.value && !isGuestOnlyRoute.value && badgeCount.value > 0)

  const currencyOptions = computed(() => {
    const seen = new Set<string>()
    return (currentGift.value?.options ?? []).reduce<Array<{ label: string; value: string }>>((result, option) => {
      if (seen.has(option.currency_code)) return result
      seen.add(option.currency_code)
      result.push({ label: option.currency_code, value: option.currency_code })
      return result
    }, [])
  })

  watch(
    currentGift,
    (gift) => {
      selectedCurrency.value = gift?.options[0]?.currency_code || ""
    },
    { immediate: true }
  )

  const selectedOption = computed(() => getFirstOptionForCurrency(currentGift.value, selectedCurrency.value))
  const selectedAmount = computed(() => selectedOption.value?.amount || "0")
  const giftTypeLabel = computed(() => (currentGift.value ? getGiftTypeLabel(currentGift.value.type) : "禮金"))
  const walletTypeLabel = computed(() => (currentGift.value ? getWalletTypeLabel(currentGift.value.wallet_type) : ""))

  const openDialog = () => {
    if (!shouldShowFloatingEntry.value) return
    isDialogVisible.value = true
  }

  const closeDialog = () => {
    isDialogVisible.value = false
    isSuccessVisible.value = false
  }
```

- [ ] **Step 4: 加入 claim 與 refresh 流程**

Append in `apps/r017/src/composables/useClaimGift/index.ts`:

```ts
  const buildClaimPayload = (): ClaimGiftParamsType | null => {
    if (!currentGift.value || !selectedOption.value) return null

    return {
      gift_id: currentGift.value.id,
      amount: Number(selectedOption.value.amount),
      currency: selectedOption.value.currency_id
    }
  }

  const refreshAfterClaim = async () => {
    if (shouldUseMockData.value) return
    await refetchGiftList()
    await refetchWalletList()
  }

  const claimCurrentGift = async () => {
    const payload = buildClaimPayload()
    if (!payload || isClaiming.value) return false

    if (shouldUseMockData.value) {
      removeClaimGiftMockGift(payload.gift_id)
      isSuccessVisible.value = true
      window.setTimeout(() => {
        isSuccessVisible.value = false
        if (!normalizedGiftList.value.length) closeDialog()
      }, SUCCESS_VISIBLE_MS)
      return true
    }

    const response = await claim(payload)
    if (!response.status) return false

    await refreshAfterClaim()
    isSuccessVisible.value = true
    window.setTimeout(() => {
      isSuccessVisible.value = false
      if (!normalizedGiftList.value.length) closeDialog()
    }, SUCCESS_VISIBLE_MS)
    return true
  }

  return {
    FLOATING_GIFT_STORAGE_KEY,
    badgeCount,
    shouldShowFloatingEntry,
    isDialogVisible,
    isLoading,
    isClaiming,
    isSuccessVisible,
    currentGift,
    currencyOptions,
    selectedCurrency,
    selectedAmount,
    giftTypeLabel,
    walletTypeLabel,
    openDialog,
    closeDialog,
    claimCurrentGift
  }
}
```

## Task 4: 建立 R017 禮金彈窗

**Files:**
- Create: `apps/r017/src/components/claimGift/ClaimGiftDialog.vue`

- [ ] **Step 1: 建立 dialog script**

Create `apps/r017/src/components/claimGift/ClaimGiftDialog.vue`:

```vue
<script setup lang="ts">
interface CurrencyOption {
  label: string
  value: string
}

interface Props {
  visible: boolean
  giftTypeLabel: string
  walletTypeLabel: string
  selectedCurrency: string
  selectedAmount: string
  currencyOptions: CurrencyOption[]
  isClaiming?: boolean
  isSuccessVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isClaiming: false,
  isSuccessVisible: false
})

const emit = defineEmits<{
  "update:visible": [value: boolean]
  "update:selectedCurrency": [value: string]
  claim: []
  close: []
}>()

const modelVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value)
})

const handleClose = () => {
  emit("update:visible", false)
  emit("close")
}
</script>
```

- [ ] **Step 2: 建立 dialog template**

Append template:

```vue
<template>
  <BaseDialog
    v-model:visible="modelVisible"
    :class-obj="{
      root: '!max-w-[420px] phone:!h-auto phone:!max-h-[88dvh] phone:!rounded-2xl phone:!mx-4',
      header: '!bg-[#1D125D]',
      body: '!bg-[#1D125D] !px-6 !pb-6 !pt-2',
      closeBtn: '!text-white'
    }"
    @close="handleClose"
  >
    <template #header>禮金領取</template>

    <div class="flex flex-col gap-5 text-center">
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 shadow-lg">
        <BaseIcon name="mdi:gift" size="44px" class="text-[#FFD166]" />
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xl font-bold leading-7 text-white">{{ giftTypeLabel }}</p>
        <p v-if="walletTypeLabel" class="text-sm font-medium leading-5 text-white/70">{{ walletTypeLabel }}</p>
      </div>

      <BaseSelect
        v-if="currencyOptions.length > 1"
        :model-value="selectedCurrency"
        :options="currencyOptions"
        option-label="label"
        option-value="value"
        label="Currency"
        :disabled="isClaiming"
        @update:model-value="emit('update:selectedCurrency', String($event || ''))"
      />

      <div class="rounded-lg border border-white/15 bg-black/20 px-4 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-white/50">Amount</p>
        <p class="mt-1 text-3xl font-bold leading-10 text-[#FFD166]">{{ selectedAmount }}</p>
      </div>

      <Transition name="claim-gift-success">
        <p v-if="isSuccessVisible" class="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-bold text-emerald-200">
          領取成功
        </p>
      </Transition>
    </div>

    <template #footer>
      <BaseBtn
        theme="primary"
        size="lg"
        class="w-full"
        :loading="isClaiming"
        :disabled="isClaiming || isSuccessVisible"
        :class-obj="{ button: 'w-full' }"
        @click="emit('claim')"
      >
        領取禮金
      </BaseBtn>
    </template>
  </BaseDialog>
</template>
```

- [ ] **Step 3: 加入 transition style**

Append style:

```vue
<style scoped>
.claim-gift-success-enter-active,
.claim-gift-success-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.claim-gift-success-enter-from,
.claim-gift-success-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
```

## Task 5: 放置 R017 浮動禮金資產

**Files:**
- Create: `apps/r017/src/public/images/claim-gift/floating-gift.png`

- [ ] **Step 1: 建立 asset 目錄**

Run only during implementation:

```bash
mkdir -p apps/r017/src/public/images/claim-gift
```

Expected: directory exists.

- [ ] **Step 2: 複製 RD 指定禮金圖**

Run only during implementation:

```bash
cp '/Users/aiden.chen/Downloads/⭕ 禮金明細/img/gift_detail.png' apps/r017/src/public/images/claim-gift/floating-gift.png
```

Expected: `apps/r017/src/public/images/claim-gift/floating-gift.png` exists and is a 100x103 PNG gift asset.

## Task 6: 建立 R017 浮動入口組裝元件

**Files:**
- Create: `apps/r017/src/components/claimGift/ClaimGiftFloatingEntry.vue`

- [ ] **Step 1: 建立 component script**

Create `apps/r017/src/components/claimGift/ClaimGiftFloatingEntry.vue`:

```vue
<script setup lang="ts">
const {
  FLOATING_GIFT_STORAGE_KEY,
  badgeCount,
  shouldShowFloatingEntry,
  isDialogVisible,
  isClaiming,
  isSuccessVisible,
  currencyOptions,
  selectedCurrency,
  selectedAmount,
  giftTypeLabel,
  walletTypeLabel,
  openDialog,
  closeDialog,
  claimCurrentGift
} = useClaimGift()
</script>
```

- [ ] **Step 2: 建立 floating entry 與 dialog template**

Append template:

```vue
<template>
  <ClientOnly>
    <BaseFloatingAction
      v-if="shouldShowFloatingEntry"
      :storage-key="FLOATING_GIFT_STORAGE_KEY"
      :badge="badgeCount"
      :size="76"
      :initial-right="24"
      :initial-bottom="132"
      :mobile-bottom-offset="96"
      :class-obj="{
        button: 'claim-gift-floating-button',
        badge: 'bg-[#EF4444] text-white'
      }"
      @click="openDialog"
    >
      <img
        src="/images/claim-gift/floating-gift.png"
        alt="禮金"
        draggable="false"
        class="h-full w-full object-contain"
      />
    </BaseFloatingAction>

    <ClaimGiftDialog
      v-model:visible="isDialogVisible"
      v-model:selected-currency="selectedCurrency"
      :gift-type-label="giftTypeLabel"
      :wallet-type-label="walletTypeLabel"
      :selected-amount="selectedAmount"
      :currency-options="currencyOptions"
      :is-claiming="isClaiming"
      :is-success-visible="isSuccessVisible"
      @claim="claimCurrentGift"
      @close="closeDialog"
    />
  </ClientOnly>
</template>
```

- [ ] **Step 3: 加入 idle animation**

Append style:

```vue
<style scoped>
:deep(.claim-gift-floating-button) {
  animation: claim-gift-float 2.6s ease-in-out infinite;
}

@keyframes claim-gift-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.02);
  }
}
</style>
```

## Task 7: 掛載到 R017 default layout

**Files:**
- Modify: `apps/r017/src/layouts/default.vue`

- [ ] **Step 1: 在 layout template 掛載浮動入口**

Modify `apps/r017/src/layouts/default.vue` near the existing dialogs:

```vue
    <MobileBottomNav />

    <ClaimGiftFloatingEntry />

    <!-- 登入彈窗 -->
    <LoginDialog v-model:visible="isLoginVisible" @close="handleDialogClose" />
```

Expected behavior:

- Guest-only route does not show floating entry because `useClaimGift` checks route group.
- Logged-in mock mode with gifts shows floating entry globally inside the layout.

## Task 8: 自我檢查與授權後驗證

**Files:**
- Read: `docs/superpowers/specs/2026-06-11-claim-gift-design.md`
- Read: `docs/superpowers/plans/2026-06-11-claim-gift.md`

- [ ] **Step 1: 檢查未完成標記**

Run:

```bash
rg -n "T[B]D|T[O]DO|F[I]XME" docs/superpowers/plans/2026-06-11-claim-gift.md
```

Expected: no output.

- [ ] **Step 2: 檢查 markdown diff 空白問題**

Run:

```bash
git --no-pager diff --check -- docs/superpowers/plans/2026-06-11-claim-gift.md
```

Expected: no output.

- [ ] **Step 3: RD 授權後執行 focused validation**

Only after RD authorization, run the relevant focused commands:

```bash
pnpm nx lint r017
pnpm nx build r017
```

Expected:

- lint command exits `0` if target exists.
- build command exits `0`.
- If a target is missing, report the missing target and do not guess an alternative full-repo command.

- [ ] **Step 4: RD 授權後執行 browser smoke test**

Only after RD authorization and a running dev server:

- Logged-out route `/login` does not show the floating gift button.
- Logged-in or mocked login state with `NUXT_PUBLIC_SHOW_MOCK_DATA=true` shows floating gift button.
- Badge shows gift count.
- Dragging moves the button and refresh preserves position.
- Click opens `ClaimGiftDialog`.
- Currency selector changes read-only amount.
- Claim success decrements badge and advances to next gift.
- No-gift state hides floating button.

## Self-Review

- Spec coverage: Tasks 1, 3, 4, 6, and 7 cover API, mock, dialog, floating entry, route visibility, badge count, currency handling, and success flow. Task 2 covers the shared draggable floating primitive. Task 5 covers the RD-provided gift asset.
- Placeholder scan: This plan uses concrete paths, component names, payload types, and commands. It does not contain unresolved implementation markers.
- Type consistency: `ClaimGiftParamsType`, `GiftList`, `Gift`, `GiftOptions`, `useClaimGift`, `ClaimGiftDialog`, and `BaseFloatingAction` names are consistent across tasks.
