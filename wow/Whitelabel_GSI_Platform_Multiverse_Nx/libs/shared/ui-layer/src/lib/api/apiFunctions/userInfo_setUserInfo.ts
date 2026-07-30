import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { UserInfoBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"

export type SetUserInfoParamsType = UserInfoBaseParamsType
export type SetUserInfoRequestType = UserInfoBaseParamsType

export const setUserInfo = (params: SetUserInfoParamsType) => {
  const formData = JSON.parse(JSON.stringify(params))
  formData.gender = Number(formData.gender)

  if (formData.img === "") {
    delete formData.img
  }

  return requestFn<SetUserInfoRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.SET_USER_INFO, formData, {
    name: "setUserInfo",
    method: "put"
  })
}
