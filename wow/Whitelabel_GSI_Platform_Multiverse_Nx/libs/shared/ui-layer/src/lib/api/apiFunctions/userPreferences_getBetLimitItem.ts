import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetBetLimitItemParamsType {
  id: string
  now_time: number
}

export type GetBetLimitItemRequestType = GetBetLimitItemParamsType

export interface GetBetLimitItemResponseType {
  id: number
  setting_id: number
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: string
  amount: string
}

export const getBetLimitItem = (params: GetBetLimitItemParamsType) => {
  return requestFn<GetBetLimitItemRequestType, GetBetLimitItemResponseType>(
    `${ENDPOINT_PATHS.USER_PREFERENCES.BET_LIMIT_STATUS}/${params.id}`,
    params,
    {
      name: "getBetLimitItem",
      method: "get"
    }
  )
}
