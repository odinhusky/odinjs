import { computed, ref, unref, watch, type ComputedRef, type Ref } from "vue"
import { useI18n, useNuxtApp, useRoute, useRuntimeConfig } from "#imports"
import { useGiftList } from "../api/hooks/useGiftList"
import { useUserWalletList } from "../api/hooks/useUserWalletList"
import { useClaimGift as useClaimGiftMutation } from "../api/hooks/useClaimGift"
import { useAuth } from "./useAuth"
import { AUTH_ROUTE_GROUPS, ROUTE_PATH } from "../constants/routePath"
import { CLAIM_GIFT_TYPE_ENUMS } from "../constants/enums/claimGiftType"
import { TOAST_SEVERITY_ENUMS } from "../constants/enums/toast"
import { WALLET_TYPE_ENUMS } from "../constants/enums/walletType"
import type { Gift, GiftList, GiftOptions } from "../api/apiFunctions/gift_getGiftList"
import type { ClaimGiftParamsType } from "../api/apiFunctions/gift_claimGift"

export interface ClaimGiftMockAdapter {
  ensureInitialized: () => void
  getGiftList: () => GiftList
  claimGift: (payload: ClaimGiftParamsType) => void | Promise<void>
}

export interface UseClaimGiftFlowOptions {
  storageKey: string
  hiddenRoutePaths?: string[]
  mockAdapter?: ClaimGiftMockAdapter
  useMockData?: boolean | Ref<boolean> | ComputedRef<boolean>
}

const parseEnvBoolean = (value: unknown) => String(value).toLowerCase() === "true"

const formatGiftAmount = (amount: string | number | undefined): string => {
  if (amount === undefined || amount === "") return "0"

  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) return String(amount)

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(numericAmount)
}

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

export const useClaimGiftFlow = (options: UseClaimGiftFlowOptions) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const auth = useAuth()
  const { t } = useI18n()
  const nuxtApp = useNuxtApp()

  const defaultMockFlag = computed(() =>
    parseEnvBoolean((runtimeConfig.public as Record<string, unknown>).SHOW_MOCK_DATA)
  )
  const shouldUseMockData = computed(() => {
    if (options.useMockData === undefined) return defaultMockFlag.value
    return Boolean(unref(options.useMockData))
  })

  const { giftList, isLoading, refetch: refetchGiftList } = useGiftList({
    options: {
      enabled: computed(() => Boolean(auth.access_token) && !shouldUseMockData.value)
    }
  })
  const { refetch: refetchWalletList } = useUserWalletList({
    options: {
      enabled: computed(() => Boolean(auth.access_token) && !shouldUseMockData.value)
    }
  })
  const { claim, isPending: isClaimMutationPending } = useClaimGiftMutation()

  const isDialogVisible = ref(false)
  const selectedCurrency = ref("")
  const isSuccessVisible = ref(false)
  const claimedAmount = ref("")
  const claimedCurrency = ref("")
  const successGift = ref<Gift>()
  const isClaimProcessing = ref(false)

  const isLoggedIn = computed(() => Boolean(auth.access_token))
  const hiddenRoutePaths = computed(() => [
    ...AUTH_ROUTE_GROUPS.GUEST_ONLY_ROUTES,
    ROUTE_PATH.FORGOT_PASS,
    ...(options.hiddenRoutePaths ?? [])
  ])
  const isHiddenRoute = computed(() =>
    hiddenRoutePaths.value.some((path) => route.path === path || route.path.startsWith(`${path}/`))
  )

  const sourceGiftList = computed<GiftList>(() => {
    if (shouldUseMockData.value && options.mockAdapter) {
      options.mockAdapter.ensureInitialized()
      return options.mockAdapter.getGiftList()
    }

    return giftList.value ?? []
  })

  const normalizedGiftList = computed(() => normalizeGiftList(sourceGiftList.value))
  const currentGift = computed(() => normalizedGiftList.value[0])
  const displayGift = computed(() => (isSuccessVisible.value && successGift.value ? successGift.value : currentGift.value))
  const badgeCount = computed(() => normalizedGiftList.value.length)
  const shouldShowFloatingEntry = computed(() => isLoggedIn.value && !isHiddenRoute.value && badgeCount.value > 0)
  const isClaiming = computed(() => isClaimMutationPending.value || isClaimProcessing.value)

  const currencyOptions = computed(() => {
    const seen = new Set<string>()
    return (displayGift.value?.options ?? []).reduce<Array<{ label: string; value: string }>>((result, option) => {
      if (seen.has(option.currency_code)) return result
      seen.add(option.currency_code)
      result.push({ label: option.currency_code, value: option.currency_code })
      return result
    }, [])
  })

  watch(
    currentGift,
    (gift) => {
      if (isSuccessVisible.value) return
      selectedCurrency.value = gift?.options[0]?.currency_code || ""
    },
    { immediate: true }
  )

  const selectedOption = computed(() => getFirstOptionForCurrency(displayGift.value, selectedCurrency.value))
  const selectedAmount = computed(() => selectedOption.value?.amount || "0")
  const selectedAmountDisplay = computed(() => formatGiftAmount(selectedAmount.value))
  const claimedAmountDisplay = computed(() => formatGiftAmount(claimedAmount.value))

  const giftTypeLabel = computed(() => {
    if (Number(displayGift.value?.type) === CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY) {
      return t("gift_type.birthday")
    }
    return t("gift_type.level_up")
  })
  const walletTypeLabel = computed(() => {
    if (Number(displayGift.value?.wallet_type) === WALLET_TYPE_ENUMS.REWARD) {
      return t("common.gift_wallet")
    }
    if (Number(displayGift.value?.wallet_type) === WALLET_TYPE_ENUMS.BONUS) {
      return t("walletType.vault")
    }
    return t("common.cash_wallet")
  })

  const showSuccess = () => {
    isSuccessVisible.value = true
  }

  const resetClaimStage = () => {
    isSuccessVisible.value = false
    successGift.value = undefined
    claimedAmount.value = ""
    claimedCurrency.value = ""
    selectedCurrency.value = currentGift.value?.options[0]?.currency_code || ""
  }

  const openDialog = () => {
    if (!shouldShowFloatingEntry.value) return
    isDialogVisible.value = true
  }

  function closeDialog() {
    isDialogVisible.value = false
    resetClaimStage()
  }

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

  const notifyClaimSuccess = () => {
    ;(nuxtApp as any).$appToast?.(t("common.alarm.successfullyClaimed"), {
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: t("process_status.success"),
      life: 2200
    })
  }

  const finishClaim = () => {
    if (normalizedGiftList.value.length > 0) {
      resetClaimStage()
      return
    }

    closeDialog()
  }

  const confirmSuccess = async () => {
    const payload = buildClaimPayload()
    if (!payload || isClaiming.value) return false

    isClaimProcessing.value = true

    try {
      claimedAmount.value = selectedOption.value?.amount || selectedAmount.value
      claimedCurrency.value = selectedOption.value?.currency_code || selectedCurrency.value

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
    } finally {
      isClaimProcessing.value = false
    }
  }

  const claimCurrentGift = () => {
    if (!currentGift.value || isClaiming.value) return false

    successGift.value = {
      ...currentGift.value,
      options: [...currentGift.value.options]
    }
    claimedAmount.value = ""
    claimedCurrency.value = ""
    showSuccess()
    return true
  }

  return {
    storageKey: options.storageKey,
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
    selectedAmountDisplay,
    claimedAmountDisplay,
    claimedCurrency,
    giftTypeLabel,
    walletTypeLabel,
    openDialog,
    closeDialog,
    confirmSuccess,
    claimCurrentGift
  }
}
