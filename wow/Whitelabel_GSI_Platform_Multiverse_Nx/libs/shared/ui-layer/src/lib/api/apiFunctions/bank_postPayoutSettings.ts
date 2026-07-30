import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import type {
  PayoutSettingMethodType,
  PayoutSettingPayload
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"

export interface PostPayoutSettingsParamsType {
  payout_method_id: number
  name: string
  method_type: PayoutSettingMethodType
  ewallet_provider_id?: number
  payload: PayoutSettingPayload
}

export type PostPayoutSettingsRequestType = PostPayoutSettingsParamsType

export const postPayoutSettings = (params: PostPayoutSettingsParamsType) => {
  return requestFn<PostPayoutSettingsRequestType, EmptyType>(ENDPOINT_PATHS.BANK.PAYOUT_SETTINGS, params, {
    name: "postPayoutSettings",
    method: "post"
  })
}
