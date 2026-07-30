import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface UpdateReferralSettingParamTypes {
  member_id: number
  currency_limit: {
    [key: string]: number
  }
}

export type UpdateReferralSettingRequestTypes = UpdateReferralSettingParamTypes

export const putReferralSetting = (params: UpdateReferralSettingParamTypes) => {
  return requestFn<UpdateReferralSettingRequestTypes, EmptyType>(
    `${ENDPOINT_PATHS.REFERRAL.SETTING}/${params.member_id}`,
    params,
    {
      name: "putReferralSetting",
      method: "put"
    }
  )
}
