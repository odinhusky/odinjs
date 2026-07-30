import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import { requestApi, requestApiFullResponse } from "src/common/utils/request"

import * as Response from "./response.type"

export const getCmsAllFull = (): Promise<ApiResponse<Response.CmsAllData>> => {
  return requestApiFullResponse<null, Response.CmsAllData>("/v1/player/cms/all", null, {
    name: "getCmsAll",
    method: "get",
  })
}

export const getCmsDetail = (id: number) => {
  return requestApi<null, Response.CmsItem>(`/v1/player/cms/detail/${id}`, null, {
    name: "getCmsDetail",
    method: "get",
  })
}

export const getCmsDetailFull = (id: number): Promise<ApiResponse<Response.CmsItem>> => {
  return requestApiFullResponse<null, Response.CmsItem>(`/v1/player/cms/detail/${id}`, null, {
    name: "getCmsDetail",
    method: "get",
  })
}

export const getFloatIcon = (type: string) => {
  return requestApi<null, Response.CmsFlotIconListPayload>(
    `/platform/v1/player/cms/features/floating-icon/${type}`,
    null,
    {
      name: "getFloatIcon",
      method: "get",
    }
  )
}
