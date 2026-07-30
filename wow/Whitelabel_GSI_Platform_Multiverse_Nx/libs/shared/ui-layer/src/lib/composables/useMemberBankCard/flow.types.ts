import type { EwalletProvider } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsEwalletProviderList"
import type { GetPayoutSettingsResponseType } from "@shared-lib/api/apiFunctions/bank_getPayoutSettings"
import type {
  GetPayoutSettingsListParamsType,
  GetPayoutSettingsListResponseType
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { PlayerPaymentGatewayGroupItem } from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import type { ApiResponse } from "@shared-lib/api/types"
import type { ComputedRef, Ref } from "vue"
import type { BankCardFormState, CurrencyOption, OptionItem, PaymentGatewayOption } from "./types"

export interface CreateMemberBankCardFlowParams {
  shouldShowMockData: ComputedRef<boolean>
  form: BankCardFormState
  cards: Ref<BankCardItemType[]>
  selectedType: Ref<number>
  typeOptions: Ref<OptionItem[]>
  currencyOptions: Ref<OptionItem[]>
  bankOptions: Ref<OptionItem[]>
  cryptoOptions: Ref<OptionItem[]>
  ewalletProviders: Ref<EwalletProvider[]>
  ewalletProviderOptions: Ref<OptionItem[]>
  allGateways: Ref<PaymentGatewayOption[]>
  availableCurrencies: Ref<CurrencyOption[]>
  paymentGatewayOptions: ComputedRef<PaymentGatewayOption[]>
  showGatewaySelect: ComputedRef<boolean>
  translate: (key: string) => string
  walletList: Ref<UserWalletItem[]>
  refetchWalletList: () => Promise<unknown>
  isLoadingBankCards: Ref<boolean>
  isLoadingForm: Ref<boolean>
  fetchPlayerPaymentGatewayGroups: () => Promise<{ data?: PlayerPaymentGatewayGroupItem[] }>
  fetchEwalletProviders: () => Promise<{ data?: EwalletProvider[]; error?: Error | null; isError?: boolean }>
  fetchWithdrawBankList: (params: {
    payment_type_id: number
    payment_gateway_id?: number
  }) => Promise<{ data?: { list?: Array<{ id: number; name: string }> } }>
  fetchWithdrawCryptoCurrency: (params: { currency: string }) => Promise<{ data?: Array<{ id: number; code: string }> }>
  fetchPayoutSettingsList: (
    params: GetPayoutSettingsListParamsType
  ) => Promise<ApiResponse<GetPayoutSettingsListResponseType>>
  fetchPayoutSettings: (params: { id: number }) => Promise<ApiResponse<GetPayoutSettingsResponseType>>
  resolveCurrencyCodeById: (currencyId?: number) => string
  resolveCurrencyIdByCode: (currencyCode?: string) => number | undefined
  resolveHeaderCurrencyCode: () => string
  resolveHeaderCurrencyId: () => number | undefined
  resetTypeRelatedFields: () => void
}
