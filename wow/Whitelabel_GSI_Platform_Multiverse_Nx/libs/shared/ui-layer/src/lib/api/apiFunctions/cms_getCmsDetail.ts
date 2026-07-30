import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { EmptyType } from "@shared-lib/api/commonTypes"

export type GetCmsDetailResponseType = CmsItem

export const getCmsDetail = (id: number) => {
  return requestFn<EmptyType, GetCmsDetailResponseType>(`${ENDPOINT_PATHS.CMS.DETAIL}/${id}`, null, {
    name: "getCmsDetail",
    method: "get"
  })
}
