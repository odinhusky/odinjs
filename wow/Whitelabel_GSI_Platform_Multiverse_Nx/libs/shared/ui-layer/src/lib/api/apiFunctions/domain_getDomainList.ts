import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { Pagination } from "@shared-lib/api/commonTypes"
import { DOMAIN_TYPE_ENUMS } from "@shared-lib/constants/enums/domainType"

export interface GetDomainListParamsType {
  offset: number
  size: number
}

export type GetDomainListRequestType = GetDomainListParamsType

export interface DomainItem {
  id: number
  title: string
  name: string
  status: DOMAIN_TYPE_ENUMS
  detail: string
  created_at: string
  expired_at: string
}

export interface GetDomainListResponseType {
  list: DomainItem[]
  pagination: Pagination & { page: number }
  direct_domain: string
}

export const getDomainList = (params: GetDomainListParamsType) => {
  return requestFn<GetDomainListRequestType, GetDomainListResponseType>(ENDPOINT_PATHS.DOMAIN.LIST, params, {
    name: "getDomainList",
    method: "get"
  })
}
