import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface GetMayaLoginInfoResponseType {
  AgentID: number
  MemberID: number
  Platform: number
  AuthorizeDomainUrl: string
  RedirectURI: string
  IsNeedLogin: boolean
}

// 取得maya連結資訊
export const getMayaLoginInfo = (params: string) => {
  return requestFn<EmptyType, GetMayaLoginInfoResponseType>(
    `${ENDPOINT_PATHS.BANK.MAYA_LOGIN_INFO}?payment_gateway_name=${params}`,
    null,
    {
      name: "getMayaLoginInfo",
      method: "get"
    }
  )
}
