import { computed } from "vue"
import { useSiteStore } from "src/stores/siteStore"
import { BONUS_WALLET_TYPE } from "@/utils/constants"

export function useWalletBouns() {
  const siteStore = useSiteStore()

  const walletSwitch = computed(() => siteStore.wallet_type_list.includes(BONUS_WALLET_TYPE.Enums.REWARD))

  return { walletSwitch }
}
