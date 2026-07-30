import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ApplyInterestActivityRedemptionParamsDataType {
  application_id: number
}

export type ApplyInterestActivityRedemptionRequestType = ApplyInterestActivityRedemptionParamsDataType

//申請領回活動
export const applyInterestActivityRedemption = (data: ApplyInterestActivityRedemptionRequestType) => {
  return requestFn<ApplyInterestActivityRedemptionRequestType, object>(
    ENDPOINT_PATHS.INTEREST.APPLY_ACTIVITY_REDEMPTION,
    data,
    {
      name: "applyInterestActivityRedemption",
      method: "post",
      needToken: true
    }
  )
}
