import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ApplyInterestActivityParamsDataType {
  activity_id: number
  principal: string
}

export type ApplyInterestActivityRequestType = ApplyInterestActivityParamsDataType

//申請參加活動
export const applyInterestActivity = (data: ApplyInterestActivityRequestType) => {
  return requestFn<ApplyInterestActivityRequestType, object>(
    ENDPOINT_PATHS.INTEREST.APPLY_ACTIVITY,

    data,
    {
      name: "applyInterestActivity",
      method: "post",
      needToken: true
    }
  )
}
