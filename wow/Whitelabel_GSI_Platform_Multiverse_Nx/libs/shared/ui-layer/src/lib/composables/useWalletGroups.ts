import { computed, type ComputedRef, type Ref } from "vue"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { WALLET_TYPE_ENUMS, WALLET_TYPE_I18N_KEYS } from "@shared-lib/constants/enums/walletType"
import { formatMoney } from "@shared-lib/utils/formatMoney"

const WALLET_CARD_ORDER: WALLET_TYPE_ENUMS[] = [
  WALLET_TYPE_ENUMS.CASH,
  WALLET_TYPE_ENUMS.REWARD,
  WALLET_TYPE_ENUMS.BONUS
]

export interface WalletCardViewModel {
  id: number
  walletId: number
  currencyId: number
  currencyCode: string
  walletType: WALLET_TYPE_ENUMS
  walletTypeLabel: string
  balance: string
  balanceLabel: string
  isActive: boolean
  canTransferOut: boolean
}

export interface WalletCurrencyGroup {
  currencyId: number
  currencyCode: string
  cards: WalletCardViewModel[]
}

interface UseWalletGroupsOptions {
  walletList: Ref<UserWalletItem[]> | ComputedRef<UserWalletItem[]>
  /** i18n translate function; if omitted, falls back to the raw i18n key. */
  t?: (key: string) => string
}

const labelForWalletType = (
  walletType: WALLET_TYPE_ENUMS,
  t?: (key: string) => string
): string => {
  const key = WALLET_TYPE_I18N_KEYS[walletType] || ""
  if (!t || !key) return key
  return t(key)
}

const buildCard = (
  wallet: UserWalletItem,
  t?: (key: string) => string
): WalletCardViewModel => {
  return {
    id: wallet.currency_id,
    walletId: wallet.currency_id,
    currencyId: wallet.currency_id,
    currencyCode: wallet.currency_code,
    walletType: wallet.wallet_type,
    walletTypeLabel: labelForWalletType(wallet.wallet_type, t),
    balance: wallet.balance,
    balanceLabel: formatMoney(wallet.balance),
    isActive: Boolean(wallet.in_use),
    canTransferOut: wallet.wallet_type === WALLET_TYPE_ENUMS.REWARD
  }
}

const groupByCurrency = (
  walletList: UserWalletItem[],
  t?: (key: string) => string
): WalletCurrencyGroup[] => {
  const groupMap = new Map<string, WalletCurrencyGroup>()

  for (const wallet of walletList) {
    if (!wallet) continue
    const key = wallet.currency_code
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        currencyId: wallet.currency_id,
        currencyCode: wallet.currency_code,
        cards: []
      })
    }
    groupMap.get(key)!.cards.push(buildCard(wallet, t))
  }

  for (const group of groupMap.values()) {
    group.cards.sort((a, b) => {
      const ai = WALLET_CARD_ORDER.indexOf(a.walletType)
      const bi = WALLET_CARD_ORDER.indexOf(b.walletType)
      return (ai < 0 ? Number.MAX_SAFE_INTEGER : ai) - (bi < 0 ? Number.MAX_SAFE_INTEGER : bi)
    })
  }

  return Array.from(groupMap.values())
}

export const useWalletGroups = (options: UseWalletGroupsOptions) => {
  const groups = computed<WalletCurrencyGroup[]>(() => groupByCurrency(options.walletList.value || [], options.t))

  const activeCard = computed<WalletCardViewModel | null>(() => {
    for (const group of groups.value) {
      const found = group.cards.find((card) => card.isActive)
      if (found) return found
    }
    return groups.value[0]?.cards[0] || null
  })

  return {
    groups,
    activeCard
  }
}
