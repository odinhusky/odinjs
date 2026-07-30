import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ReferralSetting } from "@shared-lib/api/commonTypes/referralTypes"

export type GetReferralSettingDetailResponseType = ReferralSettingDetail

export const getReferralSettingDetail = (member_id: number) => {
  return requestFn<EmptyType, GetReferralSettingDetailResponseType>(
    `${ENDPOINT_PATHS.REFERRAL.SETTING}/${member_id}`,
    null,
    {
      name: "getReferralSettingDetail",
      method: "get"
    }
  )
}
