import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseList, EmptyType } from "@shared-lib/api/commonTypes"
import { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UserStatisticsList = UserStatistics[]
export type GetMultiUserStatisticsResponseType = BaseList<UserStatistics>

export const getMultiUserStatistics = () => {
  return requestFn<EmptyType, GetMultiUserStatisticsResponseType>(ENDPOINT_PATHS.VIP.USER_STATISTIC, null, {
    name: "getMultiUserStatistics",
    method: "get"
  })
}
