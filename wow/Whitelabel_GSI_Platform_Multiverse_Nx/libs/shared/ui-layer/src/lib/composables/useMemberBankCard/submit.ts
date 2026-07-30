import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { PostPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_postPayoutSettings"
import type { PutPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_putPayoutSettings"
import type { ComputedRef, Ref } from "vue"
import { EWALLET_METHOD_TYPE } from "./constants"
import type { PutPayoutSettingsBodyType } from "./form"
import { mockStore } from "./mock"
import type { BankCardFormState, PaymentGatewayOption } from "./types"

interface CreateMemberBankCardSubmitParams {
  shouldShowMockData: ComputedRef<boolean>
  form: BankCardFormState
  allGateways: Ref<PaymentGatewayOption[]>
  ensureMockCardsInitialized: () => void
  resolveCurrencyIdByCode: (currencyCode?: string) => number | undefined
  resolveHeaderCurrencyId: () => number | undefined
  buildCreatePayload: () => PostPayoutSettingsParamsType
  buildUpdatePayload: () => PutPayoutSettingsBodyType
  isValidForm: () => boolean
  createPayoutSettings: (payload: PostPayoutSettingsParamsType) => Promise<unknown>
  updatePayoutSettings: (payload: PutPayoutSettingsParamsType) => Promise<unknown>
  removePayoutSettings: (payload: { id: number }) => Promise<unknown>
  invalidateBankCardListQuery: () => Promise<void>
  pushToast: (payload: { severity: TOAST_SEVERITY_ENUMS; summary: string; detail: string; life: number }) => void
}

const getGatewayByPayoutMethod = (
  gateways: PaymentGatewayOption[],
  payoutMethodId: number
): PaymentGatewayOption | undefined => {
  return gateways.find((item) => Number(item.payout_method_id) === Number(payoutMethodId))
}

const createMockCardFromPayload = ({
  id,
  form,
  payload,
  gateway,
  currencyId
}: {
  id: number
  form: BankCardFormState
  payload: PostPayoutSettingsParamsType
  gateway?: PaymentGatewayOption
  currencyId: number
}): BankCardItemType => {
  const settingPayload = payload.payload || {}
  const isEWallet = payload.method_type === EWALLET_METHOD_TYPE

  return {
    id,
    name: payload.name || "",
    bank_name: isEWallet ? String(form.ewallet_provider_id || "") : settingPayload.bank_name || settingPayload.chain || "",
    account_number: settingPayload.account_number || "",
    account_name: settingPayload.account_name || "",
    currency_id: currencyId,
    payment_type_id: Number(form.payment_type_id),
    payment_gateway_id: Number(gateway?.value || 0) || undefined,
    payment_gateway_name: gateway?.label,
    payout_method_id: payload.payout_method_id,
    ewallet_provider_id: payload.ewallet_provider_id || undefined,
    ewallet_provider_name: isEWallet ? String(form.ewallet_provider_id || "") : undefined,
    pg_code: gateway?.pg_code,
    currency_code: form.currency,
    branch: "",
    bank_id: Number(settingPayload.bank_id || 0),
    crypto_id: Number(settingPayload.crypto_id || 0) || undefined,
    deleted: false,
    created_at: new Date().toISOString(),
    chain: settingPayload.chain || "",
    currency_brand: "",
    crypto_rate: 0,
    wallet_address: settingPayload.wallet_address || ""
  }
}

export const createMemberBankCardSubmit = (params: CreateMemberBankCardSubmitParams) => {
  const submitCreate = async (): Promise<number | false> => {
    if (!params.isValidForm()) return false

    const payload = params.buildCreatePayload()

    if (params.shouldShowMockData.value) {
      params.ensureMockCardsInitialized()
      mockStore.lastId += 1

      const gateway = getGatewayByPayoutMethod(params.allGateways.value, Number(payload.payout_method_id))
      const newCard = createMockCardFromPayload({
        id: mockStore.lastId,
        form: params.form,
        payload,
        gateway,
        currencyId: Number(params.resolveCurrencyIdByCode(params.form.currency) || params.resolveHeaderCurrencyId() || 0)
      })

      mockStore.cards = [newCard, ...mockStore.cards]

      if (payload.payload.crypto_id) {
        mockStore.cryptoIds[newCard.id] = Number(payload.payload.crypto_id)
      }
    } else {
      await params.createPayoutSettings(payload)
    }

    await params.invalidateBankCardListQuery()

    params.pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "新增銀行卡成功",
      life: 2200
    })

    return Number(params.form.payment_type_id)
  }

  const submitEdit = async (): Promise<number | false> => {
    if (!params.isValidForm() || !params.form.id) return false

    const payload = params.buildUpdatePayload()

    if (params.shouldShowMockData.value) {
      const index = mockStore.cards.findIndex((item) => Number(item.id) === Number(params.form.id))

      if (index >= 0) {
        const target = mockStore.cards[index]
        const settingPayload = payload.payload || {}

        mockStore.cards[index] = {
          ...target,
          name: payload.name || "",
          bank_name: settingPayload.bank_name || settingPayload.chain || "",
          account_name: settingPayload.account_name || "",
          account_number: settingPayload.account_number || "",
          ewallet_provider_id: payload.ewallet_provider_id || undefined,
          ewallet_provider_name: payload.ewallet_provider_id ? String(payload.ewallet_provider_id) : undefined,
          bank_id: Number(settingPayload.bank_id || 0),
          crypto_id: Number(settingPayload.crypto_id || 0) || undefined,
          wallet_address: settingPayload.wallet_address || "",
          chain: settingPayload.chain || ""
        }

        if (settingPayload.crypto_id) {
          mockStore.cryptoIds[params.form.id] = Number(settingPayload.crypto_id)
        }
      }
    } else {
      await params.updatePayoutSettings({ id: Number(params.form.id), ...payload })
    }

    await params.invalidateBankCardListQuery()

    params.pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "編輯銀行卡成功",
      life: 2200
    })

    return Number(params.form.payment_type_id)
  }

  const submitDelete = async (id: number) => {
    if (params.shouldShowMockData.value) {
      params.ensureMockCardsInitialized()
      mockStore.cards = mockStore.cards.filter((item) => Number(item.id) !== Number(id))
      delete mockStore.cryptoIds[id]
    } else {
      await params.removePayoutSettings({ id })
      await params.invalidateBankCardListQuery()
    }

    params.pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      summary: "Success",
      detail: "刪除銀行卡成功",
      life: 2200
    })
  }

  return {
    submitCreate,
    submitEdit,
    submitDelete
  }
}
