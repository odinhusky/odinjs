import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetUserStatisticsResponseType = UserStatistics

export const getUserStatistics = (currency_id: number) => {
  return requestFn<EmptyType, GetUserStatisticsResponseType>(
    `${ENDPOINT_PATHS.VIP.USER_STATISTIC}/${currency_id}`,
    null,
    {
      name: "getUserStatistics",
      method: "get"
    }
  )
}
