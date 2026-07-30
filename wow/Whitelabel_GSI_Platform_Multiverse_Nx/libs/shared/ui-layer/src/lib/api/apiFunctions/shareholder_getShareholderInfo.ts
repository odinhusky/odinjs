import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ShareholderInfoResponseItem {
  language: string //語系
  description_page: string // html
}

export interface GetShareholderInfoListResponseType {
  list: ShareholderInfoResponseItem[]
}

export const getShareholderInfo = () => {
  return requestFn<EmptyType, GetShareholderInfoListResponseType>(ENDPOINT_PATHS.SHAREHOLDER.INFO, null, {
    name: "getShareholderInfo",
    method: "get"
  })
}
