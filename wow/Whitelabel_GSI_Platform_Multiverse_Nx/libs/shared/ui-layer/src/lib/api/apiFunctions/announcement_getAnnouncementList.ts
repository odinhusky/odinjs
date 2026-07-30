import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ANNOUNCEMENT_MEMBER_TYPE_ENUMS } from "@shared-lib/constants/enums/announcementMemberType"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { TimeStringType } from "@shared-lib/api/commonTypes"

export type AnnouncementItem = {
  title: string
  content: string
  image_path: string
}

export interface AnnouncementItemDetailType {
  id: number
  type: ANNOUNCEMENT_MEMBER_TYPE_ENUMS
  start_time: TimeStringType
  end_time: TimeStringType
  detail: Record<string, AnnouncementItem>
  display_options: ANNOUNCEMENT_DISPLAY_TYPE_ENUMS[]
  langDetail?: AnnouncementItem
}

export type GetAnnouncementListParamsType = {
  start_time_from?: string
  start_time_to?: string
  keyword?: string
  offset?: number
  size?: number
}

export type AnnouncementListPagination = {
  offset: number
  size: number
  total: number
}

export type NormalizedAnnouncementListResponseType = {
  list: Announcement[]
  pagination: AnnouncementListPagination
}

export type GetAnnouncementListResponseType = NormalizedAnnouncementListResponseType | Announcement[]

const clampNumber = (value: number | undefined, min: number, max?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined
  const minClamped = Math.max(value, min)
  return typeof max === "number" ? Math.min(minClamped, max) : minClamped
}

export const normalizeAnnouncementListParams = (
  params: GetAnnouncementListParamsType = {}
): GetAnnouncementListParamsType => {
  const keyword = params.keyword?.trim()

  return {
    start_time_from: params.start_time_from || undefined,
    start_time_to: params.start_time_to || undefined,
    keyword: keyword || undefined,
    offset: clampNumber(params.offset, 0),
    size: clampNumber(params.size, 0, 100)
  }
}

export const normalizeAnnouncementListResponse = (
  response: GetAnnouncementListResponseType | null | undefined,
  params: GetAnnouncementListParamsType = {}
): NormalizedAnnouncementListResponseType => {
  if (Array.isArray(response)) {
    return {
      list: response,
      pagination: {
        offset: params.offset ?? 0,
        size: params.size ?? response.length,
        total: response.length
      }
    }
  }

  return {
    list: response?.list ?? [],
    pagination: {
      offset: response?.pagination?.offset ?? params.offset ?? 0,
      size: response?.pagination?.size ?? params.size ?? response?.list?.length ?? 0,
      total: response?.pagination?.total ?? response?.list?.length ?? 0
    }
  }
}

export const getAnnouncementList = (params: GetAnnouncementListParamsType = {}) => {
  return requestFn<GetAnnouncementListParamsType, GetAnnouncementListResponseType>(
    ENDPOINT_PATHS.ANNOUNCEMENT.LIST,
    normalizeAnnouncementListParams(params),
    {
      name: "getAnnouncementList",
      method: "get"
    }
  )
}
