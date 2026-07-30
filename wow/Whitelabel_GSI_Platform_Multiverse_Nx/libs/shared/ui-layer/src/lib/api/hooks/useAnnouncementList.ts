import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "../types"
import {
  getAnnouncementList,
  normalizeAnnouncementListParams,
  normalizeAnnouncementListResponse,
  type GetAnnouncementListParamsType,
  type GetAnnouncementListResponseType,
  type NormalizedAnnouncementListResponseType
} from "../apiFunctions/announcement_getAnnouncementList"
import { TANSTACK_QUERY_KEY_ANNOUNCEMENT_LIST } from "../../constants/tanstackQueryKeys"
import { useApiQuery } from "../useApiQuery"

function useAnnouncementListQuery({
  params,
  options = {}
}: {
  params: GetAnnouncementListParamsType
  options?: Omit<
    UseQueryOptions<any, Error, NormalizedAnnouncementListResponseType, any[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<NormalizedAnnouncementListResponseType, Error> {
  const normalizedParams = normalizeAnnouncementListParams(params)

  return useApiQuery<typeof getAnnouncementList, GetAnnouncementListResponseType, NormalizedAnnouncementListResponseType>(
    [TANSTACK_QUERY_KEY_ANNOUNCEMENT_LIST, normalizedParams],
    getAnnouncementList,
    normalizedParams,
    {
      enabled: false,
      select: (response: ApiResponse<GetAnnouncementListResponseType>): NormalizedAnnouncementListResponseType => {
        return normalizeAnnouncementListResponse(response.data, normalizedParams)
      },
      ...options
    }
  )
}

export interface UseAnnouncementListParams {
  params?: GetAnnouncementListParamsType
  options?: Omit<
    UseQueryOptions<any, Error, NormalizedAnnouncementListResponseType, any[]>,
    "queryKey" | "queryFn"
  >
}

export function useAnnouncementList({ params = {}, options }: UseAnnouncementListParams = {}) {
  const {
    data: announcementList,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useAnnouncementListQuery({ params, options })

  return {
    announcementList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
