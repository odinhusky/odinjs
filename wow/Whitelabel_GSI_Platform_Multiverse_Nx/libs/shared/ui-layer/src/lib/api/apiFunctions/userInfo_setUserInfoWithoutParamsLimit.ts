import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { UserInfoBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"

export interface SetUserInfoWithoutParamsLimitParamsType {
  [key: string]: any
  self_exclusion_at: number | null
}

export type SetUserInfoWithoutParamsLimitRequestType = UserInfoBaseParamsType

// !! 注意：此 function 傳入的 Params 以及 Request 的參數不相同，且與 setUserInfo 、setUserInfoWithoutHandleImg 為相同的 API 路徑

// 對應原本的名稱為 setAccountInfo
export const setUserInfoWithoutParamsLimit = (params: SetUserInfoWithoutParamsLimitParamsType) => {
  const formData = JSON.parse(JSON.stringify(params))
  formData.gender = Number(formData.gender)

  return requestFn<SetUserInfoWithoutParamsLimitRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.SET_USER_INFO,
    formData,
    {
      name: "setUserInfoWithoutParamsLimit",
      method: "put"
    }
  )
}
