import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { GetRankListRequestType, RankResponseList } from "@shared-lib/api/commonTypes/rankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetLatestBetListParamsType = GetRankListRequestType
export type GetLatestBetListRequestType = GetRankListRequestType
export type GetLatestBetListResponseType = RankResponseList

export const getLatestBetList = (params: GetLatestBetListParamsType) => {
  return requestFn<GetLatestBetListRequestType, GetLatestBetListResponseType>(
    ENDPOINT_PATHS.RANK.LATEST_BET_LIST,
    params,
    {
      name: "getLatestBetList",
      method: "get"
    }
  )
}
