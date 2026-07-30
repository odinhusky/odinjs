import {
  getBannerList,
  GetBannerListRequestType,
  GetBannerListResponseType
} from "@shared-lib/api/apiFunctions/banner_getBannerList"
import { BANNER_POSITION_ENUMS } from "@shared-lib/constants/enums/bannerPosition"
import { Enums as ERROR_CODE } from "@shared-lib/constants/enums/errorCodeTypes"

import { useApiQuery } from "@shared-lib/api/useApiQuery" // 你的泛用 hook
import type { UseQueryReturnType, UseQueryOptions } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { TANSTACK_QUERY_KEY_BANNER_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"

declare global {
  interface Window {
    __BANNER_PRELOAD__?: Promise<unknown>
  }
}

const PRELOAD_FALLBACK_TIMEOUT_MS = 10000

const isHomeBannerRequest = (params?: GetBannerListRequestType): boolean =>
  Number(params?.position) === BANNER_POSITION_ENUMS.HOME

const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T | null> =>
  Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, ms)
    })
  ])

const normalizePreloadResponse = (response: unknown): ApiResponse<GetBannerListResponseType> | undefined => {
  if (!response || typeof response !== "object") return undefined

  const apiResponse = response as Partial<ApiResponse<GetBannerListResponseType>>
  const code = Number(apiResponse.code)
  const isSuccess = apiResponse.status === true || code === ERROR_CODE.SUCCESS

  if (!isSuccess || !Array.isArray(apiResponse.data)) return undefined

  return {
    status: true,
    code,
    msg: apiResponse.msg,
    excode: apiResponse.excode,
    data: apiResponse.data
  }
}

const getBannerListWithPreload = async (params: GetBannerListRequestType) => {
  const preload = typeof window !== "undefined" && isHomeBannerRequest(params) ? window.__BANNER_PRELOAD__ : undefined

  if (preload) {
    try {
      const preloadedResponse = normalizePreloadResponse(await withTimeout(preload, PRELOAD_FALLBACK_TIMEOUT_MS))
      if (preloadedResponse) return preloadedResponse
    } catch {
      // Fall back to the normal API path below.
    }
  }

  return getBannerList(params)
}

/**
 * 宣告式的 Hook，專門用於取得 Banner 列表
 *
 * @param options - 傳遞給 useApiQuery 的選項
 */
function useGetBannerListQuery({
  params,
  options = {}
}: {
  params: GetBannerListRequestType
  options?: Omit<UseQueryOptions<any, Error, GetBannerListResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetBannerListResponseType, Error> {
  const query = useApiQuery<
    typeof getBannerListWithPreload,
    GetBannerListResponseType // 明確指定 select 轉換後的型別
  >(
    [TANSTACK_QUERY_KEY_BANNER_LIST, params.position], // TQV Query Key
    getBannerListWithPreload, // API 函數
    params, // API 參數
    {
      staleTime: FIVE_MINUTES,

      // 在這裡加入預設持久化設定
      // meta: {
      //   persist: true
      // },

      // 使用 select 將 API response 轉換成乾淨的 currencies 陣列
      select: (response: ApiResponse<GetBannerListResponseType>): GetBannerListResponseType => {
        return response.data ?? []
      },

      ...options
    }
  )

  return query
}

export interface UseBannerParams {
  params?: GetBannerListRequestType
}

export function useBanner({ params = { position: BANNER_POSITION_ENUMS.ALL } }: UseBannerParams = {}) {
  const { data: bannerList, isLoading, isError, refetch } = useGetBannerListQuery({ params })

  return {
    bannerList,
    isLoading,
    isError,
    refetch
  }
}
