import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

export type CurrencySupportWalletCard = {
  currencyId: number
  currencyCode: string
  currencyLabel: string
  walletType: WALLET_TYPE.Enums
  labelKey: string
  balance: string | number
  isActive: boolean
  isSelected: boolean
  isCash: boolean
  isDisabled: boolean
  wallet: Response.UserWallet | null
}

export type CurrencySupportWalletGroup = {
  value: string
  currencyCode: string
  hasOnlyCash: boolean
  cards: CurrencySupportWalletCard[]
}

type CurrencyWalletMap = Partial<Record<WALLET_TYPE.Enums, Response.UserWallet>>

const walletTypeOrder: WALLET_TYPE.Enums[] = [WALLET_TYPE.Enums.Cash, WALLET_TYPE.Enums.Reward, WALLET_TYPE.Enums.Bonus]

export function useCurrencySupportDialog() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { currencySupportDialog, openGame } = useGame()
  const { isCash } = useEnv()
  const { moneyFormat } = useCommon()
  const { userWalletMap, activeWalletCurrencyCode, setUserActiveWallet, getWalletLabel } = useUserInfo()

  const selectedWallet = ref<Response.UserWallet | null>(null)

  const allowedWalletTypeOrder = computed<WALLET_TYPE.Enums[]>(() => {
    if (!currencySupportDialog.allowedWalletTypes?.length) return walletTypeOrder

    return walletTypeOrder.filter((walletType) => currencySupportDialog.allowedWalletTypes?.includes(walletType))
  })

  const supportedWalletTypeOrder = computed<WALLET_TYPE.Enums[]>(() => {
    if (!currencySupportDialog.bonusSupport) {
      return allowedWalletTypeOrder.value.filter((walletType) => walletType === WALLET_TYPE.Enums.Cash)
    }

    return allowedWalletTypeOrder.value
  })

  const getCurrencyWallets = (currencyCode: string): CurrencyWalletMap => userWalletMap.value[currencyCode] ?? {}

  const getCurrencyLabel = (currencyCode: string, wallets: Response.UserWallet[]): string => {
    const firstWallet = wallets[0]

    if (!firstWallet) return currencyCode

    return getWalletLabel(firstWallet)
  }

  const isWalletSelected = (wallet: Response.UserWallet | null): boolean => {
    if (!wallet || !selectedWallet.value) return false

    return (
      selectedWallet.value.currency_id === wallet.currency_id && selectedWallet.value.wallet_type === wallet.wallet_type
    )
  }

  const createWalletCard = (
    wallet: Response.UserWallet,
    currencyCode: string,
    currencyLabel: string
  ): CurrencySupportWalletCard => {
    const isCashWallet = wallet.wallet_type === WALLET_TYPE.Enums.Cash

    return {
      currencyId: wallet.currency_id,
      currencyCode,
      currencyLabel,
      walletType: wallet.wallet_type,
      labelKey: WALLET_TYPE.I18nKeys[wallet.wallet_type],
      balance: moneyFormat(wallet.balance || "0", 0),
      isActive: wallet.in_use,
      isSelected: isWalletSelected(wallet),
      isCash: isCashWallet,
      isDisabled: false,
      wallet,
    }
  }

  const createDisabledWalletCard = (currencyCode: string): CurrencySupportWalletCard => {
    return {
      currencyId: 0,
      currencyCode,
      currencyLabel: currencyCode,
      walletType: WALLET_TYPE.Enums.Cash,
      labelKey: WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Cash],
      balance: t("game.no_enable"),
      isActive: false,
      isSelected: false,
      isCash: true,
      isDisabled: true,
      wallet: null,
    }
  }

  const walletGroups = computed<CurrencySupportWalletGroup[]>(() => {
    return currencySupportDialog.currencies.map((currencyCode) => {
      const walletMap = getCurrencyWallets(currencyCode)
      const orderedWallets = supportedWalletTypeOrder.value
        .map((walletType) => walletMap[walletType])
        .filter((wallet): wallet is Response.UserWallet => Boolean(wallet))
      const currencyLabel = getCurrencyLabel(currencyCode, orderedWallets)
      const cards =
        orderedWallets.length > 0
          ? orderedWallets.map((wallet) => createWalletCard(wallet, currencyCode, currencyLabel))
          : [createDisabledWalletCard(currencyCode)]
      const hasOnlyCash = cards.length === 1 && cards[0].walletType === WALLET_TYPE.Enums.Cash

      return {
        value: currencyCode,
        currencyCode: currencyLabel,
        hasOnlyCash,
        cards,
      }
    })
  })

  const selectableCards = computed<CurrencySupportWalletCard[]>(() => {
    return walletGroups.value.flatMap((group) => group.cards).filter((card) => !card.isDisabled && Boolean(card.wallet))
  })

  const walletSignature = computed((): string => {
    return selectableCards.value
      .map((card) => `${card.currencyId}:${card.walletType}:${card.currencyCode}:${card.isActive}:${card.balance}`)
      .join("|")
  })

  const findSelectedWalletCard = (wallet: Response.UserWallet | null): CurrencySupportWalletCard | undefined => {
    if (!wallet) return undefined

    return selectableCards.value.find(
      (card) => card.currencyId === wallet.currency_id && card.walletType === wallet.wallet_type
    )
  }

  const resolveRequestedWalletCard = (): CurrencySupportWalletCard | undefined => {
    const walletType = currencySupportDialog.walletType

    if (!walletType) return undefined

    const activeCurrencyWallet = selectableCards.value.find(
      (card) => card.currencyCode === activeWalletCurrencyCode.value && card.walletType === walletType
    )

    if (activeCurrencyWallet) return activeCurrencyWallet

    return selectableCards.value.find((card) => card.walletType === walletType)
  }

  const resolveInitialWallet = (): Response.UserWallet | null => {
    const currentSelectedCard = findSelectedWalletCard(selectedWallet.value)

    if (currentSelectedCard?.wallet) return currentSelectedCard.wallet

    const requestedWalletCard = resolveRequestedWalletCard()

    if (requestedWalletCard?.wallet) return requestedWalletCard.wallet

    const activeWalletCard = selectableCards.value.find((card) => card.isActive)

    if (activeWalletCard?.wallet) return activeWalletCard.wallet

    return selectableCards.value[0]?.wallet ?? null
  }

  const selectWallet = (card: CurrencySupportWalletCard): void => {
    if (card.isDisabled || !card.wallet) return

    selectedWallet.value = card.wallet
  }

  const notifyPleaseUseCurrency = (): void => {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: t("common.alarm.pleaseUseCurrency"),
      badgeStyle: "opacity: 0",
    })
  }

  const handlePlayNowClick = async (): Promise<void> => {
    if (!isCash.value || !selectedWallet.value) {
      notifyPleaseUseCurrency()
      return
    }

    const wallet = selectedWallet.value
    await setUserActiveWallet({ currency_id: wallet.currency_id, wallet_type: wallet.wallet_type })
    currencySupportDialog.closeDialog(false)

    if (!currencySupportDialog.reOpenGame) return

    openGame(
      currencySupportDialog.integrationId,
      currencySupportDialog.productCode,
      currencySupportDialog.gameCode,
      undefined,
      false,
      wallet.currency_code,
      undefined,
      false,
      wallet.wallet_type
    )
  }

  const handleCancelClick = (): void => {
    if (!currencySupportDialog.isAllowSkip) return

    currencySupportDialog.closeDialog(true)
  }

  watch(
    [
      () => currencySupportDialog.show,
      () => currencySupportDialog.walletType,
      () => currencySupportDialog.allowedWalletTypes?.join("|"),
      () => currencySupportDialog.bonusSupport,
      () => walletSignature.value,
    ],
    () => {
      if (!currencySupportDialog.show) {
        selectedWallet.value = null
        return
      }

      selectedWallet.value = resolveInitialWallet()
    },
    { immediate: true }
  )

  return {
    currencySupportDialog,
    isCash,
    walletGroups,
    selectedWallet,
    selectWallet,
    isWalletSelected,
    handlePlayNowClick,
    handleCancelClick,
  }
}
