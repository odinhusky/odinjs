import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type { PayoutSettingPayload } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"

export interface PutPayoutSettingsParamsType {
  id: number
  name?: string
  ewallet_provider_id?: number
  payload?: PayoutSettingPayload
}

export interface PutPayoutSettingsRequestType {
  name?: string
  ewallet_provider_id?: number
  payload?: PayoutSettingPayload
}

export const putPayoutSettings = (params: PutPayoutSettingsParamsType) => {
  const { id, ...requestData } = params

  return requestFn<PutPayoutSettingsRequestType, EmptyType>(
    ENDPOINT_PATHS.BANK.PAYOUT_SETTING_DETAIL({ id }),
    requestData,
    {
      name: "putPayoutSettings",
      method: "put"
    }
  )
}
