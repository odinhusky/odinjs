import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { LOGO_TYPE_ENUMS } from "@shared-lib/constants/enums/logoType"

export interface LogoItem {
  id: number
  agent_id: number
  logo_type: LOGO_TYPE_ENUMS
  path: string
  updated_time: number
}

export type LogoList = LogoItem[]

export type GetLogoListResponseType = LogoList

export const getLogoList = () => {
  return requestFn<EmptyType, GetLogoListResponseType>(ENDPOINT_PATHS.SITE.LOGO_LIST, null, {
    name: "getLogoList",
    method: "get"
  })
}
