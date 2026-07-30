import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { CreateMemberBankCardFlowParams } from "./flow.types"
import type { createMemberBankCardFlowLoaders } from "./flowLoaders"
import type { BankCardCreateSeed } from "./types"

type MemberBankCardFlowLoaders = ReturnType<typeof createMemberBankCardFlowLoaders>

export const createMemberBankCardFlowHandlers = (
  params: CreateMemberBankCardFlowParams,
  loaders: MemberBankCardFlowLoaders
) => {
  const onTypeChange = async (value: number) => {
    params.form.payment_type_id = Number(value)
    params.resetTypeRelatedFields()
    await loaders.syncFormOptions()
  }

  const onCurrencyChange = async (value: string) => {
    params.form.currency = value
    params.resetTypeRelatedFields()
    await loaders.loadPaymentTypes()
    await loaders.syncFormOptions()
  }

  const onGatewayChange = async (value?: number) => {
    params.form.payment_gateway_id = value ? Number(value) : undefined
    params.form.bank_id = undefined
    await loaders.syncFormOptions()
  }

  const handleHeaderCurrencyChange = async (currencyId?: number) => {
    const normalizedCurrencyId = Number(currencyId || 0)
    const nextCurrencyCode = params.resolveCurrencyCodeById(normalizedCurrencyId) || params.resolveHeaderCurrencyCode()
    if (!nextCurrencyCode) return

    loaders.loadCurrencyOptions()
    params.form.currency = nextCurrencyCode
    params.resetTypeRelatedFields()
    await loaders.loadPaymentTypes()
    await loaders.syncFormOptions()
  }

  const resolveInitialSelectedType = (initialPaymentTypeId?: number) => {
    const paymentTypeId = Number(initialPaymentTypeId || 0)
    if (params.typeOptions.value.some((item) => Number(item.value) === paymentTypeId)) return paymentTypeId

    return Number(params.typeOptions.value[0]?.value || FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER)
  }

  const initializeListPage = async (initialPaymentTypeId?: number) => {
    await loaders.ensureHeaderCurrenciesLoaded()
    loaders.loadCurrencyOptions()
    params.form.currency = params.resolveHeaderCurrencyCode()
    await loaders.loadPaymentTypes()
    params.selectedType.value = resolveInitialSelectedType(initialPaymentTypeId)
    if (params.shouldShowMockData.value) loaders.ensureMockCardsInitialized()
    await loaders.loadCards()
  }

  const resolveCreateCurrencyCode = (seed?: BankCardCreateSeed) => {
    if (seed?.currency && params.currencyOptions.value.some((item) => String(item.value) === seed.currency)) {
      return seed.currency
    }

    return params.resolveHeaderCurrencyCode()
  }

  const initializeCreatePage = async (seed?: BankCardCreateSeed) => {
    await loaders.ensureHeaderCurrenciesLoaded()
    loaders.loadCurrencyOptions()
    params.form.currency = resolveCreateCurrencyCode(seed)
    if (seed?.paymentTypeId) params.form.payment_type_id = Number(seed.paymentTypeId)
    await loaders.loadPaymentTypes()
    if (seed?.paymentGatewayId) params.form.payment_gateway_id = Number(seed.paymentGatewayId)
    if (seed?.payoutMethodId) params.form.payout_method_id = Number(seed.payoutMethodId)
    await loaders.syncFormOptions()
  }

  const initializeEditPage = async (id: number) => {
    await loaders.ensureHeaderCurrenciesLoaded()
    loaders.loadCurrencyOptions()
    await loaders.loadPaymentTypes()
    await loaders.loadFormById(id)
  }

  return {
    onTypeChange,
    onCurrencyChange,
    onGatewayChange,
    handleHeaderCurrencyChange,
    initializeListPage,
    initializeCreatePage,
    initializeEditPage
  }
}
