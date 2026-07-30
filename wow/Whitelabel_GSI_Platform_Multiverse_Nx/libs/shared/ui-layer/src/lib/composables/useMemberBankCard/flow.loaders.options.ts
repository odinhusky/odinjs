import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { MOCK_BANK_OPTIONS_BY_TYPE, MOCK_CRYPTO_OPTIONS, MOCK_PAYMENT_GATEWAYS } from "./constants"
import {
  isEWalletType,
  normalizeCurrencyOptions,
  normalizeEwalletProviderOptions,
  normalizeGatewayGroups,
  normalizeTypeOptionsFromGateways
} from "./utils"
import type { CreateMemberBankCardFlowParams } from "./flow.types"
import type { PaymentGatewayOption } from "./types"

export const createMemberBankCardOptionLoaders = (params: CreateMemberBankCardFlowParams) => {
  let hasLoadedEwalletProviderOptions = false
  let ewalletProviderOptionsPromise: Promise<void> | null = null

  const ensureHeaderCurrenciesLoaded = async () => {
    if (params.walletList.value.length > 0) return true
    try {
      await params.refetchWalletList()
      return true
    } catch {
      return false
    }
  }

  const loadCurrencyOptions = () => {
    params.availableCurrencies.value = normalizeCurrencyOptions(params.walletList.value)
    params.currencyOptions.value = params.availableCurrencies.value.map((item) => ({
      label: item.code,
      value: item.code
    }))
  }

  const loadPaymentTypes = async () => {
    let gateways: PaymentGatewayOption[] = []

    try {
      const response = await params.fetchPlayerPaymentGatewayGroups()
      gateways = normalizeGatewayGroups(response.data || [], params.walletList.value)
    } catch {
      gateways = []
    }

    params.allGateways.value = gateways.length > 0 ? gateways : MOCK_PAYMENT_GATEWAYS
    params.typeOptions.value = normalizeTypeOptionsFromGateways(params.allGateways.value, params.translate)

    if (!params.typeOptions.value.some((item) => Number(item.value) === Number(params.form.payment_type_id))) {
      params.form.payment_type_id = Number(params.typeOptions.value[0]?.value || FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER)
    }
  }

  const loadEwalletProviderOptions = async () => {
    if (hasLoadedEwalletProviderOptions) return
    if (ewalletProviderOptionsPromise) return ewalletProviderOptionsPromise

    ewalletProviderOptionsPromise = (async () => {
      const response = await params.fetchEwalletProviders()
      if (response.isError) {
        throw response.error || new Error("getPayoutSettingsEwalletProviderList failed")
      }

      if (!Array.isArray(response.data)) {
        throw new Error("getPayoutSettingsEwalletProviderList returned invalid provider list")
      }

      params.ewalletProviders.value = response.data
      params.ewalletProviderOptions.value = normalizeEwalletProviderOptions(params.ewalletProviders.value)
      hasLoadedEwalletProviderOptions = true
    })().finally(() => {
      ewalletProviderOptionsPromise = null
    })

    return ewalletProviderOptionsPromise
  }

  const getSelectedGateway = (): PaymentGatewayOption | undefined => {
    if (params.form.payment_gateway_id) {
      const matched = params.paymentGatewayOptions.value.find(
        (item) => Number(item.value) === Number(params.form.payment_gateway_id)
      )
      if (matched) return matched
    }

    if (params.form.payout_method_id) {
      const matched = params.paymentGatewayOptions.value.find(
        (item) => Number(item.payout_method_id) === Number(params.form.payout_method_id)
      )
      if (matched) return matched
    }

    return params.paymentGatewayOptions.value[0]
  }

  const syncSelectedPayoutMethod = () => {
    const selectedGateway = getSelectedGateway()

    if (!selectedGateway) {
      params.form.payment_gateway_id = undefined
      params.form.payout_method_id = undefined
      return
    }

    params.form.payout_method_id = Number(selectedGateway.payout_method_id)

    if (params.showGatewaySelect.value) {
      params.form.payment_gateway_id = Number(selectedGateway.value)
      return
    }

    params.form.payment_gateway_id = undefined
  }

  const loadBankOptions = async () => {
    if (
      Number(params.form.payment_type_id) === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER ||
      Number(params.form.payment_type_id) === FUND_METHOD_TYPE_ENUMS.E_WALLET
    ) {
      params.bankOptions.value = []
      params.form.bank_id = undefined
      return
    }

    const payload: { payment_type_id: number; payment_gateway_id?: number } = {
      payment_type_id: Number(params.form.payment_type_id)
    }

    if (params.showGatewaySelect.value && params.form.payment_gateway_id) {
      payload.payment_gateway_id = Number(params.form.payment_gateway_id)
    }

    let list: Array<{ id: number; name: string }> = []

    try {
      list = (await params.fetchWithdrawBankList(payload)).data?.list || []
    } catch {
      list = (MOCK_BANK_OPTIONS_BY_TYPE[Number(params.form.payment_type_id)] || []).map((item) => ({
        id: Number(item.value),
        name: item.label
      }))
    }

    params.bankOptions.value = list.map((item) => ({
      label: item.name,
      value: Number(item.id)
    }))

    if (params.bankOptions.value.length === 0) {
      params.form.bank_id = undefined
      return
    }

    if (!params.bankOptions.value.some((item) => Number(item.value) === Number(params.form.bank_id))) {
      params.form.bank_id = Number(params.bankOptions.value[0].value)
    }
  }

  const loadCryptoOptions = async () => {
    if (
      Number(params.form.payment_type_id) !== FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET &&
      Number(params.form.payment_type_id) !== FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT
    ) {
      params.cryptoOptions.value = []
      params.form.crypto_id = undefined
      return
    }

    if (!params.form.currency) {
      params.cryptoOptions.value = []
      params.form.crypto_id = undefined
      return
    }

    let list: Array<{ id: number; code: string }> = []

    try {
      list = (await params.fetchWithdrawCryptoCurrency({ currency: params.form.currency })).data || []
    } catch {
      list = MOCK_CRYPTO_OPTIONS.map((item) => ({
        id: Number(item.value),
        code: item.label
      }))
    }

    params.cryptoOptions.value = list.map((item) => ({
      label: item.code,
      value: Number(item.id)
    }))

    if (params.cryptoOptions.value.length === 0) {
      params.form.crypto_id = undefined
      return
    }

    if (!params.cryptoOptions.value.some((item) => Number(item.value) === Number(params.form.crypto_id))) {
      params.form.crypto_id = Number(params.cryptoOptions.value[0].value)
    }
  }

  const syncFormOptions = async () => {
    syncSelectedPayoutMethod()

    if (isEWalletType(params.form.payment_type_id) && params.ewalletProviderOptions.value.length === 0) {
      await loadEwalletProviderOptions()
    }

    if (!isEWalletType(params.form.payment_type_id)) {
      params.form.ewallet_provider_id = undefined
    }

    await loadBankOptions()
    await loadCryptoOptions()
  }

  return {
    ensureHeaderCurrenciesLoaded,
    loadCurrencyOptions,
    loadPaymentTypes,
    loadEwalletProviderOptions,
    loadBankOptions,
    loadCryptoOptions,
    syncFormOptions,
    syncSelectedPayoutMethod
  }
}
