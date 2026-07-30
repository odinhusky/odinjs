import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { GetBetLimitResponseList } from "@shared-lib/api/commonTypes/userPreferencesTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetBetLimitListStatusParamsType {
  currency_id: number
  now_time: number
}

export type GetBetLimitListStatusRequestType = GetBetLimitListStatusParamsType

export type GetBetLimitListStatusResponseType = GetBetLimitResponseList

//#region 投注限額
export const getBetLimitListStatus = (params: GetBetLimitListStatusParamsType) => {
  return requestFn<GetBetLimitListStatusRequestType, GetBetLimitListStatusResponseType>(
    ENDPOINT_PATHS.USER_PREFERENCES.BET_LIMIT_STATUS,
    params,
    {
      name: "getBetLimitListStatus",
      method: "get"
    }
  )
}
