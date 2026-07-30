import { computed, ref, watch, type ComputedRef, type Ref } from "vue"
import { useUserWalletList } from "@shared-lib/api/hooks/useUserWalletList"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { useWalletStore } from "@shared-lib/stores/wallet"

interface UseCurrencyInfoOptions {
  enabled?: boolean | Ref<boolean> | ComputedRef<boolean>
}

const sharedSelectedCurrencyCode = ref<string>("")

export const useCurrencyInfo = (options?: UseCurrencyInfoOptions) => {
  const walletStore = useWalletStore()
  const { userWalletList, isLoading, refetch } = useUserWalletList({
    options: {
      enabled: options?.enabled ?? true
    }
  })

  const selectedCurrencyCode = sharedSelectedCurrencyCode

  watch(
    userWalletList,
    (list) => {
      if (!list) return
      walletStore.setWalletList(list)

      if (!selectedCurrencyCode.value) {
        const inUse = list.find((item) => item.in_use)
        selectedCurrencyCode.value = inUse?.currency_code || list[0]?.currency_code || ""
      }
    },
    { immediate: true }
  )

  const walletList = computed(() => walletStore.walletList)

  const selectedWallet = computed<UserWalletItem | null>(() => {
    if (!walletList.value.length) return null
    return (
      walletList.value.find((item) => item.currency_code === selectedCurrencyCode.value) || walletList.value[0] || null
    )
  })

  const walletOptions = computed(() => {
    return walletList.value.map((item) => ({
      label: `${item.currency_code}`,
      value: item.currency_code,
      currencyCode: item.currency_code,
      currencyId: item.currency_id,
      balance: item.balance
    }))
  })

  return {
    walletList,
    walletOptions,
    selectedWallet,
    selectedCurrencyCode,
    isLoading,
    refetch
  }
}
