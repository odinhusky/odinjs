import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { GetRankListRequestType, RankResponseList } from "@shared-lib/api/commonTypes/rankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetLatestWinListParamsType = GetRankListRequestType
export type GetLatestWinListRequestType = GetRankListRequestType
export type GetLatestWinListResponseType = RankResponseList

export const getLatestWinList = (params: GetLatestWinListParamsType) => {
  return requestFn<GetLatestWinListRequestType, GetLatestWinListResponseType>(
    ENDPOINT_PATHS.RANK.LATEST_WIN_LIST,
    params,
    {
      name: "getLatestWinList",
      method: "get"
    }
  )
}
