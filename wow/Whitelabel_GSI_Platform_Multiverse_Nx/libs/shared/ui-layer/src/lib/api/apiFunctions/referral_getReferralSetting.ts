import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetReferralSettingBase, ReferralSetting } from "@shared-lib/api/commonTypes/referralTypes"

export type GetReferralSettingParamTypes = GetReferralSettingBase
export type GetReferralSettingRequestTypes = GetReferralSettingBase

export type GetReferralSettingResponseType = ReferralSetting

export const getReferralSetting = (params: GetReferralSettingParamTypes) => {
  return requestFn<GetReferralSettingRequestTypes, GetReferralSettingResponseType>(
    ENDPOINT_PATHS.REFERRAL.SETTING,
    params,
    {
      name: "getReferralSetting",
      method: "get"
    }
  )
}
