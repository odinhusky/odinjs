import { useQuery } from "@tanstack/vue-query"
import { getCmsDetail } from "@shared-lib/api/apiFunctions/cms_getCmsDetail"
import type { CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import {
  TANSTACK_QUERY_KEY_CMS_DETAIL,
  TANSTACK_QUERY_KEY_CMS_SPECIFIC_DETAIL
} from "@shared-lib/constants/tanstackQueryKeys"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"

/**
 * CMS 自定義頁面詳情 Query Hook
 *
 * 直接以 useQuery 呼叫 getCmsDetail(id)，避免透過 useApiQuery 傳遞 primitive 造成的問題。
 * API 回傳的 Entrance 列表中，每筆 entrance.type 為 CMS_PAGE_COMPONENT_TYPE_ENUMS
 * (101~107: SLIDER / TEXT / IMAGE / GAME_ENTRANCE / ANNOUNCEMENT / LEADERBOARD / NAVBAR)
 *
 * @param cmsCustomPageId  後台 CMS 自定義頁面 ID（必須為 number）
 */
export function useCmsDetailQuery(cmsCustomPageId: number) {
  const id = Number(cmsCustomPageId)

  return useQuery({
    queryKey: [TANSTACK_QUERY_KEY_CMS_DETAIL, TANSTACK_QUERY_KEY_CMS_SPECIFIC_DETAIL(id)],
    queryFn: async (): Promise<CmsItem | null> => {
      const res = await getCmsDetail(id)
      if (!res.status) return null
      return res.data ?? null
    },
    staleTime: FIVE_MINUTES
  })
}
