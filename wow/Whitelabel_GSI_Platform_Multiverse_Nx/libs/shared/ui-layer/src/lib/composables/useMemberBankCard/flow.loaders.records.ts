import { createMockCards, mockStore } from "./mock"
import {
  createEwalletProviderNameMap,
  getPayoutSettingMethodTypeFromPaymentType,
  isEWalletType,
  toBankCardItemFromPayoutSetting
} from "./utils"
import { EWALLET_METHOD_TYPE } from "./constants"
import type { CreateMemberBankCardFlowParams } from "./flow.types"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { ApiResponse } from "@shared-lib/api/types"

interface CreateMemberBankCardRecordLoadersDeps {
  loadEwalletProviderOptions: () => Promise<void>
  loadPaymentTypes: () => Promise<void>
  syncFormOptions: () => Promise<void>
}

const createApiResponseError = <T>(response: ApiResponse<T>, requestName: string): Error => {
  const responseError = response.error as { code?: number; message?: string } | undefined
  const message = response.msg || responseError?.message || "Unknown API error"
  const code = response.code ?? responseError?.code ?? "unknown"
  return new Error(`${requestName} failed: ${message} (code: ${code})`)
}

const getSuccessfulApiData = <T>(response: ApiResponse<T>, requestName: string): T => {
  if (response.status !== true) throw createApiResponseError(response, requestName)
  if (response.data === null || response.data === undefined) {
    throw new Error(`${requestName} returned empty data`)
  }

  return response.data
}

export const createMemberBankCardRecordLoaders = (
  params: CreateMemberBankCardFlowParams,
  deps: CreateMemberBankCardRecordLoadersDeps
) => {
  const ensureMockCardsInitialized = () => {
    if (!params.shouldShowMockData.value || mockStore.initialized) return
    mockStore.cards = createMockCards(
      Number(params.resolveHeaderCurrencyId() || 0),
      params.resolveHeaderCurrencyCode() || ""
    )
    mockStore.initialized = true
  }

  const providerNameMap = () => createEwalletProviderNameMap(params.ewalletProviders.value)

  const toBankCardItem = (setting: Parameters<typeof toBankCardItemFromPayoutSetting>[0]["setting"]) => {
    return toBankCardItemFromPayoutSetting({
      setting,
      gateways: params.allGateways.value,
      providerNameMap: providerNameMap(),
      walletList: params.walletList.value
    })
  }

  const applyBankCardItemToForm = async (id: number, card: BankCardItemType) => {
    params.form.id = id
    params.form.currency = card.currency_code || params.resolveHeaderCurrencyCode()
    params.form.payment_type_id = Number(card.payment_type_id)
    params.form.payment_gateway_id = Number(card.payment_gateway_id || 0) || undefined
    params.form.payout_method_id = Number(card.payout_method_id || 0) || undefined
    params.form.ewallet_provider_id = Number(card.ewallet_provider_id || 0) || undefined
    params.form.name = card.name || ""
    params.form.bank_name = card.bank_name || ""
    params.form.account_name = card.account_name || ""
    params.form.account_number = card.account_number || ""
    params.form.bank_id = Number(card.bank_id || 0) || undefined
    params.form.crypto_id = Number(card.crypto_id || 0) || undefined
    params.form.wallet_address = card.wallet_address || ""
    await deps.syncFormOptions()
  }

  const loadCards = async () => {
    params.isLoadingBankCards.value = true
    try {
      if (params.shouldShowMockData.value) {
        ensureMockCardsInitialized()
        params.cards.value = mockStore.cards.filter(
          (item) => Number(item.payment_type_id) === Number(params.selectedType.value)
        )
        return
      }

      if (isEWalletType(Number(params.selectedType.value))) {
        await deps.loadEwalletProviderOptions()
      }

      const methodType = getPayoutSettingMethodTypeFromPaymentType(Number(params.selectedType.value))
      const response = await params.fetchPayoutSettingsList({ method_type: methodType })
      const data = getSuccessfulApiData(response, "getPayoutSettingsList")
      if (!Array.isArray(data.list)) throw new Error("getPayoutSettingsList returned invalid list")

      const cards = data.list
        .map(toBankCardItem)
        .filter((item): item is BankCardItemType => item !== null)

      params.cards.value = cards.filter((item) => Number(item.payment_type_id) === Number(params.selectedType.value))
    } finally {
      params.isLoadingBankCards.value = false
    }
  }

  const loadFormById = async (id: number) => {
    params.isLoadingForm.value = true
    try {
      if (params.shouldShowMockData.value) {
        ensureMockCardsInitialized()
        const target = mockStore.cards.find((item) => Number(item.id) === Number(id))
        if (target) await applyBankCardItemToForm(id, target)
        return
      }

      await deps.loadPaymentTypes()
      const response = await params.fetchPayoutSettings({ id })
      const setting = getSuccessfulApiData(response, "getPayoutSettings")
      if (Number(setting.method_type) === Number(EWALLET_METHOD_TYPE)) {
        await deps.loadEwalletProviderOptions()
      }

      const card = toBankCardItem(setting)
      if (!card) return

      await applyBankCardItemToForm(id, card)
    } finally {
      params.isLoadingForm.value = false
    }
  }

  return {
    ensureMockCardsInitialized,
    loadCards,
    loadFormById
  }
}
