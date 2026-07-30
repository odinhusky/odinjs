import { getCmsList, type GetCmsListResponseType } from "@shared-lib/api/apiFunctions/cms_getCmsList"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { TANSTACK_QUERY_KEY_CMS_LIST, TANSTACK_QUERY_KEY_CMS_SPECIFIC_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import type { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import type { UseQueryReturnType, UseQueryOptions } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import type { ApiResponse } from "@shared-lib/api/types"

type CmsListQueryOptions = Omit<UseQueryOptions<any, Error, GetCmsListResponseType, any[]>, "queryKey" | "queryFn">

interface UseCmsListQueryParams {
  type: CMS_TYPE_ENUMS
  options?: CmsListQueryOptions
}

export function useCmsListQuery({
  type,
  options = {}
}: UseCmsListQueryParams): UseQueryReturnType<GetCmsListResponseType, Error> {
  return useApiQuery<typeof getCmsList, GetCmsListResponseType>(
    [TANSTACK_QUERY_KEY_CMS_LIST, TANSTACK_QUERY_KEY_CMS_SPECIFIC_LIST(type)],
    getCmsList,
    { type },
    {
      staleTime: FIVE_MINUTES,
      select: (response: ApiResponse<GetCmsListResponseType>): GetCmsListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}
