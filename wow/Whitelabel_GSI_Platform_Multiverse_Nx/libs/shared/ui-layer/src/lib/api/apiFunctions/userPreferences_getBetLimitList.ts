import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetBetLimitResponseList } from "@shared-lib/api/commonTypes/userPreferencesTypes"
import { BaseList } from "@shared-lib/api/commonTypes"

export interface GetBetLimitListParamsType {
  size: number
  offset: number
}

export type GetBetLimitListRequestType = GetBetLimitListParamsType
export type GetBetLimitListResponseType = BaseList<GetBetLimitResponseList>

export const getBetLimitList = (params: GetBetLimitListParamsType) => {
  return requestFn<GetBetLimitListRequestType, GetBetLimitListResponseType>(
    ENDPOINT_PATHS.USER_PREFERENCES.BET_LIMIT_STATUS_LIST,
    params,
    {
      name: "getBetLimitList",
      method: "get"
    }
  )
}
