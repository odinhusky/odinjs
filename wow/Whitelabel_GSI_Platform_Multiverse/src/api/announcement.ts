import { requestApi } from "src/common/utils/request"
import * as Response from "./response.type"

export interface GetAnnouncementListParams {
  start_time_from?: string
  start_time_to?: string
  keyword?: string
  offset?: number
  size?: number
}

function normalizeGetAnnouncementListParams(params?: GetAnnouncementListParams) {
  if (!params) return undefined

  return {
    start_time_from: params.start_time_from || undefined,
    start_time_to: params.start_time_to || undefined,
    keyword: params.keyword?.trim() || undefined,
    offset: typeof params.offset === "number" ? Math.max(0, params.offset) : undefined,
    size: typeof params.size === "number" ? Math.min(100, Math.max(0, params.size)) : undefined
  }
}

export const getAnnouncementList = (params?: GetAnnouncementListParams) => {
  const normalizedParams = normalizeGetAnnouncementListParams(params)

  return requestApi<
    GetAnnouncementListParams | undefined,
    Response.AnnouncementListResponse | Response.AnnouncementList
  >("/v1/player/announcement/list", normalizedParams, {
    name: "getAnnouncementList",
    method: "get"
  })
}
