import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface AddDomainParamsType {
  title: string
  name: string
}

export type AddDomainRequestType = AddDomainParamsType

export const addDomain = (params: AddDomainRequestType) => {
  return requestFn<AddDomainRequestType, EmptyType>(ENDPOINT_PATHS.DOMAIN.LIST, params, {
    name: "addDomain",
    method: "post"
  })
}
