import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PasswordBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"

export type SetUserWithdrawalPasswordParamsType = PasswordBaseParamsType
export type SetUserWithdrawalPasswordRequestType = PasswordBaseParamsType

export const setUserWithdrawalPassword = (params: SetUserWithdrawalPasswordParamsType) => {
  return requestFn<SetUserWithdrawalPasswordRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.USER_WITHDRAW_PASSWORD,
    params,
    {
      name: "setUserWithdrawalPassword",
      method: "put"
    }
  )
}
