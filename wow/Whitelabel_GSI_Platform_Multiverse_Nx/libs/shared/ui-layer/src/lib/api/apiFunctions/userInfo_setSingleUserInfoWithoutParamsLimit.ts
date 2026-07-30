import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { UserInfoBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"

export interface SetSingleUserInfoWithoutParamsLimitParamsType {
  [key: string]: any
  single: boolean
  self_exclusion_at?: number | null
}

export type SetSingleUserInfoWithoutParamsLimitRequestType = UserInfoBaseParamsType

// !! 注意：此 function 傳入的 Params 以及 Request 的參數不完全相同，且與 setUserInfo 、 setUserInfoWithoutHandleImg 、 setUserInfoWithoutParamsLimit 為相同的 API 路徑

// 對應到原本的 function 名稱為 setSingleAccountInfo

export const setSingleUserInfoWithoutParamsLimit = (params: SetSingleUserInfoWithoutParamsLimitParamsType) => {
  const formData = JSON.parse(JSON.stringify(params))

  return requestFn<SetSingleUserInfoWithoutParamsLimitRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.SET_USER_INFO,
    formData,
    {
      name: "setSingleUserInfoWithoutParamsLimit",
      method: "put"
    }
  )
}
