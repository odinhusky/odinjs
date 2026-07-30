import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { LoginResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface MayaLoginParamsType {
  session_id: string
}

export type MayaLoginRequestType = MayaLoginParamsType
export type MayaLoginResponseType = LoginResponseType

export const mayaLogin = (params: MayaLoginParamsType) => {
  return requestFn<MayaLoginParamsType, MayaLoginResponseType>(ENDPOINT_PATHS.AUTH.MAYA_LOGIN, params, {
    name: "mayaLogin",
    method: "post"
  })
}
