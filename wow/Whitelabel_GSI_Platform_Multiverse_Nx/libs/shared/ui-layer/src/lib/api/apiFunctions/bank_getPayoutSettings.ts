import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type { PayoutSettingItem } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"

export interface GetPayoutSettingsParamsType {
  id: number
}

export type GetPayoutSettingsRequestType = EmptyType
export type GetPayoutSettingsResponseType = PayoutSettingItem

export const getPayoutSettings = (params: GetPayoutSettingsParamsType) => {
  return requestFn<GetPayoutSettingsRequestType, GetPayoutSettingsResponseType>(
    ENDPOINT_PATHS.BANK.PAYOUT_SETTING_DETAIL({ id: params.id }),
    null,
    {
      name: "getPayoutSettings",
      method: "get"
    }
  )
}
