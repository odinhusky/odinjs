import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetSiteResponseType {
  title: string
}

export const getSite = () => {
  return requestFn<EmptyType, GetSiteResponseType>(ENDPOINT_PATHS.SITE.GET_SITE, null, {
    name: "getSite",
    method: "get"
  })
}
