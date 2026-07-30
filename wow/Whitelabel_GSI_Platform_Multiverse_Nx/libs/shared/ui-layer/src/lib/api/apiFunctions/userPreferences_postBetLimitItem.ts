import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PostBetLimitItemParamsType {
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: number
}

export type PostBetLimitItemRequestType = PostBetLimitItemParamsType

export const postBetLimitItem = (params: PostBetLimitItemParamsType) => {
  return requestFn<PostBetLimitItemRequestType, EmptyType>(ENDPOINT_PATHS.USER_PREFERENCES.BET_LIMIT_STATUS, params, {
    name: "postBetLimitItem",
    method: "post"
  })
}
