import { getCmsAllFull } from "src/api/cms"
import type * as Response from "src/api/response.type"
import { flattenCmsAllToRows } from "src/common/apiHooks/cms/processCmsListFromAll"
import { useApiQuery } from "src/common/apiHooks/useApiQuery"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import { QUERY_KEY } from "src/common/utils/constants/queryKeys"
import type { UseQueryOptions } from "@tanstack/vue-query"

type CmsAllFlatQueryOptions = Omit<
  UseQueryOptions<ApiResponse<Response.CmsAllData>, Error, Response.CmsAllFlatRow[]>,
  "queryKey" | "queryFn"
>

/**
 * GET /v1/player/cms/all
 * vue-query 層只做扁平化（object map → `CmsAllFlatRow[]`，含 `cmsType`）；不含圖片／裝置等業務轉換。
 */
export function useCmsAllFlatQuery(options: CmsAllFlatQueryOptions = {}) {
  return useApiQuery<typeof getCmsAllFull, Response.CmsAllFlatRow[]>(
    [QUERY_KEY.CMS_LIST],
    getCmsAllFull,
    undefined,
    {
      /** `/cms/all` 5 分鐘內視為新鮮，不重複請求 */
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      meta: {
        persist: false
      },

      select: (response: ApiResponse<Response.CmsAllData>): Response.CmsAllFlatRow[] => {
        if (!response.data) {
          console.warn("[useCmsAllFlatQuery] API returned status ok but no data.")
          return []
        }
        return flattenCmsAllToRows(response.data)
      },

      ...options
    }
  )
}
