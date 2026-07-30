import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetCmsParams, CmsList } from "@shared-lib/api/commonTypes/cmsTypes"

export type GetCmsListParamsType = GetCmsParams
export type GetCmsListRequestType = GetCmsParams
export type GetCmsListResponseType = CmsList

export const getCmsList = (params: GetCmsListParamsType) => {
  return requestFn<GetCmsListRequestType, GetCmsListResponseType>(ENDPOINT_PATHS.CMS.LIST, params, {
    name: "getCmsList",
    method: "get"
  })
}
