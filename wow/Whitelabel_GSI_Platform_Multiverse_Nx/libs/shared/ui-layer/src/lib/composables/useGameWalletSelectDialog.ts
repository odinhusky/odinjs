import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { formatMoney } from "@shared-lib/utils/formatMoney"

export interface GameWalletSelection {
  currencyCode: string
  currencyId: number
  walletType: WALLET_TYPE_ENUMS
}

export interface GameWalletOption {
  currencyCode: string
  currencyId: number
  walletType: WALLET_TYPE_ENUMS
  walletTypeLabel: string
  balanceLabel: string
}

export interface GameWalletCurrencyGroup {
  currencyCode: string
  currencyId: number
  options: GameWalletOption[]
}

interface OpenPayload {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  groups: GameWalletCurrencyGroup[]
  defaultSelection: GameWalletSelection | null
  onConfirm: (selection: GameWalletSelection) => void | Promise<void>
}

interface DialogState {
  visible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  groups: GameWalletCurrencyGroup[]
  selectedCurrencyCode: string
  selectedWalletType: WALLET_TYPE_ENUMS | null
  selectedCurrencyId: number
}

const STATE_KEY = "r017-game-wallet-select-dialog-state"

const createInitialState = (): DialogState => ({
  visible: false,
  title: "",
  message: "",
  confirmText: "",
  cancelText: "",
  groups: [],
  selectedCurrencyCode: "",
  selectedWalletType: null,
  selectedCurrencyId: 0
})

let confirmHandler: ((selection: GameWalletSelection) => void | Promise<void>) | null = null

const WALLET_OPTION_ORDER: WALLET_TYPE_ENUMS[] = [
  WALLET_TYPE_ENUMS.CASH,
  WALLET_TYPE_ENUMS.REWARD,
  WALLET_TYPE_ENUMS.BONUS
]

export const buildGameWalletGroups = (
  supportedCurrencyCodes: string[],
  walletList: UserWalletItem[],
  walletLabelFor: (walletType: WALLET_TYPE_ENUMS) => string
): GameWalletCurrencyGroup[] => {
  return supportedCurrencyCodes
    .map((code) => {
      const matched = walletList.filter((wallet) => wallet.currency_code === code)
      if (!matched.length) {
        return {
          currencyCode: code,
          currencyId: 0,
          options: []
        }
      }
      const options: GameWalletOption[] = matched
        .map((wallet) => ({
          currencyCode: wallet.currency_code,
          currencyId: wallet.currency_id,
          walletType: wallet.wallet_type,
          walletTypeLabel: walletLabelFor(wallet.wallet_type),
          balanceLabel: formatMoney(wallet.balance)
        }))
        .sort((a, b) => {
          const ai = WALLET_OPTION_ORDER.indexOf(a.walletType)
          const bi = WALLET_OPTION_ORDER.indexOf(b.walletType)
          return (ai < 0 ? Number.MAX_SAFE_INTEGER : ai) - (bi < 0 ? Number.MAX_SAFE_INTEGER : bi)
        })

      return {
        currencyCode: code,
        currencyId: matched[0]!.currency_id,
        options
      }
    })
    .filter((group) => group.options.length > 0)
}

export const resolveDefaultSelection = (
  groups: GameWalletCurrencyGroup[],
  activeCurrencyCode: string
): GameWalletSelection | null => {
  if (!groups.length) return null

  const activeMatch = groups.find((g) => g.currencyCode === activeCurrencyCode)
  if (activeMatch) {
    const cash = activeMatch.options.find((o) => o.walletType === WALLET_TYPE_ENUMS.CASH)
    const target = cash || activeMatch.options[0]
    if (target) {
      return {
        currencyCode: target.currencyCode,
        currencyId: target.currencyId,
        walletType: target.walletType
      }
    }
  }

  const first = groups[0]
  if (!first) return null
  const cash = first.options.find((o) => o.walletType === WALLET_TYPE_ENUMS.CASH) || first.options[0]
  if (!cash) return null
  return {
    currencyCode: cash.currencyCode,
    currencyId: cash.currencyId,
    walletType: cash.walletType
  }
}

export const useGameWalletSelectDialog = () => {
  const state = useState<DialogState>(STATE_KEY, createInitialState)

  const openGameWalletSelectDialog = (payload: OpenPayload) => {
    const def = payload.defaultSelection
    state.value = {
      visible: true,
      title: payload.title || "",
      message: payload.message || "",
      confirmText: payload.confirmText || "",
      cancelText: payload.cancelText || "",
      groups: payload.groups,
      selectedCurrencyCode: def?.currencyCode || "",
      selectedWalletType: def ? def.walletType : null,
      selectedCurrencyId: def?.currencyId || 0
    }
    confirmHandler = payload.onConfirm
  }

  const closeGameWalletSelectDialog = () => {
    state.value = createInitialState()
    confirmHandler = null
  }

  const setSelection = (option: GameWalletOption) => {
    state.value.selectedCurrencyCode = option.currencyCode
    state.value.selectedCurrencyId = option.currencyId
    state.value.selectedWalletType = option.walletType
  }

  const confirmGameWalletSelectDialog = async () => {
    if (state.value.selectedWalletType === null) {
      closeGameWalletSelectDialog()
      return
    }
    const selection: GameWalletSelection = {
      currencyCode: state.value.selectedCurrencyCode,
      currencyId: state.value.selectedCurrencyId,
      walletType: state.value.selectedWalletType
    }
    const handler = confirmHandler
    closeGameWalletSelectDialog()
    if (handler) {
      await handler(selection)
    }
  }

  return {
    state,
    openGameWalletSelectDialog,
    closeGameWalletSelectDialog,
    setSelection,
    confirmGameWalletSelectDialog
  }
}
