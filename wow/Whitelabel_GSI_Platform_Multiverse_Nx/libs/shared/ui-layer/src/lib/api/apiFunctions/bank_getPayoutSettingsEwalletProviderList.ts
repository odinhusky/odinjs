import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface EwalletProvider {
  id?: number
  code?: string
  name?: string
  status?: 0 | 1
  created_at?: string
  updated_at?: string
}

export type GetPayoutSettingsEwalletProviderListRequestType = EmptyType
export type GetPayoutSettingsEwalletProviderListResponseType = EwalletProvider[]

export const getPayoutSettingsEwalletProviderList = () => {
  return requestFn<GetPayoutSettingsEwalletProviderListRequestType, GetPayoutSettingsEwalletProviderListResponseType>(
    ENDPOINT_PATHS.BANK.PAYOUT_SETTINGS_EWALLET_PROVIDER,
    null,
    {
      name: "getPayoutSettingsEwalletProviderList",
      method: "get"
    }
  )
}
