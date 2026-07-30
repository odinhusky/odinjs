import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ShareholderCurrencyBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"

export type GetLatestParamsType = ShareholderCurrencyBaseParamsType
export type GetLatestRequestType = ShareholderCurrencyBaseParamsType

export interface GetLatestResponseType {
  downline_valid_bet: string // 下級總投注
  commission: string // 佣金
}

// 取得最新一期
export const getLatest = (params: GetLatestParamsType) => {
  return requestFn<GetLatestRequestType, GetLatestResponseType>(ENDPOINT_PATHS.SHAREHOLDER.LATEST, params, {
    name: "getShareholderLatest",
    method: "get"
  })
}
