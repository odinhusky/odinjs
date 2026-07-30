import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface UserLevelResponseItem {
  id: number
  quota: number
  img: string
  lang: string
  updated_time: string
  remark: string
}

export type UserLevelsResponseList = UserLevelResponseItem[]
export type GetLevelsInfoResponseType = UserLevelsResponseList

export const getLevelsInfo = () => {
  return requestFn<null, GetLevelsInfoResponseType>(ENDPOINT_PATHS.USER_INFO.LEVEL_INFO, null, {
    name: "getLevelsInfo",
    method: "get"
  })
}
