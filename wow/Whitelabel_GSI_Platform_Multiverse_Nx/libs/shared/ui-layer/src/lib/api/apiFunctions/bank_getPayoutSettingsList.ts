import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type PayoutSettingMethodType = 1 | 2 | 3

export interface GetPayoutSettingsListParamsType {
  method_type: PayoutSettingMethodType
}

export interface PayoutSettingPayload {
  account_name?: string
  account_number?: string
  bank_id?: number
  bank_name?: string
  chain?: string
  crypto_id?: number
  wallet_address?: string
}

export interface PayoutSettingItem {
  id?: number
  member_id?: number
  payout_method_id?: number
  name?: string
  method_type?: PayoutSettingMethodType
  ewallet_provider_id?: number
  payload?: PayoutSettingPayload
  created_at?: string
  updated_at?: string
}

export interface GetPayoutSettingsListResponseType {
  list: PayoutSettingItem[]
}

export type GetPayoutSettingsListRequestType = GetPayoutSettingsListParamsType

export const getPayoutSettingsList = (params: GetPayoutSettingsListParamsType) => {
  return requestFn<GetPayoutSettingsListRequestType, GetPayoutSettingsListResponseType>(
    ENDPOINT_PATHS.BANK.PAYOUT_SETTINGS,
    params,
    {
      name: "getPayoutSettingsList",
      method: "get"
    }
  )
}
