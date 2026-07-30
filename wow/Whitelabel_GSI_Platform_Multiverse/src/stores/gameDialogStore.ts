import { defineStore } from "pinia"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { reactive } from "vue"
import type { CryptoWallet } from "src/api/response.type"
import { WALLET_TYPE } from "src/common/utils/constants"

type Dialog = {
  show: boolean
  showDialog: () => void
  closeDialog: (excuteCloseFunction?: boolean) => void
  closeFunction?: () => void
  reOpenGame?: boolean
}

type LaunchGame = Dialog & {
  gameUrl: string
  gameContent: string
}

type CryptoWalletDialogState = Dialog & {
  amount: string
  currency: string
  cryptoWallet: CryptoWallet | null
  setData: (payload: { amount: string; currency: string; cryptoWallet: CryptoWallet }) => void
}

type CurrencySupportCodeSource = string | string[] | null | undefined

type CurrencySupportDialogPayload = {
  currencies?: CurrencySupportCodeSource
  supportCurrency?: CurrencySupportCodeSource
  integrationId: number
  productCode: number
  gameCode: string
  walletType?: WALLET_TYPE.Enums
  allowedWalletTypes?: WALLET_TYPE.Enums[]
  bonusSupport?: boolean
  isAllowSkip?: boolean
  reOpenGame?: boolean
  closeFunction?: () => void
}

type CurrencySupport = Dialog & {
  currencies: string[]
  integrationId: number
  productCode: number
  gameCode: string
  walletType?: WALLET_TYPE.Enums
  allowedWalletTypes?: WALLET_TYPE.Enums[]
  bonusSupport: boolean
  isAllowSkip: boolean
  openCurrencySupportDialog: (payload: CurrencySupportDialogPayload) => void
}

const normalizeCurrencyCodes = (...sources: CurrencySupportCodeSource[]): string[] => {
  const currencyCodes = sources
    .flatMap((source) => {
      if (!source) return []

      if (Array.isArray(source)) return source

      return source.split(",")
    })
    .map((currencyCode) => currencyCode.trim())
    .filter((currencyCode) => Boolean(currencyCode))

  return [...new Set(currencyCodes)]
}

export const useGameDialogStore = defineStore("gameDialogStore", () => {
  const { getUserWalletList } = useUserInfo()

  const launchGameDialog: LaunchGame = reactive<LaunchGame>({
    show: false,
    showDialog: () => {
      launchGameDialog.show = true
    },
    closeDialog: () => {
      getUserWalletList()
      launchGameDialog.show = false
      launchGameDialog.gameUrl = ""
      launchGameDialog.gameContent = ""
    },
    gameUrl: "",
    gameContent: "",
  })
  const currencySupportDialog: CurrencySupport = reactive<CurrencySupport>({
    show: false,
    reOpenGame: true,
    showDialog: () => {
      currencySupportDialog.show = true
      currencySupportDialog.reOpenGame = true // 每次打開對話框都預設為 true
      currencySupportDialog.walletType = undefined
      currencySupportDialog.allowedWalletTypes = undefined
      currencySupportDialog.bonusSupport = true
      currencySupportDialog.isAllowSkip = true
    },
    closeDialog: (excuteCloseFunction = false) => {
      if (excuteCloseFunction && currencySupportDialog.closeFunction) {
        currencySupportDialog.closeFunction()
        currencySupportDialog.closeFunction = undefined
      }
      currencySupportDialog.show = false
    },
    openCurrencySupportDialog: (payload: CurrencySupportDialogPayload) => {
      currencySupportDialog.currencies = normalizeCurrencyCodes(payload.currencies, payload.supportCurrency)
      currencySupportDialog.integrationId = payload.integrationId
      currencySupportDialog.productCode = payload.productCode
      currencySupportDialog.gameCode = payload.gameCode
      currencySupportDialog.walletType = payload.walletType
      currencySupportDialog.allowedWalletTypes = payload.allowedWalletTypes
      currencySupportDialog.bonusSupport = payload.bonusSupport ?? true
      currencySupportDialog.isAllowSkip = payload.isAllowSkip ?? true
      currencySupportDialog.closeFunction = payload.closeFunction
      currencySupportDialog.reOpenGame = payload.reOpenGame === undefined ? true : payload.reOpenGame
      currencySupportDialog.show = true
    },
    currencies: [],
    integrationId: 0,
    productCode: 0,
    gameCode: "",
    walletType: undefined,
    allowedWalletTypes: undefined,
    bonusSupport: true,
    isAllowSkip: true,
  })

  const cryptoWalletDialog: CryptoWalletDialogState = reactive<CryptoWalletDialogState>({
    show: false,
    amount: "",
    currency: "",
    cryptoWallet: null,
    showDialog: () => {
      cryptoWalletDialog.show = true
    },
    closeDialog: () => {
      cryptoWalletDialog.show = false
      cryptoWalletDialog.amount = ""
      cryptoWalletDialog.currency = ""
      cryptoWalletDialog.cryptoWallet = null
    },
    setData: (payload) => {
      cryptoWalletDialog.amount = payload.amount
      cryptoWalletDialog.currency = payload.currency
      cryptoWalletDialog.cryptoWallet = payload.cryptoWallet
    },
  })

  return { launchGameDialog, currencySupportDialog, cryptoWalletDialog }
})
