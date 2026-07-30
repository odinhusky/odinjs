import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { LANGUAGE_TYPE_ENUMS } from "@shared-lib/constants/enums/languageType"

export type CmsFloatIcon = {
  language: LANGUAGE_TYPE_ENUMS
  storage_key: string
}

export type GetCmsFloatIconResponseType = {
  list: CmsFloatIcon[]
}

export const getFloatIcon = (type: string) => {
  return requestFn<EmptyType, GetCmsFloatIconResponseType>(`${ENDPOINT_PATHS.CMS.FLOAT_ICON}/${type}`, null, {
    name: "getFloatIcon",
    method: "get"
  })
}
